// Main App
const { useState: useAState, useEffect: useAEffect, useCallback: useACallback } = React;

// Partner list lives in partners.jsx (PARTNER_LIST + PartnerCard component)
// TODO: replace with real partner logos after legal approval

const sourcePlatforms = [
  "Autobazar.eu",
  "Bazoš",
  "FB Marketplace",
  "Carselect",
  "a iné",
];

const paymentExamples = [
  { car: "Škoda Octavia", year: 2020, price: 18000, payment: 216, months: 72 },
  { car: "VW Tiguan", year: 2019, price: 24500, payment: 265, months: 84 },
  { car: "BMW radu 3", year: 2021, price: 32000, payment: 320, months: 84 },
];

// TODO: replace placeholder testimonials with real ones from production
const testimonials = [
  { text: "Vybavili mi leasing na auto z bazáru za necelý deň. Profi prístup.", name: "Marek K.", city: "Bratislava" },
  { text: "Žiadne zbytočné papierovanie. Všetko online, super skúsenosť.", name: "Jana B.", city: "Trnava" },
  { text: "Splátka aj bez akontácie, presne ako sľubovali. Odporúčam.", name: "Tomáš H.", city: "Žilina" },
];

const steps = [
  {
    title: "Pošlete nám link na auto",
    body: "Pošlete nám link na inzerát alebo údaje o vozidle. Funguje akýkoľvek inzerát z Autobazaru, Bazoša, Marketplace aj od súkromníka.",
  },
  {
    title: "Pripravíme individuálnu ponuku",
    body: "Porovnáme podmienky našich leasing partnerov a vyberieme najvýhodnejšiu ponuku pre váš profil. Ozveme sa do 24 hodín.",
  },
  {
    title: "Podpíšete zmluvu online",
    body: "Zmluvu podpíšete elektronicky z pohodlia domova a auto je vaše. Žiadne behanie po pobočkách.",
  },
];

const pillars = [
  { Icon: Clock, title: "Rýchle vybavenie", body: "Schválenie financovania už do 24 hodín od podania žiadosti." },
  { Icon: Car, title: "Na akékoľvek auto", body: "Financovanie z bazárov, portálov aj od súkromníka. Bez obmedzenia značky." },
  { Icon: ShieldCheck, title: "Bez skrytých poplatkov", body: "Všetky podmienky a poplatky vám vysvetlíme dopredu, písomne a jasne." },
  { Icon: FileSignature, title: "Online podpis", body: "Zmluvu podpíšete z domu. Žiadne behanie po pobočkách." },
];

const stats = [
  { value: "15+", label: "rokov skúseností" },
  { value: "5 000+", label: "vybavených klientov" },
  { value: "12", label: "leasing partnerov" },
  { value: "24 h", label: "priemerná doba schválenia" },
];

function TopBar({ scrollToForm, scrolled }) {
  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-200 ${
        scrolled
          ? "bg-white/90 backdrop-blur-md shadow-sm py-2.5"
          : "bg-white py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
        <a href="#top" className="flex items-center gap-2 select-none">
          <div className="w-8 h-8 bg-blue-900 rounded-lg flex items-center justify-center">
            <Car className="w-5 h-5 text-white" strokeWidth={2.4} />
          </div>
          <span className="text-lg sm:text-xl font-extrabold text-blue-900 tracking-tight">
            AutoMesacne<span className="text-blue-500">.sk</span>
          </span>
        </a>

        <div className="hidden md:flex items-center gap-3 text-sm">
          <div className="flex items-center gap-2 text-slate-700">
            <Phone className="w-4 h-4 text-blue-700" />
            <a href="tel:+421911234567" className="font-semibold hover:text-blue-700">+421 911 234 567</a>
          </div>
          <span className="text-slate-300">·</span>
          <div className="flex items-center gap-1.5 text-slate-500">
            <Clock className="w-4 h-4" />
            <span>Po-Pi 8:00 až 17:00</span>
          </div>
        </div>

        <button
          type="button"
          onClick={scrollToForm}
          className="bg-green-600 hover:bg-green-700 text-white font-bold px-4 sm:px-5 py-2.5 rounded-lg transition-colors shadow-md shadow-green-600/20 text-sm sm:text-base"
        >
          Získať ponuku
        </button>
      </div>
    </header>
  );
}

