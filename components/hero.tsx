"use client"
import { useEffect, useRef } from "react"

// ─────────────────────────────────────────────────────────────────────────────
// ELECTRIC BACKGROUND — 5-layer canvas:
//   1. Plasma depth blobs     (immersive warm-field glow)
//   2. Crystal shard lattice  (rocky mineral geometry)
//   3. Laser scan beams       (horizontal sweeps with hot-white core)
//   4. Particle trails        (crystallographic-angle fast shots + drifters)
//   5. Lightning bolts        (fractal electric discharge)
// ─────────────────────────────────────────────────────────────────────────────
function ElectricBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let W = window.innerWidth
    let H = window.innerHeight
    canvas.width = W
    canvas.height = H

    // ── Types ─────────────────────────────────────────────────────────────────
    interface Particle {
      x: number; y: number; vx: number; vy: number
      trail: { x: number; y: number }[]
      life: number; maxLife: number; size: number; fast: boolean
    }
    interface Bolt {
      pts: { x: number; y: number }[]
      life: number; maxLife: number; bright: boolean
    }
    interface Beam {
      y: number; vy: number; life: number; maxLife: number; alpha: number
    }
    interface Blob {
      x: number; y: number; r: number; vx: number; vy: number; alpha: number; phase: number
    }
    interface Shard {
      pts: { x: number; y: number }[]; phase: number; baseAlpha: number
    }

    // ── Layer 1: Plasma depth blobs ───────────────────────────────────────────
    const blobs: Blob[] = []
    for (let i = 0; i < 8; i++) {
      blobs.push({
        x: Math.random() * W, y: Math.random() * H,
        r: 90 + Math.random() * 160,
        vx: (Math.random() - 0.5) * 0.11, vy: (Math.random() - 0.5) * 0.11,
        alpha: 0.025 + Math.random() * 0.042,
        phase: Math.random() * Math.PI * 2,
      })
    }

    // ── Layer 2: Crystal shard lattice ────────────────────────────────────────
    const shards: Shard[] = []
    const mkShard = (x: number, y: number): Shard => {
      const n = 4 + Math.floor(Math.random() * 3)
      const r = 16 + Math.random() * 60
      const pts: { x: number; y: number }[] = []
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2 + (Math.random() - 0.5) * 0.75
        pts.push({
          x: x + Math.cos(a) * r * (0.5 + Math.random() * 0.95),
          y: y + Math.sin(a) * r * (0.5 + Math.random() * 0.95),
        })
      }
      return { pts, phase: Math.random() * Math.PI * 2, baseAlpha: 0.014 + Math.random() * 0.026 }
    }
    const buildShards = () => {
      shards.length = 0
      const n = Math.floor((W * H) / 15000)
      for (let i = 0; i < n; i++) shards.push(mkShard(Math.random() * W, Math.random() * H))
    }
    buildShards()

    // ── Layer 5: Lightning ────────────────────────────────────────────────────
    const anchors: { x: number; y: number }[] = []
    const buildAnchors = () => {
      anchors.length = 0
      for (let i = 0; i < 18; i++) anchors.push({ x: Math.random() * W, y: Math.random() * H })
    }
    buildAnchors()

    const zigzag = (
      x1: number, y1: number, x2: number, y2: number,
      d: number, r: number
    ): { x: number; y: number }[] => {
      if (d === 0) return [{ x: x1, y: y1 }, { x: x2, y: y2 }]
      const mx = (x1 + x2) * 0.5, my = (y1 + y2) * 0.5
      const dx = x2 - x1, dy = y2 - y1
      const len = Math.hypot(dx, dy) || 0.001
      const off = (Math.random() - 0.5) * len * r
      const nx = mx - (dy / len) * off, ny = my + (dx / len) * off
      return [
        ...zigzag(x1, y1, nx, ny, d - 1, r * 0.62).slice(0, -1),
        ...zigzag(nx, ny, x2, y2, d - 1, r * 0.62),
      ]
    }

    const bolts: Bolt[] = []
    const spawnBolt = (): Bolt => {
      const a = anchors[Math.floor(Math.random() * anchors.length)]
      const b = anchors[Math.floor(Math.random() * anchors.length)]
      return {
        pts: zigzag(a.x, a.y, b.x, b.y, 5, 0.46),
        life: 0, maxLife: 16 + Math.random() * 28,
        bright: Math.random() > 0.55,
      }
    }

    // ── Layer 4: Particles ────────────────────────────────────────────────────
    // Fast particles travel along crystallographic angles (mineral/rocky feel)
    const crystalAngles = [0, 60, 90, 120, 180, 240, 270, 300].map(d => d * Math.PI / 180)
    const particles: Particle[] = []
    const spawnP = (): Particle => {
      const fast = Math.random() > 0.58
      const baseAngle = fast
        ? crystalAngles[Math.floor(Math.random() * crystalAngles.length)] + (Math.random() - 0.5) * 0.35
        : Math.random() * Math.PI * 2
      const spd = fast ? 0.75 + Math.random() * 1.35 : 0.18 + Math.random() * 0.45
      return {
        x: Math.random() * W, y: Math.random() * H,
        vx: Math.cos(baseAngle) * spd, vy: Math.sin(baseAngle) * spd,
        trail: [], life: 0,
        maxLife: fast ? 55 + Math.random() * 75 : 95 + Math.random() * 175,
        size: fast ? 0.7 + Math.random() * 1.0 : 0.4 + Math.random() * 0.95,
        fast,
      }
    }
    for (let i = 0; i < 100; i++) {
      const p = spawnP(); p.life = Math.random() * p.maxLife; particles.push(p)
    }

    // ── Layer 3: Scan beams ───────────────────────────────────────────────────
    const beams: Beam[] = []
    const spawnBeam = (): Beam => ({
      y: 0, vy: 0.42 + Math.random() * 0.88,
      life: 0, maxLife: H, alpha: 0.048 + Math.random() * 0.092,
    })
    for (let i = 0; i < 4; i++) {
      const b = spawnBeam(); b.y = Math.random() * H; beams.push(b)
    }

    // ── Render loop ───────────────────────────────────────────────────────────
    let nextBolt = 0
    let animId: number

    const draw = (t: number) => {
      ctx.clearRect(0, 0, W, H)

      // ── 1. Plasma depth blobs ───────────────────────────────────────────────
      for (const blob of blobs) {
        blob.x += blob.vx; blob.y += blob.vy
        if (blob.x + blob.r < 0) blob.x = W + blob.r
        else if (blob.x - blob.r > W) blob.x = -blob.r
        if (blob.y + blob.r < 0) blob.y = H + blob.r
        else if (blob.y - blob.r > H) blob.y = -blob.r

        const pulse = 0.62 + 0.38 * Math.sin(t * 0.00078 + blob.phase)
        const g = ctx.createRadialGradient(blob.x, blob.y, 0, blob.x, blob.y, blob.r)
        g.addColorStop(0,   `rgba(245,183,49,${(blob.alpha * pulse).toFixed(3)})`)
        g.addColorStop(0.5, `rgba(200,138,18,${(blob.alpha * pulse * 0.35).toFixed(3)})`)
        g.addColorStop(1,   "rgba(245,183,49,0)")
        ctx.fillStyle = g
        ctx.beginPath(); ctx.arc(blob.x, blob.y, blob.r, 0, Math.PI * 2); ctx.fill()
      }

      // ── 2. Crystal shard lattice (rocky mineral geometry) ──────────────────
      for (const s of shards) {
        const a = s.baseAlpha * (0.42 + 0.58 * (0.5 + 0.5 * Math.sin(t * 0.00062 + s.phase)))
        ctx.globalAlpha = a
        ctx.strokeStyle = "#f5b731"
        ctx.lineWidth = 0.45
        ctx.beginPath()
        ctx.moveTo(s.pts[0].x, s.pts[0].y)
        for (let j = 1; j < s.pts.length; j++) ctx.lineTo(s.pts[j].x, s.pts[j].y)
        ctx.closePath()
        ctx.stroke()
        if (s.pts.length >= 6) {
          // Subtle mineral fill on larger facets
          ctx.fillStyle = "#f5b731"
          ctx.globalAlpha = a * 0.14
          ctx.fill()
        }
      }
      ctx.globalAlpha = 1

      // ── 3. Laser scan beams ─────────────────────────────────────────────────
      for (let i = 0; i < beams.length; i++) {
        const b = beams[i]
        b.y += b.vy; b.life += b.vy
        if (b.life >= b.maxLife) { beams[i] = spawnBeam(); continue }
        const prog = b.y / H
        const ea = prog < 0.05 ? prog / 0.05 : prog > 0.92 ? (1 - prog) / 0.08 : 1
        const al = b.alpha * ea

        // Wide aura
        const g1 = ctx.createLinearGradient(0, b.y, W, b.y)
        g1.addColorStop(0,   "rgba(245,183,49,0)")
        g1.addColorStop(0.1, `rgba(245,183,49,${(al * 0.5).toFixed(3)})`)
        g1.addColorStop(0.9, `rgba(245,183,49,${(al * 0.5).toFixed(3)})`)
        g1.addColorStop(1,   "rgba(245,183,49,0)")
        ctx.fillStyle = g1; ctx.fillRect(0, b.y - 9, W, 18)

        // Main beam body
        const g2 = ctx.createLinearGradient(0, b.y, W, b.y)
        g2.addColorStop(0,    "rgba(245,183,49,0)")
        g2.addColorStop(0.12, `rgba(245,183,49,${al.toFixed(3)})`)
        g2.addColorStop(0.88, `rgba(245,183,49,${al.toFixed(3)})`)
        g2.addColorStop(1,    "rgba(245,183,49,0)")
        ctx.fillStyle = g2; ctx.fillRect(0, b.y - 1.5, W, 3)

        // Hot-white core
        const g3 = ctx.createLinearGradient(0, b.y, W, b.y)
        g3.addColorStop(0,   "rgba(255,252,220,0)")
        g3.addColorStop(0.2, `rgba(255,252,220,${(al * 0.55).toFixed(3)})`)
        g3.addColorStop(0.8, `rgba(255,252,220,${(al * 0.55).toFixed(3)})`)
        g3.addColorStop(1,   "rgba(255,252,220,0)")
        ctx.fillStyle = g3; ctx.fillRect(0, b.y - 0.6, W, 1.2)
      }

      // ── 4. Particles with glowing trails ────────────────────────────────────
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        p.life++; p.x += p.vx; p.y += p.vy
        if (!p.fast) {
          p.vx += (Math.random() - 0.5) * 0.032
          p.vy += (Math.random() - 0.5) * 0.032
          p.vx *= 0.999; p.vy *= 0.999
        }
        const trailMax = p.fast ? 34 : 22
        p.trail.unshift({ x: p.x, y: p.y })
        if (p.trail.length > trailMax) p.trail.pop()
        if (p.life >= p.maxLife) { particles[i] = spawnP(); continue }

        const ta = p.life / p.maxLife
        const base = ta < 0.1 ? ta / 0.1 : ta > 0.76 ? (1 - ta) / 0.24 : 1

        for (let j = 0; j < p.trail.length - 1; j++) {
          const f = 1 - j / p.trail.length
          ctx.beginPath()
          ctx.moveTo(p.trail[j].x, p.trail[j].y)
          ctx.lineTo(p.trail[j + 1].x, p.trail[j + 1].y)
          // White-hot near the head, golden through the body
          ctx.strokeStyle = j < 5 ? "#fffce0" : "#f5b731"
          ctx.globalAlpha = f * base * (p.fast ? 0.65 : 0.42)
          ctx.lineWidth = p.size * f
          ctx.stroke()
        }
        // White-hot particle head
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * 0.72, 0, Math.PI * 2)
        ctx.fillStyle = "#ffffff"
        ctx.globalAlpha = base * 0.82
        ctx.fill()
      }
      ctx.globalAlpha = 1

      // ── 5. Lightning bolts ───────────────────────────────────────────────────
      if (t > nextBolt && bolts.length < 6) {
        bolts.push(spawnBolt())
        if (Math.random() > 0.42) bolts.push(spawnBolt())
        nextBolt = t + 230 + Math.random() * 650
      }

      for (let i = bolts.length - 1; i >= 0; i--) {
        const bolt = bolts[i]
        bolt.life++
        if (bolt.life >= bolt.maxLife) { bolts.splice(i, 1); continue }

        const ta = bolt.life / bolt.maxLife
        const alpha = ta < 0.08 ? ta / 0.08 : 1 - ta
        const nPts = Math.max(2, Math.floor(Math.min(1, ta * 2.6) * bolt.pts.length))

        ctx.shadowBlur = bolt.bright ? 22 : 12
        ctx.shadowColor = "#f5b731"

        // Glow pass
        ctx.beginPath()
        ctx.moveTo(bolt.pts[0].x, bolt.pts[0].y)
        for (let j = 1; j < nPts; j++) ctx.lineTo(bolt.pts[j].x, bolt.pts[j].y)
        ctx.strokeStyle = "#f5b731"
        ctx.globalAlpha = alpha * (bolt.bright ? 0.42 : 0.25)
        ctx.lineWidth = bolt.bright ? 3.5 : 2
        ctx.stroke()

        // White core
        ctx.beginPath()
        ctx.moveTo(bolt.pts[0].x, bolt.pts[0].y)
        for (let j = 1; j < nPts; j++) ctx.lineTo(bolt.pts[j].x, bolt.pts[j].y)
        ctx.strokeStyle = bolt.bright ? "#ffffff" : "#ffe088"
        ctx.globalAlpha = alpha * (bolt.bright ? 0.9 : 0.64)
        ctx.lineWidth = bolt.bright ? 0.85 : 0.5
        ctx.stroke()

        ctx.shadowBlur = 0
        ctx.globalAlpha = 1
      }

      animId = requestAnimationFrame(draw)
    }

    animId = requestAnimationFrame(draw)

    const onResize = () => {
      W = window.innerWidth; H = window.innerHeight
      canvas.width = W; canvas.height = H
      buildAnchors(); buildShards()
    }
    window.addEventListener("resize", onResize)
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", onResize) }
  }, [])

  return <canvas ref={canvasRef} className="flow-canvas" aria-hidden="true" />
}

