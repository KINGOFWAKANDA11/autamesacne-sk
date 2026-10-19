import { h, api, esc, icons, money, toast } from './util.js';

const root = document.getElementById('app');
const state = { user: null, redirect: null, config: null, lastPageKey: null };
let overlayEl = null;
let overlayKeys = null;
const disposers = [];

/** Listenery na document/window sa viažu na aktuálne vykreslený root a pri jeho výmene sa odpoja. */
function listen(target, evt, fn, opts) {
  target.addEventListener(evt, fn, opts);
  disposers.push(() => target.removeEventListener(evt, fn, opts));
}
function resetRoot() { disposers.splice(0).forEach((fn) => fn()); }

const NAV = [
  ['lekcie', 'Lekcie'], ['znacky', 'Značky'], ['krizovatky', 'Križovatky'],
  ['videa', 'Videá'], ['testy', 'Testy'], ['legislativa', 'Legislatíva'],
];

/* ====================== pomocné UI ====================== */
const logo = (href = '#/') => h('a', { class: 'logo', href, 'aria-label': '2BIT – domov' }, h('img', { src: '/logo.svg', alt: '2BIT' }));
const xIcon = () => h('span', { html: icons.x });
const plusBtn = () => h('span', { class: 'plus', 'aria-hidden': 'true' });

function go(target) {
  if (/^https?:/.test(target)) { location.href = target; return; } // externá platobná brána
  if (location.hash === target) route(); else location.hash = target;
}

function closeOverlay() {
  overlayEl?.remove();
  overlayEl = null;
  document.body.style.overflow = '';
  if (overlayKeys) document.removeEventListener('keydown', overlayKeys);
  overlayKeys = null;
}

/** Celoobrazovkový detail: sivé pozadie, logo vľavo hore, modré X vpravo dole. */
function openOverlay(body, { onClose, onPrev, onNext, extra } = {}) {
  closeOverlay();
  const close = () => { closeOverlay(); onClose?.(); };
  const closeBtn = h('button', { class: 'ov-close', onClick: close, 'aria-label': 'Zatvoriť' }, xIcon());
  overlayEl = h('div', { class: 'overlay', role: 'dialog', 'aria-modal': 'true' }, h('a', { class: 'logo', href: '#/', onClick: (e) => { e.preventDefault(); close(); }, 'aria-label': '2BIT' }, h('img', { src: '/logo.svg', alt: '' })), body, extra, closeBtn);
  document.body.append(overlayEl);
  document.body.style.overflow = 'hidden';
  overlayKeys = (e) => {
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft' && onPrev) onPrev();
    else if (e.key === 'ArrowRight' && onNext) onNext();
  };
  document.addEventListener('keydown', overlayKeys);
  closeBtn.focus();
  return close;
}

function errBox(msg) { return msg ? h('div', { class: 'err', role: 'alert' }, msg) : null; }

/* ====================== hlavička a vyhľadávanie ====================== */
function searchBox() {
  const input = h('input', { type: 'search', placeholder: 'Hľadať…', 'aria-label': 'Hľadať', autocomplete: 'off' });
  const results = h('div', { class: 'search-results', hidden: true });
  let timer;
  const hide = () => { results.hidden = true; };
  const run = async () => {
    const term = input.value.trim();
    if (term.length < 2) return hide();
    try {
      const rows = await api(`search?q=${encodeURIComponent(term)}`);
      results.replaceChildren(...(rows.length
        ? rows.map((r) => h('a', { href: r.href, onClick: () => { hide(); input.value = ''; closeMenu(); } }, h('small', {}, r.type), h('b', {}, r.title), r.text ? h('div', {}, r.text) : null))
        : [h('div', { class: 'none' }, 'Nič sa nenašlo.')]));
      results.hidden = false;
    } catch { hide(); }
  };
  input.addEventListener('input', () => { clearTimeout(timer); timer = setTimeout(run, 250); });
  input.addEventListener('keydown', (e) => { if (e.key === 'Escape') hide(); if (e.key === 'Enter') { clearTimeout(timer); run(); } });
  listen(document, 'click', (e) => { if (!wrap.contains(e.target)) hide(); });
  const wrap = h('div', { class: 'search', role: 'search' }, input, h('button', { type: 'button', 'aria-label': 'Hľadať', onClick: run, html: icons.search }), results);
  return wrap;
}

