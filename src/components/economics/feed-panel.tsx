import { useMemo, useState } from 'react'
import { AlertTriangle, RefreshCw, Search } from 'lucide-react'

import { NewsCard, NewsCardSkeleton } from '@/components/news-card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useFeeds } from '@/hooks/use-feeds'
import type { FeedCategory } from '@/lib/feeds'
import { timeAgo } from '@/lib/time'

const ALL_SOURCES = 'all'

export function FeedPanel({ category }: { category: FeedCategory }) {
  const { articles, failed, loadedAt, loading, refresh } = useFeeds(category.feeds)
  const [query, setQuery] = useState('')
  const [source, setSource] = useState(ALL_SOURCES)

  const sources = useMemo(() => [...new Set(category.feeds.map((f) => f.source))], [category])

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return articles.filter(
      (a) =>
        (source === ALL_SOURCES || a.source === source) &&
        (!q || a.title.toLowerCase().includes(q) || a.summary.toLowerCase().includes(q)),
    )
  }, [articles, query, source])

  const firstLoad = loading && articles.length === 0

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search ${category.label.toLowerCase()}… e.g. Reliance, Nifty, IPO`}
            className="pl-8"
          />
        </div>
        <div className="flex items-center gap-2">
          <Select value={source} onValueChange={setSource}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_SOURCES}>All sources</SelectItem>
              {sources.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={refresh} disabled={loading}>
            <RefreshCw className={loading ? 'animate-spin' : undefined} />
            Refresh
          </Button>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        {category.description}
        {loadedAt && ` · ${visible.length} stories · updated ${timeAgo(loadedAt)}`}
      </p>

      {failed.length > 0 && (
        <Alert>
          <AlertTriangle />
          <AlertTitle>Some feeds couldn't be loaded</AlertTitle>
          <AlertDescription>
            {failed.map((f) => f.source).join(', ')} didn't respond. Showing everything else.
          </AlertDescription>
        </Alert>
      )}

      {firstLoad ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => (
            <NewsCardSkeleton key={i} />
          ))}
        </div>
      ) : visible.length === 0 ? (
        <p className="py-16 text-center text-sm text-muted-foreground">
          {articles.length === 0 ? 'No stories available right now.' : 'No stories match your filters.'}
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  )
}
