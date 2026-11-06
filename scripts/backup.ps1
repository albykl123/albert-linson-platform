<#
.SYNOPSIS
    Creates timestamped backups of local SQLite database and custom configurations.
#>

[CmdletBinding()]
param(
    [string]$BackupDir = "backups"
)

$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$dest = Join-Path $BackupDir "backup_$timestamp"

Write-Host "Creating platform backup at: $dest" -ForegroundColor Cyan
New-Item -ItemType Directory -Force -Path $dest | Out-Null

# Backup SQLite database
$dbFile = "apps\backend\data\atsforge.db"
if (Test-Path $dbFile) {
    Copy-Item $dbFile -Destination (Join-Path $dest "atsforge.db")
    Write-Host "  Database backed up: atsforge.db" -ForegroundColor Green
}

# Backup shared data
Copy-Item "packages\shared\*" -Destination $dest -Recurse
Write-Host "  Shared data backed up." -ForegroundColor Green

Write-Host "Backup completed successfully: $dest" -ForegroundColor Green
exit 0