let closeMenu = () => {};

function userMenu() {
  const pop = h('div', { class: 'pop', hidden: true },
    state.user.role === 'admin' ? h('a', { href: '#/admin' }, 'Administrácia (CMS)') : null,
    h('a', { href: '#/ucet' }, 'Môj účet a údaje'),
    h('button', { onClick: logout }, 'Odhlásiť sa'));
  const btn = h('button', { 'aria-haspopup': 'true', onClick: (e) => { e.stopPropagation(); pop.hidden = !pop.hidden; } }, `${state.user.firstName} ▾`);
  listen(document, 'click', () => { pop.hidden = true; });
  return h('div', { class: 'user-menu' }, btn, pop);
}

async function logout() {
  try { await api('logout', { method: 'POST' }); } catch { /* ignoruj */ }
  state.user = null;
  state.redirect = null;
  go('#/prihlasenie');
}

function header(active, { dash = false } = {}) {
  const nav = h('nav', { class: 'nav', 'aria-label': 'Hlavné menu' },
    ...(dash ? [] : NAV.map(([key, label]) => h('a', { href: `#/${key}`, class: key === active ? 'active' : '', 'aria-current': key === active ? 'page' : null }, label))));
  const burger = h('button', { class: 'burger', 'aria-label': 'Menu', onClick: () => hd.classList.toggle('open') }, '☰');
  const hd = h('header', { class: 'header' }, logo(), burger, dash ? h('div', { style: 'flex:1' }) : nav, searchBox(), userMenu());
  closeMenu = () => hd.classList.remove('open');
  if (dash) hd.querySelector('.nav')?.remove();
  return hd;
}

function scrollArrow() {
  const btn = h('button', { class: 'scroll-down', 'aria-label': 'Posunúť nadol', html: icons.down, onClick: () => window.scrollBy({ top: window.innerHeight * 0.8, behavior: 'smooth' }) });
  const update = () => { btn.hidden = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 24; };
  listen(window, 'scroll', update, { passive: true });
  listen(window, 'resize', update);
  setTimeout(update, 50);
  setTimeout(update, 500);
  return btn;
}

function shell(active, side, main, opts = {}) {
  resetRoot();
  document.body.className = opts.dash ? 'dash' : '';
  document.title = `${opts.title ? `${opts.title} – ` : ''}2BIT Autoškola`;
  const page = h('div', { class: `page${side ? '' : ' single'}` }, side, h('main', { class: 'main', id: 'main' }, main));
  root.replaceChildren(header(active), page, scrollArrow());
  window.scrollTo(0, 0);
}

/* ====================== verejné stránky ====================== */
function authShell(title, ...kids) {
  resetRoot();
  document.body.className = 'dash';
  document.title = `${title} – 2BIT Autoškola`;
  root.replaceChildren(h('div', { class: 'auth' }, h('div', { class: 'brand' }, h('span', { class: 'logo' }, h('img', { src: '/logo.svg', alt: '2BIT' }))), h('div', { class: 'card' }, h('h1', {}, title), ...kids)));
}

function field(label, props, hint) {
  const id = `f-${Math.random().toString(36).slice(2, 8)}`;
  const { tag, ...attrs } = props;
  const input = tag === 'textarea' ? h('textarea', { id, ...attrs }) : tag === 'select' ? h('select', { id, ...attrs }) : h('input', { id, ...attrs });
  return { input, node: h('div', { class: 'field' }, h('label', { for: id }, label), input, hint ? h('small', {}, hint) : null) };
}

