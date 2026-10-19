// Úvodný obsah podľa grafického návrhu (PDF). Texty lekcie 1, 3, 6 a križovatky č. 1
// sú prevzaté z návrhu; ostatné je zástupný obsah, ktorý sa prepisuje v administrácii.
// Ilustrácie sú generované jednoduché SVG – skutočné fotky/grafiku nahráte cez CMS.
const fs = require('node:fs');
const path = require('node:path');
const { db, q, setSetting } = require('./db');
const { DATA_DIR } = require('./config');

const UP = path.join(DATA_DIR, 'uploads');
const writeAsset = (name, svg) => {
  // SVG bez width/height nemá vlastnú veľkosť a v obsahu by sa zbalil na 0 – rozmery doplníme z viewBox
  const vb = /viewBox="0 0 (\d+) (\d+)"/.exec(svg);
  if (vb) svg = svg.replace('<svg ', `<svg width="${vb[1]}" height="${vb[2]}" `);
  fs.writeFileSync(path.join(UP, name), svg);
  return `/media/${name}`;
};

/* ---------- SVG generátory ---------- */
function chassisSvg() {
  // zjednodušená schéma podvozku zhora (vpravo je predok vozidla)
  const wheel = (x, y) => `<rect x="${x - 42}" y="${y - 22}" width="84" height="44" rx="10" fill="#fff" stroke="#555" stroke-width="3"/><rect x="${x - 30}" y="${y - 14}" width="60" height="28" rx="6" fill="#dcdcdc"/>`;
  const spring = (x, y) => `<path d="M${x - 14} ${y} l8 -9 l8 18 l8 -18 l8 18 l8 -9" fill="none" stroke="#e8212e" stroke-width="3" transform="rotate(90 ${x} ${y})"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 440"><rect width="800" height="440" fill="#fff"/>
<path d="M120 120 Q120 80 170 76 H560 Q700 90 730 180 V260 Q700 350 560 364 H170 Q120 360 120 320Z" fill="#e8e8e8"/>
<path d="M240 70 V370 M560 70 V370" stroke="#c2c2c2" stroke-width="14" stroke-linecap="round"/>
${wheel(240, 62)}${wheel(240, 378)}${wheel(560, 62)}${wheel(560, 378)}
${spring(240, 100)}${spring(240, 340)}${spring(560, 100)}${spring(560, 340)}
<g fill="none" stroke="#f47b30" stroke-width="9" stroke-linecap="round"><path d="M420 220 L548 220"/><path d="M540 110 V330"/><ellipse cx="390" cy="220" rx="26" ry="42" stroke-width="8"/></g>
<g fill="none" stroke="#0aa874" stroke-width="3.5"><path d="M330 300 H240 M330 300 L560 300 M330 300 V130 H240"/><path d="M560 300 V378 M560 300 V62 M240 130 V62 M240 300 V378"/></g>
<g fill="#0aa874"><rect x="300" y="285" width="60" height="30" rx="6"/><circle cx="240" cy="62" r="13"/><circle cx="240" cy="378" r="13"/><circle cx="560" cy="62" r="13"/><circle cx="560" cy="378" r="13"/></g></svg>`;
}

