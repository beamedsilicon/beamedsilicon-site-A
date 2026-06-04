/**
 * GET /api/finance/quote?symbols=NVDA,ASML,TSM
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

  const cacheKey = `quote:${[...symbols].sort().join(",")}`
  const cached = fromCache<object[]>(cacheKey)
  if (cached) {
    return NextResponse.json({ quotes: cached, cached: true })
  }

  try {
    const quoteData = await yahooFinance.quote(symbols)

    // Explicitly type as Record<string, unknown>[] to avoid `never[]` inference
    const raw: Record<string, unknown>[] = Array.isArray(quoteData)
      ? (quoteData as Record<string, unknown>[])
      : ([quoteData] as Record<string, unknown>[])

    const results = raw.map((q) => ({
      symbol:                     q["symbol"],
      shortName:                  q["shortName"] ?? q["longName"] ?? q["symbol"],
      currency:                   q["currency"]             ?? "USD",
      regularMarketPrice:         q["regularMarketPrice"]   ?? null,
      regularMarketChange:        q["regularMarketChange"]  ?? null,
      regularMarketChangePercent: q["regularMarketChangePercent"] ?? null,
      regularMarketVolume:        q["regularMarketVolume"]  ?? null,
      regularMarketOpen:          q["regularMarketOpen"]    ?? null,
      regularMarketDayHigh:       q["regularMarketDayHigh"] ?? null,
      regularMarketDayLow:        q["regularMarketDayLow"]  ?? null,
      marketCap:                  q["marketCap"]            ?? null,
      fiftyTwoWeekHigh:           q["fiftyTwoWeekHigh"]     ?? null,
      fiftyTwoWeekLow:            q["fiftyTwoWeekLow"]      ?? null,
      marketState:                q["marketState"]          ?? null,
      exchangeName:               q["fullExchangeName"]     ?? null,
    }))

    setCache(cacheKey, results, TTL_MS)
    return NextResponse.json({ quotes: results, cached: false })
  } catch (err) {
    const apiError = toApiError(err)
    return NextResponse.json(apiError, { status: apiError.code })
  }
}