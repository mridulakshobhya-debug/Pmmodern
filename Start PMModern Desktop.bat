@echo off
setlocal
cd /d "%~dp0"
set "targetExe=E:\Pmmodern\desktop\release\PMModern-1771945928629-win32-x64\PMModern.exe"
if not exist "%targetExe%" (
  echo Target EXE not found:
  echo %targetExe%
  pause
  exit /b 1
)
taskkill /IM PMModern.exe /F >nul 2>nul
start "" "%targetExe%"
