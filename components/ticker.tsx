import { TICKER_ITEMS } from "@/lib/tiers"

export function Ticker() {
  // Duplicate the list so the marquee loops seamlessly (matches the -50% keyframe).
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS]

  return (
    <div className="ticker">
      <div className="tick-label">350 COMPANIES</div>
      <div className="tick-track">
        {items.map(([company, note], i) => (
          <span className="tick-item" key={`${company}-${i}`}>
            {company} <span className="tick-sep">·</span> {note}
          </span>
        ))}
      </div>
    </div>
  )
}
