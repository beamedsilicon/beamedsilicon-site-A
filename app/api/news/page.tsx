"use client"
import { useState, useEffect, useCallback } from "react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { TIERS } from "@/lib/tiers"

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────
interface Article {
  article_id:  string
  title:       string
  link:        string
  description: string | null
  pubDate:     string
  image_url:   string | null
  source_name: string
  source_icon: string | null
  creator:     string[] | null
  category:    string[]
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
function fmtDate(s: string) {
  try {
    return new Date(s).toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric",
    })
  } catch { return s.split(" ")[0] }
}

// ─────────────────────────────────────────────────────────────────────────────
// Tier tab config
// ─────────────────────────────────────────────────────────────────────────────
const TABS = [
  { key: "all",  short: "ALL",  label: "All Semiconductor News", color: "#f5b731", cbg: "rgba(245,183,49,0.08)", cbr: "rgba(245,183,49,0.3)"  },
  ...TIERS.map(t => ({ key: String(t.level), short: `T${t.level}`, label: t.name, color: t.color, cbg: t.cbg, cbr: t.cbr })),
]

// ─────────────────────────────────────────────────────────────────────────────
// Article card
// ─────────────────────────────────────────────────────────────────────────────
function ArticleCard({ a, color }: { a: Article; color: string }) {
  return (
    <a
      href={a.link}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "flex", flexDirection: "column",
        background: "var(--bg-card)", border: "1px solid var(--border)",
        borderRadius: "var(--rl)", padding: "24px 22px",
        textDecoration: "none", color: "inherit",
        transition: "border-color .18s ease, transform .18s ease, background .18s ease",
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement
        el.style.borderColor = color
        el.style.transform   = "translateY(-2px)"
        el.style.background  = "var(--bg-card-h)"
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement
        el.style.borderColor = "var(--border)"
        el.style.transform   = "translateY(0)"
        el.style.background  = "var(--bg-card)"
      }}
    >
      {/* Source row */}
      <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 12 }}>
        {a.source_icon && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={a.source_icon} alt="" width={13} height={13}
            style={{ borderRadius: 2, opacity: 0.65, flexShrink: 0 }}
          />
        )}
        <span style={{
          fontFamily: "var(--mono)", fontSize: "10px",
          color: "var(--text-2)", flex: 1, overflow: "hidden",
          textOverflow: "ellipsis", whiteSpace: "nowrap",
        }}>
          {a.source_name}
        </span>
        <span style={{ fontFamily: "var(--mono)", fontSize: "10px", color: "var(--text-2)", flexShrink: 0 }}>
          {fmtDate(a.pubDate)}
        </span>
      </div>

      {/* Optional image */}
      {a.image_url && (
        <div style={{
          width: "100%", height: 140, marginBottom: 14,
          borderRadius: 6, overflow: "hidden",
          background: "var(--bg-2)",
        }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={a.image_url} alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.85 }}
            onError={e => { (e.currentTarget.parentElement as HTMLElement).style.display = "none" }}
          />
        </div>
      )}

      {/* Title */}
      <h3 style={{
        fontFamily: "var(--serif)", fontSize: "1.02rem", fontWeight: 600,
        lineHeight: 1.35, marginBottom: 10,
      }}>
        {a.title}
      </h3>

      {/* Description */}
      {a.description && (
        <p style={{
          fontFamily: "var(--serif)", fontSize: "0.875rem", fontWeight: 300,
          color: "var(--text-1)", lineHeight: 1.68, marginBottom: 16,
          display: "-webkit-box", WebkitLineClamp: 3,
          WebkitBoxOrient: "vertical" as const, overflow: "hidden",
        }}>
          {a.description}
        </p>
      )}

      {/* Footer */}
      <div style={{
        marginTop: "auto", paddingTop: 13,
        borderTop: "1px solid var(--border)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap" as const }}>
          {a.category.slice(0, 2).map(cat => (
            <span key={cat} style={{
              fontFamily: "var(--mono)", fontSize: "8.5px", fontWeight: 600,
              letterSpacing: "0.1em", padding: "2px 7px", borderRadius: 3,
              background: "var(--yellow-bg)", color: "var(--yellow)",
              border: "1px solid var(--border-yellow)", textTransform: "uppercase" as const,
            }}>
              {cat}
            </span>
          ))}
        </div>
        <span style={{ fontSize: 14, color: "var(--text-2)", transition: "color .18s" }}>→</span>
      </div>
    </a>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Skeleton card
