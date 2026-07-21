# ===== EuroKredit — backend en natif (sans Docker) =====
# Crée un venv (hors du disque E: plein), installe les dépendances compatibles
# Python 3.13, puis lance l'API sur http://localhost:8001.
#
#   powershell -ExecutionPolicy Bypass -File scripts\dev-backend.ps1
#   ...\dev-backend.ps1 -VenvPath D:\ek-venv   # pour choisir un autre disque
#   ...\dev-backend.ps1 -SkipInstall           # relancer sans réinstaller

param(
    [string]$VenvPath = "$env:SystemDrive\eurokredit-venv",
    [switch]$SkipInstall
)

$ErrorActionPreference = "Stop"
$backend = Join-Path $PSScriptRoot "..\backend" | Resolve-Path

Write-Host "== Backend dir : $backend"
Write-Host "== Venv        : $VenvPath"

# 1. Python 3.13 (les deps n'ont pas de wheels pour 3.14)
$py = "py"
$pyArgs = @("-3.13")
try { & $py -3.13 --version | Out-Null } catch {
    Write-Warning "Python 3.13 introuvable via 'py -3.13'. Repli sur 'python'."
    $py = "python"; $pyArgs = @()
}

# 2. Venv (hors E:)
if (-not (Test-Path $VenvPath)) {
    Write-Host "== Création du venv..."
    & $py @pyArgs -m venv $VenvPath
}
$venvPy = Join-Path $VenvPath "Scripts\python.exe"

# 3. Dépendances (cache pip sur le même disque que le venv)
if (-not $SkipInstall) {
    $env:PIP_CACHE_DIR = Join-Path (Split-Path $VenvPath) "eurokredit-pip-cache"
    Write-Host "== Installation des dépendances (requirements-native.txt)..."
    & $venvPy -m pip install --upgrade pip
    & $venvPy -m pip install -r (Join-Path $backend "requirements-native.txt")
}

# 4. Lancement (server.py lit backend\.env)
Write-Host "== Démarrage de l'API sur http://localhost:8001 ..." -ForegroundColor Green
Push-Location $backend
try { & $venvPy server.py } finally { Pop-Location }
