"use client"

import { useRef, useState } from "react"

type Status = "idle" | "loading" | "success" | "error"

export function Newsletter() {
  const [status, setStatus] = useState<Status>("idle")
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (status === "loading" || status === "success") return
    setStatus("loading")
    try {
      const res = await fetch("https://formspree.io/f/mdajrgwa", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(e.currentTarget),
      })
      if (res.ok) {
        setStatus("success")
        formRef.current?.reset()
      } else {
        setStatus("error")
      }
    } catch {
      setStatus("error")
    }
  }

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

          {status === "success" ? (
            <div className="nl-success">
              <div className="nl-success-icon">✓</div>
              <div className="nl-success-title">You&apos;re in.</div>
              <p className="nl-success-body">
                Check your inbox for a confirmation. First issue lands next Monday.
              </p>
            </div>
          ) : (
            <form className="nl-form" onSubmit={handleSubmit} ref={formRef}>
              <input
                className="f-in"
                type="text"
                name="name"
                placeholder="Your name"
                required
                disabled={status === "loading"}
              />
              <input
                className="f-in"
                type="email"
                name="email"
                placeholder="Work email address"
                required
                disabled={status === "loading"}
              />
              <button className="f-btn" type="submit" disabled={status === "loading"}>
                {status === "loading" ? "SUBSCRIBING…" : "SUBSCRIBE FREE →"}
              </button>
              {status === "error" && (
                <p className="f-error">Something went wrong — please try again.</p>
              )}
              <p className="f-note">No spam. Unsubscribe anytime. Read by 22,000+ semiconductor professionals.</p>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}