"use client"
import { useState, useMemo } from "react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────
interface Author {
  initials: string
  name: string
  title: string
}

interface Article {
  slug: string
  category: CategoryKey
  badge: string
  badgeColor: string
  badgeBg: string
  badgeBorder: string
  date: string
  dateSort: string
  title: string
  excerpt: string
  readTime: string
  author: Author
  tiers: string[]
  featured?: boolean
}

type CategoryKey = "analysis" | "market" | "policy" | "technology" | "supply" | "memory"

// ─────────────────────────────────────────────────────────────────────────────
// Category config
// ─────────────────────────────────────────────────────────────────────────────
const CATEGORIES = [
  { key: "all",        label: "ALL",         color: "#f5b731", cbg: "rgba(245,183,49,0.08)",  cbr: "rgba(245,183,49,0.3)"  },
  { key: "analysis",   label: "ANALYSIS",    color: "#f5b731", cbg: "rgba(245,183,49,0.08)",  cbr: "rgba(245,183,49,0.3)"  },
  { key: "market",     label: "MARKET",      color: "#aaff00", cbg: "rgba(170,255,0,0.07)",   cbr: "rgba(170,255,0,0.25)"  },
  { key: "policy",     label: "POLICY",      color: "#ff5555", cbg: "rgba(255,85,85,0.08)",   cbr: "rgba(255,85,85,0.3)"   },
  { key: "technology", label: "TECHNOLOGY",  color: "#00d4ff", cbg: "rgba(0,212,255,0.07)",   cbr: "rgba(0,212,255,0.28)"  },
  { key: "supply",     label: "SUPPLY CHAIN",color: "#f5a623", cbg: "rgba(245,166,35,0.08)",  cbr: "rgba(245,166,35,0.28)" },
  { key: "memory",     label: "MEMORY",      color: "#4a9eff", cbg: "rgba(74,158,255,0.08)",  cbr: "rgba(74,158,255,0.28)" },
] as const

type TabKey = "all" | CategoryKey

function getCatStyle(key: CategoryKey) {
  return CATEGORIES.find(c => c.key === key) ?? CATEGORIES[1]
}

// ─────────────────────────────────────────────────────────────────────────────
// Authors
// ─────────────────────────────────────────────────────────────────────────────
const AUTHORS: Record<string, Author> = {
  SR: { initials: "SR", name: "Soren Rathmann",    title: "Foundry & Packaging Analyst" },
  LK: { initials: "LK", name: "Lena Kvist",        title: "Memory & Storage Analyst" },
  MT: { initials: "MT", name: "Marcus Toh",         title: "Policy & Trade Intelligence" },
  YS: { initials: "YS", name: "Yuki Sato",          title: "Equipment & Materials Lead" },
  AW: { initials: "AW", name: "Anika Wolfe",        title: "Power & Analog Analyst" },
  JC: { initials: "JC", name: "James Chen",         title: "Supply Chain Risk Lead" },
}

