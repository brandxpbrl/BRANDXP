param(
  [string]$HealthUrl = "http://127.0.0.1:8000/health",
  [switch]$SkipHealth
)

$ErrorActionPreference = "Stop"

$Root = Resolve-Path (Join-Path $PSScriptRoot "..\..")
$BackendDir = Join-Path $Root "backend"
$BackendPython = Join-Path $BackendDir ".venv\Scripts\python.exe"

if (-not (Test-Path $BackendPython)) {
  throw "Backend Python was not found at $BackendPython"
}

Write-Host "==> Running backend unit tests" -ForegroundColor Cyan
& $BackendPython -m unittest discover -s (Join-Path $BackendDir "tests")

Write-Host "==> Verifying backend import" -ForegroundColor Cyan
Push-Location $BackendDir
try {
  & $BackendPython -c "from main import app; print(app.title)"
} finally {
  Pop-Location
}

if (-not $SkipHealth) {
  Write-Host "==> Checking backend health at $HealthUrl" -ForegroundColor Cyan
  $response = Invoke-WebRequest -UseBasicParsing -Uri $HealthUrl -TimeoutSec 5
  if ($response.StatusCode -ne 200) {
    throw "Backend health returned status $($response.StatusCode)"
  }
  Write-Host "Backend health OK ($($response.StatusCode))" -ForegroundColor Green
}