function loginView() {
  const email = field('E-mail', { type: 'email', required: true, autocomplete: 'username' });
  const pass = field('Heslo', { type: 'password', required: true, autocomplete: 'current-password' });
  const box = h('div');
  const btn = h('button', { class: 'btn', type: 'submit', style: 'width:100%' }, 'Prihlásiť sa');
  const form = h('form', { onSubmit: async (e) => {
    e.preventDefault();
    btn.disabled = true;
    box.replaceChildren();
    try {
      const r = await api('login', { method: 'POST', body: { email: email.input.value, password: pass.input.value } });
      state.user = r.user;
      state.redirect = r.redirect;
      go(r.redirect || '#/');
    } catch (err) { box.replaceChildren(errBox(err.message)); btn.disabled = false; }
  } }, box, email.node, pass.node, btn,
  h('div', { class: 'links' }, h('a', { href: '#/zabudnute-heslo' }, 'Zabudnuté heslo?'), h('a', { href: '#/registracia' }, 'Registrácia')));
  authShell('Prihlásenie', form);
  email.input.focus();
}

async function registerView() {
  state.config ??= await api('config');
  const f = { first: field('Meno', { required: true, autocomplete: 'given-name', maxlength: 80 }), last: field('Priezvisko', { required: true, autocomplete: 'family-name', maxlength: 80 }),
    email: field('E-mail', { type: 'email', required: true, autocomplete: 'email' }), pass: field('Heslo', { type: 'password', required: true, minlength: 8, autocomplete: 'new-password' }, 'Aspoň 8 znakov.') };
  const consent = h('input', { type: 'checkbox', id: 'consent', required: true });
  const box = h('div');
  const btn = h('button', { class: 'btn', type: 'submit', style: 'width:100%' }, 'Pokračovať na platbu');
  const form = h('form', { onSubmit: async (e) => {
    e.preventDefault();
    btn.disabled = true;
    box.replaceChildren();
    try {
      const r = await api('register', { method: 'POST', body: { firstName: f.first.input.value, lastName: f.last.input.value, email: f.email.input.value, password: f.pass.input.value, consent: consent.checked } });
      state.user = r.user;
      state.redirect = r.redirect;
      go(r.redirect);
    } catch (err) { box.replaceChildren(errBox(err.message)); btn.disabled = false; }
  } },
  h('div', { class: 'price-box' }, 'Cena prístupu: ', h('b', {}, money(state.config.priceCents, state.config.currency)), h('div', { style: 'font-weight:500;font-size:13px' }, 'Prístup sa aktivuje po úspešnej úhrade.')),
  box, h('div', { class: 'row' }, f.first.node, f.last.node), f.email.node, f.pass.node,
  h('div', { class: 'field check' }, h('label', { for: 'consent' }, consent, h('span', {}, 'Súhlasím so spracovaním osobných údajov (GDPR) na účely vedenia účtu a platby a s obchodnými podmienkami.'))),
  btn, h('div', { class: 'links' }, h('span', {}, 'Už máte účet?'), h('a', { href: '#/prihlasenie' }, 'Prihlásiť sa')));
  authShell('Registrácia', form);
  f.first.input.focus();
}

function forgotView() {
  const email = field('E-mail', { type: 'email', required: true });
  const box = h('div');
  const form = h('form', { onSubmit: async (e) => {
    e.preventDefault();
    try {
      await api('forgot', { method: 'POST', body: { email: email.input.value } });
      box.replaceChildren(h('div', { class: 'okmsg' }, 'Ak účet existuje, poslali sme naň odkaz na obnovu hesla. (Lokálna verzia: odkaz sa vypíše v konzole servera.)'));
    } catch (err) { box.replaceChildren(errBox(err.message)); }
  } }, box, email.node, h('button', { class: 'btn', type: 'submit', style: 'width:100%' }, 'Obnoviť heslo'), h('div', { class: 'links' }, h('a', { href: '#/prihlasenie' }, '← Späť na prihlásenie')));
  authShell('Obnova hesla', form);
}

