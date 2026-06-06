"use client"
import { useState, useEffect, useCallback } from "react"
import { TIERS } from "@/lib/tiers"
import { TICKERS } from "@/lib/tickers"

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────
interface Quote {
  symbol:    string
  name:      string
  price:     number
  change:    number
  changePct: number
  marketCap: number | null
  currency:  string
  dayHigh:   number | null
  dayLow:    number | null
  week52High:number | null
  week52Low: number | null
}

// ─────────────────────────────────────────────────────────────────────────────
// Formatters
// ─────────────────────────────────────────────────────────────────────────────
const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$", EUR: "€", GBP: "£", JPY: "¥",
  KRW: "₩", TWD: "NT$", AUD: "A$", NOK: "kr",
  CHF: "Fr", SEK: "kr",
}

function fmtPrice(price: number, currency: string): string {
  const sym = CURRENCY_SYMBOLS[currency] ?? ""
  if (currency === "JPY" || currency === "KRW")
    return `${sym}${price.toLocaleString("en-US", { maximumFractionDigits: 0 })}`
  return `${sym}${price.toFixed(2)}`
}

function fmtCap(cap: number | null): string {
  if (!cap) return "—"
  if (cap >= 1e12) return `$${(cap / 1e12).toFixed(2)}T`
  if (cap >= 1e9)  return `$${(cap / 1e9).toFixed(1)}B`
  if (cap >= 1e6)  return `$${(cap / 1e6).toFixed(0)}M`
  return "—"
}

function fmtPct(pct: number): string {
  return `${pct >= 0 ? "+" : ""}${pct.toFixed(2)}%`
}

// ─────────────────────────────────────────────────────────────────────────────
// Tier tab config
// ─────────────────────────────────────────────────────────────────────────────
const TABS = [
  { key: "all", short: "ALL", label: "All Tiers",    color: "#f5b731", cbg: "rgba(245,183,49,0.08)", cbr: "rgba(245,183,49,0.3)" },
  ...TIERS.map(t => ({ key: String(t.level), short: `T${t.level}`, label: t.name, color: t.color, cbg: t.cbg, cbr: t.cbr })),
]

function getSymbols(tier: string): string[] {
  if (tier === "all") {
    // Top 5 from each tier for a broad overview
    return TIERS.flatMap(t =>
      t.cos
        .map(([name]) => TICKERS[name])
        .filter((s): s is string => Boolean(s))
        .slice(0, 5)
    )
  }
  const t = TIERS.find(t => String(t.level) === tier)
  if (!t) return []
  return t.cos
    .map(([name]) => TICKERS[name])
    .filter((s): s is string => Boolean(s))
}

