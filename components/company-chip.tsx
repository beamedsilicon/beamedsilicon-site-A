"use client"

import { useEffect, useMemo, useState } from "react"
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

  // null = still resolving, "" = all failed, any string = resolved URL
  const [resolvedSrc, setResolvedSrc] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    const tryNext = (i: number) => {
      if (cancelled) return
      if (i >= sources.length) {
        setResolvedSrc("")
        return
      }
      const img = new Image()
      img.onload = () => {
        if (!cancelled) setResolvedSrc(sources[i]!)
      }
      img.onerror = () => {
        if (!cancelled) tryNext(i + 1)
      }
      img.src = sources[i]!
    }

    tryNext(0)
    return () => {
      cancelled = true
    }
  }, [sources])

  const firstLetter = name.charAt(0).toUpperCase()
  const showFallback = resolvedSrc === ""
  const showLogo = resolvedSrc !== null && resolvedSrc !== ""

  return (
    <a
      className={`co-chip${hidden ? " hidden" : ""}`}
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      style={{ ["--tc" as string]: color, ["--tbg" as string]: cbg }}
    >
      {showLogo ? (
        <span className="co-logo-wrap">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={resolvedSrc} alt="" />
        </span>
      ) : showFallback ? (
        <span className="co-logo-fb" style={{ ["--tc" as string]: color, display: "flex" }}>
          {firstLetter}
        </span>
      ) : (
        // Still resolving — render a neutral placeholder the same size as the logo
        <span className="co-logo-wrap" style={{ background: "transparent", border: "none" }} />
      )}
      {name}
      <em className="co-cc">{cc}</em>
      <span className="ext">↗</span>
    </a>
  )
}