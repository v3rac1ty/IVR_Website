import { useState } from "react";

// Single data structure for easy add/remove (similar to EVENTS)
// To use a logo: set `logo: "/img/sponsors/your-logo.png"`
// To force text-only: set `textOnly: true` or leave `logo` empty
const SPONSOR_TIERS = [
  {
    id: "orange-blue",
    title: "ORANGE & BLUE",
    description: "Campus partners",
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
    description: "Lead industry partner",
    items: [
      { name: "Prismier", logo: "/img/sponsors/prismier.png" },
    ],
  },
  {
    id: "bronze",
    title: "BRONZE",
    description: "Supporting sponsors",
    items: [
      { name: "Polymaker", logo: "/img/sponsors/polymaker.png" },
      { name: "MAGNA / Nascote Industries Inc.", logo: "/img/sponsors/magna.png" },
    ],
  },
];

const SponsorLogo = ({ name, logo, textOnly }) => {
  const [failed, setFailed] = useState(false);
  const showText = textOnly || failed || !logo;

  if (showText) {
    return (
      <div className="flex h-24 w-64 items-center justify-center rounded-lg border border-white/20 bg-white/5 px-4 text-center text-sm text-white">
        {name}
      </div>
    );
  }
  return (
    <div className="flex h-24 w-64 items-center justify-center rounded-lg bg-white/5 px-4">
      <img
        src={logo}
        alt={name}
        className="max-h-20 max-w-[220px] w-auto select-none object-contain"
        loading="lazy"
        decoding="async"
        onError={() => setFailed(true)}
      />
    </div>
  );
};

const SponsorTier = ({ title, description, items }) => {
  return (
    <div className="mx-auto max-w-6xl py-12">
      <h3 className="mb-2 text-center text-2xl font-title text-[#FF5F05]">{title}</h3>
      {description && (
        <p className="mb-8 text-center text-sm text-blue-100/70">{description}</p>
      )}
      <div className="flex flex-wrap items-center justify-center gap-10 px-6">
        {items.map((item, idx) => (
          <div key={`${title}-${idx}`} className="flex items-center justify-center">
            <SponsorLogo name={item.name} logo={item.logo} textOnly={item.textOnly} />
          </div>
        ))}
      </div>
    </div>
  );
};

const Sponsors = () => {
  return (
    <section id="sponsors" className="w-screen bg-black py-20 text-blue-100">
      <div className="mx-auto max-w-7xl px-5">
        <h2 className="text-center text-4xl font-title text-white">Sponsors</h2>
        <div className="mx-auto mt-4 h-1 w-24 rounded bg-[#FF5F05]" />

        {SPONSOR_TIERS.map((tier, idx) => (
          <div key={tier.id}>
            <SponsorTier {...tier} />
            {idx !== SPONSOR_TIERS.length - 1 && (
              <div className="mx-auto my-4 h-px w-2/3 bg-white/10" />
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Sponsors;
