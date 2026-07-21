# ===== EuroKredit — frontend en natif (sans Docker) =====
# Installe les dépendances et lance le dev server sur http://localhost:3000.
# Comme E: est plein, node_modules est relocalisé sur un autre disque via une
# jonction (junction) — transparent pour npm, aucun droit admin requis.
#
#   powershell -ExecutionPolicy Bypass -File scripts\dev-frontend.ps1
#   ...\dev-frontend.ps1 -NodeModulesPath D:\ek-node_modules  # autre disque
#   ...\dev-frontend.ps1 -NoRelocate                          # garder node_modules dans le projet (si E: a de la place)
#   ...\dev-frontend.ps1 -SkipInstall                         # relancer sans réinstaller

param(
    [string]$NodeModulesPath = "$env:SystemDrive\eurokredit-node_modules",
    [switch]$NoRelocate,
    [switch]$SkipInstall
)

$ErrorActionPreference = "Stop"
$frontend = Join-Path $PSScriptRoot "..\frontend" | Resolve-Path
$localNM = Join-Path $frontend "node_modules"

Write-Host "== Frontend dir : $frontend"

# 1. Relocaliser node_modules hors de E: (jonction) si absent
if (-not $NoRelocate -and -not (Test-Path $localNM)) {
    if (-not (Test-Path $NodeModulesPath)) { New-Item -ItemType Directory -Path $NodeModulesPath | Out-Null }
    Write-Host "== Jonction node_modules -> $NodeModulesPath"
    New-Item -ItemType Junction -Path $localNM -Target $NodeModulesPath | Out-Null
}

# 2. Cache npm hors de E:
$env:npm_config_cache = Join-Path (Split-Path $NodeModulesPath) "eurokredit-npm-cache"

# 3. Install
if (-not $SkipInstall) {
    Write-Host "== npm install (React 19, peut prendre quelques minutes)..."
    Push-Location $frontend
    try { npm install --legacy-peer-deps } finally { Pop-Location }
}

# 4. Lancement (lit frontend\.env -> REACT_APP_BACKEND_URL=http://localhost:8001)
Write-Host "== Démarrage du frontend sur http://localhost:3000 ..." -ForegroundColor Green
Push-Location $frontend
try { npm start } finally { Pop-Location }
