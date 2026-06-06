import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { MarketsClient } from "@/components/markets-client"

const MARKET_SEGMENTS = [
  { name:"Logic / Advanced Node", size:"$198B", growth:"+14.2%", leader:"TSMC · Samsung · Intel Foundry", color:"#00d4ff", cbg:"rgba(0,212,255,0.08)", cbr:"rgba(0,212,255,0.28)", note:"N2/3nm ramp driving record capex. TSMC holds ~60% advanced logic share." },
  { name:"Memory (DRAM + NAND)", size:"$154B", growth:"+22.8%", leader:"SK Hynix · Samsung · Micron", color:"#4a9eff", cbg:"rgba(74,158,255,0.08)", cbr:"rgba(74,158,255,0.28)", note:"HBM4 demand from AI accelerators tightening DRAM supply through 2026." },
  { name:"Semiconductor Equipment", size:"$112B", growth:"+9.6%", leader:"ASML · Applied Materials · Lam Research", color:"#9b7cff", cbg:"rgba(155,124,255,0.08)", cbr:"rgba(155,124,255,0.28)", note:"High-NA EUV backlog extends 18–24 months. Etch and deposition orders surging." },
  { name:"Analog & Power", size:"$88B", growth:"+5.1%", leader:"Texas Instruments · Infineon · STMicro", color:"#c77dff", cbg:"rgba(199,125,255,0.08)", cbr:"rgba(199,125,255,0.28)", note:"SiC power devices growing 30%+ YoY on EV and industrial demand." },
  { name:"Process Materials", size:"$76B", growth:"+7.3%", leader:"Shin-Etsu · JSR · Sumco", color:"#00e0a0", cbg:"rgba(0,224,160,0.08)", cbr:"rgba(0,224,160,0.28)", note:"Advanced photoresist allocation remains constrained at leading edge nodes." },
  { name:"Packaging & Assembly", size:"$52B", growth:"+18.4%", leader:"ASE Group · Amkor · JCET", color:"#f5a623", cbg:"rgba(245,166,35,0.08)", cbr:"rgba(245,166,35,0.28)", note:"CoWoS and SoIC capacity fully booked through 2026. New fabs ramping." },
  { name:"Raw Materials & Mining", size:"$34B", growth:"+3.8%", leader:"Sibelco · Wacker Chemie · Lynas", color:"#ff6b35", cbg:"rgba(255,107,53,0.08)", cbr:"rgba(255,107,53,0.28)", note:"Spruce Pine quartz monopoly and rare earth geopolitics remain key risk factors." },
]

const KEY_METRICS = [
  { label:"GLOBAL SEMI MARKET 2025", value:"$714B", delta:"+12.4% YoY" },
  { label:"WAFER SHIPMENTS (300MM EQ.)", value:"16,200", unit:"K WSE/MO", delta:"+4.1% YoY" },
  { label:"EQUIPMENT BOOK-TO-BILL", value:"1.18", delta:"Above parity" },
  { label:"HBM MARKET CAGR 2024–28", value:"41%", delta:"AI-driven" },
]

const RISK_ITEMS = [
  { tier:"SUPPLY", color:"#ff5555", cbg:"rgba(255,85,85,0.08)", cbr:"rgba(255,85,85,0.28)", title:"CoWoS Packaging Bottleneck", body:"TSMC advanced packaging capacity is fully allocated through mid-2026, creating a hard ceiling on AI accelerator shipments regardless of die availability." },
  { tier:"POLICY", color:"#ffaa00", cbg:"rgba(255,170,0,0.08)", cbr:"rgba(255,170,0,0.28)", title:"Export Control Expansion", body:"BIS Entity List additions continue to fragment the global equipment market. ASML, Applied Materials, and Lam face growing compliance overhead in China." },
  { tier:"MATERIAL", color:"#f5b731", cbg:"rgba(245,183,49,0.08)", cbr:"rgba(245,183,49,0.28)", title:"Specialty Gas Tightness", body:"Neon, krypton, and xenon supply chains remain exposed to geopolitical disruption. Single-source dependencies at Tier 6 carry outsized risk." },
]

