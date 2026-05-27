@echo off
setlocal
title Stop Brand Experience OS

cd /d "%~dp0"
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\launchers\stop-brand-experience.ps1"

echo.
pause
