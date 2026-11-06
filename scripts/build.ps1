<#
.SYNOPSIS
    Builds the platform for production.
#>

[CmdletBinding()]
param()

$ErrorActionPreference = "Stop"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " ALBERT LINSON PLATFORM — PRODUCTION BUILD" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

$root = Split-Path $PSScriptRoot -Parent

# 1. Validate tests first
Write-Host "`n[1/3] Running automated tests before build..." -ForegroundColor Yellow
$testScript = Join-Path $PSScriptRoot "test.ps1"
& $testScript
if ($LASTEXITCODE -ne 0) {
    Write-Error "Build aborted: Automated tests failed."
    exit 1
}

# 2. Sync FreeStack
Write-Host "`n[2/3] Updating FreeStack assets..." -ForegroundColor Yellow
$syncScript = Join-Path $PSScriptRoot "sync-freestack.ps1"
& $syncScript

# 3. Build Next.js
Write-Host "`n[3/3] Compiling Next.js application..." -ForegroundColor Yellow
Set-Location (Join-Path $root "apps\web")
npm run build
$buildExit = $LASTEXITCODE

Set-Location $root

if ($buildExit -eq 0) {
    Write-Host "`n==========================================================" -ForegroundColor Green
    Write-Host " PRODUCTION BUILD SUCCEEDED!" -ForegroundColor Green
    Write-Host "==========================================================" -ForegroundColor Green
    exit 0
} else {
    Write-Error "Next.js production build failed."
    exit $buildExit
}
