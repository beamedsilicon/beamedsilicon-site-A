import { NextRequest, NextResponse } from "next/server"

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"

// ─── In-memory crumb cache (1 h TTL, resets on cold start — that's fine) ──
let cached: { crumb: string; cookie: string; exp: number } | null = null

async function ensureAuth(): Promise<{ crumb: string; cookie: string } | null> {
  if (cached && cached.exp > Date.now()) return cached

  try {
    // 1. Hit fc.yahoo.com to obtain session cookies
    const r1 = await fetch("https://fc.yahoo.com", {
      headers: { "User-Agent": UA, "Accept-Language": "en-US,en;q=0.9" },
    })

    const rawSetCookie = r1.headers.get("set-cookie") ?? ""
    // Parse multi-value Set-Cookie into a single Cookie: header string
    const cookie = rawSetCookie
      .split(/,\s*(?=[A-Za-z0-9_\-]+=)/)   // split on cookie boundaries
      .map(c => c.split(";")[0].trim())
      .filter(c => c.includes("="))
      .join("; ")

    // 2. Exchange cookies for a crumb token
    const r2 = await fetch(
      "https://query2.finance.yahoo.com/v1/test/getcrumb",
      { headers: { "User-Agent": UA, Accept: "*/*", Cookie: cookie } }
    )
    const crumb = (await r2.text()).trim()

    // Guard against HTML error pages
    if (!crumb || crumb.startsWith("<") || crumb === "Not Found" || crumb.length > 60) {
      return null
    }

    cached = { crumb, cookie, exp: Date.now() + 3_600_000 } // cache 1 h
    return cached
  } catch {
    return null
  }
}

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

  const auth = await ensureAuth()

  const params = new URLSearchParams({ symbols })
  if (auth) params.set("crumb", auth.crumb)

  const headers: Record<string, string> = { "User-Agent": UA, Accept: "application/json" }
  if (auth) headers.Cookie = auth.cookie

  try {
    const res = await fetch(
      `https://query2.finance.yahoo.com/v7/finance/quote?${params}`,
      { headers, next: { revalidate: 60 } }
    )

    if (!res.ok) {
      // Crumb may have expired mid-session — clear cache so next request retries
      if (res.status === 401) cached = null
      return NextResponse.json(
        { error: `Yahoo Finance ${res.status}` },
        { status: res.status }
      )
    }

    const data   = await res.json()
    const quotes: YahooQuote[] = data?.quoteResponse?.result ?? []

    return NextResponse.json(
      quotes
        .filter(q => q.regularMarketPrice != null)
        .map(q => ({
          symbol:     q.symbol,
          name:       q.shortName || q.longName || q.symbol,
          price:      q.regularMarketPrice!,
          change:     q.regularMarketChange        ?? 0,
          changePct:  q.regularMarketChangePercent ?? 0,
          marketCap:  q.marketCap                 ?? null,
          currency:   q.currency                  ?? "USD",
          dayHigh:    q.regularMarketDayHigh      ?? null,
          dayLow:     q.regularMarketDayLow       ?? null,
          week52High: q.fiftyTwoWeekHigh           ?? null,
          week52Low:  q.fiftyTwoWeekLow            ?? null,
          volume:     q.regularMarketVolume        ?? null,
        }))
    )
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    )
  }
}