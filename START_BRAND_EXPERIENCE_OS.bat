@echo off
setlocal
title Brand Experience OS Launcher

cd /d "%~dp0"
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\launchers\launch-brand-experience.ps1"

echo.
echo Brand Experience OS launcher finished. You can close this window when you are done.
pause
