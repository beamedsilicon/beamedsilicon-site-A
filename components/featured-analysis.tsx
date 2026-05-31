const SCV_NODES = [
  { dot: "#f5a623", label: "LASER — LEVEL 4", name: "TRUMPF CO₂ Driver Laser", line: "linear-gradient(#f5a623,#9b7cff)" },
  { dot: "#9b7cff", label: "OPTICS — LEVEL 4", name: "Carl Zeiss SMT Lens Block", line: "linear-gradient(#9b7cff,#c77dff)" },
  { dot: "#c77dff", label: "TOOL — LEVEL 3", name: "ASML TWINSCAN EXE:5000", line: "linear-gradient(#c77dff,#4a9eff)" },
  { dot: "#4a9eff", label: "FOUNDRY — LEVEL 2", name: "TSMC N2 / Intel Foundry 18A", line: "linear-gradient(#4a9eff,#00d4ff)" },
  { dot: "#00d4ff", label: "CHIP DESIGNER — LEVEL 1", name: "Nvidia · Apple · AMD · AWS", line: null },
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
              <span className="badge b-c">EQUIPMENT</span>
              <span className="badge b-a">SUPPLY RISK</span>
              <span className="art-date">May 28, 2026</span>
            </div>
            <h2 className="feat-title">
              ASML&apos;s High-NA EUV Ramp: What the 10th EXE:5000 Delivery Means for TSMC and Intel Foundry
            </h2>
            <p className="feat-excerpt">
              Every ASML EUV machine depends on Carl Zeiss SMT for its lens block and TRUMPF for the CO₂ laser that
              generates EUV light — a two-supplier constraint that governs the entire lithography roadmap. As TSMC
              places orders for N2-class High-NA tooling and Intel Foundry races to qualify 18A, we examine the optics
              and laser supply chain that will determine which fab wins advanced node leadership through 2028.
            </p>
            <div className="feat-foot">
              <div className="author">
                <div className="av">SR</div>
                <div>
                  <div className="av-n">Soren Rathmann</div>
                  <div className="av-t">Equipment &amp; Lithography Analyst</div>
                </div>
              </div>
              <a href="#" className="read-link">
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
                    <div style={{ width: "1px", height: "16px", margin: "0 auto 6px", background: node.line }} />
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
