// Shared blog data (used by /blog and /blog/[slug])
const BLOG_TAGS = ["Všetko", "Leasing", "Akontácia", "Ojazdené auto", "Tipy", "Recenzie", "Videá"];

const TAG_COLORS = {
  "Leasing": "bg-blue-100 text-blue-800",
  "Akontácia": "bg-emerald-100 text-emerald-800",
  "Ojazdené auto": "bg-amber-100 text-amber-800",
  "Tipy": "bg-violet-100 text-violet-800",
  "Recenzie": "bg-rose-100 text-rose-800",
  "Videá": "bg-cyan-100 text-cyan-800",
};

const BLOG_POSTS = [
  {
    slug: "leasing-vs-uver",
    tag: "Leasing",
    title: "Leasing vs. spotrebný úver na auto. Aký je rozdiel?",
    excerpt: "Pri kúpe auta na splátky máte dve hlavné možnosti. Vysvetľujeme, kedy sa oplatí ktorá, a čo treba sledovať pri výbere.",
    date: "20. máj 2026",
    readTime: "6 min",
    color: "from-blue-500 to-indigo-600",
    isVideo: false,
    featured: true,
  },
  {
    slug: "akontacia-ano-nie",
    tag: "Akontácia",
    title: "Bez akontácie alebo s akontáciou? Čo sa kedy oplatí",
    excerpt: "Akontácia môže byť 0 % aj 50 %. Aký vplyv má na mesačnú splátku, úrok a celkové preplatenie, ukazujeme na konkrétnych číslach.",
    date: "12. máj 2026",
    readTime: "5 min",
    color: "from-emerald-500 to-teal-600",
    isVideo: false,
  },
  {
    slug: "5-tipov-financovanie",
    tag: "Tipy",
    title: "5 tipov, ako sa pripraviť na žiadosť o financovanie",
    excerpt: "Schválenie ide rýchlejšie, ak máte všetko nachystané vopred. Praktický checklist pre fyzické osoby aj živnostníkov.",
    date: "5. máj 2026",
    readTime: "4 min",
    color: "from-violet-500 to-purple-600",
    isVideo: false,
  },
  {
    slug: "ojazdene-auto-leasing",
    tag: "Ojazdené auto",
    title: "Ako kúpiť ojazdené auto s leasingom",
    excerpt: "Auto z bazáru aj od súkromníka. Aké podmienky platia, čo banky a leasingovky kontrolujú a aké veci si treba dať pozor pred podpisom.",
    date: "28. apríl 2026",
    readTime: "7 min",
    color: "from-amber-500 to-orange-600",
    isVideo: false,
  },
  {
    slug: "recenzia-skoda-octavia",
    tag: "Recenzie",
    title: "Recenzia: Škoda Octavia 2020 na splátky",
    excerpt: "Najpredávanejšie auto na Slovensku. Aké sú reálne podmienky financovania pri ročníku 2020 a ceně okolo 18 000 €?",
    date: "20. apríl 2026",
    readTime: "5 min",
    color: "from-rose-500 to-pink-600",
    isVideo: false,
  },
  {
    slug: "vw-tiguan-vs-skoda-kodiaq",
    tag: "Recenzie",
    title: "VW Tiguan vs. Škoda Kodiaq. SUV pre rodinu",
    excerpt: "Dve najpopulárnejšie SUV-čka na slovenskom trhu. Porovnávame ich z pohľadu klienta, ktorý si ich chce kúpiť na splátky.",
    date: "10. apríl 2026",
    readTime: "8 min",
    color: "from-sky-500 to-blue-600",
    isVideo: false,
  },
  {
    slug: "online-podpis-zmluvy",
    tag: "Tipy",
    title: "Online podpis zmluvy. Ako to funguje v praxi",
    excerpt: "Žiadne behanie po pobočkách. Vysvetľujeme, ako prebieha elektronický podpis a aké doklady k tomu reálne potrebujete.",
    date: "1. apríl 2026",
    readTime: "3 min",
    color: "from-cyan-500 to-blue-500",
    isVideo: false,
  },
  {
    slug: "refinancovanie-leasingu",
    tag: "Leasing",
    title: "Refinancovanie existujúceho leasingu. Kedy sa to oplatí",
    excerpt: "Máte vyšší úrok na starej zmluve? Existuje možnosť presunúť leasing inde. Kalkulácia kedy áno a kedy nie.",
    date: "24. marec 2026",
    readTime: "6 min",
    color: "from-indigo-500 to-blue-600",
    isVideo: false,
  },
  {
    slug: "video-klient-o-nas",
    tag: "Videá",
    title: "Video: Klient Marek o svojom prvom leasingu",
    excerpt: "Príbeh Mareka z Bratislavy, ktorý si u nás vybavil financovanie Škody Octavie. Krok za krokom, bez retuše.",
    date: "15. marec 2026",
    readTime: "2:14 video",
    color: "from-orange-500 to-red-600",
    isVideo: true,
  },
  {
    slug: "video-3-kroky",
    tag: "Videá",
    title: "Video: Tri kroky k schváleniu financovania",
    excerpt: "Stručné vysvetlenie celého procesu. Od poslania linku na auto až po podpis zmluvy. Trvanie pod tri minúty.",
    date: "1. marec 2026",
    readTime: "2:48 video",
    color: "from-purple-500 to-pink-600",
    isVideo: true,
  },
];

