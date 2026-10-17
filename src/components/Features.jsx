import { useRef } from "react";
import { TiLocationArrow } from "react-icons/ti";
import { FaDiscord } from "react-icons/fa";
import clsx from "clsx";

import LazyVideo from "./LazyVideo";
import SectionHeader from "./SectionHeader";
import Button from "./Button";
import { DISCORD_URL } from "../data/nav";
import { TEAMS, scrollToTeam } from "../data/teams";
import { prefersReducedMotion } from "../lib/motion";

// Tilt follows the cursor by writing the transform directly (no React re-render per mousemove).
// The outer div is animated by the scroll reveal; the inner one by the tilt, so they never fight.
export const BentoTilt = ({ children, className = "", innerClassName = "" }) => {
  const ref = useRef(null);

  const handleMouseMove = (event) => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const { left, top, width, height } = el.getBoundingClientRect();
    const tiltX = ((event.clientY - top) / height - 0.5) * 5;
    const tiltY = ((event.clientX - left) / width - 0.5) * -5;
    el.style.transform = `perspective(700px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(.97, .97, .97)`;
  };

  const handleMouseLeave = () => {
    if (ref.current) ref.current.style.transform = "";
  };

  return (
    <div className={clsx("reveal reveal-pop", className)}>
      <div
        ref={ref}
        className={clsx("size-full transition-transform duration-150 ease-out", innerClassName)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </div>
    </div>
  );
};

// Card with a looping clip. "Learn more" scrolls down to the team's own section.
export const TeamCard = ({ title, tagline, video, poster, target }) => {
  const cardRef = useRef(null);

  // Spotlight position lives in CSS variables, not React state.
  const handleMouseMove = (event) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--x", `${event.clientX - rect.left}px`);
    el.style.setProperty("--y", `${event.clientY - rect.top}px`);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className="group relative size-full overflow-hidden rounded-card border border-white/10 transition-[border-color,box-shadow] duration-300 hover:border-accent/70 hover:shadow-[0_0_24px_rgb(255_95_5/0.25)]"
    >
      <LazyVideo src={video} poster={poster} />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/10 to-ink/60" />
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 [background:radial-gradient(220px_circle_at_var(--x)_var(--y),rgb(255_95_5/0.18),transparent)] group-hover:opacity-100" />

      <div className="relative z-10 flex size-full flex-col justify-between p-5 md:p-7">
        <div>
          <h3 className="font-display text-4xl font-extrabold leading-[0.95] tracking-[-0.04em] text-paper lg:text-5xl xl:text-6xl">{title}</h3>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-paper/85 md:text-base">{tagline}</p>
        </div>

        <a
          href="#teams"
          onClick={(e) => {
            e.preventDefault();
            scrollToTeam(target);
          }}
          className="flex w-fit items-center gap-2 rounded-full bg-ink-700 px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-accent ring-1 ring-white/10 transition hover:bg-accent hover:text-ink active:scale-[0.98]"
        >
          <TiLocationArrow />
          Learn more
        </a>
      </div>
    </div>
  );
};

const teamById = Object.fromEntries(TEAMS.map((t) => [t.id, t]));
const cardProps = (id) => ({ ...teamById[id], target: id });

// Cards use the shared scroll reveal (src/lib/reveal.js).
const Features = () => {
  return (
    <section id="departments" className="pb-12 pt-24 md:pb-16 md:pt-32">
      <div className="mx-auto max-w-7xl px-4 md:px-10">
        <SectionHeader
          title="Find your team"
          intro="Compete in VEX U, or build your own projects in mechanical and software R&D."
        />
        <div className="reveal mb-12 mt-8 md:mb-16">
          <Button
            title="Join our Discord"
            href={DISCORD_URL}
            leftIcon={<FaDiscord className="text-base" />}
          />
        </div>

        <BentoTilt className="relative mb-6 h-[28rem] w-full md:h-[65vh]">
          <TeamCard
            title="Four teams"
            tagline="Compete with VEX U, take on R&D projects in mechanical and software, or grow the club through business and outreach."
            video="/videos/bet.mp4"
            poster="/img/posters/bet.webp"
            target="teams"
          />
        </BentoTilt>

        <div className="grid w-full grid-cols-1 gap-6 md:h-[135vh] md:grid-cols-2 md:grid-rows-3">
          <BentoTilt className="relative h-[28rem] md:row-span-2 md:h-auto">
            <TeamCard {...cardProps("vex-u")} />
          </BentoTilt>

          <BentoTilt className="relative h-96 md:h-auto">
            <TeamCard {...cardProps("rd-mechanical")} />
          </BentoTilt>

          <BentoTilt className="relative h-96 md:h-auto">
            <TeamCard {...cardProps("rd-software")} />
          </BentoTilt>

          <BentoTilt className="relative h-64 md:h-auto" innerClassName="overflow-hidden rounded-card">
            <div className="flex size-full flex-col justify-between bg-accent p-5 md:p-7">
              <h3 className="section-title max-w-64 text-ink">More coming soon.</h3>
              <TiLocationArrow className="self-end text-7xl text-ink" aria-hidden="true" />
            </div>
          </BentoTilt>

          <BentoTilt className="relative h-64 md:h-auto" innerClassName="relative overflow-hidden rounded-card border border-white/10">
            <LazyVideo src="/videos/team-match.mp4" poster="/img/posters/team-match.webp" />
          </BentoTilt>
        </div>
      </div>
    </section>
  );
};

export default Features;
