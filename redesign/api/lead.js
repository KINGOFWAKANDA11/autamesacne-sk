// Vercel serverless funkcia: prijme lead z wizardu / kontaktu a prepošle emailom cez Resend.
// Nastavenie: v Environment Variables na Verceli pridať RESEND_API_KEY a LEAD_TO (napr. info@automesacne.sk).
// Bez kľúča funkcia lead len zaloguje (viditeľné vo Vercel logs) a vráti 200, web funguje ďalej.

const FIELD_LABELS = {
  type: 'Typ',
  carUrl: 'Odkaz na vozidlo',
  carPrice: 'Cena vozidla (EUR)',
  carYear: 'Ročník vozidla',
  incomeType: 'Typ príjmu',
  fullName: 'Meno a priezvisko',
  birthDate: 'Dátum narodenia',
  address: 'Adresa',
  city: 'Mesto',
  zip: 'PSČ',
  employmentStart: 'Nástup do zamestnania',
  salary: 'Čistý mesačný plat (EUR)',
  ico: 'IČO',
  dic: 'DIČ',
  monthlyCosts: 'Mesačné náklady (EUR)',
  monthlyIncome: 'Mesačný príjem (EUR)',
  vatPayer: 'Platca DPH',
  downPayment: 'Akontácia (EUR)',
  desiredMonthly: 'Predstava o splátke (EUR)',
  loanMonths: 'Doba splácania (mes.)',
  email: 'Email',
  phone: 'Telefón',
  notes: 'Poznámky',
  meno: 'Meno',
  telefon: 'Telefón',
  predmet: 'Predmet',
  sprava: 'Správa',
};

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  const lead = req.body || {};
  const isZiadost = lead.type === 'ziadost';

  const lines = Object.entries(lead)
    .filter(([k, v]) => v !== '' && v !== undefined && v !== null && k !== 'gdpr')
    .map(([k, v]) => `${FIELD_LABELS[k] || k}: ${v}`);

  console.log('[lead]', JSON.stringify(lead));

  const key = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_TO || 'info@automesacne.sk';

  if (key) {
    try {
      const r = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
        body: JSON.stringify({
          from: 'AutoMesacne.sk web <web@automesacne.sk>',
          to: [to],
          reply_to: lead.email || undefined,
          subject: isZiadost
            ? `Nová žiadosť o financovanie${lead.fullName ? ' — ' + lead.fullName : ''}`
            : `Správa z kontaktného formulára${lead.meno ? ' — ' + lead.meno : ''}`,
          text: lines.join('\n'),
        }),
      });
      if (!r.ok) console.error('[lead] resend error', r.status, await r.text());
    } catch (err) {
      console.error('[lead] resend failed', err);
    }
  }

  res.status(200).json({ ok: true });
};
