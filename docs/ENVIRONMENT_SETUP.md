# ENVIRONMENT SETUP GUIDE

**Operating System:** Windows 10 Pro / Windows 11  
**Shell:** Windows PowerShell 7  

---

## 1. Prerequisites Check

Verify your installed versions:
```powershell
python --version   # Must be Python 3.12+ (Found 3.14.7)
node --version     # Must be Node.js 18+ (Found v24.18.0)
npm --version      # Must be npm 9+ (Found 11.16.0)
git --version      # Must be Git 2.30+ (Found 2.55.0)
```

---

## 2. One-Command Bootstrap

Open PowerShell in the project workspace:
```powershell
Set-Location "C:\Users\sheeb\Documents\resume"
.\scripts\bootstrap.ps1
```

This will:
1. Verify system binaries.
2. Initialize runtime directories (`apps\backend\data\uploads`, `exports`).
3. Run the FreeStack sync pipeline to ingest 1,369 developer tools.

---

## 3. Running Automated Tests

```powershell
.\scripts\test.ps1
```
Executes the full 20-test test suite across the ATS scoring engine, exporters, OpenRouter gateway, and FreeStack parser.

---

## 4. Running the Development Server

```powershell
.\scripts\dev.ps1
```
- Starts Next.js frontend on `http://127.0.0.1:3000`
- Starts ATSForge backend on `http://127.0.0.1:8050`
