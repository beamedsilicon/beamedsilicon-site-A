import type { Metadata } from "next"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { FULL_ARTICLES } from "@/lib/full-articles"

export const metadata: Metadata = {
  title: "Analysis",
  description: "In-depth technical and market analysis of the semiconductor supply chain.",
}

export default function AnalysisPage() {
  return (
    <>
      <SiteHeader />
      <main>

        {/* PAGE HEADER */}
        <section style={{
          padding: "64px 0 48px", background: "var(--bg-0)",
          borderBottom: "1px solid var(--border)", position: "relative", overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: "linear-gradient(rgba(255,215,0,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,215,0,0.025) 1px,transparent 1px)",
            backgroundSize: "52px 52px",
          }} />
          <div className="wrap" style={{ position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
              <span style={{ width: 22, height: 1, background: "var(--yellow)", display: "block" }} />
              <span style={{
                fontFamily: "var(--mono)", fontSize: "9.5px", fontWeight: 600,
                letterSpacing: "0.22em", color: "var(--yellow)",
              }}>
                SEMICONDUCTOR INTELLIGENCE
              </span>
            </div>
            <h1 style={{
              fontFamily: "var(--mono)", fontSize: "clamp(1.8rem,4vw,3rem)",
              fontWeight: 600, lineHeight: 1.1, letterSpacing: "-.02em", marginBottom: 14,
            }}>
              Analysis &amp; <span style={{ color: "var(--yellow)" }}>Deep Dives</span>
            </h1>
            <p style={{
              fontFamily: "var(--serif)", fontSize: "1rem", fontWeight: 300,
              color: "var(--text-1)", maxWidth: 560, lineHeight: 1.75,
            }}>
              Technical and market analysis across all 7 tiers of the semiconductor supply
              chain. {FULL_ARTICLES.length} articles and growing.
            </p>
          </div>
        </section>

        {/* ARTICLES GRID */}
        <section style={{ padding: "64px 0", background: "var(--bg-1)" }}>
          <div className="wrap">
            <div className="grid-3">
              {FULL_ARTICLES.map((article) => (
                <Link
                  key={article.slug}
                  href={`/analysis/${article.slug}`}
                  className="art-card c1"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div className="card-meta">
                    <span
                      className="badge"
                      style={{
                        background: article.categoryBg,
                        color: article.categoryColor,
                        border: `1px solid ${article.categoryBorder}`,
                      }}
                    >
                      {article.badge}
                    </span>
                    <span className="art-date">{article.date}</span>
                  </div>
                  <h2 className="card-title">{article.title}</h2>
                  <p className="card-excerpt">{article.subtitle}</p>
                  <div className="card-foot">
                    <span className="rt">{article.readTime}</span>
                    <span className="arr">→</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* DISCLAIMER */}
        <section style={{ padding: "24px 0", background: "var(--bg-0)", borderTop: "1px solid var(--border)" }}>
          <div className="wrap">
            <p style={{
              fontFamily: "var(--mono)", fontSize: "10px",
              color: "var(--text-2)", lineHeight: 1.7, maxWidth: 720,
            }}>
              Published by Beamed Silicon Intelligence. Analysis reflects publicly available
              information as of publication date. Nothing herein constitutes investment advice.
            </p>
          </div>
        </section>

      </main>
      <SiteFooter />
    </>
  )
}