function warningSign(glyph) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300"><rect width="300" height="300" fill="#fff"/>
<path d="M150 28 L276 250 Q280 262 266 262 L34 262 Q20 262 24 250 Z" fill="#c2201a" stroke="#eee" stroke-width="4" stroke-linejoin="round"/>
<path d="M150 78 L236 232 L64 232 Z" fill="#f1efec"/>${glyph}</svg>`;
}
const GLYPHS = {
  danger: '<rect x="141" y="115" width="18" height="62" rx="9" fill="#2a2a2a"/><circle cx="150" cy="200" r="11" fill="#2a2a2a"/>',
  right: '<path d="M105 215 V170 Q105 148 128 148 H182 M182 148 l-16 -14 M182 148 l-16 14" fill="none" stroke="#222" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>',
  double: '<path d="M140 220 V190 L165 170 V135 M165 135 l-12 12 M165 135 l12 12" fill="none" stroke="#222" stroke-width="13" stroke-linecap="round" stroke-linejoin="round"/>',
  down: '<path d="M98 222 L206 222 L98 162 Z" fill="#222"/><text x="124" y="150" font-family="Arial" font-weight="700" font-size="30" fill="#222" transform="rotate(27 124 150)">10%</text>',
  up: '<path d="M98 222 L206 222 L206 162 Z" fill="#222"/><text x="136" y="150" font-family="Arial" font-weight="700" font-size="30" fill="#222" transform="rotate(-27 136 150)">10%</text>',
  narrow: '<path d="M126 224 V132 M180 224 V132 M126 132 q0 30 10 50" fill="none" stroke="#222" stroke-width="12" stroke-linecap="round"/>',
  bumps: '<path d="M96 218 H204 M104 218 q14 -34 28 0 q14 -34 28 0 q14 -34 28 0" fill="#222" stroke="#222" stroke-width="10" stroke-linecap="round"/>',
  shoulder: '<path d="M92 222 H210" stroke="#222" stroke-width="8"/><rect x="132" y="168" width="48" height="26" rx="6" fill="#222"/><circle cx="145" cy="198" r="7" fill="#222"/><circle cx="168" cy="198" r="7" fill="#222"/>',
};

function symbolSvg(kind) {
  const base = (inner, color = '#e8212e') => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 250"><rect width="300" height="250" fill="#000"/><g fill="none" stroke="${color}" stroke-width="14" stroke-linecap="round">${inner}</g></svg>`;
  switch (kind) {
    case 'parking': return base('<circle cx="150" cy="125" r="56"/><path d="M66 70 Q40 125 66 180 M234 70 Q260 125 234 180"/>') .replace('</g>', `</g><text x="150" y="150" text-anchor="middle" font-family="Arial" font-weight="700" font-size="70" fill="#e8212e">P</text>`);
    case 'brake': return base('<circle cx="150" cy="125" r="56"/><path d="M66 70 Q40 125 66 180 M234 70 Q260 125 234 180"/>').replace('</g>', `</g><text x="150" y="150" text-anchor="middle" font-family="Arial" font-weight="700" font-size="70" fill="#e8212e">!</text>`);
    case 'battery': return base('<rect x="70" y="85" width="160" height="90" rx="6"/><path d="M100 85 V68 H125 V85 M175 85 V68 H200 V85 M100 130 h28 M186 118 v24 M174 130 h24"/>');
    case 'abs': return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 250"><rect width="300" height="250" fill="#000"/><text x="150" y="150" text-anchor="middle" font-family="Arial" font-weight="700" font-size="84" fill="#f5a300">ABS</text></svg>`;
    case 'airbag': return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 250"><rect width="300" height="250" fill="#000"/><circle cx="150" cy="70" r="16" fill="#e8212e"/><path d="M150 92 V138 M124 110 L150 120 L176 100" stroke="#e8212e" stroke-width="12" fill="none" stroke-linecap="round"/><text x="150" y="190" text-anchor="middle" font-family="Arial" font-weight="700" font-size="42" fill="#e8212e">AIR</text><text x="150" y="232" text-anchor="middle" font-family="Arial" font-weight="700" font-size="42" fill="#e8212e">BAG</text></svg>`;
    case 'epc': return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 250"><rect width="300" height="250" fill="#000"/><text x="150" y="150" text-anchor="middle" font-family="Arial" font-weight="700" font-size="84" fill="#f5a300">EPC</text></svg>`;
    case 'oil': return base('<path d="M70 150 H190 L220 118 M70 150 L58 120 H92 M120 150 V108 H170 V150"/><path d="M228 150 q10 18 0 26" stroke-width="10"/>');
    default: return base('');
  }
}

