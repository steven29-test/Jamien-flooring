# Jamien Flooring (React + MUI)

Includes:
- Home, Catalog, Contact pages
- Admin editor for updating hero, categories, items, and exporting JSON
- Logo + 5 sample images per category (Hybrid / Engineered / Laminate / Vinyl)

## Quick start
```bash
npm install
npm run dev
```

## Images
All images are in `public/images/`.

## Production note
For GitHub Pages/static hosting, set `VITE_ADMIN_ENABLED=false` in production builds to hide the admin route/button.


## Multiple images per item
Admin now supports an **Images list** (one URL per line) and multi-upload (local preview). The first image is used as the thumbnail.


## Reviews
Homepage includes a premium-style reviews section with tabs (All / Premium / Value). Edit reviews in src/data/catalog.json.


## Homepage upgrades
Includes Trust Bar, Project Spotlight, and a Reviews section with tabs.


## Navigation updates
Top nav now has **Products** dropdown (categories) plus **Popular brands** and **Hot deals** pages.

## SEO (v11)
- Added meta title/description/OG tags in `index.html`
- Added JSON-LD structured data (LocalBusiness + WebSite) with Sydney North Shore suburbs in `areaServed`
- Added `public/robots.txt` and `public/sitemap.xml`

**Important:** Update the domain `https://www.jamienflooring.com.au` in `index.html`, `robots.txt`, and `sitemap.xml` once you publish.

## Deploy (GitHub Pages + Custom Domain)

### Repo
- GitHub user: `steven29-test`
- Repo: `jamien-flooring`

### Build modes
- Custom domain (www.jamienflooring.com.au): `npm run build` (base = `/`)
- GitHub project URL preview: `npm run build:github` (base = `/jamien-flooring/`)

### GitHub Pages (GitHub Actions)
1. Push to `main`.
2. In GitHub repo → Settings → Pages → set **Build and deployment** to **GitHub Actions**.
3. The workflow in `.github/workflows/deploy.yml` will publish automatically.

### Custom domain
1. Registrar DNS:
   - Add `www` CNAME → `steven29-test.github.io`
   - For apex `www.jamienflooring.com.au`, add A records to GitHub Pages IPs (see GitHub Pages docs).
2. GitHub repo → Settings → Pages → Custom domain: `www.www.jamienflooring.com.au`
3. Enable **Enforce HTTPS** once available.

A `public/CNAME` file is included so GitHub Pages keeps your domain.

### Email
Website contact email is set to `info@www.jamienflooring.com.au` in `src/data/catalog.json`.
To make the mailbox work, purchase email hosting at Cheaper Domains (or another provider) and add the MX records they provide in your domain DNS.

## Admin access (hidden)
The `/admin` page is **hidden by default**.
To open it, add a query parameter that matches your secret key:

Example:
`/admin?adminKey=YOUR_KEY`

Set your key in `.env.local`:
- `VITE_ADMIN_ENABLED=true`
- `VITE_ADMIN_KEY=your-long-random-string`

**Important:** keep the key private. Anyone with the link can access the admin UI.


## Contact form (background email via Formspree)

This site uses Formspree to send contact emails in the background (no server required).

1) Create a free form at Formspree and copy your endpoint URL (looks like `https://formspree.io/f/xxxxxxx`)
2) Put it into `.env.local`:

```
VITE_FORMSPREE_ENDPOINT=https://formspree.io/f/xxxxxxx
```

3) Restart dev server:
```
npm run dev
```



Note: In Formspree dashboard, set the recipient email to info@jamienflooring.com.au so messages arrive in your mailbox.

## Contact form (EmailJS — sends in background, no backend)

This site uses EmailJS to send contact emails in the background from the browser.

### Setup (use your CheaperDomains SMTP)
1) Create an EmailJS account
2) Add a new **Email Service** using **SMTP**:
   - SMTP Host: mail.cheaperdomains.com.au
   - Port: 465 (SSL) or 587 (STARTTLS)
   - Username: info@jamienflooring.com.au
   - Password: (your mailbox password)
3) ### Create an Email Template with variables (match the code)
Use these variables in your template:
- {{title}}
- {{name}}
- {{email}}
- {{time}}
- {{message}}

4) Put your IDs/Key into `.env.local`:
```
VITE_EMAILJS_SERVICE_ID=...
VITE_EMAILJS_TEMPLATE_ID=...
VITE_EMAILJS_PUBLIC_KEY=...
```

### Production (GitHub Pages)
Set these in GitHub repo:
Settings → Secrets and variables → Actions → **Variables**
- VITE_EMAILJS_SERVICE_ID
- VITE_EMAILJS_TEMPLATE_ID
- VITE_EMAILJS_PUBLIC_KEY

## GitHub Pages note
If you host under a repo path (e.g. `...github.io/jamien-flooring/`), Vite must use `base: "./"` in `vite.config.ts` so JS/CSS load correctly.
Also GitHub Pages URLs are case-sensitive.

## GitHub Pages Troubleshooting
- In repo **Settings → Pages**, set **Source = GitHub Actions** (not 'Deploy from a branch').
- Your project URL is case-sensitive: use `/jamien-flooring/` (lowercase).
- Vite is configured with `base: "./"` so assets load correctly.