function resetView(token) {
  const pass = field('Nové heslo', { type: 'password', required: true, minlength: 8, autocomplete: 'new-password' });
  const box = h('div');
  const form = h('form', { onSubmit: async (e) => {
    e.preventDefault();
    try {
      await api('reset', { method: 'POST', body: { token, password: pass.input.value } });
      toast('Heslo zmenené. Prihláste sa.');
      go('#/prihlasenie');
    } catch (err) { box.replaceChildren(errBox(err.message)); }
  } }, box, pass.node, h('button', { class: 'btn', type: 'submit', style: 'width:100%' }, 'Nastaviť heslo'));
  authShell('Nové heslo', form);
}

async function paymentView(id) {
  const pay = await api(`payment/${id}`);
  if (pay.status === 'paid') { await loadUser(); return go('#/'); }
  const card = field('Číslo karty', { inputmode: 'numeric', required: true, placeholder: '4242 4242 4242 4242', autocomplete: 'off', maxlength: 23 });
  const box = h('div');
  const btn = h('button', { class: 'btn yellow', type: 'submit', style: 'width:100%' }, `Zaplatiť ${money(pay.amountCents, pay.currency)}`);
  const form = h('form', { onSubmit: async (e) => {
    e.preventDefault();
    btn.disabled = true;
    box.replaceChildren();
    try {
      await api(`payment/${id}/confirm`, { method: 'POST', body: { card: card.input.value } });
      await loadUser();
      toast('Platba prijatá. Účet je aktívny.');
      go('#/');
    } catch (err) { box.replaceChildren(errBox(err.message)); btn.disabled = false; }
  } },
  h('div', { class: 'demo-banner' }, 'DEMO PLATOBNÁ BRÁNA – žiadne reálne peniaze'),
  h('div', { class: 'price-box' }, 'Prístup do aplikácie: ', h('b', {}, money(pay.amountCents, pay.currency))),
  box, card.node,
  h('div', { class: 'row' }, field('Platnosť', { placeholder: 'MM/RR', autocomplete: 'off' }).node, field('CVC', { placeholder: '123', autocomplete: 'off' }).node),
  h('p', { style: 'font-size:13px;color:#555' }, 'Test: ľubovoľné číslo karty (12–19 číslic) platbu schváli, karta končiaca 0002 ju zamietne.'),
  btn, h('div', { class: 'links' }, h('button', { type: 'button', class: 'btn ghost small', onClick: logout }, 'Odhlásiť sa')));
  authShell('Úhrada prístupu', form);
}

/* ====================== dashboard ====================== */
function dashboardView() {
  const tiles = [
    ['lekcie', 'Výučba podľa lekcií', icons.book], ['znacky', 'Značky', icons.cone], ['krizovatky', 'Križovatky', icons.cross],
    ['videa', 'Videá', icons.clap], ['testy', 'Testy', icons.test], ['legislativa', 'Legislatíva', icons.law],
  ];
  resetRoot();
  document.body.className = 'dash';
  document.title = '2BIT Autoškola';
  const grid = h('div', { class: 'dash-grid' }, tiles.map(([key, label, icon], i) =>
    h('a', { class: `dtile${i === 0 ? ' first' : ''}`, href: `#/${key}`, style: 'text-decoration:none', 'aria-label': `${label} – otvoriť` }, h('span', { html: icon }), h('h2', {}, label), h('span', { class: 'btn' }, 'Otvoriť'))));
  root.replaceChildren(header(null, { dash: true }), h('div', { class: 'dash-wrap' }, grid));
}

