// Kontakt page
const { useState: useKState } = React;

function KontaktHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50/40 border-b border-slate-100">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-blue-100/40 blur-3xl"></div>
      </div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20 text-center">
        <div className="inline-flex items-center gap-2 bg-green-50 text-green-800 px-3 py-1.5 rounded-full text-xs font-bold mb-5">
          <span className="relative flex w-2 h-2">
            <span className="absolute inline-flex w-full h-full rounded-full bg-green-400 opacity-60 animate-ping"></span>
            <span className="relative inline-flex w-2 h-2 rounded-full bg-green-500"></span>
          </span>
          Sme online · odpovieme do 24 hodín
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 leading-[1.05] tracking-tight">
          Máte otázku? <span className="text-blue-900">Sme tu pre vás.</span>
        </h1>
        <p className="mt-5 text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
          Napíšte nám alebo zavolajte. Radi vás prevedieme možnosťami financovania a odpovieme na všetko, čo vás zaujíma.
        </p>
      </div>
    </section>
  );
}

function ContactInfoCard() {
  const items = [
    { Icon: Phone, label: "Telefón", value: "+421 905 123 456", href: "tel:+421905123456" },
    { Icon: Mail, label: "Email", value: "info@automesacne.sk", href: "mailto:info@automesacne.sk" },
    { Icon: MessageCircle, label: "WhatsApp", value: "+421 905 123 456", href: "https://wa.me/421905123456" },
    { Icon: Clock, label: "Otváracie hodiny", value: "Po-Pi 8:00 až 17:00" },
    { Icon: MapPin, label: "Adresa", value: "Hlavná 571/124, 946 32 Marcelová" },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
      <h2 className="text-2xl font-bold text-slate-900 mb-1">Kontaktné údaje</h2>
      <p className="text-sm text-slate-500 mb-6">Tu nás zastihnete kedykoľvek počas pracovných dní.</p>

      <ul className="space-y-5">
        {items.map(({ Icon: ItemIcon, label, value, href }) => (
          <li key={label} className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
              <ItemIcon className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</div>
              {href ? (
                <a href={href} className="text-base font-semibold text-slate-900 hover:text-blue-900 transition-colors break-all">
                  {value}
                </a>
              ) : (
                <div className="text-base font-semibold text-slate-900">{value}</div>
              )}
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-8 pt-6 border-t border-slate-100">
        <div className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Spätné volanie</div>
        <p className="text-sm text-slate-600 leading-relaxed mb-4">
          Nemáte čas vypisovať formulár? Necháte nám číslo a my zavoláme my, do 60 minút v pracovnej dobe.
        </p>
        <a
          href="tel:+421905123456"
          className="inline-flex items-center gap-2 bg-blue-900 hover:bg-blue-800 text-white font-bold px-5 py-3 rounded-xl transition-colors"
        >
          <Phone className="w-4 h-4" />
          Zavolajte nám
        </a>
      </div>
    </div>
  );
}

function ContactForm() {
  const [sent, setSent] = useKState(false);
  const [pending, setPending] = useKState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    setPending(true);
    setTimeout(() => {
      setPending(false);
      setSent(true);
    }, 700);
  };

  if (sent) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="text-center py-10">
          <div className="w-16 h-16 rounded-full bg-green-100 text-green-700 flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900">Ďakujeme, máme to.</h3>
          <p className="mt-3 text-slate-600 max-w-md mx-auto leading-relaxed">
            Ozveme sa vám do 24 hodín na email alebo telefón, ktorý ste zadali.
          </p>
          <a
            href="/"
            className="inline-flex items-center gap-2 mt-6 text-blue-900 font-semibold underline underline-offset-4 decoration-2 decoration-blue-300 hover:decoration-blue-700"
          >
            Vrátiť sa na úvod
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
      <h2 className="text-2xl font-bold text-slate-900 mb-1">Napíšte nám</h2>
      <p className="text-sm text-slate-500 mb-6">Vyplnenie trvá menej ako minútu.</p>

      <form className="space-y-4" onSubmit={onSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Meno a priezvisko</label>
            <input
              type="text"
              required
              placeholder="Ján Novák"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Telefón</label>
            <input
              type="tel"
              required
              placeholder="+421 905 123 456"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email</label>
          <input
            type="email"
            required
            placeholder="meno@email.sk"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Predmet</label>
          <select
            required
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all bg-white"
          >
            <option value="">Vyberte predmet</option>
            <option>Všeobecná otázka</option>
            <option>Žiadosť o financovanie</option>
            <option>Spätné volanie</option>
            <option>Existujúca zmluva</option>
            <option>Reklamácia</option>
            <option>Iné</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">Vaša správa</label>
          <textarea
            required
            rows={5}
            placeholder="Stručne nám popíšte, s čím vám vieme pomôcť."
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all resize-none"
          />
        </div>

        <label className="flex items-start gap-3 cursor-pointer">
          <input type="checkbox" required className="mt-1 w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
          <span className="text-sm text-slate-600 leading-relaxed">
            Súhlasím so spracovaním osobných údajov v zmysle <a href="/gdpr.html" className="text-blue-900 font-semibold underline underline-offset-2">GDPR</a>.
          </span>
        </label>

        <button
          type="submit"
          disabled={pending}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-slate-300 text-white font-bold py-4 rounded-xl transition-colors shadow-md shadow-green-600/20 flex items-center justify-center gap-2"
        >
          {pending ? "Odosielam..." : (
            <>
              Odoslať správu
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        <p className="text-xs text-slate-400 text-center">
          Odpoveď od nás dostanete do 24 hodín v pracovných dňoch.
        </p>
      </form>
    </div>
  );
}

function ContactMap() {
  return (
    <section className="bg-slate-50 py-16 px-4 sm:px-6 border-y border-slate-100">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">Kde nás nájdete</h2>
          <p className="mt-2 text-slate-600">Sídlo spoločnosti, Marcelová.</p>
        </div>
        <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-white">
          <iframe
            title="Mapa sídla AutoMesacne.sk"
            src="https://www.google.com/maps?q=Hlavn%C3%A1%20571%2F124%2C%20946%2032%20Marcelov%C3%A1&output=embed"
            className="w-full h-[400px] border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}

function ContactCalcBanner() {
  return (
    <section className="bg-white py-16 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <div className="bg-gradient-to-br from-blue-900 to-blue-700 rounded-3xl p-10 sm:p-14 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-30 pointer-events-none">
            <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-blue-400/30 blur-3xl"></div>
          </div>
          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">
              Alebo si rovno vypočítajte splátku
            </h2>
            <p className="mt-4 text-lg text-blue-100 max-w-2xl mx-auto">
              Stačia tri údaje: cena vozidla, akontácia a doba splácania. Orientačnú splátku uvidíte hneď.
            </p>
            <a
              href="/#form"
              className="inline-flex items-center gap-2 mt-7 bg-green-600 hover:bg-green-700 text-white font-bold px-7 py-4 rounded-xl transition-colors shadow-xl shadow-green-900/30"
            >
              Otvoriť kalkulačku
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function KontaktApp() {
  return (
    <div className="bg-white text-slate-900 min-h-screen">
      <SiteNav active="kontakt" />
      <main>
        <KontaktHero />
        <section className="py-16 px-4 sm:px-6 bg-white">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-8">
            <ContactInfoCard />
            <ContactForm />
          </div>
        </section>
        <ContactMap />
        <ContactCalcBanner />
      </main>
      <SiteFooter />
    </div>
  );
}

const kontaktRoot = ReactDOM.createRoot(document.getElementById("root"));
kontaktRoot.render(<KontaktApp />);
