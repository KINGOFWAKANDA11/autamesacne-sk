// Referencie page
const { useState: useRState, useMemo: useRMemo } = React;

const REVIEWS = [
  {
    name: "Richard",
    city: "Bratislava",
    car: "Lamborghini Huracán",
    type: "Prémiové",
    date: "Máj 2026",
    rating: 5,
    photo: "/img/lamborghini.jpg",
    text: "Vždy som sníval o Lamborghini, ale myslel som si, že financovanie takého auta bude nereálne. Oslovil som viac spoločností a všade som dostal komplikované odpovede alebo vysoké podmienky. Na automesacne.sk sa na moju situáciu pozreli individuálne, všetko mi vysvetlili a nakoniec sa podarilo vybaviť financovanie. Celý proces bol oveľa profesionálnejší a normálnejší, než som čakal.",
    color: "from-slate-700 to-slate-900",
  },
  {
    name: "Jakub a Simona",
    city: "Trenčín",
    car: "Rodinné SUV",
    type: "SUV",
    date: "Máj 2026",
    rating: 5,
    photo: "/img/mercedes-gle-rodina.jpg",
    text: "Čakali sme druhé dieťa a staré auto nám už nestačilo. Potrebovali sme väčšie SUV, ale nechceli sme minúť všetky úspory. Financovanie nám nastavili tak, aby sme mali rozumnú mesačnú splátku a zároveň bezpečné auto pre rodinu.",
    color: "from-blue-600 to-indigo-700",
  },
  {
    name: "Denis",
    city: "Nitra",
    car: "BMW M4 Competition",
    type: "Prémiové",
    date: "Apríl 2026",
    rating: 5,
    photo: "/img/bmw-m4.jpg",
    text: "Chcel som športové auto, ale nechcel som vložiť veľkú hotovosť naraz. Nakoniec sme nastavili financovanie tak, aby mi zostala aj finančná rezerva.",
    color: "from-zinc-700 to-zinc-900",
  },
  {
    name: "Tomáš",
    city: "Žilina",
    car: "Porsche Cayenne",
    type: "SUV",
    date: "Apríl 2026",
    rating: 5,
    photo: "/img/porsche-cayenne.jpg",
    text: "Chcel som reprezentatívne auto na firmu, ale zároveň rozumné mesačné splátky. Celý proces bol rýchly a bez komplikácií.",
    color: "from-slate-400 to-slate-600",
  },
  {
    name: "Richard Simonics",
    city: "Nesvady",
    car: "Buggy z Nemecka",
    type: "Špeciálne",
    date: "Apríl 2026",
    rating: 5,
    photo: "/img/buggy.jpg",
    text: "Mojím snom bol poriadny Buggy na leto a dlhšie som hľadal niečo výnimočné. Nakoniec sa podarilo nájsť presne ten model, ktorý som chcel, dokonca ho vedeli zabezpečiť až z Nemecka. Úprimne som čakal komplikácie, ale všetko prebehlo úplne hladko. Celé leto máme o zábavu postarané.",
    color: "from-green-600 to-emerald-700",
  },
  {
    name: "Marek",
    city: "Prešov",
    car: "Dodávka Fiat Ducato",
    type: "Dodávky",
    date: "Marec 2026",
    rating: 5,
    photo: "/img/dodavka-fiat.jpg",
    text: "Bez dodávky by som nevedel fungovať. Potreboval som ju rýchlo a nechcel som vybrať všetky peniaze z firmy naraz. Financovanie vybavili bez problémov.",
    color: "from-blue-700 to-blue-900",
  },
  {
    name: "Adrián",
    city: "Trnava",
    car: "Audi RS6",
    type: "Prémiové",
    date: "Március 2026",
    rating: 5,
    photo: "/img/audi-rs6.jpg",
    text: "RS6 bol môj sen už veľmi dlho. Mal som obavy, či bude možné nastaviť rozumné financovanie, ale nakoniec to vyšlo lepšie, než som čakal.",
    color: "from-slate-600 to-slate-800",
  },
  {
    name: "Michal",
    city: "Košice",
    car: "BMW M3 Touring",
    type: "Prémiové",
    date: "Február 2026",
    rating: 5,
    photo: "/img/bmw-m3-touring.jpg",
    text: "Chcel som reprezentatívne auto pre podnikanie, ale zároveň rozumné mesačné náklady. Financovanie bolo nastavené presne podľa mojich predstáv.",
    color: "from-gray-500 to-gray-700",
  },
  {
    name: "Samuel",
    city: "Martin",
    car: "Motorka BMW GS",
    type: "Motorky",
    date: "Február 2026",
    rating: 5,
    photo: "/img/bmw-gs.jpg",
    text: "Silnejšiu motorku som chcel už roky, ale stále boli dôležitejšie výdavky. Nakoniec som sa rozhodol riešiť financovanie a všetko prebehlo veľmi rýchlo. Páčilo sa mi, že komunikácia bola normálna a bez zbytočného nátlaku.",
    color: "from-zinc-600 to-zinc-800",
  },
  {
    name: "Lukáš",
    city: "Senica",
    car: "Yamaha MT-07",
    type: "Motorky",
    date: "Február 2026",
    rating: 5,
    photo: "/img/yamaha-mt07.jpg",
    text: "Motorka bol môj dlhoročný sen. Financovanie bolo jednoduchšie, než som si myslel. Veľmi sa mi páčil normálny prístup bez nátlaku.",
    color: "from-slate-300 to-slate-500",
  },
  {
    name: "Ladislav Papp",
    city: "Modrany",
    car: "Nissan Navara",
    type: "Dodávky",
    date: "Január 2026",
    rating: 5,
    photo: "/img/nissan-navara.jpg",
    text: "Do našej betónovej firmy sme potrebovali spoľahlivé pracovné auto. Aj keď išlo o staršiu Nissan Navara z roku 2010, podarilo sa vybaviť veľmi dobré financovanie s rozumnou mesačnou splátkou. Za pár dní bolo všetko vybavené.",
    color: "from-slate-200 to-slate-400",
  },
  {
    name: "Jozef",
    city: "Humenné",
    car: "Minibager JCB",
    type: "Pracovné stroje",
    date: "Január 2026",
    rating: 5,
    photo: "/img/jcb-bager.jpg",
    text: "Potrebovali sme nový minibager, pretože bez techniky dnes firma nevie fungovať. Myslel som si, že vybaviť financovanie na pracovný stroj bude komplikované, ale nakoniec to išlo oveľa jednoduchšie.",
    color: "from-yellow-500 to-amber-600",
  },
  {
    name: "Štefan",
    city: "Rimavská Sobota",
    car: "Traktor John Deere",
    type: "Pracovné stroje",
    date: "December 2025",
    rating: 5,
    photo: "/img/traktor.jpg",
    text: "Potrebovali sme novší traktor, pretože starý už nestačil. Veľmi nám pomohlo, že sme nemuseli zaplatiť všetko naraz. Celý proces prebehol rýchlo a profesionálne.",
    color: "from-green-700 to-green-900",
  },
  {
    name: "Filip a Viktória",
    city: "Zvolen",
    car: "Osobné vozidlo",
    type: "Osobné",
    date: "November 2025",
    rating: 5,
    photo: "/img/vw-tiguan.jpg",
    text: "Obaja sme pracovali, ale nemali sme našetrené desaťtisíce eur. Financovanie nám veľmi pomohlo a dnes máme spoľahlivé auto do práce aj na cestovanie.",
    color: "from-teal-500 to-teal-700",
  },
];

