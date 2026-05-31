"use client"
import { useEffect, useRef } from "react"

function FlowParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let width = window.innerWidth
    let height = window.innerHeight
    canvas.width = width
    canvas.height = height

    interface Particle {
      x: number
      y: number
      vx: number
      vy: number
      life: number
      maxLife: number
      size: number
      speed: number
    }

    const particles: Particle[] = []
    const PARTICLE_COUNT = 80

    function spawnParticle(): Particle {
      const edge = Math.floor(Math.random() * 4)
      let x = 0
      let y = 0
      let vx = 0
      let vy = 0
      const speed = 0.4 + Math.random() * 0.8
      if (edge === 0) { x = Math.random() * width; y = 0; vx = (Math.random() - 0.5) * 0.4; vy = speed }
      else if (edge === 1) { x = width; y = Math.random() * height; vx = -speed; vy = (Math.random() - 0.5) * 0.4 }
      else if (edge === 2) { x = Math.random() * width; y = height; vx = (Math.random() - 0.5) * 0.4; vy = -speed }
      else { x = 0; y = Math.random() * height; vx = speed; vy = (Math.random() - 0.5) * 0.4 }
      return { x, y, vx, vy, life: 0, maxLife: 180 + Math.random() * 200, size: 0.8 + Math.random() * 1.4, speed }
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const p = spawnParticle()
      p.life = Math.random() * p.maxLife
      particles.push(p)
    }

    // Flow lines
    interface FlowLine {
      points: { x: number; y: number }[]
      alpha: number
      life: number
      maxLife: number
      color: string
    }
    const flowLines: FlowLine[] = []
    const LINE_COUNT = 12

    function spawnLine(): FlowLine {
      const startY = Math.random() * height
      const pts: { x: number; y: number }[] = []
      let cx = -60
      let cy = startY
      for (let i = 0; i < 40; i++) {
        cx += 25 + Math.random() * 15
        cy += (Math.random() - 0.5) * 60
        pts.push({ x: cx, y: cy })
      }
      return {
        points: pts,
        alpha: 0,
        life: 0,
        maxLife: 220 + Math.random() * 180,
        color: Math.random() > 0.3 ? "#ffd700" : "#ffaa00",
      }
    }

    for (let i = 0; i < LINE_COUNT; i++) {
      const l = spawnLine()
      l.life = Math.random() * l.maxLife
      flowLines.push(l)
    }

    let animId: number
    function draw() {
      ctx!.clearRect(0, 0, width, height)

      // Draw flow lines
      for (const line of flowLines) {
        line.life++
        if (line.life >= line.maxLife) {
          const idx = flowLines.indexOf(line)
          flowLines[idx] = spawnLine()
          continue
        }
        const t = line.life / line.maxLife
        const alpha = t < 0.15 ? t / 0.15 : t > 0.75 ? (1 - t) / 0.25 : 1
        const progress = Math.min(1, t * 2)
        const numPts = Math.floor(progress * line.points.length)
        if (numPts < 2) continue
        ctx!.beginPath()
        ctx!.moveTo(line.points[0].x, line.points[0].y)
        for (let i = 1; i < numPts; i++) {
          ctx!.lineTo(line.points[i].x, line.points[i].y)
        }
        ctx!.strokeStyle = line.color
        ctx!.globalAlpha = alpha * 0.22
        ctx!.lineWidth = 0.8
        ctx!.stroke()
        ctx!.globalAlpha = 1
      }

      // Draw particles
      for (const p of particles) {
        p.life++
        p.x += p.vx
        p.y += p.vy
        if (p.life >= p.maxLife) {
          const idx = particles.indexOf(p)
          particles[idx] = spawnParticle()
          continue
        }
        const t = p.life / p.maxLife
        const alpha = t < 0.1 ? t / 0.1 : t > 0.8 ? (1 - t) / 0.2 : 1
        ctx!.beginPath()
        ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx!.fillStyle = "#ffd700"
        ctx!.globalAlpha = alpha * 0.5
        ctx!.fill()
        ctx!.globalAlpha = 1
      }

      animId = requestAnimationFrame(draw)
    }

    draw()

    const handleResize = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width
      canvas.height = height
    }
    window.addEventListener("resize", handleResize)
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return <canvas ref={canvasRef} className="flow-canvas" aria-hidden="true" />
}

