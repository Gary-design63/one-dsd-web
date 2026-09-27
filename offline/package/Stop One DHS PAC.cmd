@echo off
title Stopping One DHS PAC
"%~dp0runtime\node\node.exe" "%~dp0launcher\launcher.mjs" stop
timeout /t 3 >nul
