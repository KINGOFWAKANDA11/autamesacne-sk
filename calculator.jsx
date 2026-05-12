// Hero kalkulačka
const { useState, useEffect, useRef, useMemo } = React;

const formatEUR = (n) => {
  if (!isFinite(n)) return "0 €";
  return Math.round(n).toLocaleString("sk-SK").replace(/,/g, " ") + " €";
};

function RangeSlider({ label, value, min, max, step, onChange, suffix, formatValue }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1">
        <label className="text-sm font-medium text-slate-700">{label}</label>
        <span className="text-lg font-bold text-blue-900 tabular-nums">
          {formatValue ? formatValue(value) : value}{suffix}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={label}
        className="w-full appearance-none bg-transparent cursor-pointer slider-input"
        style={{
          background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${pct}%, #E2E8F0 ${pct}%, #E2E8F0 100%)`,
        }}
      />
      <div className="flex justify-between text-xs text-slate-400 mt-1 tabular-nums">
        <span>{formatValue ? formatValue(min) : min}{suffix}</span>
        <span>{formatValue ? formatValue(max) : max}{suffix}</span>
      </div>
    </div>
  );
}

function HeroCalculator({ scrollToForm, setCalcPrefill }) {
  const [carUrl, setCarUrl] = useState("");
  const [price, setPrice] = useState(15000);
  const [downPct, setDownPct] = useState(20);
  const [months, setMonths] = useState(60);

  const downPayment = Math.round((price * downPct) / 100);
  const financed = price - downPayment;
  const monthly = months > 0 ? (financed / months) * 1.08 : 0;
  const total = monthly * months + downPayment;

  // URL validation
  const trimmedUrl = carUrl.trim();
  const urlIsEmpty = trimmedUrl === "";
  const urlIsValid = useMemo(() => {
    if (urlIsEmpty) return false;
    try {
      const u = new URL(trimmedUrl);
      return u.protocol === "http:" || u.protocol === "https:";
    } catch {
      return false;
    }
  }, [trimmedUrl, urlIsEmpty]);
  const urlFormatError = !urlIsEmpty && !urlIsValid;

  const platform = useMemo(() => {
    if (!urlIsValid) return null;
    try {
      const host = new URL(trimmedUrl).hostname.toLowerCase();
      const lower = trimmedUrl.toLowerCase();
      if (host.includes("autobazar.eu") || host.includes("autobazar.sk")) return "Autobazar";
      if (host.includes("bazos.sk") || host.includes("bazos.cz")) return "Bazoš";
      if (host.includes("facebook.com") || lower.includes("marketplace")) return "Facebook Marketplace";
      if (host.includes("carselect.sk")) return "Carselect";
      return null;
    } catch {
      return null;
    }
  }, [trimmedUrl, urlIsValid]);

  // Push everything to parent so the form can prefill
  useEffect(() => {
    setCalcPrefill({
      carUrl: urlIsValid ? trimmedUrl : "",
      carPrice: price,
      downPct,
      monthly: Math.round(monthly),
      months,
      downPayment,
    });
  }, [trimmedUrl, urlIsValid, price, downPct, monthly, months, downPayment, setCalcPrefill]);

  return (
    <div className="bg-white shadow-2xl rounded-2xl p-5 md:p-6 border border-slate-100">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
          <Calculator className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900 leading-tight">
            Vypočítajte si orientačnú splátku
          </h3>
          <p className="text-xs text-slate-500">Posuňte slidery podľa vašej predstavy</p>
        </div>
      </div>

      {/* Link na auto */}
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <label className="text-sm font-medium text-slate-700" htmlFor="hero-car-url">Link na auto</label>
          <span className="bg-slate-100 text-slate-500 text-xs px-2 py-0.5 rounded font-medium">voliteľné</span>
        </div>
        <div className="relative">
          <input
            id="hero-car-url"
            type="url"
            value={carUrl}
            onChange={(e) => setCarUrl(e.target.value)}
            placeholder="https://www.autobazar.eu/..."
            className={`w-full px-4 py-2 pr-11 border rounded-xl bg-white text-slate-900 placeholder-slate-400 transition focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 ${
              urlFormatError
                ? "border-rose-400 bg-rose-50/40"
                : urlIsValid
                ? "border-green-400 bg-green-50/20"
                : "border-slate-200"
            }`}
          />
          {urlIsValid && (
            <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-600" />
          )}
        </div>
        {urlFormatError && (
          <p className="text-xs text-rose-600 mt-2 font-medium">
            Skontrolujte formát linku. Musí začínať na https://
          </p>
        )}
        {platform && (
          <p className="text-sm text-green-700 flex items-center gap-1.5 mt-2 font-medium">
            <Sparkles className="w-4 h-4" />
            Rozpoznaná platforma: {platform}
          </p>
        )}
      </div>

      <div className="border-t border-slate-200 my-2"></div>

      <div className="space-y-4">
        <RangeSlider
          label="Cena vozidla"
          value={price}
          min={3000}
          max={100000}
          step={500}
          onChange={setPrice}
          suffix=" €"
          formatValue={(v) => v.toLocaleString("sk-SK").replace(/,/g, " ")}
        />
        <RangeSlider
          label="Akontácia"
          value={downPct}
          min={0}
          max={50}
          step={5}
          onChange={setDownPct}
          suffix=" %"
        />
        <RangeSlider
          label="Doba splácania"
          value={months}
          min={12}
          max={96}
          step={12}
          onChange={setMonths}
          suffix=" mes."
        />
      </div>

      <div className="mt-4 bg-blue-900 text-white rounded-xl p-4 relative overflow-hidden">
        <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-blue-700/40 blur-2xl"></div>
        <div className="relative">
          <div className="text-xs uppercase tracking-wide text-blue-200 font-semibold">
            Vaša orientačná mesačná splátka
          </div>
          <div className="flex items-baseline gap-2 mt-1 tabular-nums leading-none">
            <span className="text-xl font-medium text-blue-200">od</span>
            <span className="text-4xl font-extrabold">{formatEUR(monthly)}</span>
            <span className="text-sm font-medium text-blue-200">/ mes.</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-sm text-blue-100">
            <span>Akontácia</span>
            <span className="font-semibold tabular-nums">{formatEUR(downPayment)}</span>
          </div>
          <div className="mt-1 flex items-center justify-between text-sm text-blue-100">
            <span>Suma na úhradu celkom</span>
            <span className="font-semibold tabular-nums">{formatEUR(total)}</span>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={scrollToForm}
        className="mt-3 w-full bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-bold text-lg py-3 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-green-600/20"
      >
        Pokračovať k žiadosti
        <ArrowRight className="w-5 h-5" />
      </button>
      <p className="mt-2 text-xs text-slate-400 text-center">Orientačný výpočet. Reálna splátka závisí od vášho profilu a partnera.</p>
    </div>
  );
}

Object.assign(window, { HeroCalculator, RangeSlider, formatEUR });