/* ====================== lekcie ====================== */
async function lessonsListView() {
  const list = await api('lessons');
  const items = list.map((l) => h('li', {}, h('a', { href: `#/lekcie/${l.num}` }, `${l.num}. LEKCIA – ${l.code}${l.title ? ` (${l.title})` : ''}`)));
  const half = Math.ceil(items.length / 2);
  shell('lekcie', null, [h('h1', {}, 'Výučba podľa lekcií'), h('ul', { class: 'listing' }, items.slice(0, half), items.slice(half))], { title: 'Lekcie' });
}

function enhanceContent(container) {
  container.querySelectorAll('img').forEach((img) => {
    const caption = img.dataset.caption || (img.alt ? esc(img.alt) : '');
    const open = () => openOverlay(
      h('div', { class: 'ov-body' }, h('div', { class: `ov-media${img.closest('.symbols') ? ' dark' : ''}${img.closest('.symbols') ? ' sm' : ''}` }, h('img', { src: img.src, alt: img.alt })), caption ? h('div', { class: 'caption', html: caption }) : null),
    );
    img.addEventListener('click', open);
    if (!img.closest('.symbols')) {
      const wrap = h('div', { class: 'zoomable' });
      img.replaceWith(wrap);
      wrap.append(img, h('button', { class: 'plus', 'aria-label': 'Zväčšiť', onClick: open }));
    }
  });
}

async function lessonView(num, subIdx) {
  const [lesson, list] = await Promise.all([api(`lessons/${num}`), api('lessons')]);
  const idx = Math.min(Math.max(Number(subIdx) || 0, 0), lesson.subs.length - 1);
  const sub = lesson.subs[idx];
  const items = [];
  let lastGroup = null;
  lesson.subs.forEach((s, i) => {
    if (s.group && s.group !== lastGroup) items.push(h('li', { class: 'group' }, s.group));
    lastGroup = s.group ?? null;
    items.push(h('li', {}, h('a', { href: `#/lekcie/${num}/${i}`, class: i === idx ? 'active' : '' }, s.title)));
  });
  const side = h('aside', { class: 'side' },
    h('div', { class: 'panel' }, h('p', { class: 'kicker' }, `${lesson.num}. LEKCIA`), h('p', { class: 'big' }, lesson.code), h('ul', {}, items)),
    h('nav', { class: 'numgrid', 'aria-label': 'Lekcie' }, list.map((l) => h('a', { href: `#/lekcie/${l.num}`, class: l.num === lesson.num ? 'active' : '', title: `${l.code} ${l.title}`.trim() }, l.num))));
  const content = h('div', { class: 'content', html: sub?.html || '' });
  enhanceContent(content);
  shell('lekcie', side, [h('h1', {}, sub?.title || lesson.code), content], { title: `${lesson.num}. lekcia` });
}

/* ====================== značky ====================== */
async function signsPage(catId) {
  const data = await api('signs');
  state.signs = data;
  const cat = data.categories.find((c) => String(c.id) === String(catId)) || data.categories[0];
  state.signCat = cat;
  const side = h('aside', { class: 'side' }, h('div', { class: 'panel cats' }, h('h2', {}, 'Dopravné značky'),
    h('ul', {}, data.categories.map((c) => h('li', {}, h('a', { href: `#/znacky/${c.id}`, class: c.id === cat?.id ? 'active' : '' }, c.name))))));
  const signs = data.signs.filter((s) => s.category_id === cat?.id);
  const sections = [];
  signs.forEach((s) => {
    let sec = sections.find((x) => x.name === s.section);
    if (!sec) sections.push((sec = { name: s.section, items: [] }));
    sec.items.push(s);
  });
  const body = sections.map((sec) => [
    sec.name ? h('h3', { class: 'section' }, sec.name) : null,
    h('div', { class: 'tiles' }, sec.items.map((s) => h('a', { class: 'tile', href: `#/znacky/${cat.id}/${s.id}`, 'aria-label': `${s.code} ${s.name}`.trim() }, h('img', { src: s.image, alt: s.name, loading: 'lazy' }), plusBtn()))),
  ]);
  shell('znacky', side, [h('h1', {}, cat ? cat.name : 'Značky'), signs.length ? body : h('p', {}, 'V tejto kategórii zatiaľ nie sú žiadne značky.')], { title: 'Značky' });
}

