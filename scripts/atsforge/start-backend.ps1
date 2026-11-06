# PowerShell Startup Script for ATSForge AI Backend & Unified Web Platform
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " Starting ATSForge AI Platform on http://127.0.0.1:8050    " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Split-Path -Parent $ScriptDir
$BackendDir = Join-Path $ProjectRoot "apps\backend"

$env:PYTHONPATH = $BackendDir

Write-Host "Serving unified web application and API..." -ForegroundColor Green
python -m uvicorn app.main:app --host 127.0.0.1 --port 8050 --reload
