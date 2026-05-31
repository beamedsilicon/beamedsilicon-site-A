import { SiteHeader } from "@/components/site-header"
import { Ticker } from "@/components/ticker"
import { Hero } from "@/components/hero"
import { SupplyChainExplorer } from "@/components/supply-chain-explorer"
import { FeaturedAnalysis } from "@/components/featured-analysis"
import { LatestNews } from "@/components/latest-news"
import { Topics } from "@/components/topics"
import { Newsletter } from "@/components/newsletter"
import { SiteFooter } from "@/components/site-footer"

export default function Home() {
  return (
    <>
      <SiteHeader />
      <Ticker />
      <main>
        <Hero />
        <SupplyChainExplorer />
        <FeaturedAnalysis />
        <LatestNews />
        <Topics />
        <Newsletter />
      </main>
      <SiteFooter />
    </>
  )
}
