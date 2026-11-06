<#
.SYNOPSIS
    Performs runtime health check against local or production platform endpoints.
#>

[CmdletBinding()]
param(
    [string]$BaseUrl = "http://127.0.0.1:3000"
)

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " ALBERT LINSON PLATFORM — SYSTEM HEALTH CHECK" -ForegroundColor Cyan
Write-Host " Target URL: $BaseUrl" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

$endpoints = @(
    "/",
    "/about",
    "/experience",
    "/projects",
    "/research",
    "/skills",
    "/freestack",
    "/studio",
    "/resume",
    "/admin",
    "/api/profile",
    "/api/freestack"
)

$allPassed = $true

foreach ($ep in $endpoints) {
    $target = "$BaseUrl$ep"
    try {
        $res = Invoke-WebRequest -Uri $target -Method GET -TimeoutSec 5 -UseBasicParsing -ErrorAction Stop
        if ($res.StatusCode -eq 200) {
            Write-Host "  [OK 200] $ep" -ForegroundColor Green
        } else {
            Write-Host "  [WARN $($res.StatusCode)] $ep" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "  [FAIL] $ep - $($_.Exception.Message)" -ForegroundColor Red
        $allPassed = $false
    }
}

if ($allPassed) {
    Write-Host "`nAll platform endpoints responded successfully (Status 200 OK)." -ForegroundColor Green
    exit 0
} else {
    Write-Host "`nSome endpoints failed to respond. Ensure local or production server is active." -ForegroundColor Yellow
    exit 1
}
