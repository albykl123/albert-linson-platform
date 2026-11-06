# OPERATIONS & MAINTENANCE GUIDE

**Platform:** Albert Linson Personal Intelligence Platform  
**Environment:** Windows 10 Pro / Cloudflare Edge  

---

## 1. Routine Operational Commands

| Objective | Command | Purpose |
| :--- | :--- | :--- |
| **Bootstrap Environment** | `.\scripts\bootstrap.ps1` | Verifies Python, Node.js, Git, and directories. |
| **Run All Tests** | `.\scripts\test.ps1` | Executes 20 automated tests across backend and ATS engine. |
| **Start Local Dev** | `.\scripts\dev.ps1` | Launches Next.js frontend (3000) and ATSForge backend (8050). |
| **Code Quality / Lint** | `.\scripts\lint.ps1` | Syntax checks Python files and validates JSON catalogs. |
| **Production Build** | `.\scripts\build.ps1` | Compiles Next.js for Cloudflare production. |
| **Sync FreeStack** | `.\scripts\sync-freestack.ps1` | Re-parses ripienaar/free-for-dev README into shared catalog. |
| **Health Check** | `.\scripts\health-check.ps1` | Tests HTTP 200 responses across all 12 platform endpoints. |
| **Create Backup** | `.\scripts\backup.ps1` | Timestamped snapshot of SQLite DB and configurations. |
| **Restore Backup** | `.\scripts\restore.ps1 -BackupPath <path>` | Restores SQLite database and profile catalogs. |

---

## 2. Managing AI Models in OpenRouter

- **Default Provider**: `OpenRouter Edge Gateway`.
- **Primary Model**: `openrouter/free` (automatically routes to active free models).
- **Secondary Fallbacks**:
  - `google/gemini-2.0-flash-exp:free`
  - `meta-llama/llama-3.3-70b-instruct:free`
  - `deterministic-heuristic` (100% offline, zero API keys required).
- To change the active model at runtime, visit the **Admin Control Center (`/admin`)** and select from the dropdown.

---

## 3. Database Maintenance

- **Local SQLite File**: `apps/backend/data/atsforge.db`.
- **Cloudflare D1**: Serverless SQLite managed via Cloudflare Dashboard or `npx wrangler d1`.
- Backups should be taken before major schema updates using `.\scripts\backup.ps1`.
