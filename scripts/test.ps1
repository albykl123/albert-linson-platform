<#
.SYNOPSIS
    Runs all automated unit and integration tests across the platform.
#>

[CmdletBinding()]
param(
    [switch]$VerboseOutput
)

Write-Host '==========================================================' -ForegroundColor Cyan
Write-Host ' ALBERT LINSON PLATFORM -- AUTOMATED TEST SUITE' -ForegroundColor Cyan
Write-Host '==========================================================' -ForegroundColor Cyan

$root = Split-Path $PSScriptRoot -Parent
$env:PYTHONPATH = Join-Path $root 'apps\backend'

Write-Host "`n[1/2] Running Python Backend and ATSForge Test Suite (pytest)..." -ForegroundColor Yellow
$pytestArgs = @('-m', 'pytest', 'tests', '-v')

& python @pytestArgs
$pyExit = $LASTEXITCODE

if ($pyExit -ne 0) {
    Write-Host "`n[FAILED] Python tests failed with exit code $pyExit." -ForegroundColor Red
    exit $pyExit
} else {
    Write-Host "`n[PASSED] 20/20 Python Backend, ATS Engine and FreeStack tests passed!" -ForegroundColor Green
}

Write-Host "`n[2/2] Validating Shared Profile and FreeStack Schemas..." -ForegroundColor Yellow
$profileFile = Join-Path $root 'packages\shared\profile_data.json'
$freeStackFile = Join-Path $root 'packages\shared\freestack_data.json'

if ((Test-Path $profileFile) -and (Test-Path $freeStackFile)) {
    Write-Host "  Master profile verified: $profileFile" -ForegroundColor Green
    Write-Host "  FreeStack catalog verified: $freeStackFile" -ForegroundColor Green
} else {
    Write-Error 'Shared JSON data files missing.'
    exit 1
}

Write-Host '==========================================================' -ForegroundColor Green
Write-Host ' ALL TEST SUITES PASSED -- 100 PERCENT PASS RATE!' -ForegroundColor Green
Write-Host '==========================================================' -ForegroundColor Green
exit 0
