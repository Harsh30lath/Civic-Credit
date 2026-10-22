import { useCallback, useEffect, useState } from 'react'

import type { Feed } from '@/lib/feeds'
import { loadFeeds, type FeedResult } from '@/lib/rss'

const AUTO_REFRESH_MS = 5 * 60 * 1000

type LoadedState = FeedResult & { requestKey: string; loadedAt: Date }

export function useFeeds(feeds: Feed[]) {
  const [state, setState] = useState<LoadedState | null>(null)
  const [reload, setReload] = useState(0)

  const requestKey = `${feeds.map((f) => f.id).join('|')}#${reload}`

  useEffect(() => {
    const controller = new AbortController()
    loadFeeds(feeds, controller.signal, reload > 0).then((result) => {
      if (!controller.signal.aborted) {
        setState({ ...result, requestKey, loadedAt: new Date() })
      }
    })
    return () => controller.abort()
  }, [feeds, reload, requestKey])

  useEffect(() => {
    const timer = setInterval(() => setReload((n) => n + 1), AUTO_REFRESH_MS)
    return () => clearInterval(timer)
  }, [])

  const refresh = useCallback(() => setReload((n) => n + 1), [])

  return {
    articles: state?.articles ?? [],
    failed: state?.failed ?? [],
    loadedAt: state?.loadedAt ?? null,
    loading: state?.requestKey !== requestKey,
    refresh,
  }
}
