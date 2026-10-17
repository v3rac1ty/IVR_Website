import { useState } from "react";
import clsx from "clsx";

import SectionHeader from "./SectionHeader";
import { smoothScrollTo } from "../lib/motion";

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
          className={clsx("size-auto select-none object-contain", imgClassName)}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
};

const EmptySlot = ({ tier, className }) => (
  <a
    href="#contact"
    onClick={(e) => {
      e.preventDefault();
      smoothScrollTo(document.getElementById("contact"));
    }}
    className={clsx(
      "flex w-full items-center justify-center rounded-card border border-dashed border-white/20 px-6 text-center text-sm text-paper-muted transition hover:border-accent hover:text-accent",
      className
    )}
  >
    Your logo here. Become a {tier} sponsor.
  </a>
);

// Each tier steps down from Platinum: smaller title and logos, plainer frame, less metal.
// `metal` is the tier's color as a gradient (title text and, for the top two tiers, the border).
const TIER_STYLE = {
  platinum: {
    metal: "linear-gradient(120deg,#ffffff 0%,#c9d3e0 30%,#8e9aab 50%,#eef2f7 70%,#b8c2d0 100%)",
    // Framed by PlatinumFrame (metal border with a travelling light) instead of a plain border.
    frame: "rounded-[calc(1rem-1.5px)] bg-ink-800 px-6 py-12 md:px-12 md:py-16",
    title: "font-display text-5xl font-extrabold tracking-[-0.04em] lg:text-7xl",
    layout: "md:grid-cols-[20rem_1fr]",
    cols: "grid-cols-1",
    tile: "h-48 max-w-xl md:h-56",
    img: "max-h-28 max-w-[min(100%,400px)] md:max-h-32",
  },
  gold: {
    metal: "linear-gradient(120deg,#fff1c1 0%,#e2b54a 40%,#b8862a 60%,#f6d77a 100%)",
    frame: "border px-6 py-10 md:px-10",
    gradientBorder: true,
    title: "font-display text-4xl font-extrabold tracking-[-0.04em] lg:text-5xl",
    layout: "md:grid-cols-[17rem_1fr]",
    cols: "grid-cols-1 sm:grid-cols-2",
    tile: "h-40",
    img: "max-h-20 max-w-[min(100%,280px)]",
    empty: "h-40",
  },
  silver: {
    metal: "linear-gradient(120deg,#f1f3f5 0%,#a8adb5 60%,#d9dde2 100%)",
    frame: "border border-white/10 px-5 py-8 md:px-10",
    title: "font-general text-3xl font-extrabold tracking-tight md:text-4xl",
    layout: "md:grid-cols-[16rem_1fr]",
    cols: "grid-cols-2 lg:grid-cols-3",
    tile: "h-32",
    img: "max-h-16 max-w-[min(100%,200px)]",
    empty: "h-32",
  },
  bronze: {
    metal: "linear-gradient(120deg,#f0c39f 0%,#b0703f 60%,#d99a6c 100%)",
    frame: "border-t border-white/10 px-5 py-7 md:px-10",
    title: "font-general text-2xl font-extrabold tracking-tight md:text-3xl",
    layout: "md:grid-cols-[16rem_1fr]",
    cols: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
    tile: "h-24",
    img: "max-h-12 max-w-[min(100%,160px)]",
    empty: "h-24",
  },
};

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

// Platinum's frame: a 1.5px metal border with a beam of light that keeps travelling around it.
// The beam is a rotating conic gradient behind the card (transform-only, so it runs on the GPU).
const PlatinumFrame = ({ metal, children }) => (
  <div
    className="reveal relative overflow-hidden rounded-card p-[1.5px] shadow-[0_0_60px_-12px_rgb(201_211_224/0.35)]"
    style={{ backgroundImage: metal }}
  >
    <div aria-hidden="true" className="platinum-beam pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[115%]" />
    {children}
  </div>
);

const SponsorTier = ({ id, title, description, items }) => {
  const style = TIER_STYLE[id] ?? TIER_STYLE.bronze;
  const featured = id === "platinum";

  const card = (
    <div
      className={clsx(
        "group relative grid gap-6 overflow-hidden md:gap-10",
        !featured && "reveal rounded-card",
        style.layout,
        style.frame,
        style.gradientBorder && "border-transparent"
      )}
      // Top tiers: a metal-colored gradient border (card fill on the padding box, metal on the border box).
      style={
        style.gradientBorder
          ? { background: `linear-gradient(#0e1828,#0e1828) padding-box, ${style.metal} border-box` }
          : undefined
      }
    >
      {featured && (
        <>
          {/* Brushed metal, a soft light from the top corner, and a one-shot sheen on hover */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-25 mix-blend-overlay transition-opacity duration-700 group-hover:opacity-40"
            style={{ backgroundImage: "url('/img/opt/metal-texture.webp')" }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_80%_at_0%_0%,rgb(220_228_240/0.16),transparent)]"
          />
          <div aria-hidden="true" className="sponsor-sheen pointer-events-none absolute inset-0" />
        </>
      )}

      <div className="relative">
        {/* Metal-colored title (gradient clipped to the text); Platinum's also catches a passing shine */}
        <h3
          className={clsx("bg-clip-text pb-1 text-transparent", style.title, featured && "platinum-title")}
          style={{
            backgroundImage: featured
              ? `linear-gradient(110deg,transparent 40%,rgb(255 255 255/0.95) 50%,transparent 60%), ${style.metal}`
              : style.metal,
          }}
        >
          {title}
        </h3>
        <p className={clsx("mt-2", featured ? "font-semibold text-accent" : "text-paper-muted")}>{description}</p>
      </div>

      <div className={clsx("relative grid gap-4", style.cols)}>
        {items.length === 0 ? (
          <EmptySlot tier={title} className={style.empty} />
        ) : (
          items.map((item) => (
            <LogoTile key={item.name} {...item} className={style.tile} imgClassName={style.img} />
          ))
        )}
      </div>
    </div>
  );

  return featured ? <PlatinumFrame metal={style.metal}>{card}</PlatinumFrame> : card;
};

const Sponsors = () => (
  <section id="sponsors" className="w-full py-24 text-paper md:py-32">
    <div className="mx-auto max-w-7xl px-4 md:px-10">
      <SectionHeader
        title="Partners & Sponsors"
        intro="The campus partners and companies who fund our robots, travel, and outreach across Illinois."
        className="mb-12 md:mb-16"
      />

      <UniversityPartners />

      <SectionHeader as="h3" size="md" title="Sponsors" className="mb-8 mt-20 md:mt-28" />
      <div className="flex flex-col gap-4">
        {SPONSOR_TIERS.map((tier) => (
          <SponsorTier key={tier.id} {...tier} />
        ))}
      </div>
    </div>
  </section>
);

export default Sponsors;