function signOverlay(id) {
  const list = state.signs.signs.filter((s) => s.category_id === state.signCat.id);
  const i = list.findIndex((s) => String(s.id) === String(id));
  if (i < 0) return;
  const s = list[i];
  const nav = (d) => () => { const n = list[i + d]; if (n) go(`#/znacky/${state.signCat.id}/${n.id}`); };
  openOverlay(h('div', { class: 'ov-body' },
    h('div', { class: 'ov-media sm' }, h('img', { src: s.image, alt: s.name })),
    h('div', { class: 'caption' }, h('h2', {}, `${s.code} ${s.name}`.trim()), s.description ? h('p', {}, s.description) : null)),
  { onClose: () => go(`#/znacky/${state.signCat.id}`), onPrev: nav(-1), onNext: nav(1) });
}

/* ====================== križovatky ====================== */
async function isecPage(catId) {
  const data = await api('isec');
  state.isec = data;
  const cat = data.categories.find((c) => String(c.id) === String(catId)) || data.categories[0];
  state.isecCat = cat;
  const side = h('aside', { class: 'side' }, h('div', { class: 'panel cats' }, h('h2', {}, 'Riešenia dopravných situácií'),
    h('ul', {}, data.categories.map((c) => h('li', {}, h('a', { href: `#/krizovatky/${c.id}`, class: c.id === cat?.id ? 'active' : '' }, c.name))))));
  const items = data.items.filter((s) => s.category_id === cat?.id);
  shell('krizovatky', side, [h('h1', {}, cat ? cat.name : 'Križovatky'),
    items.length ? h('div', { class: 'isec-grid' }, items.map((s) => h('a', { class: 'tile', href: `#/krizovatky/${cat.id}/${s.id}`, 'aria-label': `Situácia ${s.num}` }, h('img', { src: s.image, alt: `Situácia ${s.num}`, loading: 'lazy' }), h('span', { class: 'badge-num' }, s.num), plusBtn())))
      : h('p', {}, 'V tejto kategórii zatiaľ nie sú žiadne situácie.')], { title: 'Križovatky' });
}

const isVideoFile = (u) => /\.(mp4|webm)$/i.test(u);

function isecOverlay(id) {
  const list = state.isec.items.filter((s) => s.category_id === state.isecCat.id);
  const i = list.findIndex((s) => String(s.id) === String(id));
  if (i < 0) return;
  const s = list[i];
  const nav = (d) => () => { const n = list[i + d]; if (n) go(`#/krizovatky/${state.isecCat.id}/${n.id}`); };
  const stage = h('div', { class: 'stage' });
  const still = h('img', { src: s.image, alt: `Situácia ${s.num}`, style: 'max-width:100%;max-height:62vh;display:block' });
  stage.append(still, h('span', { class: 'badge-num', style: 'font-size:40px;left:14px;top:8px' }, s.num));
  if (s.video) {
    const play = h('button', { class: 'play-btn', 'aria-label': 'Prehrať animáciu', html: icons.play, onClick: () => {
      play.remove();
      if (isVideoFile(s.video)) {
        const v = h('video', { src: s.video, controls: true, autoplay: true, playsinline: true, style: 'max-width:100%;max-height:62vh;display:block' });
        still.replaceWith(v);
      } else {
        still.src = `${s.video}?t=${Date.now()}`; // opätovné načítanie reštartuje animáciu
      }
    } });
    stage.append(play);
  }
  openOverlay(h('div', { class: 'ov-body wide' }, stage, h('div', { class: 'caption wide', html: s.text || '' })),
    { onClose: () => go(`#/krizovatky/${state.isecCat.id}`), onPrev: nav(-1), onNext: nav(1) });
}

