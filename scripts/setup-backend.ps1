# Rafla rembg backend setup (Windows)
$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
$backend = Join-Path $root "backend"
Set-Location $backend

if (-not (Test-Path ".venv\Scripts\python.exe")) {
  Write-Host "Creating venv..."
  python -m venv .venv
}

Write-Host "Installing dependencies (rembg, onnxruntime - may take a few minutes)..."
& .\.venv\Scripts\pip install -r requirements.txt

Write-Host "Health check..."
& .\.venv\Scripts\python -c "from rembg import remove; print('rembg OK')"

Write-Host ""
Write-Host "Done. Start with: npm run dev:backend"
