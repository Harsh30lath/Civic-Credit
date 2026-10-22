// Feed URLs are relative to the RSS proxy prefixes defined in vite.config.ts.

export type Feed = {
  id: string
  source: string
  url: string
}

export type FeedCategory = {
  id: string
  label: string
  description: string
  feeds: Feed[]
}

export const economicsCategories: FeedCategory[] = [
  {
    id: 'markets',
    label: 'Indian Markets',
    description: 'Sensex, Nifty, stocks, IPOs and market moves',
    feeds: [
      { id: 'et-markets', source: 'Economic Times', url: '/rss/et/markets/rssfeeds/1977021501.cms' },
      { id: 'et-stocks', source: 'Economic Times', url: '/rss/et/markets/stocks/rssfeeds/2146842.cms' },
      { id: 'mint-markets', source: 'Mint', url: '/rss/mint/rss/markets' },
      { id: 'bs-markets', source: 'Business Standard', url: '/rss/bs/rss/markets-106.rss' },
      { id: 'bl-markets', source: 'BusinessLine', url: '/rss/bl/markets/feeder/default.rss' },
    ],
  },
  {
    id: 'companies',
    label: 'Companies',
    description: 'Results, deals and news from listed Indian companies',
    feeds: [
      { id: 'et-companies', source: 'Economic Times', url: '/rss/et/news/company/rssfeeds/2143429.cms' },
      { id: 'mint-companies', source: 'Mint', url: '/rss/mint/rss/companies' },
      { id: 'bs-companies', source: 'Business Standard', url: '/rss/bs/rss/companies-101.rss' },
      { id: 'bl-companies', source: 'BusinessLine', url: '/rss/bl/companies/feeder/default.rss' },
    ],
  },
  {
    id: 'world',
    label: 'World Economy',
    description: 'Global economy and business',
    feeds: [
      { id: 'mint-economy', source: 'Mint', url: '/rss/mint/rss/economy' },
      { id: 'bbc-business', source: 'BBC', url: '/rss/bbc/news/business/rss.xml' },
      { id: 'cnbc-world', source: 'CNBC', url: '/rss/cnbc/id/20910258/device/rss/rss.html' },
    ],
  },
]
