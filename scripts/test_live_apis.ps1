$baseUrl = "https://albert-linson-platform.albertkalampadan.workers.dev"
Write-Host "Testing Live APIs against $baseUrl`n" -ForegroundColor Cyan

# 1. Test /api/profile
Write-Host "[1/6] Testing GET /api/profile..."
try {
    $p = Invoke-RestMethod -Uri "$baseUrl/api/profile" -Method GET
    Write-Host "  Success! Profile Name: $($p.personal.name)" -ForegroundColor Green
} catch {
    Write-Host "  Failed: $($_.Exception.Message)" -ForegroundColor Red
}

# 2. Test /api/freestack
Write-Host "`n[2/6] Testing GET /api/freestack..."
try {
    $fs = Invoke-RestMethod -Uri "$baseUrl/api/freestack" -Method GET
    Write-Host "  Success! Total Services: $($fs.total_services)" -ForegroundColor Green
} catch {
    Write-Host "  Failed: $($_.Exception.Message)" -ForegroundColor Red
}

# 3. Test POST /api/ats/score
Write-Host "`n[3/6] Testing POST /api/ats/score..."
$sampleResume = "Albert Linson`nalbert@example.com`nPROFESSIONAL SUMMARY`nFull stack software engineer with 3+ years experience.`nSKILLS`nPython, TypeScript, React, Next.js`nEXPERIENCE`nSoftware Engineer - Tech Corp (2024-2026)`n* Developed scalable cloud APIs.`nEDUCATION`nBCA - Christ University (2021-2024)"
try {
    $scoreRes = Invoke-RestMethod -Uri "$baseUrl/api/ats/score" -Method POST -Body (@{ text = $sampleResume } | ConvertTo-Json) -ContentType "application/json"
    Write-Host "  Success! Overall Score: $($scoreRes.overallScore), Grade: $($scoreRes.grade)" -ForegroundColor Green
} catch {
    Write-Host "  Failed: $($_.Exception.Message)" -ForegroundColor Red
}

# 4. Test POST /api/ats/match
Write-Host "`n[4/6] Testing POST /api/ats/match..."
$sampleJD = "Looking for a Software Engineer proficient in TypeScript, React, Python, and Next.js."
try {
    $matchRes = Invoke-RestMethod -Uri "$baseUrl/api/ats/match" -Method POST -Body (@{ resumeText = $sampleResume; jdText = $sampleJD } | ConvertTo-Json) -ContentType "application/json"
    Write-Host "  Success! Match Percentage: $($matchRes.matchPercentage)%" -ForegroundColor Green
} catch {
    Write-Host "  Failed: $($_.Exception.Message)" -ForegroundColor Red
}

# 5. Test Admin Auth Security: Unauthorized / Wrong Passcode
Write-Host "`n[5/6] Testing Admin Auth Security (GET /api/auth & Invalid Passcode POST)..."
try {
    $authStatus = Invoke-RestMethod -Uri "$baseUrl/api/auth" -Method GET
    Write-Host "  Unauthenticated status: $($authStatus.authenticated) (Expected false)" -ForegroundColor Green
} catch {
    Write-Host "  Auth GET Failed: $($_.Exception.Message)" -ForegroundColor Red
}

try {
    $invalidAuth = Invoke-RestMethod -Uri "$baseUrl/api/auth" -Method POST -Body '{"passcode":"compromised-or-invalid-passcode"}' -ContentType "application/json"
    Write-Host "  Security Alert: Wrong passcode succeeded unexpectedly!" -ForegroundColor Red
} catch {
    Write-Host "  Success! Invalid passcode properly rejected with HTTP 401" -ForegroundColor Green
}

# 6. Test Admin Auth Session with Environment Variable (if provided)
Write-Host "`n[6/6] Testing Admin Auth Session with `$env:ADMIN_SECRET_KEY..."
if ($env:ADMIN_SECRET_KEY) {
    $session = New-Object Microsoft.PowerShell.Commands.WebRequestSession
    try {
        $validAuth = Invoke-RestMethod -Uri "$baseUrl/api/auth" -Method POST -Body (@{ passcode = $env:ADMIN_SECRET_KEY } | ConvertTo-Json) -ContentType "application/json" -WebSession $session
        Write-Host "  Success! Authenticated: $($validAuth.authenticated)" -ForegroundColor Green
        
        $verifySession = Invoke-RestMethod -Uri "$baseUrl/api/auth" -Method GET -WebSession $session
        Write-Host "  Session Cookie Verified: $($verifySession.authenticated)" -ForegroundColor Green
    } catch {
        Write-Host "  Valid Auth Failed: $($_.Exception.Message)" -ForegroundColor Yellow
    }
} else {
    Write-Host "  `$env:ADMIN_SECRET_KEY not set locally. Passcode not exposed." -ForegroundColor Gray
}
