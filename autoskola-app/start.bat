@echo off
chcp 65001 >nul
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Najprv nainstalujte Node.js - stiahnite verziu LTS z https://nodejs.org a spustite tento subor znova.
  pause
  exit /b 1
)
echo Spustam aplikaciu... Prehliadac sa otvori sam. Okno nezatvarajte, kym appku pouzivate.
start "" cmd /c "timeout /t 3 >nul & start http://localhost:3000"
node --no-warnings server\index.js
pause
