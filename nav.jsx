// Shared site navigation + footer
// Usage: <SiteNav active="kontakt" /> · <SiteFooter />
//
// Active values: "home" | "referencie" | "blog" | "o-nas" | "kontakt"
// Top-right CTA scrolls to #form on home, otherwise redirects to /#form.

const { useState: useNState, useEffect: useNEffect } = React;

const NAV_LINKS = [
  { href: "/", label: "Domov", id: "home" },
  { href: "/referencie", label: "Referencie", id: "referencie" },
  { href: "/blog", label: "Blog", id: "blog" },
  { href: "/o-nas", label: "O nás", id: "o-nas" },
  { href: "/kontakt", label: "Kontakt", id: "kontakt" },
];

function SiteNav({ active = "home", scrollToForm }) {
  const [scrolled, setScrolled] = useNState(false);
  const [open, setOpen] = useNState(false);

  useNEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useNEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const handleCTA = () => {
    setOpen(false);
    if (typeof scrollToForm === "function") {
      scrollToForm();
    } else {
      window.location.href = "/#form";
    }
  };

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-200 ${
        scrolled
          ? "bg-white/90 backdrop-blur-md shadow-sm py-2.5"
          : "bg-white py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
        <a href="/" className="flex items-center select-none shrink-0">
          <img src="/logo.png" alt="AutoMesacne.sk" className="h-8 sm:h-10 w-auto max-w-[180px] sm:max-w-[220px]" />
        </a>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const isActive = link.id === active;
            return (
              <a
                key={link.id}
                href={link.href}
                className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  isActive
                    ? "text-blue-900 bg-blue-50"
                    : "text-slate-600 hover:text-blue-900 hover:bg-slate-50"
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden xl:flex items-center gap-1.5 text-sm text-slate-500">
            <Clock className="w-4 h-4" />
            <span>Po-Pi 8:00 až 17:00</span>
          </div>

          <button
            type="button"
            onClick={handleCTA}
            className="hidden sm:inline-flex bg-green-600 hover:bg-green-700 text-white font-bold px-4 sm:px-5 py-2.5 rounded-lg transition-colors shadow-md shadow-green-600/20 text-sm sm:text-base"
          >
            Získať ponuku
          </button>

          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Zavrieť menu" : "Otvoriť menu"}
            aria-expanded={open}
            className="lg:hidden p-2 -mr-2 text-slate-700 hover:text-blue-900 transition-colors"
          >
            {open ? (
              <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            ) : (
              <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu overlay */}
      {open && (
        <div className="lg:hidden absolute left-0 right-0 top-full bg-white border-t border-slate-100 shadow-xl">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col gap-1">
            {NAV_LINKS.map((link) => {
              const isActive = link.id === active;
              return (
                <a
                  key={link.id}
                  href={link.href}
                  className={`px-4 py-3 rounded-lg text-base font-semibold transition-colors ${
                    isActive
                      ? "text-blue-900 bg-blue-50"
                      : "text-slate-700 hover:text-blue-900 hover:bg-slate-50"
                  }`}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </a>
              );
            })}
            <div className="pt-3 mt-2 border-t border-slate-100 flex items-center gap-2 text-sm text-slate-500 px-4">
              <Clock className="w-4 h-4" />
              <span>Po-Pi 8:00 až 17:00</span>
            </div>
            <button
              type="button"
              onClick={handleCTA}
              className="sm:hidden mt-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-colors shadow-md shadow-green-600/20"
            >
              Získať ponuku
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}

function SiteFooter() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="mb-3">
              <img src="/logo-footer.png" alt="AutoMesacne.sk" className="h-16 w-auto max-w-[220px]" />
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
              Financovanie auta z celého Slovenska. Rýchlo, online, bez papierovania.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-3 text-sm uppercase tracking-wider">Navigácia</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="hover:text-white">Domov</a></li>
              <li><a href="/referencie" className="hover:text-white">Referencie</a></li>
              <li><a href="/blog" className="hover:text-white">Blog</a></li>
              <li><a href="/o-nas" className="hover:text-white">O nás</a></li>
              <li><a href="/kontakt" className="hover:text-white">Kontakt</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-3 text-sm uppercase tracking-wider">Kontakt</h4>
            <ul className="space-y-2 text-sm">
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
              <li>IČO: 55343198</li>
              <li>DIČ: 2121960291</li>
              <li>IČ DPH: SK2121960291</li>
              <li>Sídlo: Hlavná 571/124, 946 32 Marcelová</li>
            </ul>
            <ul className="mt-4 space-y-2 text-sm">
              <li><a href="/gdpr.html" className="text-slate-300 hover:text-white underline underline-offset-2">Ochrana osobných údajov</a></li>
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