/* ====================== videá ====================== */
async function videosPage() {
  state.videos = await api('videos');
  shell('videa', h('aside', { class: 'side' }, h('div', { class: 'panel' }, h('h2', {}, 'Videá'))),
    [h('ul', { class: 'listing one numbered' }, state.videos.map((v, i) => h('li', {}, h('a', { href: `#/videa/${v.id}` }, h('span', {}, i + 1), h('span', {}, v.title)))))], { title: 'Videá' });
}

function videoOverlay(id) {
  const i = state.videos.findIndex((v) => String(v.id) === String(id));
  if (i < 0) return;
  const v = state.videos[i];
  const next = state.videos[i + 1];
  const vid = v.file ? h('video', { src: v.file, playsinline: true, preload: 'metadata', autoplay: true }) : null;
  const ctl = (label, icon, fn) => h('button', { 'aria-label': label, html: icon, onClick: fn });
  const player = h('div', { class: 'player' }, vid, h('span', { class: 'logo' }, h('img', { src: '/logo.svg', alt: '' })),
    vid ? null : h('h2', {}, v.title),
    h('div', { class: 'controls' },
      ctl('Dozadu o 10 sekúnd', icons.rew, () => { if (vid) vid.currentTime = Math.max(0, vid.currentTime - 10); }),
      ctl('Prehrať', icons.play, () => vid?.play()),
      ctl('Pauza', icons.pause, () => vid?.pause()),
      ctl('Dopredu o 10 sekúnd', icons.fwd, () => { if (vid) vid.currentTime += 10; })),
    vid ? null : h('div', { class: 'no-file' }, 'Video zatiaľ nie je nahraté (CMS → Videá).'));
  const nextBtn = next ? h('button', { class: 'ov-next', 'aria-label': 'Ďalšie video', html: icons.play, onClick: () => go(`#/videa/${next.id}`) }) : null;
  openOverlay(player, { onClose: () => go('#/videa'), extra: nextBtn });
  overlayEl.classList.add('video');
  overlayEl.querySelector(':scope > .logo')?.remove();
}

/* ====================== testy a legislatíva ====================== */
async function testsView() {
  const t = await api('tests');
  const link = t.url ? h('div', { class: 'tests-link' }, t.text ? h('p', {}, t.text) : null, h('a', { href: t.url, target: '_blank', rel: 'noopener noreferrer' }, t.url)) : h('p', {}, 'Odkaz na testy zatiaľ nie je nastavený.');
  shell('testy', h('aside', { class: 'side' }, h('div', { class: 'panel' }, h('h2', {}, 'Testy'))), [link], { title: 'Testy' });
}

async function legislationView() {
  const rows = await api('legislation');
  shell('legislativa', h('aside', { class: 'side' }, h('div', { class: 'panel' }, h('h2', {}, 'Legislatíva'))),
    [h('ul', { class: 'listing one leg' }, rows.map((r) => h('li', {}, r.url ? h('a', { href: r.url, target: '_blank', rel: 'noopener noreferrer' }, r.title) : h('span', { style: 'font-weight:700;font-size:18px' }, r.title))))], { title: 'Legislatíva' });
}

