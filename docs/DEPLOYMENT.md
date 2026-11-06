# CLOUD DEPLOYMENT GUIDE

**Platform:** Albert Linson Personal Intelligence Platform  
**Target Infrastructure:** Cloudflare Workers + OpenNext (`@opennextjs/cloudflare`)  
**Database & Storage:** Cloudflare D1 (SQLite) + Cloudflare R2 (Buckets)  
**Free Tier Limits:** 100% Eligible, Zero Monthly Cost, No Credit Card Required  

---

## 1. Prerequisites

1. **GitHub Account**: Destination repository to push code and run automated GitHub Actions CI/CD.
2. **Cloudflare Account**: Free account at [dash.cloudflare.com](https://dash.cloudflare.com).
3. **OpenRouter API Key (Optional for AI bullet optimization)**: Free API key from [openrouter.ai](https://openrouter.ai).

---

## 2. Automated Deployment via GitHub Actions (Recommended)

### Step 1: Create GitHub Repository & Push
```powershell
git remote add origin https://github.com/<your-username>/albert-linson-platform.git
git branch -M main
git push -u origin main
```

### Step 2: Configure GitHub Repository Secrets
Navigate to your GitHub repository:
**Settings &rarr; Secrets and variables &rarr; Actions &rarr; New repository secret**

Add the following 4 secrets:
| Secret Name | Description | Where to Obtain |
|---|---|---|
| `CLOUDFLARE_API_TOKEN` | Cloudflare API Token with `Workers Scripts:Edit`, `Account Settings:Read`, `D1:Edit` permissions | Cloudflare Dashboard &rarr; Profile &rarr; API Tokens &rarr; Create Custom Token |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare Account ID | Cloudflare Dashboard &rarr; Right Sidebar on any Zone / Workers overview |
| `OPENROUTER_API_KEY` | (Optional) OpenRouter API key for LLM suggestions | [openrouter.ai/keys](https://openrouter.ai/keys) |
| `ADMIN_SECRET_KEY` | Private passkey to unlock `/admin` and `/studio` management console | Choose any random secret string (e.g. `albert-secure-vault-2026`) |

### Step 3: Trigger Automated Deployment
- Any commit pushed to `main` triggers `.github/workflows/deploy.yml`.
- The workflow executes:
  1. Full Pytest test suite (20/20 tests).
  2. JSON data validation (`profile_data.json` & 1,369 FreeStack services).
  3. Next.js 14 compilation with `@opennextjs/cloudflare`.
  4. Automatic deployment to Cloudflare Workers with asset binding.
- A live global production URL will be generated: `https://albert-linson-platform.<your-subdomain>.workers.dev`.

---

## 3. Direct PowerShell Deployment (Alternative)

To deploy directly from your local terminal using Wrangler:

```powershell
# 1. Login to Cloudflare via browser
npx wrangler login

# 2. Provision Free-Tier Cloudflare D1 Database
npx wrangler d1 create albert-linson-db

# 3. Provision Free-Tier Cloudflare R2 Bucket
npx wrangler r2 bucket create albert-linson-resumes

# 4. Build and Deploy OpenNext Worker
Set-Location apps/web
npx @opennextjs/cloudflare
npx wrangler deploy
```

---

## 4. Custom Domain Configuration (Optional)

1. Open Cloudflare Dashboard &rarr; **Compute (Workers)** &rarr; `albert-linson-platform`.
2. Click **Settings** &rarr; **Domains & Routes** &rarr; **Add Custom Domain**.
3. Enter your custom domain (e.g. `albertlinson.com`). Cloudflare handles DNS routing and provisions free universal SSL/TLS certificates automatically.
