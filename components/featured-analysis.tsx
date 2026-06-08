const SCV_NODES = [
  { dot: "#f5a623", label: "MINING — TIER 7",   name: "Sibelco Spruce Pine Quartz → SiO₂ feedstock",       line: "linear-gradient(#f5a623,#00e0a0)" },
  { dot: "#00e0a0", label: "MATERIALS — TIER 6", name: "Shin-Etsu Chemical → 300mm silicon wafer",          line: "linear-gradient(#00e0a0,#9b7cff)" },
  { dot: "#9b7cff", label: "EQUIPMENT — TIER 3", name: "ASML High-NA EUV → N2 / A16 lithography",          line: "linear-gradient(#9b7cff,#4a9eff)" },
  { dot: "#4a9eff", label: "FOUNDRY — TIER 2",   name: "TSMC N2 (Fab 20/22) → 2nm die at $30K/wafer",      line: "linear-gradient(#4a9eff,#c77dff)" },
  { dot: "#c77dff", label: "PACKAGING — TIER 2", name: "TSMC CoWoS 5.5× reticle → 98% yield, 50+ wk lead", line: "linear-gradient(#c77dff,#00d4ff)" },
  { dot: "#00d4ff", label: "DESIGNER — TIER 1",  name: "Nvidia Rubin / Apple A20 → end silicon",            line: null },
]

export function FeaturedAnalysis() {
  return (
    <section className="featured">
      <div className="wrap">
        <div className="sec-head">
          <span className="sec-label">FEATURED ANALYSIS</span>
          <div className="sec-rule" />
        </div>
        <div className="feat-card">
          <div className="feat-body">
            <div className="feat-meta">
              <span className="badge b-c">FOUNDRY</span>
              <span className="badge b-a">PACKAGING</span>
              <span className="art-date">May 28, 2026</span>
            </div>
            <h2 className="feat-title">
              TSMC's 2nm Bottleneck: Why CoWoS, Not the Wafer, Is Now the Constraint That Governs the AI Hardware Roadmap
            </h2>
            <p className="feat-excerpt">
              TSMC's N2 node entered volume production in early 2026 with wafer costs exceeding $30,000 — a 50% step-up
              from N3. But the harder constraint is no longer the front-end wafer: it is the CoWoS advanced packaging
              step that bonds logic die to HBM stacks. All six CoWoS lines carry 50+ week lead times, and TSMC's
              AI packaging capacity must grow 80% this year just to keep pace with demand. We trace the full vertical
              from Spruce Pine quartz through silicon wafer growth, EUV exposure, and CoWoS assembly — and map
              exactly where the next two years of AI chip supply will be won or lost.
            </p>
            <div className="feat-foot">
              <div className="author">
                <div className="av">SR</div>
                <div>
                  <div className="av-n">Soren Rathmann</div>
                  <div className="av-t">Foundry &amp; Packaging Analyst</div>
                </div>
              </div>
              <a href="/analysis/tsmc-2nm-cowos-constraint" className="read-link">
                READ ANALYSIS →
              </a>
            </div>
          </div>
          <div className="feat-panel">
            <div className="scv">
              {SCV_NODES.map((node) => (
                <div key={node.name}>
                  <div className="scv-node">
                    <div className="ndot" style={{ background: node.dot }} />
                    <div>
                      <div className="nlabel">{node.label}</div>
                      <div className="nname">{node.name}</div>
                    </div>
                  </div>
                  {node.line && (
                    <div style={{ width: 1, height: 16, margin: "0 auto 6px", background: node.line }} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}