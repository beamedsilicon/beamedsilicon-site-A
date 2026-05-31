const ARTICLES = [
  {
    cls: "c1",
    badgeCls: "b-c",
    badge: "MEMORY",
    date: "May 26, 2026",
    title: "Samsung vs SK Hynix: Who Controls the AI Memory Stack in 2026",
    excerpt:
      "Both Samsung Foundry and SK Hynix are racing to supply HBM4 to Nvidia and AMD — but thermal compression bonding yield at Hanmi Semiconductor is becoming the deciding variable.",
    readTime: "10 min read",
  },
  {
    cls: "c2",
    badgeCls: "b-a",
    badge: "MATERIALS",
    date: "May 23, 2026",
    title: "Ajinomoto's ABF Film Monopoly: The Single-Source Risk in Every Advanced Package",
    excerpt:
      "Every Intel, TSMC, and AMD package using flip-chip BGA requires Ajinomoto Build-up Film. There is no qualified substitute. We map the scale of this extraordinary single-source dependency.",
    readTime: "8 min read",
  },
  {
    cls: "c3",
    badgeCls: "b-r",
    badge: "GEOPOLITICS",
    date: "May 20, 2026",
    title: "China's Equipment Independence Race: Naura, AMEC, and the 14nm Ceiling",
    excerpt:
      "Naura Technology Group and AMEC are China's answer to Applied Materials and Lam Research. We assess how far domestic CVD and etch tools have come — and where the hard ceiling remains.",
    readTime: "14 min read",
  },
]

export function LatestNews() {
  return (
    <section className="news">
      <div className="wrap">
        <div className="sec-head">
          <span className="sec-label">LATEST NEWS</span>
          <div className="sec-rule" />
          <a href="#" className="sec-more">
            ALL STORIES →
          </a>
        </div>
        <div className="grid-3">
          {ARTICLES.map((a) => (
            <div className={`art-card ${a.cls}`} key={a.title}>
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
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
