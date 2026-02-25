@echo off
setlocal
cd /d "%~dp0"

where node >nul 2>nul
if %errorlevel% neq 0 (
  echo Node.js is not installed or not in PATH.
  echo Install Node.js LTS and re-run this file.
  pause
  exit /b 1
)

where npm >nul 2>nul
if %errorlevel% neq 0 (
  echo npm is not installed or not in PATH.
  echo Install Node.js LTS and re-run this file.
  pause
  exit /b 1
)

if not exist "apps\api\.env" (
  copy "apps\api\.env.example" "apps\api\.env" >nul
)

if not exist "apps\web\.env.local" (
  copy "apps\web\.env.example" "apps\web\.env.local" >nul
)

if not exist "node_modules" (
  echo Installing dependencies...
  call npm install
  if %errorlevel% neq 0 (
    echo npm install failed.
    pause
    exit /b 1
  )
)

echo Starting API server...
start "PMModern API" cmd /k "cd /d %~dp0 && npm run dev:api"

timeout /t 4 /nobreak >nul

echo Starting Web server...
start "PMModern Web" cmd /k "cd /d %~dp0 && npm run dev:web"

timeout /t 5 /nobreak >nul
start "" "http://localhost:3000"

echo PMModern is launching in your browser.
exit /b 0
