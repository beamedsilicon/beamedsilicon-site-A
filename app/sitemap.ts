import { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://beamedsilicon.qzz.io"
  const now  = new Date()

  return [
    {
      url: base,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${base}/news`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${base}/markets`,
      lastModified: now,
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: `${base}/companies`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${base}/analysis`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${base}/policy`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    // ── News articles ─────────────────────────────────────────────────────
    {
      url: `${base}/news/hbm4-shortage-2026`,
      lastModified: new Date("2026-06-05"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${base}/news/tsmc-2nm-cowos-2026`,
      lastModified: new Date("2026-05-28"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${base}/news/match-act-duv-china-2026`,
      lastModified: new Date("2026-04-28"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    // ── Analysis articles ──────────────────────────────────────────────────
    {
      url: `${base}/analysis/tsmc-2nm-cowos-constraint`,
      lastModified: new Date("2026-05-28"),
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${base}/analysis/hbm4-shortage-2026`,
      lastModified: new Date("2026-06-05"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${base}/analysis/match-act-duv-china-2026`,
      lastModified: new Date("2026-04-28"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${base}/analysis/asml-high-na-euv-monopoly`,
      lastModified: new Date("2026-05-14"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${base}/analysis/sic-ev-correction-opportunity`,
      lastModified: new Date("2026-05-07"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${base}/analysis/spruce-pine-supply-chain-risk`,
      lastModified: new Date("2026-04-15"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${base}/analysis/photoresist-allocation-chokepoint`,
      lastModified: new Date("2026-03-22"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${base}/analysis/hbm-buildout-2026-winners`,
      lastModified: new Date("2026-06-01"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${base}/analysis/advanced-packaging-new-node`,
      lastModified: new Date("2026-04-03"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${base}/analysis/intel-18a-comeback-or-caution`,
      lastModified: new Date("2026-03-10"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${base}/analysis/china-chip-independence-smic-huawei`,
      lastModified: new Date("2026-04-21"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${base}/analysis/specialty-gas-crisis-neon-krypton`,
      lastModified: new Date("2026-02-14"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${base}/analysis/asml-china-service-cutoff`,
      lastModified: new Date("2026-03-05"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${base}/analysis/sic-oversupply-ev-shakeout`,
      lastModified: new Date("2026-02-28"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${base}/analysis/tsmc-n2-customer-mix`,
      lastModified: new Date("2026-05-20"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${base}/analysis/rare-earth-lynas-mp-materials`,
      lastModified: new Date("2026-01-30"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${base}/analysis/photoresist-jsr-tok-shin-etsu`,
      lastModified: new Date("2026-03-18"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${base}/analysis/ai-server-power-density-sic`,
      lastModified: new Date("2026-06-03"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${base}/analysis/wafer-economics-300mm-vs-450mm`,
      lastModified: new Date("2026-02-05"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${base}/analysis/micron-hbm-comeback`,
      lastModified: new Date("2026-05-02"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${base}/analysis/chips-act-progress-report-2026`,
      lastModified: new Date("2026-01-14"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${base}/analysis/extreme-ultraviolet-source-physics`,
      lastModified: new Date("2026-01-21"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    // ── New educational articles ──────────────────────────────────────────────
    {
      url: `${base}/analysis/euv-lithography-physics`,
      lastModified: new Date("2026-06-02"),
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${base}/analysis/high-na-euv-055`,
      lastModified: new Date("2026-05-30"),
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${base}/analysis/immersion-lithography-moores-law`,
      lastModified: new Date("2026-05-22"),
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${base}/analysis/morris-chang-founding-tsmc`,
      lastModified: new Date("2026-05-10"),
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${base}/analysis/cowos-advanced-packaging-chiplets`,
      lastModified: new Date("2026-04-28"),
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${base}/analysis/hbm-memory-wall`,
      lastModified: new Date("2026-06-04"),
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${base}/analysis/panel-level-packaging-reticle-limit`,
      lastModified: new Date("2026-04-10"),
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${base}/analysis/silicon-shield-geopolitics`,
      lastModified: new Date("2026-03-28"),
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${base}/analysis/japan-dram-rise-fall`,
      lastModified: new Date("2026-03-03"),
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${base}/analysis/risc-v-maturity-model`,
      lastModified: new Date("2026-02-20"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ]
}