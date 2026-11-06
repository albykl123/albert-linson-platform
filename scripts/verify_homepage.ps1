$c = (Invoke-WebRequest -Uri 'https://albert-linson-platform.albertkalampadan.workers.dev/' -UseBasicParsing).Content
if ($c -match '\$0/mo') {
    Write-Host "Verified: `$0/mo Zero-Cost Cloud Ops rendered on live homepage!" -ForegroundColor Green
}
if ($c -match '70%') {
    Write-Host "Warning: 70% found" -ForegroundColor Yellow
} else {
    Write-Host "Verified: Unsupported 70% metric removed from homepage!" -ForegroundColor Green
}
