import { Landmark, TrendingUp } from 'lucide-react'

import { EconomicsSection } from '@/components/economics/economics-section'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

function App() {
  return (
    <div className="min-h-svh bg-background">
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4">
          <span className="font-heading text-lg font-semibold tracking-tight">Civic &amp; Credit</span>
          <Separator orientation="vertical" className="h-6!" />
          <nav className="flex items-center gap-1">
            <Button variant="secondary" size="sm">
              <TrendingUp />
              Economics
            </Button>
            <Tooltip>
              <TooltipTrigger asChild>
                <span tabIndex={0}>
                  <Button variant="ghost" size="sm" disabled>
                    <Landmark />
                    Politics
                  </Button>
                </span>
              </TooltipTrigger>
              <TooltipContent>Coming soon</TooltipContent>
            </Tooltip>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <EconomicsSection />
      </main>
    </div>
  )
}

export default App
