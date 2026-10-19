/* Malé pomocné funkcie: tvorba DOM, volanie API, ikony. */

export function h(tag, props, ...kids) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(props || {})) {
    if (v === false || v == null) continue;
    if (k === 'class') el.className = v;
    else if (k === 'html') el.innerHTML = v;
    else if (k.startsWith('on')) el.addEventListener(k.slice(2).toLowerCase(), v);
    else if (v === true) el.setAttribute(k, '');
    else el.setAttribute(k, v);
  }
  for (const kid of kids.flat(Infinity)) {
    if (kid == null || kid === false) continue;
    el.append(kid instanceof Node ? kid : document.createTextNode(String(kid)));
  }
  return el;
}

export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export async function api(path, { method = 'GET', body, raw } = {}) {
  const headers = { 'X-Requested-With': '2bit' };
  let payload = raw;
  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
    payload = JSON.stringify(body);
  }
  let res;
  try {
    res = await fetch(`/api/${path}`, { method, headers, body: payload, credentials: 'same-origin' });
  } catch {
    throw Object.assign(new Error('Server nie je dostupný. Skontrolujte pripojenie.'), { status: 0 });
  }
  let data = null;
  try { data = await res.json(); } catch { /* prázdna odpoveď */ }
  if (!res.ok) throw Object.assign(new Error(data?.error || `Chyba ${res.status}`), { status: res.status });
  return data;
}

export function toast(msg) {
  const t = h('div', { class: 'toast', role: 'status' }, msg);
  document.body.append(t);
  setTimeout(() => t.remove(), 2800);
}

export const money = (cents, cur = 'EUR') =>
  new Intl.NumberFormat('sk-SK', { style: 'currency', currency: cur }).format(cents / 100);

const svg = (inner, vb = '0 0 24 24', extra = '') =>
  `<svg viewBox="${vb}" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ${extra}>${inner}</svg>`;

export const icons = {
  search: svg('<circle cx="11" cy="11" r="7"/><path d="M16.5 16.5 21 21"/>'),
  book: svg('<path d="M12 6.5C10 5 7 4.5 3 4.5v14c4 0 7 .5 9 2 2-1.5 5-2 9-2v-14c-4 0-7 .5-9 2zM12 6.5v14"/>'),
  cone: svg('<path d="M10 3h4l4.5 15h-13zM7.5 8.5h9M6.5 13h11M3 21h18"/>'),
  cross: svg('<path d="M12 22v-8M12 14l-6-3M12 14l6-3M5 11V4M2.5 6.5 5 4l2.5 2.5M19 11V4m-2.5 2.5L19 4l2.5 2.5M12 22l-3-3m3 3 3-3"/>'),
  clap: svg('<rect x="3" y="9" width="18" height="12" rx="1"/><path d="m3 9 2.5-5 3 .8L6 9.5M9 5l3 .8-2.5 4.5M13 6l3 .8-2.5 4.5M17 7l3 .8-2.5 3.7"/><path d="m10.5 13.5 4 2.5-4 2.5z"/>'),
  test: svg('<rect x="3" y="14" width="7" height="7" rx="1"/><path d="m4.8 15.8 4.4 4.4m0-4.4-4.4 4.4M10 15l9-9 2.5 2.5-9 9-3.5.8z"/>'),
  law: svg('<path d="M4 5h4v15H4zM8 7h4v13H8zM12.5 6l3.8-1.2 4 14-3.8 1.2z"/><path d="M5.5 15h1M9.5 15h1"/>'),
  x: svg('<path d="M5 5l14 14M19 5 5 19"/>', '0 0 24 24').replace('stroke-width="1.6"', 'stroke-width="2.6"'),
  down: '<svg viewBox="0 0 38 24" fill="currentColor" aria-hidden="true"><path d="M0 0h38L19 24z"/></svg>',
  play: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 3.5v17L21 12z"/></svg>',
  pause: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6 3.5h4.5v17H6zM13.5 3.5H18v17h-4.5z"/></svg>',
  rew: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M11.5 4v16L1 12zM22.5 4v16L12 12z"/></svg>',
  fwd: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.5 4v16L23 12zM1.5 4v16L12 12z"/></svg>',
};