// ─────────────────────────────────────────────────────────────────────────────
// Row skeleton
// ─────────────────────────────────────────────────────────────────────────────
function SkeletonRow() {
  return (
    <tr>
      {[60, 180, 80, 70, 90].map((w, i) => (
        <td key={i} style={{ padding: "12px 16px" }}>
          <div style={{
            width: w, height: 12, borderRadius: 3,
            background: "rgba(245,183,49,0.07)",
            animation: `sk 1.6s ease-in-out ${i * 0.08}s infinite`,
          }} />
        </td>
      ))}
    </tr>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────
export function MarketsClient() {
  const [activeTier, setActiveTier] = useState("1")
  const [quotes,     setQuotes]     = useState<Quote[]>([])
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState<string | null>(null)
  const [fetchedAt,  setFetchedAt]  = useState<Date | null>(null)

  const activeTab = TABS.find(t => t.key === activeTier) ?? TABS[0]

  const load = useCallback(async (tier: string) => {
    const symbols = getSymbols(tier)
    if (!symbols.length) { setQuotes([]); setLoading(false); return }

    setLoading(true)
    setError(null)

    try {
      const res  = await fetch(`/api/finance/quote?symbols=${symbols.join(",")}`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data: Quote[] = await res.json()
      if (!Array.isArray(data)) throw new Error("Unexpected response")
      // Sort by market cap desc, put nulls at end
      setQuotes(data.sort((a, b) => (b.marketCap ?? -1) - (a.marketCap ?? -1)))
      setFetchedAt(new Date())
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load(activeTier) }, [activeTier, load])

  const noData = !loading && !error && quotes.length === 0

  return (
    <>
      <style>{`
        @keyframes sk { 0%,100%{opacity:.35;} 50%{opacity:.8;} }
        @keyframes blink { 0%,100%{opacity:1;} 50%{opacity:.3;} }
        .stock-row:hover { background: var(--bg-card-h) !important; }
        .stock-row:hover .ticker-badge { border-color: var(--active-color, #f5b731) !important; color: var(--active-color, #f5b731) !important; }
      `}</style>

      {/* ── Tier tabs ───────────────────────────────────────────────────── */}
      <div style={{
        display: "flex", gap: 2, overflowX: "auto",
        WebkitOverflowScrolling: "touch" as const,
        marginBottom: 24, paddingBottom: 1,
        borderBottom: "1px solid var(--border)",
      }}>
        {TABS.map(tab => {
          const active = tab.key === activeTier
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTier(tab.key)}
              style={{
                fontFamily: "var(--mono)", fontSize: "11px", fontWeight: 600,
                letterSpacing: "0.06em", padding: "10px 16px",
                background: active ? tab.cbg : "transparent",
                color: active ? tab.color : "var(--text-2)",
                border: "none",
                borderBottom: active ? `2px solid ${tab.color}` : "2px solid transparent",
                cursor: "pointer", whiteSpace: "nowrap" as const,
                transition: "all .18s",
              }}
              title={tab.label}
            >
              {tab.short}
            </button>
          )
        })}

        {/* Live indicator */}
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8, paddingRight: 4, flexShrink: 0 }}>
          <span style={{
            width: 6, height: 6, borderRadius: "50%", background: "#aaff00",
            animation: "blink 2s ease-in-out infinite", flexShrink: 0,
          }}/>
          <span style={{ fontFamily: "var(--mono)", fontSize: "9px", color: "var(--text-2)", whiteSpace: "nowrap" as const }}>
            {fetchedAt
              ? `UPDATED ${fetchedAt.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`
              : "15 MIN DELAYED"}
          </span>
        </div>
      </div>

      {/* ── Error ───────────────────────────────────────────────────────── */}
      {error && (
        <div style={{
          background: "var(--bg-card)", border: "1px solid var(--border-red)",
          borderRadius: "var(--r)", padding: "20px 22px", marginBottom: 24,
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <span style={{ fontFamily: "var(--mono)", fontSize: "11px", color: "var(--red)" }}>
            {error}
          </span>
          <button
            onClick={() => load(activeTier)}
            style={{
              fontFamily: "var(--mono)", fontSize: "10px", fontWeight: 600,
              color: "var(--bg-0)", background: "var(--yellow)",
              border: "none", padding: "6px 14px", borderRadius: "var(--r)", cursor: "pointer",
            }}
          >
            RETRY
          </button>
        </div>
      )}

      {/* ── No data ─────────────────────────────────────────────────────── */}
      {noData && (
        <div style={{
          textAlign: "center" as const, padding: "40px 0",
          fontFamily: "var(--mono)", fontSize: "11px", color: "var(--text-2)",
        }}>
          No publicly traded companies found for this tier.
        </div>
      )}

      {/* ── Table ───────────────────────────────────────────────────────── */}
      {!error && !noData && (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" as const }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                {["TICKER", "COMPANY", "PRICE", "CHANGE", "MKT CAP", "52W RANGE"].map(h => (
                  <th key={h} style={{
                    fontFamily: "var(--mono)", fontSize: "9px", fontWeight: 600,
                    letterSpacing: "0.14em", color: "var(--text-2)",
                    padding: "8px 16px", textAlign: h === "TICKER" ? "left" as const : "right" as const,
                    whiteSpace: "nowrap" as const,
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)
                : quotes.map((q, idx) => {
                    const up = q.changePct >= 0
                    const chColor = up ? "#aaff00" : "#ff5555"
                    // 52W range bar position
                    const rangePos = (q.week52High && q.week52Low && q.week52Low !== q.week52High)
                      ? Math.round(((q.price - q.week52Low) / (q.week52High - q.week52Low)) * 100)
                      : null

                    return (
                      <tr
                        key={q.symbol}
                        className="stock-row"
                        style={{
                          borderBottom: "1px solid var(--border)",
                          background: idx % 2 === 0 ? "transparent" : "rgba(245,183,49,0.015)",
                          transition: "background .15s",
                          // @ts-expect-error CSS variable
                          "--active-color": activeTab.color,
                        }}
                      >
                        {/* Ticker */}
                        <td style={{ padding: "12px 16px" }}>
                          <a
                            href={`https://finance.yahoo.com/quote/${q.symbol}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ textDecoration: "none" }}
                          >
                            <span
                              className="ticker-badge"
                              style={{
                                fontFamily: "var(--mono)", fontSize: "11px", fontWeight: 600,
                                padding: "3px 8px", borderRadius: 4,
                                background: activeTab.cbg,
                                color: "var(--text-1)",
                                border: `1px solid var(--border)`,
                                transition: "all .18s", display: "inline-block",
                                whiteSpace: "nowrap" as const,
                              }}
                            >
                              {q.symbol}
                            </span>
                          </a>
                        </td>

                        {/* Company name */}
                        <td style={{
                          padding: "12px 16px",
                          fontFamily: "var(--sans)", fontSize: "12.5px",
                          color: "var(--text-0)", maxWidth: 220,
                          overflow: "hidden", textOverflow: "ellipsis",
                          whiteSpace: "nowrap" as const,
                        }}>
                          {q.name}
                        </td>

                        {/* Price */}
                        <td style={{
                          padding: "12px 16px", textAlign: "right" as const,
                          fontFamily: "var(--mono)", fontSize: "13px", fontWeight: 600,
                          color: "var(--text-0)", whiteSpace: "nowrap" as const,
                        }}>
                          {fmtPrice(q.price, q.currency)}
                        </td>

                        {/* Change */}
                        <td style={{
                          padding: "12px 16px", textAlign: "right" as const,
                          fontFamily: "var(--mono)", fontSize: "12px", fontWeight: 600,
                          color: chColor, whiteSpace: "nowrap" as const,
                        }}>
                          {up ? "▲" : "▼"} {fmtPct(q.changePct)}
                        </td>

                        {/* Market cap */}
                        <td style={{
                          padding: "12px 16px", textAlign: "right" as const,
                          fontFamily: "var(--mono)", fontSize: "12px",
                          color: "var(--text-1)", whiteSpace: "nowrap" as const,
                        }}>
                          {fmtCap(q.marketCap)}
                        </td>

                        {/* 52W range bar */}
                        <td style={{ padding: "12px 16px 12px 20px", minWidth: 120 }}>
                          {rangePos !== null ? (
                            <div style={{ display: "flex", flexDirection: "column" as const, gap: 4 }}>
                              <div style={{
                                height: 4, borderRadius: 2,
                                background: "var(--bg-2)", position: "relative",
                              }}>
                                <div style={{
                                  position: "absolute", left: 0, top: 0, bottom: 0,
                                  width: `${rangePos}%`,
                                  background: activeTab.color,
                                  borderRadius: 2, transition: "width .4s ease",
                                }} />
                              </div>
                              <div style={{
                                display: "flex", justifyContent: "space-between",
                                fontFamily: "var(--mono)", fontSize: "8.5px", color: "var(--text-2)",
                              }}>
                                <span>{fmtPrice(q.week52Low!, q.currency)}</span>
                                <span>{fmtPrice(q.week52High!, q.currency)}</span>
                              </div>
                            </div>
                          ) : (
                            <span style={{ fontFamily: "var(--mono)", fontSize: "11px", color: "var(--text-2)" }}>—</span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
            </tbody>
          </table>
        </div>
      )}

      {/* Footer note */}
      {!loading && quotes.length > 0 && (
        <div style={{
          marginTop: 14,
          fontFamily: "var(--mono)", fontSize: "9.5px", color: "var(--text-2)",
          display: "flex", justifyContent: "space-between", flexWrap: "wrap" as const, gap: 4,
        }}>
          <span>{quotes.length} publicly traded companies shown · Private companies excluded</span>
          <span>Data via Yahoo Finance · 60s server cache · Click ticker to open quote</span>
        </div>
      )}
    </>
  )
}