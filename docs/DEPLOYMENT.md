# CLOUD DEPLOYMENT GUIDE

**Platform:** Albert Linson Personal Intelligence Platform  
**Target Infrastructure:** Cloudflare (Pages / Workers / D1 / R2)  
**Free Tier Limits:** 100% Eligible, Zero Monthly Cost, No Card Required  

---

## 1. Prerequisites

1. **GitHub Account**: Access to push repository to GitHub.
2. **Cloudflare Account**: Free account at [cloudflare.com](https://dash.cloudflare.com).
3. **OpenRouter API Key (Optional for AI)**: Free key from [openrouter.ai](https://openrouter.ai).

---

## 2. Automated Deployment via GitHub Actions (Recommended)

1. **Push Repository to GitHub**:
   ```powershell
   git init
   git add .
   git commit -m "feat: complete Albert Linson Personal Intelligence Platform"
   git remote add origin https://github.com/albertlinson/albert-linson-platform.git
   git push -u origin main
   ```

2. **Add GitHub Repository Secrets**:
   Navigate to **Settings &rarr; Secrets and variables &rarr; Actions &rarr; New repository secret**:
   - `CLOUDFLARE_API_TOKEN`: Cloudflare API token with Pages edit permissions.
   - `CLOUDFLARE_ACCOUNT_ID`: Cloudflare Account ID from dashboard overview.
   - `OPENROUTER_API_KEY`: OpenRouter API key for AI resume optimization.

3. **Automatic Deployment**:
   - Every push to `main` triggers `.github/workflows/deploy.yml`.
   - The workflow executes the 20-test test suite, validates JSON schemas, builds the Next.js bundle, and deploys directly to Cloudflare Pages.
   - Generates a live, global production URL (e.g. `https://albert-linson-platform.pages.dev`).

---

## 3. Direct Manual Deployment via Wrangler

You can also deploy directly from PowerShell:

```powershell
# Authenticate with Cloudflare
npx wrangler login

# Create production Cloudflare D1 Database (if not existing)
npx wrangler d1 create albert-linson-db

# Deploy Next.js to Cloudflare Pages
.\scripts\deploy.ps1
```

---

## 4. Custom Domain Configuration (Optional)

1. Open Cloudflare Dashboard &rarr; **Workers & Pages** &rarr; `albert-linson-platform`.
2. Click **Custom Domains** &rarr; **Set up a domain**.
3. Enter your domain (e.g. `albertlinson.com`). Cloudflare automatically provisions a free SSL certificate.
