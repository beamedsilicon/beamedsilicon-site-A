import { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://beamedsilicon.com"
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
    {
      url: `${base}/analysis/tsmc-2nm-cowos-constraint`,
      lastModified: new Date("2026-05-28"),
      changeFrequency: "monthly",
      priority: 0.85,
    },
  ]
}