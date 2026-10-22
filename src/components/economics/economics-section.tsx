import { FeedPanel } from '@/components/economics/feed-panel'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { economicsCategories } from '@/lib/feeds'

export function EconomicsSection() {
  return (
    <section className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">Economics</h1>
        <p className="text-sm text-muted-foreground">
          Daily news on Indian stock markets, listed companies and the world economy.
        </p>
      </div>

      <Tabs defaultValue={economicsCategories[0].id}>
        <TabsList>
          {economicsCategories.map((c) => (
            <TabsTrigger key={c.id} value={c.id}>
              {c.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {economicsCategories.map((c) => (
          <TabsContent key={c.id} value={c.id} className="pt-4">
            <FeedPanel category={c} />
          </TabsContent>
        ))}
      </Tabs>
    </section>
  )
}
