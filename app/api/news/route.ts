import { NextRequest, NextResponse } from "next/server"
import { TIERS } from "@/lib/tiers"

const API_KEY = "pub_75b628abdbd1493a94235040b3bccd39"
const BASE    = "https://newsdata.io/api/1/news"

// Build a boolean OR query from company names.
// Wraps multi-word names in quotes; limits to 6 to stay within URL limits.
function buildQuery(tier: string | null, company: string | null): string {
  if (company?.trim()) {
    return `"${company.trim()}"`
  }

  if (tier && tier !== "all") {
    const t = TIERS.find(t => String(t.level) === tier)
    if (t) {
      return t.cos
        .slice(0, 6)
        .map(([name]) => `"${name}"`)
        .join(" OR ")
    }
  }

  // Broad industry default
  return '"semiconductor" OR "TSMC" OR "Nvidia" OR "ASML" OR "chip manufacturing"'
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
    category: "technology,business",
  })
  if (nextPage) params.set("page", nextPage)

  try {
    // Cache responses for 15 min to stay well within the 200 req/day free limit
    const res = await fetch(`${BASE}?${params}`, {
      next: { revalidate: 900 },
    })

    if (!res.ok) {
      const body = await res.text().catch(() => "")
      return NextResponse.json(
        { status: "error", message: `newsdata.io ${res.status}`, detail: body },
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