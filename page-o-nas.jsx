// O nás page
const TIMELINE = [
  { year: "2010", title: "Začiatok", body: "Otvárame malú kanceláriu v Bratislave so zameraním na sprostredkovanie leasingu pre fyzické osoby." },
  { year: "2014", title: "Prvý online klient", body: "Spúšťame internú aplikáciu na vybavenie financovania bez papierov. Klient ani raz nemusí prísť do kancelárie." },
  { year: "2018", title: "Sieť partnerov", body: "Rozširujeme sieť spolupracujúcich leasingoviek na päť hráčov a získavame výhodnejšie podmienky pre klientov." },
  { year: "2022", title: "AutoMesacne.sk", body: "Spúšťame značku AutoMesacne.sk a kalkulačku splátok. Cieľ: zrýchliť schvaľovanie na 24 hodín." },
  { year: "2026", title: "Dnes", body: "Vybavili sme financovanie pre viac ako 800 klientov z celého Slovenska. Spolupracujeme so šiestimi leasingovkami." },
];

const TEAM = [
  { initials: "PŠ", name: "Peter Šimko", role: "Konateľ", bio: "15 rokov v leasingovom biznise. Predtým pracoval pre dve veľké leasingové spoločnosti na pozícii senior konzultanta.", color: "bg-blue-100 text-blue-800" },
  { initials: "ML", name: "Mária Lukáčová", role: "Vedúca financovania", bio: "Špecialistka na úvery pre fyzické osoby. Klienta prevedie celou žiadosťou od cenovej ponuky až po podpis.", color: "bg-green-100 text-green-800" },
  { initials: "TK", name: "Tomáš Kovács", role: "Špecialista na ojazdené autá", bio: "Pozná podmienky všetkých partnerov pre vozidlá staršie ako 10 rokov. Nájde riešenie aj tam, kde iní povedia nie.", color: "bg-amber-100 text-amber-800" },
  { initials: "AB", name: "Adriana Bartošová", role: "Customer success", bio: "Stará sa o existujúcich klientov a podporu po podpise zmluvy. Vie poradiť s predčasným splatením aj zmenou splátkového kalendára.", color: "bg-rose-100 text-rose-800" },
];

const VALUES = [
  { Icon: Clock, title: "Rýchlosť", body: "Schválenie financovania do 24 hodín. Žiadne dni čakania ani telefonáty bez konca." },
  { Icon: HeartHandshake, title: "Férovosť", body: "Vždy vám povieme aj to, čo nechcete počuť. Ak na váš profil ponuka nesedí, dáme to vedieť na začiatku." },
  { Icon: ShieldCheck, title: "Transparentnosť", body: "Všetky poplatky a podmienky dostanete na papieri vopred. Žiadne prekvapenia v zmluve." },
  { Icon: Award, title: "Profesionalita", body: "15+ rokov skúseností v leasingu. Vieme, kde má každý partner svoje silné stránky a kde nie." },
];

function ONasHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50/40 border-b border-slate-100">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-blue-100/40 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-blue-50/60 blur-3xl"></div>
      </div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-24 text-center">
        <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-900 pl-2 pr-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide mb-6">
          <span className="flex gap-0.5 text-amber-500">
            {[0,1,2,3,4].map((i) => (<StarFilled key={i} className="w-3.5 h-3.5" />))}
          </span>
          <span className="tabular-nums">15 rokov · 800+ klientov</span>
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 leading-[1.05] tracking-tight max-w-4xl mx-auto">
          Financovanie áut <span className="text-blue-900">bez zbytočných</span> komplikácií.
        </h1>
        <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto">
          Sme tím ľudí, ktorý už pätnásť rokov pomáha Slovákom kupovať autá na splátky. Bez papierovania, bez behania po pobočkách, bez prekvapení v zmluve.
        </p>
      </div>
    </section>
  );
}

