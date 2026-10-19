// Zmaže lokálnu databázu a nahrané súbory (návrat do východiskového stavu).
const fs = require('node:fs');
const { DATA_DIR } = require('./config');
fs.rmSync(DATA_DIR, { recursive: true, force: true });
console.log(`Zmazané: ${DATA_DIR}. Pri ďalšom štarte sa vytvorí nová databáza s úvodným obsahom.`);