export default function MarketsPage() {
  return (
    <>
      <SiteHeader />
      <main>

        {/* PAGE HEADER */}
        <section style={{ padding:"64px 0 48px", background:"var(--bg-0)", borderBottom:"1px solid var(--border)", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", inset:0, backgroundImage:"linear-gradient(rgba(255,215,0,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,215,0,0.025) 1px,transparent 1px)", backgroundSize:"52px 52px" }} />
          <div className="wrap" style={{ position:"relative", zIndex:1 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:18 }}>
              <span style={{ width:22, height:1, background:"var(--yellow)", display:"block" }} />
              <span style={{ fontFamily:"var(--mono)", fontSize:"9.5px", fontWeight:600, letterSpacing:"0.22em", color:"var(--yellow)" }}>MARKET INTELLIGENCE</span>
            </div>
            <h1 style={{ fontFamily:"var(--mono)", fontSize:"clamp(1.8rem,4vw,3rem)", fontWeight:600, lineHeight:1.1, letterSpacing:"-.02em", marginBottom:14 }}>
              Semiconductor<br /><span style={{ color:"var(--yellow)" }}>Market Overview</span>
            </h1>
            <p style={{ fontFamily:"var(--serif)", fontSize:"1rem", fontWeight:300, color:"var(--text-1)", maxWidth:560, lineHeight:1.75 }}>
              Size, growth, and supply risk across all 7 tiers of the semiconductor value chain. Updated weekly from primary source filings and industry data.
            </p>
          </div>
        </section>

        {/* KEY METRICS */}
        <section style={{ padding:"48px 0", borderBottom:"1px solid var(--border)", background:"var(--bg-1)" }}>
          <div className="wrap">
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:2 }}>
              {KEY_METRICS.map(m => (
                <div key={m.label} style={{ background:"var(--bg-card)", border:"1px solid var(--border)", borderRadius:"var(--r)", padding:"24px 22px" }}>
                  <div style={{ fontFamily:"var(--mono)", fontSize:"9px", fontWeight:600, letterSpacing:"0.16em", color:"var(--text-2)", marginBottom:10 }}>{m.label}</div>
                  <div style={{ fontFamily:"var(--mono)", fontSize:"2rem", fontWeight:600, color:"var(--yellow)", lineHeight:1 }}>
                    {m.value}{m.unit && <span style={{ fontSize:"0.9rem", marginLeft:4, opacity:0.7 }}>{m.unit}</span>}
                  </div>
                  <div style={{ fontFamily:"var(--mono)", fontSize:"10px", color:"var(--text-1)", marginTop:6 }}>{m.delta}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* MARKET SEGMENTS */}
        <section style={{ padding:"64px 0", background:"var(--bg-0)", borderBottom:"1px solid var(--border)" }}>
          <div className="wrap">
            <div className="sec-head">
              <span className="sec-label">MARKET SEGMENTS</span>
              <div className="sec-rule" />
              <span style={{ fontFamily:"var(--mono)", fontSize:"10px", color:"var(--text-2)" }}>2025 ESTIMATES</span>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:3 }}>
              {MARKET_SEGMENTS.map((seg, i) => (
                <div key={seg.name} style={{ background:"var(--bg-card)", border:"1px solid var(--border)", borderRadius:"var(--rl)", padding:"20px 24px", display:"grid", gridTemplateColumns:"32px 1fr auto auto", gap:"0 20px", alignItems:"center" }}>
                  <div style={{ width:32, height:32, borderRadius:6, background:seg.cbg, border:`1px solid ${seg.cbr}`, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"var(--mono)", fontSize:"10px", fontWeight:600, color:seg.color, flexShrink:0 }}>T{i+1}</div>
                  <div>
                    <div style={{ fontFamily:"var(--mono)", fontSize:"13px", fontWeight:600, color:seg.color, marginBottom:3 }}>{seg.name}</div>
                    <div style={{ fontSize:"11.5px", color:"var(--text-1)", lineHeight:1.5 }}>{seg.note}</div>
                    <div style={{ fontFamily:"var(--mono)", fontSize:"10px", color:"var(--text-2)", marginTop:4 }}>{seg.leader}</div>
                  </div>
                  <div style={{ textAlign:"right", flexShrink:0 }}>
                    <div style={{ fontFamily:"var(--mono)", fontSize:"12px", fontWeight:600, color:"#aaff00", marginBottom:2 }}>{seg.growth}</div>
                    <div style={{ fontFamily:"var(--mono)", fontSize:"9px", color:"var(--text-2)", letterSpacing:"0.08em" }}>YoY GROWTH</div>
                  </div>
                  <div style={{ textAlign:"right", flexShrink:0, minWidth:70 }}>
                    <div style={{ fontFamily:"var(--mono)", fontSize:"1.35rem", fontWeight:600, color:"var(--yellow)", lineHeight:1 }}>{seg.size}</div>
                    <div style={{ fontFamily:"var(--mono)", fontSize:"9px", color:"var(--text-2)", marginTop:3, letterSpacing:"0.08em" }}>MARKET SIZE</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* LIVE STOCK PRICES */}
        <section style={{ padding:"64px 0", background:"var(--bg-1)", borderBottom:"1px solid var(--border)" }}>
          <div className="wrap">
            <div className="sec-head">
              <span className="sec-label">LIVE STOCK PRICES</span>
              <div className="sec-rule" />
              <span style={{ fontFamily:"var(--mono)", fontSize:"10px", color:"var(--text-2)" }}>BY SUPPLY CHAIN TIER</span>
            </div>
            <MarketsClient />
          </div>
        </section>

        {/* RISK RADAR */}
        <section style={{ padding:"64px 0", background:"var(--bg-2)", borderBottom:"1px solid var(--border)" }}>
          <div className="wrap">
            <div className="sec-head">
              <span className="sec-label">SUPPLY CHAIN RISK RADAR</span>
              <div className="sec-rule" />
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16 }}>
              {RISK_ITEMS.map(r => (
                <div key={r.title} style={{ background:"var(--bg-card)", border:`1px solid ${r.cbr}`, borderRadius:"var(--rl)", padding:"26px 24px" }}>
                  <div style={{ display:"inline-flex", marginBottom:14, fontFamily:"var(--mono)", fontSize:"9.5px", fontWeight:600, letterSpacing:"0.1em", padding:"3px 9px", borderRadius:3, background:r.cbg, color:r.color, border:`1px solid ${r.cbr}` }}>{r.tier}</div>
                  <div style={{ fontFamily:"var(--serif)", fontSize:"1.05rem", fontWeight:600, lineHeight:1.3, marginBottom:10 }}>{r.title}</div>
                  <p style={{ fontFamily:"var(--serif)", fontSize:"0.875rem", fontWeight:300, color:"var(--text-1)", lineHeight:1.7 }}>{r.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* DISCLAIMER */}
        <section style={{ padding:"32px 0", background:"var(--bg-0)" }}>
          <div className="wrap">
            <p style={{ fontFamily:"var(--mono)", fontSize:"10px", color:"var(--text-2)", lineHeight:1.7, maxWidth:720 }}>
              Market size estimates based on IDC, Gartner, SEMI, and company guidance as of Q1 2026. Stock data sourced from Yahoo Finance, delayed ~15 minutes, for informational purposes only. This page does not constitute investment advice.
            </p>
          </div>
        </section>

      </main>
      <SiteFooter />
    </>
  )
}