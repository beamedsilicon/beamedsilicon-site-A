"use client"
import Link from "next/link"
import type { MouseEvent } from "react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { FULL_ARTICLES } from "@/lib/full-articles"
import type { FullArticle } from "@/lib/full-articles"

interface Props {
  article: FullArticle
}

export function ArticleView({ article }: Props) {
  const others = FULL_ARTICLES.filter((a) => a.slug !== article.slug).slice(0, 3)

  return (
    <>
      <SiteHeader />
      <main>

        {/* HERO */}
        <section style={{
          padding: "60px 0 52px", background: "var(--bg-0)",
          borderBottom: "1px solid var(--border)", position: "relative", overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: "linear-gradient(rgba(255,215,0,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,215,0,0.025) 1px,transparent 1px)",
            backgroundSize: "52px 52px",
          }} />
          <div style={{
            position: "absolute", top: -100, right: "5%", width: 500, height: 500,
            background: "radial-gradient(circle," + article.categoryBg + " 0%,transparent 70%)",
            pointerEvents: "none",
          }} />
          <div className="wrap" style={{ position: "relative", zIndex: 1, maxWidth: 900 }}>

            <Link href="/analysis" style={{
              display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 28,
              fontFamily: "var(--mono)", fontSize: "10px", fontWeight: 600,
              letterSpacing: "0.1em", color: "var(--text-2)", textDecoration: "none",
            }}>
              ← ANALYSIS
            </Link>

            {/* Badges */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
              <span style={{
                fontFamily: "var(--mono)", fontSize: "9.5px", fontWeight: 600,
                letterSpacing: "0.12em", padding: "4px 10px", borderRadius: 3,
                background: article.categoryBg, color: article.categoryColor,
                border: "1px solid " + article.categoryBorder,
              }}>
                {article.badge}
              </span>
              {article.tiers.map((t) => (
                <span key={t} style={{
                  fontFamily: "var(--mono)", fontSize: "9px", fontWeight: 600,
                  padding: "3px 8px", borderRadius: 3,
                  background: "rgba(245,183,49,0.06)", color: "var(--text-2)",
                  border: "1px solid rgba(245,183,49,0.1)",
                }}>
                  {t}
                </span>
              ))}
              <span style={{ fontFamily: "var(--mono)", fontSize: "10px", color: "var(--text-2)", marginLeft: 4 }}>
                {article.date}
              </span>
              <span style={{ fontFamily: "var(--mono)", fontSize: "10px", color: "var(--text-2)" }}>
                · {article.readTime}
              </span>
            </div>

            {/* Title */}
            <h1 style={{
              fontFamily: "var(--serif)", fontSize: "clamp(1.6rem,3.5vw,2.4rem)",
              fontWeight: 600, lineHeight: 1.18, letterSpacing: "-0.01em",
              marginBottom: 18, color: "var(--text-0)", maxWidth: 820,
            }}>
              {article.title}
            </h1>

            {/* Subtitle */}
            <p style={{
              fontFamily: "var(--serif)", fontSize: "1.1rem", fontWeight: 300,
              color: "var(--text-1)", lineHeight: 1.65, maxWidth: 720, marginBottom: 32,
            }}>
              {article.subtitle}
            </p>

            {/* Author */}
            <div style={{
              display: "flex", alignItems: "center", gap: 12,
              paddingTop: 22, borderTop: "1px solid var(--border)",
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: "50%",
                background: article.categoryBg, border: "1px solid " + article.categoryBorder,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "var(--mono)", fontSize: "10px", fontWeight: 700,
                color: article.categoryColor, flexShrink: 0,
              }}>
                BS
              </div>
              <div>
                <div style={{ fontFamily: "var(--mono)", fontSize: "11px", fontWeight: 600, color: "var(--text-0)" }}>
                  Beamed Silicon
                </div>
                <div style={{ fontFamily: "var(--mono)", fontSize: "9.5px", color: "var(--text-2)", marginTop: 2 }}>
                  Semiconductor Intelligence
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BODY */}
        <section style={{ padding: "64px 0 80px", background: "var(--bg-1)" }}>
          <div className="wrap av-grid">

            {/* Left: Article content */}
            <div>

              {/* Intro paragraph */}
              <p style={{
                fontFamily: "var(--serif)", fontSize: "1.15rem", fontWeight: 400,
                color: "var(--text-0)", lineHeight: 1.78,
                marginBottom: 48, paddingBottom: 40,
                borderBottom: "1px solid var(--border)",
                borderLeft: "3px solid " + article.categoryColor,
                paddingLeft: 20,
              }}>
                {article.intro}
              </p>

              {/* Sections */}
              {article.sections.map((section, si) => (
                <div key={si} style={{ marginBottom: 52 }}>
                  <h2 style={{
                    fontFamily: "var(--mono)", fontSize: "0.9rem", fontWeight: 600,
                    letterSpacing: "0.04em", color: article.categoryColor,
                    marginBottom: 20, paddingBottom: 12,
                    borderBottom: "1px solid " + article.categoryBorder,
                  }}>
                    {section.heading}
                  </h2>
                  {section.paragraphs.map((p, pi) => (
                    <p key={pi} style={{
                      fontFamily: "var(--serif)", fontSize: "1.02rem", fontWeight: 300,
                      color: "var(--text-0)", lineHeight: 1.82,
                      marginBottom: pi < section.paragraphs.length - 1 ? 22 : 0,
                    }}>
                      {p}
                    </p>
                  ))}
                </div>
              ))}

              {/* Sources */}
              <div style={{ marginTop: 64, paddingTop: 32, borderTop: "1px solid var(--border)" }}>
                <div style={{
                  fontFamily: "var(--mono)", fontSize: "9.5px", fontWeight: 600,
                  letterSpacing: "0.18em", color: "var(--text-2)", marginBottom: 20,
                }}>
                  SOURCES &amp; FURTHER READING
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {article.sources.map((src, i) => (
                    <a
                      key={i}
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "flex", alignItems: "flex-start", gap: 12,
                        padding: "12px 16px",
                        background: "var(--bg-card)",
                        border: "1px solid var(--border)",
                        borderRadius: "var(--r)",
                        textDecoration: "none",
                        transition: "border-color .15s, background .15s",
                      }}
                      onMouseEnter={(e: MouseEvent<HTMLAnchorElement>) => {
                        const el = e.currentTarget
                        el.style.borderColor = article.categoryColor
                        el.style.background = "var(--bg-card-h)"
                      }}
                      onMouseLeave={(e: MouseEvent<HTMLAnchorElement>) => {
                        const el = e.currentTarget
                        el.style.borderColor = "var(--border)"
                        el.style.background = "var(--bg-card)"
                      }}
                    >
                      <span style={{
                        fontFamily: "var(--mono)", fontSize: "8.5px", fontWeight: 600,
                        color: article.categoryColor, flexShrink: 0, marginTop: 2,
                        background: article.categoryBg,
                        border: "1px solid " + article.categoryBorder,
                        padding: "2px 6px", borderRadius: 2,
                      }}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div style={{ flex: 1 }}>
                        <div style={{
                          fontFamily: "var(--sans)", fontSize: "12.5px",
                          color: "var(--text-0)", lineHeight: 1.4, marginBottom: 4,
                        }}>
                          {src.title}
                        </div>
                        <div style={{
                          fontFamily: "var(--mono)", fontSize: "9.5px", color: "var(--text-2)",
                          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                          maxWidth: 480,
                        }}>
                          {src.url}
                        </div>
                      </div>
                      <span style={{ fontSize: 12, color: "var(--text-2)", flexShrink: 0, marginTop: 2 }}>↗</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Sidebar */}
            <aside className="av-sidebar">

              {/* Key stats */}
              <div style={{
                background: "var(--bg-card)", border: "1px solid var(--border)",
                borderRadius: "var(--rl)", overflow: "hidden", marginBottom: 20,
              }}>
                <div style={{
                  padding: "14px 18px",
                  background: article.categoryBg,
                  borderBottom: "1px solid " + article.categoryBorder,
                  fontFamily: "var(--mono)", fontSize: "9px", fontWeight: 600,
                  letterSpacing: "0.16em", color: article.categoryColor,
                }}>
                  KEY STATISTICS
                </div>
                <div>
                  {article.keyStats.map((stat, i) => (
                    <div key={i} style={{
                      padding: "14px 18px",
                      borderBottom: i < article.keyStats.length - 1 ? "1px solid var(--border)" : "none",
                    }}>
                      <div style={{
                        fontFamily: "var(--mono)", fontSize: "1.25rem", fontWeight: 600,
                        color: "var(--yellow)", lineHeight: 1, marginBottom: 5,
                      }}>
                        {stat.value}
                      </div>
                      <div style={{
                        fontFamily: "var(--mono)", fontSize: "8.5px", fontWeight: 600,
                        letterSpacing: "0.1em", color: "var(--text-2)",
                      }}>
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tiers covered */}
              <div style={{
                background: "var(--bg-card)", border: "1px solid var(--border)",
                borderRadius: "var(--rl)", overflow: "hidden", marginBottom: 20,
              }}>
                <div style={{
                  padding: "14px 18px", borderBottom: "1px solid var(--border)",
                  fontFamily: "var(--mono)", fontSize: "9px", fontWeight: 600,
                  letterSpacing: "0.16em", color: "var(--text-2)",
                }}>
                  SUPPLY CHAIN TIERS COVERED
                </div>
                <div style={{ padding: "16px 18px", display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {["T1","T2","T3","T4","T5","T6","T7"].map((t) => {
                    const active = article.tiers.includes(t)
                    return (
                      <span key={t} style={{
                        fontFamily: "var(--mono)", fontSize: "11px", fontWeight: 600,
                        padding: "6px 12px", borderRadius: 4,
                        background: active ? article.categoryBg : "transparent",
                        color: active ? article.categoryColor : "var(--text-2)",
                        border: active
                          ? "1px solid " + article.categoryBorder
                          : "1px solid var(--border)",
                      }}>
                        {t}
                      </span>
                    )
                  })}
                </div>
              </div>

              <Link href="/analysis" style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                padding: "12px 18px",
                background: "var(--yellow-bg)",
                border: "1px solid var(--border-yellow)",
                borderRadius: "var(--r)",
                fontFamily: "var(--mono)", fontSize: "10.5px", fontWeight: 600,
                letterSpacing: "0.08em", color: "var(--yellow)", textDecoration: "none",
              }}>
                ← BACK TO ALL ANALYSIS
              </Link>
            </aside>
          </div>
        </section>

        {/* MORE ARTICLES */}
        {others.length > 0 && (
          <section style={{
            padding: "56px 0", background: "var(--bg-0)",
            borderTop: "1px solid var(--border)",
          }}>
            <div className="wrap">
              <div className="sec-head">
                <span className="sec-label">MORE ANALYSIS</span>
                <div className="sec-rule" />
                <Link href="/analysis" style={{
                  fontFamily: "var(--mono)", fontSize: "10.5px",
                  color: "var(--text-2)", textDecoration: "none",
                }}>
                  ALL ARTICLES →
                </Link>
              </div>
              <div className="av-more-grid">
                {others.map((a) => (
                  <Link
                    key={a.slug}
                    href={"/analysis/" + a.slug}
                    style={{
                      display: "flex", flexDirection: "column",
                      background: "var(--bg-card)", border: "1px solid var(--border)",
                      borderRadius: "var(--rl)", padding: "20px",
                      textDecoration: "none", color: "inherit",
                      transition: "border-color .15s, transform .15s, background .15s",
                    }}
                    onMouseEnter={(e: MouseEvent<HTMLAnchorElement>) => {
                      const el = e.currentTarget
                      el.style.borderColor = a.categoryColor
                      el.style.transform = "translateY(-2px)"
                      el.style.background = "var(--bg-card-h)"
                    }}
                    onMouseLeave={(e: MouseEvent<HTMLAnchorElement>) => {
                      const el = e.currentTarget
                      el.style.borderColor = "var(--border)"
                      el.style.transform = "translateY(0)"
                      el.style.background = "var(--bg-card)"
                    }}
                  >
                    <span style={{
                      fontFamily: "var(--mono)", fontSize: "8.5px", fontWeight: 600,
                      letterSpacing: "0.1em", padding: "2px 7px", borderRadius: 2,
                      background: a.categoryBg, color: a.categoryColor,
                      border: "1px solid " + a.categoryBorder,
                      marginBottom: 12, alignSelf: "flex-start",
                    }}>
                      {a.badge}
                    </span>
                    <div style={{
                      fontFamily: "var(--serif)", fontSize: "0.96rem", fontWeight: 600,
                      lineHeight: 1.35, color: "var(--text-0)", marginBottom: 10, flex: 1,
                    }}>
                      {a.title}
                    </div>
                    <div style={{
                      fontFamily: "var(--mono)", fontSize: "9.5px", color: "var(--text-2)",
                      display: "flex", justifyContent: "space-between",
                      paddingTop: 12, borderTop: "1px solid var(--border)",
                    }}>
                      <span>{a.date}</span>
                      <span>{a.readTime}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* DISCLAIMER */}
        <section style={{ padding: "24px 0", background: "var(--bg-0)", borderTop: "1px solid var(--border)" }}>
          <div className="wrap">
            <p style={{
              fontFamily: "var(--mono)", fontSize: "10px",
              color: "var(--text-2)", lineHeight: 1.7, maxWidth: 720,
            }}>
              Published by Beamed Silicon Intelligence. Analysis reflects publicly available information as of publication date. Nothing herein constitutes investment advice.
            </p>
          </div>
        </section>

      </main>
      <SiteFooter />
    </>
  )
}