// ─────────────────────────────────────────────────────────────────────────────
// Article data — 22 articles
// ─────────────────────────────────────────────────────────────────────────────
const ARTICLES: Article[] = [
  {
    slug: "tsmc-2nm-cowos-constraint",
    category: "analysis",
    badge: "FOUNDRY · PACKAGING",
    badgeColor: "#f5b731",
    badgeBg: "rgba(245,183,49,0.08)",
    badgeBorder: "rgba(245,183,49,0.3)",
    date: "May 28, 2026",
    dateSort: "2026-05-28",
    title: "TSMC's 2nm Bottleneck: Why CoWoS, Not the Wafer, Is Now the Constraint That Governs the AI Hardware Roadmap",
    excerpt: "TSMC's N2 node entered volume production in early 2026 with wafer costs exceeding $30,000 — a 50% step-up from N3. But the harder constraint is no longer the front-end wafer: it is the CoWoS advanced packaging step that bonds logic die to HBM stacks. All six CoWoS lines carry 50+ week lead times, and TSMC's AI packaging capacity must grow 80% this year just to keep pace with demand. We trace the full vertical from Spruce Pine quartz through silicon wafer growth, EUV exposure, and CoWoS assembly — and map exactly where the next two years of AI chip supply will be won or lost.",
    readTime: "14 min read",
    author: AUTHORS.SR,
    tiers: ["T1", "T2", "T3"],
    featured: true,
  },
  {
    slug: "hbm4-shortage-2026",
    category: "memory",
    badge: "MEMORY · HBM",
    badgeColor: "#4a9eff",
    badgeBg: "rgba(74,158,255,0.08)",
    badgeBorder: "rgba(74,158,255,0.28)",
    date: "Jun 5, 2026",
    dateSort: "2026-06-05",
    title: "HBM4 Shortage Set to Deepen: SK Hynix and Samsung Warn Supply Gap Persists into 2027",
    excerpt: "SK Hynix posted a record Q1 2026 operating margin of 72% — surpassing Nvidia's 65% — as its entire HBM capacity sold out months in advance. Samsung's memory chief confirmed shortages across DRAM products will continue through at least 2027, with customers signing multi-year contracts to secure allocation. The pivot to HBM is now consuming 23% of global DRAM wafer output, squeezing commodity DDR5 supply and raising server DRAM contract pricing for the first time in six quarters.",
    readTime: "9 min read",
    author: AUTHORS.LK,
    tiers: ["T2", "T6"],
  },
  {
    slug: "match-act-duv-china-2026",
    category: "policy",
    badge: "POLICY · EXPORT CONTROL",
    badgeColor: "#ff5555",
    badgeBg: "rgba(255,85,85,0.08)",
    badgeBorder: "rgba(255,85,85,0.3)",
    date: "Apr 28, 2026",
    dateSort: "2026-04-28",
    title: "The MATCH Act: Washington Moves to Ban DUV Lithography Exports to China — and Serviceability Is the Real Target",
    excerpt: "US lawmakers introduced the Multilateral Alignment of Technology Controls on Hardware Act, targeting ASML's DUV immersion systems. The bill would also ban servicing of already-installed equipment in China, threatening a portion of ASML's high-margin service revenue. China accounts for roughly 20% of ASML's projected 2026 sales. Our analysis models three scenarios for ASML EPS impact and maps the likely Chinese workaround strategies — AMEC, Naura, and domestic alternatives — and why none close the gap before 2030.",
    readTime: "11 min read",
    author: AUTHORS.MT,
    tiers: ["T3"],
  },
  {
    slug: "asml-high-na-euv-monopoly",
    category: "technology",
    badge: "EUV · LITHOGRAPHY",
    badgeColor: "#00d4ff",
    badgeBg: "rgba(0,212,255,0.07)",
    badgeBorder: "rgba(0,212,255,0.28)",
    date: "May 14, 2026",
    dateSort: "2026-05-14",
    title: "ASML's High-NA EUV: Anatomy of the Most Important Machine Ever Built — and the Monopoly It Guarantees",
    excerpt: "The NXE:5000 weighs 150 tonnes, requires 40 shipping containers to deliver, and costs approximately €350 million per unit. Only one company can build it. We go inside the full supply chain: Carl Zeiss SMT's six-axis aberration-corrected lens system, TRUMPF's 30 kW CO₂ laser, Cymer's light source, the VDL-machined wafer stage accurate to 0.1 nanometres, and ASML's own software integration layer. The competitive moat is so wide that even a partial catch-up would take a decade minimum — and that's before counting the 5,000-company supplier ecosystem locked into the platform.",
    readTime: "13 min read",
    author: AUTHORS.YS,
    tiers: ["T3", "T4", "T5"],
  },
  {
    slug: "sic-ev-correction-opportunity",
    category: "market",
    badge: "POWER · SIC",
    badgeColor: "#aaff00",
    badgeBg: "rgba(170,255,0,0.07)",
    badgeBorder: "rgba(170,255,0,0.25)",
    date: "May 7, 2026",
    dateSort: "2026-05-07",
    title: "SiC Power Devices: Why the EV Correction Won't Kill the Semiconductor Opportunity — It Will Accelerate Consolidation",
    excerpt: "Global EV unit sales missed consensus by 14% in 2025, triggering a brutal destocking cycle that pushed Wolfspeed's stock down 60% and forced onsemi to revise its SiC revenue guidance sharply lower. Yet the structural SiC thesis remains intact: each 800V EV platform requires 4× the SiC content of a 400V design, and the transition to 800V is accelerating across Hyundai, Porsche, and the Chinese OEMs. We model the inventory-clearing timeline, rank the survivors — Infineon, STMicro, onsemi, Rohm — and identify where the next substrate shortage will emerge as capacity investments from 2023–2025 come online sequentially.",
    readTime: "10 min read",
    author: AUTHORS.AW,
    tiers: ["T2", "T7"],
  },
  {
    slug: "spruce-pine-supply-chain-risk",
    category: "supply",
    badge: "SUPPLY RISK · MATERIALS",
    badgeColor: "#f5a623",
    badgeBg: "rgba(245,166,35,0.08)",
    badgeBorder: "rgba(245,166,35,0.28)",
    date: "Apr 15, 2026",
    dateSort: "2026-04-15",
    title: "Spruce Pine, North Carolina: The Single Geographic Point of Failure in the Entire Global Semiconductor Supply Chain",
    excerpt: "A small mountain town of 2,200 people in western North Carolina sits at the nexus of roughly 70% of the world's supply of high-purity quartz — the material from which crucibles are made for silicon crystal growth. Without Spruce Pine quartz, silicon wafer production halts. Without wafers, every chip fab on the planet stops. The 2024 flooding came within metres of permanently disrupting global semiconductor production for 12–18 months. We profile Sibelco, The Quartz Corp, and the geological reality that makes alternative sourcing effectively impossible within any relevant timeframe.",
    readTime: "8 min read",
    author: AUTHORS.JC,
    tiers: ["T6", "T7"],
  },
  {
    slug: "photoresist-allocation-chokepoint",
    category: "supply",
    badge: "SUPPLY RISK · MATERIALS",
    badgeColor: "#f5a623",
    badgeBg: "rgba(245,166,35,0.08)",
    badgeBorder: "rgba(245,166,35,0.28)",
    date: "Mar 22, 2026",
    dateSort: "2026-03-22",
    title: "Advanced Photoresist Allocation: The Hidden Chokepoint at the Leading Edge That No One Is Talking About",
    excerpt: "EUV and High-NA EUV require metal-oxide resists that can resolve sub-5nm features. JSR Corporation, Tokyo Ohka Kogyo, and Shin-Etsu Chemical collectively supply approximately 92% of the world's advanced photoresist. When JSR was taken private by the Japanese government in 2023 for national security reasons, it triggered a quiet reshuffling of allocation priorities. We map the resist supply chain — from fluoropolymer precursors through PAG synthesis — and assess what happens if Taiwan-sourced fab demand collides with Korea's aggressive leading-edge capex in the same allocation window.",
    readTime: "9 min read",
    author: AUTHORS.YS,
    tiers: ["T3", "T6"],
  },
  {
    slug: "hbm-buildout-2026-winners",
    category: "market",
    badge: "MEMORY · MARKET",
    badgeColor: "#aaff00",
    badgeBg: "rgba(170,255,0,0.07)",
    badgeBorder: "rgba(170,255,0,0.25)",
    date: "Jun 1, 2026",
    dateSort: "2026-06-01",
    title: "The 2026 HBM Buildout: Who Wins When SK Hynix, Samsung, and Micron All Scale HBM4 Capacity Simultaneously?",
    excerpt: "SK Hynix currently commands roughly 52% of HBM revenue and has parlayed that into a 20-point ASP premium over commodity DRAM. Samsung, stung by years of yield issues on HBM3, has restructured its memory division and is targeting 40 layers of 1c-DRAM stacks with Through-Silicon Via pitches below 50μm. Micron, leveraging its TSMC CoWoS relationship and Idaho fab expansion, is positioned for 2027 volume. We model the supply-demand balance under three scenarios and ask: when all three scale at once, does the HBM ASP premium collapse — or does AI demand absorb every bit they can make?",
    readTime: "12 min read",
    author: AUTHORS.LK,
    tiers: ["T2"],
  },
  {
    slug: "advanced-packaging-new-node",
    category: "technology",
    badge: "PACKAGING · TECHNOLOGY",
    badgeColor: "#00d4ff",
    badgeBg: "rgba(0,212,255,0.07)",
    badgeBorder: "rgba(0,212,255,0.28)",
    date: "Apr 3, 2026",
    dateSort: "2026-04-03",
    title: "Advanced Packaging Is the New Node: A Technical Guide to CoWoS, SoIC, Foveros, and the Chiplet Economics That Make Them Viable",
    excerpt: "When transistor density scaling slowed, the industry found a third dimension. CoWoS bonds 2.5D die side-by-side on an interposer. SoIC stacks die face-to-face with sub-micron hybrid bonding pitches. Intel's Foveros allows logic-on-logic vertical integration. The economics are counterintuitive: a chiplet approach to a 100mm² design can be 30-40% cheaper than a monolithic equivalent, purely because of yield math. We explain the physics, compare vendor approaches, and model the cost inflections that determine when chiplets win and when a monolithic die still makes sense.",
    readTime: "15 min read",
    author: AUTHORS.SR,
    tiers: ["T2", "T3"],
  },
  {
    slug: "intel-18a-comeback-or-caution",
    category: "analysis",
    badge: "IDM · FOUNDRY",
    badgeColor: "#f5b731",
    badgeBg: "rgba(245,183,49,0.08)",
    badgeBorder: "rgba(245,183,49,0.3)",
    date: "Mar 10, 2026",
    dateSort: "2026-03-10",
    title: "Intel 18A: Comeback Story or Cautionary Tale? A Rigorous Assessment of Yield, Customer Confidence, and the Foundry Credibility Gap",
    excerpt: "Intel's 18A process — featuring RibbonFET gate-all-around transistors and backside power delivery via PowerVia — is the most technically ambitious logic node in production today. Early yield reports from the Hillsboro qualification line are more encouraging than 2025's catastrophic Intel 4 narrative suggested. Yet the foundry business requires something harder to manufacture than transistors: trust. We interview supply chain contacts on design win pipeline reality, assess the ASML High-NA tool shipment schedule to Oregon, and model whether Intel Foundry can generate free cash flow before 2030.",
    readTime: "13 min read",
    author: AUTHORS.SR,
    tiers: ["T2", "T3"],
  },
  {
    slug: "china-chip-independence-smic-huawei",
    category: "policy",
    badge: "GEOPOLITICS · CHINA",
    badgeColor: "#ff5555",
    badgeBg: "rgba(255,85,85,0.08)",
    badgeBorder: "rgba(255,85,85,0.3)",
    date: "Apr 21, 2026",
    dateSort: "2026-04-21",
    title: "China's Chip Independence Race: SMIC's 7nm Ramp, Huawei's Vertical Integration Play, and Why the Gap Remains Unbridgeable Without EUV",
    excerpt: "SMIC produced its first commercial 7nm product in 2023 using multi-patterning DUV — a feat requiring 4× the mask steps of TSMC's EUV-based equivalent, with substantially higher defect densities and lower yields. Huawei's Kirin 9010 is a genuine achievement in making do without the tools the rest of the world uses. But SMIC is already capacity-constrained on its legacy 193nm ArF tools, and the yield gap on advanced 7nm versus TSMC N4 is estimated at 30-40 percentage points. We model the economic and timeline reality of China reaching N3-equivalent production without High-NA EUV — the answer is after 2035, at the earliest.",
    readTime: "11 min read",
    author: AUTHORS.MT,
    tiers: ["T2", "T3"],
  },
  {
    slug: "specialty-gas-crisis-neon-krypton",
    category: "supply",
    badge: "SUPPLY RISK · GASES",
    badgeColor: "#f5a623",
    badgeBg: "rgba(245,166,35,0.08)",
    badgeBorder: "rgba(245,166,35,0.28)",
    date: "Feb 14, 2026",
    dateSort: "2026-02-14",
    title: "The Specialty Gas Crisis: Neon, Krypton, and the Geopolitical Dependency Hidden in Every CPU Ever Made",
    excerpt: "Before Russia's invasion of Ukraine, Ukraine supplied an estimated 70% of global semiconductor-grade neon, a byproduct of Russian steel production refined to ultra-high purity by two Ukrainian facilities. Krypton and xenon follow similarly concentrated supply chains. These noble gases feed the ArF excimer lasers that expose the 80%+ of global wafer production still running on legacy DUV lithography. We trace each gas from steel plant exhaust through fractional distillation, map the current post-war sourcing landscape in South Korea, China, and the US, and assess why the new supply nodes are still running 18 months behind theoretical capacity.",
    readTime: "10 min read",
    author: AUTHORS.JC,
    tiers: ["T4", "T6", "T7"],
  },
  {
    slug: "asml-china-service-cutoff",
    category: "policy",
    badge: "POLICY · ASML",
    badgeColor: "#ff5555",
    badgeBg: "rgba(255,85,85,0.08)",
    badgeBorder: "rgba(255,85,85,0.3)",
    date: "Mar 5, 2026",
    dateSort: "2026-03-05",
    title: "ASML's China Service Exposure: Mapping the $24B Legacy Fleet and the Ticking Clock on Remote Maintenance Access",
    excerpt: "ASML has shipped over 1,200 DUV immersion and deep-UV systems into China over the past decade, representing an installed base with a replacement value exceeding $24 billion. ASML's remote diagnostics and predictive maintenance software keeps these machines running at 85–90% utilization — without it, uptime degrades to 60–70% within 18 months as Chinese field engineers lack the training depth for full self-sufficiency. The MATCH Act's service ban provision is therefore a slow-fuse constraint on Chinese fab productivity, not an immediate cliff. We model the degradation curve and assess what AMEC and Naura's 'maintenance capability' partnerships actually deliver.",
    readTime: "9 min read",
    author: AUTHORS.MT,
    tiers: ["T3"],
  },
  {
    slug: "sic-oversupply-ev-shakeout",
    category: "market",
    badge: "POWER · MARKET",
    badgeColor: "#aaff00",
    badgeBg: "rgba(170,255,0,0.07)",
    badgeBorder: "rgba(170,255,0,0.25)",
    date: "Feb 28, 2026",
    dateSort: "2026-02-28",
    title: "SiC Oversupply Warning: The Coming Shakeout in 150mm Substrate Production as 200mm Capacity Comes Online",
    excerpt: "Wolfspeed, Coherent, and SICC are collectively adding 200mm SiC boule-growth capacity on a timeline that was designed for an EV demand curve that has since been revised sharply downward. 150mm substrate pricing has already fallen 35% since Q3 2025 as Chinese producers dumped inventory. The 200mm transition matters because device yield per boule approximately doubles — but converting a 150mm fab line costs $400–600M and requires a complete retooling of the epitaxy, implant, and metallisation steps. We rank the SiC substrate producers by 200mm readiness and model which players are solvent through the trough.",
    readTime: "8 min read",
    author: AUTHORS.AW,
    tiers: ["T2", "T7"],
  },
  {
    slug: "tsmc-n2-customer-mix",
    category: "technology",
    badge: "FOUNDRY · NODE",
    badgeColor: "#00d4ff",
    badgeBg: "rgba(0,212,255,0.07)",
    badgeBorder: "rgba(0,212,255,0.28)",
    date: "May 20, 2026",
    dateSort: "2026-05-20",
    title: "N2 vs. 3nm: How TSMC's Customer Mix Is Evolving and Why Apple's First-Call Rights Shape Every Other AI Chip Roadmap",
    excerpt: "Apple consumes roughly 25% of TSMC's leading-edge capacity and historically receives first-call rights on new node qualification — meaning its A-series silicon is designed in well before competitive tapeouts can access the process. For N2, this means Nvidia's Rubin Ultra and AMD's next Instinct generation are working on capacity allocations negotiated against Apple's iPhone volume, which moves on September-locked cycles with no flexibility. We model the N2 capacity ramp, map the tapeout queue, and explain why the 2026 GPU supply ceiling for AI is fundamentally a consumer smartphone demand story.",
    readTime: "12 min read",
    author: AUTHORS.SR,
    tiers: ["T1", "T2"],
  },
  {
    slug: "rare-earth-lynas-mp-materials",
    category: "supply",
    badge: "SUPPLY CHAIN · RARE EARTH",
    badgeColor: "#f5a623",
    badgeBg: "rgba(245,166,35,0.08)",
    badgeBorder: "rgba(245,166,35,0.28)",
    date: "Jan 30, 2026",
    dateSort: "2026-01-30",
    title: "The Rare Earth Equation: Lynas, MP Materials, and Why Western Refining Capacity Is Still a Decade Behind Mining Output",
    excerpt: "China processes approximately 90% of the world's rare earth elements even though Chinese mines account for only 60% of global output — because separation and refining capability is even more concentrated than mining. Lynas Rare Earths ships ore from Mount Weld to Malaysia for cracking and separation. MP Materials in Mountain Pass, California, sold separated material to China for years before building its own refining line. Both have had qualification headaches. We map the full rare earth-to-magnet supply chain, assess the NdFeB magnet chokepoint for motors and hard drives, and model how long it takes for the Inflation Reduction Act investments to actually matter.",
    readTime: "11 min read",
    author: AUTHORS.JC,
    tiers: ["T7"],
  },
  {
    slug: "photoresist-jsr-tok-shin-etsu",
    category: "analysis",
    badge: "MATERIALS · CHEMISTRY",
    badgeColor: "#f5b731",
    badgeBg: "rgba(245,183,49,0.08)",
    badgeBorder: "rgba(245,183,49,0.3)",
    date: "Mar 18, 2026",
    dateSort: "2026-03-18",
    title: "JSR, TOK, and Shin-Etsu: Why Three Japanese Chemical Companies Hold Every Card at the Semiconductor Leading Edge",
    excerpt: "EUV photoresists are not commodity chemicals. They must resolve sub-10nm features under 13.5nm extreme ultraviolet light, survive plasma etch conditions that would destroy most organic compounds, and do so with defect densities below 0.01 per square centimetre. JSR, Tokyo Ohka Kogyo, and Shin-Etsu Chemical have each spent 30+ years accumulating the polymer synthesis and PAG chemistry know-how required. DuPont, Merck, and Fujifilm are credible second-tier players, but their market share at N3 and below is in single digits. We profile each company's technology roadmap, their relationship with ASML's resist track teams, and the insoluble geopolitical problem of Japan-concentrated supply.",
    readTime: "10 min read",
    author: AUTHORS.YS,
    tiers: ["T6"],
  },
  {
    slug: "ai-server-power-density-sic",
    category: "market",
    badge: "AI INFRA · POWER",
    badgeColor: "#aaff00",
    badgeBg: "rgba(170,255,0,0.07)",
    badgeBorder: "rgba(170,255,0,0.25)",
    date: "Jun 3, 2026",
    dateSort: "2026-06-03",
    title: "AI Server Power Density and the New SiC Opportunity: How 100kW Rack Densities Are Reshaping the Power Semiconductor Market",
    excerpt: "Nvidia's GB300 NVL72 rack draws 120kW. Hyperscalers are designing data centre infrastructure for 200kW rack densities by 2027. Every watt of AI compute demand creates a derivative power conversion problem: AC/DC rectifiers, DC/DC converters, and UPS systems must handle switching frequencies and power densities that silicon MOSFETs cannot efficiently manage above 650V. SiC MOSFETs from Infineon's CoolSiC platform and onsemi's Elite SiC series are the key enabling technology. We quantify the power semiconductor content per AI rack, model the revenue opportunity for each tier, and assess why the AI infrastructure buildout may be a larger SiC demand driver than EVs through 2028.",
    readTime: "11 min read",
    author: AUTHORS.AW,
    tiers: ["T1", "T2"],
  },
  {
    slug: "wafer-economics-300mm-vs-450mm",
    category: "technology",
    badge: "WAFER · ECONOMICS",
    badgeColor: "#00d4ff",
    badgeBg: "rgba(0,212,255,0.07)",
    badgeBorder: "rgba(0,212,255,0.28)",
    date: "Feb 5, 2026",
    dateSort: "2026-02-05",
    title: "Why 450mm Wafers Will Never Happen: The Engineering Economics of Wafer Scaling and the Unspoken Consensus in Chipmakers",
    excerpt: "The industry has been '15 years away' from 450mm wafers since 2010. The theoretical benefit is compelling: a 450mm wafer has 2.25× the area of a 300mm wafer, meaning 2.25× more die per wafer run, lowering cost per die substantially. The practical barrier is that every process tool — litho, etch, CMP, CVD — must be redesigned for the larger substrate, and the collective capital cost of a coordinated industry transition has been estimated at $250 billion. We explain why 300mm will remain the industry standard for at least 20 more years, what that means for wafer supplier concentration, and why Shin-Etsu, Sumco, and Siltronic have a structural moat no new entrant can easily bridge.",
    readTime: "8 min read",
    author: AUTHORS.YS,
    tiers: ["T6"],
  },
  {
    slug: "micron-hbm-comeback",
    category: "memory",
    badge: "MEMORY · MICRON",
    badgeColor: "#4a9eff",
    badgeBg: "rgba(74,158,255,0.08)",
    badgeBorder: "rgba(74,158,255,0.28)",
    date: "May 2, 2026",
    dateSort: "2026-05-02",
    title: "Micron's HBM Comeback: How Idaho's TSMC CoWoS Partnership and 1γ DRAM Are Positioning the US Memory Champion for 2027",
    excerpt: "Micron shipped its first commercial HBM3E samples to Nvidia in late 2024 and has since qualified across multiple AI accelerator platforms. Unlike SK Hynix and Samsung, which vertically integrate their HBM assembly using in-house CoW infrastructure, Micron outsources its HBM CoW packaging to TSMC — giving it access to TSMC's 5.5-reticle CoWoS platform at the cost of packaging slot competition. Its 1γ DRAM node, ramping in Boise, offers 15% better power efficiency than 1β generation. We model Micron's HBM market share trajectory through 2028 and assess whether its TSMC dependency is a competitive liability or a strategic shortcut.",
    readTime: "10 min read",
    author: AUTHORS.LK,
    tiers: ["T2"],
  },
  {
    slug: "chips-act-progress-report-2026",
    category: "policy",
    badge: "POLICY · CHIPS ACT",
    badgeColor: "#ff5555",
    badgeBg: "rgba(255,85,85,0.08)",
    badgeBorder: "rgba(255,85,85,0.3)",
    date: "Jan 14, 2026",
    dateSort: "2026-01-14",
    title: "CHIPS Act Progress Report 2026: What Has $52B Actually Bought America — and What the Missing Workforce Problem Could Still Undo",
    excerpt: "TSMC's Phoenix fabs are producing test wafers. Intel's Ohio fab is under construction. Samsung Austin is running an advanced packaging line. On paper, the CHIPS Act is working. In practice, the US lacks approximately 90,000 semiconductor engineers and technicians for the facilities already under construction, let alone the pipeline of investments it has unlocked. Community college semiconductor technician programs produce approximately 4,000 graduates per year nationally. We analyse the workforce gap by role and region, assess TSMC Phoenix's reliance on Taiwanese secondees, and model the timeline risk to domestic production if the talent shortage isn't resolved by 2028.",
    readTime: "12 min read",
    author: AUTHORS.MT,
    tiers: ["T2", "T3"],
  },
  {
    slug: "extreme-ultraviolet-source-physics",
    category: "technology",
    badge: "EUV · PHYSICS",
    badgeColor: "#00d4ff",
    badgeBg: "rgba(0,212,255,0.07)",
    badgeBorder: "rgba(0,212,255,0.28)",
    date: "Jan 21, 2026",
    dateSort: "2026-01-21",
    title: "EUV Source Physics: How TRUMPF and Cymer Turn Tin Droplets Into 13.5nm Light — and Why This Process Is the Rate Limiter for Global Chip Output",
    excerpt: "EUV light at 13.5nm wavelength does not exist in nature in usable quantities. ASML's light source generates it by firing a 30-kilowatt CO₂ laser, produced by TRUMPF, at tin droplets 30 micrometres in diameter falling at 70 metres per second, 50,000 times per second, inside a vacuum chamber. The resulting plasma emits EUV photons, which are then collected by a near-normal-incidence mirror and directed into the scanner's optical column. The conversion efficiency from laser energy to collected EUV light is approximately 4%. We explain the physics from first principles, profile TRUMPF's laser supply chain, Cymer's tin management system, and the collector mirror lifetime that ASML's engineers still consider their biggest reliability challenge.",
    readTime: "14 min read",
    author: AUTHORS.YS,
    tiers: ["T3", "T4"],
  },
  
  {
    slug: "euv-lithography-physics",
    category: "technology",
    badge: "EUV · PHYSICS",
    badgeColor: "#00d4ff",
    badgeBg: "rgba(0,212,255,0.07)",
    badgeBorder: "rgba(0,212,255,0.28)",
    date: "Jun 2, 2026",
    dateSort: "2026-06-02",
    title: "The Physics of Extreme Ultraviolet (EUV) Lithography",
    excerpt: "EUV operates at 13.5 nanometres — in the soft X-ray range — enabling transistors smaller than a rhinovirus. 50,000 tin droplets are fired into a vacuum every second, vaporised by a CO₂ laser into a plasma at 220,000°C, and the resulting photons are focused by Mo/Si Bragg mirrors polished to atomic perfection. We explain the full physics chain from tin droplet to printed transistor, why EUV is absorbed by everything including air, and how Carl Zeiss SMT's mirrors underpin the entire industry.",
    readTime: "13 min read",
    author: { initials: "BS", name: "Beamed Silicon", title: "Semiconductor Intelligence" },
    tiers: ["T3", "T4", "T5"],
  },
  {
    slug: "high-na-euv-055",
    category: "technology",
    badge: "EUV · HIGH-NA",
    badgeColor: "#00d4ff",
    badgeBg: "rgba(0,212,255,0.07)",
    badgeBorder: "rgba(0,212,255,0.28)",
    date: "May 30, 2026",
    dateSort: "2026-05-30",
    title: "The Transition to High-NA EUV (0.55 NA)",
    excerpt: "Standard 0.33 NA EUV hits a hard resolution ceiling around 13nm. The High-NA NXE:5000 at 0.55 NA achieves 8nm in single exposure — nearly tripling transistor density. Reaching that required anamorphic optics (4× in one axis, 8× in the other), wafer stages that accelerate at 6G, and mirrors twice as large as current tools that take a year each to manufacture. We trace the engineering decisions behind the most important lithography machine ever built.",
    readTime: "11 min read",
    author: { initials: "BS", name: "Beamed Silicon", title: "Semiconductor Intelligence" },
    tiers: ["T3", "T4", "T5"],
  },
  {
    slug: "immersion-lithography-moores-law",
    category: "technology",
    badge: "LITHOGRAPHY · HISTORY",
    badgeColor: "#00d4ff",
    badgeBg: "rgba(0,212,255,0.07)",
    badgeBorder: "rgba(0,212,255,0.28)",
    date: "May 22, 2026",
    dateSort: "2026-05-22",
    title: "How Immersion Lithography Saved Moore's Law",
    excerpt: "By 2002, 193nm dry lithography was approaching its resolution wall. Dr. Burn Lin at TSMC proposed flooding the lens gap with ultrapure water — compressing the effective wavelength from 193nm to 134nm and enabling numerical apertures above 1.0. ASML's TWINSCAN dual-stage architecture solved the water contamination problem. The result extended 193nm ArF lithography from the 90nm node all the way to 7nm, buying the industry a decade before EUV was ready — and triggering a global patent war with Nikon along the way.",
    readTime: "9 min read",
    author: { initials: "BS", name: "Beamed Silicon", title: "Semiconductor Intelligence" },
    tiers: ["T3"],
  },
  {
    slug: "morris-chang-founding-tsmc",
    category: "analysis",
    badge: "FOUNDRY · HISTORY",
    badgeColor: "#f5b731",
    badgeBg: "rgba(245,183,49,0.08)",
    badgeBorder: "rgba(245,183,49,0.3)",
    date: "May 10, 2026",
    dateSort: "2026-05-10",
    title: "Morris Chang and the Founding of TSMC",
    excerpt: "In 1987, Morris Chang launched a company with no products and a business model the industry thought was pointless: build chips for other people, never design your own, and never compete with your customers. The Taiwanese government put up 48.3% of the capital; Philips Electronics contributed 27.6% and critical technology licences. Three decades later, TSMC produces nearly every advanced chip on earth. We trace Chang's insight, the 'conflict-free' covenant that made it possible, and how the foundry model created Qualcomm, NVIDIA, and the modern semiconductor industry.",
    readTime: "10 min read",
    author: { initials: "BS", name: "Beamed Silicon", title: "Semiconductor Intelligence" },
    tiers: ["T2"],
  },
  {
    slug: "cowos-advanced-packaging-chiplets",
    category: "technology",
    badge: "PACKAGING · CHIPLETS",
    badgeColor: "#00d4ff",
    badgeBg: "rgba(0,212,255,0.07)",
    badgeBorder: "rgba(0,212,255,0.28)",
    date: "Apr 28, 2026",
    dateSort: "2026-04-28",
    title: "Advanced Packaging: CoWoS and Chiplets",
    excerpt: "TSMC's CoWoS bonds compute dies and HBM stacks onto a silicon interposer — a passive wiring layer with millions of Through-Silicon Vias that delivers 3 TB/s of memory bandwidth to an AI accelerator. CoWoS-L extends this to 5.5× the reticle size for the largest NVIDIA configurations. We explain the full 2.5D integration stack, the TSV physics, why chiplet yield economics beat monolithic dies at large sizes, and why 50+ week CoWoS lead times — not wafer supply — are now the binding constraint on global AI chip output.",
    readTime: "12 min read",
    author: { initials: "BS", name: "Beamed Silicon", title: "Semiconductor Intelligence" },
    tiers: ["T2", "T3"],
  },
  {
    slug: "hbm-memory-wall",
    category: "memory",
    badge: "MEMORY · HBM",
    badgeColor: "#4a9eff",
    badgeBg: "rgba(74,158,255,0.08)",
    badgeBorder: "rgba(74,158,255,0.28)",
    date: "Jun 4, 2026",
    dateSort: "2026-06-04",
    title: "High Bandwidth Memory (HBM) and the Memory Wall",
    excerpt: "Processor performance has outpaced memory bandwidth for most of computing history. HBM solves the bottleneck by stacking up to 16 DRAM dies vertically on a logic base die, connected through Through-Silicon Vias, and placing the stack micrometres from the compute die via a CoWoS interposer. The result: a 1024-bit interface, 3.35 TB/s aggregate bandwidth in the H100, and energy efficiency of 7 pJ/bit versus 15–20 pJ/bit for GDDR6. We trace the architecture from the original memory wall problem through HBM4 and the BBCube-TSV roadmap.",
    readTime: "10 min read",
    author: { initials: "BS", name: "Beamed Silicon", title: "Semiconductor Intelligence" },
    tiers: ["T2"],
  },
  {
    slug: "panel-level-packaging-reticle-limit",
    category: "technology",
    badge: "PACKAGING · RETICLE",
    badgeColor: "#00d4ff",
    badgeBg: "rgba(0,212,255,0.07)",
    badgeBorder: "rgba(0,212,255,0.28)",
    date: "Apr 10, 2026",
    dateSort: "2026-04-10",
    title: "Breaking the Reticle Limit: Panel-Level Packaging",
    excerpt: "A reticle field covers ~858mm². The silicon interposers inside the largest AI accelerator packages now require areas exceeding 6,000mm² — seven times the limit. TSMC's answer is CoPoS: manufacturing interposers on large rectangular LCD-industry panel substrates instead of round 300mm wafers, enabling package areas with no theoretical ceiling. Intel's competing EMIB embeds small silicon bridges directly in the organic substrate to sidestep the problem. We compare both approaches and explain why panel-level packaging may define the physical limits of AI hardware through the early 2030s.",
    readTime: "9 min read",
    author: { initials: "BS", name: "Beamed Silicon", title: "Semiconductor Intelligence" },
    tiers: ["T2", "T3"],
  },
  {
    slug: "silicon-shield-geopolitics",
    category: "policy",
    badge: "GEOPOLITICS · POLICY",
    badgeColor: "#ff5555",
    badgeBg: "rgba(255,85,85,0.08)",
    badgeBorder: "rgba(255,85,85,0.3)",
    date: "Mar 28, 2026",
    dateSort: "2026-03-28",
    title: "The 'Silicon Shield' and Global Geopolitics",
    excerpt: "TSMC holds ~70% of the global pure-play foundry market and produces approximately 99% of all AI accelerators. This concentration has created a 'silicon shield' — the theory that Taiwan's indispensability deters military aggression. The US CHIPS Act responded with $6.6 billion to TSMC Arizona. JASM launched in Kumamoto; ESMC is under construction in Dresden. We assess the theory's limits, the workforce gap threatening every CHIPS Act facility, and why no amount of geographic diversification can rapidly replicate 35 years of Hsinchu ecosystem depth.",
    readTime: "11 min read",
    author: { initials: "BS", name: "Beamed Silicon", title: "Semiconductor Intelligence" },
    tiers: ["T1", "T2"],
  },
  {
    slug: "japan-dram-rise-fall",
    category: "analysis",
    badge: "HISTORY · DRAM",
    badgeColor: "#f5b731",
    badgeBg: "rgba(245,183,49,0.08)",
    badgeBorder: "rgba(245,183,49,0.3)",
    date: "Mar 3, 2026",
    dateSort: "2026-03-03",
    title: "The Rise and Fall of the Japanese DRAM Sector",
    excerpt: "By 1989, Japanese firms controlled 53% of the global semiconductor market and 80%+ of DRAM. The 1986 US-Japan Semiconductor Agreement halted their advance; Samsung's bet on cheap high-volume PC DRAM outmanoeuvred Japan's focus on premium mainframe quality. By the late 1990s, Japan was merging its memory divisions into Elpida — a national champion that collapsed in 2012 in the largest manufacturing bankruptcy in Japanese history, acquired by Micron for $2.5 billion. The canonical case study in how a semiconductor industry loses its lead in a single decade.",
    readTime: "12 min read",
    author: { initials: "BS", name: "Beamed Silicon", title: "Semiconductor Intelligence" },
    tiers: ["T2"],
  },
  {
    slug: "risc-v-maturity-model",
    category: "technology",
    badge: "RISC-V · STRATEGY",
    badgeColor: "#00d4ff",
    badgeBg: "rgba(0,212,255,0.07)",
    badgeBorder: "rgba(0,212,255,0.28)",
    date: "Feb 20, 2026",
    dateSort: "2026-02-20",
    title: "Open-Source Hardware and the Semiconductor Maturity Model",
    excerpt: "RISC-V — the royalty-free open ISA from UC Berkeley — is dismantling the last major royalty barrier in chip design, enabling Chinese firms, startups, and defence primes to build custom processors without ARM or Intel licensing overhead. Simultaneously, GlobalFoundries deliberately exited the leading-edge race in 2018 to dominate feature-rich mature nodes (28–180nm) with 15-year automotive supply guarantees. Its acquisition of Synopsys ARC processor IP signals a new model: foundry-as-platform. We assess both shifts and what they mean for the supply chain.",
    readTime: "10 min read",
    author: { initials: "BS", name: "Beamed Silicon", title: "Semiconductor Intelligence" },
    tiers: ["T1", "T2"],
  },
]

