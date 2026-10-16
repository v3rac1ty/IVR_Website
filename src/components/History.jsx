import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import clsx from "clsx";

import SectionHeader from "./SectionHeader";
import StatRow from "./StatRow";
import { HISTORY_STATS, SEASONS } from "../data/history";
import { gsap, prefersReducedMotion } from "../lib/motion";

// "Our story": headline, big numbers, then a season timeline whose line fills as you scroll.
// Content comes from src/data/history.js.
const History = () => {
  const listRef = useRef(null);
  const fillRef = useRef(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.fromTo(
        fillRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: listRef.current,
            start: "top 65%",
            end: "bottom 55%",
            scrub: true,
            refreshPriority: -1, // measure after the pinned About section above
          },
        }
      );
    },
    { scope: listRef }
  );

  return (
    <section id="history" className="w-full bg-ink py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 md:px-10">
        <SectionHeader
          title="Five seasons. Five World Championships."
          intro="Every season since 2021, first as iCTRL and now as Illini VEX Robotics, we've made it to the World Championship. Now we're chasing number six."
        />

        <div className="mt-20 md:mt-28">
          <StatRow stats={HISTORY_STATS} />
        </div>

        <ol ref={listRef} className="relative mt-24 md:mt-32">
          {/* Timeline line: faint track plus an orange fill driven by scroll */}
          <span aria-hidden="true" className="absolute inset-y-2 left-[7px] w-px bg-white/10 md:left-[calc(14rem+7px)]" />
          <span
            ref={fillRef}
            aria-hidden="true"
            className="absolute inset-y-2 left-[7px] w-px origin-top bg-accent shadow-[0_0_8px_rgb(255_95_5/0.8)] md:left-[calc(14rem+7px)]"
          />

          {SEASONS.map((season, i) => (
            <li
              key={season.years}
              className="reveal relative grid gap-3 pb-14 pl-10 last:pb-0 md:grid-cols-[14rem_1fr] md:gap-12 md:pl-0"
              style={{ "--reveal-delay": `${Math.min(i, 2) * 80}ms` }}
            >
              <div className="md:pr-6 md:text-right">
                <p className="text-keynote whitespace-nowrap font-display text-4xl font-extrabold leading-none tracking-[-0.04em] lg:text-5xl">
                  {season.years}
                </p>
                <p className="mt-2 text-sm font-semibold text-accent">{season.game}</p>
              </div>

              {/* Marker on the line */}
              <span
                aria-hidden="true"
                className={clsx(
                  "absolute left-0 top-2 size-[15px] rounded-full border-2 md:left-56",
                  season.current
                    ? "border-accent bg-accent shadow-[0_0_0_6px_rgb(255_95_5/0.2)] motion-safe:animate-pulse"
                    : season.highlight
                      ? "border-accent bg-ink shadow-[0_0_12px_rgb(255_95_5/0.7)]"
                      : "border-white/30 bg-ink"
                )}
              />

              <div className="md:pl-8">
                <h3 className="font-display text-2xl font-extrabold tracking-tight text-paper md:text-3xl">
                  {season.title}
                </h3>
                <p className="mt-2 max-w-2xl text-lg leading-relaxed text-paper-muted">{season.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default History;
