import { NextRequest, NextResponse } from "next/server"

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"

// ─── Crumb cache (1 h TTL, resets on cold start) ──────────────────────────────
let crumbCache: { crumb: string; cookie: string; exp: number } | null = null

// ─── Response cache (60 s TTL) — avoids hitting Yahoo on every tab switch ─────
const responseCache = new Map<string, { payload: unknown; exp: number }>()
const RESPONSE_TTL = 60_000

async function ensureAuth(): Promise<{ crumb: string; cookie: string } | null> {
  if (crumbCache && crumbCache.exp > Date.now()) return crumbCache

  try {
    const r1 = await fetch("https://fc.yahoo.com", {
      headers: { "User-Agent": UA, "Accept-Language": "en-US,en;q=0.9" },
    })

    const rawSetCookie = r1.headers.get("set-cookie") ?? ""
    const cookie = rawSetCookie
      .split(/,\s*(?=[A-Za-z0-9_\-]+=)/)
      .map(c => c.split(";")[0].trim())
      .filter(c => c.includes("="))
      .join("; ")

    const r2 = await fetch(
      "https://query2.finance.yahoo.com/v1/test/getcrumb",
      { headers: { "User-Agent": UA, Accept: "*/*", Cookie: cookie } }
    )
    const crumb = (await r2.text()).trim()

    if (!crumb || crumb.startsWith("<") || crumb === "Not Found" || crumb.length > 60) {
      return null
    }

    crumbCache = { crumb, cookie, exp: Date.now() + 3_600_000 }
    return crumbCache
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

interface FetchResult {
  ok: boolean
  status: number
  quotes?: YahooQuote[]
}

async function fetchFromYahoo(
  symbols: string,
  auth: { crumb: string; cookie: string } | null
): Promise<FetchResult> {
  const params = new URLSearchParams({ symbols })
  if (auth) params.set("crumb", auth.crumb)

  const headers: Record<string, string> = { "User-Agent": UA, Accept: "application/json" }
  if (auth) headers.Cookie = auth.cookie

  try {
    const res = await fetch(
      `https://query2.finance.yahoo.com/v7/finance/quote?${params}`,
      { headers }
    )
    if (!res.ok) return { ok: false, status: res.status }

    const data = await res.json()
    const quotes: YahooQuote[] = data?.quoteResponse?.result ?? []
    return { ok: true, status: 200, quotes }
  } catch {
    return { ok: false, status: 500 }
  }
}

export async function GET(req: NextRequest) {
  const symbols = new URL(req.url).searchParams.get("symbols")
  if (!symbols) {
    return NextResponse.json({ error: "symbols param required" }, { status: 400 })
  }

  // Stable cache key regardless of symbol order
  const cacheKey = symbols.split(",").filter(Boolean).sort().join(",")

  // ── 1. Serve from response cache if fresh ──────────────────────────────────
  const hit = responseCache.get(cacheKey)
  if (hit && hit.exp > Date.now()) {
    return NextResponse.json(hit.payload, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        "X-Cache": "HIT",
      },
    })
  }

  // ── 2. Fetch with auth ─────────────────────────────────────────────────────
  const auth = await ensureAuth()
  let result = await fetchFromYahoo(symbols, auth)

  // ── 3. On 401 or 429: clear crumb and retry without auth ───────────────────
  if (!result.ok && (result.status === 401 || result.status === 429)) {
    crumbCache = null
    result = await fetchFromYahoo(symbols, null)
  }

  if (!result.ok) {
    return NextResponse.json(
      { error: `Yahoo Finance ${result.status}` },
      {
        status: result.status,
        headers: result.status === 429 ? { "Retry-After": "60" } : {},
      }
    )
  }

  // ── 4. Shape response ──────────────────────────────────────────────────────
  const payload = (result.quotes ?? [])
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

  // ── 5. Store in response cache ─────────────────────────────────────────────
  responseCache.set(cacheKey, { payload, exp: Date.now() + RESPONSE_TTL })

  return NextResponse.json(payload, {
    headers: {
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
    },
  })
}