function SiliconChip() {
  return (
    <div className="silicon-scene" aria-label="Animated laser beam hitting a silicon chip">
      <svg viewBox="0 0 440 440" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="chipGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffd700" stopOpacity="0.3" />
            <stop offset="60%" stopColor="#ffaa00" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#ffd700" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="impactGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="30%" stopColor="#ffd700" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#ffd700" stopOpacity="0" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="strongGlow">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <clipPath id="chipClip">
            <rect x="120" y="120" width="200" height="200" rx="4" />
          </clipPath>
        </defs>

        {/* Ambient glow behind chip */}
        <circle cx="220" cy="220" r="160" fill="url(#chipGlow)" />

        {/* Grid background */}
        <g opacity="0.08" stroke="#ffd700" strokeWidth="0.5">
          {Array.from({ length: 10 }, (_, i) => (
            <line key={`h${i}`} x1="40" y1={80 + i * 30} x2="400" y2={80 + i * 30} />
          ))}
          {Array.from({ length: 13 }, (_, i) => (
            <line key={`v${i}`} x1={40 + i * 30} y1="80" x2={40 + i * 30} y2="360" />
          ))}
        </g>

        {/* ── CHIP GROUP (floats) ── */}
        <g className="chip-group">
          {/* Chip shadow */}
          <rect x="124" y="126" width="200" height="200" rx="4" fill="#000" opacity="0.6" />

          {/* Chip body */}
          <rect className="chip-body" x="120" y="120" width="200" height="200" rx="4"
            fill="#1a1800" stroke="#ffd700" strokeWidth="1.5" />

          {/* Inner circuit pattern */}
          <g clipPath="url(#chipClip)" opacity="0.7">
            {/* Die area */}
            <rect x="145" y="145" width="150" height="150" rx="2" fill="#0f0f00" stroke="#ffd700" strokeWidth="0.8" strokeOpacity="0.5" />

            {/* Circuit traces */}
            <g stroke="#ffd700" strokeWidth="0.6" strokeOpacity="0.4" fill="none">
              <line x1="145" y1="165" x2="295" y2="165" />
              <line x1="145" y1="185" x2="295" y2="185" />
              <line x1="145" y1="220" x2="295" y2="220" />
              <line x1="145" y1="255" x2="295" y2="255" />
              <line x1="145" y1="275" x2="295" y2="275" />
              <line x1="165" y1="145" x2="165" y2="295" />
              <line x1="185" y1="145" x2="185" y2="295" />
              <line x1="220" y1="145" x2="220" y2="295" />
              <line x1="255" y1="145" x2="255" y2="295" />
              <line x1="275" y1="145" x2="275" y2="295" />
            </g>

            {/* Logic blocks */}
            <rect x="152" y="152" width="28" height="20" rx="1" fill="#ffd700" fillOpacity="0.12" stroke="#ffd700" strokeWidth="0.7" strokeOpacity="0.6" />
            <rect x="190" y="152" width="40" height="28" rx="1" fill="#ffd700" fillOpacity="0.08" stroke="#ffd700" strokeWidth="0.7" strokeOpacity="0.5" />
            <rect x="242" y="152" width="22" height="22" rx="1" fill="#ffaa00" fillOpacity="0.12" stroke="#ffaa00" strokeWidth="0.7" strokeOpacity="0.6" />
            <rect x="152" y="192" width="52" height="52" rx="1" fill="#ffd700" fillOpacity="0.06" stroke="#ffd700" strokeWidth="0.8" strokeOpacity="0.4" />
            <rect x="214" y="192" width="36" height="36" rx="1" fill="#ffd700" fillOpacity="0.08" stroke="#ffd700" strokeWidth="0.7" strokeOpacity="0.5" />
            <rect x="262" y="200" width="24" height="24" rx="1" fill="#ffaa00" fillOpacity="0.1" stroke="#ffaa00" strokeWidth="0.7" strokeOpacity="0.5" />
            <rect x="152" y="258" width="32" height="24" rx="1" fill="#ffd700" fillOpacity="0.1" stroke="#ffd700" strokeWidth="0.7" strokeOpacity="0.5" />
            <rect x="196" y="260" width="50" height="24" rx="1" fill="#ffd700" fillOpacity="0.07" stroke="#ffd700" strokeWidth="0.7" strokeOpacity="0.45" />
            <rect x="258" y="258" width="28" height="28" rx="1" fill="#ffaa00" fillOpacity="0.08" stroke="#ffaa00" strokeWidth="0.7" strokeOpacity="0.5" />

            {/* Center core */}
            <rect x="168" y="200" width="36" height="36" rx="2"
              fill="#ffd700" fillOpacity="0.18" stroke="#ffd700" strokeWidth="1" />
            <circle cx="186" cy="218" r="8" fill="#ffd700" fillOpacity="0.3" stroke="#ffd700" strokeWidth="0.8" />
          </g>

          {/* Chip pins - top */}
          {Array.from({ length: 8 }, (_, i) => (
            <rect key={`pt${i}`} x={133 + i * 23} y="106" width="10" height="14" rx="1"
              fill="#ffd700" fillOpacity="0.5" stroke="#ffd700" strokeWidth="0.6" />
          ))}
          {/* Chip pins - bottom */}
          {Array.from({ length: 8 }, (_, i) => (
            <rect key={`pb${i}`} x={133 + i * 23} y="320" width="10" height="14" rx="1"
              fill="#ffd700" fillOpacity="0.5" stroke="#ffd700" strokeWidth="0.6" />
          ))}
          {/* Chip pins - left */}
          {Array.from({ length: 6 }, (_, i) => (
            <rect key={`pl${i}`} x="106" y={140 + i * 28} width="14" height="10" rx="1"
              fill="#ffd700" fillOpacity="0.5" stroke="#ffd700" strokeWidth="0.6" />
          ))}
          {/* Chip pins - right */}
          {Array.from({ length: 6 }, (_, i) => (
            <rect key={`pr${i}`} x="320" y={140 + i * 28} width="14" height="10" rx="1"
              fill="#ffd700" fillOpacity="0.5" stroke="#ffd700" strokeWidth="0.6" />
          ))}

          {/* Corner chamfers */}
          <line x1="120" y1="124" x2="124" y2="120" stroke="#ffd700" strokeWidth="1" opacity="0.7" />
          <line x1="316" y1="120" x2="320" y2="124" stroke="#ffd700" strokeWidth="1" opacity="0.7" />
          <line x1="120" y1="316" x2="124" y2="320" stroke="#ffd700" strokeWidth="1" opacity="0.7" />
          <line x1="316" y1="320" x2="320" y2="316" stroke="#ffd700" strokeWidth="1" opacity="0.7" />
        </g>

        {/* ── LASER BEAM (horizontal, traveling left-to-right then right-to-left) ── */}
        {/* Forward beam */}
        <g filter="url(#strongGlow)">
          <rect className="laser-rect-fwd"
            x="-300" y="216" width="280" height="8" rx="4"
            fill="url(#laserGradFwd)" opacity="1" />
          <rect className="laser-rect-fwd"
            x="-300" y="218" width="280" height="4" rx="2"
            fill="#ffffff" opacity="0.9" />
        </g>
        {/* Reverse beam */}
        <g filter="url(#strongGlow)">
          <rect className="laser-rect-rev"
            x="800" y="216" width="280" height="8" rx="4"
            fill="url(#laserGradRev)" opacity="1" />
          <rect className="laser-rect-rev"
            x="800" y="218" width="280" height="4" rx="2"
            fill="#ffffff" opacity="0.9" />
        </g>

        <defs>
          <linearGradient id="laserGradFwd" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ffd700" stopOpacity="0" />
            <stop offset="40%" stopColor="#ffd700" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="1" />
          </linearGradient>
          <linearGradient id="laserGradRev" x1="100%" y1="0%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#ffd700" stopOpacity="0" />
            <stop offset="40%" stopColor="#ffd700" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="1" />
          </linearGradient>
        </defs>

        {/* ── IMPACT FLASH on chip ── */}
        <g className="impact-ring" filter="url(#strongGlow)">
          <circle cx="220" cy="220" r="30" fill="url(#impactGlow)" />
          <circle cx="220" cy="220" r="16" fill="#ffffff" fillOpacity="0.7" />
        </g>
        {/* Expanding rings on impact */}
        <circle className="flow-ring-1" cx="220" cy="220" r="10"
          stroke="#ffd700" fill="none" />
        <circle className="flow-ring-2" cx="220" cy="220" r="10"
          stroke="#ffaa00" fill="none" />
        <circle className="flow-ring-3" cx="220" cy="220" r="10"
          stroke="#ffd700" fill="none" opacity="0.6" />

        {/* ── SCAN LINE across chip ── */}
        <rect className="scan-rect"
          x="120" y="80" width="200" height="2" rx="1"
          fill="#ffd700" fillOpacity="0.55" filter="url(#glow)" />

        {/* Corner decorations */}
        <g stroke="#ffd700" strokeWidth="1" strokeOpacity="0.3" fill="none">
          <path d="M30 30 L60 30 L60 60" />
          <path d="M410 30 L380 30 L380 60" />
          <path d="M30 410 L60 410 L60 380" />
          <path d="M410 410 L380 410 L380 380" />
        </g>

        {/* Orbit dots */}
        <g fill="#ffd700" fillOpacity="0.4">
          <circle cx="70" cy="220" r="2.5" />
          <circle cx="370" cy="220" r="2.5" />
          <circle cx="220" cy="70" r="2.5" />
          <circle cx="220" cy="370" r="2.5" />
        </g>

        {/* Data lines from chip to edge */}
        <g stroke="#ffd700" strokeWidth="0.6" strokeOpacity="0.2" strokeDasharray="4 6">
          <line x1="70" y1="220" x2="106" y2="220" />
          <line x1="334" y1="220" x2="370" y2="220" />
          <line x1="220" y1="70" x2="220" y2="106" />
          <line x1="220" y1="334" x2="220" y2="370" />
        </g>
      </svg>
    </div>
  )
}

