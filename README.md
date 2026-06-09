# Beamed Silicon — Semiconductor Intelligence Platform

The definitive knowledge base for semiconductor supply chain intelligence. 350 companies. 7 supply chain tiers. Updated daily.

**Live Site:** https://beamedsilicon-site.vercel.app

---

## 📋 Quick Start

### Prerequisites

- Node.js 18+ and npm/yarn

### Local Development

```bash
# Install dependencies
npm install

# Start development server (http://localhost:3000)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the site.

### Build for Production

```bash
npm run build
npm start
```

---

## 📊 Performance Monitoring: Vercel Speed Insights

This site integrates **Vercel Speed Insights** to track Core Web Vitals in production:

- **LCP** (Largest Contentful Paint) — Loading performance
- **FID** (First Input Delay) — Interactivity  
- **CLS** (Cumulative Layout Shift) — Visual stability

### How Speed Insights Works

The `@vercel/speed-insights` package is installed as a dependency. The `<SpeedInsights />` component is imported and used in `app/layout.tsx`, which:

1. Automatically collects Core Web Vitals from real users
2. Sends data to Vercel's analytics servers (only when deployed)
3. Displays metrics in the Vercel Dashboard

**Note:** Speed Insights only collects data in production deployments on Vercel, not in local development.

### Enabling Speed Insights in Vercel Dashboard

1. **Deploy to Vercel** (if not already deployed)
   ```bash
   # Your code is auto-deployed via GitHub integration
   # Or manually:
   vercel
   ```

2. **Log in to [Vercel Dashboard](https://vercel.com/dashboard)**
   - Select the `beamedsilicon-site` project
   - Go to **Settings** → **Analytics** → **Speed Insights**
   - Toggle **Speed Insights: ON**

3. **View Your Metrics**
   - Once enabled, real user performance data will start appearing within 24-48 hours
   - Visit **Project** → **Analytics** → **Speed Insights** tab
   - Monitor metrics like:
     - Largest Contentful Paint (LCP)
     - First Input Delay (FID)
     - Cumulative Layout Shift (CLS)
     - Page load times by region/device
     - Real user metrics

### Speed Insights in Code

The integration is minimal and automatic:

```tsx
// app/layout.tsx
import { SpeedInsights } from "@vercel/speed-insights/next"

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  )
}
```

The component injects tracking code and doesn't affect your site's appearance or functionality.

---

## 🏗️ Architecture

### Tech Stack

- **Next.js 15** — React framework for production
- **React 19** — UI library
- **TypeScript** — Type safety
- **CSS3** — Component-scoped and global styles
- **Vercel** — Hosting, edge functions, Speed Insights
- **yahoo-finance2** — Real-time financial data (stocks)

### Project Structure

```
beamedsilicon-site/
├── app/
│   ├── layout.tsx              # Root layout with Speed Insights
│   ├── globals.css             # Global styles
│   ├── page.tsx                # Home page
│   ├── sitemap.ts              # SEO sitemap
│   ├── robot.ts                # Robots.txt
│   ├── api/                    # API routes (optional)
│   ├── news/                   # News section (optional)
│   ├── markets/                # Markets section (optional)
│   └── analysis/               # Analysis section (optional)
├── components/                 # Reusable React components
├── lib/                        # Utility functions
├── public/                     # Static assets (images, fonts, etc.)
├── package.json                # Dependencies and scripts
├── tsconfig.json               # TypeScript configuration
├── next.config.mjs             # Next.js configuration
├── .gitattributes              # Line ending enforcement
└── README.md                   # This file
```

### Key Components

- **Supply Chain Explorer** — Interactive 7-tier hierarchy of 350+ semiconductor companies
- **News Feed** — Latest industry updates and analysis
- **Markets Data** — Real-time stock prices via yahoo-finance2
- **Newsletter Signup** — Email capture for subscriber management
- **SEO** — Structured data (JSON-LD), meta tags, sitemap

---

## 🔧 Development

### Available Scripts

```bash
npm run dev       # Start development server (hot reload on localhost:3000)
npm run build     # Create optimized production build
npm start         # Run production server locally
npm run lint      # Run ESLint on codebase
```

### Environment Variables

Create a `.env.local` file for local development:

```bash
# .env.local
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_ANALYTICS_ID=your-vercel-analytics-id
```

### Customization

- **Styling:** Edit `app/globals.css` for global styles, or create component-scoped `.module.css` files
- **Company Data:** Update data sources in appropriate components
- **Content:** Edit page content in `app/**/*.tsx` files
- **Colors & Theme:** Modify CSS custom properties or Tailwind config (if using Tailwind)

### TypeScript

All `.tsx` and `.ts` files are type-checked during build and development. Use TypeScript for:

- Component props: `interface ComponentProps { ... }`
- Server functions: `'use server'` directive for Server Components
- API routes: Typed request/response handlers

---

## 📦 Dependencies

### Production Dependencies

- **next** — React framework and server
- **react** / **react-dom** — React library
- **@vercel/speed-insights** — Performance monitoring
- **yahoo-finance2** — Financial data API

### Dev Dependencies

- **typescript** — Type checking
- **@types/node** — Node.js type definitions
- **@types/react** / **@types/react-dom** — React type definitions

To add new dependencies:

```bash
npm install package-name
npm install --save-dev @types/package-name  # If TypeScript types are needed
```

---

## 🚀 Deployment

### Deploy to Vercel

#### Option 1: GitHub Integration (Recommended)

1. Push your code to GitHub
   ```bash
   git push origin main
   ```

2. Connect your GitHub repo in [Vercel Dashboard](https://vercel.com)
   - Select **Add New** → **Project**
   - Import your GitHub repository
   - Click **Deploy**

3. Auto-deploy on every push to `main` branch

#### Option 2: Vercel CLI

```bash
# Install Vercel CLI (if not already installed)
npm i -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Post-Deployment Steps

