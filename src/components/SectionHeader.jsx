import clsx from "clsx";

// Type scale: Russo One (display) for section openers, heavy Manrope for sub-sections.
const SIZES = {
  // Section openers (Find your team, Partners & Sponsors)
  lg: "mt-5 font-title uppercase text-4xl leading-[0.95] md:text-6xl",
  // Headings inside a card or a narrow column (Contact)
  card: "mt-5 font-title uppercase text-4xl leading-[0.95] lg:text-5xl",
  // Sub-sections (schedule, University Partners, Sponsors)
  md: "mt-4 font-general font-extrabold tracking-tight text-2xl md:text-3xl",
};

// One header style for the whole site: orange accent bar, Russo One title, optional intro.
// `aside` sits on the right on wide screens (e.g. a venue note).
const SectionHeader = ({ title, intro, aside, as: Tag = "h2", size = "lg", className }) => (
  <div className={clsx("reveal", className)}>
    <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
      <div>
        <span aria-hidden="true" className="block h-1 w-12 rounded-full bg-accent" />
        <Tag className={clsx("text-paper", SIZES[size])}>{title}</Tag>
      </div>
      {aside && <p className="text-sm text-paper-muted">{aside}</p>}
    </div>
    {intro && <p className="mt-4 max-w-xl text-lg leading-relaxed text-paper-muted">{intro}</p>}
  </div>
);

export default SectionHeader;
