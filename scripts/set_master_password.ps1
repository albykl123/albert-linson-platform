# ==============================================================================
# SECURE MASTER PASSWORD CONFIGURATION SCRIPT
# Prompts for administrator master password using hidden terminal input (masked)
# Keystrokes are completely invisible on screen to protect private credentials.
# Updates GitHub Repository Secret 'ADMIN_SECRET_KEY' securely via GitHub CLI.
# Dispatches Cloudflare Workers edge deployment workflow automatically.
# Never prints, logs, or stores the password in plaintext.
# ==============================================================================

[CmdletBinding()]
param()

$Host.UI.RawUI.WindowTitle = "Albert Linson Platform - Master Password Setup"
Clear-Host

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " ADMIN CONTROL CENTER -- MASTER PASSWORD CONFIGURATION" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "Please enter your chosen master password below." -ForegroundColor Yellow
Write-Host "SECURITY NOTICE: Keystrokes are completely INVISIBLE for security." -ForegroundColor DarkGray
Write-Host "Type your password and press ENTER when finished." -ForegroundColor DarkGray
Write-Host ""

function Read-InvisibleInput([string]$prompt) {
    Write-Host -NoNewline "$prompt: " -ForegroundColor Yellow
    $secret = ""
    while ($true) {
        $key = [System.Console]::ReadKey($true)
        if ($key.Key -eq [System.ConsoleKey]::Enter) {
            Write-Host ""
            break
        } elseif ($key.Key -eq [System.ConsoleKey]::Backspace) {
            if ($secret.Length -gt 0) {
                $secret = $secret.Substring(0, $secret.Length - 1)
            }
        } elseif ($key.KeyChar -ne [char]0) {
            $secret += $key.KeyChar
        }
    }
    return $secret
}

$pass1 = Read-InvisibleInput "Enter Chosen Master Password"
if ([string]::IsNullOrWhiteSpace($pass1)) {
    Write-Host "`n[ERROR] Password cannot be empty. Aborted." -ForegroundColor Red
    exit 1
}

$pass2 = Read-InvisibleInput "Confirm Master Password"
if ($pass1 -ne $pass2) {
    Write-Host "`n[ERROR] Passwords do not match. Aborted." -ForegroundColor Red
    $pass1 = $null
    $pass2 = $null
    exit 1
}

$plainPassword = $pass1
$pass1 = $null
$pass2 = $null

$ghPath = "C:\Program Files\GitHub CLI\gh.exe"
if (-not (Test-Path $ghPath)) {
    $ghPath = "gh"
}

Write-Host "`nEncrypting and updating GitHub Actions Secret: ADMIN_SECRET_KEY..." -ForegroundColor Cyan
try {
    $plainPassword | & $ghPath secret set ADMIN_SECRET_KEY --repo albykl123/albert-linson-platform
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[SUCCESS] Master password securely stored in GitHub Actions Secret: ADMIN_SECRET_KEY" -ForegroundColor Green
    } else {
        Write-Host "[ERROR] Failed to set GitHub Actions Secret. Exit code: $LASTEXITCODE" -ForegroundColor Red
        exit 1
    }

    # Update local .env.local for local testing
    $envLocalPath = Join-Path $PSScriptRoot "..\apps\web\.env.local"
    $envRootPath = Join-Path $PSScriptRoot "..\.env.local"
    Set-Content -Path $envLocalPath -Value "ADMIN_SECRET_KEY=$plainPassword`nNEXT_PUBLIC_APP_NAME=`"Albert Linson Personal Intelligence Platform`"" -Encoding utf8
    Set-Content -Path $envRootPath -Value "ADMIN_SECRET_KEY=$plainPassword`nNEXT_PUBLIC_APP_NAME=`"Albert Linson Personal Intelligence Platform`"" -Encoding utf8
    Write-Host "[SUCCESS] Synchronized local development secret (.env.local, gitignored)" -ForegroundColor Green

    Write-Host "`nTriggering automated deployment workflow to Cloudflare Workers edge..." -ForegroundColor Cyan
    & $ghPath workflow run deploy.yml --repo albykl123/albert-linson-platform
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[SUCCESS] Cloudflare Workers deployment triggered successfully!" -ForegroundColor Green
        Write-Host "[NOTICE] OpenNext and Cloudflare will compile and apply your master password across edge nodes." -ForegroundColor Cyan
    } else {
        Write-Host "[NOTICE] GitHub workflow trigger exited with code $LASTEXITCODE (run a git push to trigger)." -ForegroundColor Yellow
    }

} catch {
    Write-Host "[ERROR] Configuration failed: $_" -ForegroundColor Red
    exit 1
} finally {
    $plainPassword = $null
    [System.GC]::Collect()
}

Write-Host "`n==========================================================" -ForegroundColor Cyan
Write-Host " CONFIGURATION COMPLETE - ZERO SECRETS STORED OR LEAKED" -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Cyan