// ─────────────────────────────────────────────────────────────────────────────
function Skeleton() {
  const bars = [["70%", 10], ["100%", 52], ["100%", 12], ["88%", 12], ["55%", 12]] as const
  return (
    <div style={{
      background: "var(--bg-card)", border: "1px solid var(--border)",
      borderRadius: "var(--rl)", padding: "24px 22px",
      display: "flex", flexDirection: "column", gap: 12,
    }}>
      {bars.map(([w, h], i) => (
        <div key={i} style={{
          width: w, height: h, borderRadius: 4,
          background: "rgba(245,183,49,0.06)",
          animation: `sk 1.6s ease-in-out ${i * 0.1}s infinite`,
        }} />
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────────
export default function NewsPage() {
  const [activeTier, setActiveTier] = useState("all")
  const [search,     setSearch]     = useState("")
  const [articles,   setArticles]   = useState<Article[]>([])
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState<string | null>(null)
  const [nextPage,   setNextPage]   = useState<string | null>(null)
  const [moreLoading, setMoreLoading] = useState(false)

  const activeTab  = TABS.find(t => t.key === activeTier) ?? TABS[0]
  const activeTierObj = TIERS.find(t => String(t.level) === activeTier)

  // ── Fetch ────────────────────────────────────────────────────────────────
  const fetchNews = useCallback(async (
    tier: string, company: string, page?: string
  ) => {
    const isMore = !!page
    if (isMore) setMoreLoading(true)
    else { setLoading(true); setArticles([]) }
    setError(null)

    const p = new URLSearchParams()
    if (tier !== "all") p.set("tier", tier)
    if (company.trim()) p.set("company", company.trim())
    if (page) p.set("nextPage", page)

    try {
      const res  = await fetch(`/api/news?${p}`)
      if (!res.ok) throw new Error(`Server error ${res.status}`)
      const data = await res.json()
      if (data.status !== "success") throw new Error(data.message ?? "API error")
      if (isMore) setArticles(prev => [...prev, ...(data.results ?? [])])
      else        setArticles(data.results ?? [])
      setNextPage(data.nextPage ?? null)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load news")
    } finally {
      if (isMore) setMoreLoading(false)
      else        setLoading(false)
    }
  }, [])

  // Reload when tier changes (and no active search)
  useEffect(() => {
    if (!search) fetchNews(activeTier, "")
  }, [activeTier]) // eslint-disable-line react-hooks/exhaustive-deps

  // Debounced search
  useEffect(() => {
    if (!search) { fetchNews(activeTier, ""); return }
    const t = setTimeout(() => fetchNews(activeTier, search), 600)
    return () => clearTimeout(t)
  }, [search]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleTierChange = (key: string) => {
    setActiveTier(key)
    setSearch("")
  }

  return (
    <>
      {/* Skeleton keyframe */}
      <style>{`@keyframes sk{0%,100%{opacity:.4;}50%{opacity:.85;}}`}</style>

      <SiteHeader />
      <main>

        {/* ── PAGE HEADER ─────────────────────────────────────────────────── */}
        <section style={{
          padding: "60px 0 44px",
          background: "var(--bg-0)",
          borderBottom: "1px solid var(--border)",
          position: "relative", overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: "linear-gradient(rgba(255,215,0,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,215,0,.025) 1px,transparent 1px)",
            backgroundSize: "52px 52px",
          }} />
          <div className="wrap" style={{ position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <span style={{ width: 22, height: 1, background: "var(--yellow)", display: "block" }} />
              <span style={{
                fontFamily: "var(--mono)", fontSize: "9.5px", fontWeight: 600,
                letterSpacing: "0.22em", color: "var(--yellow)",
              }}>LIVE SEMICONDUCTOR NEWS</span>
            </div>
            <h1 style={{
              fontFamily: "var(--mono)", fontSize: "clamp(1.8rem,4vw,2.8rem)",
              fontWeight: 600, lineHeight: 1.1, letterSpacing: "-.02em", marginBottom: 12,
            }}>
              News for <span style={{ color: "var(--yellow)" }}>350 Companies</span>
            </h1>
            <p style={{
              fontFamily: "var(--serif)", fontSize: "1rem", fontWeight: 300,
              color: "var(--text-1)", maxWidth: 520, lineHeight: 1.75,
            }}>
              Live headlines from newsdata.io filtered by supply chain tier — or search any company directly.
            </p>
          </div>
        </section>

        {/* ── TIER TABS ────────────────────────────────────────────────────── */}
        <section style={{
          background: "var(--bg-1)", borderBottom: "1px solid var(--border)",
          overflowX: "auto", WebkitOverflowScrolling: "touch" as const,
        }}>
          <div style={{
            display: "flex", gap: 2, padding: "0 28px",
            minWidth: "max-content",
          }}>
            {TABS.map(tab => {
              const active = tab.key === activeTier
              return (
                <button
                  key={tab.key}
                  onClick={() => handleTierChange(tab.key)}
                  style={{
                    fontFamily: "var(--mono)", fontSize: "11px", fontWeight: 600,
                    letterSpacing: "0.06em",
                    padding: "14px 18px",
                    background: active ? tab.cbg : "transparent",
                    color: active ? tab.color : "var(--text-2)",
                    border: "none",
                    borderBottom: active ? `2px solid ${tab.color}` : "2px solid transparent",
                    cursor: "pointer",
                    transition: "color .18s, background .18s, border-color .18s",
                    whiteSpace: "nowrap" as const,
                  }}
                  title={tab.label}
                >
                  {tab.short}
                </button>
              )
            })}
          </div>
        </section>

        {/* ── SEARCH + META ────────────────────────────────────────────────── */}
        <section style={{
          background: "var(--bg-0)", borderBottom: "1px solid var(--border)",
          padding: "18px 0",
        }}>
          <div className="wrap" style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" as const }}>
            <input
              type="text"
              placeholder={
                activeTierObj
                  ? `Search within ${activeTierObj.name}…`
                  : "Search any of 350 companies…"
              }
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                background: "var(--bg-card)", border: "1px solid var(--border-md)",
                borderRadius: "var(--r)", padding: "9px 15px",
                fontFamily: "var(--mono)", fontSize: "13px", color: "var(--text-0)",
                outline: "none", width: 340, transition: "border-color .18s",
              }}
              onFocus={e => (e.target.style.borderColor = "var(--border-yellow)")}
              onBlur={e  => (e.target.style.borderColor = "var(--border-md)")}
            />
            {/* Tier chip */}
            <span style={{
              fontFamily: "var(--mono)", fontSize: "10px", fontWeight: 600,
              padding: "4px 12px", borderRadius: 100,
              background: activeTab.cbg, color: activeTab.color,
              border: `1px solid ${activeTab.cbr}`,
            }}>
              {activeTab.label}
            </span>
            {activeTierObj && !search && (
              <span style={{ fontFamily: "var(--mono)", fontSize: "10px", color: "var(--text-2)" }}>
                Querying top companies · {activeTierObj.cos.length} total in tier
              </span>
            )}
            {!loading && !error && articles.length > 0 && (
              <span style={{ fontFamily: "var(--mono)", fontSize: "10px", color: "var(--text-2)", marginLeft: "auto" }}>
                {articles.length} articles loaded
              </span>
            )}
          </div>
        </section>

        {/* ── CONTENT ─────────────────────────────────────────────────────── */}
        <section style={{ padding: "48px 0", background: "var(--bg-1)", minHeight: 500 }}>
          <div className="wrap">

            {/* Loading */}
            {loading && (
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(3,1fr)",
                gap: 18,
              }}>
                {[0, 1, 2, 3, 4, 5].map(i => <Skeleton key={i} />)}
              </div>
            )}

            {/* Error */}
            {!loading && error && (
              <div style={{
                background: "var(--bg-card)", border: "1px solid var(--border-red)",
                borderRadius: "var(--rl)", padding: "36px 32px", textAlign: "center" as const,
              }}>
                <div style={{ fontFamily: "var(--mono)", fontSize: "12px", color: "var(--red)", marginBottom: 8 }}>
                  FAILED TO LOAD NEWS
                </div>
                <p style={{ fontFamily: "var(--serif)", color: "var(--text-1)", marginBottom: 20 }}>{error}</p>
                <button
                  onClick={() => fetchNews(activeTier, search)}
                  style={{
                    fontFamily: "var(--mono)", fontSize: "11px", fontWeight: 600,
                    letterSpacing: "0.08em", color: "var(--bg-0)",
                    background: "var(--yellow)", border: "none",
                    padding: "9px 20px", borderRadius: "var(--r)", cursor: "pointer",
                  }}
                >
                  RETRY →
                </button>
              </div>
            )}

            {/* Empty */}
            {!loading && !error && articles.length === 0 && (
              <div style={{
                textAlign: "center" as const, padding: "64px 0",
                color: "var(--text-2)",
              }}>
                <div style={{ fontFamily: "var(--mono)", fontSize: "11px", letterSpacing: "0.12em", marginBottom: 10 }}>
                  NO RESULTS
                </div>
                <p style={{ fontFamily: "var(--serif)", fontSize: "0.95rem" }}>
                  No news found for this query. Try a different tier or company name.
                </p>
              </div>
            )}

            {/* Articles grid */}
            {!loading && !error && articles.length > 0 && (
              <>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3,1fr)",
                  gap: 18,
                  marginBottom: 36,
                }}>
                  {articles.map(a => (
                    <ArticleCard key={a.article_id} a={a} color={activeTab.color} />
                  ))}
                </div>

                {/* Load more */}
                {nextPage && (
                  <div style={{ textAlign: "center" as const }}>
                    <button
                      onClick={() => fetchNews(activeTier, search, nextPage)}
                      disabled={moreLoading}
                      style={{
                        fontFamily: "var(--mono)", fontSize: "11.5px", fontWeight: 600,
                        letterSpacing: "0.08em",
                        color: moreLoading ? "var(--text-2)" : "var(--bg-0)",
                        background: moreLoading ? "transparent" : "var(--yellow)",
                        border: moreLoading ? "1px solid var(--border)" : "none",
                        padding: "11px 28px", borderRadius: "var(--r)",
                        cursor: moreLoading ? "default" : "pointer",
                        transition: "opacity .18s",
                      }}
                    >
                      {moreLoading ? "LOADING…" : "LOAD MORE →"}
                    </button>
                  </div>
                )}
              </>
            )}

          </div>
        </section>

        {/* Disclaimer */}
        <section style={{ padding: "24px 0", background: "var(--bg-0)", borderTop: "1px solid var(--border)" }}>
          <div className="wrap">
            <p style={{
              fontFamily: "var(--mono)", fontSize: "10px", color: "var(--text-2)", lineHeight: 1.7,
            }}>
              News sourced from newsdata.io · Results cached 15 min · Free tier: 200 req/day ·
              Showing top 6 companies per tier for tier-level queries
            </p>
          </div>
        </section>

      </main>
      <SiteFooter />
    </>
  )
}