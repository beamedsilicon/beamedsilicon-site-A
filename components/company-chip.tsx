"use client"

import { useMemo, useState } from "react"
import type { Company } from "@/lib/tiers"

interface CompanyChipProps {
  company: Company
  color: string
  cbg: string
  hidden: boolean
}

export function CompanyChip({ company, color, cbg, hidden }: CompanyChipProps) {
  const [name, cc, url] = company

  const sources = useMemo(() => {
    const domain = new URL(url).hostname.replace(/^www\./, "")
    return [
      `https://${domain}/favicon.ico`,
      `https://www.google.com/s2/favicons?domain=${domain}&sz=32`,
      `https://icons.duckduckgo.com/ip3/${domain}.ico`,
    ]
  }, [url])

  // -1 .. sources.length-1 ; once it exceeds the last source we render the letter fallback.
  const [srcIndex, setSrcIndex] = useState(0)
  const failed = srcIndex >= sources.length
  const firstLetter = name.charAt(0).toUpperCase()

  return (
    <a
      className={`co-chip${hidden ? " hidden" : ""}`}
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      style={{ ["--tc" as string]: color, ["--tbg" as string]: cbg }}
    >
      {!failed ? (
        <span className="co-logo-wrap">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={sources[srcIndex] || "/placeholder.svg"}
            alt=""
            onError={() => setSrcIndex((i) => i + 1)}
          />
        </span>
      ) : (
        <span className="co-logo-fb" style={{ ["--tc" as string]: color, display: "flex" }}>
          {firstLetter}
        </span>
      )}
      {name}
      <em className="co-cc">{cc}</em>
      <span className="ext">↗</span>
    </a>
  )
}
