// Referencie page
const { useState: useRState, useMemo: useRMemo } = React;

const REVIEWS = [
  {
    name: "Marek K.",
    city: "Bratislava",
    car: "Škoda Octavia 2020",
    type: "Osobné",
    partner: "VÚB Leasing",
    date: "Marec 2026",
    rating: 5,
    text: "Vybavili mi leasing za necelý deň. Profesionálny prístup, žiadne zbytočné telefonáty. Splátku som dostal nižšiu, ako som očakával.",
    color: "from-blue-400 to-indigo-500",
  },
  {
    name: "Jana B.",
    city: "Trnava",
    car: "VW Tiguan 2019",
    type: "SUV",
    partner: "Cofidis",
    date: "Február 2026",
    rating: 5,
    text: "Žiadne papierovanie. Všetko som vybavila online z gauča. Komunikácia perfektná, na všetko mi odpovedali do hodiny.",
    color: "from-emerald-400 to-teal-500",
  },
  {
    name: "Tomáš H.",
    city: "Žilina",
    car: "BMW radu 3 2021",
    type: "Osobné",
    partner: "Porsche Finance",
    date: "Január 2026",
    rating: 5,
    text: "Splátka aj bez akontácie, presne ako sľubovali. Iné firmy ma odmietli s tým, že auto je staré. Tu mi vybavili financovanie za dva dni.",
    color: "from-amber-400 to-orange-500",
  },
  {
    name: "Lucia M.",
    city: "Košice",
    car: "Ford Transit 2018",
    type: "Dodávky",
    partner: "Essox",
    date: "Január 2026",
    rating: 5,
    text: "Pre firmu sme potrebovali dodávku rýchlo. Zvládli to za 36 hodín od podpisu žiadosti až po podpis zmluvy. Odporúčam.",
    color: "from-rose-400 to-pink-500",
  },
  {
    name: "Peter D.",
    city: "Banská Bystrica",
    car: "Honda CB500F 2022",
    type: "Motorky",
    partner: "Home Credit",
    date: "December 2025",
    rating: 5,
    text: "Motorka na splátky bez problémov. V banke ma odmietli, tu si pozreli môj profil a dokázali nájsť partnera, ktorý mi vyhovel.",
    color: "from-violet-400 to-purple-500",
  },
  {
    name: "Andrea Š.",
    city: "Nitra",
    car: "Hyundai Kona 2021",
    type: "SUV",
    partner: "VÚB Leasing",
    date: "December 2025",
    rating: 5,
    text: "Najprv som mala obavy, či to nie je nejaký podvod, lebo to bolo také jednoduché. Všetko v poriadku, auto mám, splátky idú podľa plánu.",
    color: "from-cyan-400 to-blue-500",
  },
  {
    name: "Martin P.",
    city: "Prešov",
    car: "Škoda Fabia 2017",
    type: "Osobné",
    partner: "Cofidis",
    date: "November 2025",
    rating: 5,
    text: "Auto z bazáru, ojazdené, štyri majitelia. Iní leasingovia ma poslali preč. Tu mi vyšli v ústrety a financovanie schválili.",
    color: "from-lime-400 to-green-500",
  },
  {
    name: "Zuzana V.",
    city: "Trenčín",
    car: "Renault Master 2020",
    type: "Dodávky",
    partner: "Porsche Finance",
    date: "November 2025",
    rating: 5,
    text: "Veľká dodávka pre podnikanie. Pomohli mi aj s výberom partnera, ktorý ponúkol najlepšie podmienky pre firmy. Odporúčam každému živnostníkovi.",
    color: "from-fuchsia-400 to-pink-500",
  },
  {
    name: "Daniel K.",
    city: "Bratislava",
    car: "Audi A4 2019",
    type: "Osobné",
    partner: "Essox",
    date: "Október 2025",
    rating: 5,
    text: "Druhýkrát som tu kúpil auto na splátky. Stálemu klientovi vždy nájdu výhodnejšie podmienky. Komunikácia bez problémov.",
    color: "from-sky-400 to-blue-500",
  },
];

const FILTERS = ["Všetky", "Osobné", "SUV", "Dodávky", "Motorky"];

function ReferencieHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50/40 border-b border-slate-100">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-blue-100/40 blur-3xl"></div>
      </div>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-20 sm:py-24 text-center">
        <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-900 pl-2 pr-4 py-2 rounded-full text-sm font-bold mb-6">
          <span className="flex gap-0.5 text-amber-500">
            {[0,1,2,3,4].map((i) => (<StarFilled key={i} className="w-4 h-4" />))}
          </span>
          <span className="tabular-nums">4,9 z 5</span>
          <span className="text-amber-700/80">· 800+ recenzií</span>
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 leading-[1.05] tracking-tight">
          Klienti, ktorí <span className="text-blue-900">si vybrali nás.</span>
        </h1>
        <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
          Skutočné príbehy ľudí, ktorí cez nás vybavili financovanie auta. Bez upraveného textu, bez výberu len pozitívnych.
        </p>
      </div>
    </section>
  );
}

