"use client"

import React, { useState, useEffect, useCallback, useMemo, useRef } from "react"

// ── Types ─────────────────────────────────────────────────────────────────────

interface TickerEntry {
  symbol: string
  exchange: string
}

interface CompanyRow {
  name: string
  country: string
  url: string
  ticker: TickerEntry | null
}

interface TierData {
  level: number
  name: string
  tag: string
  color: string
  cbg: string
  cbr: string
  companies: CompanyRow[]
}

interface QuoteData {
  symbol: string
  shortName: string | null
  currency: string | null
  regularMarketPrice: number | null
  regularMarketChange: number | null
  regularMarketChangePercent: number | null
  regularMarketVolume: number | null
  marketCap: number | null
  fiftyTwoWeekHigh: number | null
  fiftyTwoWeekLow: number | null
  marketState: string | null
  exchangeName: string | null
}

type SortKey = "name" | "price" | "change" | "marketCap" | "52wkRange"
type SortDir = "asc" | "desc"

interface Props {
  tierData: TierData[]
}

// ── Formatters ────────────────────────────────────────────────────────────────

function fmtPrice(n: number | null, currency: string | null) {
  if (n == null) return "—"
  const sym = currency === "USD" ? "$" : currency === "EUR" ? "€" : currency === "GBP" ? "£" : ""
  if (n >= 1000) return `${sym}${n.toLocaleString("en-US", { maximumFractionDigits: 2 })}`
  if (n >= 1) return `${sym}${n.toFixed(2)}`
  return `${sym}${n.toFixed(4)}`
}

function fmtChange(n: number | null) {
  if (n == null) return "—"
  const sign = n >= 0 ? "+" : ""
  return `${sign}${n.toFixed(2)}`
}

function fmtPct(n: number | null) {
  if (n == null) return "—"
  const pct = n * 100
  const sign = pct >= 0 ? "+" : ""
  return `${sign}${pct.toFixed(2)}%`
}

function fmtMcap(n: number | null) {
  if (n == null) return "—"
  if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`
  if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`
  if (n >= 1e6) return `$${(n / 1e6).toFixed(0)}M`
  return `$${n.toLocaleString()}`
}

function fmtVol(n: number | null) {
  if (n == null) return "—"
  if (n >= 1e9) return `${(n / 1e9).toFixed(2)}B`
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`
  if (n >= 1e3) return `${(n / 1e3).toFixed(0)}K`
  return `${n}`
}

// ── 52-week range bar ─────────────────────────────────────────────────────────

function RangeBar({ low, high, current }: { low: number | null; high: number | null; current: number | null }) {
  if (low == null || high == null || current == null || high === low) return <span className="mk-dash">—</span>
  const pct = Math.max(0, Math.min(100, ((current - low) / (high - low)) * 100))
  return (
    <div className="mk-range-wrap" title={`52wk: $${low.toFixed(2)} – $${high.toFixed(2)}`}>
      <div className="mk-range-track">
        <div className="mk-range-fill" style={{ width: `${pct}%` }} />
        <div className="mk-range-dot" style={{ left: `${pct}%` }} />
      </div>
      <div className="mk-range-labels">
        <span>{fmtPrice(low, null)}</span>
        <span>{fmtPrice(high, null)}</span>
      </div>
    </div>
  )
}

// ── Sparkline (7-day mini chart) ──────────────────────────────────────────────

function Sparkline({ symbol, color }: { symbol: string; color: string }) {
  const [points, setPoints] = useState<number[] | null>(null)

  useEffect(() => {
    let cancelled = false
    fetch(`/api/finance/chart?symbol=${symbol}&range=5d&interval=1h`)
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return
        const closes = (d.quotes ?? [])
          .map((q: { close: number | null }) => q.close)
          .filter((c: number | null): c is number => c != null)
        if (closes.length > 1) setPoints(closes)
      })
      .catch(() => {})
    return () => { cancelled = true }
  }, [symbol])

  if (!points) return <div className="mk-spark-empty" />

  const min = Math.min(...points)
  const max = Math.max(...points)
  const range = max - min || 1
  const w = 80
  const h = 28
  const xs = points.map((_, i) => (i / (points.length - 1)) * w)
  const ys = points.map((p) => h - ((p - min) / range) * h)
  const d = xs.map((x, i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${ys[i].toFixed(1)}`).join(" ")
  const rising = (points[points.length - 1] ?? 0) >= (points[0] ?? 0)
  const lineColor = color || (rising ? "#aaff00" : "#ff5555")

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="mk-spark">
      <path d={d} fill="none" stroke={lineColor} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  )
}

