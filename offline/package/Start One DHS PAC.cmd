@echo off
title One DHS People, Access and Culture
"%~dp0runtime\node\node.exe" "%~dp0launcher\launcher.mjs" start
if errorlevel 1 pause
