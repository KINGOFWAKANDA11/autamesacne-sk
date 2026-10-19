import { h, api, esc, toast } from './util.js';

/* Deklaratívny popis CMS zdrojov: zoznam stĺpcov + polia formulára. */
const T = { text: 'text', num: 'number', area: 'textarea', html: 'html', select: 'select', image: 'image', file: 'file' };

const RES = {
  lekcie: { api: 'lessons', title: 'Lekcie', custom: 'lesson', cols: [['num', '#'], ['code', 'Kód'], ['title', 'Názov']] },
  znacky: {
    api: 'signs', title: 'Značky', category: 'sign-categories',
    cols: [['image', 'Obrázok', 'img'], ['code', 'Kód'], ['name', 'Názov'], ['section', 'Sekcia'], ['category_id', 'Kategória', 'cat']],
    fields: [
      { k: 'category_id', label: 'Kategória', type: T.select, from: 'sign-categories' },
      { k: 'section', label: 'Sekcia / podnadpis', hint: 'Napr. „I. 1. Stavebno-technické vlastnosti cesty“. Značky s rovnakou sekciou sa zoskupia.' },
      { k: 'code', label: 'Kód značky', hint: 'Napr. 101' },
      { k: 'name', label: 'Názov', req: true },
      { k: 'description', label: 'Legislatívny opis', type: T.area },
      { k: 'image', label: 'Obrázok značky', type: T.image },
      { k: 'pos', label: 'Poradie', type: T.num, def: 0 },
    ],
  },
  'kategorie-znaciek': { api: 'sign-categories', title: 'Kategórie značiek', cols: [['pos', 'Poradie'], ['name', 'Názov']], fields: [{ k: 'name', label: 'Názov', req: true }, { k: 'pos', label: 'Poradie', type: T.num, def: 0 }] },
  krizovatky: {
    api: 'isec', title: 'Križovatky', category: 'isec-categories',
    cols: [['image', 'Náhľad', 'img'], ['num', 'Č.'], ['category_id', 'Kategória', 'cat'], ['text', 'Text', 'html']],
    fields: [
      { k: 'category_id', label: 'Kategória', type: T.select, from: 'isec-categories' },
      { k: 'num', label: 'Číslo situácie', type: T.num, def: 1 },
      { k: 'image', label: 'Ilustrácia (statická)', type: T.image },
      { k: 'video', label: 'Animácia / video (voliteľné)', type: T.file, hint: 'MP4/WebM alebo animovaný SVG/GIF. Zobrazí sa po stlačení ▶.' },
      { k: 'text', label: 'Vysvetlenie (HTML)', type: T.html },
      { k: 'pos', label: 'Poradie', type: T.num, def: 0 },
    ],
  },
  'kategorie-krizovatiek': { api: 'isec-categories', title: 'Kategórie križovatiek', cols: [['pos', 'Poradie'], ['name', 'Názov']], fields: [{ k: 'name', label: 'Názov', req: true }, { k: 'pos', label: 'Poradie', type: T.num, def: 0 }] },
  videa: {
    api: 'videos', title: 'Videá', cols: [['pos', 'Poradie'], ['title', 'Názov'], ['file', 'Súbor']],
    fields: [{ k: 'title', label: 'Názov', req: true }, { k: 'file', label: 'Video (MP4 / WebM)', type: T.file }, { k: 'pos', label: 'Poradie', type: T.num, def: 0 }],
  },
  legislativa: {
    api: 'legislation', title: 'Legislatíva', cols: [['pos', 'Poradie'], ['title', 'Názov'], ['url', 'Odkaz']],
    fields: [{ k: 'title', label: 'Názov predpisu', req: true }, { k: 'url', label: 'Odkaz (URL)', hint: 'Napr. odkaz na slov-lex.sk' }, { k: 'pos', label: 'Poradie', type: T.num, def: 0 }],
  },
};

