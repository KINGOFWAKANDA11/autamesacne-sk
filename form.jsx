// Multi-step lead form
const { useState: useFState, useEffect: useFEffect } = React;

const incomeTypes = [
  { id: "employee", label: "Zamestnanec", Icon: Briefcase },
  { id: "employee_abroad", label: "Zamestnanec v zahraničí", Icon: Globe },
  { id: "szco", label: "Živnostník (SZČO)", Icon: Building2 },
  { id: "sro", label: "Firma (s.r.o.)", Icon: Building },
];

function TextInput({ label, hint, error, type = "text", value, onChange, placeholder, required, maxLength, ...rest }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-1.5">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        className={`w-full px-4 py-3 border rounded-xl text-slate-900 placeholder-slate-400 transition focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 ${
          error ? "border-rose-400 bg-rose-50/40" : "border-slate-200 bg-white"
        }`}
        {...rest}
      />
      {hint && !error && <p className="text-xs text-slate-500 mt-1.5">{hint}</p>}
      {error && <p className="text-xs text-rose-600 mt-1.5 font-medium">{error}</p>}
    </div>
  );
}

function PhoneInput({ label, value, onChange, error, required }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-1.5">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      <div className={`flex items-stretch rounded-xl border overflow-hidden bg-white transition focus-within:ring-2 focus-within:ring-blue-500/30 focus-within:border-blue-500 ${error ? "border-rose-400" : "border-slate-200"}`}>
        <span className="px-3 flex items-center text-slate-600 bg-slate-50 border-r border-slate-200 font-medium">+421</span>
        <input
          type="tel"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="9XX XXX XXX"
          className="flex-1 px-4 py-3 outline-none"
        />
      </div>
      {error && <p className="text-xs text-rose-600 mt-1.5 font-medium">{error}</p>}
    </div>
  );
}

function Stepper({ step }) {
  const labels = ["Auto", "Príjem", "Kontakt"];
  return (
    <div className="flex items-start gap-2 sm:gap-4 mb-8">
      {labels.map((label, i) => {
        const idx = i + 1;
        const done = step > idx;
        const active = step === idx;
        return (
          <React.Fragment key={label}>
            <div className="flex-1 flex flex-col items-center">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                  done
                    ? "bg-green-600 text-white"
                    : active
                    ? "bg-green-600 text-white ring-4 ring-green-100"
                    : "bg-slate-100 text-slate-400"
                }`}
              >
                {done ? <Check className="w-4 h-4" strokeWidth={3} /> : idx}
              </div>
              <div className={`mt-2 text-xs font-medium ${active || done ? "text-slate-900" : "text-slate-400"}`}>
                {label}
              </div>
            </div>
            {i < labels.length - 1 && (
              <div className={`flex-1 h-0.5 mt-4 ${done ? "bg-green-600" : "bg-slate-200"}`}></div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function ReassuranceRow() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-8 pt-6 border-t border-slate-100">
      <div className="flex items-center gap-2.5 text-sm text-slate-600">
        <ShieldCheck className="w-5 h-5 text-blue-700 shrink-0" />
        <span>Vaše údaje sú u nás v bezpečí</span>
      </div>
      <div className="flex items-center gap-2.5 text-sm text-slate-600">
        <FileSignature className="w-5 h-5 text-blue-700 shrink-0" />
        <span>Online podpis zmluvy možný</span>
      </div>
      <div className="flex items-center gap-2.5 text-sm text-slate-600">
        <Clock className="w-5 h-5 text-blue-700 shrink-0" />
        <span>Ozveme sa do 24 hodín</span>
      </div>
    </div>
  );
}

