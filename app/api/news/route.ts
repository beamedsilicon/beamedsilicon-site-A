import { NextRequest, NextResponse } from "next/server"
import { TIERS } from "@/lib/tiers"

const API_KEY = "pub_75b628abdbd1493a94235040b3bccd39"
const BASE    = "https://newsdata.io/api/1/news"

// Every tier query is AND'd with this so "Apple" returns chip news, not sports scores
const SEMI_CONTEXT = "(semiconductor OR chip OR chipmaker OR processor OR wafer OR fab OR silicon)"

function sanitise(name: string): string {
  return name
    .replace(/^the\s+/i, "")
    .replace(/[^a-zA-Z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

function buildQuery(tier: string | null, company: string | null): string {
  // Company search: user typed something specific, trust it as-is
  if (company?.trim()) {
    return `"${sanitise(company.trim())}" AND ${SEMI_CONTEXT}`
  }

  if (tier && tier !== "all") {
    const t = TIERS.find(t => String(t.level) === tier)
    if (t) {
      const orList = t.cos
        .slice(0, 5)
        .map(([name]) => `"${sanitise(name)}"`)
        .join(" OR ")
      // Parenthesise the OR list then AND with semiconductor context
      return `(${orList}) AND ${SEMI_CONTEXT}`
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