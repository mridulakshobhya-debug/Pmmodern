@echo off
setlocal
cd /d "%~dp0"

where node >nul 2>nul
if %errorlevel% neq 0 (
  echo Node.js is not installed or not in PATH.
  echo Install Node.js LTS and rerun this file.
  pause
  exit /b 1
)

where npm >nul 2>nul
if %errorlevel% neq 0 (
  echo npm is not installed or not in PATH.
  echo Install Node.js LTS and rerun this file.
  pause
  exit /b 1
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

echo Building PMModern desktop EXE...
call npm run desktop:exe
if %errorlevel% neq 0 (
  echo Desktop build failed.
  echo.
  echo Run this in PowerShell to get full diagnostics:
  echo npm run desktop:runtime -w @pmmodern/desktop
  echo.
  pause
  exit /b 1
)

echo Build complete. Opening output folder...
if exist "desktop\\release" (
  start "" "desktop\\release"
)
exit /b 0