export function Hero() {
  return (
    <>
      <FlowParticles />
      <section className="hero">
        <div className="wrap hero-inner">
          <div className="hero-text">
            <div className="eyebrow">THE DEFINITIVE SEMICONDUCTOR INTELLIGENCE PLATFORM</div>
            <h1>
              Every Tier of the
              <br />
              Semiconductor Universe,
              <br />
              <span className="c">Mapped &amp; Tracked</span>
            </h1>
            <p className="hero-sub">
              350 companies. 7 supply chain tiers. From the quartz mines of North Carolina to the AI accelerators in
              your data center. The world&apos;s most complete semiconductor knowledge base — updated daily.
            </p>
            <div className="hero-stats">
              <div>
                <div className="stat-n">350</div>
                <div className="stat-l">COMPANIES TRACKED</div>
              </div>
              <div>
                <div className="stat-n">7</div>
                <div className="stat-l">SUPPLY CHAIN TIERS</div>
              </div>
              <div>
                <div className="stat-n">22+</div>
                <div className="stat-l">COUNTRIES COVERED</div>
              </div>
              <div>
                <div className="stat-n">Daily</div>
                <div className="stat-l">NEWS UPDATES</div>
              </div>
            </div>
          </div>
          <SiliconChip />
        </div>
      </section>
    </>
  )
}
