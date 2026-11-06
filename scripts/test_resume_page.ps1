$url = 'https://albert-linson-platform.albertkalampadan.workers.dev/resume'
$r = Invoke-WebRequest -Uri $url -UseBasicParsing
Write-Host "Status: $($r.StatusCode)"
Write-Host "Length: $($r.Content.Length)"
if ($r.Content -match 'Albert Kalampadan Linson') {
    Write-Host "Verified: Master Profile Name displayed." -ForegroundColor Green
}
if ($r.Content -match 'Print / Save PDF') {
    Write-Host "Verified: Print / Save PDF export available." -ForegroundColor Green
}
if ($r.Content -match 'Professional Summary') {
    Write-Host "Verified: Professional Summary rendered." -ForegroundColor Green
}
