// Platobná vrstva. Aplikácia pozná len rozhranie `provider`:
//   createCheckout({ payment, user }) -> { redirect: '#/platba/<id>' | 'https://…' }
//   (po úspechu zavolať markPaid(paymentId) – napr. z webhooku brány)
// Predvolený poskytovateľ je `mock` (lokálna DEMO brána). Reálnu bránu (Stripe,
// GP webpay, CardPay…) pridáte ako ďalšieho providera bez zásahu do zvyšku kódu.
const { q, db, getSetting } = require('./db');

function price() {
  return {
    amount_cents: Math.round(Number(getSetting('price_eur', '49')) * 100),
    currency: 'EUR',
    provider: getSetting('payment_provider', 'mock'),
  };
}

const providers = {
  mock: {
    createCheckout({ payment }) {
      return { redirect: `#/platba/${payment.id}` };
    },
  },
};

function startPayment(user) {
  const p = price();
  const provider = providers[p.provider];
  if (!provider) throw new Error(`Neznámy poskytovateľ platby: ${p.provider}`);
  // nezaplatená platba s rovnakými parametrami sa znovu použije (opakované prihlásenie)
  let payment = q.get(
    "SELECT * FROM payments WHERE user_id=? AND status IN ('created','failed') AND provider=? AND amount_cents=? ORDER BY id DESC LIMIT 1",
    user.id, p.provider, p.amount_cents
  );
  if (!payment) {
    const info = q.run(
      'INSERT INTO payments(user_id,provider,amount_cents,currency) VALUES(?,?,?,?)',
      user.id, p.provider, p.amount_cents, p.currency
    );
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
    q.run("UPDATE users SET status='active' WHERE id=?", pay.user_id);
    db.exec('COMMIT');
  } catch (e) {
    db.exec('ROLLBACK');
    throw e;
  }
  return q.get('SELECT * FROM payments WHERE id = ?', paymentId);
}

module.exports = { price, startPayment, markPaid };
