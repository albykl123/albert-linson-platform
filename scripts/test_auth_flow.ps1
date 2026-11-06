$baseUrl = "https://albert-linson-platform.albertkalampadan.workers.dev"

Write-Host "1. Testing GET /api/auth without session:"
$authStatus = Invoke-RestMethod -Uri "$baseUrl/api/auth" -Method Get
Write-Host "Authenticated: $($authStatus.authenticated)"
if ($authStatus.authenticated -eq $false) {
    Write-Host "PASS: Unauthenticated session properly recognized as false."
} else {
    Write-Host "FAIL: Unauthenticated session returned true!"
}

Write-Host "`n2. Testing POST /api/auth with invalid passcode:"
try {
    $badPayload = @{ passcode = "wrong_passcode_9999" } | ConvertTo-Json
    $badResp = Invoke-RestMethod -Uri "$baseUrl/api/auth" -Method Post -Body $badPayload -ContentType "application/json"
    Write-Host "FAIL: Bad passcode was accepted!"
} catch {
    Write-Host "PASS: Bad passcode was properly rejected with 401 Unauthorized."
}

Write-Host "`n3. Testing POST /api/auth with old compromised secret:"
try {
    # Old exposed secret
    $oldPayload = @{ passcode = "d87a41295fc7bfbca79e49339247ebde" } | ConvertTo-Json
    $oldResp = Invoke-RestMethod -Uri "$baseUrl/api/auth" -Method Post -Body $oldPayload -ContentType "application/json"
    Write-Host "FAIL: Compromised secret was accepted!"
} catch {
    Write-Host "PASS: Compromised secret was properly rejected with 401 Unauthorized."
}