// Long-form body for blog detail. Same content used for all posts (placeholder).
const BLOG_BODY = [
  { type: "p", text: "Kúpa auta na splátky je jedno z najčastejších rozhodnutí, ktoré v dospelosti riešime. Pre väčšinu klientov ide o druhú najväčšiu finančnú transakciu po nehnuteľnosti, a napriek tomu sa o nej hovorí prekvapivo málo. V tomto článku rozoberieme to, čo by ste mali vedieť pred tým, ako podpíšete prvú zmluvu." },
  { type: "h2", text: "Aké možnosti máte na slovenskom trhu" },
  { type: "p", text: "Na Slovensku v roku 2026 existujú v zásade tri spôsoby, ako si kúpiť auto, ak nemáte celú sumu hotovosti k dispozícii: spotrebný úver z banky, finančný leasing alebo operatívny leasing. Každý má svoje plusy aj mínusy a každý sa hodí na inú situáciu." },
  { type: "p", text: "Spotrebný úver je z pohľadu klienta najjednoduchší. Auto je hneď vaše, banka má len záložné právo. Leasing zas často ponúka nižšiu úrokovú sadzbu, ale vlastnícke práva sú zložitejšie. Operatívny leasing je niečo medzi prenájmom a kúpou, využívajú ho hlavne firmy." },
  { type: "h2", text: "Čo všetko vstupuje do rozhodnutia" },
  { type: "p", text: "Pri výbere by ste sa mali pýtať aspoň na tri veci. Po prvé, koľko vás bude stáť celkovo (nielen mesačná splátka). Po druhé, či vám zmluva dovolí predčasné splatenie bez pokuty. A po tretie, čo sa stane, keď z nejakého dôvodu nebudete vedieť splácať." },
  { type: "quote", text: "Najlacnejšia splátka nie vždy znamená najlacnejší leasing. Pozerajte sa na úrok a na celkové preplatenie, nie len na mesačný náklad." },
  { type: "h2", text: "Praktické tipy pred podpisom" },
  { type: "ul", items: [
    "Vyžiadajte si predzmluvné informácie písomne aspoň deň pred podpisom.",
    "Skontrolujte si poplatok za predčasné splatenie. V niektorých prípadoch je nulový, v iných až 1 % zo zostatku.",
    "Pozrite si, či je v cene povinné poistenie alebo havarijné poistenie.",
    "Spočítajte si splátku v dvoch alternatívach. S akontáciou a bez nej.",
  ] },
  { type: "p", text: "Ak si nie ste istí, ktorá možnosť je pre vás najvýhodnejšia, ozvite sa. Prejdeme spolu vaše čísla a navrhneme riešenie, ktoré dáva zmysel pri vašom príjme aj profile." },
];

function getRelatedPosts(currentSlug, count = 3) {
  return BLOG_POSTS.filter(p => p.slug !== currentSlug).slice(0, count);
}

function getPostBySlug(slug) {
  return BLOG_POSTS.find(p => p.slug === slug) || null;
}