// Sort by date descending
const SORTED_ARTICLES = [...ARTICLES].sort(
  (a, b) => new Date(b.dateSort).getTime() - new Date(a.dateSort).getTime()
)

const FEATURED = ARTICLES.find(a => a.featured)!
const NON_FEATURED = SORTED_ARTICLES.filter(a => !a.featured)

// ─────────────────────────────────────────────────────────────────────────────
// Article card
// ─────────────────────────────────────────────────────────────────────────────
function ArticleCard({ article, compact = false }: { article: Article; compact?: boolean }) {
  const cat = getCatStyle(article.category)
  return (
    <a
      href={`/analysis/${article.slug}`}
      style={{
        display: "flex",
        flexDirection: "column",
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: "var(--rl)",
        padding: compact ? "20px 20px" : "26px 24px",
        textDecoration: "none",
        color: "inherit",
        transition: "border-color .18s ease, transform .18s ease, background .18s ease",
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement
        el.style.borderColor = cat.color
        el.style.transform = "translateY(-2px)"
        el.style.background = "var(--bg-card-h)"
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement
        el.style.borderColor = "var(--border)"
        el.style.transform = "translateY(0)"
        el.style.background = "var(--bg-card)"
      }}
    >
      {/* Meta row */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 13, flexWrap: "wrap" as const }}>
        <span style={{
          fontFamily: "var(--mono)", fontSize: "9px", fontWeight: 600,
          letterSpacing: "0.12em", padding: "3px 8px", borderRadius: 3,
          background: cat.cbg, color: cat.color, border: `1px solid ${cat.cbr}`,
          whiteSpace: "nowrap" as const,
        }}>
          {article.badge}
        </span>
        <span style={{ fontFamily: "var(--mono)", fontSize: "10px", color: "var(--text-2)", marginLeft: "auto" }}>
          {article.date}
        </span>
      </div>

      {/* Title */}
      <h3 style={{
        fontFamily: "var(--serif)",
        fontSize: compact ? "0.98rem" : "1.05rem",
        fontWeight: 600,
        lineHeight: 1.35,
        marginBottom: 10,
        color: "var(--text-0)",
      }}>
        {article.title}
      </h3>

      {/* Excerpt */}
      <p style={{
        fontFamily: "var(--serif)", fontSize: "0.875rem", fontWeight: 300,
        color: "var(--text-1)", lineHeight: 1.68, marginBottom: 18,
        display: "-webkit-box", WebkitLineClamp: compact ? 2 : 3,
        WebkitBoxOrient: "vertical" as const, overflow: "hidden",
        flex: 1,
      }}>
        {article.excerpt}
      </p>

      {/* Footer */}
      <div style={{
        marginTop: "auto", paddingTop: 13,
        borderTop: "1px solid var(--border)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 26, height: 26, borderRadius: "50%",
            background: cat.cbg, border: `1px solid ${cat.cbr}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "var(--mono)", fontSize: "8px", fontWeight: 700,
            color: cat.color, flexShrink: 0,
          }}>
            {article.author.initials}
          </div>
          <div>
            <div style={{ fontFamily: "var(--mono)", fontSize: "10px", color: "var(--text-1)", lineHeight: 1.2 }}>
              {article.author.name}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ display: "flex", gap: 4 }}>
            {article.tiers.map(t => (
              <span key={t} style={{
                fontFamily: "var(--mono)", fontSize: "8px", fontWeight: 600,
                padding: "2px 5px", borderRadius: 3,
                background: "rgba(245,183,49,0.06)",
                color: "var(--text-2)",
                border: "1px solid rgba(245,183,49,0.1)",
              }}>
                {t}
              </span>
            ))}
          </div>
          <span style={{ fontFamily: "var(--mono)", fontSize: "10px", color: "var(--text-2)" }}>
            {article.readTime}
          </span>
        </div>
      </div>
    </a>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Featured article
// ─────────────────────────────────────────────────────────────────────────────
function FeaturedCard({ article }: { article: Article }) {
  const cat = getCatStyle(article.category)
  return (
    <a
      href={`/analysis/${article.slug}`}
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 300px",
        background: "var(--bg-card)",
        border: "1px solid var(--border-md)",
        borderRadius: "var(--rl)",
        overflow: "hidden",
        textDecoration: "none",
        color: "inherit",
        transition: "border-color .18s ease",
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = cat.color }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border-md)" }}
    >
      {/* Main content */}
      <div style={{ padding: "40px 44px", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 22 }}>
          <span style={{
            fontFamily: "var(--mono)", fontSize: "9px", fontWeight: 600,
            letterSpacing: "0.14em", padding: "3px 9px", borderRadius: 3,
            background: "rgba(245,183,49,0.1)", color: "#f5b731",
            border: "1px solid rgba(245,183,49,0.3)",
          }}>
            EDITOR'S PICK
          </span>
          <span style={{
            fontFamily: "var(--mono)", fontSize: "9px", fontWeight: 600,
            letterSpacing: "0.12em", padding: "3px 9px", borderRadius: 3,
            background: cat.cbg, color: cat.color, border: `1px solid ${cat.cbr}`,
          }}>
            {article.badge}
          </span>
          <span style={{ fontFamily: "var(--mono)", fontSize: "10px", color: "var(--text-2)", marginLeft: "auto" }}>
            {article.date}
          </span>
        </div>

        <h2 style={{
          fontFamily: "var(--serif)", fontSize: "1.6rem", fontWeight: 600,
          lineHeight: 1.22, marginBottom: 14, color: "var(--text-0)",
        }}>
          {article.title}
        </h2>

        <p style={{
          fontFamily: "var(--serif)", fontSize: "0.95rem", fontWeight: 300,
          color: "var(--text-1)", lineHeight: 1.72, marginBottom: 28,
          display: "-webkit-box", WebkitLineClamp: 4,
          WebkitBoxOrient: "vertical" as const, overflow: "hidden",
        }}>
          {article.excerpt}
        </p>

        <div style={{ marginTop: "auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 34, height: 34, borderRadius: "50%",
              background: cat.cbg, border: `1px solid ${cat.cbr}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "var(--mono)", fontSize: "10px", fontWeight: 700,
              color: cat.color,
            }}>
              {article.author.initials}
            </div>
            <div>
              <div style={{ fontSize: "12.5px", fontWeight: 500, color: "var(--text-0)" }}>{article.author.name}</div>
              <div style={{ fontFamily: "var(--mono)", fontSize: "10px", color: "var(--text-2)", marginTop: 1 }}>{article.author.title}</div>
            </div>
          </div>
          <span style={{
            fontFamily: "var(--mono)", fontSize: "11.5px", fontWeight: 600,
            letterSpacing: "0.06em", color: "var(--yellow)",
            display: "flex", alignItems: "center", gap: 5,
          }}>
            READ ANALYSIS →
          </span>
        </div>
      </div>

      {/* Side panel */}
      <div style={{
        background: "var(--bg-0)",
        borderLeft: "1px solid var(--border)",
        padding: "32px 24px",
        display: "flex", flexDirection: "column", gap: 0,
        position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "linear-gradient(rgba(255,215,0,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,215,0,0.02) 1px,transparent 1px)",
          backgroundSize: "24px 24px",
        }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ fontFamily: "var(--mono)", fontSize: "9px", letterSpacing: "0.18em", color: "var(--text-2)", marginBottom: 16 }}>
            SUPPLY CHAIN IMPACT
          </div>
          {[
            { tier: "T1 — Designers", note: "Nvidia Rubin, Apple A20 capacity allocation" },
            { tier: "T2 — Foundry", note: "TSMC N2 wafer cost $30K+, 50+ week CoWoS lead" },
            { tier: "T3 — Equipment", note: "ASML High-NA EUV backlog constrains ramp rate" },
          ].map((item, i) => (
            <div key={i} style={{
              borderTop: i === 0 ? "none" : "1px solid var(--border)",
              paddingTop: i === 0 ? 0 : 12, paddingBottom: 12,
            }}>
              <div style={{ fontFamily: "var(--mono)", fontSize: "10px", fontWeight: 600, color: "var(--yellow)", marginBottom: 4 }}>
                {item.tier}
              </div>
              <div style={{ fontSize: "11px", color: "var(--text-1)", lineHeight: 1.5 }}>
                {item.note}
              </div>
            </div>
          ))}
          <div style={{ marginTop: 16, paddingTop: 14, borderTop: "1px solid var(--border)" }}>
            <div style={{ fontFamily: "var(--mono)", fontSize: "9px", color: "var(--text-2)", letterSpacing: "0.12em", marginBottom: 8 }}>
              READING TIME
            </div>
            <div style={{ fontFamily: "var(--mono)", fontSize: "1.4rem", fontWeight: 600, color: "var(--yellow)" }}>
              14
            </div>
            <div style={{ fontFamily: "var(--mono)", fontSize: "9px", color: "var(--text-2)", marginTop: 2 }}>MINUTES</div>
          </div>
        </div>
      </div>
    </a>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Sort config
