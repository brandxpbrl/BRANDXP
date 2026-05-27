param(
  [int[]]$Ports = @(8000, 5173),
  [switch]$IncludeOllama
)

$ErrorActionPreference = "Continue"

if ($IncludeOllama) {
  $Ports += 11434
}

Write-Host "Stopping Brand Experience OS services..." -ForegroundColor Cyan

foreach ($port in $Ports) {
  $connections = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue

  if (-not $connections) {
    Write-Host "  OK  No service listening on port $port" -ForegroundColor Green
    continue
  }

  foreach ($connection in $connections) {
    try {
      Stop-Process -Id $connection.OwningProcess -Force -ErrorAction Stop
      Write-Host "  OK  Stopped process $($connection.OwningProcess) on port $port" -ForegroundColor Green
    } catch {
      Write-Host "  !!  Could not stop process $($connection.OwningProcess) on port $port: $($_.Exception.Message)" -ForegroundColor Yellow
    }
  }
}

Write-Host ""
Write-Host "Done. Use START_BRAND_EXPERIENCE_OS.bat to launch again." -ForegroundColor Green
