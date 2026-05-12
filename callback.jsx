// Floating "Zavolajte mi späť" callback widget (desktop, bottom-left)
const { useState: useCState } = React;

function CallbackWidget() {
  const [open, setOpen] = useCState(false);
  const [name, setName] = useCState("");
  const [phone, setPhone] = useCState("");
  const [submitted, setSubmitted] = useCState(false);
  const [error, setError] = useCState("");

  const onSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || phone.replace(/\D/g, "").length < 9) {
      setError("Vyplňte meno a platné telefónne číslo.");
      return;
    }
    setError("");
    setSubmitted(true);
  };

  const reset = () => {
    setSubmitted(false);
    setName("");
    setPhone("");
    setError("");
  };

  return (
    <div className="hidden md:block fixed bottom-6 left-6 z-30">
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="group flex items-center gap-3 bg-white border border-slate-200 hover:border-blue-300 shadow-xl shadow-slate-900/10 rounded-full pl-2 pr-5 py-2 transition-all"
          aria-label="Otvoriť formulár Zavolajte mi späť"
        >
          <span className="w-10 h-10 rounded-full bg-blue-900 text-white flex items-center justify-center relative">
            <Phone className="w-5 h-5" />
            <span className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-30"></span>
          </span>
          <span className="text-left leading-tight">
            <span className="block text-xs text-slate-500 font-medium">Nechce sa vám vypĺňať?</span>
            <span className="block text-sm font-bold text-slate-900">Zavoláme vám späť</span>
          </span>
        </button>
      )}

      {open && (
        <div className="w-[340px] bg-white rounded-2xl shadow-2xl shadow-slate-900/20 border border-slate-100 overflow-hidden">
          <div className="flex items-center justify-between gap-3 px-5 py-3.5 bg-blue-900 text-white">
            <div className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-blue-200" />
              <span className="font-bold text-sm">Zavoláme vám späť</span>
            </div>
            <button
              type="button"
              onClick={() => { setOpen(false); reset(); }}
              aria-label="Zatvoriť"
              className="w-7 h-7 rounded-md hover:bg-blue-800 flex items-center justify-center text-blue-200"
            >
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
          </div>

          {submitted ? (
            <div className="p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <p className="font-bold text-slate-900">Ďakujeme, {name.split(" ")[0]}.</p>
              <p className="text-sm text-slate-600 mt-1.5">Ozveme sa vám na uvedené číslo v pracovných hodinách.</p>
              <button
                type="button"
                onClick={() => { setOpen(false); reset(); }}
                className="mt-4 text-xs text-slate-500 hover:text-slate-700 font-semibold"
              >
                Zavrieť
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="p-5 space-y-3">
              <p className="text-xs text-slate-500 leading-relaxed">
                Nechajte nám číslo a ozveme sa do 30 minút v pracovných hodinách.
              </p>
              <div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Meno a priezvisko"
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
                />
              </div>
              <div className="flex items-stretch rounded-lg border border-slate-200 overflow-hidden focus-within:ring-2 focus-within:ring-blue-500/30 focus-within:border-blue-500">
                <span className="px-2.5 flex items-center text-xs text-slate-600 bg-slate-50 border-r border-slate-200 font-medium">+421</span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="9XX XXX XXX"
                  className="flex-1 px-3 py-2.5 text-sm outline-none"
                />
              </div>
              {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}
              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 rounded-lg text-sm transition-colors"
              >
                Zavolajte mi
              </button>
              <p className="text-[10px] text-slate-400 text-center leading-relaxed">
                Odoslaním súhlasíte so spracovaním údajov za účelom kontaktu.
              </p>
            </form>
          )}
        </div>
      )}
    </div>
  );
}

Object.assign(window, { CallbackWidget });
