<#
.SYNOPSIS
    Restores platform database from a specified backup folder.
#>

[CmdletBinding()]
param(
    [Parameter(Mandatory=$true)]
    [string]$BackupPath
)

if (-not (Test-Path $BackupPath)) {
    Write-Error "Specified backup folder does not exist: $BackupPath"
    exit 1
}

Write-Host "Restoring platform data from: $BackupPath" -ForegroundColor Yellow

$dbBackup = Join-Path $BackupPath "atsforge.db"
if (Test-Path $dbBackup) {
    Copy-Item $dbBackup -Destination "apps\backend\data\atsforge.db" -Force
    Write-Host "  Database restored to apps\backend\data\atsforge.db" -ForegroundColor Green
}

$sharedBackup = Join-Path $BackupPath "profile_data.json"
if (Test-Path $sharedBackup) {
    Copy-Item (Join-Path $BackupPath "*.json") -Destination "packages\shared\" -Force
    Write-Host "  Shared catalogs restored." -ForegroundColor Green
}

Write-Host "Restore operation completed successfully." -ForegroundColor Green
exit 0
