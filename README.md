# CipherZero Solutions — Website

Marketing site for CipherZero Solutions (IT, cloud & cybersecurity, Sudbury, Ontario).

Static site — no build step.

```
index.html          page markup and content
assets/styles.css   styles (brand tokens at the top)
assets/main.js      interactions (hero carousel, service drawer, IT health check, filters)
assets/logos/       partner logos (Simple Icons, simpleicons.org)
```

## Run locally

```
python3 -m http.server 5500
```

Then open http://localhost:5500.

## Hosting

Any static host works (GitHub Pages, Netlify, Vercel, Cloudflare Pages): serve the repository root.