/* ====================== účet (GDPR) ====================== */
function accountView() {
  const pass = field('Heslo (potvrdenie)', { type: 'password', autocomplete: 'current-password' });
  const box = h('div');
  const del = h('button', { class: 'btn danger', onClick: async () => {
    if (!confirm('Naozaj natrvalo zmazať účet a všetky osobné údaje? Prístup sa stratí bez nároku na vrátenie.')) return;
    try { await api('me', { method: 'DELETE', body: { password: pass.input.value } }); state.user = null; toast('Účet bol zmazaný.'); go('#/registracia'); }
    catch (err) { box.replaceChildren(errBox(err.message)); }
  } }, 'Zmazať môj účet');
  shell(null, null, [h('h1', {}, 'Môj účet'),
    h('div', { class: 'form-card' },
      h('p', {}, h('b', {}, `${state.user.firstName} ${state.user.lastName}`), h('br'), state.user.email),
      h('h2', { style: 'margin-top:24px' }, 'Osobné údaje (GDPR)'),
      h('p', {}, 'Môžete si stiahnuť všetky údaje, ktoré o vás evidujeme, alebo účet natrvalo zmazať.'),
      h('p', {}, h('a', { class: 'btn ghost', href: '/api/me/export', download: 'moje-udaje.json' }, 'Stiahnuť moje údaje')),
      h('h2', { style: 'margin-top:24px' }, 'Zmazanie účtu'), box, pass.node, del)], { title: 'Môj účet' });
}

/* ====================== router ====================== */
async function loadUser() {
  const r = await api('me');
  state.user = r.user;
  state.redirect = r.redirect;
}

const OVERLAY_SECTIONS = new Set(['znacky', 'krizovatky', 'videa']);

async function route() {
  closeOverlay();
  const parts = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean).map(decodeURIComponent);
  const [view, a, b] = parts;
  try {
    if (state.user === null && !state.loaded) { await loadUser(); state.loaded = true; }

    /* verejné trasy */
    if (view === 'reset' && a) return resetView(a);
    if (view === 'zabudnute-heslo') return forgotView();
    if (view === 'registracia') return state.user ? go('#/') : await registerView();
    if (view === 'prihlasenie') return state.user ? go('#/') : loginView();
    if (!state.user) return go('#/prihlasenie');

    /* prihlásený, ale nezaplatený */
    if (state.user.role !== 'admin' && state.user.status !== 'active') {
      if (view === 'platba' && a) return await paymentView(a);
      if (!state.redirect) await loadUser();
      return go(state.redirect || '#/prihlasenie');
    }
    if (view === 'platba') return go('#/');

    if (!view) { state.lastPageKey = null; return dashboardView(); }
    if (view === 'admin') {
      if (state.user.role !== 'admin') return go('#/');
      const { adminView } = await import('./admin.js');
      state.lastPageKey = null;
      return await adminView(parts.slice(1), { shell, go, field, errBox });
    }

    /* stránky s detailom v overlayi: mriežka sa nebuduje znova pri prechode medzi položkami */
    const pageKey = OVERLAY_SECTIONS.has(view) ? (view === 'videa' ? 'videa' : `${view}/${a ?? ''}`) : null;
    const needPage = !pageKey || pageKey !== state.lastPageKey || !root.querySelector('.page');
    state.lastPageKey = pageKey;

    if (view === 'lekcie') return a ? await lessonView(a, b) : await lessonsListView();
    if (view === 'znacky') { if (needPage) await signsPage(a); if (b) signOverlay(b); return; }
    if (view === 'krizovatky') { if (needPage) await isecPage(a); if (b) isecOverlay(b); return; }
    if (view === 'videa') { if (needPage) await videosPage(); if (a) videoOverlay(a); return; }
    if (view === 'testy') return await testsView();
    if (view === 'legislativa') return await legislationView();
    if (view === 'ucet') return accountView();
    return go('#/');
  } catch (err) {
    if (err.status === 401) { state.user = null; return go('#/prihlasenie'); }
    if (err.status === 402) { await loadUser(); return go(state.redirect || '#/prihlasenie'); }
    resetRoot();
    root.replaceChildren(h('div', { class: 'auth' }, h('div', { class: 'card' }, h('h1', {}, 'Niečo sa pokazilo'), errBox(err.message), h('a', { class: 'btn', href: '#/' }, 'Späť na nástenku'))));
  }
}

window.addEventListener('hashchange', route);
route();

if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  navigator.serviceWorker.register('/sw.js').catch(() => {});
}