function ReviewsGrid() {
  const [filter, setFilter] = useRState("Všetky");
  const filtered = useRMemo(
    () => filter === "Všetky" ? REVIEWS : REVIEWS.filter(r => r.type === filter),
    [filter]
  );

  return (
    <section className="bg-white py-16 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                filter === f
                  ? "bg-blue-900 text-white shadow-md shadow-blue-900/20"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((r, i) => (
            <article key={i} className="bg-white rounded-2xl border border-slate-200 p-6 hover:border-blue-300 hover:shadow-lg transition-all flex flex-col">
              <div className={`w-full h-32 rounded-xl bg-gradient-to-br ${r.color} flex items-center justify-center mb-5 relative overflow-hidden`}>
                <Car className="w-16 h-16 text-white/80" />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/95 text-xs font-bold text-slate-800">
                  {r.type}
                </div>
              </div>

              <div className="flex gap-0.5 text-amber-400 mb-3">
                {Array.from({ length: r.rating }).map((_, j) => (
                  <StarFilled key={j} className="w-4 h-4" />
                ))}
              </div>

              <p className="text-slate-700 leading-relaxed text-sm flex-1">"{r.text}"</p>

              <div className="mt-5 pt-5 border-t border-slate-100">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="font-semibold text-slate-900 text-sm">{r.name}</div>
                  <div className="text-xs text-slate-500">{r.date}</div>
                </div>
                <div className="flex items-center gap-2 flex-wrap text-xs text-slate-500">
                  <span>{r.city}</span>
                  <span className="text-slate-300">·</span>
                  <span>{r.car}</span>
                </div>
                <div className="mt-3">
                  <span className="inline-block px-2.5 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-semibold">
                    {r.partner}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-slate-500">
            Pre tento filter zatiaľ nemáme zobrazené referencie.
          </div>
        )}
      </div>
    </section>
  );
}

function GallerySection() {
  const cards = [
    { from: "from-blue-500", to: "to-indigo-600", label: "Škoda" },
    { from: "from-emerald-500", to: "to-teal-600", label: "VW" },
    { from: "from-amber-500", to: "to-orange-600", label: "BMW" },
    { from: "from-rose-500", to: "to-pink-600", label: "Ford" },
    { from: "from-violet-500", to: "to-purple-600", label: "Honda" },
    { from: "from-cyan-500", to: "to-blue-600", label: "Hyundai" },
    { from: "from-lime-500", to: "to-green-600", label: "Renault" },
    { from: "from-fuchsia-500", to: "to-pink-600", label: "Audi" },
  ];
  return (
    <section className="bg-slate-50 py-20 px-4 sm:px-6 border-y border-slate-100">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="text-xs font-bold uppercase tracking-widest text-blue-700 mb-3">Z našej praxe</div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">Vozidlá, ktoré sme financovali</h2>
          <p className="mt-3 text-slate-600 max-w-2xl mx-auto">Výber z posledných mesiacov. Osobné, SUV, dodávky aj motorky.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {cards.map((c, i) => (
            <div key={i} className={`aspect-[4/3] rounded-2xl bg-gradient-to-br ${c.from} ${c.to} relative overflow-hidden flex items-center justify-center group cursor-pointer`}>
              <Car className="w-20 h-20 text-white/70 group-hover:scale-110 transition-transform" />
              <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between text-white">
                <span className="font-bold text-lg">{c.label}</span>
                <Search className="w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function VideoTestimonial() {
  return (
    <section className="bg-white py-20 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <div className="text-xs font-bold uppercase tracking-widest text-blue-700 mb-3">Video príbeh</div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">Marek, klient z Bratislavy</h2>
          <p className="mt-3 text-slate-600">Ako prebiehalo financovanie krok za krokom. (Doplníme reálne video.)</p>
        </div>
        <div className="relative aspect-video rounded-3xl overflow-hidden bg-gradient-to-br from-blue-900 to-blue-700 shadow-xl">
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              type="button"
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white/95 hover:bg-white text-blue-900 flex items-center justify-center shadow-2xl transition-all hover:scale-105"
              aria-label="Prehrať video"
            >
              <Play className="w-9 h-9 sm:w-11 sm:h-11 ml-1" />
            </button>
          </div>
          <div className="absolute bottom-6 left-6 right-6 text-white">
            <div className="text-xs font-bold uppercase tracking-widest text-blue-200 mb-1">Klient · 02:14</div>
            <div className="text-xl font-bold">"Vybavili mi auto za jeden deň. Bez papierovania, bez stresu."</div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ReferencieCTA() {
  return (
    <section className="bg-gradient-to-br from-blue-900 to-blue-600 py-20 px-4 sm:px-6 relative overflow-hidden">
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-blue-400/30 blur-3xl"></div>
      </div>
      <div className="relative max-w-3xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">
          Pridajte sa k 800+ klientom
        </h2>
        <p className="mt-4 text-lg text-blue-100">
          Stačia tri minúty na vyplnenie žiadosti. Ponuku máte do 24 hodín.
        </p>
        <a
          href="/#form"
          className="inline-flex items-center gap-2 mt-7 bg-green-600 hover:bg-green-700 text-white font-bold px-7 py-4 rounded-xl transition-colors shadow-xl shadow-green-900/30"
        >
          Získať vlastnú ponuku
          <ArrowRight className="w-5 h-5" />
        </a>
      </div>
    </section>
  );
}

function ReferencieApp() {
  return (
    <div className="bg-white text-slate-900 min-h-screen">
      <SiteNav active="referencie" />
      <main>
        <ReferencieHero />
        <ReviewsGrid />
        <GallerySection />
        <VideoTestimonial />
        <ReferencieCTA />
      </main>
      <SiteFooter />
      <CallbackWidget />
    </div>
  );
}

const referencieRoot = ReactDOM.createRoot(document.getElementById("root"));
referencieRoot.render(<ReferencieApp />);