function LeadForm({ committedHero, scrollToTop }) {
  const [step, setStep] = useFState(1);
  const [submitted, setSubmitted] = useFState(false);
  const [errors, setErrors] = useFState({});

  // Step 1
  const [carUrl, setCarUrl] = useFState("");
  const [carPrice, setCarPrice] = useFState("");
  const [carYear, setCarYear] = useFState("");

  // Step 2
  const [incomeType, setIncomeType] = useFState("");
  // employee fields
  const [fullName, setFullName] = useFState("");
  const [birthDate, setBirthDate] = useFState("");
  const [address, setAddress] = useFState("");
  const [city, setCity] = useFState("");
  const [zip, setZip] = useFState("");
  const [employmentStart, setEmploymentStart] = useFState("");
  const [salary, setSalary] = useFState("");
  // szco/sro fields
  const [ico, setIco] = useFState("");
  const [dic, setDic] = useFState("");
  const [monthlyCosts, setMonthlyCosts] = useFState("");
  const [monthlyIncome, setMonthlyIncome] = useFState("");
  const [vatPayer, setVatPayer] = useFState("");

  // Step 3
  const [downPayment, setDownPayment] = useFState("");
  const [desiredMonthly, setDesiredMonthly] = useFState("");
  const [loanMonths, setLoanMonths] = useFState(60);
  const [email, setEmail] = useFState("");
  const [phone, setPhone] = useFState("");
  const [notes, setNotes] = useFState("");
  const [gdpr, setGdpr] = useFState(false);

  // Apply prefill from hero whenever the user commits a hero snapshot (any CTA click).
  // We only fill EMPTY fields — never overwrite what the user already typed.
  useFEffect(() => {
    if (!committedHero) return;
    // Step 1: carUrl
    setCarUrl((v) => (v === "" && committedHero.carUrl ? committedHero.carUrl : v));
    // Step 1: carPrice — only prefill if there is no URL (fields would be hidden if URL present)
    if (!committedHero.carUrl) {
      setCarPrice((v) => (v === "" && committedHero.carPrice ? String(committedHero.carPrice) : v));
    }
    // Step 3: financing fields
    setDesiredMonthly((v) => (v === "" && committedHero.monthly ? String(committedHero.monthly) : v));
    setLoanMonths((v) => v || committedHero.months || 60);
    setDownPayment((v) => (v === "" && committedHero.downPayment ? String(committedHero.downPayment) : v));
  }, [committedHero]);

  const showCarFallback = carUrl.trim() === "";
  const isBusiness = incomeType === "szco" || incomeType === "sro";
  const isEmployee = incomeType === "employee" || incomeType === "employee_abroad";

  const validateStep1 = () => {
    const e = {};
    if (carUrl.trim() === "") {
      if (!carPrice) e.carPrice = "Vyplňte aspoň link alebo cenu a ročník vozidla.";
      if (!carYear) e.carYear = "Vyplňte ročník vozidla.";
    }
    return e;
  };
  const validateStep2 = () => {
    const e = {};
    if (!incomeType) { e.incomeType = "Vyberte zdroj príjmu."; return e; }
    if (isEmployee) {
      if (!fullName) e.fullName = "Povinné pole.";
      if (!birthDate) e.birthDate = "Povinné pole.";
      if (!salary) e.salary = "Povinné pole.";
    } else if (isBusiness) {
      if (!ico || ico.length !== 8) e.ico = "IČO má 8 znakov.";
      if (!monthlyIncome) e.monthlyIncome = "Povinné pole.";
    }
    return e;
  };
  const validateStep3 = () => {
    const e = {};
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) e.email = "Zadajte platný email.";
    if (!phone || phone.replace(/\D/g, "").length < 9) e.phone = "Zadajte platné telefónne číslo.";
    if (!gdpr) e.gdpr = "Súhlas je povinný.";
    return e;
  };

  const goNext = () => {
    const errs = step === 1 ? validateStep1() : step === 2 ? validateStep2() : {};
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      setStep(step + 1);
      // scroll to top of form
      setTimeout(() => {
        document.getElementById("form")?.scrollIntoView({ block: "start", behavior: "smooth" });
      }, 50);
    }
  };
  const goBack = () => {
    setErrors({});
    setStep(step - 1);
  };
  const onSubmit = (e) => {
    e.preventDefault();
    const errs = validateStep3();
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 text-center max-w-3xl mx-auto">
        <div className="w-20 h-20 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-12 h-12" strokeWidth={2} />
        </div>
        <h3 className="text-3xl font-extrabold text-slate-900 mb-3">Žiadosť úspešne odoslaná</h3>
        <p className="text-slate-600 text-lg leading-relaxed max-w-xl mx-auto">
          Náš špecialista vás bude kontaktovať do 24 hodín na uvedené telefónne číslo.
        </p>
        <button
          type="button"
          onClick={() => { setSubmitted(false); setStep(1); scrollToTop(); }}
          className="mt-8 inline-flex items-center gap-2 border-2 border-slate-200 hover:border-slate-300 text-slate-700 font-semibold px-6 py-3 rounded-xl transition-colors"
        >
          Späť na úvod
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 md:p-12 max-w-3xl mx-auto"
      noValidate
    >
      <div className="text-center mb-6">
        <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900">Získajte ponuku zadarmo</h3>
        <p className="text-slate-600 mt-2">Vyplnenie trvá 2 minúty. Žiadne záväzky.</p>
      </div>

      <Stepper step={step} />

      {step === 1 && (
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Odkaz na vozidlo
            </label>
            <div className={`flex items-stretch rounded-xl border bg-white overflow-hidden transition focus-within:ring-2 focus-within:ring-blue-500/30 focus-within:border-blue-500 ${carUrl.trim() !== "" ? "border-green-500 bg-green-50/30" : "border-slate-200"}`}>
              <input
                type="url"
                value={carUrl}
                onChange={(e) => { setCarUrl(e.target.value); if (errors.carPrice || errors.carYear) setErrors({}); }}
                placeholder="https://www.autobazar.eu/..."
                className="flex-1 px-4 py-3 outline-none bg-transparent"
              />
              {carUrl.trim() !== "" && (
                <span className="px-3 flex items-center gap-1.5 text-xs font-semibold text-green-700 bg-green-100/70 border-l border-green-200">
                  <Check className="w-3.5 h-3.5" strokeWidth={3} /> Link
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-1.5">
              Stačí skopírovať link z Autobazaru, Bazoša, Marketplace alebo iného portálu.
            </p>
          </div>

          <div
            className={`overflow-hidden transition-all duration-300 ease-out ${
              showCarFallback ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
            }`}
            aria-hidden={!showCarFallback}
          >
            <div className="relative pt-2">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex-1 h-px bg-slate-200"></div>
                <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">alebo</span>
                <div className="flex-1 h-px bg-slate-200"></div>
              </div>
              <p className="text-sm text-slate-600 mb-3">Nemáte link? Stačia základné údaje:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                <TextInput
                  label="Cena vozidla (€)"
                  type="number"
                  value={carPrice}
                  onChange={setCarPrice}
                  placeholder="napr. 15000"
                  error={errors.carPrice}
                  required
                  min="500"
                />
                <TextInput
                  label="Ročník vozidla"
                  type="number"
                  value={carYear}
                  onChange={setCarYear}
                  placeholder="napr. 2019"
                  error={errors.carYear}
                  required
                  min="1990"
                  max="2026"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={goNext}
              className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3.5 rounded-xl inline-flex items-center gap-2 transition-colors shadow-lg shadow-green-600/20"
            >
              Pokračovať <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <div>
            <p className="text-sm font-semibold text-slate-700 mb-3">Aký je váš zdroj príjmu?</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {incomeTypes.map(({ id, label, Icon: ITag }) => {
                const active = incomeType === id;
                return (
                  <button
                    type="button"
                    key={id}
                    onClick={() => { setIncomeType(id); setErrors({}); }}
                    className={`text-left p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
                      active
                        ? "border-blue-600 bg-blue-50/60 shadow-sm"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${active ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"}`}>
                      <ITag className="w-5 h-5" />
                    </div>
                    <span className="font-semibold text-slate-900 text-sm sm:text-base">{label}</span>
                  </button>
                );
              })}
            </div>
            {errors.incomeType && <p className="text-xs text-rose-600 mt-2 font-medium">{errors.incomeType}</p>}
          </div>

          {isEmployee && (
            <div className="space-y-4 pt-2 border-t border-slate-100">
              <TextInput label="Meno a priezvisko" value={fullName} onChange={setFullName} placeholder="Ján Novák" error={errors.fullName} required />
              <TextInput label="Dátum narodenia" type="date" value={birthDate} onChange={setBirthDate} error={errors.birthDate} required />
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <TextInput label="Adresa" value={address} onChange={setAddress} placeholder="Hlavná 12" />
                </div>
                <TextInput label="Mesto" value={city} onChange={setCity} placeholder="Bratislava" />
                <TextInput label="PSČ" value={zip} onChange={setZip} placeholder="811 01" maxLength={6} />
              </div>
              <TextInput label="Dátum nástupu do zamestnania" type="date" value={employmentStart} onChange={setEmploymentStart} />
              <TextInput label="Priemerný čistý mesačný plat za 3 mesiace (€)" type="number" value={salary} onChange={setSalary} placeholder="napr. 1400" error={errors.salary} required />
            </div>
          )}

          {isBusiness && (
            <div className="space-y-4 pt-2 border-t border-slate-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextInput label="IČO" value={ico} onChange={setIco} placeholder="12345678" maxLength={8} error={errors.ico} required />
                <TextInput label="DIČ" value={dic} onChange={setDic} placeholder="2012345678" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextInput label="Priemerné mesačné náklady (€)" type="number" value={monthlyCosts} onChange={setMonthlyCosts} placeholder="napr. 2000" />
                <TextInput label="Priemerný mesačný príjem za 3 mesiace (€)" type="number" value={monthlyIncome} onChange={setMonthlyIncome} placeholder="napr. 4500" error={errors.monthlyIncome} required />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-700 mb-2">Som platca DPH?</p>
                <div className="flex gap-3">
                  {["Áno", "Nie"].map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setVatPayer(opt)}
                      className={`flex-1 py-3 rounded-xl border-2 font-semibold transition-colors ${
                        vatPayer === opt
                          ? "border-blue-600 bg-blue-50/60 text-blue-900"
                          : "border-slate-200 text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col-reverse sm:flex-row justify-between gap-3 pt-3">
            <button
              type="button"
              onClick={goBack}
              className="border-2 border-slate-200 hover:border-slate-300 text-slate-700 font-semibold px-6 py-3 rounded-xl inline-flex items-center justify-center gap-2 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Späť
            </button>
            <button
              type="button"
              onClick={goNext}
              className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-3.5 rounded-xl inline-flex items-center justify-center gap-2 transition-colors shadow-lg shadow-green-600/20"
            >
              Pokračovať <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput
              label="Výška akontácie (€)"
              type="number"
              value={downPayment}
              onChange={setDownPayment}
              placeholder="napr. 2000"
              hint="Suma, ktorú zaplatíte hneď. Môže byť 0."
            />
            <TextInput
              label="Predstava o mesačnej splátke (€)"
              type="number"
              value={desiredMonthly}
              onChange={setDesiredMonthly}
              placeholder="napr. 250"
            />
          </div>

          <div>
            <div className="flex items-baseline justify-between mb-2">
              <label className="text-sm font-semibold text-slate-700">Doba splácania</label>
              <span className="text-base font-bold text-blue-900 tabular-nums">{loanMonths} mesiacov</span>
            </div>
            <input
              type="range"
              min={12}
              max={96}
              step={12}
              value={loanMonths}
              onChange={(e) => setLoanMonths(Number(e.target.value))}
              className="w-full slider-input cursor-pointer"
              style={{
                background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${((loanMonths - 12) / 84) * 100}%, #E2E8F0 ${((loanMonths - 12) / 84) * 100}%, #E2E8F0 100%)`,
              }}
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1.5">
              <span>12 mes.</span><span>96 mes.</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            <TextInput
              label="Email"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="vase@meno.sk"
              error={errors.email}
              required
            />
            <PhoneInput
              label="Telefónne číslo"
              value={phone}
              onChange={setPhone}
              error={errors.phone}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Doplňujúce informácie
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Poznámky, špecifické požiadavky..."
              className="w-full px-4 py-3 border border-slate-200 bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 resize-y"
            />
          </div>

          <label className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition ${errors.gdpr ? "border-rose-400 bg-rose-50/40" : "border-slate-200 bg-slate-50/60"}`}>
            <input
              type="checkbox"
              checked={gdpr}
              onChange={(e) => setGdpr(e.target.checked)}
              className="mt-0.5 w-5 h-5 rounded border-slate-300 text-green-600 focus:ring-green-500 shrink-0"
            />
            <span className="text-sm text-slate-700 leading-relaxed">
              Súhlasím so spracovaním osobných údajov v zmysle GDPR. <span className="text-rose-500">*</span>
            </span>
          </label>
          {errors.gdpr && <p className="text-xs text-rose-600 font-medium -mt-3">{errors.gdpr}</p>}

          <div className="flex flex-col-reverse sm:flex-row justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={goBack}
              className="border-2 border-slate-200 hover:border-slate-300 text-slate-700 font-semibold px-6 py-3 rounded-xl inline-flex items-center justify-center gap-2 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Späť
            </button>
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-4 rounded-xl inline-flex items-center justify-center gap-2 transition-colors shadow-lg shadow-green-600/20 text-lg w-full sm:w-auto"
            >
              Odoslať žiadosť <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      <ReassuranceRow />
    </form>
  );
}

Object.assign(window, { LeadForm });
