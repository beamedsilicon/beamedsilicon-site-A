/**
 * GET /api/finance/quote?symbols=NVDA,ASML,TSM
 *
 * Returns real-time quote data for one or more ticker symbols.
 * Cached for 60 s to avoid rate-limiting on busy pages.
 *
 * Response shape:
 *   { quotes: QuoteResult[] }
 *   or on error:
 *   { error: string, code: number }
 */

import { NextRequest, NextResponse } from "next/server"
import yahooFinance, { fromCache, setCache, toApiError } from "@/lib/yahoo-finance"

const TTL_MS = 60_000 // 1 minute

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const raw = searchParams.get("symbols") ?? ""

  if (!raw.trim()) {
    return NextResponse.json(
      { error: "Missing required query param: symbols", code: 400 },
      { status: 400 }
    )
  }

  // Accept comma-separated list; dedupe and upper-case
  const symbols = [...new Set(raw.split(",").map((s) => s.trim().toUpperCase()).filter(Boolean))]

  if (symbols.length > 50) {
    return NextResponse.json(
      { error: "Maximum 50 symbols per request", code: 400 },
      { status: 400 }
    )
  }

  const cacheKey = `quote:${symbols.sort().join(",")}`
  const cached = fromCache<object[]>(cacheKey)
  if (cached) {
    return NextResponse.json({ quotes: cached, cached: true })
  }

  try {
    // quoteSummary with "price" module is the lightest call for real-time data
    const results = await Promise.all(
      symbols.map(async (symbol) => {
        const data = await yahooFinance.quoteSummary(symbol, {
          modules: ["price"],
        })

        const p = data.price!
        return {
          symbol,
          shortName: p.shortName ?? p.longName ?? symbol,
          currency: p.currency ?? "USD",
          regularMarketPrice: p.regularMarketPrice ?? null,
          regularMarketChange: p.regularMarketChange ?? null,
          regularMarketChangePercent: p.regularMarketChangePercent ?? null,
          regularMarketVolume: p.regularMarketVolume ?? null,
          regularMarketOpen: p.regularMarketOpen ?? null,
          regularMarketDayHigh: p.regularMarketDayHigh ?? null,
          regularMarketDayLow: p.regularMarketDayLow ?? null,
          marketCap: p.marketCap ?? null,
          fiftyTwoWeekHigh: p.fiftyTwoWeekHigh ?? null,
          fiftyTwoWeekLow: p.fiftyTwoWeekLow ?? null,
          marketState: p.marketState ?? null,
          exchangeName: p.exchangeName ?? null,
        }
      })
    )

    setCache(cacheKey, results, TTL_MS)
    return NextResponse.json({ quotes: results, cached: false })
  } catch (err) {
    const apiError = toApiError(err)
    return NextResponse.json(apiError, { status: apiError.code })
  }
}