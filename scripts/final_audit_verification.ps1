$baseUrl = "https://albert-linson-platform.albertkalampadan.workers.dev"

$routes = @(
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
    "/education",
    "/api/profile",
    "/api/freestack",
    "/api/db",
    "/api/auth"
)

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " ALBERT LINSON PLATFORM -- FINAL AUDIT VERIFICATION" -ForegroundColor Cyan
Write-Host " Target URL: $baseUrl" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

$allPass = $true
foreach ($r in $routes) {
    $sw = [System.Diagnostics.Stopwatch]::StartNew()
    try {
        $res = Invoke-WebRequest -Uri "$baseUrl$r" -UseBasicParsing -TimeoutSec 10
        $sw.Stop()
        Write-Host "  [PASS 200] $r ($($sw.ElapsedMilliseconds)ms, $($res.Content.Length) bytes)" -ForegroundColor Green
    } catch {
        $sw.Stop()
        Write-Host "  [FAIL] $r - $($_.Exception.Message)" -ForegroundColor Red
        $allPass = $false
    }
}

if ($allPass) {
    Write-Host "`nAll platform routes passed with HTTP 200 OK." -ForegroundColor Green
} else {
    Write-Host "`nSome routes failed." -ForegroundColor Red
}
