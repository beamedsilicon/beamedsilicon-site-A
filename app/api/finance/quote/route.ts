/**
 * GET /api/finance/quote?symbols=NVDA,ASML,TSM
 *
 * Returns real-time quote data for one or more ticker symbols.
 * Uses yahooFinance.quote() with an array — one network round-trip
 * regardless of how many symbols are requested.
 *
 * Cached 60 s per unique symbol set.
 *
 * Success:  { quotes: QuoteResult[], cached: boolean }
 * Error:    { error: string, code: number }
 */

import { NextRequest, NextResponse } from "next/server"
import yahooFinance, { fromCache, setCache, toApiError } from "@/lib/yahoo-finance"

const TTL_MS = 60_000

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const symbolsParam = searchParams.get("symbols") ?? ""

  if (!symbolsParam.trim()) {
    return NextResponse.json(
      { error: "Missing required query param: symbols", code: 400 },
      { status: 400 }
    )
  }

  // Dedupe + uppercase; keep exchange suffixes (e.g. TSM, 8035.T, 005930.KS)
  const symbols = [
    ...new Set(
      symbolsParam
        .split(",")
        .map((s) => s.trim().toUpperCase())
        .filter(Boolean)
    ),
  ]

  if (symbols.length > 50) {
    return NextResponse.json(
      { error: "Maximum 50 symbols per request", code: 400 },
      { status: 400 }
    )
  }

  // Stable cache key — sort a copy so NVDA,ASML and ASML,NVDA hit the same entry
  const cacheKey = `quote:${[...symbols].sort().join(",")}`
  const cached = fromCache<object[]>(cacheKey)
  if (cached) {
    return NextResponse.json({ quotes: cached, cached: true })
  }

  try {
    // yahooFinance.quote() accepts a string array and returns an array.
    // Do NOT pass a second `fields` argument — in yahoo-finance2 v2 the
    // queryOptions shape is { return?: "array" | "object" } only; passing
    // unknown keys breaks the internal schema validation and returns nothing.
    const quoteData = await yahooFinance.quote(symbols)

    // Normalise to array regardless of single vs multi return
    const raw = Array.isArray(quoteData) ? quoteData : [quoteData]

    const results = raw.map((q) => ({
      symbol:                     q.symbol,
      shortName:                  q.shortName ?? q.longName ?? q.symbol,
      currency:                   q.currency             ?? "USD",
      regularMarketPrice:         q.regularMarketPrice   ?? null,
      regularMarketChange:        q.regularMarketChange  ?? null,
      regularMarketChangePercent: q.regularMarketChangePercent ?? null,
      regularMarketVolume:        q.regularMarketVolume  ?? null,
      regularMarketOpen:          q.regularMarketOpen    ?? null,
      regularMarketDayHigh:       q.regularMarketDayHigh ?? null,
      regularMarketDayLow:        q.regularMarketDayLow  ?? null,
      marketCap:                  q.marketCap            ?? null,
      fiftyTwoWeekHigh:           q.fiftyTwoWeekHigh     ?? null,
      fiftyTwoWeekLow:            q.fiftyTwoWeekLow      ?? null,
      marketState:                q.marketState          ?? null,
      exchangeName:               q.fullExchangeName     ?? null,
    }))

    setCache(cacheKey, results, TTL_MS)
    return NextResponse.json({ quotes: results, cached: false })
  } catch (err) {
    const apiError = toApiError(err)
    return NextResponse.json(apiError, { status: apiError.code })
  }
}