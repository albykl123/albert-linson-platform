<#
.SYNOPSIS
    FreeStack Synchronization Script for Windows PowerShell.
.DESCRIPTION
    Ingests and normalizes the free-for-dev repository into the local FreeStack database and shared catalog.
#>

[CmdletBinding()]
param (
    [string]$SourcePath = "C:\Users\sheeb\Documents\spicitifyextension\free-for-dev-repo\README.md"
)

Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host " FreeStack Intelligence Catalog Synchronization" -ForegroundColor Cyan
Write-Host "=======================================================" -ForegroundColor Cyan

$scriptRoot = $PSScriptRoot
$projectRoot = Split-Path $scriptRoot -Parent
$pyScript = Join-Path $scriptRoot "sync_freestack.py"

if (-not (Test-Path $pyScript)) {
    Write-Error "Sync script not found at $pyScript"
    exit 1
}

Write-Host "Executing FreeStack Markdown ingestion pipeline..." -ForegroundColor Yellow
& python $pyScript

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n[SUCCESS] FreeStack synchronization complete." -ForegroundColor Green
    exit 0
} else {
    Write-Error "`n[ERROR] FreeStack synchronization failed with exit code $LASTEXITCODE."
    exit $LASTEXITCODE
}
