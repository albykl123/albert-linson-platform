$baseUrl = "https://albert-linson-platform.albertkalampadan.workers.dev"
$routes = @("/", "/about", "/experience", "/education", "/skills", "/projects", "/research", "/resume", "/studio", "/admin")

Write-Host "=========================================================="
Write-Host "MASTER BUILD PRODUCTION EDGE AUDIT"
Write-Host "Base URL: $baseUrl"
Write-Host "=========================================================="

foreach ($r in $routes) {
    try {
        $resp = Invoke-WebRequest -Uri "$baseUrl$r" -UseBasicParsing -TimeoutSec 15
        Write-Host "[$($resp.StatusCode)] $r - Size: $($resp.RawContentLength) bytes"
    } catch {
        Write-Host "[FAIL] $r - Error: $_"
    }
}

Write-Host "`nTesting API Endpoints..."
try {
    $prof = Invoke-RestMethod -Uri "$baseUrl/api/profile" -TimeoutSec 10
    Write-Host "[200] /api/profile - Name: $($prof.personal.name), Research Papers: $($prof.research.Count), Projects: $($prof.projects.Count)"
} catch {
    Write-Host "[FAIL] /api/profile - Error: $_"
}

try {
    $atsBody = @{
        text = "Albert Linson is an IT professional with Python, Next.js, and Machine Learning experience. Education: Bachelor of Computer Applications. Experience: Innova Solutions US IT Recruiter."
    } | ConvertTo-Json
    $atsResp = Invoke-RestMethod -Uri "$baseUrl/api/ats/score" -Method Post -Body $atsBody -ContentType "application/json" -TimeoutSec 10
    Write-Host "[200] /api/ats/score - Overall Score: $($atsResp.overallScore), Status: $($atsResp.status)"
} catch {
    Write-Host "[FAIL] /api/ats/score - Error: $_"
}

try {
    $matchBody = @{
        resumeText = "Experienced in Python, FastAPI, Next.js, Cloudflare Workers, SQL, Docker."
        jdText = "Looking for a Full-Stack Engineer with Python, Next.js, SQL, and Cloudflare experience."
    } | ConvertTo-Json
    $matchResp = Invoke-RestMethod -Uri "$baseUrl/api/ats/match" -Method Post -Body $matchBody -ContentType "application/json" -TimeoutSec 10
    Write-Host "[200] /api/ats/match - Match: $($matchResp.matchPercentage)%, Matched: $($matchResp.matchedKeywords.Count)"
} catch {
    Write-Host "[FAIL] /api/ats/match - Error: $_"
}

try {
    # Test unauthorized access to DB endpoint
    $dbResp = Invoke-WebRequest -Uri "$baseUrl/api/db?action=list_applications" -Method Get -UseBasicParsing -TimeoutSec 10
    Write-Host "[$($dbResp.StatusCode)] /api/db (Unauthenticated) - Unexpectedly allowed!"
} catch {
    if ($_.Exception.Response) {
        Write-Host "[$([int]$_.Exception.Response.StatusCode)] /api/db (Unauthenticated) - Properly rejected unauthorized access."
    } else {
        Write-Host "[REJECTED] /api/db (Unauthenticated) - Error: $_"
    }
}
