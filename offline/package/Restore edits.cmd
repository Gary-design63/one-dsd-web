@echo off
title Restore One DHS PAC edits
"%~dp0runtime\node\node.exe" "%~dp0launcher\launcher.mjs" restore "%~1"
pause
