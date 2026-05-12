// FAQ accordion + Sections that need state
const { useState: useSState, useEffect: useSEffect } = React;

function FAQItem({ q, a, open, onToggle }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-4 text-left px-5 sm:px-6 py-5 hover:bg-slate-50/50 transition-colors"
      >
        <span className="font-semibold text-slate-900 text-base sm:text-lg">{q}</span>
        <ChevronDown
          className={`w-5 h-5 text-slate-500 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <div
        className={`grid transition-all duration-300 ease-out ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
      >
        <div className="overflow-hidden">
          <div className="px-5 sm:px-6 pb-5 text-slate-600 leading-relaxed">
            {a}
          </div>
        </div>
      </div>
    </div>
  );
}

const faqs = [
  {
    q: "Dá sa vybaviť leasing aj bez akontácie?",
    a: "Áno, financujeme aj bez akontácie. Konkrétne podmienky závisia od typu vozidla a vášho profilu. Presnú ponuku pripravíme po vyplnení krátkej žiadosti.",
  },
  {
    q: "Ako rýchlo dostanem schválenie?",
    a: "Štandardne do 24 hodín od podania žiadosti. V mnohých prípadoch ešte rýchlejšie. Stačí vyplniť formulár a ozveme sa.",
  },
  {
    q: "Môžem poslať auto z Autobazaru alebo Bazoša?",
    a: "Áno, akýkoľvek inzerát zo slovenského trhu. Stačí skopírovať link do formulára vyššie a my si auto pozrieme.",
  },
  {
    q: "Dá sa všetko podpísať online?",
    a: "Áno, zmluvu podpíšete elektronicky z pohodlia domova. Žiadne osobné stretnutia ani návštevy pobočky.",
  },
  {
    q: "Aké doklady potrebujem?",
    a: "Štandardne občiansky preukaz a doklad o príjme. Konkrétny zoznam závisí od vášho profilu a vyžiadame si ho až pri schvaľovaní. Začnite vyplnením žiadosti.",
  },
  {
    q: "Aký je minimálny príjem?",
    a: "Posudzujeme každú žiadosť individuálne. Vo všeobecnosti potrebujete stabilný príjem dostatočný na pokrytie splátky. Najlepšie zistíte odoslaním žiadosti.",
  },
];

function FAQSection() {
  const [openIdx, setOpenIdx] = useSState(-1);
  return (
    <section className="bg-slate-50 py-20 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">
            Najčastejšie otázky
          </h2>
        </div>
        <div className="space-y-3">
          {faqs.map((item, i) => (
            <FAQItem
              key={i}
              q={item.q}
              a={item.a}
              open={openIdx === i}
              onToggle={() => setOpenIdx(openIdx === i ? -1 : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { FAQSection });