1. **Enable Speed Insights** (see Performance Monitoring section above)
2. **Monitor Performance** in Vercel Dashboard → Analytics
3. **Set Custom Domain** (optional) in Vercel Settings

---

## 📝 Important Notes

### Line Endings

This project enforces **LF (Unix-style) line endings** via `.gitattributes`. This ensures:

- Consistent line endings across Windows, macOS, and Linux
- No spurious diffs from line ending changes
- Smooth collaboration in teams

**For your editor:**

- **VS Code:** Add to `.vscode/settings.json`:
  ```json
  {
    "files.eol": "\n"
  }
  ```

- **WebStorm/IntelliJ:** File → File Properties → Line Separators → LF
- **Sublime Text:** View → Line Endings → Unix

### Performance Best Practices

- Speed Insights monitors real user data automatically—no manual instrumentation needed
- Review metrics regularly to identify bottlenecks
- Use Next.js built-in optimizations:
  - `next/image` for image optimization
  - Dynamic imports for code splitting
  - Automatic CSS minification
  - Edge Functions for API routes

### SEO

- Structured data (JSON-LD) is embedded in the layout for better search visibility
- Sitemap and robots.txt are auto-generated
- Open Graph and Twitter metadata are configured
- Mobile-responsive design via Next.js default behavior

---

## 🐛 Troubleshooting

### Speed Insights Not Showing Data

- **Verify:** You've enabled Speed Insights in Vercel Dashboard → Settings → Analytics
- **Wait:** Data takes 24-48 hours to appear after first deployment
- **Check:** Ensure site is deployed to Vercel (not localhost or other hosts)

### Build Errors

```bash
# Clear Next.js cache and rebuild
rm -rf .next
npm run build
```

### Port Already in Use

```bash
# Use a different port
npm run dev -- -p 3001
```

---

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Speed Insights Docs](https://vercel.com/docs/speed-insights)
- [Web Vitals Guide](https://web.dev/vitals/)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

## 📧 Support

For questions or issues:

- Check the [Next.js GitHub Discussions](https://github.com/vercel/next.js/discussions)
- Review [Vercel Documentation](https://vercel.com/docs)
- Open an issue on this repository's GitHub

---

**Last Updated:** June 2026  
**Maintained by:** Beamed Silicon Team  
**License:** MIT (if applicable)
