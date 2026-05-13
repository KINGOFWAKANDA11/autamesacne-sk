// Real partner logos
const PARTNER_LIST = [
  { id: "cofidis",    name: "Cofidis",          src: "cofidis-removebg-preview.png" },
  { id: "homecredit", name: "Home Credit",      src: "Home_Credit_logo.png" },
  { id: "essox",      name: "ESSOX",            src: "Essox-logo_transp-1.png" },
  { id: "porsche",    name: "Porsche Finance",  src: "porsche_finance-removebg-preview.png" },
  { id: "vub",        name: "VÚB Leasing",      src: "vub_leasing-removebg-preview.png" },
  { id: "ahoj",       name: "Ahoj Pôžička",     src: "ahoj-pozicka.svg" },
];

function PartnerCard({ id, size = "sm" }) {
  const partner = PARTNER_LIST.find(p => p.id === id);
  if (!partner) return null;
  const padding = size === "lg" ? "px-8 py-7" : "px-5 py-4";
  const imgH = size === "lg" ? "h-12" : "h-8";
  return (
    <div className={`bg-white border border-slate-200 rounded-xl ${padding} flex items-center justify-center hover:border-slate-300 hover:shadow-sm transition-all`}>
      <img src={partner.src} alt={partner.name} className={`${imgH} w-auto object-contain`} />
    </div>
  );
}

Object.assign(window, { PARTNER_LIST, PartnerCard });
