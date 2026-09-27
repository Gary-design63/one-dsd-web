@echo off
title One DHS PAC
"%~dp0runtime\node\node.exe" "%~dp0launcher\launcher.mjs" owner
if errorlevel 1 pause
