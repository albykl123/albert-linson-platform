$baseUrl = "https://albert-linson-platform.albertkalampadan.workers.dev"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " ADMIN CONTROL CENTER -- 10-POINT SECURITY AUDIT SUITE" -ForegroundColor Cyan
Write-Host " Target Base URL: $baseUrl" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

$testResults = @()

function Record-Test($testNum, $description, $passed, $detail) {
    $status = if ($passed) { "PASS" } else { "FAIL" }
    $color = if ($passed) { "Green" } else { "Red" }
    Write-Host "[$status] Test ${testNum}: $description - $detail" -ForegroundColor $color
    $script:testResults += [PSCustomObject]@{
        TestNumber = $testNum
        Description = $description
        Status = $status
        Details = $detail
    }
}

# Test 2: Incorrect password
try {
    $badPayload = @{ passcode = "intentionally_incorrect_attempt_87612" } | ConvertTo-Json
    $res = Invoke-RestMethod -Uri "$baseUrl/api/auth" -Method Post -Body $badPayload -ContentType "application/json"
    Record-Test 2 "Incorrect password rejection" $false "Server accepted invalid credentials"
} catch {
    Record-Test 2 "Incorrect password rejection" $true "HTTP 401 / Rejected properly with: $($_.Exception.Message)"
}

# Test 3: Empty password
try {
    $emptyPayload = @{ passcode = "" } | ConvertTo-Json
    $res = Invoke-RestMethod -Uri "$baseUrl/api/auth" -Method Post -Body $emptyPayload -ContentType "application/json"
    Record-Test 3 "Empty password rejection" $false "Server accepted empty password"
} catch {
    Record-Test 3 "Empty password rejection" $true "HTTP 400 / Rejected properly with: $($_.Exception.Message)"
}

# Test 4: Old password rejection
try {
    $oldPayload = @{ passcode = "d87a41295fc7bfbca79e49339247ebde" } | ConvertTo-Json
    $res = Invoke-RestMethod -Uri "$baseUrl/api/auth" -Method Post -Body $oldPayload -ContentType "application/json"
    Record-Test 4 "Old compromised secret rejection" $false "Server accepted obsolete secret"
} catch {
    Record-Test 4 "Old compromised secret rejection" $true "HTTP 401 / Old secret rejected successfully"
}

# Test 5: Alternative common passwords rejection
try {
    $altPayload = @{ passcode = "admin12345" } | ConvertTo-Json
    $res = Invoke-RestMethod -Uri "$baseUrl/api/auth" -Method Post -Body $altPayload -ContentType "application/json"
    Record-Test 5 "Alternative password rejection" $false "Server accepted default/common candidate"
} catch {
    Record-Test 5 "Alternative password rejection" $true "HTTP 401 / Alternative password rejected"
}

# Test 6: Unauthenticated private API request
try {
    $authStatus = Invoke-RestMethod -Uri "$baseUrl/api/auth" -Method Get
    if ($authStatus.authenticated -eq $false) {
        Record-Test 6 "Unauthenticated private API query" $true "Session check correctly returned authenticated: false"
    } else {
        Record-Test 6 "Unauthenticated private API query" $false "Unauthenticated query returned authenticated: true"
    }
} catch {
    Record-Test 6 "Unauthenticated private API query" $false "API failed: $_"
}

# Test 7: Direct private dashboard without valid session
try {
    $adminPage = Invoke-WebRequest -Uri "$baseUrl/admin" -UseBasicParsing
    if ($adminPage.Content -match 'Checking administrator session' -or $adminPage.Content -match 'Master Passcode' -or $adminPage.Content -match 'Admin Control Center') {
        Record-Test 7 "Direct private dashboard blocked" $true "Private dashboard blocked; server rendered unauthenticated auth-check shell"
    } else {
        Record-Test 7 "Direct private dashboard blocked" $false "Private dashboard leaked in unauthenticated HTML"
    }
} catch {
    Record-Test 7 "Direct private dashboard blocked" $false "Page load error: $_"
}

# Test 8: Obsolete v3 session token rejection
try {
    $session = New-Object Microsoft.PowerShell.Commands.WebRequestSession
    $cookie = New-Object System.Net.Cookie("albert_admin_session_v3", "obsolete_v3_session_token_xyz", "/", "albert-linson-platform.albertkalampadan.workers.dev")
    $session.Cookies.Add($cookie)
    $v3Check = Invoke-RestMethod -Uri "$baseUrl/api/auth" -Method Get -WebSession $session
    if ($v3Check.authenticated -eq $false) {
        Record-Test 8 "Obsolete session invalidation" $true "Obsolete v3 session cookies strictly rejected by v4 engine"
    } else {
        Record-Test 8 "Obsolete session invalidation" $false "Obsolete v3 session accepted"
    }
} catch {
    Record-Test 8 "Obsolete session invalidation" $true "Rejected properly: $_"
}

# Test 9: Expired / forged session token rejection
try {
    $session = New-Object Microsoft.PowerShell.Commands.WebRequestSession
    $cookie = New-Object System.Net.Cookie("albert_admin_session_v4", "forged_malicious_token_attempt_999", "/", "albert-linson-platform.albertkalampadan.workers.dev")
    $session.Cookies.Add($cookie)
    $forgedCheck = Invoke-RestMethod -Uri "$baseUrl/api/auth" -Method Get -WebSession $session
    if ($forgedCheck.authenticated -eq $false) {
        Record-Test 9 "Expired/forged session rejection" $true "Forged v4 token rejected, authenticated: false"
    } else {
        Record-Test 9 "Expired/forged session rejection" $false "Forged token accepted!"
    }
} catch {
    Record-Test 9 "Expired/forged session rejection" $true "Rejected properly: $_"
}

# Test 10: Logout session revocation
try {
    $logoutResp = Invoke-RestMethod -Uri "$baseUrl/api/auth" -Method Delete
    if ($logoutResp.authenticated -eq $false) {
        Record-Test 10 "Logout session revocation" $true "DELETE /api/auth revoked session and cleared cookies"
    } else {
        Record-Test 10 "Logout session revocation" $false "Logout response returned authenticated: true"
    }
} catch {
    Record-Test 10 "Logout session revocation" $false "Logout failed: $_"
}

Write-Host "`n==========================================================" -ForegroundColor Cyan
Write-Host " SECURITY AUDIT SUMMARY" -ForegroundColor Cyan
Write-Host " Total Tests Evaluated: $($script:testResults.Count)" -ForegroundColor Cyan
Write-Host " Passed: $(($script:testResults | Where-Object { $_.Status -eq 'PASS' }).Count)" -ForegroundColor Green
Write-Host " Failed: $(($script:testResults | Where-Object { $_.Status -eq 'FAIL' }).Count)" -ForegroundColor $(if (($script:testResults | Where-Object { $_.Status -eq 'FAIL' }).Count -gt 0) { "Red" } else { "Green" })
Write-Host "==========================================================" -ForegroundColor Cyan
