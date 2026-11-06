<#
.SYNOPSIS
    Bootstrap script for the Albert Linson Personal Intelligence Platform.
.DESCRIPTION
    Validates Python 3.14+, Node.js v24+, Git, sets up directories, and verifies dependencies.
#>

[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'

Write-Host '==========================================================' -ForegroundColor Cyan
Write-Host ' ALBERT LINSON -- PERSONAL INTELLIGENCE PLATFORM BOOTSTRAP' -ForegroundColor Cyan
Write-Host '==========================================================' -ForegroundColor Cyan

# 1. Check Python
Write-Host "`n[1/5] Checking Python installation..." -ForegroundColor Yellow
try {
    $pyVersion = & python --version 2>&1
    Write-Host "  Found Python: $pyVersion" -ForegroundColor Green
} catch {
    Write-Error 'Python is not found on PATH. Please install Python 3.14+.'
    exit 1
}

# 2. Check Node.js and npm
Write-Host "`n[2/5] Checking Node.js and npm..." -ForegroundColor Yellow
try {
    $nodeVersion = & node --version 2>&1
    $npmVersion = & npm --version 2>&1
    Write-Host "  Found Node.js: $nodeVersion" -ForegroundColor Green
    Write-Host "  Found npm: $npmVersion" -ForegroundColor Green
} catch {
    Write-Error 'Node.js or npm not found on PATH.'
    exit 1
}

# 3. Check Git
Write-Host "`n[3/5] Checking Git installation..." -ForegroundColor Yellow
try {
    $gitVersion = & git --version 2>&1
    Write-Host "  Found Git: $gitVersion" -ForegroundColor Green
} catch {
    Write-Error 'Git not found on PATH.'
    exit 1
}

# 4. Initialize Directories
Write-Host "`n[4/5] Ensuring project directories exist..." -ForegroundColor Yellow
$dirs = @(
    'apps\backend\data\uploads',
    'apps\backend\data\exports',
    'packages\shared',
    'docs',
    'scripts'
)
foreach ($d in $dirs) {
    if (-not (Test-Path $d)) {
        New-Item -ItemType Directory -Force -Path $d | Out-Null
        Write-Host "  Created: $d" -ForegroundColor Gray
    }
}
Write-Host '  Directories verified.' -ForegroundColor Green

# 5. FreeStack Sync
Write-Host "`n[5/5] Checking FreeStack intelligence catalog..." -ForegroundColor Yellow
$syncScript = Join-Path $PSScriptRoot 'sync-freestack.ps1'
if (Test-Path $syncScript) {
    & $syncScript
}

Write-Host "`n==========================================================" -ForegroundColor Green
Write-Host ' BOOTSTRAP COMPLETE! Ready to run dev.ps1 or test.ps1' -ForegroundColor Green
Write-Host '==========================================================' -ForegroundColor Green
exit 0
