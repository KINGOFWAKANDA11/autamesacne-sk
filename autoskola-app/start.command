#!/bin/bash
cd "$(dirname "$0")"
if ! command -v node >/dev/null 2>&1; then
  echo "Najprv nainstalujte Node.js (verzia LTS) z https://nodejs.org a spustite tento subor znova."
  read -n 1 -s -r -p "Stlacte klavesu..."
  exit 1
fi
echo "Spustam aplikaciu... Prehliadac sa otvori sam. Okno nezatvarajte, kym appku pouzivate."
(sleep 2; open http://localhost:3000 2>/dev/null || xdg-open http://localhost:3000 2>/dev/null) &
node --no-warnings server/index.js
