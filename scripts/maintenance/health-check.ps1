param(
  [int]$BackendPort = 8000,
  [int]$FrontendPort = 5173
)

$ErrorActionPreference = "Continue"
$Root = Resolve-Path (Join-Path $PSScriptRoot "..\..")

function Test-Http($Url) {
  try {
    $response = Invoke-WebRequest -UseBasicParsing -Uri $Url -TimeoutSec 5
    return "$($response.StatusCode) $Url"
  } catch {
    return "DOWN $Url - $($_.Exception.Message)"
  }
}

Write-Host "Brand Experience OS Health Check" -ForegroundColor Cyan
Write-Host "Root: $Root"
Write-Host ""
Write-Host (Test-Http "http://127.0.0.1:$BackendPort/health")
Write-Host (Test-Http "http://127.0.0.1:$FrontendPort")
Write-Host ""

$paths = @(
  "backend\main.py",
  "backend\ai_provider.py",
  "backend\cognitive_orchestrator.py",
  "backend\client_manager.py",
  "frontend\package.json",
  "frontend\src\App.jsx",
  "BRAND_EXPERIENCE\03_CLIENT_SYSTEM\CLIENTES_ACTIVOS"
)

foreach ($path in $paths) {
  $fullPath = Join-Path $Root $path
  if (Test-Path $fullPath) {
    Write-Host "OK  $path" -ForegroundColor Green
  } else {
    Write-Host "MISS $path" -ForegroundColor Yellow
  }
}
