import { useState } from "react";
import clsx from "clsx";

// Single data structure for easy add/remove (similar to EVENTS)
// To use a logo: set `logo: "/img/sponsors/your-logo.webp"`
// To force text-only: set `textOnly: true` or leave `logo` empty
// Tiers with no items show a "your logo here" slot that links to the contact form.
const SPONSOR_TIERS = [
  {
    id: "orange-blue",
    title: "Orange & Blue",
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
    title: "Platinum",
    description: "Lead Partner",
    items: [{ name: "Prismier", logo: "/img/sponsors/prismier.png" }],
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
    description: "Silver Sponsors",
    items: [],
  },
  {
    id: "bronze",
    title: "Bronze",
    description: "Supporting Sponsors",
    items: [
      { name: "Polymaker", logo: "/img/sponsors/polymaker.png" },
      { name: "MAGNA / Nascote Industries Inc.", logo: "/img/sponsors/magna.png" },
      { name: "BP", textOnly: true },
    ],
  },
];

const SponsorLogo = ({ name, logo, textOnly, featured }) => {
  const [failed, setFailed] = useState(false);
  const showText = textOnly || failed || !logo;

  return (
    <div
      className={clsx(
        "flex items-center justify-center rounded-card border border-white/10 bg-ink-800 px-6 text-center transition duration-300 hover:-translate-y-0.5 hover:border-accent/60",
        featured ? "h-36 w-full max-w-md" : "h-28 w-full"
      )}
    >
      {showText ? (
        <span
          className={clsx(
            "font-semibold leading-snug text-paper",
            featured ? "font-title text-3xl uppercase tracking-wide" : "text-sm"
          )}
        >
          {name}
        </span>
      ) : (
        <img
          src={logo}
          alt={name}
          className={clsx("select-none object-contain", featured ? "max-h-24 max-w-[320px]" : "max-h-16 max-w-[200px]")}
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
    className="flex h-28 w-full items-center justify-center rounded-card border border-dashed border-white/20 px-6 text-center text-sm text-paper-muted transition hover:border-accent hover:text-accent"
  >
    Your logo here. Become a {tier} sponsor.
  </a>
);

const SponsorTier = ({ id, title, description, items }) => {
  const featured = id === "platinum";

  return (
    <div
      className={clsx(
        "group relative grid gap-6 overflow-hidden rounded-card px-5 py-10 md:grid-cols-[16rem_1fr] md:gap-10 md:px-10",
        id === "orange-blue" && "bg-ink-700",
        featured && "border border-white/15 bg-ink-800"
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
        <h3 className={clsx("font-title uppercase text-paper", featured ? "text-4xl lg:text-5xl" : "text-2xl md:text-3xl")}>
          {title}
        </h3>
        {description && (
          <p className={clsx("mt-2", featured ? "font-semibold text-accent" : "text-paper-muted")}>{description}</p>
        )}
      </div>

      <div
        className={clsx(
          "relative grid gap-4",
          featured ? "grid-cols-1" : "sm:grid-cols-2 lg:grid-cols-3"
        )}
      >
        {items.length === 0 ? (
          <EmptySlot tier={title} />
        ) : (
          items.map((item) => <SponsorLogo key={item.name} {...item} featured={featured} />)
        )}
      </div>
    </div>
  );
};

const Sponsors = () => (
  <section id="sponsors" className="w-full bg-ink py-24 text-paper md:py-32">
    <div className="mx-auto max-w-7xl px-4 md:px-10">
      <div className="mb-14 max-w-2xl">
        <h2 className="section-title">Sponsors</h2>
        <p className="mt-4 text-lg leading-relaxed text-paper-muted">
          The partners who fund our robots, travel, and outreach across Illinois.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {SPONSOR_TIERS.map((tier) => (
          <SponsorTier key={tier.id} {...tier} />
        ))}
      </div>
    </div>
  </section>
);

export default Sponsors;
