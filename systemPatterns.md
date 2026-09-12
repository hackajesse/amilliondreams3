# System Patterns — A Million Dreams

## Stack

- **Astro 7** static site (`output: 'static'`)
- **Cloudflare Pages** hosting + GitHub CI deploy
- **Cloudflare Pages Function** at `functions/api/contact.js` for contact form
- **amd-mailer Worker** (`workers/mailer/`) sends contact mail via **Gmail API** (Workspace OAuth)
- **Inbound mail:** Google Workspace MX (not Cloudflare Email Routing)
- **Turnstile** bot protection on contact form
- No CMS, no content collections, no markdown content pipeline

## Site structure

- Single-page marketing site: `src/pages/index.astro` only
- Sections composed as Astro components under `src/components/`
- Shared layout/SEO: `src/layouts/BaseLayout.astro`
- Styles: `src/styles/global.css` + `src/styles/tokens.css` (CSS variables)

## Page section order

Nav → Hero → Services → Work → About → Shipping → Contact → Footer

## Content patterns

- All user-facing copy lives inline in `.astro` components
  (no separate content/data layer)
- Service and case-study data defined as const arrays at top of component frontmatter
- SEO defaults (title, description, JSON-LD) centralized in BaseLayout props
- Voice / ban list: `.claude/product-marketing-context.md`

## Naming

- Brand: "A Million Dreams" / "A Million Dreams LLC"
- Domain: amilliondreams.llc
- Founder: Jesse Biroscak
- Location signal: Boston, MA
  (remote or on-site with teams across the U.S.)
- Services pillar 02: Process & Automation
  (process-first; tech only after the process is worth running)