// ── Market state badge ────────────────────────────────────────────────────────

function MarketBadge({ state }: { state: string | null }) {
  if (!state || state === "REGULAR") return null
  const label = state === "PRE" ? "PRE" : state === "POST" ? "AH" : state === "CLOSED" ? "CLOSED" : state
  return <span className={`mk-state mk-state-${state.toLowerCase()}`}>{label}</span>
}

// ── Sort icon (outside component to avoid recreation on every render) ──────────

function SortIcon({ sortKey, k, sortDir }: { sortKey: SortKey; k: SortKey; sortDir: SortDir }) {
  if (sortKey !== k) return <span className="mk-sort-icon mk-sort-none">⇅</span>
  return <span className="mk-sort-icon mk-sort-active">{sortDir === "asc" ? "↑" : "↓"}</span>
}

// ── Main component ────────────────────────────────────────────────────────────

export function MarketsClient({ tierData }: Props) {
  const [activeTier, setActiveTier] = useState(0)
  const [quotes, setQuotes] = useState<Record<string, QuoteData>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [query, setQuery] = useState("")
  const [sortKey, setSortKey] = useState<SortKey>("marketCap")
  const [sortDir, setSortDir] = useState<SortDir>("desc")
  const refreshTimer = useRef<ReturnType<typeof setInterval> | null>(null)

  // Guard: if tierData is somehow empty, render nothing rather than throwing
  if (tierData.length === 0) return null
  const tier = tierData[activeTier] ?? tierData[0]!

  // Fetch quotes for the active tier in batches of 50
  const fetchQuotes = useCallback(async (t: TierData) => {
    setLoading(true)
    setError(null)
    const symbols = t.companies
      .filter((c) => c.ticker)
      .map((c) => c.ticker!.symbol)

    if (symbols.length === 0) {
      setLoading(false)
      return
    }

    try {
      // Chunk into batches of 50
      const chunks: string[][] = []
      for (let i = 0; i < symbols.length; i += 50) chunks.push(symbols.slice(i, i + 50))

      const results = await Promise.all(
        chunks.map((chunk) =>
          fetch(`/api/finance/quote?symbols=${chunk.join(",")}`)
            .then((r) => {
              if (!r.ok) throw new Error(`API error ${r.status}: ${r.statusText}`)
              return r.json()
            })
            .then((d) => {
              if (d.error) throw new Error(d.error)
              return (d.quotes ?? []) as QuoteData[]
            })
        )
      )

      const merged: Record<string, QuoteData> = {}
      results.flat().forEach((q) => { merged[q.symbol] = q })
      setQuotes((prev) => ({ ...prev, ...merged }))
      setLastUpdated(new Date())
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to fetch quotes")
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch on tier change, and refresh every 60 s
  useEffect(() => {
    fetchQuotes(tier)
    if (refreshTimer.current) clearInterval(refreshTimer.current)
    refreshTimer.current = setInterval(() => fetchQuotes(tier), 60_000)
    return () => {
      if (refreshTimer.current) clearInterval(refreshTimer.current)
    }
  }, [tier, fetchQuotes])

  // Sorted + filtered rows
  const rows = useMemo(() => {
    const q = query.toLowerCase().trim()
    let list = tier.companies.filter((c) =>
      !q || c.name.toLowerCase().includes(q) || (c.ticker?.symbol ?? "").toLowerCase().includes(q)
    )

    list = [...list].sort((a, b) => {
      const qa = a.ticker ? quotes[a.ticker.symbol] : null
      const qb = b.ticker ? quotes[b.ticker.symbol] : null
      let va: number | string | null = null
      let vb: number | string | null = null
      switch (sortKey) {
        case "name":      va = a.name; vb = b.name; break
        case "price":     va = qa?.regularMarketPrice ?? null; vb = qb?.regularMarketPrice ?? null; break
        case "change":    va = qa?.regularMarketChangePercent ?? null; vb = qb?.regularMarketChangePercent ?? null; break
        case "marketCap": va = qa?.marketCap ?? null; vb = qb?.marketCap ?? null; break
        case "52wkRange": va = qa?.fiftyTwoWeekHigh ?? null; vb = qb?.fiftyTwoWeekHigh ?? null; break
      }
      // Nulls always last
      if (va == null && vb == null) return 0
      if (va == null) return 1
      if (vb == null) return -1
      if (typeof va === "string" && typeof vb === "string") {
        return sortDir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va)
      }
      const na = va as number
      const nb = vb as number
      return sortDir === "asc" ? na - nb : nb - na
    })

    return list
  }, [tier, quotes, query, sortKey, sortDir])

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"))
    else { setSortKey(key); setSortDir("desc") }
  }

  // SortIcon is defined outside the component to avoid recreation on every render

  const listedCount = tier.companies.filter((c) => c.ticker).length
  const loadedCount = tier.companies.filter((c) => c.ticker && quotes[c.ticker.symbol]).length

  return (
    <>
      {/* ── Page header ── */}
      <section className="mk-hero">
        <div className="wrap">
          <div className="eyebrow">SEMICONDUCTOR MARKETS</div>
          <h1 className="mk-title">
            Live Stock Prices
            <br />
            <span className="mk-title-accent">Across Every Tier</span>
          </h1>
          <p className="mk-sub">
            150+ publicly traded companies across all 7 supply chain tiers.
            Prices refresh every 60 seconds.
          </p>
          <div className="mk-hero-stats">
            <div><div className="mk-stat-n">150+</div><div className="mk-stat-l">LISTED COMPANIES</div></div>
            <div><div className="mk-stat-n">12</div><div className="mk-stat-l">EXCHANGES</div></div>
            <div><div className="mk-stat-n">60s</div><div className="mk-stat-l">REFRESH RATE</div></div>
          </div>
        </div>
      </section>

      {/* ── Tier tabs ── */}
      <div className="mk-tabs-wrap">
        <div className="wrap">
          <div className="mk-tabs">
            {tierData.map((t, i) => (
              <button
                key={t.level}
                type="button"
                className={`mk-tab${activeTier === i ? " mk-tab-active" : ""}`}
                style={activeTier === i ? {
                  "--tc": t.color,
                  "--tbg": t.cbg,
                  "--tbr": t.cbr,
                } as React.CSSProperties : {}}
                onClick={() => { setActiveTier(i); setQuery(""); setSortKey("marketCap"); setSortDir("desc") }}
              >
                <span className="mk-tab-level" style={{ color: activeTier === i ? t.color : undefined }}>
                  L{t.level}
                </span>
                <span className="mk-tab-name">{t.name.split(" ")[0]}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Table section ── */}
      <section className="mk-section">
        <div className="wrap">

          {/* Tier header */}
          <div className="mk-tier-hd">
            <div>
              <div className="mk-tier-label" style={{ color: tier.color }}>{tier.name}</div>
              <div className="mk-tier-tag">{tier.tag}</div>
            </div>
            <div className="mk-tier-meta">
              <span className="mk-pill" style={{ background: tier.cbg, color: tier.color, border: `1px solid ${tier.cbr}` }}>
                {listedCount} listed
              </span>
              <span className="mk-pill mk-pill-dim">
                {tier.companies.length - listedCount} private
              </span>
              {lastUpdated && (
                <span className="mk-updated">
                  Updated {lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              )}
              <button type="button" className="mk-refresh" onClick={() => fetchQuotes(tier)} disabled={loading} title="Refresh">
                <span className={loading ? "mk-spin" : ""}>↻</span>
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="mk-controls">
            <div className="mk-search-wrap">
              <span className="mk-search-icon">⌕</span>
              <input
                className="mk-search"
                type="search"
                placeholder={`Search ${tier.companies.length} companies…`}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search companies"
              />
            </div>
            <div className="mk-load-bar">
              <div
                className="mk-load-fill"
                style={{ width: listedCount ? `${(loadedCount / listedCount) * 100}%` : "0%" }}
              />
            </div>
          </div>

          {error && <div className="mk-error">⚠ {error}</div>}

          {/* Table */}
          <div className="mk-table-wrap">
            <table className="mk-table">
              <thead>
                <tr>
                  <th className="mk-th mk-th-name" onClick={() => toggleSort("name")}>
                    Company <SortIcon sortKey={sortKey} k="name" sortDir={sortDir} />
                  </th>
                  <th className="mk-th">Ticker</th>
                  <th className="mk-th mk-th-r">Exch</th>
                  <th className="mk-th mk-th-r" onClick={() => toggleSort("price")}>
                    Price <SortIcon sortKey={sortKey} k="price" sortDir={sortDir} />
                  </th>
                  <th className="mk-th mk-th-r" onClick={() => toggleSort("change")}>
                    Change <SortIcon sortKey={sortKey} k="change" sortDir={sortDir} />
                  </th>
                  <th className="mk-th mk-th-r mk-th-hide-sm">Volume</th>
                  <th className="mk-th mk-th-r" onClick={() => toggleSort("marketCap")}>
                    Mkt Cap <SortIcon sortKey={sortKey} k="marketCap" sortDir={sortDir} />
                  </th>
                  <th className="mk-th mk-th-r mk-th-hide-md" onClick={() => toggleSort("52wkRange")}>
                    52-Week Range <SortIcon sortKey={sortKey} k="52wkRange" sortDir={sortDir} />
                  </th>
                  <th className="mk-th mk-th-r mk-th-hide-md">5D Chart</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={9} className="mk-empty">No companies match your search.</td>
                  </tr>
                )}
                {rows.map((company) => {
                  const q = company.ticker ? quotes[company.ticker.symbol] : null
                  const isPos = (q?.regularMarketChangePercent ?? 0) >= 0
                  const hasData = q != null
                  const isLoading = loading && !hasData && company.ticker != null

                  return (
                    <tr key={company.name} className={`mk-row${!company.ticker ? " mk-row-unlisted" : ""}`}>
                      {/* Company */}
                      <td className="mk-td mk-td-name">
                        <a href={company.url} target="_blank" rel="noopener noreferrer" className="mk-co-link">
                          {company.name}
                        </a>
                        <span className="mk-country">{company.country}</span>
                        {q && <MarketBadge state={q.marketState} />}
                      </td>

                      {/* Ticker */}
                      <td className="mk-td">
                        {company.ticker
                          ? <span className="mk-symbol">{company.ticker.symbol}</span>
                          : <span className="mk-private">PRIVATE</span>
                        }
                      </td>

                      {/* Exchange */}
                      <td className="mk-td mk-td-r mk-exchange">
                        {company.ticker?.exchange ?? "—"}
                      </td>

                      {/* Price */}
                      <td className="mk-td mk-td-r mk-price">
                        {isLoading
                          ? <span className="mk-skel" />
                          : hasData
                            ? fmtPrice(q!.regularMarketPrice, q!.currency)
                            : <span className="mk-dash">—</span>
                        }
                      </td>

                      {/* Change */}
                      <td className={`mk-td mk-td-r mk-change ${hasData ? (isPos ? "mk-pos" : "mk-neg") : ""}`}>
                        {isLoading
                          ? <span className="mk-skel mk-skel-sm" />
                          : hasData
                            ? <span>
                                {fmtChange(q!.regularMarketChange)}
                                <br />
                                <span className="mk-pct">{fmtPct(q!.regularMarketChangePercent)}</span>
                              </span>
                            : <span className="mk-dash">—</span>
                        }
                      </td>

                      {/* Volume */}
                      <td className="mk-td mk-td-r mk-vol mk-hide-sm">
                        {isLoading
                          ? <span className="mk-skel mk-skel-sm" />
                          : hasData ? fmtVol(q!.regularMarketVolume) : <span className="mk-dash">—</span>
                        }
                      </td>

                      {/* Market cap */}
                      <td className="mk-td mk-td-r mk-mcap">
                        {isLoading
                          ? <span className="mk-skel mk-skel-sm" />
                          : hasData ? fmtMcap(q!.marketCap) : <span className="mk-dash">—</span>
                        }
                      </td>

                      {/* 52-week range */}
                      <td className="mk-td mk-td-r mk-hide-md">
                        {hasData
                          ? <RangeBar low={q!.fiftyTwoWeekLow} high={q!.fiftyTwoWeekHigh} current={q!.regularMarketPrice} />
                          : <span className="mk-dash">—</span>
                        }
                      </td>

                      {/* Sparkline */}
                      <td className="mk-td mk-td-r mk-hide-md">
                        {company.ticker && hasData
                          ? <Sparkline symbol={company.ticker.symbol} color={tier.color} />
                          : <span className="mk-dash">—</span>
                        }
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <p className="mk-disclaimer">
            Data provided by Yahoo Finance via yahoo-finance2. Delayed up to 15 minutes. Not financial advice.
          </p>
        </div>
      </section>

      <style>{`
        /* ── Markets page styles ─────────────────────────────────────── */

        .mk-hero {
          padding: 64px 0 56px;
          background: var(--bg-0);
          border-bottom: 1px solid var(--border);
          position: relative;
          overflow: hidden;
        }
        .mk-hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(245,183,49,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(245,183,49,0.025) 1px, transparent 1px);
          background-size: 40px 40px;
        }
        .mk-title {
          font-family: var(--mono);
          font-size: clamp(1.8rem, 4vw, 3rem);
          font-weight: 600;
          line-height: 1.1;
          letter-spacing: -0.02em;
          margin-bottom: 16px;
          position: relative;
        }
        .mk-title-accent { color: var(--yellow); }
        .mk-sub {
          font-family: var(--serif);
          font-size: 1rem;
          color: var(--text-1);
          max-width: 520px;
          line-height: 1.7;
          margin-bottom: 36px;
          position: relative;
        }
        .mk-hero-stats { display: flex; gap: 40px; position: relative; }
        .mk-stat-n { font-family: var(--mono); font-size: 1.6rem; font-weight: 600; color: var(--yellow); line-height: 1; }
        .mk-stat-l { font-size: 10px; color: var(--text-2); letter-spacing: 0.08em; margin-top: 4px; }

        /* ── Tabs ── */
        .mk-tabs-wrap {
          background: var(--bg-1);
          border-bottom: 1px solid var(--border);
          position: sticky;
          top: 62px;
          z-index: 50;
        }
        .mk-tabs {
          display: flex;
          gap: 2px;
          overflow-x: auto;
          padding: 8px 0;
          scrollbar-width: none;
        }
        .mk-tabs::-webkit-scrollbar { display: none; }
        .mk-tab {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 7px 14px;
          background: transparent;
          border: 1px solid transparent;
          border-radius: var(--r);
          cursor: pointer;
          white-space: nowrap;
          transition: all var(--t);
          font-family: var(--mono);
        }
        .mk-tab:hover { background: var(--bg-card); border-color: var(--border); }
        .mk-tab-active {
          background: var(--tbg) !important;
          border-color: var(--tbr) !important;
        }
        .mk-tab-level {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.06em;
          color: var(--text-2);
        }
        .mk-tab-name { font-size: 12px; color: var(--text-1); }
        .mk-tab-active .mk-tab-name { color: var(--text-0); }

        /* ── Section ── */
        .mk-section { padding: 36px 0 80px; background: var(--bg-1); }

        .mk-tier-hd {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }
        .mk-tier-label { font-family: var(--mono); font-size: 1rem; font-weight: 600; }
        .mk-tier-tag { font-size: 12px; color: var(--text-1); margin-top: 3px; }
        .mk-tier-meta { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
        .mk-pill {
          font-family: var(--mono);
          font-size: 10px;
          font-weight: 600;
          padding: 3px 10px;
          border-radius: 100px;
        }
        .mk-pill-dim { background: var(--bg-card); color: var(--text-2); border: 1px solid var(--border); }
        .mk-updated { font-family: var(--mono); font-size: 10px; color: var(--text-2); }
        .mk-refresh {
          width: 28px; height: 28px;
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--r);
          color: var(--text-1);
          cursor: pointer;
          font-size: 14px;
          display: flex; align-items: center; justify-content: center;
          transition: all var(--t);
        }
        .mk-refresh:hover { color: var(--yellow); border-color: var(--border-yellow); }
        .mk-refresh:disabled { opacity: 0.4; cursor: default; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .mk-spin { display: inline-block; animation: spin 0.8s linear infinite; }

        /* ── Controls ── */
        .mk-controls { display: flex; align-items: center; gap: 16px; margin-bottom: 16px; flex-wrap: wrap; }
        .mk-search-wrap { position: relative; flex: 1; min-width: 220px; max-width: 380px; }
        .mk-search-icon {
          position: absolute; left: 11px; top: 50%; transform: translateY(-50%);
          color: var(--text-2); font-size: 16px; pointer-events: none;
        }
        .mk-search {
          width: 100%;
          background: var(--bg-card);
          border: 1px solid var(--border-md);
          border-radius: var(--r);
          padding: 8px 12px 8px 32px;
          font-family: var(--mono);
          font-size: 12px;
          color: var(--text-0);
          outline: none;
          transition: border-color var(--t);
          -webkit-appearance: none; appearance: none;
        }
        .mk-search::placeholder { color: var(--text-2); }
        .mk-search:focus { border-color: var(--border-yellow); }

        /* Data load progress bar */
        .mk-load-bar {
          height: 2px;
          background: var(--border);
          border-radius: 2px;
          width: 120px;
          overflow: hidden;
          flex-shrink: 0;
        }
        .mk-load-fill {
          height: 100%;
          background: var(--yellow);
          border-radius: 2px;
          transition: width 0.4s ease;
        }

        .mk-error {
          background: var(--red-bg);
          border: 1px solid var(--border-red);
          border-radius: var(--r);
          padding: 10px 14px;
          font-family: var(--mono);
          font-size: 12px;
          color: var(--red);
          margin-bottom: 16px;
        }

        /* ── Table ── */
        .mk-table-wrap {
          overflow-x: auto;
          border: 1px solid var(--border);
          border-radius: var(--rl);
          background: var(--bg-card);
        }
        .mk-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 12.5px;
        }
        .mk-th {
          font-family: var(--mono);
          font-size: 9.5px;
          font-weight: 600;
          letter-spacing: 0.12em;
          color: var(--text-2);
          padding: 10px 14px;
          text-align: left;
          border-bottom: 1px solid var(--border);
          white-space: nowrap;
          cursor: pointer;
          user-select: none;
          background: var(--bg-0);
          transition: color var(--t);
        }
        .mk-th:hover { color: var(--text-1); }
        .mk-th-r { text-align: right; }
        .mk-th-name { min-width: 200px; }

        .mk-sort-icon { font-size: 10px; margin-left: 4px; }
        .mk-sort-none { color: var(--text-2); opacity: 0.5; }
        .mk-sort-active { color: var(--yellow); }

        .mk-row {
          border-bottom: 1px solid var(--border);
          transition: background var(--t);
        }
        .mk-row:last-child { border-bottom: none; }
        .mk-row:hover { background: var(--bg-card-h); }
        .mk-row-unlisted { opacity: 0.5; }
        .mk-row-unlisted:hover { opacity: 0.7; }

        .mk-td {
          padding: 11px 14px;
          color: var(--text-0);
          vertical-align: middle;
        }
        .mk-td-r { text-align: right; }
        .mk-td-name { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }

        .mk-co-link {
          color: var(--text-0);
          font-weight: 500;
          transition: color var(--t);
          text-decoration: none;
        }
        .mk-co-link:hover { color: var(--yellow); }
        .mk-country {
          font-family: var(--mono);
          font-size: 9px;
          color: var(--text-2);
          background: var(--bg-2);
          border: 1px solid var(--border);
          border-radius: 3px;
          padding: 1px 5px;
        }
        .mk-symbol {
          font-family: var(--mono);
          font-size: 11px;
          font-weight: 600;
          color: var(--yellow);
          letter-spacing: 0.05em;
        }
        .mk-private {
          font-family: var(--mono);
          font-size: 9px;
          color: var(--text-2);
          letter-spacing: 0.08em;
        }
        .mk-exchange {
          font-family: var(--mono);
          font-size: 10px;
          color: var(--text-2);
          white-space: nowrap;
        }
        .mk-price {
          font-family: var(--mono);
          font-size: 13px;
          font-weight: 600;
          white-space: nowrap;
        }
        .mk-change { font-family: var(--mono); font-size: 11px; white-space: nowrap; line-height: 1.4; }
        .mk-pct { font-size: 10px; opacity: 0.8; }
        .mk-pos { color: #aaff00; }
        .mk-neg { color: var(--red); }
        .mk-vol, .mk-mcap { font-family: var(--mono); font-size: 11px; color: var(--text-1); }
        .mk-dash { color: var(--text-2); }

        /* State badge */
        .mk-state {
          font-family: var(--mono);
          font-size: 8px;
          font-weight: 600;
          letter-spacing: 0.1em;
          padding: 1px 5px;
          border-radius: 3px;
        }
        .mk-state-pre { background: var(--amber-bg); color: var(--amber); border: 1px solid var(--border-amber); }
        .mk-state-post { background: var(--amber-bg); color: var(--amber); border: 1px solid var(--border-amber); }
        .mk-state-closed { background: var(--bg-2); color: var(--text-2); border: 1px solid var(--border); }

        /* Skeleton loaders */
        @keyframes shimmer {
          0% { opacity: 0.3; } 50% { opacity: 0.6; } 100% { opacity: 0.3; }
        }
        .mk-skel {
          display: inline-block;
          width: 60px; height: 14px;
          background: var(--bg-2);
          border-radius: 3px;
          animation: shimmer 1.2s ease-in-out infinite;
        }
        .mk-skel-sm { width: 40px; height: 12px; }

        /* 52-week range bar */
        .mk-range-wrap { min-width: 120px; }
        .mk-range-track {
          position: relative;
          height: 3px;
          background: var(--bg-2);
          border-radius: 2px;
          margin-bottom: 4px;
        }
        .mk-range-fill {
          position: absolute;
          left: 0; top: 0; bottom: 0;
          background: var(--yellow);
          border-radius: 2px;
          opacity: 0.4;
        }
        .mk-range-dot {
          position: absolute;
          top: 50%;
          transform: translate(-50%, -50%);
          width: 7px; height: 7px;
          background: var(--yellow);
          border-radius: 50%;
          border: 1px solid var(--bg-0);
        }
        .mk-range-labels {
          display: flex;
          justify-content: space-between;
          font-family: var(--mono);
          font-size: 9px;
          color: var(--text-2);
        }

        /* Sparkline */
        .mk-spark { display: block; }
        .mk-spark-empty { display: inline-block; width: 80px; height: 28px; }

        /* Empty state */
        .mk-empty {
          padding: 40px;
          text-align: center;
          color: var(--text-2);
          font-family: var(--mono);
          font-size: 12px;
        }

        /* Disclaimer */
        .mk-disclaimer {
          margin-top: 20px;
          font-size: 11px;
          color: var(--text-2);
          font-family: var(--mono);
          letter-spacing: 0.03em;
        }

        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .mk-spin { animation: none; }
          .mk-skel { animation: none; opacity: 0.4; }
          .mk-load-fill { transition: none; }
        }

        /* Responsive hide */
        @media (max-width: 1000px) {
          .mk-th-hide-md, .mk-hide-md { display: none; }
        }
        @media (max-width: 640px) {
          .mk-th-hide-sm, .mk-hide-sm { display: none; }
          .mk-tabs { gap: 1px; }
          .mk-tab { padding: 5px 10px; }
          .mk-tab-name { display: none; }
        }
      `}</style>
    </>
  )
}