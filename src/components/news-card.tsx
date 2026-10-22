import { useState } from 'react'
import { ExternalLink } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import type { Article } from '@/lib/rss'
import { formatDateTime, timeAgo } from '@/lib/time'

export function NewsCard({ article }: { article: Article }) {
  const [imageFailed, setImageFailed] = useState(false)
  const showImage = article.image && !imageFailed

  return (
    <Card className="h-full transition-shadow hover:shadow-md">
      {showImage && (
        <img
          src={article.image}
          alt=""
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => setImageFailed(true)}
          className="aspect-video w-full object-cover"
        />
      )}
      <CardHeader>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Badge variant="secondary">{article.source}</Badge>
          {article.publishedAt && (
            <Tooltip>
              <TooltipTrigger asChild>
                <time dateTime={article.publishedAt.toISOString()}>{timeAgo(article.publishedAt)}</time>
              </TooltipTrigger>
              <TooltipContent>{formatDateTime(article.publishedAt)}</TooltipContent>
            </Tooltip>
          )}
        </div>
        <CardTitle className="leading-snug">
          <a href={article.link} target="_blank" rel="noreferrer" className="hover:underline">
            {article.title}
          </a>
        </CardTitle>
      </CardHeader>
      {article.summary && (
        <CardContent className="flex-1">
          <CardDescription className="line-clamp-3">{article.summary}</CardDescription>
        </CardContent>
      )}
      <CardFooter className="mt-auto border-t py-3">
        <a
          href={article.link}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
        >
          Read full story <ExternalLink className="size-3" />
        </a>
      </CardFooter>
    </Card>
  )
}

export function NewsCardSkeleton() {
  return (
    <Card className="h-full pt-0">
      <Skeleton className="aspect-video w-full rounded-none" />
      <CardHeader>
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-2/3" />
      </CardHeader>
      <CardContent className="space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
      </CardContent>
    </Card>
  )
}
