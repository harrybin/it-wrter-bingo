$ErrorActionPreference = "Stop"

param(
  [switch]$Install,
  [int]$Port = 5173
)

if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
  throw "npm was not found. Install Node.js first: https://nodejs.org/"
}

if ($Install -or -not (Test-Path ".\node_modules")) {
  npm install
}

npm run dev -- --host --port $Port
