// Platobná vrstva. Režimy (nastavenie `payment_mode`):
//   free  – testovací režim: účet sa aktivuje hneď po registrácii, bez platby (predvolené)
//   mock  – lokálna DEMO platobná brána
// Reálnu bránu (Stripe…) pridáte ako ďalšieho providera:
//   createCheckout({ payment, user }) -> { redirect: '#/platba/<id>' | 'https://…' }
// a po úspešnej platbe (webhook) zavoláte markPaid(paymentId).
const { q, db, getSetting } = require('./db');

const MODES = ['free', 'mock'];

function mode() {
  const m = getSetting('payment_mode', 'free');
  return MODES.includes(m) ? m : 'free';
}

function price() {
  return {
    amount_cents: Math.round(Number(getSetting('price_eur', '49')) * 100),
    currency: 'EUR',
    provider: mode(),
  };
}

function addMonths(fromMs, months) {
  const d = new Date(fromMs);
  d.setMonth(d.getMonth() + months);
  return d.getTime();
}

/** Aktivuje (alebo predĺži) prístup podľa roly: žiak a učiteľ majú nastaviteľný počet mesiacov. */
function activate(userId, monthsOverride) {
  const u = q.get('SELECT * FROM users WHERE id = ?', userId);
  if (!u || u.role === 'admin') return;
  const months = monthsOverride ?? Number(getSetting(u.role === 'teacher' ? 'access_months_teacher' : 'access_months_student', u.role === 'teacher' ? '12' : '6'));
  const base = Math.max(Date.now(), u.access_until || 0);
  q.run("UPDATE users SET status='active', access_until=? WHERE id=?", addMonths(base, months), userId);
}

const providers = {
  mock: { createCheckout: ({ payment }) => ({ redirect: `#/platba/${payment.id}` }) },
};

function startPayment(user) {
  const p = price();
  const provider = providers[p.provider];
  if (!provider) throw new Error(`Platba nie je v režime ${p.provider} potrebná.`);
  // nezaplatená platba s rovnakými parametrami sa znovu použije (opakované prihlásenie)
  let payment = q.get(
    "SELECT * FROM payments WHERE user_id=? AND status IN ('created','failed') AND provider=? AND amount_cents=? ORDER BY id DESC LIMIT 1",
    user.id, p.provider, p.amount_cents
  );
  if (!payment) {
    const info = q.run('INSERT INTO payments(user_id,provider,amount_cents,currency) VALUES(?,?,?,?)', user.id, p.provider, p.amount_cents, p.currency);
    payment = q.get('SELECT * FROM payments WHERE id = ?', Number(info.lastInsertRowid));
  }
  return { payment, ...provider.createCheckout({ payment, user }) };
}

function markPaid(paymentId, ref = null) {
  const pay = q.get('SELECT * FROM payments WHERE id = ?', paymentId);
  if (!pay || pay.status === 'paid') return pay;
  db.exec('BEGIN');
  try {
    q.run("UPDATE payments SET status='paid', paid_at=datetime('now'), ref=? WHERE id=?", ref, paymentId);
    activate(pay.user_id);
    db.exec('COMMIT');
  } catch (e) {
    db.exec('ROLLBACK');
    throw e;
  }
  return q.get('SELECT * FROM payments WHERE id = ?', paymentId);
}

module.exports = { MODES, mode, price, startPayment, markPaid, activate, addMonths };