const MENU = [
  ['lekcie', 'Lekcie'], ['znacky', 'Značky'], ['kategorie-znaciek', 'Kategórie značiek'], ['krizovatky', 'Križovatky'],
  ['kategorie-krizovatiek', 'Kategórie križovatiek'], ['videa', 'Videá'], ['legislativa', 'Legislatíva'],
  ['pouzivatelia', 'Používatelia'], ['platby', 'Platby'], ['nastavenia', 'Nastavenia (cena, testy)'],
];

const plain = (html) => String(html || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
const clip = (s, n = 70) => (s.length > n ? `${s.slice(0, n)}…` : s);

export async function adminView(parts, ctx) {
  const [section, id] = parts;
  const side = h('aside', { class: 'side' }, h('div', { class: 'panel cats' }, h('h2', {}, 'Administrácia'),
    h('ul', {}, MENU.map(([key, label]) => h('li', {}, h('a', { href: `#/admin/${key}`, class: key === section ? 'active' : '' }, label))))));
  const show = (title, ...main) => ctx.shell(null, side, [h('h1', {}, title), ...main], { title: `Admin – ${title}` });

  if (!section) {
    return show('Správa obsahu', h('div', { class: 'content' },
      h('p', {}, 'Tu upravujete texty lekcií, značky, križovatky, videá, legislatívu, cenu prístupu a odkaz na testy – bez zásahu do kódu.'),
      h('p', {}, h('a', { class: 'btn', href: '#/admin/lekcie' }, 'Upraviť lekcie'), ' ', h('a', { class: 'btn ghost', href: '#/' }, 'Späť do aplikácie'))));
  }
  if (section === 'pouzivatelia') return usersView(show, ctx);
  if (section === 'platby') return paymentsView(show);
  if (section === 'nastavenia') return settingsView(show, ctx);

  const res = RES[section];
  if (!res) return ctx.go('#/admin');
  if (id === 'new' || id) {
    if (res.custom === 'lesson') return lessonForm(show, ctx, res, section, id);
    return genericForm(show, ctx, res, section, id);
  }
  return listView(show, ctx, res, section);
}

/* ---------- zoznam ---------- */
async function listView(show, ctx, res, section) {
  const [rows, cats] = await Promise.all([api(`admin/${res.api}`), res.category ? api(`admin/${res.category}`) : []]);
  const catName = (cid) => cats.find((c) => c.id === cid)?.name ?? '';
  const filter = h('select', { 'aria-label': 'Filter kategórie' }, h('option', { value: '' }, 'Všetky kategórie'), cats.map((c) => h('option', { value: c.id }, c.name)));
  const tbody = h('tbody');
  const draw = () => {
    const f = filter.value;
    tbody.replaceChildren(...rows.filter((r) => !f || String(r.category_id) === f).map((r) => h('tr', {},
      res.cols.map(([k, , kind]) => h('td', {},
        kind === 'img' ? (r[k] ? h('img', { class: 'th', src: r[k], alt: '' }) : '') :
        kind === 'cat' ? catName(r[k]) :
        kind === 'html' ? h('div', { class: 'cut' }, clip(plain(r[k]))) : h('div', { class: 'cut' }, String(r[k] ?? '')))),
      h('td', { class: 'actions' },
        h('a', { class: 'btn small', href: `#/admin/${section}/${r.id}` }, 'Upraviť'), ' ',
        h('button', { class: 'btn small danger', onClick: async () => {
          if (!confirm('Naozaj zmazať túto položku?')) return;
          try { await api(`admin/${res.api}/${r.id}`, { method: 'DELETE' }); rows.splice(rows.indexOf(r), 1); draw(); toast('Zmazané.'); } catch (e) { toast(e.message); }
        } }, 'Zmazať')))));
  };
  filter.addEventListener('change', draw);
  draw();
  show(res.title,
    h('div', { class: 'toolbar' }, h('a', { class: 'btn', href: `#/admin/${section}/new` }, '+ Pridať'), res.category ? filter : null, h('span', { class: 'spacer' }), h('span', {}, `${rows.length} položiek`)),
    h('div', { style: 'overflow:auto' }, h('table', { class: 'admin-table' }, h('thead', {}, h('tr', {}, res.cols.map(([, label]) => h('th', {}, label)), h('th'))), tbody)));
}

/* ---------- nahrávanie súborov ---------- */
function uploadField(label, value, kind, hint) {
  const state = { value: value || '' };
  const preview = h('div');
  const urlEl = h('div', { class: 'url' });
  const draw = () => {
    preview.replaceChildren();
    if (state.value && /\.(png|jpe?g|gif|webp|svg)$/i.test(state.value)) preview.append(h('img', { src: state.value, alt: '' }));
    else if (state.value) preview.append(h('span', { class: 'pill' }, 'súbor nahraný'));
    urlEl.textContent = state.value;
  };
  const status = h('span', {});
  const input = h('input', { type: 'file', accept: kind === 'image' ? 'image/*' : 'video/mp4,video/webm,image/svg+xml,image/gif', onChange: async () => {
    const file = input.files[0];
    if (!file) return;
    status.textContent = 'Nahrávam…';
    try {
      const r = await api(`admin/upload?name=${encodeURIComponent(file.name)}`, { method: 'POST', raw: file });
      state.value = r.url;
      status.textContent = 'Nahrané.';
      draw();
    } catch (e) { status.textContent = e.message; }
  } });
  const clear = h('button', { type: 'button', class: 'btn small ghost', onClick: () => { state.value = ''; input.value = ''; draw(); } }, 'Odstrániť');
  draw();
  const node = h('div', { class: 'field' }, h('label', {}, label), h('div', { class: 'upload-row' }, preview, input, clear, status), urlEl, hint ? h('small', {}, hint) : null);
  return { node, get: () => state.value };
}

/* ---------- všeobecný formulár ---------- */
async function genericForm(show, ctx, res, section, id) {
  const isNew = id === 'new';
  const [row, ...lookups] = await Promise.all([
    isNew ? {} : api(`admin/${res.api}/${id}`),
    ...res.fields.filter((f) => f.from).map((f) => api(`admin/${f.from}`).then((list) => [f.k, list])),
  ]);
  const opts = Object.fromEntries(lookups);
  const getters = [];
  const nodes = res.fields.map((f) => {
    const val = row[f.k] ?? f.def ?? '';
    if (f.type === T.image || f.type === T.file) {
      const u = uploadField(f.label, val, f.type, f.hint);
      getters.push([f.k, u.get]);
      return u.node;
    }
    const { input, node } = ctx.field(f.label, {
      tag: f.type === T.select ? 'select' : f.type === T.area || f.type === T.html ? 'textarea' : null,
      type: f.type === T.num ? 'number' : f.type === T.text ? 'text' : null, required: !!f.req, class: f.type === T.html ? 'code' : null,
    }, f.hint);
    if (f.type === T.select) {
      (opts[f.k] || []).forEach((o) => input.append(h('option', { value: o.id }, o.name)));
      input.value = String(val || opts[f.k]?.[0]?.id || '');
    } else input.value = val;
    getters.push([f.k, () => input.value]);
    return node;
  });
  const box = h('div');
  const form = h('form', { class: 'form-card', onSubmit: async (e) => {
    e.preventDefault();
    const body = Object.fromEntries(getters.map(([k, get]) => [k, get()]));
    try {
      await api(`admin/${res.api}${isNew ? '' : `/${id}`}`, { method: isNew ? 'POST' : 'PUT', body });
      toast('Uložené.');
      ctx.go(`#/admin/${section}`);
    } catch (err) { box.replaceChildren(ctx.errBox(err.message)); }
  } }, h('h2', {}, isNew ? 'Nová položka' : 'Úprava položky'), box, nodes,
  h('div', { class: 'toolbar' }, h('button', { class: 'btn', type: 'submit' }, 'Uložiť'), h('a', { class: 'btn ghost', href: `#/admin/${section}` }, 'Zrušiť')));
  show(res.title, form);
}

/* ---------- editor lekcie (podkapitoly) ---------- */
async function lessonForm(show, ctx, res, section, id) {
  const isNew = id === 'new';
  const row = isNew ? { num: '', code: '', title: '', subs: '[{"title":"Úvod","html":"<p></p>"}]' } : await api(`admin/lessons/${id}`);
  let subs = JSON.parse(row.subs);
  const num = ctx.field('Číslo lekcie', { type: 'number', required: true, min: 1 });
  const code = ctx.field('Kód (napr. NVÚ 1)', { required: true });
  const title = ctx.field('Názov lekcie (voliteľné)', { placeholder: 'Náuka o vozidlách a ich údržbe' });
  num.input.value = row.num; code.input.value = row.code; title.input.value = row.title;
  const list = h('div');
  const draw = () => {
    list.replaceChildren(...subs.map((s, i) => {
      const group = ctx.field('Skupina v menu (voliteľné)', { value: s.group || '' });
      const st = ctx.field('Nadpis podkapitoly', { value: s.title || '', required: true });
      const html = ctx.field('Obsah (HTML)', { tag: 'textarea', class: 'code' }, 'Povolené značky: p, b, i, u, ul/ol/li, h3, br, img. Obrázky vložíte tlačidlom nižšie.');
      html.input.value = s.html || '';
      group.input.addEventListener('input', () => { s.group = group.input.value; });
      st.input.addEventListener('input', () => { s.title = st.input.value; });
      html.input.addEventListener('input', () => { s.html = html.input.value; });
      const status = h('span', {});
      const img = h('input', { type: 'file', accept: 'image/*', onChange: async () => {
        const file = img.files[0];
        if (!file) return;
        status.textContent = 'Nahrávam…';
        try {
          const r = await api(`admin/upload?name=${encodeURIComponent(file.name)}`, { method: 'POST', raw: file });
          const tag = `<img src="${r.url}" alt="${esc(file.name.replace(/\.[^.]+$/, ''))}">`;
          const el = html.input;
          const at = el.selectionStart ?? el.value.length;
          el.value = el.value.slice(0, at) + tag + el.value.slice(at);
          s.html = el.value;
          status.textContent = 'Obrázok vložený do textu.';
        } catch (e) { status.textContent = e.message; }
        img.value = '';
      } });
      const move = (d) => () => { const j = i + d; if (j < 0 || j >= subs.length) return; [subs[i], subs[j]] = [subs[j], subs[i]]; draw(); };
      return h('div', { class: 'sub-card' },
        h('div', { class: 'head' }, h('b', {}, `Podkapitola ${i + 1}`),
          h('button', { type: 'button', class: 'btn small ghost', onClick: move(-1), 'aria-label': 'Hore' }, '↑'),
          h('button', { type: 'button', class: 'btn small ghost', onClick: move(1), 'aria-label': 'Dole' }, '↓'),
          h('button', { type: 'button', class: 'btn small danger', onClick: () => { if (subs.length > 1 && confirm('Zmazať podkapitolu?')) { subs.splice(i, 1); draw(); } } }, 'Zmazať')),
        group.node, st.node, html.node, h('div', { class: 'upload-row' }, h('span', {}, 'Vložiť obrázok:'), img, status));
    }));
  };
  draw();
  const box = h('div');
  const form = h('form', { class: 'form-card', onSubmit: async (e) => {
    e.preventDefault();
    const clean = subs.map((s) => ({ ...(s.group ? { group: s.group } : {}), title: s.title, html: s.html || '' }));
    try {
      const body = { num: num.input.value, code: code.input.value, title: title.input.value, subs: JSON.stringify(clean) };
      await api(`admin/lessons${isNew ? '' : `/${id}`}`, { method: isNew ? 'POST' : 'PUT', body });
      toast('Uložené.');
      ctx.go('#/admin/lekcie');
    } catch (err) { box.replaceChildren(ctx.errBox(err.message)); window.scrollTo(0, 0); }
  } }, h('h2', {}, isNew ? 'Nová lekcia' : `Úprava ${row.num}. lekcie`), box, h('div', { class: 'row' }, num.node, code.node), title.node,
  h('h2', { style: 'margin-top:26px' }, 'Podkapitoly'), list,
  h('p', {}, h('button', { type: 'button', class: 'btn ghost', onClick: () => { subs.push({ title: 'Nová podkapitola', html: '<p></p>' }); draw(); } }, '+ Pridať podkapitolu')),
  h('div', { class: 'toolbar' }, h('button', { class: 'btn', type: 'submit' }, 'Uložiť'), h('a', { class: 'btn ghost', href: '#/admin/lekcie' }, 'Zrušiť'),
    isNew ? null : h('a', { class: 'btn ghost', href: `#/lekcie/${row.num}`, target: '_blank' }, 'Zobraziť v aplikácii')));
  show(res.title, form);
}

/* ---------- používatelia, platby, nastavenia ---------- */
async function usersView(show, ctx) {
  const users = await api('admin/users');
  const tbody = h('tbody', {}, users.map((u) => h('tr', {},
    h('td', {}, `${u.first_name} ${u.last_name}`), h('td', {}, u.email), h('td', {}, u.role),
    h('td', {}, h('span', { class: `pill ${u.status}` }, u.status === 'active' ? 'aktívny' : 'čaká na platbu')),
    h('td', {}, u.created_at), h('td', {}, u.paid_at || '—'),
    h('td', { class: 'actions' }, u.role === 'admin' ? '' : [
      h('button', { class: 'btn small ghost', onClick: async () => { await api(`admin/users/${u.id}`, { method: 'PATCH', body: { status: u.status === 'active' ? 'pending' : 'active' } }); ctx.go('#/admin/pouzivatelia'); toast('Stav zmenený.'); } }, u.status === 'active' ? 'Deaktivovať' : 'Aktivovať ručne'), ' ',
      h('button', { class: 'btn small danger', onClick: async () => { if (!confirm(`Zmazať ${u.email}?`)) return; await api(`admin/users/${u.id}`, { method: 'DELETE' }); ctx.go('#/admin/pouzivatelia'); } }, 'Zmazať')]))));
  show('Používatelia', h('div', { style: 'overflow:auto' }, h('table', { class: 'admin-table' },
    h('thead', {}, h('tr', {}, ['Meno', 'E-mail', 'Rola', 'Stav', 'Registrácia', 'Zaplatené', ''].map((t) => h('th', {}, t)))), tbody)));
}

async function paymentsView(show) {
  const rows = await api('admin/payments');
  show('Platby', h('div', { style: 'overflow:auto' }, h('table', { class: 'admin-table' },
    h('thead', {}, h('tr', {}, ['#', 'Používateľ', 'Brána', 'Suma', 'Stav', 'Vytvorené', 'Zaplatené'].map((t) => h('th', {}, t)))),
    h('tbody', {}, rows.map((p) => h('tr', {}, h('td', {}, p.id), h('td', {}, p.email), h('td', {}, p.provider),
      h('td', {}, `${(p.amount_cents / 100).toFixed(2)} ${p.currency}`), h('td', {}, h('span', { class: `pill ${p.status}` }, p.status)), h('td', {}, p.created_at), h('td', {}, p.paid_at || '—')))))));
}

async function settingsView(show, ctx) {
  const s = await api('admin/settings');
  const price = ctx.field('Cena prístupu (EUR)', { type: 'number', step: '0.01', min: '0', required: true });
  const url = ctx.field('Odkaz na testy', { type: 'url' }, 'Sekcia Testy zobrazí tento odkaz (predvolene testy Ministerstva vnútra SR).');
  const text = ctx.field('Text nad odkazom', {});
  price.input.value = s.price_eur; url.input.value = s.tests_url; text.input.value = s.tests_text;
  const box = h('div');
  show('Nastavenia', h('form', { class: 'form-card', onSubmit: async (e) => {
    e.preventDefault();
    try { await api('admin/settings', { method: 'PUT', body: { price_eur: price.input.value, tests_url: url.input.value, tests_text: text.input.value } }); box.replaceChildren(h('div', { class: 'okmsg' }, 'Uložené.')); }
    catch (err) { box.replaceChildren(ctx.errBox(err.message)); }
  } }, box, price.node, url.node, text.node, h('button', { class: 'btn', type: 'submit' }, 'Uložiť')));
}
