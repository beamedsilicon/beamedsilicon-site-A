export function Newsletter() {
  return (
    <section className="nl" id="newsletter">
      <div className="wrap">
        <div className="nl-card">
          <div>
            <div className="nl-eye">BEAMED SILICON BRIEFING</div>
            <h2 className="nl-title">The complete supply chain, in your inbox</h2>
            <p className="nl-body">
              Weekly: deep-dive analysis on fabs, equipment, materials, and policy — covering all 7 supply chain tiers
              and all 350 companies. Used by procurement leads, investors, and engineers at the world&apos;s leading
              semiconductor companies.
            </p>
          </div>
          <div className="nl-form">
            <input className="f-in" type="text" placeholder="Your name" aria-label="Your name" />
            <input className="f-in" type="email" placeholder="Work email address" aria-label="Work email address" />
            <button className="f-btn" type="button">
              SUBSCRIBE FREE →
            </button>
            <p className="f-note">No spam. Unsubscribe anytime. Read by 22,000+ semiconductor professionals.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
