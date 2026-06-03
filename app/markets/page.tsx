import { SiteHeader } from "@/components/site-header"
import { Ticker } from "@/components/ticker"
import { SiteFooter } from "@/components/site-footer"
import { MarketsClient } from "@/components/markets-client"
import { TIERS } from "@/lib/tiers"
import { TICKER_MAP } from "@/lib/ticker-map"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Markets — Beamed Silicon",
  description:
    "Live stock prices for 150+ publicly traded semiconductor companies across all 7 supply chain tiers.",
}

export default function MarketsPage() {
  // Pre-compute the tier→company→ticker mapping at build/request time on the
  // server so the client receives clean, typed data with no extra work.
  const tierData = TIERS.map((tier) => ({
    level: tier.level,
    name: tier.name,
    tag: tier.tag,
    color: tier.color,
    cbg: tier.cbg,
    cbr: tier.cbr,
    companies: tier.cos
      .map(([name, country, url]) => {
        const ticker = TICKER_MAP[name] ?? null
        return { name, country, url, ticker }
      })
      // Put listed companies first, unlisted (null ticker) at the end
      .sort((a, b) => {
        if (a.ticker && !b.ticker) return -1
        if (!a.ticker && b.ticker) return 1
        return 0
      }),
  }))

  return (
    <>
      <SiteHeader />
      <Ticker />
      <main>
        <MarketsClient tierData={tierData} />
      </main>
      <SiteFooter />
    </>
  )
}