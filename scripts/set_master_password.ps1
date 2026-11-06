# ==============================================================================
# SECURE MASTER PASSWORD CONFIGURATION SCRIPT
# Prompts for administrator master password using hidden terminal input (masked)
# Updates GitHub Repository Secret 'ADMIN_SECRET_KEY' securely via GitHub CLI.
# Never prints, logs, or stores the password in plaintext.
# ==============================================================================

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " ADMIN CONTROL CENTER -- MASTER PASSWORD CONFIGURATION" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "Please enter your chosen master password." -ForegroundColor Yellow
Write-Host "Input will be masked with asterisks and hidden from terminal history." -ForegroundColor Gray
Write-Host ""

$secPassword = Read-Host -AsSecureString "Enter Chosen Master Password"
$bstr = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($secPassword)
$plainPassword = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($bstr)
[System.Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr)

if ([string]::IsNullOrWhiteSpace($plainPassword)) {
    Write-Host "`n[ERROR] Password cannot be empty. Configuration aborted." -ForegroundColor Red
    exit 1
}

$ghPath = "C:\Program Files\GitHub CLI\gh.exe"
if (-not (Test-Path $ghPath)) {
    $ghPath = "gh"
}

Write-Host "`nEncrypting and dispatching master secret to GitHub Actions repository..." -ForegroundColor Cyan
try {
    $plainPassword | & $ghPath secret set ADMIN_SECRET_KEY --repo albykl123/albert-linson-platform
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[SUCCESS] Master password securely stored in GitHub Actions Secret: ADMIN_SECRET_KEY" -ForegroundColor Green
        Write-Host "[NOTICE] Zero plaintext values were logged, printed, or saved to disk." -ForegroundColor Green
    } else {
        Write-Host "[ERROR] Failed to set GitHub Actions Secret. Exit code: $LASTEXITCODE" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "[ERROR] Secret dispatch failed: $_" -ForegroundColor Red
    exit 1
} finally {
    $plainPassword = $null
    [System.GC]::Collect()
}

Write-Host "`nTo deploy to Cloudflare Workers edge immediately, commit and push to main or run a manual dispatch." -ForegroundColor Cyan
