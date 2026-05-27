param(
  [int]$BackendPort = 8000,
  [int]$FrontendPort = 5173,
  [int]$OllamaPort = 11434,
  [switch]$SkipBrowser
)

$ErrorActionPreference = "Stop"

$Root = Resolve-Path (Join-Path $PSScriptRoot "..\..")
$BackendDir = Join-Path $Root "backend"
$FrontendDir = Join-Path $Root "frontend"
$RuntimeDir = Join-Path $Root "runtime"
$LogDir = Join-Path $RuntimeDir "logs"
$BackendVenv = Join-Path $BackendDir ".venv"
$BackendPython = Join-Path $BackendVenv "Scripts\python.exe"
$NpmCommand = "npm.cmd"

New-Item -ItemType Directory -Force -Path $RuntimeDir, $LogDir | Out-Null

function Write-Step($Message) {
  Write-Host ""
  Write-Host "==> $Message" -ForegroundColor Cyan
}

function Write-Ok($Message) {
  Write-Host "  OK  $Message" -ForegroundColor Green
}

function Write-Warn($Message) {
  Write-Host "  !!  $Message" -ForegroundColor Yellow
}

function Test-Port($Port) {
  $connection = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue
  return [bool]$connection
}

function Wait-Http($Url, $Name, $Seconds = 30) {
  $deadline = (Get-Date).AddSeconds($Seconds)

  while ((Get-Date) -lt $deadline) {
    try {
      $response = Invoke-WebRequest -UseBasicParsing -Uri $Url -TimeoutSec 3
      if ($response.StatusCode -ge 200 -and $response.StatusCode -lt 500) {
        Write-Ok "$Name ready at $Url"
        return $true
      }
    } catch {
      Start-Sleep -Milliseconds 800
    }
  }

  Write-Warn "$Name did not respond at $Url within ${Seconds}s"
  return $false
}

function Find-Python {
  $candidates = @("py.exe", "python.exe", "python3.exe")

  foreach ($candidate in $candidates) {
    $command = Get-Command $candidate -ErrorAction SilentlyContinue
    if ($command) {
      return $candidate
    }
  }

  return $null
}

function Ensure-BackendVenv {
  Write-Step "Checking backend Python environment"

  if (Test-Path $BackendPython) {
    Write-Ok "Backend virtual environment found"
  } else {
    $python = Find-Python

    if (-not $python) {
      throw "Python was not found. Install Python 3.11+ or create backend\.venv manually."
    }

    Write-Warn "backend\.venv not found. Creating it with $python"
    Push-Location $BackendDir
    try {
      & $python -m venv .venv
    } finally {
      Pop-Location
    }
  }

  Push-Location $BackendDir
  try {
    $check = & $BackendPython -c "import fastapi, uvicorn; print('ok')" 2>$null

    if ($LASTEXITCODE -ne 0 -or $check -notcontains "ok") {
      Write-Warn "Installing backend dependencies"
      & $BackendPython -m pip install -r requirements.txt
    } else {
      Write-Ok "Backend dependencies ready"
    }
  } finally {
    Pop-Location
  }
}

function Ensure-FrontendDeps {
  Write-Step "Checking frontend dependencies"

  if (-not (Get-Command $NpmCommand -ErrorAction SilentlyContinue)) {
    throw "npm.cmd was not found. Install Node.js before launching the frontend."
  }

  $nodeModules = Join-Path $FrontendDir "node_modules"

  if (Test-Path $nodeModules) {
    Write-Ok "Frontend node_modules found"
    return
  }

  Write-Warn "node_modules not found. Running npm install"
  Push-Location $FrontendDir
  try {
    & $NpmCommand install
  } finally {
    Pop-Location
  }
}

function Start-OllamaIfAvailable {
  Write-Step "Checking Ollama fallback"

  if (Test-Port $OllamaPort) {
    Write-Ok "Ollama is already listening on port $OllamaPort"
    return
  }

  $ollama = Get-Command "ollama.exe" -ErrorAction SilentlyContinue

  if (-not $ollama) {
    Write-Warn "Ollama command not found. OpenAI will be primary; local fallback is unavailable."
    return
  }

  $stdout = Join-Path $LogDir "ollama.out.log"
  $stderr = Join-Path $LogDir "ollama.err.log"
  Start-Process -FilePath $ollama.Source -ArgumentList @("serve") -WorkingDirectory $Root -RedirectStandardOutput $stdout -RedirectStandardError $stderr -WindowStyle Minimized | Out-Null
  Start-Sleep -Seconds 2

  if (Test-Port $OllamaPort) {
    Write-Ok "Ollama started on port $OllamaPort"
  } else {
    Write-Warn "Ollama was requested but did not start. See runtime\logs\ollama.err.log"
  }
}

function Start-Backend {
  Write-Step "Starting Brand Experience API"

  if (Test-Port $BackendPort) {
    Write-Ok "Backend already listening on port $BackendPort"
    return
  }

  $stdout = Join-Path $LogDir "backend.out.log"
  $stderr = Join-Path $LogDir "backend.err.log"
  Start-Process -FilePath $BackendPython -ArgumentList @("-m", "uvicorn", "main:app", "--host", "127.0.0.1", "--port", "$BackendPort") -WorkingDirectory $BackendDir -RedirectStandardOutput $stdout -RedirectStandardError $stderr -WindowStyle Minimized | Out-Null
  Wait-Http "http://127.0.0.1:$BackendPort/health" "Backend" 35 | Out-Null
}

function Start-Frontend {
  Write-Step "Starting Brand Experience dashboard"

  if (Test-Port $FrontendPort) {
    Write-Ok "Frontend already listening on port $FrontendPort"
    return
  }

  $stdout = Join-Path $LogDir "frontend.out.log"
  $stderr = Join-Path $LogDir "frontend.err.log"
  Start-Process -FilePath $NpmCommand -ArgumentList @("run", "dev", "--", "--host", "127.0.0.1", "--port", "$FrontendPort") -WorkingDirectory $FrontendDir -RedirectStandardOutput $stdout -RedirectStandardError $stderr -WindowStyle Minimized | Out-Null
  Wait-Http "http://127.0.0.1:$FrontendPort" "Frontend" 35 | Out-Null
}

function Show-Summary {
  Write-Host ""
  Write-Host "Brand Experience OS is ready" -ForegroundColor Green
  Write-Host "Frontend: http://127.0.0.1:$FrontendPort"
  Write-Host "Backend:  http://127.0.0.1:$BackendPort/health"
  Write-Host "Logs:     $LogDir"
  Write-Host ""

  if (-not $SkipBrowser) {
    Start-Process "http://127.0.0.1:$FrontendPort"
  }
}

Write-Host "Brand Experience OS Professional Launcher" -ForegroundColor Magenta
Write-Host "Root: $Root"

Ensure-BackendVenv
Ensure-FrontendDeps
Start-OllamaIfAvailable
Start-Backend
Start-Frontend
Show-Summary
