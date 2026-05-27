param(
  [string]$HealthUrl = "http://127.0.0.1:8000/health",
  [switch]$SkipHealth
)

$ErrorActionPreference = "Stop"

$BackendArgs = @{
  HealthUrl = $HealthUrl
}

if ($SkipHealth) {
  $BackendArgs.SkipHealth = $true
}

& (Join-Path $PSScriptRoot "check-backend.ps1") @BackendArgs
& (Join-Path $PSScriptRoot "check-frontend.ps1")

Write-Host "All checks completed successfully." -ForegroundColor Green
