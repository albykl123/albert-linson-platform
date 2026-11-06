<#
.SYNOPSIS
    Cloudflare and GitHub deployment orchestrator.
#>

[CmdletBinding()]
param(
    [switch]$SkipTests,
    [string]$Target = 'cloudflare'
)

Write-Host '==========================================================' -ForegroundColor Cyan
Write-Host ' ALBERT LINSON PLATFORM -- CLOUD DEPLOYMENT' -ForegroundColor Cyan
Write-Host " Target Provider: $Target (Zero-Cost Free Developer Tier)" -ForegroundColor Cyan
Write-Host '==========================================================' -ForegroundColor Cyan

$root = Split-Path $PSScriptRoot -Parent

# 1. Pre-deployment Verification
if (-not $SkipTests) {
    Write-Host "`n[1/3] Running pre-deployment verification test suite..." -ForegroundColor Yellow
    $testScript = Join-Path $PSScriptRoot 'test.ps1'
    & $testScript
    if ($LASTEXITCODE -ne 0) {
        Write-Error 'Deployment aborted: Critical tests failed.'
        exit 1
    }
} else {
    Write-Host "`n[1/3] Skipping tests (-SkipTests specified)..." -ForegroundColor Gray
}

# 2. Check Git Status
Write-Host "`n[2/3] Checking Git working tree..." -ForegroundColor Yellow
$gitStatus = & git status --porcelain 2>&1
if ($gitStatus) {
    Write-Host '  Note: Uncommitted local changes detected in working tree.' -ForegroundColor Yellow
} else {
    Write-Host '  Working tree is clean.' -ForegroundColor Green
}

# 3. Cloudflare Deployment Instructions
Write-Host "`n[3/3] Cloudflare Deployment Options:" -ForegroundColor Yellow
Write-Host '  Option A (Direct OpenNext Cloudflare Workers Deploy):' -ForegroundColor White
Write-Host '    Set-Location apps/web; npx @opennextjs/cloudflare; npx wrangler deploy' -ForegroundColor Gray
Write-Host '  Option B (GitHub Actions Automated CI/CD):' -ForegroundColor White
Write-Host '    git add .' -ForegroundColor Gray
Write-Host "    git commit -m 'Release v1.0.0'" -ForegroundColor Gray
Write-Host '    git push origin main' -ForegroundColor Gray
Write-Host '    (Automated pipeline executes via .github/workflows/deploy.yml)' -ForegroundColor Gray

Write-Host "`n==========================================================" -ForegroundColor Green
Write-Host ' DEPLOYMENT ORCHESTRATION READY!' -ForegroundColor Green
Write-Host '==========================================================' -ForegroundColor Green
exit 0
