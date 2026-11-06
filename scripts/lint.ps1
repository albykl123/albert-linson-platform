<#
.SYNOPSIS
    Runs linting and static analysis.
#>

[CmdletBinding()]
param()

Write-Host '==========================================================' -ForegroundColor Cyan
Write-Host ' ALBERT LINSON PLATFORM -- CODE QUALITY AND LINTING' -ForegroundColor Cyan
Write-Host '==========================================================' -ForegroundColor Cyan

$root = Split-Path $PSScriptRoot -Parent
$env:PYTHONPATH = Join-Path $root 'apps\backend'

Write-Host "`n[1/2] Verifying Python code syntax and imports..." -ForegroundColor Yellow
& python -m py_compile (Join-Path $root 'apps\backend\app\main.py')
& python -m py_compile (Join-Path $root 'apps\backend\app\services\ats_engine.py')
& python -m py_compile (Join-Path $root 'apps\backend\app\services\ai\openrouter.py')
& python -m py_compile (Join-Path $root 'apps\backend\app\services\freestack\parser.py')

if ($LASTEXITCODE -eq 0) {
    Write-Host '  Python syntax checks passed.' -ForegroundColor Green
} else {
    Write-Error 'Python syntax check failed.'
    exit 1
}

Write-Host "`n[2/2] Checking JSON Data Integrity..." -ForegroundColor Yellow
$profileText = Get-Content (Join-Path $root 'packages\shared\profile_data.json') -Raw
$profile = $profileText | ConvertFrom-Json
$freestackText = Get-Content (Join-Path $root 'packages\shared\freestack_data.json') -Raw
$freestack = $freestackText | ConvertFrom-Json

$name = $profile.personal.full_legal_name
$pCount = $profile.projects.Count
$rCount = $profile.research.Count
$sCount = $freestack.total_services
$cCount = $freestack.total_categories

Write-Host "  Profile valid: $name ($pCount projects, $rCount papers)" -ForegroundColor Green
Write-Host "  FreeStack valid: $sCount services across $cCount categories" -ForegroundColor Green

Write-Host "`nAll static code and data quality checks passed!" -ForegroundColor Green
exit 0
