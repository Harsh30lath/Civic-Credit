import path from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

// RSS publishers don't send CORS headers, so feeds are fetched through the
// dev server. Each prefix maps to one publisher host (see src/lib/feeds.ts).
const feedHosts: Record<string, string> = {
  '/rss/et': 'https://economictimes.indiatimes.com',
  '/rss/mint': 'https://www.livemint.com',
  '/rss/bs': 'https://www.business-standard.com',
  '/rss/bl': 'https://www.thehindubusinessline.com',
  '/rss/bbc': 'https://feeds.bbci.co.uk',
  '/rss/cnbc': 'https://www.cnbc.com',
}

const proxy = Object.fromEntries(
  Object.entries(feedHosts).map(([prefix, target]) => [
    prefix,
    {
      target,
      changeOrigin: true,
      rewrite: (p: string) => p.slice(prefix.length),
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36',
      },
    },
  ]),
)

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  server: { proxy },
  preview: { proxy },
})
