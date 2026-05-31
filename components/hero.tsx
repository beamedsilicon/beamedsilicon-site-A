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
        color: Math.random() > 0.3 ? "#f5b731" : "#ffaa00",
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
        ctx!.fillStyle = "#f5b731"
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

function QuartzLaserScene() {
  return (
    <div className="silicon-scene" aria-label="Animated laser beam from robot arm hitting a quartz silicon crystal">
      <svg viewBox="0 0 480 480" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="crystalGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f5b731" stopOpacity="0.4" />
            <stop offset="60%" stopColor="#f5b731" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#f5b731" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="impactGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="30%" stopColor="#f5b731" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#f5b731" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="laserGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f5b731" stopOpacity="0.1" />
            <stop offset="50%" stopColor="#f5b731" stopOpacity="0.8" />
            <stop offset="90%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="100%" stopColor="#f5b731" stopOpacity="0.6" />
          </linearGradient>
          <linearGradient id="crystalFace1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2a2a20" />
            <stop offset="50%" stopColor="#1a1a10" />
            <stop offset="100%" stopColor="#0f0f08" />
          </linearGradient>
          <linearGradient id="crystalFace2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3a3a28" />
            <stop offset="50%" stopColor="#252518" />
            <stop offset="100%" stopColor="#1a1a10" />
          </linearGradient>
          <linearGradient id="crystalFace3" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#454530" />
            <stop offset="100%" stopColor="#2a2a1c" />
          </linearGradient>
          <linearGradient id="armGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2a2a20" />
            <stop offset="50%" stopColor="#1a1a12" />
            <stop offset="100%" stopColor="#0f0f08" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="strongGlow">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="crystalGlowFilter">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Background grid */}
        <g opacity="0.06" stroke="#f5b731" strokeWidth="0.5">
          {Array.from({ length: 12 }, (_, i) => (
            <line key={`h${i}`} x1="20" y1={60 + i * 32} x2="460" y2={60 + i * 32} />
          ))}
          {Array.from({ length: 14 }, (_, i) => (
            <line key={`v${i}`} x1={20 + i * 34} y1="60" x2={20 + i * 34} y2="420" />
          ))}
        </g>

        {/* Ambient glow behind crystal */}
        <circle cx="300" cy="280" r="120" fill="url(#crystalGlow)" className="crystal-ambient" />

        {/* ── ROBOT ARM ── */}
        <g className="robot-arm">
          {/* Base mount */}
          <rect x="20" y="100" width="40" height="60" rx="4" fill="url(#armGrad)" stroke="#f5b731" strokeWidth="1" strokeOpacity="0.4" />
          <rect x="25" y="105" width="30" height="8" rx="2" fill="#f5b731" fillOpacity="0.15" />
          <circle cx="40" cy="130" r="6" fill="#0f0f08" stroke="#f5b731" strokeWidth="1" strokeOpacity="0.5" />
          
          {/* Upper arm segment */}
          <g className="arm-segment-1">
            <rect x="38" y="85" width="80" height="18" rx="3" fill="url(#armGrad)" stroke="#f5b731" strokeWidth="0.8" strokeOpacity="0.3" />
            {/* Joint detail */}
            <circle cx="40" cy="94" r="8" fill="#1a1a12" stroke="#f5b731" strokeWidth="1" strokeOpacity="0.4" />
            <circle cx="40" cy="94" r="4" fill="#f5b731" fillOpacity="0.3" />
            {/* Hydraulic detail */}
            <rect x="55" y="89" width="50" height="3" rx="1" fill="#f5b731" fillOpacity="0.12" />
            <rect x="55" y="95" width="50" height="3" rx="1" fill="#f5b731" fillOpacity="0.08" />
          </g>

          {/* Elbow joint */}
          <g className="elbow-joint">
            <circle cx="118" cy="94" r="12" fill="#1a1a12" stroke="#f5b731" strokeWidth="1" strokeOpacity="0.5" />
            <circle cx="118" cy="94" r="6" fill="#0f0f08" stroke="#f5b731" strokeWidth="0.8" strokeOpacity="0.4" />
            <circle cx="118" cy="94" r="3" fill="#f5b731" fillOpacity="0.4" />
          </g>

          {/* Lower arm segment (angled down toward crystal) */}
          <g className="arm-segment-2">
            <path d="M118 94 L180 180" stroke="url(#armGrad)" strokeWidth="16" strokeLinecap="round" />
            <path d="M118 94 L180 180" stroke="#f5b731" strokeWidth="1" strokeOpacity="0.3" strokeLinecap="round" />
            {/* Details along arm */}
            <circle cx="140" cy="125" r="4" fill="#f5b731" fillOpacity="0.15" stroke="#f5b731" strokeWidth="0.5" strokeOpacity="0.3" />
            <circle cx="160" cy="155" r="3" fill="#f5b731" fillOpacity="0.1" stroke="#f5b731" strokeWidth="0.5" strokeOpacity="0.2" />
          </g>

          {/* Wrist joint */}
          <g className="wrist-joint">
            <circle cx="180" cy="180" r="10" fill="#1a1a12" stroke="#f5b731" strokeWidth="1" strokeOpacity="0.5" />
            <circle cx="180" cy="180" r="5" fill="#f5b731" fillOpacity="0.3" />
          </g>

          {/* Laser emitter head */}
          <g className="laser-head">
            <rect x="170" y="185" width="35" height="22" rx="3" fill="url(#armGrad)" stroke="#f5b731" strokeWidth="1" strokeOpacity="0.5" />
            {/* Cooling fins */}
            <rect x="172" y="188" width="2" height="16" fill="#f5b731" fillOpacity="0.15" />
            <rect x="176" y="188" width="2" height="16" fill="#f5b731" fillOpacity="0.12" />
            <rect x="180" y="188" width="2" height="16" fill="#f5b731" fillOpacity="0.1" />
            {/* Laser aperture */}
            <circle cx="198" cy="196" r="6" fill="#0a0a00" stroke="#f5b731" strokeWidth="1.5" />
            <circle cx="198" cy="196" r="3" className="laser-led" fill="#f5b731" filter="url(#glow)" />
            {/* Status LED */}
            <circle cx="174" cy="203" r="2" className="status-led" fill="#f5b731" />
          </g>
        </g>

        {/* ── LASER BEAM ── */}
        <g className="laser-beam-group" filter="url(#strongGlow)">
          <line className="laser-beam" x1="204" y1="196" x2="260" y2="250" 
            stroke="url(#laserGrad)" strokeWidth="6" strokeLinecap="round" />
          <line className="laser-beam-core" x1="204" y1="196" x2="260" y2="250" 
            stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
        </g>

        {/* ── QUARTZ CRYSTAL ── */}
        <g className="crystal-group">
          {/* Crystal shadow */}
          <polygon points="310,380 250,350 270,240 310,200 350,220 370,320 330,370" 
            fill="#000" opacity="0.5" transform="translate(5, 5)" />
          
          {/* Main crystal body - faceted quartz shape */}
          {/* Back left face */}
          <polygon className="crystal-face" points="270,320 270,240 310,200 310,280" 
            fill="url(#crystalFace1)" stroke="#f5b731" strokeWidth="0.8" strokeOpacity="0.4" />
          {/* Back right face */}
          <polygon className="crystal-face" points="310,200 350,220 350,300 310,280" 
            fill="url(#crystalFace2)" stroke="#f5b731" strokeWidth="0.8" strokeOpacity="0.5" />
          {/* Front right face */}
          <polygon className="crystal-face" points="350,300 350,220 370,250 370,330" 
            fill="url(#crystalFace1)" stroke="#f5b731" strokeWidth="0.8" strokeOpacity="0.3" />
          {/* Front face */}
          <polygon className="crystal-face" points="310,280 350,300 370,330 330,360 290,340 270,320" 
            fill="url(#crystalFace3)" stroke="#f5b731" strokeWidth="1" strokeOpacity="0.6" />
          {/* Top face (where laser hits) */}
          <polygon className="crystal-top" points="270,240 310,200 350,220 330,250 290,240" 
            fill="#3a3a28" stroke="#f5b731" strokeWidth="1.2" strokeOpacity="0.7" />

          {/* Internal crystal structure lines */}
          <g stroke="#f5b731" strokeWidth="0.5" strokeOpacity="0.2">
            <line x1="290" y1="250" x2="310" y2="340" />
            <line x1="330" y1="240" x2="340" y2="330" />
            <line x1="280" y1="280" x2="350" y2="290" />
          </g>

          {/* Crystal inclusions */}
          <circle cx="300" cy="290" r="4" fill="#f5b731" fillOpacity="0.08" />
          <circle cx="330" cy="270" r="3" fill="#f5b731" fillOpacity="0.06" />
          <circle cx="290" cy="310" r="2" fill="#f5b731" fillOpacity="0.1" />

          {/* Crystal highlight reflections */}
          <line x1="275" y1="260" x2="285" y2="300" stroke="#ffffff" strokeWidth="1" strokeOpacity="0.15" />
          <line x1="345" y1="240" x2="355" y2="280" stroke="#ffffff" strokeWidth="0.8" strokeOpacity="0.1" />
        </g>

        {/* ── IMPACT POINT (on crystal top) ── */}
        <g className="impact-point">
          <circle cx="300" cy="230" r="20" fill="url(#impactGlow)" className="impact-glow" />
          <circle cx="300" cy="230" r="8" fill="#ffffff" fillOpacity="0.8" className="impact-core" />
        </g>

        {/* Energy rings expanding from impact */}
        <circle className="energy-ring-1" cx="300" cy="230" r="10" stroke="#f5b731" fill="none" />
        <circle className="energy-ring-2" cx="300" cy="230" r="10" stroke="#f5b731" fill="none" />
        <circle className="energy-ring-3" cx="300" cy="230" r="10" stroke="#ffaa00" fill="none" />

        {/* Sparks from impact */}
        <g className="sparks">
          <circle className="spark-1" cx="300" cy="230" r="2" fill="#f5b731" />
          <circle className="spark-2" cx="300" cy="230" r="1.5" fill="#ffffff" />
          <circle className="spark-3" cx="300" cy="230" r="2" fill="#f5b731" />
          <circle className="spark-4" cx="300" cy="230" r="1.5" fill="#ffaa00" />
        </g>

        {/* Corner frame decoration */}
        <g stroke="#f5b731" strokeWidth="1" strokeOpacity="0.2" fill="none">
          <path d="M20 20 L60 20 L60 50" />
          <path d="M460 20 L420 20 L420 50" />
          <path d="M20 460 L60 460 L60 430" />
          <path d="M460 460 L420 460 L420 430" />
        </g>

        {/* Platform/base under crystal */}
        <ellipse cx="310" cy="385" rx="80" ry="15" fill="#0f0f08" stroke="#f5b731" strokeWidth="0.8" strokeOpacity="0.3" />
        <ellipse cx="310" cy="385" rx="60" ry="10" fill="none" stroke="#f5b731" strokeWidth="0.5" strokeOpacity="0.15" />
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
          <QuartzLaserScene />
        </div>
      </section>
    </>
  )
}
