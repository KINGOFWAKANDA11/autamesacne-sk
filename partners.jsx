// Stylized fictional partner wordmarks
// TODO: replace with real partner logos after legal approval.
// All wordmarks here are fictional placeholders designed to read as
// finance/leasing brand identities. Replace 1:1 with real assets when ready.

const PartnerLogos = {
  drivero: () => (
    <div className="flex items-center gap-2.5">
      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-slate-900 to-blue-900 flex items-center justify-center shrink-0">
        <div className="w-2 h-2 rounded-full bg-blue-400"></div>
      </div>
      <span className="font-black text-slate-900 text-[17px] tracking-tight">DRIVERO</span>
    </div>
  ),
  autolease: () => (
    <div className="flex items-center gap-2.5">
      <div className="w-7 h-7 rounded-md bg-blue-600 flex items-center justify-center shrink-0">
        <span className="text-white font-black text-sm leading-none">A</span>
      </div>
      <span className="text-[17px] text-slate-900 tracking-tight">
        <span className="font-light">Auto</span><span className="font-extrabold">Lease</span>
      </span>
    </div>
  ),
  vox: () => (
    <div className="flex items-center gap-2.5">
      <div className="w-7 h-7 rounded-md bg-emerald-600 flex items-center justify-center shrink-0">
        <div className="w-3 h-0.5 bg-white"></div>
      </div>
      <span className="font-mono font-bold text-slate-900 text-[17px] tracking-tighter">
        VOX<span className="text-emerald-600">.</span>finance
      </span>
    </div>
  ),
  carbank: () => (
    <div className="flex items-center gap-2.5">
      <div className="w-7 h-7 rounded-full border-[3px] border-slate-800 shrink-0"></div>
      <span className="font-semibold text-slate-900 text-[17px] tracking-tight">
        Carbank<span className="text-amber-500">·</span>SK
      </span>
    </div>
  ),
  mobilita: () => (
    <div className="flex items-center gap-2.5">
      <div className="w-6 h-6 bg-indigo-600 shrink-0" style={{ transform: "rotate(45deg)" }}></div>
      <span className="italic font-bold text-indigo-700 text-[17px] tracking-wide">MOBILITA</span>
    </div>
  ),
  flexfin: () => (
    <div className="flex items-center gap-2.5">
      <div className="shrink-0" aria-hidden="true">
        <svg width="22" height="22" viewBox="0 0 22 22"><polygon points="11,2 21,20 1,20" fill="#7C3AED" /></svg>
      </div>
      <span className="text-[17px] text-slate-900 tracking-tight">
        <span className="font-extrabold">Flex</span><span className="font-medium text-violet-700">Fin</span>
      </span>
    </div>
  ),
};

const PARTNER_LIST = [
  { id: "drivero", name: "Drivero" },
  { id: "autolease", name: "AutoLease" },
  { id: "vox", name: "VOX Finance" },
  { id: "carbank", name: "Carbank SK" },
  { id: "mobilita", name: "Mobilita" },
  { id: "flexfin", name: "FlexFin" },
];

function PartnerCard({ id, size = "sm" }) {
  const Render = PartnerLogos[id];
  if (!Render) return null;
  const padding = size === "lg" ? "px-8 py-7" : "px-5 py-4";
  return (
    <div className={`bg-white border border-slate-200 rounded-xl ${padding} flex items-center justify-center hover:border-slate-300 hover:shadow-sm transition-all`}>
      <Render />
    </div>
  );
}

Object.assign(window, { PartnerLogos, PARTNER_LIST, PartnerCard });
