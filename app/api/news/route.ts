import { NextRequest, NextResponse } from "next/server"
import { TIERS } from "@/lib/tiers"

const API_KEY = "pub_75b628abdbd1493a94235040b3bccd39"
const BASE    = "https://newsdata.io/api/1/news"

/**
 * newsdata.io rejects queries containing special chars like periods, hyphens
 * and parentheses when they appear inside quoted phrases.
 * Strip them and normalise whitespace before wrapping in quotes.
 */
function sanitise(name: string): string {
  return name
    .replace(/^the\s+/i, "")          // drop leading "The …"
    .replace(/[^a-zA-Z0-9\s]/g, " ")  // periods, hyphens, commas → space
    .replace(/\s+/g, " ")
    .trim()
}

function buildQuery(tier: string | null, company: string | null): string {
  if (company?.trim()) {
    return `"${sanitise(company.trim())}"`
  }

  if (tier && tier !== "all") {
    const t = TIERS.find(t => String(t.level) === tier)
    if (t) {
      // 5 companies keeps the query short; quoted phrases need clean strings
      return t.cos
        .slice(0, 5)
        .map(([name]) => `"${sanitise(name)}"`)
        .join(" OR ")
    }
  }

  return '"semiconductor" OR "TSMC" OR "Nvidia" OR "ASML" OR "chip"'
}

export async function GET(req: NextRequest) {
  const sp      = new URL(req.url).searchParams
  const tier     = sp.get("tier")
  const company  = sp.get("company")
  const nextPage = sp.get("nextPage")

  const q = buildQuery(tier, company)

  const params = new URLSearchParams({
    apikey:   API_KEY,
    q,
    language: "en",
    // NOTE: "category" is omitted — the free plan returns 422 when it is set
  })
  if (nextPage) params.set("page", nextPage)

  try {
    const res = await fetch(`${BASE}?${params}`, {
      next: { revalidate: 900 },
    })

    if (!res.ok) {
      const detail = await res.text().catch(() => "")
      return NextResponse.json(
        { status: "error", message: `newsdata.io ${res.status}`, detail },
        { status: res.status }
      )
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error"
    return NextResponse.json({ status: "error", message: msg }, { status: 500 })
  }
}