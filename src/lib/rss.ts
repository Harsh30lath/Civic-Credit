import type { Feed } from '@/lib/feeds'

export type Article = {
  id: string
  title: string
  link: string
  summary: string
  image?: string
  source: string
  publishedAt: Date | null
}

export type FeedResult = {
  articles: Article[]
  failed: Feed[]
}

const CACHE_TTL_MS = 5 * 60 * 1000
const cache = new Map<string, { at: number; articles: Article[] }>()

function text(item: Element, tag: string) {
  return item.getElementsByTagName(tag)[0]?.textContent?.trim() ?? ''
}

function attr(item: Element, tag: string, name: string) {
  return item.getElementsByTagName(tag)[0]?.getAttribute(name) ?? undefined
}

// Descriptions are sometimes HTML; reduce them to plain text and pull out
// an inline <img> if the feed has no dedicated media tag.
function parseDescription(raw: string) {
  const doc = new DOMParser().parseFromString(raw, 'text/html')
  const image = doc.querySelector('img')?.getAttribute('src') ?? undefined
  const summary = (doc.body.textContent ?? '').replace(/\s+/g, ' ').trim()
  return { summary, image }
}

function parseFeed(xml: string, feed: Feed): Article[] {
  const doc = new DOMParser().parseFromString(xml, 'text/xml')
  if (doc.getElementsByTagName('parsererror').length) {
    throw new Error(`Invalid XML from ${feed.id}`)
  }

  return Array.from(doc.getElementsByTagName('item')).map((item) => {
    const link = text(item, 'link')
    const { summary, image: inlineImage } = parseDescription(text(item, 'description'))
    const date = new Date(text(item, 'pubDate'))
    return {
      id: text(item, 'guid') || link,
      title: text(item, 'title'),
      link,
      summary,
      image:
        attr(item, 'media:content', 'url') ??
        attr(item, 'media:thumbnail', 'url') ??
        attr(item, 'enclosure', 'url') ??
        inlineImage,
      source: feed.source,
      publishedAt: Number.isNaN(date.getTime()) ? null : date,
    }
  })
}

async function fetchFeed(feed: Feed, signal: AbortSignal, force: boolean) {
  const cached = cache.get(feed.url)
  if (!force && cached && Date.now() - cached.at < CACHE_TTL_MS) {
    return cached.articles
  }
  const res = await fetch(feed.url, { signal })
  if (!res.ok) throw new Error(`${feed.id}: HTTP ${res.status}`)
  const articles = parseFeed(await res.text(), feed)
  cache.set(feed.url, { at: Date.now(), articles })
  return articles
}

export async function loadFeeds(feeds: Feed[], signal: AbortSignal, force = false): Promise<FeedResult> {
  const results = await Promise.allSettled(feeds.map((f) => fetchFeed(f, signal, force)))

  const seen = new Set<string>()
  const articles: Article[] = []
  const failed: Feed[] = []
  results.forEach((result, i) => {
    if (result.status === 'rejected') {
      failed.push(feeds[i])
      return
    }
    for (const article of result.value) {
      const key = article.link || article.title
      if (!article.title || seen.has(key)) continue
      seen.add(key)
      articles.push(article)
    }
  })

  articles.sort((a, b) => (b.publishedAt?.getTime() ?? 0) - (a.publishedAt?.getTime() ?? 0))
  return { articles, failed }
}
