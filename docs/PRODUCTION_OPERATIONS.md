# PRODUCTION OPERATIONS & RUNBOOK
**Platform:** Albert Linson Professional Intelligence Platform  
**Live URL:** [https://albert-linson-platform.albertkalampadan.workers.dev](https://albert-linson-platform.albertkalampadan.workers.dev)  
**Edge Provider:** Cloudflare Workers (`@opennextjs/cloudflare`)  

---

## 1. Operating Boundaries & Secrets

| Secret / Config | Location | Functionality |
|---|---|---|
| `ADMIN_SECRET_KEY` | Cloudflare Worker Encrypted Secret | Validates owner login and derives HMAC `albert_admin_session_v4` |
| `OPENROUTER_API_KEY` | Cloudflare Worker Encrypted Secret | Server-side bearer token for AI completions (`/api/chat`, `/api/ai`) |
| `CLOUDFLARE_API_TOKEN` | GitHub Actions Repository Secret | Deploys OpenNext bundles to Cloudflare edge on push to `main` |
| `CLOUDFLARE_ACCOUNT_ID` | GitHub Actions Repository Secret | Directs deployment to user's Cloudflare account |
| `GOOGLE_CLIENT_ID` | Cloudflare Worker Secret (Optional) | Authorizes Gmail OAuth integration |
| `GOOGLE_CLIENT_SECRET` | Cloudflare Worker Secret (Optional) | Authorizes Gmail OAuth token exchange |

---

## 2. Emergency Operations & Rollback

### Rollback Points
* **Milestone 1 Baseline:** Commit `14e06d8`
* **Milestone 2–4 Complete:** Commit will be recorded in `docs/DEPLOYMENT_LOG.md`

### Rollback Command
```powershell
git checkout <COMMIT_SHA>
git push origin <COMMIT_SHA>:main --force
```
The automated CI/CD pipeline will automatically re-bundle the previous commit and re-deploy to Cloudflare Workers in under 3 minutes.
