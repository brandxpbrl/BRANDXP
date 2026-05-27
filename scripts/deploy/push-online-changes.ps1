param(
  [string]$Message = "Update Brand Experience OS frontend design",
  [string]$Branch = ""
)

$ErrorActionPreference = "Stop"

$Root = Resolve-Path (Join-Path $PSScriptRoot "..\..")
Set-Location $Root

function Write-Step($Message) {
  Write-Host ""
  Write-Host "==> $Message" -ForegroundColor Cyan
}

function Write-Ok($Message) {
  Write-Host "  OK  $Message" -ForegroundColor Green
}

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
  throw "Git no esta instalado o no esta disponible en PATH."
}

if (-not (Test-Path ".git")) {
  throw "Esta carpeta no es un repo Git. Abri la carpeta correcta o ejecuta git init / agrega el remote antes de usar este script."
}

Write-Step "Verificando remote"
$remotes = git remote -v

if (-not $remotes) {
  throw "No hay remote configurado. Agregalo primero, por ejemplo: git remote add origin https://github.com/TU_USUARIO/TU_REPO.git"
}

$remotes

if (-not $Branch) {
  $Branch = (git branch --show-current).Trim()
}

if (-not $Branch) {
  throw "No pude detectar la rama actual. Pasa una rama con -Branch main"
}

Write-Step "Stageando archivos del deploy"
$files = @(
  "README.md",
  "render.yaml",
  ".env.example",
  "backend/main.py",
  "backend/services/client_activation_engine.py",
  "backend/tests/test_client_activation_engine.py",
  "frontend/src/App.jsx",
  "frontend/src/index.css",
  "frontend/src/components/TopBar.jsx",
  "frontend/src/components/WorkspaceModuleHeader.jsx",
  "frontend/src/components/ClientMemoryPanel.jsx",
  "frontend/src/components/ClientWorkbench.jsx"
)

foreach ($file in $files) {
  if (Test-Path $file) {
    git add -- $file
  }
}

Write-Step "Estado antes del commit"
git status --short

$staged = git diff --cached --name-only

if (-not $staged) {
  Write-Ok "No hay cambios stageados para commitear."
  exit 0
}

Write-Step "Creando commit"
git commit -m $Message

Write-Step "Subiendo a origin/$Branch"
git push origin $Branch

Write-Ok "Cambios subidos. Vercel/Render deberian redeployar automaticamente si estan conectados al repo."
