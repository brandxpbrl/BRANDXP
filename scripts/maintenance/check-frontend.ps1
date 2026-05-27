$ErrorActionPreference = "Stop"

$Root = Resolve-Path (Join-Path $PSScriptRoot "..\..")
$FrontendDir = Join-Path $Root "frontend"

Write-Host "==> Running frontend lint" -ForegroundColor Cyan
Push-Location $FrontendDir
try {
  npm run lint

  Write-Host "==> Running frontend build" -ForegroundColor Cyan
  npm run build
} finally {
  Pop-Location
}