// ─────────────────────────────────────────────────────────────────────────────
type SortKey = "newest" | "oldest" | "longest" | "shortest"

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "newest",   label: "NEWEST" },
  { key: "oldest",   label: "OLDEST" },
  { key: "longest",  label: "LONGEST" },
  { key: "shortest", label: "SHORTEST" },
]

function parseMinutes(rt: string) {
  return parseInt(rt) || 0
}

// ─────────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────────
export default function AnalysisPage() {
  const [activeTab, setActiveTab] = useState<TabKey>("all")
  const [sort, setSort]           = useState<SortKey>("newest")
  const [search, setSearch]       = useState("")

  const filtered = useMemo(() => {
    let pool = NON_FEATURED
    if (activeTab !== "all") pool = pool.filter(a => a.category === activeTab)
    if (search.trim()) {
      const q = search.toLowerCase()
      pool = pool.filter(
        a => a.title.toLowerCase().includes(q) ||
             a.excerpt.toLowerCase().includes(q) ||
             a.author.name.toLowerCase().includes(q)
      )
    }
    return [...pool].sort((a, b) => {
      if (sort === "newest")   return new Date(b.dateSort).getTime() - new Date(a.dateSort).getTime()
      if (sort === "oldest")   return new Date(a.dateSort).getTime() - new Date(b.dateSort).getTime()
      if (sort === "longest")  return parseMinutes(b.readTime) - parseMinutes(a.readTime)
      if (sort === "shortest") return parseMinutes(a.readTime) - parseMinutes(b.readTime)
      return 0
    })
  }, [activeTab, sort, search])

  const activeTabConfig = CATEGORIES.find(c => c.key === activeTab) ?? CATEGORIES[0]

  // Per-category counts
  const counts = useMemo(() => {
    const map: Record<string, number> = { all: NON_FEATURED.length }
    for (const a of NON_FEATURED) {
      map[a.category] = (map[a.category] ?? 0) + 1
    }
    return map
  }, [])

  return (
    <>
      <style>{`
        .analysis-tab-active { border-bottom: 2px solid currentColor !important; }
        @media (max-width: 900px) {
          .feat-grid { grid-template-columns: 1fr !important; }
          .feat-grid > div:last-child { display: none; }
          .art-grid-3 { grid-template-columns: repeat(2,1fr) !important; }
        }
        @media (max-width: 600px) {
          .art-grid-3 { grid-template-columns: 1fr !important; }
          .sort-row { flex-wrap: wrap; }
        }
      `}</style>

      <SiteHeader />
      <main>

        {/* ── PAGE HEADER ──────────────────────────────────────────────── */}
        <section style={{
          padding: "64px 0 48px",
          background: "var(--bg-0)",
          borderBottom: "1px solid var(--border)",
          position: "relative", overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: "linear-gradient(rgba(255,215,0,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,215,0,0.025) 1px,transparent 1px)",
            backgroundSize: "52px 52px",
          }} />
          {/* Radial accent */}
          <div style={{
            position: "absolute", top: -80, right: "10%",
            width: 480, height: 480,
            background: "radial-gradient(circle,rgba(245,183,49,0.04) 0%,transparent 70%)",
            pointerEvents: "none",
          }} />
          <div className="wrap" style={{ position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
              <span style={{ width: 22, height: 1, background: "var(--yellow)", display: "block" }} />
              <span style={{ fontFamily: "var(--mono)", fontSize: "9.5px", fontWeight: 600, letterSpacing: "0.22em", color: "var(--yellow)" }}>
                DEEP ANALYSIS & INTELLIGENCE
              </span>
            </div>
            <h1 style={{
              fontFamily: "var(--mono)", fontSize: "clamp(1.8rem,4vw,3rem)",
              fontWeight: 600, lineHeight: 1.1, letterSpacing: "-.02em", marginBottom: 14,
            }}>
              Semiconductor<br /><span style={{ color: "var(--yellow)" }}>Analysis</span>
            </h1>
            <p style={{
              fontFamily: "var(--serif)", fontSize: "1rem", fontWeight: 300,
              color: "var(--text-1)", maxWidth: 580, lineHeight: 1.75,
            }}>
              Long-form deep dives on foundry economics, equipment supply chains, materials science, and geopolitical risk — written by specialists who know the vertical from mine to microchip.
            </p>

            {/* Stats strip */}
            <div style={{ display: "flex", gap: 40, marginTop: 36 }}>
              {[
                { n: ARTICLES.length.toString(), l: "PUBLISHED ARTICLES" },
                { n: "6",  l: "COVERAGE AREAS" },
                { n: "6",  l: "EXPERT AUTHORS" },
                { n: "~11", l: "MIN AVG READ" },
              ].map(s => (
                <div key={s.l}>
                  <div style={{ fontFamily: "var(--mono)", fontSize: "1.6rem", fontWeight: 600, lineHeight: 1, color: "var(--yellow)" }}>{s.n}</div>
                  <div style={{ fontFamily: "var(--mono)", fontSize: "9px", color: "var(--text-2)", letterSpacing: "0.1em", marginTop: 5 }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FEATURED ARTICLE ─────────────────────────────────────────── */}
        <section style={{ padding: "48px 0 0", background: "var(--bg-1)" }}>
          <div className="wrap">
            <div className="sec-head">
              <span className="sec-label">EDITOR'S PICK</span>
              <div className="sec-rule" />
            </div>
            <FeaturedCard article={FEATURED} />
          </div>
        </section>

        {/* ── CATEGORY TABS ────────────────────────────────────────────── */}
        <section style={{
          background: "var(--bg-1)",
          borderBottom: "1px solid var(--border)",
          marginTop: 48,
          overflowX: "auto", WebkitOverflowScrolling: "touch" as const,
        }}>
          <div style={{ display: "flex", gap: 2, padding: "0 28px", minWidth: "max-content" }}>
            {CATEGORIES.map(tab => {
              const active = tab.key === activeTab
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as TabKey)}
                  className={active ? "analysis-tab-active" : ""}
                  style={{
                    fontFamily: "var(--mono)", fontSize: "11px", fontWeight: 600,
                    letterSpacing: "0.06em", padding: "14px 18px",
                    background: active ? tab.cbg : "transparent",
                    color: active ? tab.color : "var(--text-2)",
                    border: "none",
                    borderBottom: active ? `2px solid ${tab.color}` : "2px solid transparent",
                    cursor: "pointer",
                    transition: "color .18s, background .18s, border-color .18s",
                    whiteSpace: "nowrap" as const,
                  }}
                >
                  {tab.label}
                  {tab.key !== "all" && (
                    <span style={{
                      marginLeft: 6, fontFamily: "var(--mono)", fontSize: "9px",
                      padding: "1px 5px", borderRadius: 100,
                      background: active ? tab.cbg : "rgba(74,74,60,0.4)",
                      color: active ? tab.color : "var(--text-2)",
                      border: `1px solid ${active ? tab.cbr : "transparent"}`,
                    }}>
                      {counts[tab.key] ?? 0}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </section>

        {/* ── SEARCH + SORT ────────────────────────────────────────────── */}
        <section style={{
          background: "var(--bg-0)",
          borderBottom: "1px solid var(--border)",
          padding: "16px 0",
        }}>
          <div className="wrap sort-row" style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" as const }}>
            <input
              type="text"
              placeholder="Search articles, topics, or authors…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                background: "var(--bg-card)", border: "1px solid var(--border-md)",
                borderRadius: "var(--r)", padding: "9px 15px",
                fontFamily: "var(--mono)", fontSize: "12px", color: "var(--text-0)",
                outline: "none", width: 320, transition: "border-color .18s",
              }}
              onFocus={e => (e.target.style.borderColor = "var(--border-yellow)")}
              onBlur={e  => (e.target.style.borderColor = "var(--border-md)")}
            />

            {/* Active filter badge */}
            <span style={{
              fontFamily: "var(--mono)", fontSize: "10px", fontWeight: 600,
              padding: "4px 12px", borderRadius: 100,
              background: activeTabConfig.cbg, color: activeTabConfig.color,
              border: `1px solid ${activeTabConfig.cbr}`,
            }}>
              {activeTabConfig.label}
            </span>

            {/* Sort buttons */}
            <div style={{ marginLeft: "auto", display: "flex", gap: 4, alignItems: "center" }}>
              <span style={{ fontFamily: "var(--mono)", fontSize: "9px", color: "var(--text-2)", letterSpacing: "0.1em", marginRight: 6 }}>
                SORT:
              </span>
              {SORT_OPTIONS.map(s => (
                <button
                  key={s.key}
                  onClick={() => setSort(s.key)}
                  style={{
                    fontFamily: "var(--mono)", fontSize: "9.5px", fontWeight: 600,
                    letterSpacing: "0.06em", padding: "5px 11px",
                    background: sort === s.key ? "var(--yellow-bg)" : "transparent",
                    color: sort === s.key ? "var(--yellow)" : "var(--text-2)",
                    border: sort === s.key ? "1px solid var(--border-yellow)" : "1px solid var(--border)",
                    borderRadius: "var(--r)", cursor: "pointer",
                    transition: "all .15s",
                  }}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {/* Count */}
            {!search && (
              <span style={{ fontFamily: "var(--mono)", fontSize: "10px", color: "var(--text-2)" }}>
                {filtered.length} article{filtered.length !== 1 ? "s" : ""}
              </span>
            )}
            {search && (
              <span style={{ fontFamily: "var(--mono)", fontSize: "10px", color: "var(--text-2)" }}>
                {filtered.length} result{filtered.length !== 1 ? "s" : ""} for "{search}"
              </span>
            )}
          </div>
        </section>

        {/* ── ARTICLE GRID ─────────────────────────────────────────────── */}
        <section style={{ padding: "48px 0 72px", background: "var(--bg-1)", minHeight: 400 }}>
          <div className="wrap">

            {filtered.length === 0 ? (
              <div style={{ textAlign: "center" as const, padding: "80px 0", color: "var(--text-2)" }}>
                <div style={{ fontFamily: "var(--mono)", fontSize: "11px", letterSpacing: "0.12em", marginBottom: 10 }}>
                  NO RESULTS
                </div>
                <p style={{ fontFamily: "var(--serif)", fontSize: "0.95rem", color: "var(--text-1)" }}>
                  Try a different category or search term.
                </p>
              </div>
            ) : (
              <div className="art-grid-3" style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 18,
              }}>
                {filtered.map(article => (
                  <ArticleCard key={article.slug} article={article} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ── AUTHOR ROSTER ────────────────────────────────────────────── */}
        <section style={{ padding: "56px 0", background: "var(--bg-0)", borderTop: "1px solid var(--border)" }}>
          <div className="wrap">
            <div className="sec-head">
              <span className="sec-label">OUR ANALYSTS</span>
              <div className="sec-rule" />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
              {Object.values(AUTHORS).map(a => {
                const count = ARTICLES.filter(art => art.author.initials === a.initials).length
                return (
                  <div key={a.initials} style={{
                    background: "var(--bg-card)", border: "1px solid var(--border)",
                    borderRadius: "var(--rl)", padding: "22px 20px",
                    display: "flex", alignItems: "center", gap: 14,
                  }}>
                    <div style={{
                      width: 42, height: 42, borderRadius: "50%",
                      background: "var(--yellow-bg)", border: "1px solid var(--border-yellow)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontFamily: "var(--mono)", fontSize: "12px", fontWeight: 700,
                      color: "var(--yellow)", flexShrink: 0,
                    }}>
                      {a.initials}
                    </div>
                    <div>
                      <div style={{ fontFamily: "var(--mono)", fontSize: "12px", fontWeight: 600, color: "var(--text-0)" }}>
                        {a.name}
                      </div>
                      <div style={{ fontFamily: "var(--mono)", fontSize: "9.5px", color: "var(--text-2)", marginTop: 3 }}>
                        {a.title}
                      </div>
                      <div style={{ fontFamily: "var(--mono)", fontSize: "9px", color: "var(--yellow)", marginTop: 5 }}>
                        {count} article{count !== 1 ? "s" : ""}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ── DISCLAIMER ───────────────────────────────────────────────── */}
        <section style={{ padding: "28px 0", background: "var(--bg-0)", borderTop: "1px solid var(--border)" }}>
          <div className="wrap">
            <p style={{ fontFamily: "var(--mono)", fontSize: "10px", color: "var(--text-2)", lineHeight: 1.7, maxWidth: 720 }}>
              Analysis reflects author views based on public filings, industry data, and primary source research as of publication date. Supply chain data sourced from SEMI, IDC, and company guidance. Nothing herein constitutes investment advice.
            </p>
          </div>
        </section>

      </main>
      <SiteFooter />
    </>
  )
}