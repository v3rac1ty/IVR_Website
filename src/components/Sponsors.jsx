import { useState } from "react";
import clsx from "clsx";

import SectionHeader from "./SectionHeader";

// ==========================================
// PARTNERS & SPONSORS - edit lists here
// ==========================================
// Logos live in /public/img/sponsors as trimmed, transparent .webp (~640px wide).
// Leave `logo` empty to show the name instead. `big: true` gives a partner the large tile.
const UNIVERSITY_PARTNERS = [
  { name: "Siebel Center for Design", logo: "/img/sponsors/scd.webp", big: true },
  { name: "The Grainger College of Engineering", logo: "/img/sponsors/grainger.webp" },
  { name: "Engineering Design Council", logo: "/img/sponsors/edc.webp" },
  { name: "Mechanical Science & Engineering", logo: "/img/sponsors/mechse.webp" },
  { name: "SORF", logo: "/img/sponsors/sorf.webp" },
];

// Tiers with no items show a "your logo here" slot that links to the contact form.
const SPONSOR_TIERS = [
  {
    id: "platinum",
    title: "Platinum",
    description: "Lead Partner",
    items: [{ name: "Prismier", logo: "/img/sponsors/prismier.webp" }],
  },
  {
    id: "gold",
    title: "Gold",
    description: "Gold Sponsors",
    items: [],
  },
  {
    id: "silver",
    title: "Silver",
    description: "One-time major sponsors",
    items: [
      { name: "Eaton", logo: "/img/sponsors/eaton.webp" },
      { name: "Molex", logo: "/img/sponsors/molex.webp" },
      { name: "Boeing", logo: "/img/sponsors/boeing.webp" },
    ],
  },
  {
    id: "bronze",
    title: "Bronze",
    description: "One-time sponsors",
    items: [
      { name: "MAGNA / Nascote Industries Inc.", logo: "/img/sponsors/magna.webp" },
      { name: "BP", logo: "/img/sponsors/bp.webp" },
      { name: "QIDI", logo: "/img/sponsors/qidi.webp" },
    ],
  },
];
// ==========================================

const LogoTile = ({ name, logo, className, imgClassName }) => {
  const [failed, setFailed] = useState(false);

  return (
    <div
      className={clsx(
        "flex items-center justify-center rounded-card border border-white/10 bg-ink-800 p-6 text-center transition duration-300 hover:-translate-y-0.5 hover:border-accent/60",
        className
      )}
    >
      {failed || !logo ? (
        <span className="font-semibold leading-snug text-paper">{name}</span>
      ) : (
        <img
          src={logo}
          alt={name}
          className={clsx("h-auto w-auto select-none object-contain", imgClassName)}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
};

const EmptySlot = ({ tier }) => (
  <a
    href="#contact"
    onClick={(e) => {
      e.preventDefault();
      document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
    }}
    className="flex h-32 w-full items-center justify-center rounded-card border border-dashed border-white/20 px-6 text-center text-sm text-paper-muted transition hover:border-accent hover:text-accent"
  >
    Your logo here. Become a {tier} sponsor.
  </a>
);

// SCD gets a 2x2 tile; the other four fill the 2x2 block beside it.
const UniversityPartners = () => (
  <div className="reveal rounded-card bg-ink-700 p-5 md:p-10">
    <SectionHeader as="h3" size="md" title="University Partners" />
    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2">
      {UNIVERSITY_PARTNERS.map((p) => (
        <LogoTile
          key={p.name}
          {...p}
          className={p.big ? "min-h-60 sm:col-span-2 lg:row-span-2" : "h-36"}
          imgClassName={p.big ? "max-h-48 max-w-[80%]" : "max-h-24 max-w-full"}
        />
      ))}
    </div>
  </div>
);

const SponsorTier = ({ id, title, description, items }) => {
  const featured = id === "platinum";

  return (
    <div
      className={clsx(
        "reveal group relative grid gap-6 overflow-hidden rounded-card px-5 py-8 md:grid-cols-[16rem_1fr] md:gap-10 md:px-10",
        featured ? "border border-white/15 bg-ink-800 py-10" : "border-t border-white/10"
      )}
    >
      {featured && (
        <>
          {/* Brushed-metal texture plus a one-shot sheen on hover */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-20 mix-blend-overlay transition-opacity duration-700 group-hover:opacity-40"
            style={{ backgroundImage: "url('/img/opt/metal-texture.webp')" }}
          />
          <div aria-hidden="true" className="sponsor-sheen pointer-events-none absolute inset-0" />
        </>
      )}

      <div className="relative">
        <h3
          className={clsx(
            "text-paper",
            featured
              ? "font-title text-4xl uppercase lg:text-5xl"
              : "font-general text-2xl font-extrabold tracking-tight md:text-3xl"
          )}
        >
          {title}
        </h3>
        <p className={clsx("mt-2", featured ? "font-semibold text-accent" : "text-paper-muted")}>{description}</p>
      </div>

      <div className={clsx("relative grid gap-4", featured ? "grid-cols-1" : "grid-cols-2 lg:grid-cols-3")}>
        {items.length === 0 ? (
          <EmptySlot tier={title} />
        ) : (
          items.map((item) => (
            <LogoTile
              key={item.name}
              {...item}
              className={featured ? "h-40 max-w-md" : "h-32"}
              imgClassName={featured ? "max-h-24 max-w-[min(100%,340px)]" : "max-h-16 max-w-[min(100%,200px)]"}
            />
          ))
        )}
      </div>
    </div>
  );
};

const Sponsors = () => (
  <section id="sponsors" className="w-full bg-ink py-24 text-paper md:py-32">
    <div className="mx-auto max-w-7xl px-4 md:px-10">
      <SectionHeader
        title="Partners & Sponsors"
        intro="The campus partners and companies who fund our robots, travel, and outreach across Illinois."
        className="mb-12 md:mb-16"
      />

      <UniversityPartners />

      <SectionHeader as="h3" size="md" title="Sponsors" className="mb-8 mt-20 md:mt-28" />
      <div className="flex flex-col gap-2">
        {SPONSOR_TIERS.map((tier) => (
          <SponsorTier key={tier.id} {...tier} />
        ))}
      </div>
    </div>
  </section>
);

export default Sponsors;
