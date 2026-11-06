<#
.SYNOPSIS
    Starts local development services (Next.js frontend + optional FastAPI backend).
#>

[CmdletBinding()]
param(
    [switch]$BackendOnly,
    [switch]$FrontendOnly,
    [int]$Port = 3000
)

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " ALBERT LINSON PLATFORM -- LOCAL DEVELOPMENT ENVIRONMENT" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

$root = Split-Path $PSScriptRoot -Parent
$env:PYTHONPATH = Join-Path $root "apps\backend"

if (-not $FrontendOnly) {
    Write-Host "`nStarting ATSForge Python Backend on http://127.0.0.1:8050..." -ForegroundColor Yellow
    Start-Process -FilePath "python" -ArgumentList "-m", "uvicorn", "app.main:app", "--host", "127.0.0.1", "--port", "8050", "--reload" -WindowStyle Normal
    Write-Host "  Backend running in background (Port 8050)." -ForegroundColor Green
}

if (-not $BackendOnly) {
    Set-Location (Join-Path $root "apps\web")
    Write-Host "`nStarting Next.js Frontend on http://127.0.0.1:$Port..." -ForegroundColor Yellow
    npm run dev
}
