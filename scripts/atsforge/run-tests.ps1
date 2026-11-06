# PowerShell Test Execution Script for ATSForge AI
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " Running ATSForge AI Automated Test Suite (14 Tests)      " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Split-Path -Parent $ScriptDir
$BackendDir = Join-Path $ProjectRoot "apps\backend"

$env:PYTHONPATH = $BackendDir

python -m pytest "$ProjectRoot\tests" -v
