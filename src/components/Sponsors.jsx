import { useState } from "react";

// Single data structure for easy add/remove (similar to EVENTS)
// To use a logo: set `logo: "/img/sponsors/your-logo.png"`
// To force text-only: set `textOnly: true` or leave `logo` empty
const SPONSOR_TIERS = [
  {
    id: "orange-blue",
    title: "ORANGE & BLUE",
    description: "Campus Partners",
    items: [
      { name: "Electrical & Computer Engineering", logo: "/img/sponsors/ece.png" },
      { name: "Mechanical Science & Engineering", logo: "/img/sponsors/mechse.png" },
      { name: "SORF", logo: "/img/sponsors/sorf.png" },
      { name: "Human Dynamics & Controls Lab", logo: "/img/sponsors/hdcl.png" },
      { name: "Engineering Design Council", logo: "/img/sponsors/edc.png" },
      { name: "Siebel Center for Design", logo: "/img/sponsors/scd.png" },
    ],
  },
  {
    id: "platinum",
    title: "PLATINUM",
    description: "",
    items: [
      { name: "Prismier", logo: "/img/sponsors/prismier.png" },
    ],
  },
  {
    id: "bronze",
    title: "BRONZE",
    description: "Supporting Sponsors",
    items: [
      { name: "Polymaker", logo: "/img/sponsors/polymaker.png" },
      { name: "MAGNA / Nascote Industries Inc.", logo: "/img/sponsors/magna.png" },
    ],
  },
];

const SponsorLogo = ({ name, logo, textOnly, variant }) => {
  const [failed, setFailed] = useState(false);
  const showText = textOnly || failed || !logo;
  const isPlatinum = variant === "platinum";

  // Text-only fallback card
  if (showText) {
    return (
      <div
        className={`relative flex ${isPlatinum ? 'h-40 w-[420px]' : 'h-32 w-80'} items-center justify-center rounded-2xl ${isPlatinum ? 'border border-slate-300/20 bg-gradient-to-r from-slate-400/6 to-gray-400/6' : 'border border-white/10 bg-white/5'} px-6 text-center text-sm font-medium text-white transition transform hover:scale-105 ${isPlatinum ? 'shadow-2xl' : ''}`}>
        {name}
        {isPlatinum && <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-slate-400/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />}
      </div>
    );
  }

  return (
    <div className="relative group">
      <div className={`absolute inset-0 rounded-2xl blur-lg opacity-0 group-hover:opacity-75 transition-opacity duration-300 ${isPlatinum ? 'bg-gradient-to-r from-slate-300/40 via-gray-300/30 to-white/20' : 'bg-gradient-to-r from-blue-500/20 to-transparent'}`} />
      <div
        className={`relative flex ${isPlatinum ? 'h-40 w-[420px]' : 'h-32 w-80'} items-center justify-center rounded-2xl px-6 transition-all duration-300 transform hover:scale-110 ${isPlatinum ? 'bg-gradient-to-r from-slate-400/8 via-gray-300/8 to-slate-400/8 shadow-2xl ring-1 ring-slate-300/20 hover:ring-slate-300/40' : 'bg-white/5 hover:shadow-2xl hover:ring-1 hover:ring-white/20'}`}>
        <img
          src={logo}
          alt={name}
          className={`select-none object-contain ${isPlatinum ? 'max-h-36 max-w-[360px]' : 'max-h-28 max-w-[260px] w-auto'}`}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
        />
      </div>
    </div>
  );
};

const SponsorTier = ({ title, description, items, id }) => {
  // Center single-item tiers (platinum) and keep multi-item tiers evenly spaced
  const isSingle = items.length === 1;
  const isPlatinum = id === "platinum";

  return (
    <div className={`mx-auto max-w-6xl ${isPlatinum ? 'py-16' : 'py-12'}`}>
      <div className="text-center">
        <h3 className={`mb-3 animate-in fade-in slide-in-from-bottom-2 ${isPlatinum ? 'text-5xl' : 'text-3xl'} font-title tracking-widest text-white ${isPlatinum ? 'drop-shadow-lg' : ''}`}>{title}</h3>
        {isPlatinum && (
          <div className="mx-auto mb-6 inline-block rounded-full bg-gradient-to-r from-slate-300/30 via-gray-300/25 to-slate-400/20 px-5 py-2 text-sm font-bold text-slate-100 ring-1 ring-slate-300/30 animate-pulse">✨ Lead Partner ✨</div>
        )}
        {description && (
          <p className={`mb-8 ${isPlatinum ? 'text-lg font-semibold text-slate-100/90' : 'text-base text-blue-100/75'}`}>{description}</p>
        )}
      </div>

      <div className={`flex flex-wrap ${isSingle ? 'justify-center' : 'justify-center'} gap-10 px-6`}>
        {items.map((item, idx) => (
          <div key={`${title}-${idx}`} className="flex items-center justify-center animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: `${idx * 100}ms` }}>
            <SponsorLogo name={item.name} logo={item.logo} textOnly={item.textOnly} variant={id} />
          </div>
        ))}
      </div>
    </div>
  );
};

const Sponsors = () => {
  return (
    <section id="sponsors" className="relative w-screen overflow-hidden bg-black py-24 text-blue-100">
      {/* Animated background gradient overlay */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-yellow-400/20 to-orange-400/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-500/10 to-purple-600/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 z-10">
        <div className="text-center mb-16">
          <h2 className="text-center text-6xl font-title text-white drop-shadow-2xl animate-in fade-in slide-in-from-top-4">SPONSORS</h2>
          <div className="mx-auto mt-6 h-1.5 w-40 rounded-full bg-gradient-to-r from-[#FF5F05] via-yellow-400 to-[#FF5F05] animate-pulse shadow-lg" />
        </div>

        {SPONSOR_TIERS.map((tier, idx) => (
          <div key={tier.id} className="relative">
            {/* Enhanced tier panel with borders and glow effects */}
            <div className={`relative rounded-2xl overflow-hidden ${tier.id === 'orange-blue' ? 'bg-gradient-to-r from-[#071a2b]/50 via-[#0a2847]/40 to-[#071a2b]/50 ring-1 ring-blue-400/20' : tier.id === 'platinum' ? 'bg-gradient-to-r from-slate-400/8 via-gray-300/6 to-slate-400/5 ring-2 ring-slate-300/30 shadow-2xl shadow-slate-500/20' : 'bg-transparent'} px-4 ${tier.id === 'platinum' ? 'py-16' : 'py-10'}`}>
              {/* Glow effect for platinum */}
              {tier.id === 'platinum' && (
                <div className="absolute inset-0 bg-gradient-to-r from-slate-400/0 via-gray-300/10 to-slate-400/0 opacity-0 hover:opacity-100 transition-opacity duration-300" />
              )}
              <SponsorTier {...tier} />
            </div>

            {/* Enhanced decorative divider between tiers */}
            {idx !== SPONSOR_TIERS.length - 1 && (
              <div className="my-12">
                <div
                  className="mx-auto w-full opacity-50"
                  style={{
                    height: 16,
                    background: tier.id === 'orange-blue' 
                      ? 'repeating-linear-gradient(45deg, rgba(255,95,5,0.15) 0 16px, transparent 16px 32px)' 
                      : 'repeating-linear-gradient(45deg, rgba(203,213,225,0.1) 0 16px, transparent 16px 32px)',
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Bottom accent line */}
      <div className="relative mt-16 h-1 w-full bg-gradient-to-r from-transparent via-[#FF5F05] to-transparent animate-pulse shadow-lg shadow-[#FF5F05]/50" />
    </section>
  );
};

export default Sponsors;
