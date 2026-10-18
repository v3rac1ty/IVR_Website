import clsx from "clsx";

import LazyVideo from "./LazyVideo";
import SectionHeader from "./SectionHeader";

// ==========================================
// MANUFACTURING - edit capabilities and printers here
// ==========================================
const MAKERSPACE = "the Shop, the Siebel Center for Design makerspace";

// `specs` render as label/value rows under the description.
const CUTTING = [
  {
    id: "waterjet",
    eyebrow: "Waterjet cutting",
    title: "Metal parts, cut to shape.",
    text: `Automated 2D cuts straight from CAD, on the waterjet in ${MAKERSPACE}.`,
    specs: [
      ["Machine", "OMAX 2652"],
    ],
    video: "/videos/mfg-waterjet-sdr.mp4",
    poster: "/img/manufacturing/waterjet-sdr.webp",
  },
  {
    id: "laser",
    eyebrow: "Laser cutting & engraving",
    title: "Precise flat parts, fast.",
    text: `Thin plates and quick prototypes are cut, and designs engraved, on the laser, also in ${MAKERSPACE}.`,
    specs: [
      ["Machine", "Trotec Speedy 400 flexx"],
    ],
    video: "/videos/mfg-laser-sdr.mp4",
    poster: "/img/manufacturing/laser-sdr.webp",
  },
];

// Our own printers: Bambu Lab first, the others share the bottom row.
// `note` and `count` (how many we have, default 1) are optional.
const PRINTERS = [
  { name: "Bambu Lab P2S", note: "with AMS" },
  { name: "Bambu Lab A1", note: "with AMS Lite", count: 2 },
  { name: "Bambu Lab P1P" },
  { name: "Bambu Lab A1 mini" },
  { name: "QIDI Q2" },
  { name: "Elegoo Centauri Carbon" },
];
const BAMBU_COUNT = PRINTERS.filter((p) => p.name.startsWith("Bambu")).length;
const PRINTER_TOTAL = PRINTERS.reduce((sum, p) => sum + (p.count ?? 1), 0);

const Manufacturing = () => (
  <section id="manufacturing" className="relative z-10 w-full py-24 md:py-32">
    {/* z-10 keeps this above the Cornfield Clash glow, whose soft edge reaches up into this section */}
    <div className="mx-auto max-w-7xl px-4 md:px-10">
      <SectionHeader
        title="Made in-house."
        intro="From raw sheet to finished part, we cut and print our robots ourselves, so designs go from CAD to the field fast."
      />

      <div className="mt-12 grid gap-6 md:mt-16 md:grid-cols-2">
        {CUTTING.map((item, i) => (
          <article
            key={item.id}
            className="reveal group flex flex-col overflow-hidden rounded-card border border-white/10 bg-ink-800"
            style={{ "--reveal-delay": `${i * 90}ms` }}
          >
            <div className="relative aspect-[16/10] overflow-hidden">
              <LazyVideo
                src={item.video}
                poster={item.poster}
                className="transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink-800 to-transparent" />
            </div>
            {/* Column layout pins the machine row to the bottom, so both cards' rows line up */}
            <div className="flex flex-1 flex-col p-6 md:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">{item.eyebrow}</p>
              <h3 className="mt-3 font-display text-2xl font-extrabold tracking-tight text-paper md:text-3xl">{item.title}</h3>
              <p className="mt-3 max-w-md leading-relaxed text-paper-muted">{item.text}</p>
              <dl className="mt-auto grid gap-2 pt-6 text-sm">
                {item.specs.map(([label, value]) => (
                  <div
                    key={label}
                    className="flex items-center justify-between gap-4 rounded-lg border border-white/10 bg-ink px-4 py-3"
                  >
                    <dt className="text-xs font-semibold uppercase tracking-wide text-paper-muted">{label}</dt>
                    <dd className="text-right font-semibold text-paper">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </article>
        ))}

        {/* 3D printing: our own printers */}
        <article className="reveal group grid overflow-hidden rounded-card border border-white/10 bg-ink-800 md:col-span-2 md:grid-cols-[2fr_3fr]">
          <div className="relative aspect-[16/10] overflow-hidden md:aspect-auto">
            <LazyVideo
              src="/videos/mfg-printing.mp4"
              poster="/img/manufacturing/printing.webp"
              className="transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-800 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-ink-800" />
          </div>

          <div className="p-6 md:p-10">
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">3D printing</p>
                <h3 className="mt-3 font-display text-2xl font-extrabold tracking-tight text-paper md:text-3xl">
                  Our own print farm.
                </h3>
              </div>
              <p className="shrink-0 text-right">
                <span className="text-keynote block font-display text-5xl font-extrabold leading-none tracking-[-0.04em] md:text-6xl">
                  {PRINTER_TOTAL}
                </span>
                <span className="mt-1 block text-xs font-semibold uppercase tracking-wide text-paper-muted">printers</span>
              </p>
            </div>
            <p className="mt-3 max-w-lg leading-relaxed text-paper-muted">
              Brackets, mounts and prototypes print in-house, including multi-material parts on the AMS.
            </p>

            <ul className="mt-6 grid gap-2 sm:grid-cols-2">
              {PRINTERS.map((p, i) => (
                <li
                  key={`${p.name}-${p.note ?? ""}`}
                  className={clsx(
                    "flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-ink px-4 py-3 text-sm",
                    // An odd Bambu count: the last one spans the row so the others pair up on the bottom row.
                    BAMBU_COUNT % 2 === 1 && i === BAMBU_COUNT - 1 && "sm:col-span-2"
                  )}
                >
                  <span className="font-semibold text-paper">
                    {p.name}
                    {p.count > 1 && <span className="ml-1.5 text-paper-muted">×{p.count}</span>}
                  </span>
                  {p.note && <span className="shrink-0 text-xs font-semibold text-accent">{p.note}</span>}
                </li>
              ))}
            </ul>
          </div>
        </article>
      </div>
    </div>
  </section>
);

export default Manufacturing;
