# 2BIT Autoškola – e-learning aplikácia (lokálna verzia)

Responzívna webová aplikácia / PWA podľa grafického návrhu `aplikacia_graficka_struktura_3.pdf`.
Žiadne externé závislosti – stačí **Node.js ≥ 22.13** (vstavaný SQLite).

## Spustenie

```bash
cd autoskola-app
npm start            # http://127.0.0.1:3000
```

Pri prvom štarte sa vytvorí databáza (`data/`), vloží úvodný obsah a vypíše **administrátorský účet**
(e-mail `admin@2bit.local`, náhodné heslo – zobrazí sa iba raz). Vlastné údaje:
`ADMIN_EMAIL=… ADMIN_PASSWORD=… PORT=8080 npm start`.

| Príkaz | Účel |
|---|---|
| `npm test` | 13 automatických testov (prístup, expirácia, testový modul, CSRF, upload, GDPR, admin…) |
| `npm run reset` | zmaže databázu a nahrané súbory (návrat do východiskového stavu) |

Z mobilu v tej istej sieti: `HOST=0.0.0.0 npm start` a otvoriť `http://<ip-počítača>:3000`
(inštalácia ako PWA vyžaduje HTTPS, resp. `localhost`).

## Čo je hotové

- **Testovací režim bez platby (predvolený):** registrácia aktivuje účet hneď. Režim sa prepína v CMS → Nastavenia
  (testovací / DEMO brána; reálny Stripe sa doplní neskôr v `server/payments.js`).
- **Trvanie prístupu podľa roly:** žiak a učiteľ majú samostatne nastaviteľný počet mesiacov (predvolene 6 / 12).
  Po vypršaní sa obsah zamkne; admin prístup predĺži jedným klikom (CMS → Používatelia). Učiteľské účty zakladá admin.
- Prihlásenie, obnova hesla, odhlásenie.
- **Dashboard** so 6 dlaždicami, horná lišta s logom, menu a vyhľadávaním (hľadá bez ohľadu na diakritiku vo všetkých sekciách).
- **Lekcie**: zoznam 32 lekcií, matica 1–32, podkapitoly, obrázky s „+“ na celú obrazovku, šípka na posun nadol.
- **Značky**: kategórie, mriežka, detail (kód, názov, opis), šípky ← → na listovanie.
- **Križovatky**: mriežka situácií, detail s textom a tlačidlom ▶ pre animáciu/video.
- **Videá**: zoznam 1–12, vlastný prehrávač (−10 s, ▶, ⏸, +10 s, ďalšie video).
- **Testy – vlastný modul v aplikácii:** skúšobný test (počet otázok, časový limit a hranica úspešnosti nastaviteľné),
  cvičenie po kategóriách s okamžitou spätnou väzbou, otázky s obrázkom a viacerými správnymi odpoveďami,
  vyhodnotenie na serveri (správne odpovede sa klientovi neposielajú vopred), história výsledkov, odkaz na testy MV SR.
- **Legislatíva** (odkazy na predpisy).
- **CMS** (`Meno ▾ → Administrácia`): úprava lekcií po podkapitolách (vrátane vkladania obrázkov), značiek,
  križovatiek, videí, legislatívy, **testových otázok (formulár aj hromadný import z JSON)**, nastavení; správa používateľov (vytvorenie učiteľa, predĺženie prístupu, zablokovanie) a platieb.
- **Bezpečnosť/GDPR**: heslá `scrypt`, session v `HttpOnly` cookie, limit pokusov o prihlásenie, ochrana CSRF,
  CSP, obsah a médiá **sú dostupné iba po úhrade**, súhlas pri registrácii, export a zmazanie vlastných údajov.
- **PWA**: manifest, ikony, service worker (kostra aplikácie funguje offline; obsah za platbou sa nekešuje).

## Čo je zámerne zástupné

- **Platobná brána:** teraz testovací režim bez platby alebo DEMO brána (`server/payments.js`). Reálnu bránu sa pridáva ako ďalší provider
  (`createCheckout` + volanie `markPaid` z webhooku) bez zásahu do zvyšku aplikácie.
  Karta končiaca `0002` simuluje zamietnutú platbu.
- **Obsah**: texty lekcie 1, 3 (časť), 6 (§ 2) a križovatky č. 1 sú z návrhu; ostatné podkapitoly majú zástupný text.
  Ilustrácie (podvozok, značky, križovatky, symboly) sú generované SVG – skutočné fotky a grafiku nahrajte cez CMS.
  Oficiálne kódy a opisy značiek (okrem 101) doplňte v CMS – nie sú vymyslené.
- **Testové otázky:** v databáze je 7 ukážkových otázok postavených iba na faktoch z návrhu. Skutočnú databázu nahrajte
  cez CMS → Testové otázky → Import (JSON). Predvolené parametre skúšobného testu (25 otázok, 30 min, 90 %) sú orientačné –
  nastavte podľa skúšky v autoškole.
- **Videá** sú prázdne – nahrajte MP4/WebM v CMS → Videá.
- **E-maily** (obnova hesla) sa v lokálnej verzii vypisujú do konzoly servera.
- Farba: návrh používa jasnejšiu modrú (`#1f3fff`) než špecifikácia (`#0033CC`) – mení sa jednou hodnotou `--blue` v `public/css/app.css`.

## Nasadenie (ostrá prevádzka)

Za reverzný proxy (Caddy/nginx) s **HTTPS**, `COOKIE_SECURE=1`, `HOST=127.0.0.1`, pravidelná záloha priečinka `data/`
(databáza + nahrané súbory). Pred spustením s reálnymi platbami: reálna brána, SMTP pre e-maily, obchodné podmienky
a zásady ochrany osobných údajov.

## Štruktúra

```
server/   index.js (HTTP, statika, médiá) · api.js (REST + CMS) · auth.js · payments.js · db.js · seed.js
public/   index.html · css/app.css · js/app.js (aplikácia) · js/admin.js (CMS) · sw.js · manifest
data/     app.db + uploads/   (vytvorí sa automaticky, nie je v gite)
```
