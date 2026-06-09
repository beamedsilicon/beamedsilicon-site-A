# Beamed Silicon — Semiconductor Intelligence Platform

The definitive knowledge base for semiconductor supply chain intelligence. 350 companies. 7 supply chain tiers. Updated daily.

## 📋 Quick Start

### Local Development

```bash
# Install dependencies
npm install

# Start local server (http://localhost:8000)
npm run dev
```

The site runs as a static HTML file with no build step required.

### Deployment

This site is optimized for **Vercel** hosting:

```bash
# Deploy to Vercel
vercel
```

## 📊 Performance Monitoring

### Vercel Speed Insights

This site integrates **Vercel Speed Insights** to track Core Web Vitals:
- **LCP** (Largest Contentful Paint)
- **FID** (First Input Delay)
- **CLS** (Cumulative Layout Shift)

**To enable Speed Insights:**

1. Log in to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select this project: `beamedsilicon-site`
3. Go to **Settings** → **Analytics** → **Speed Insights**
4. Enable "Speed Insights" toggle
5. Deploy this branch (with the `/_vercel/speed-insights/script.js` tags in `<head>`)
6. Within 24-48 hours, metrics will appear in your Vercel Analytics dashboard

**View metrics:**
- Vercel Dashboard → Project → **Analytics** → **Speed Insights** tab
- Monitor real user performance data as visitors load the site

## 🏗️ Architecture

### Files

- `index.html` — Main HTML file with embedded styles and vanilla JavaScript
- `package.json` — Node.js project config for local dev server
- `.gitattributes` — Enforces consistent line endings (LF) across the repository

### Tech Stack

- **HTML5** — Semantic markup
- **CSS3** — Embedded styles (no preprocessor)
- **Vanilla JavaScript** — Dynamic tier accordion UI, company search
- **Vercel Hosting** — Edge deployment, automatic Speed Insights integration

## 🎨 UI Components

### Supply Chain Explorer
- **7-tier hierarchy** of semiconductor companies
- **Collapsible panels** for each tier (JavaScript-driven)
- **Live search** filtering across 350 companies
- **Color-coded tiers** (cyan, blue, purple, amber, green, etc.)

### News & Analysis
- Featured analysis section with author profiles
- 3-column grid of latest articles
- Topic tags for filtering by keyword

### Newsletter Signup
- Email capture form
- Call-to-action above the fold

## 🔧 Development

### Scripts

```bash
npm run dev      # Start http-server on localhost:8000
npm run build    # No-op (static site)
npm run lint     # No-op (configure as needed)
```

### Customization

- **Colors:** Edit CSS custom properties in `<style>` (`--cyan`, `--amber`, etc.)
- **Company data:** Edit the `TIERS` array in the `<script>` block at the bottom
- **Content:** Edit text, headlines, and descriptions directly in HTML

## 📦 Dependencies

- **http-server** (dev only) — Local development server
- No production dependencies — pure HTML/CSS/JS

## 📝 Notes

- Line endings are normalized to **LF** (Unix-style) via `.gitattributes`
- Vercel Speed Insights is injected automatically on deploy—no npm package installation needed
- The site is fully functional without JavaScript (graceful degradation)

## 📚 Resources

- [Vercel Speed Insights Documentation](https://vercel.com/docs/speed-insights)
- [Web Vitals Guide](https://web.dev/vitals/)
- [Semiconductor Supply Chain Data](https://beamedsilicon.com)