const FILTERS = ["Všetky", "Osobné", "SUV", "Prémiové", "Dodávky", "Motorky", "Pracovné stroje", "Špeciálne"];

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
              <div className={`w-full h-40 rounded-xl overflow-hidden mb-5 relative ${!r.photo ? `bg-gradient-to-br ${r.color} flex items-center justify-center` : ''}`}>
                {r.photo
                  ? <img src={r.photo} alt={r.car} className="w-full h-full object-cover" />
                  : <Car className="w-16 h-16 text-white/80" />
                }
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
                {r.partner && (
                  <div className="mt-3">
                    <span className="inline-block px-2.5 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-semibold">
                      {r.partner}
                    </span>
                  </div>
                )}
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
  const photos = [
    { src: "/img/lamborghini.jpg", label: "Lamborghini Huracán" },
    { src: "/img/porsche-cayenne.jpg", label: "Porsche Cayenne" },
    { src: "/img/bmw-m4.jpg", label: "BMW M4 Competition" },
    { src: "/img/audi-rs6.jpg", label: "Audi RS6" },
    { src: "/img/bmw-m3-touring.jpg", label: "BMW M3 Touring" },
    { src: "/img/mercedes-gle-rodina.jpg", label: "Mercedes GLE" },
    { src: "/img/dodavka-fiat.jpg", label: "Fiat Ducato" },
    { src: "/img/buggy.jpg", label: "Buggy" },
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
          {photos.map((p, i) => (
            <div key={i} className="aspect-[4/3] rounded-2xl overflow-hidden relative group cursor-pointer">
              <img src={p.src} alt={p.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-3 left-3 right-3 text-white font-bold text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                {p.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function VideoTestimonial() {
  const videoRef = React.useRef(null);
  const [playing, setPlaying] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [duration, setDuration] = React.useState(0);
  const [muted, setMuted] = React.useState(false);
  const [showControls, setShowControls] = React.useState(true);
  const hideTimer = React.useRef(null);

  const formatTime = (s) => {
    if (!s || isNaN(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play(); setPlaying(true); }
    else { v.pause(); setPlaying(false); }
  };

  const handleTimeUpdate = () => {
    const v = videoRef.current;
    if (!v) return;
    setProgress(v.currentTime);
  };

  const handleLoaded = () => {
    const v = videoRef.current;
    if (v) setDuration(v.duration);
  };

  const handleSeek = (e) => {
    const v = videoRef.current;
    if (!v || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    v.currentTime = ratio * duration;
  };

  const handleEnded = () => setPlaying(false);

  const resetHideTimer = () => {
    setShowControls(true);
    clearTimeout(hideTimer.current);
    if (playing) {
      hideTimer.current = setTimeout(() => setShowControls(false), 3000);
    }
  };

  React.useEffect(() => {
    if (!playing) { setShowControls(true); clearTimeout(hideTimer.current); }
    else resetHideTimer();
    return () => clearTimeout(hideTimer.current);
  }, [playing]);

  return (
    <section className="bg-white py-20 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="text-xs font-bold uppercase tracking-widest text-blue-700 mb-3">Video recenzia</div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">Klient hovorí za seba</h2>
          <p className="mt-3 text-slate-600">Skutočná skúsenosť z financovania auta cez AutoMesacne.sk.</p>
        </div>

        <div
          className="relative rounded-3xl overflow-hidden bg-black shadow-2xl group"
          onMouseMove={resetHideTimer}
          onMouseLeave={() => { if (playing) setShowControls(false); }}
        >
          <video
            ref={videoRef}
            src="/img/video-recenzia.mp4"
            poster="/img/video-recenzia-poster.jpg"
            className="w-full aspect-video object-contain"
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoaded}
            onEnded={handleEnded}
            onClick={togglePlay}
            muted={muted}
            playsInline
          />

          {/* play overlay — visible when paused */}
          {!playing && (
            <div
              className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer"
              onClick={togglePlay}
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white/95 hover:bg-white text-blue-900 flex items-center justify-center shadow-2xl transition-all hover:scale-105">
                <Play className="w-9 h-9 sm:w-11 sm:h-11 ml-1" />
              </div>
            </div>
          )}

          {/* controls bar */}
          <div
            className={`absolute bottom-0 left-0 right-0 px-5 pb-4 pt-8 bg-gradient-to-t from-black/80 to-transparent transition-opacity duration-300 ${showControls ? "opacity-100" : "opacity-0 pointer-events-none"}`}
          >
            {/* progress bar */}
            <div
              className="w-full h-1.5 bg-white/30 rounded-full mb-4 cursor-pointer"
              onClick={handleSeek}
            >
              <div
                className="h-full bg-white rounded-full"
                style={{ width: duration ? `${(progress / duration) * 100}%` : "0%" }}
              />
            </div>

            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={togglePlay}
                className="text-white hover:text-blue-300 transition-colors"
                aria-label={playing ? "Pozastaviť" : "Prehrať"}
              >
                {playing
                  ? <Pause className="w-6 h-6" />
                  : <Play className="w-6 h-6 ml-0.5" />
                }
              </button>

              <span className="text-white/80 text-sm tabular-nums">
                {formatTime(progress)} / {formatTime(duration)}
              </span>

              <div className="flex-1" />

              <button
                type="button"
                onClick={() => {
                  const v = videoRef.current;
                  if (!v) return;
                  v.muted = !v.muted;
                  setMuted(v.muted);
                }}
                className="text-white hover:text-blue-300 transition-colors"
                aria-label={muted ? "Zapnúť zvuk" : "Vypnúť zvuk"}
              >
                {muted
                  ? <VolumeX className="w-5 h-5" />
                  : <Volume2 className="w-5 h-5" />
                }
              </button>
            </div>
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
