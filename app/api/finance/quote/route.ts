import { NextRequest, NextResponse } from "next/server"

interface YahooQuote {
  symbol:                      string
  shortName?:                  string
  longName?:                   string
  regularMarketPrice?:         number
  regularMarketChange?:        number
  regularMarketChangePercent?: number
  marketCap?:                  number
  currency?:                   string
  regularMarketDayHigh?:       number
  regularMarketDayLow?:        number
  fiftyTwoWeekHigh?:           number
  fiftyTwoWeekLow?:            number
  regularMarketVolume?:        number
}

export async function GET(req: NextRequest) {
  const symbols = new URL(req.url).searchParams.get("symbols")
  if (!symbols) {
    return NextResponse.json({ error: "symbols param required" }, { status: 400 })
  }

  const url =
    `https://query1.finance.yahoo.com/v7/finance/quote` +
    `?symbols=${encodeURIComponent(symbols)}` +
    `&fields=shortName,longName,regularMarketPrice,regularMarketChange,` +
    `regularMarketChangePercent,marketCap,currency,` +
    `regularMarketDayHigh,regularMarketDayLow,` +
    `fiftyTwoWeekHigh,fiftyTwoWeekLow,regularMarketVolume`

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
          "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "application/json",
      },
      next: { revalidate: 60 }, // cache 60 s
    })

    if (!res.ok) {
      return NextResponse.json(
        { error: `Yahoo Finance ${res.status}` },
        { status: res.status }
      )
    }

    const data   = await res.json()
    const quotes: YahooQuote[] = data?.quoteResponse?.result ?? []

    const formatted = quotes
      .filter(q => q.regularMarketPrice != null)
      .map(q => ({
        symbol:        q.symbol,
        name:          q.shortName || q.longName || q.symbol,
        price:         q.regularMarketPrice!,
        change:        q.regularMarketChange        ?? 0,
        changePct:     q.regularMarketChangePercent ?? 0,
        marketCap:     q.marketCap                 ?? null,
        currency:      q.currency                  ?? "USD",
        dayHigh:       q.regularMarketDayHigh      ?? null,
        dayLow:        q.regularMarketDayLow       ?? null,
        week52High:    q.fiftyTwoWeekHigh           ?? null,
        week52Low:     q.fiftyTwoWeekLow            ?? null,
        volume:        q.regularMarketVolume        ?? null,
      }))

    return NextResponse.json(formatted)
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error"
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}