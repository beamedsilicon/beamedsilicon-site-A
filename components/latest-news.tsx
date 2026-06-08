const ARTICLES = [
  {
    cls: "c1",
    badgeCls: "b-c",
    badge: "MEMORY",
    date: "Jun 5, 2026",
    title: "HBM4 Shortage Set to Deepen: SK Hynix and Samsung Warn Supply Gap Persists into 2027",
    excerpt:
      "SK Hynix posted a record Q1 2026 operating margin of 72% — surpassing Nvidia's 65% — as its entire HBM capacity sold out months in advance. Samsung's memory chief confirmed shortages across DRAM products will continue through at least 2027, with customers signing multi-year contracts to secure allocation. The pivot to HBM is now consuming 23% of global DRAM wafer output.",
    readTime: "8 min read",
    href: "/news/hbm4-shortage-2026",
  },
  {
    cls: "c2",
    badgeCls: "b-a",
    badge: "FOUNDRY",
    date: "May 28, 2026",
    title: "TSMC's 2nm Ramp: CoWoS Yields Hit 98%, Five New Fabs Breaking Ground Simultaneously",
    excerpt:
      "At its 2026 Technology Symposium, TSMC disclosed that its 5.5-reticle CoWoS advanced packaging — the largest in the industry — has exceeded 98% yield in volume production. The company is launching five new fabrication plants in 2026 and projects 70% compound annual growth in 2nm capacity through 2028. All three 2nm fabs carry lead times of 78–104 weeks, fully booked.",
    readTime: "11 min read",
    href: "/news/tsmc-2nm-cowos-2026",
  },
  {
    cls: "c3",
    badgeCls: "b-r",
    badge: "GEOPOLITICS",
    date: "Apr 28, 2026",
    title: "The MATCH Act: Washington Moves to Ban DUV Lithography Exports to China",
    excerpt:
      "US lawmakers introduced the Multilateral Alignment of Technology Controls on Hardware (MATCH) Act, targeting ASML's DUV immersion systems — the last class of lithography equipment still legally flowing to Chinese fabs. The bill would also ban servicing of already-installed equipment in China, threatening a portion of ASML's high-margin service revenue. China accounts for roughly 20% of ASML's projected 2026 sales.",
    readTime: "9 min read",
    href: "/news/match-act-duv-china-2026",
  },
]

export function LatestNews() {
  return (
    <section className="news">
      <div className="wrap">
        <div className="sec-head">
          <span className="sec-label">LATEST ANALYSIS</span>
          <div className="sec-rule" />
          <a href="/news" className="sec-more">ALL STORIES →</a>
        </div>
        <div className="grid-3">
          {ARTICLES.map((a) => (
            <a key={a.title} href={a.href} className={`art-card ${a.cls}`}
              style={{ textDecoration: "none", color: "inherit" }}>
              <div className="card-meta">
                <span className={`badge ${a.badgeCls}`}>{a.badge}</span>
                <span className="art-date">{a.date}</span>
              </div>
              <h3 className="card-title">{a.title}</h3>
              <p className="card-excerpt">{a.excerpt}</p>
              <div className="card-foot">
                <span className="rt">{a.readTime}</span>
                <span className="arr">→</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}