function StoryTimeline() {
  return (
    <section className="bg-white py-20 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <div className="text-xs font-bold uppercase tracking-widest text-blue-700 mb-3">Náš príbeh</div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">
            Pätnásť rokov na trhu
          </h2>
          <p className="mt-4 text-slate-600 max-w-2xl mx-auto">
            Začali sme ako malá kancelária. Dnes spolupracujeme so šiestimi leasingovkami a vybavili sme viac ako 800 financovaní.
          </p>
        </div>

        <ol className="relative border-l-2 border-blue-100 ml-4 sm:ml-10">
          {TIMELINE.map((t, i) => (
            <li key={i} className="mb-10 ml-6 sm:ml-10">
              <div className="absolute -left-[11px] w-5 h-5 rounded-full bg-blue-900 border-4 border-white shadow-md"></div>
              <div className="text-sm font-bold text-blue-700 mb-1 tabular-nums">{t.year}</div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">{t.title}</h3>
              <p className="text-slate-600 leading-relaxed">{t.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function NumbersInPractice() {
  const stats = [
    { value: "800+", label: "vybavených klientov" },
    { value: "24 h", label: "priemerné schválenie" },
    { value: "6", label: "leasing partnerov" },
    { value: "15+", label: "rokov skúseností" },
  ];
  return (
    <section className="bg-slate-50 py-16 px-4 sm:px-6 border-y border-slate-100">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">Čísla, na ktoré sa môžete spoľahnúť</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center bg-white rounded-2xl p-7 border border-slate-100">
              <div className="text-4xl md:text-5xl font-extrabold text-blue-900 tabular-nums leading-none">
                {s.value}
              </div>
              <div className="mt-3 text-sm text-slate-600 font-medium">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TeamSection() {
  return (
    <section className="bg-white py-20 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <div className="text-xs font-bold uppercase tracking-widest text-blue-700 mb-3">Náš tím</div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">
            Ľudia, s ktorými budete jednať
          </h2>
          <p className="mt-4 text-slate-600 max-w-2xl mx-auto">
            Nie call centrum. Štyria ľudia, ktorí osobne prevezmú váš prípad a stoja za ním.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TEAM.map((m) => (
            <div key={m.name} className="bg-white rounded-2xl border border-slate-200 p-6 hover:border-blue-300 hover:shadow-lg transition-all">
              <div className={`w-20 h-20 rounded-2xl ${m.color} flex items-center justify-center text-2xl font-extrabold mb-5`}>
                {m.initials}
              </div>
              <h3 className="text-lg font-bold text-slate-900">{m.name}</h3>
              <div className="text-sm font-semibold text-blue-700 mt-0.5">{m.role}</div>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">{m.bio}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ValuesSection() {
  return (
    <section className="bg-slate-50 py-20 px-4 sm:px-6 border-y border-slate-100">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <div className="text-xs font-bold uppercase tracking-widest text-blue-700 mb-3">Naše hodnoty</div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">
            Na čom nám záleží
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {VALUES.map(({ Icon: VI, title, body }) => (
            <div key={title} className="bg-white p-7 rounded-2xl border border-slate-100 hover:border-blue-200 hover:shadow-lg transition-all">
              <div className="w-12 h-12 rounded-xl bg-green-100 text-green-700 flex items-center justify-center">
                <VI className="w-6 h-6" />
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

function PartnersOnAbout() {
  return (
    <section className="bg-white py-20 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <div className="text-xs font-bold uppercase tracking-widest text-blue-700 mb-3">Naši partneri</div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">
            Spolupracujeme s lídrami trhu
          </h2>
          <p className="mt-4 text-slate-600 leading-relaxed">
            Šesť leasingoviek a bánk. Vďaka tomu vieme porovnávať a vyberať pre vás najvýhodnejšie podmienky.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
          {PARTNER_LIST.map((p) => (
            <PartnerCard key={p.id} id={p.id} size="lg" />
          ))}
        </div>
      </div>
    </section>
  );
}

function LicensesSection() {
  return (
    <section className="bg-slate-50 py-16 px-4 sm:px-6 border-y border-slate-100">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6 items-start">
          <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Licencovaný sprostredkovateľ</h2>
            <p className="mt-3 text-slate-600 leading-relaxed">
              Sme zapísaní v registri samostatných finančných agentov Národnej banky Slovenska. Pôsobíme v zmysle zákona č. 186/2009 Z. z. o finančnom sprostredkovaní a finančnom poradenstve. Vašu žiadosť o financovanie spracúvame v rámci legislatívneho rámca, s ochranou osobných údajov podľa GDPR.
            </p>
            <div className="mt-5 flex flex-wrap gap-3 text-xs">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 text-blue-800 font-semibold">
                <Check className="w-3.5 h-3.5" /> NBS registrácia
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 text-blue-800 font-semibold">
                <Check className="w-3.5 h-3.5" /> GDPR compliant
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 text-blue-800 font-semibold">
                <Check className="w-3.5 h-3.5" /> Poistenie zodpovednosti
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ONasCTA() {
  return (
    <section className="bg-gradient-to-br from-blue-900 to-blue-600 py-20 px-4 sm:px-6 relative overflow-hidden">
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-blue-400/30 blur-3xl"></div>
      </div>
      <div className="relative max-w-3xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">
          Pripravený začať?
        </h2>
        <p className="mt-4 text-lg text-blue-100">
          Stačí poslať link na auto. Ponuku máte do 24 hodín.
        </p>
        <a
          href="/#form"
          className="inline-flex items-center gap-2 mt-7 bg-green-600 hover:bg-green-700 text-white font-bold px-7 py-4 rounded-xl transition-colors shadow-xl shadow-green-900/30"
        >
          Získať ponuku zadarmo
          <ArrowRight className="w-5 h-5" />
        </a>
      </div>
    </section>
  );
}

function ONasApp() {
  return (
    <div className="bg-white text-slate-900 min-h-screen">
      <SiteNav active="o-nas" />
      <main>
        <ONasHero />
        <StoryTimeline />
        <NumbersInPractice />
        <TeamSection />
        <ValuesSection />
        <PartnersOnAbout />
        <LicensesSection />
        <ONasCTA />
      </main>
      <SiteFooter />
    </div>
  );
}

const oNasRoot = ReactDOM.createRoot(document.getElementById("root"));
oNasRoot.render(<ONasApp />);