/* animácia križovatky: auto z ľavej strany a protiidúce vozidlo sa pohybujú k stredu */
const CAR_COLORS = { green: '#0f9d58', blue: '#1b5fd6', red: '#d62828', yellow: '#f4c20d' };
function car(color, x, y, dx, dy) {
  return `<g class="m" style="--dx:${dx}px;--dy:${dy}px"><rect x="${x}" y="${y}" width="150" height="70" rx="14" fill="${CAR_COLORS[color]}"/><rect x="${x + 38}" y="${y + 10}" width="70" height="50" rx="8" fill="#fff" opacity=".85"/><circle cx="${x + 36}" cy="${y + 72}" r="12" fill="#111"/><circle cx="${x + 116}" cy="${y + 72}" r="12" fill="#111"/></g>`;
}
function sceneSvg(num, cars, animated) {
  const css = animated ? '.m{animation:go 3.2s ease-in-out forwards}@keyframes go{to{transform:translate(var(--dx),var(--dy))}}' : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 350"><style>${css}</style><rect width="800" height="350" fill="#fff"/>
<rect x="0" y="0" width="800" height="22" fill="#ccc"/><rect x="0" y="330" width="800" height="20" fill="#ccc"/>
<path d="M0 140 H300 M500 140 H800 M0 330 H260" stroke="#bbb" stroke-width="6" fill="none"/>
${cars.map((c) => car(...c)).join('')}
<path d="M140 350 Q260 250 420 270 Q560 290 640 350Z" fill="#222"/><path d="M420 320 H800 V350 H560Z" fill="#d62828"/></svg>`;
}
const SCENES = [
  [['green', 20, 110, 110, 0], ['blue', 330, 10, 0, 40]],
  [['green', 330, 10, 0, 60], ['blue', 640, 100, -120, 0]],
  [['red', 20, 100, 110, 0], ['blue', 640, 20, -60, 30]],
  [['red', 20, 100, 110, 0], ['green', 640, 110, -110, 0]],
  [['blue', 330, 20, 0, 60], ['red', 640, 110, -120, 0]],
  [['blue', 300, 20, 0, 50], ['red', 460, 20, 0, 50], ['green', 20, 110, 110, 0]],
  [['red', 20, 150, 110, 0], ['green', 640, 110, -110, 0]],
  [['blue', 330, 20, 0, 60], ['green', 640, 120, -110, 0]],
  [['yellow', 330, 20, 0, 60], ['red', 20, 150, 110, 0], ['green', 640, 120, -110, 0]],
  [['yellow', 20, 140, 110, 0], ['red', 330, 20, 0, 50], ['green', 640, 120, -110, 0]],
  [['yellow', 330, 20, 0, 50], ['green', 20, 160, 110, 0], ['red', 600, 60, -80, 0]],
  [['yellow', 520, 20, -60, 30], ['green', 20, 160, 110, 0], ['blue', 640, 110, -110, 0]],
];

/* ---------- obsah ---------- */
const LESSONS = [
  ['NVÚ 1', 'Náuka o vozidlách a ich údržbe'], ['NVÚ 2'], ['TVV 1', 'Teória vedenia vozidla'], ['TVV 2'], ['TVV3'],
  ['PCP 1', 'Pravidlá cestnej premávky'], ['PCP 2'], ['PCP 3'], ['PCP 4'], ['PCP 5'], ['PCP 6'], ['PCP 7'], ['PCP 8'],
  ['PCP 9'], ['PCP 10'], ['ZBJ 1', 'Zásady bezpečnej jazdy'], ['ZBJ 2'], ['PCP 11'], ['PCP 12'], ['PCP 13'], ['PCP 14'],
  ['ZBJ 3'], ['ZBJ 4'], ['PCP 15'], ['PCP 16'], ['PCP 17'], ['PCP 18'], ['PCP 19'], ['OP1', 'Opakovanie'], ['PCP 20'],
  ['OP 2'], ['OP 3'],
];
const PLACEHOLDER = '<p class="placeholder">Obsah tejto podkapitoly sa doplní v administrácii (CMS).</p>';
const subs = (...titles) => titles.map((t) => (typeof t === 'string' ? { title: t, html: PLACEHOLDER } : { html: PLACEHOLDER, ...t }));

function lessonSubs(n, chassis, symbolImgs) {
  if (n === 1) {
    return [
      {
        title: 'Všeobecný opis konštrukcie vozidiel',
        html: `<p>ZÁKLADNÉ ČASTI VOZIDLA:</p>
<ul><li><b>podvozok s príslušenstvom,</b> na ktorom je karoséria alebo samonosná karoséria s príslušenstvom podvozku,</li>
<li><b>poháňacia sústava</b>,</li><li><b>príslušenstvo vozidla</b>,</li><li><b>výstroj vozidla</b>,</li><li><b>výbava vozidla</b>.</li></ul>
<p>Moderné osobné vozidlá majú väčšinou samonosnú karosériu – rám vozidla a karoséria tvoria jeden celok. Na tejto karosérii sú upevnené príslušenstvo podvozku a poháňacia sústava.</p>
<p>Karoséria umožňuje prepravu osôb a nákladu, ochraňuje prepravované osoby pred poveternostnými vplyvmi, poskytuje účinnú ochranu pri prípadnej dopravnej nehode.</p>
<p><u><b>Podvozok vozidla</b></u> tvorí (obr. 1):</p>
<ol><li><b>rám vozidla</b>,</li><li><b>nápravy s kolesami a pérovaním</b>,</li><li><b>riadenie</b> (oranžové zobrazenie),</li><li><b>brzdové zariadenie</b> (zelené zobrazenie).</li></ol>
<img src="${chassis}" alt="Podvozok vozidla" data-caption="<u><b>Podvozok vozidla</b></u> tvorí (obr. 1):<br>1. <b>rám vozidla</b>,<br>2. <b>nápravy s kolesami a pérovaním</b>,<br>3. <b>riadenie</b> (oranžové zobrazenie),<br>4. <b>brzdové zariadenie</b> (zelené zobrazenie).">`,
      },
      ...subs('Poháňacia sústava vozidla – motor', 'Palivová sústava', 'Mazacia sústava', 'Chladiaca sústava motora', 'Prevodové ústrojenstvo'),
    ];
  }
  if (n === 3) {
    const sym = (k, t) => `<figure class="symbol"><img src="${symbolImgs[k]}" alt="${t}" data-caption="${t}"><figcaption>${t}</figcaption></figure>`;
    return [
      {
        title: 'Oboznámenie sa s vozidlom',
        html: `<h3>MOTOROVÝ PRIESTOR</h3>
<p>Prístup do motorového priestoru je zaistený pomocou <b>tiahla ovládania kapoty</b> motora (obr).<br>V motorovom priestore je umiestnená väčšina predmetov, ktorých sa týka vykonanie <b>prehliadky motorového vozidla</b> (ďalej len vozidlo) pred výjazdom (obr).</p>
<p><i>Bližší popis kontroly vozidla pred jazdou nájdete v podkapitole Úkony pred jazdou.</i></p>
<h3>BATOŽINOVÝ PRIESTOR</h3>
<p>Batožinový priestor sa otvára priamo – stlačením/potiahnutím madla na dverách batožinového priestoru, kľúčikom alebo pri starších typoch vozidiel tiahlom z vnútorného priestoru vozidla (obr). U vozidiel vybavených centrálnym zamykaním dverí sa batožinový priestor odomyká súčasne s odomknutím dverí. V batožinovom priestore vozidla je uložená <b>povinná výbava vozidla</b> (obr).</p>
<p>Pri niektorých typoch vozidiel môže byť časť povinnej výbavy vozidla, napríklad ručný zdvihák, <b>uložená v priestore motora</b>.</p>
<p class="placeholder">Fotografie k tejto podkapitole nahráte v administrácii.</p>`,
      },
      {
        title: 'Zobrazenie a význam jednotlivých symbolov',
        html: `<div class="symbols">
${sym('parking', 'Parkovacia brzda zapnutá.')}
${sym('brake', 'Kontrola bŕzd. Možná nízka hladina brzdovej kvapaliny. Potreba kontroly.')}
${sym('battery', 'Ak svieti kontrolka aj po naštartovaní motora, nedobíja sa akumulátor.')}
${sym('oil', 'Tlak oleja v motore nedosahuje požadovanú úroveň.')}
${sym('abs', 'Kontrolka protiblokovacieho brzdového systému ABS, ak bliká, ABS nefunguje – hrozba šmyku.')}
${sym('airbag', 'Systém airbagov vykazuje poruchu.')}
${sym('epc', 'Signalizuje poruchu v škrtiacej klapke alebo priamo elektronického pedálu plynu.')}
</div>
<p class="placeholder">Ďalšie symboly doplníte v administrácii.</p>`,
      },
      ...subs('Úkony pred jazdou – kontrola vozidla pred jazdou', 'Základné jazdné úkony'),
    ];
  }
  if (n === 6) {
    return [
      { group: 'Úvod do predmetu pravidlá cestnej premávky –', title: 'Úvod do predmetu', html: PLACEHOLDER },
      { group: 'Zákon NR SR č.8/2009 Z.z.', title: '§ 1 Predmet úpravy', html: PLACEHOLDER },
      {
        group: 'Zákon NR SR č.8/2009 Z.z.', title: '§ 2 Vymedzenie základných pojmov',
        html: `<p><b>Cestnou premávkou</b> sa na účely zákona rozumie užívanie diaľnic, ciest, miestnych komunikácií a účelových komunikácií (ďalej len „<u>cesta</u>“) vodičmi vozidiel a chodcami.</p>
<h3>NA ÚČELY ZÁKONA SA ĎALEJ ROZUMIE</h3>
<p><b>– účastníkom cestnej premávky</b><br>osoba, ktorá sa priamo zúčastňuje cestnej premávky,</p>
<p class="note">Napríklad vodič, spolujazdec, chodec…</p>
<p><b>– vodičom</b><br>osoba, ktorá vedie vozidlo vodičom osoba, ktorá vedie vozidlo, alebo osoba, ktorá vykonáva dohľad nad vozidlom, ktoré na jazdu využíva automatizovaný systém riadenia,</p>
<p><b>– chodcom</b><br>účastník cestnej premávky pohybujúci sa pešo; chodcom je aj osoba, ktorá napríklad tlačí alebo ťahá sánky, detský kočík, vozík pre osoby so zdravotným postihnutím alebo ručný vozík s celkovou šírkou nepresahujúcou <b>600 mm</b>, osoba, ktorá sa pohybuje na lyžiach, korčuliach, kolobežke bez pomocného motorčeka, skejtborde alebo obdobnom športovom vybavení, pomocou mechanického alebo elektrického vozíka pre osoby so zdravotným postihnutím, a osoba, ktorá tlačí bicykel, motocykel alebo kolobežku s pomocným motorčekom, alebo vedie zviera,</p>
<p><b>– držiteľom vozidla</b><br>osoba zapísaná v osvedčení o evidencii <b>časť I a časť II</b> ako držiteľ osvedčenia alebo takáto osoba zapísaná v osvedčení o evidencii vydanom v cudzine,</p>
<p><b>– pobytom</b> trvalý pobyt občana Slovenskej republiky, prechodný pobyt občana Slovenskej republiky trvalo žijúceho v zahraničí, trvalý pobyt cudzinca alebo prechodný pobyt cudzinca na území Slovenskej republiky,</p>
<p><b>– vozidlom</b><br>motorové vozidlo, nemotorové vozidlo a električka,</p>`,
      },
      { group: 'Zákon NR SR č.106/2018 Z.z. –', title: '§ 1 Predmet zákona', html: PLACEHOLDER },
      { group: 'Zákon NR SR č.106/2018 Z.z. –', title: '§ 2 Vymedzenie základných pojmov', html: PLACEHOLDER },
      { group: 'Zákon NR SR č.106/2018 Z.z. –', title: '§ 3 Základné druhy vozidiel', html: PLACEHOLDER },
      { group: 'Zákon NR SR č.106/2018 Z.z. –', title: '§ 4 kategórie vozidiel', html: PLACEHOLDER },
      { group: 'Zákon NR SR č.8/2009 Z.z.', title: '§ 3 Všeobecné povinnosti účastníka cestnej premávky', html: PLACEHOLDER },
    ];
  }
  return subs('Úvod');
}

function seed() {
  if (q.get('SELECT COUNT(*) AS c FROM lessons').c > 0) return false;

  const chassis = writeAsset('seed-podvozok.svg', chassisSvg());
  const symbolImgs = {};
  for (const k of ['parking', 'brake', 'battery', 'oil', 'abs', 'airbag', 'epc']) symbolImgs[k] = writeAsset(`seed-symbol-${k}.svg`, symbolSvg(k));

  db.exec('BEGIN');
  try {
    LESSONS.forEach(([code, title], i) => {
      const n = i + 1;
      q.run('INSERT INTO lessons(num,code,title,subs) VALUES(?,?,?,?)', n, code, title || '', JSON.stringify(lessonSubs(n, chassis, symbolImgs)));
    });

    /* značky */
    const cats = ['Výstražné značky', 'Regulačné značky', 'Informačné značky', 'Dodatkové tabuľky', 'Vodorovné značky', 'Dopravné zariadenia'];
    const catIds = cats.map((name, i) => Number(q.run('INSERT INTO sign_categories(pos,name) VALUES(?,?)', i + 1, name).lastInsertRowid));
    const DOC = 'Oficiálny kód a legislatívny opis značky doplníte v administrácii.';
    const signs = [
      ['I. VŠEOBECNÉ VÝSTRAŽNÉ ZNAČKY', '101', 'NEBEZPEČENSTVO', 'Značka upozorňuje na iné nebezpečenstvo ako na to, na ktoré možno upozorniť vhodnou výstražnou značkou.', 'danger'],
      ['I. 1. Stavebno-technické vlastnosti cesty', '', 'Zákruta vpravo', DOC, 'right'],
      ['I. 1. Stavebno-technické vlastnosti cesty', '', 'Dvojitá zákruta', DOC, 'double'],
      ['I. 1. Stavebno-technické vlastnosti cesty', '', 'Nebezpečný zostup', DOC, 'down'],
      ['I. 1. Stavebno-technické vlastnosti cesty', '', 'Výstup', DOC, 'up'],
      ['I. 1. Stavebno-technické vlastnosti cesty', '', 'Zúženie vozovky', DOC, 'narrow'],
      ['I. 1. Stavebno-technické vlastnosti cesty', '', 'Nerovnosť vozovky', DOC, 'bumps'],
      ['I. 1. Stavebno-technické vlastnosti cesty', '', 'Nespevnená krajnica', DOC, 'shoulder'],
    ];
    signs.forEach(([section, code, name, description, glyph], i) => {
      const img = writeAsset(`seed-znacka-${glyph}.svg`, warningSign(GLYPHS[glyph]));
      q.run('INSERT INTO signs(category_id,pos,section,code,name,description,image) VALUES(?,?,?,?,?,?,?)', catIds[0], i + 1, section, code, name, description, img);
    });

    /* križovatky */
    const icats = ['Dopravné situácie z pohľadu vodiča', 'Dopravné situácie – pohľad zhora', 'Dopravné situácie na riadených križovatkách'];
    const icatIds = icats.map((name, i) => Number(q.run('INSERT INTO isec_categories(pos,name) VALUES(?,?)', i + 1, name).lastInsertRowid));
    SCENES.forEach((cars, i) => {
      const n = i + 1;
      const img = writeAsset(`seed-krizovatka-${n}.svg`, sceneSvg(n, cars, false));
      const anim = writeAsset(`seed-krizovatka-${n}-anim.svg`, sceneSvg(n, cars, true));
      const text = n === 1
        ? '<p><b>Križovatka ciest nerozlíšených dopravnými značkami</b>; platí prednosť v jazde vozidiel prichádzajúcich po ceste sprava.</p><p>Vzhľadom na šírkové pomery vozovky sa jazdné dráhy týchto troch vozidiel nepretínajú. Môžu prejsť cez križovatku <b>všetky tri súčasne</b>.</p><p><b>Naše vozidlo</b> a protiidúce <b>modré vozidlo</b> sa pri odbočovaní vľavo <b>vyhýbajú vľavo</b>.</p>'
        : '<p class="placeholder">Vysvetlenie prednosti v jazde sa doplní v administrácii.</p>';
      q.run('INSERT INTO isec(category_id,pos,num,text,image,video) VALUES(?,?,?,?,?,?)', icatIds[0], n, n, text, img, anim);
    });

    /* videá */
    [
      'Kontrola vozidla pred jazdou', 'Úkony pred jazdou', 'Radenie rýchlostí', 'Radenie rýchlostí – automat', 'Rozjazd na rovine',
      'Rozjazd do kopca', 'Zastavenie vozidla', 'Parkovanie rovnobežné', 'Parkovanie kolmé', 'Odbočovanie na križovatke',
      'Jazda s prívesným vozíkom', 'Činnosti po ukončení jazdy',
    ].forEach((t, i) => q.run('INSERT INTO videos(pos,title,file) VALUES(?,?,?)', i + 1, t, ''));

    /* legislatíva */
    [
      ['Zákon NR SR č. 8/2009 Z. z.', 'https://www.slov-lex.sk/pravne-predpisy/SK/ZZ/2009/8/'],
      ['Vyhláška MV SR č. 30/2020 Z. z.', 'https://www.slov-lex.sk/pravne-predpisy/SK/ZZ/2020/30/'],
      ['Zákon NR SR č. 106/2018 Z. z.', 'https://www.slov-lex.sk/pravne-predpisy/SK/ZZ/2018/106/'],
      ['Vyhláška MDV SR č. 134/2018 Z. z.', 'https://www.slov-lex.sk/pravne-predpisy/SK/ZZ/2018/134/'],
    ].forEach(([t, u], i) => q.run('INSERT INTO legislation(pos,title,url) VALUES(?,?,?)', i + 1, t, u));

    setSetting('price_eur', '49');
    setSetting('payment_provider', 'mock');
    setSetting('tests_url', 'https://www.minv.sk/?testy');
    setSetting('tests_text', 'Oficiálne testy Ministerstva vnútra SR nájdete na:');
    db.exec('COMMIT');
  } catch (e) {
    db.exec('ROLLBACK');
    throw e;
  }
  return true;
}

module.exports = { seed, LESSON_COUNT: LESSONS.length };