function Hero({ scrollToForm, setCalcPrefill }) {
  return (
    <section className="relative overflow-hidden">
      {/* Subtle bg pattern */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-blue-100/40 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-blue-50/60 blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-10 grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-14 items-start">
        <div className="order-2 lg:order-1">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-900 pl-2 pr-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide">
              <span className="flex gap-0.5 text-amber-500">
                {[0,1,2,3,4].map((i) => (<StarFilled key={i} className="w-3.5 h-3.5" />))}
              </span>
              <span className="tabular-nums">4,9 / 5</span>
              <span className="text-amber-700/80 font-semibold">· hodnotenie klientov</span>
            </div>
            <LiveCounter />
          </div>
          <h1 className="mt-5 text-5xl sm:text-6xl md:text-[3.5rem] lg:text-6xl font-extrabold text-slate-900 leading-[1.05] tracking-tight">
            Auto na splátky <span className="text-blue-900">aj bez akontácie</span>
          </h1>
          <p className="mt-5 text-lg sm:text-xl text-slate-600 leading-relaxed max-w-xl">
            Vybavíme financovanie na akékoľvek auto z celého Slovenska. Stačí poslať link na inzerát. Ponuku máte do 24 hodín.
          </p>

          <ul className="mt-7 space-y-3">
            {[
              "Schválenie do 24 hodín",
              "Bez zbytočných papierov",
              "Online podpis zmluvy",
              "Profesionálny tím expertov",
            ].map((item) => (
              <li key={item} className="flex items-center gap-3 text-slate-800">
                <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                <span className="font-medium">{item}</span>
              </li>
            ))}
          </ul>

          <div className="mt-7 p-4 rounded-xl bg-slate-50 border border-slate-100">
            <div className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2.5">
              Auto z bazáru aj od súkromníka
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
              {sourcePlatforms.map((p, i) => (
                <React.Fragment key={p}>
                  <span className="font-mono text-sm font-semibold text-slate-700">{p}</span>
                  {i < sourcePlatforms.length - 1 && <span className="text-slate-300">·</span>}
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-6 mt-8 pt-7 border-t border-slate-200/60">
            <div>
              <div className="text-3xl font-extrabold text-blue-900">5 000+</div>
              <div className="text-xs text-slate-500 uppercase tracking-wide font-semibold mt-0.5">spokojných klientov</div>
            </div>
            <div className="w-px h-12 bg-slate-200"></div>
            <div>
              <div className="text-3xl font-extrabold text-blue-900">24 h</div>
              <div className="text-xs text-slate-500 uppercase tracking-wide font-semibold mt-0.5">priemerné schválenie</div>
            </div>
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <HeroCalculator scrollToForm={scrollToForm} setCalcPrefill={setCalcPrefill} />
        </div>
      </div>
    </section>
  );
}

function PartnersStrip() {
  return (
    <section className="bg-slate-50 py-12 px-4 sm:px-6 border-y border-slate-100">
      <div className="max-w-7xl mx-auto">
        <p className="text-center text-xs sm:text-sm font-semibold text-slate-500 uppercase tracking-widest mb-7">
          Spolupracujeme s vedúcimi leasing spoločnosťami a bankami
        </p>
        {/* TODO: replace with real partner logos after legal approval */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {PARTNER_LIST.map((p) => (
            <PartnerCard key={p.id} id={p.id} size="sm" />
          ))}
        </div>
      </div>
    </section>
  );
}

function TrustStrip_REMOVED() {
  return null;
}

function LiveCounter() {
  const [count, setCount] = useAState(() => 11 + Math.floor(Math.random() * 6));
  useAEffect(() => {
    const t = setInterval(() => setCount((c) => c + (Math.random() < 0.45 ? 1 : 0)), 9000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="inline-flex items-center gap-2 bg-green-50 text-green-800 px-3 py-1.5 rounded-full text-xs font-bold">
      <span className="relative flex w-2 h-2">
        <span className="absolute inline-flex w-full h-full rounded-full bg-green-400 opacity-60 animate-ping"></span>
        <span className="relative inline-flex w-2 h-2 rounded-full bg-green-500"></span>
      </span>
      <span className="tabular-nums">Dnes: {count} nových žiadostí</span>
    </div>
  );
}

function ExamplePayments({ scrollToForm }) {
  return (
    <section className="bg-white py-20 px-4 sm:px-6 border-t border-slate-100">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">
            Konkrétne príklady splátok
          </h2>
          <p className="mt-3 text-slate-600">
            Ilustračné prepočty pri 20 % akontácii. Vaša ponuka môže byť výhodnejšia.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {paymentExamples.map((e) => (
            <div key={e.car} className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-blue-300 hover:shadow-lg transition-all">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{e.car}</h3>
                  <p className="text-sm text-slate-500 mt-0.5">Ročník {e.year}</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                  <Car className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-5 flex items-end justify-between border-t border-slate-100 pt-5">
                <div>
                  <div className="text-xs text-slate-500 uppercase tracking-wide font-semibold">Cena vozidla</div>
                  <div className="text-base font-bold text-slate-900 mt-0.5 tabular-nums">{e.price.toLocaleString("sk-SK").replace(/,/g, " ")} €</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-500 uppercase tracking-wide font-semibold">Splátka</div>
                  <div className="text-2xl font-extrabold text-blue-900 tabular-nums">od {e.payment} €</div>
                </div>
              </div>
              <div className="mt-3 text-xs text-slate-400">{e.months} mesiacov, 20 % akontácia</div>
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-slate-400 mt-8 max-w-2xl mx-auto">
          Ide o ilustračné príklady. Reálne podmienky sú individuálne a závisia od typu vozidla, vášho profilu a leasing partnera.
        </p>
        <div className="text-center mt-6">
          <button
            type="button"
            onClick={scrollToForm}
            className="inline-flex items-center gap-2 text-blue-900 font-semibold underline underline-offset-4 decoration-2 decoration-blue-300 hover:decoration-blue-700 transition-colors"
          >
            Získať ponuku na moje auto
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}

function HowItWorks({ scrollToForm }) {
  return (
    <section className="bg-white py-20 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">
            Ako to funguje
          </h2>
          <p className="mt-3 text-lg text-slate-600">Tri kroky k novému autu na splátky</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          {steps.map((s, i) => (
            <div key={i} className="relative">
              <div className="w-14 h-14 rounded-xl bg-green-100 text-green-700 flex items-center justify-center text-2xl font-extrabold">
                {i + 1}
              </div>
              <h3 className="mt-5 text-xl font-bold text-slate-900">{s.title}</h3>
              <p className="mt-2 text-slate-600 leading-relaxed">{s.body}</p>
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-7 left-[calc(56px+1.5rem)] right-0 h-0.5 bg-gradient-to-r from-green-200 to-transparent"></div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-14">
          <button
            type="button"
            onClick={scrollToForm}
            className="inline-flex items-center gap-2 text-blue-900 font-semibold underline underline-offset-4 decoration-2 decoration-blue-300 hover:decoration-blue-700 transition-colors"
          >
            Začať teraz
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}

function FormSection({ committedHero, scrollToTop }) {
  return (
    <section
      id="form"
      className="relative py-20 px-4 sm:px-6 bg-gradient-to-br from-blue-900 to-blue-700 overflow-hidden"
    >
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-10 right-10 w-80 h-80 rounded-full bg-blue-500/30 blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-80 h-80 rounded-full bg-blue-400/20 blur-3xl"></div>
      </div>
      <div className="relative">
        <LeadForm committedHero={committedHero} scrollToTop={scrollToTop} />
      </div>
    </section>
  );
}

function WhyUs() {
  return (
    <section className="bg-white py-20 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">
            Prečo si vybrať AutoMesacne.sk
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {pillars.map(({ Icon: PI, title, body }) => (
            <div
              key={title}
              className="p-7 rounded-2xl border border-slate-100 hover:border-blue-200 hover:shadow-lg transition-all bg-white"
            >
              <div className="w-12 h-12 rounded-xl bg-green-100 text-green-700 flex items-center justify-center">
                <PI className="w-6 h-6" />
              </div>
              <h3 className="mt-5 text-lg font-bold text-slate-900">{title}</h3>
              <p className="mt-2 text-slate-600 text-sm leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SocialProof() {
  return (
    <section className="bg-slate-50 py-16 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-4xl md:text-5xl font-extrabold text-blue-900 tabular-nums leading-none">
                {s.value}
              </div>
              <div className="mt-2 text-sm text-slate-600">{s.label}</div>
            </div>
          ))}
        </div>

        {/* TODO: replace placeholder testimonials with real ones from production */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-14">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
              <div className="flex gap-0.5 text-amber-400 mb-3">
                {[0, 1, 2, 3, 4].map((j) => (
                  <StarFilled key={j} className="w-4 h-4" />
                ))}
              </div>
              <p className="text-slate-700 leading-relaxed">"{t.text}"</p>
              <div className="mt-4 pt-4 border-t border-slate-100 text-sm">
                <span className="font-semibold text-slate-900">{t.name}</span>
                <span className="text-slate-500">, {t.city}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PartnersFull({ scrollToForm }) {
  return (
    <section className="bg-white py-20 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">
            Naši leasing partneri
          </h2>
          <p className="mt-4 text-lg text-slate-600 leading-relaxed">
            Spolupracujeme s najvýznamnejšími leasing spoločnosťami a bankami na slovenskom trhu. Vďaka tomu vám vieme ponúknuť najvýhodnejšie podmienky.
          </p>
        </div>
        {/* TODO: replace with real partner logos after legal approval */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
          {PARTNER_LIST.map((p) => (
            <PartnerCard key={p.id} id={p.id} size="lg" />
          ))}
        </div>
        <div className="text-center mt-12">
          <button
            type="button"
            onClick={scrollToForm}
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold px-7 py-4 rounded-xl transition-colors shadow-lg shadow-green-600/20"
          >
            Získať individuálnu ponuku
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}

function FinalCTA({ scrollToForm }) {
  const timeline = [
    { when: "Do 24 hodín", what: "Ozve sa vám náš špecialista a doladí detaily", Icon: Phone },
    { when: "Do 48 hodín", what: "Pripravíme porovnanie ponúk od leasing partnerov", Icon: FileSignature },
    { when: "Do týždňa", what: "Podpíšete zmluvu online a auto je vaše", Icon: Car },
  ];
  return (
    <section className="bg-gradient-to-br from-blue-900 to-blue-600 py-20 px-4 sm:px-6 relative overflow-hidden">
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-blue-400/30 blur-3xl"></div>
      </div>
      <div className="relative max-w-5xl mx-auto">
        <div className="text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">
            Pošlite nám auto. O zvyšok sa postaráme my.
          </h2>
          <p className="mt-4 text-lg sm:text-xl text-blue-100">
            Tu je, čo sa stane po odoslaní žiadosti:
          </p>
        </div>

        <ol className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5 relative">
          {timeline.map((t, i) => (
            <li key={i} className="relative bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-green-500 text-white flex items-center justify-center font-extrabold">
                  {i + 1}
                </div>
                <div className="text-green-300 font-bold text-sm uppercase tracking-wide">{t.when}</div>
              </div>
              <p className="text-white text-base leading-relaxed">{t.what}</p>
              {i < timeline.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-2.5 z-10">
                  <div className="w-5 h-5 rounded-full bg-blue-700 border-2 border-blue-400 flex items-center justify-center">
                    <ChevronRight className="w-3 h-3 text-white" strokeWidth={3} />
                  </div>
                </div>
              )}
            </li>
          ))}
        </ol>

        <div className="text-center mt-12">
          <button
            type="button"
            onClick={scrollToForm}
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold text-lg px-8 py-4 rounded-xl transition-colors shadow-xl shadow-green-900/30"
          >
            Získať ponuku zadarmo
            <ArrowRight className="w-5 h-5" />
          </button>
          <p className="mt-4 text-sm text-blue-200">Vyplnenie trvá 2 minúty. Bez záväzkov.</p>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Car className="w-5 h-5 text-white" strokeWidth={2.4} />
              </div>
              <span className="text-lg font-extrabold text-white">
                AutoMesacne<span className="text-blue-400">.sk</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
              Financovanie auta z celého Slovenska. Rýchlo, online, bez papierovania.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-3 text-sm uppercase tracking-wider">Kontakt</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-400" />
                <a href="tel:+421911234567" className="hover:text-white">+421 911 234 567</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400" />
                <a href="mailto:info@automesacne.sk" className="hover:text-white">info@automesacne.sk</a>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-400" />
                <span>Po-Pi 8:00 až 17:00</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-3 text-sm uppercase tracking-wider">Spoločnosť</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>IČO: 00 000 000</li>
              <li>Sídlo: Bratislava, Slovensko</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-3 text-sm uppercase tracking-wider">Právne</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white">Ochrana osobných údajov</a></li>
              <li><a href="#" className="hover:text-white">Spracovanie cookies</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-800 text-sm text-slate-500 text-center">
          © 2026 AutoMesacne.sk. Všetky práva vyhradené.
        </div>
      </div>
    </footer>
  );
}

function FloatingDesktopCTA({ visible, scrollToForm }) {
  return (
    <button
      type="button"
      onClick={scrollToForm}
      aria-label="Získať ponuku"
      className={`hidden md:flex fixed bottom-6 right-6 z-30 items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold px-5 py-3.5 rounded-full shadow-2xl shadow-green-900/40 transition-all duration-300 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 pointer-events-none translate-y-4"
      }`}
    >
      Získať ponuku
      <ArrowRight className="w-4 h-4" />
    </button>
  );
}

function MobileBottomCTA({ visible, scrollToForm }) {
  return (
    <div
      className={`md:hidden fixed inset-x-0 bottom-0 z-30 bg-white border-t border-slate-200 p-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] transition-transform duration-300 ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <button
        type="button"
        onClick={scrollToForm}
        className="w-full bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-bold py-3.5 rounded-xl transition-colors"
      >
        Získať ponuku zadarmo
      </button>
    </div>
  );
}

function App() {
  const [scrolled, setScrolled] = useAState(false);
  const [showFloating, setShowFloating] = useAState(false);
  const [formInView, setFormInView] = useAState(false);

  // Live hero data (updated on every slider/input change in HeroCalculator).
  // We keep this in a ref so updates don't re-render App on each keystroke.
  const heroDataRef = React.useRef({
    carUrl: "",
    carPrice: 15000,
    downPct: 20,
    monthly: 0,
    months: 60,
    downPayment: 0,
  });
  // Committed snapshot: set when the user clicks any CTA that scrolls to the form.
  // The form prefills empty fields from this snapshot.
  const [committedHero, setCommittedHero] = useAState(null);

  const setCalcPrefill = useACallback((data) => {
    heroDataRef.current = data;
  }, []);

  const scrollToForm = useACallback(() => {
    setCommittedHero({ ...heroDataRef.current });
    const el = document.getElementById("form");
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 20;
      window.scrollTo({ top, behavior: "smooth" });
    }
  }, []);

  const scrollToTop = useACallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useAEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10);
      const doc = document.documentElement;
      const pct = window.scrollY / Math.max(1, doc.scrollHeight - window.innerHeight);
      setShowFloating(pct > 0.3);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useAEffect(() => {
    const el = document.getElementById("form");
    if (!el || !("IntersectionObserver" in window)) return;
    const obs = new IntersectionObserver(
      ([entry]) => setFormInView(entry.isIntersecting),
      { threshold: 0.05 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div id="top" className="bg-white text-slate-900 min-h-screen">
      <TopBar scrollToForm={scrollToForm} scrolled={scrolled} />
      <main>
        <Hero scrollToForm={scrollToForm} setCalcPrefill={setCalcPrefill} />
        <PartnersStrip />
        <HowItWorks scrollToForm={scrollToForm} />
        <ExamplePayments scrollToForm={scrollToForm} />
        <FormSection committedHero={committedHero} scrollToTop={scrollToTop} />
        <WhyUs />
        <SocialProof />
        <PartnersFull scrollToForm={scrollToForm} />
        <FAQSection />
        <FinalCTA scrollToForm={scrollToForm} />
      </main>
      <Footer />
      {/* Spacer so mobile sticky CTA doesn't cover footer text */}
      <div className="md:hidden h-20" aria-hidden="true"></div>

      <FloatingDesktopCTA visible={showFloating && !formInView} scrollToForm={scrollToForm} />
      <MobileBottomCTA visible={!formInView} scrollToForm={scrollToForm} />
      <CallbackWidget />
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