// ─────────────────────────────────────────────────────────────────────────────
// SVG SCENE — unchanged from original
// ─────────────────────────────────────────────────────────────────────────────
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
          <rect x="20" y="100" width="40" height="60" rx="4" fill="url(#armGrad)" stroke="#f5b731" strokeWidth="1" strokeOpacity="0.4" />
          <rect x="25" y="105" width="30" height="8" rx="2" fill="#f5b731" fillOpacity="0.15" />
          <circle cx="40" cy="130" r="6" fill="#0f0f08" stroke="#f5b731" strokeWidth="1" strokeOpacity="0.5" />
          <g className="arm-segment-1">
            <rect x="38" y="85" width="80" height="18" rx="3" fill="url(#armGrad)" stroke="#f5b731" strokeWidth="0.8" strokeOpacity="0.3" />
            <circle cx="40" cy="94" r="8" fill="#1a1a12" stroke="#f5b731" strokeWidth="1" strokeOpacity="0.4" />
            <circle cx="40" cy="94" r="4" fill="#f5b731" fillOpacity="0.3" />
            <rect x="55" y="89" width="50" height="3" rx="1" fill="#f5b731" fillOpacity="0.12" />
            <rect x="55" y="95" width="50" height="3" rx="1" fill="#f5b731" fillOpacity="0.08" />
          </g>
          <g className="elbow-joint">
            <circle cx="118" cy="94" r="12" fill="#1a1a12" stroke="#f5b731" strokeWidth="1" strokeOpacity="0.5" />
            <circle cx="118" cy="94" r="6" fill="#0f0f08" stroke="#f5b731" strokeWidth="0.8" strokeOpacity="0.4" />
            <circle cx="118" cy="94" r="3" fill="#f5b731" fillOpacity="0.4" />
          </g>
          <g className="arm-segment-2">
            <path d="M118 94 L180 180" stroke="url(#armGrad)" strokeWidth="16" strokeLinecap="round" />
            <path d="M118 94 L180 180" stroke="#f5b731" strokeWidth="1" strokeOpacity="0.3" strokeLinecap="round" />
            <circle cx="140" cy="125" r="4" fill="#f5b731" fillOpacity="0.15" stroke="#f5b731" strokeWidth="0.5" strokeOpacity="0.3" />
            <circle cx="160" cy="155" r="3" fill="#f5b731" fillOpacity="0.1" stroke="#f5b731" strokeWidth="0.5" strokeOpacity="0.2" />
          </g>
          <g className="wrist-joint">
            <circle cx="180" cy="180" r="10" fill="#1a1a12" stroke="#f5b731" strokeWidth="1" strokeOpacity="0.5" />
            <circle cx="180" cy="180" r="5" fill="#f5b731" fillOpacity="0.3" />
          </g>
          <g className="laser-head">
            <rect x="170" y="185" width="35" height="22" rx="3" fill="url(#armGrad)" stroke="#f5b731" strokeWidth="1" strokeOpacity="0.5" />
            <rect x="172" y="188" width="2" height="16" fill="#f5b731" fillOpacity="0.15" />
            <rect x="176" y="188" width="2" height="16" fill="#f5b731" fillOpacity="0.12" />
            <rect x="180" y="188" width="2" height="16" fill="#f5b731" fillOpacity="0.1" />
            <circle cx="198" cy="196" r="6" fill="#0a0a00" stroke="#f5b731" strokeWidth="1.5" />
            <circle cx="198" cy="196" r="3" className="laser-led" fill="#f5b731" filter="url(#glow)" />
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
          <polygon points="310,380 250,350 270,240 310,200 350,220 370,320 330,370"
            fill="#000" opacity="0.5" transform="translate(5, 5)" />
          <polygon className="crystal-face" points="270,320 270,240 310,200 310,280"
            fill="url(#crystalFace1)" stroke="#f5b731" strokeWidth="0.8" strokeOpacity="0.4" />
          <polygon className="crystal-face" points="310,200 350,220 350,300 310,280"
            fill="url(#crystalFace2)" stroke="#f5b731" strokeWidth="0.8" strokeOpacity="0.5" />
          <polygon className="crystal-face" points="350,300 350,220 370,250 370,330"
            fill="url(#crystalFace1)" stroke="#f5b731" strokeWidth="0.8" strokeOpacity="0.3" />
          <polygon className="crystal-face" points="310,280 350,300 370,330 330,360 290,340 270,320"
            fill="url(#crystalFace3)" stroke="#f5b731" strokeWidth="1" strokeOpacity="0.6" />
          <polygon className="crystal-top" points="270,240 310,200 350,220 330,250 290,240"
            fill="#3a3a28" stroke="#f5b731" strokeWidth="1.2" strokeOpacity="0.7" />
          <g stroke="#f5b731" strokeWidth="0.5" strokeOpacity="0.2">
            <line x1="290" y1="250" x2="310" y2="340" />
            <line x1="330" y1="240" x2="340" y2="330" />
            <line x1="280" y1="280" x2="350" y2="290" />
          </g>
          <circle cx="300" cy="290" r="4" fill="#f5b731" fillOpacity="0.08" />
          <circle cx="330" cy="270" r="3" fill="#f5b731" fillOpacity="0.06" />
          <circle cx="290" cy="310" r="2" fill="#f5b731" fillOpacity="0.1" />
          <line x1="275" y1="260" x2="285" y2="300" stroke="#ffffff" strokeWidth="1" strokeOpacity="0.15" />
          <line x1="345" y1="240" x2="355" y2="280" stroke="#ffffff" strokeWidth="0.8" strokeOpacity="0.1" />
        </g>

        {/* ── IMPACT POINT ── */}
        <g className="impact-point">
          <circle cx="300" cy="230" r="20" fill="url(#impactGlow)" className="impact-glow" />
          <circle cx="300" cy="230" r="8" fill="#ffffff" fillOpacity="0.8" className="impact-core" />
        </g>

        {/* Energy rings */}
        <circle className="energy-ring-1" cx="300" cy="230" r="10" stroke="#f5b731" fill="none" />
        <circle className="energy-ring-2" cx="300" cy="230" r="10" stroke="#f5b731" fill="none" />
        <circle className="energy-ring-3" cx="300" cy="230" r="10" stroke="#ffaa00" fill="none" />

        {/* Sparks */}
        <g className="sparks">
          <circle className="spark-1" cx="300" cy="230" r="2" fill="#f5b731" />
          <circle className="spark-2" cx="300" cy="230" r="1.5" fill="#ffffff" />
          <circle className="spark-3" cx="300" cy="230" r="2" fill="#f5b731" />
          <circle className="spark-4" cx="300" cy="230" r="1.5" fill="#ffaa00" />
        </g>

        {/* Frame corners */}
        <g stroke="#f5b731" strokeWidth="1" strokeOpacity="0.2" fill="none">
          <path d="M20 20 L60 20 L60 50" />
          <path d="M460 20 L420 20 L420 50" />
          <path d="M20 460 L60 460 L60 430" />
          <path d="M460 460 L420 460 L420 430" />
        </g>

        {/* Platform */}
        <ellipse cx="310" cy="385" rx="80" ry="15" fill="#0f0f08" stroke="#f5b731" strokeWidth="0.8" strokeOpacity="0.3" />
        <ellipse cx="310" cy="385" rx="60" ry="10" fill="none" stroke="#f5b731" strokeWidth="0.5" strokeOpacity="0.15" />
      </svg>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// HERO
// ─────────────────────────────────────────────────────────────────────────────
export function Hero() {
  return (
    <>
      <ElectricBackground />
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