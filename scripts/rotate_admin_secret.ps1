# Cryptographically secure rotation script
$rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
$bytes = New-Object byte[] 32
$rng.GetBytes($bytes)
$secret = [Convert]::ToBase64String($bytes).Replace('+', '-').Replace('/', '_').TrimEnd('=')

# Set secret in GitHub Actions repository without printing
$secret | & "C:\Program Files\GitHub CLI\gh.exe" secret set ADMIN_SECRET_KEY --repo albykl123/albert-linson-platform

# Store securely in ignored local temporary file for local verification
Set-Content -Path ".secret_rotation_test.tmp" -Value $secret -NoNewline

Write-Host "Cryptographic rotation complete. Secret securely dispatched to GitHub Actions." -ForegroundColor Green
