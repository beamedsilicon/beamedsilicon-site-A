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
          <form
  className="nl-form"
  action="https://formspree.io/f/mdajrgwa"
  method="POST"
>
  <input
    className="f-in"
    type="text"
    name="name"
    placeholder="Your name"
    required
  />

  <input
    className="f-in"
    type="email"
    name="email"
    placeholder="Work email address"
    required
  />

  <button
    className="f-btn"
    type="submit"
  >
    SUBSCRIBE FREE →
  </button>

  <p className="f-note">
    No spam. Unsubscribe anytime. Read by 22,000+ semiconductor professionals.
  </p>
</form>
        </div>
      </div>
    </section>
  )
}
