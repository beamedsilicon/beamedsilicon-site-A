export function Newsletter() {
  return (
    <section className="nl" id="newsletter">
      <div className="wrap">
        <div className="nl-card">
          <div>
            <div className="nl-eye">GET IN TOUCH</div>
            <h2 className="nl-title">Let&apos;s talk semiconductor intelligence</h2>
            <p className="nl-body">
              Whether you&apos;re a procurement lead, investor, policy analyst, or engineer — reach out for
              partnerships, data licensing, custom research, or press enquiries. We cover all 7 supply chain
              tiers and 350 companies, updated daily.
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
              placeholder="Your email address"
              required
            />
            <textarea
              className="f-in"
              name="message"
              placeholder="Your message"
              rows={4}
              required
              style={{ resize: "vertical", fontFamily: "inherit" }}
            />
            <button className="f-btn" type="submit">
              SEND MESSAGE →
            </button>
            <p className="f-note">
              We typically respond within one business day.
            </p>
          </form>
        </div>
      </div>
    </section>
  )
}