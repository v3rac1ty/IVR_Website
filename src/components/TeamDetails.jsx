import { useCallback, useEffect, useRef, useState } from "react";
import { HiCheck, HiChevronLeft, HiChevronRight } from "react-icons/hi";
import clsx from "clsx";

import { TEAMS, SELECT_TEAM_EVENT } from "../data/teams";
import { prefersReducedMotion } from "../lib/motion";

// Team carousel on the same page. Slides crossfade over full-bleed photos.
// It auto-advances (progress line under the active tab) until someone picks a team,
// and pauses on hover or when off screen. Swipe works on touch screens.
// Content comes from src/data/teams.js.
const SWIPE_THRESHOLD = 50; // px
const AUTOPLAY_MS = 8000;

const TeamDetails = () => {
  const [active, setActive] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [inView, setInView] = useState(false);
  const [reduceMotion] = useState(prefersReducedMotion);
  const sectionRef = useRef(null);
  const swipeStart = useRef(null);
  const videoRefs = useRef([]);

  const goTo = useCallback((index) => {
    setActive((index + TEAMS.length) % TEAMS.length);
  }, []);

  // Any manual choice stops auto-advance so the reader stays in control.
  const choose = useCallback(
    (index) => {
      setAutoplay(false);
      goTo(index);
    },
    [goTo]
  );

  // "Learn more" buttons elsewhere on the page ask for a specific team.
  useEffect(() => {
    const onSelect = (e) => {
      const i = TEAMS.findIndex((t) => t.id === e.detail);
      if (i >= 0) choose(i);
    };
    window.addEventListener(SELECT_TEAM_EVENT, onSelect);
    return () => window.removeEventListener(SELECT_TEAM_EVENT, onSelect);
  }, [choose]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.4 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Horizontal swipe on touch/pen; vertical page scrolling is left alone (touch-action: pan-y).
  const onPointerDown = (e) => {
    if (e.pointerType === "mouse") return;
    swipeStart.current = { x: e.clientX, y: e.clientY };
  };
  const onPointerUp = (e) => {
    const start = swipeStart.current;
    swipeStart.current = null;
    if (!start) return;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy)) choose(active + (dx < 0 ? 1 : -1));
  };

  useEffect(() => {
    videoRefs.current.forEach((video, i) => {
      if (!video) return;
      if (i === active && inView && !reduceMotion) video.play().catch(() => {});
      else video.pause();
    });
  }, [active, inView, reduceMotion]);

  const running = autoplay && !reduceMotion && inView && !hovered;

  // Staggered entrance for slide content: each piece fades up a little after the last.
  const enter = (isActive, delay) => ({
    className: clsx(
      "transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none",
      isActive ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
    ),
    style: { transitionDelay: isActive ? `${delay}ms` : "0ms" },
    delay,
  });

  // Cursor glow position for the card.
  const handleGlow = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    card.style.setProperty("--my", `${e.clientY - rect.top}px`);
    card.style.setProperty("--px", ((e.clientX - rect.left) / rect.width - 0.5).toFixed(3));
    card.style.setProperty("--py", ((e.clientY - rect.top) / rect.height - 0.5).toFixed(3));
  };

  return (
    <section
      id="teams"
      ref={sectionRef}
      aria-roledescription="carousel"
      aria-label="Our teams"
      className="w-full scroll-mt-20 bg-ink pb-24 md:pb-32"
    >
      <div className="mx-auto max-w-7xl px-4 md:px-10">
        <div className="reveal carousel-ring rounded-card shadow-[0_30px_80px_-20px_rgb(255_95_5/0.3)]">
        <div
          className="group/car relative touch-pan-y overflow-hidden rounded-[calc(1rem-1.5px)] bg-ink-800"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onMouseMove={handleGlow}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerCancel={() => (swipeStart.current = null)}
        >
          {/* All slides share one grid cell, so the card is as tall as the tallest slide. */}
          <div className="grid">
            {TEAMS.map((team, i) => {
              const isActive = active === i;
              let step = 0;
              const next = () => enter(isActive, 250 + 70 * step++);
              const bar = next();
              const title = next();
              return (
                <article
                  key={team.id}
                  id={`team-slide-${team.id}`}
                  role="tabpanel"
                  aria-roledescription="slide"
                  aria-label={`${i + 1} of ${TEAMS.length}: ${team.title}`}
                  inert={isActive ? undefined : ""}
                  aria-hidden={isActive ? undefined : true}
                  className={clsx(
                    "relative overflow-hidden transition-opacity duration-500 [grid-area:1/1] md:min-h-[40rem]",
                    isActive ? "z-10 opacity-100" : "pointer-events-none opacity-0 delay-300"
                  )}
                >
                  {team.image && (
                    <div
                      className="relative h-60 overflow-hidden transition-[clip-path] duration-[1100ms] ease-[cubic-bezier(0.77,0,0.18,1)] motion-reduce:transition-none sm:h-72 md:absolute md:inset-0 md:h-auto"
                      style={{ clipPath: isActive ? "inset(0 0 0 0)" : "inset(0 0 0 100%)" }}
                    >
                      <div
                        className={clsx(
                          "relative size-full transition-transform duration-[8000ms] ease-out motion-reduce:transition-none",
                          isActive ? "scale-100" : "scale-125"
                        )}
                      >
                        <div className="carousel-parallax absolute inset-0">
                          <img
                            src={team.image}
                            alt={team.imageAlt || ""}
                            width={1280}
                            height={720}
                            className="absolute inset-0 size-full object-cover"
                            loading="lazy"
                            decoding="async"
                          />
                          {team.slideVideo && (
                            <video
                              ref={(el) => (videoRefs.current[i] = el)}
                              src={team.slideVideo}
                              poster={team.image}
                              muted
                              loop
                              playsInline
                              preload="none"
                              aria-hidden="true"
                              className="absolute inset-0 size-full object-cover"
                            />
                          )}
                        </div>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-ink-800 via-ink-800/20 to-transparent md:bg-gradient-to-r md:from-ink md:via-ink/80 md:to-transparent" />
                      <div className="absolute inset-0 bg-gradient-to-tr from-accent/25 via-transparent to-transparent mix-blend-screen" />
                    </div>
                  )}

                  {/* Oversized outlined team name drifting in behind the copy */}
                  <span
                    aria-hidden="true"
                    className={clsx(
                      "pointer-events-none absolute -bottom-4 right-4 hidden select-none whitespace-nowrap font-display text-[11rem] font-extrabold leading-none -tracking-wider text-transparent transition-all duration-[1400ms] ease-out [-webkit-text-stroke:1.5px_rgb(255_255_255/0.1)] motion-reduce:transition-none md:block lg:text-[14rem]",
                      isActive ? "translate-x-0 opacity-100" : "translate-x-32 opacity-0"
                    )}
                  >
                    {team.title}
                  </span>

                  <div className="relative p-6 md:max-w-2xl md:p-12 lg:p-14">
                    <span style={bar.style} className={clsx(bar.className, "block h-1 w-12 rounded-full bg-accent")} />
                    <h3 className="mt-5 font-display text-4xl font-extrabold leading-[0.95] tracking-[-0.04em] text-paper sm:text-5xl md:text-7xl">
                      <span className="sr-only">{team.title}</span>
                      <span aria-hidden="true">
                        {[...team.title].map((ch, k) => (
                          <span key={k} className="inline-block overflow-hidden pb-[0.06em] align-bottom">
                            <span
                              className={clsx(
                                "inline-block transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none",
                                isActive ? "translate-y-0" : "translate-y-[115%]"
                              )}
                              style={{ transitionDelay: isActive ? `${title.delay + k * 35}ms` : "0ms" }}
                            >
                              {ch === " " ? " " : ch}
                            </span>
                          </span>
                        ))}
                      </span>
                    </h3>
                    {team.intro?.map((p) => {
                      const e = next();
                      return (
                        <p
                          key={p}
                          style={e.style}
                          className={clsx(e.className, "mt-5 max-w-[55ch] text-lg leading-relaxed text-paper/85")}
                        >
                          {p}
                        </p>
                      );
                    })}

                    {team.lists?.map((list) => {
                      const h = next();
                      return (
                        <div key={list.heading} className="mt-8">
                          <h4
                            style={h.style}
                            className={clsx(h.className, "text-sm font-bold uppercase tracking-wide text-accent")}
                          >
                            {list.heading}
                          </h4>
                          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                            {list.items.map((item) => {
                              const e = next();
                              return (
                                <li
                                  key={item}
                                  style={e.style}
                                  className={clsx(
                                    e.className,
                                    "flex gap-2.5 rounded-lg border border-white/10 bg-ink/60 p-3 text-sm text-paper backdrop-blur-sm hover:border-accent/50"
                                  )}
                                >
                                  <HiCheck className="mt-0.5 shrink-0 text-accent" aria-hidden="true" />
                                  <span>{item}</span>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      );
                    })}
                  </div>
                </article>
              );
            })}
          </div>

          {/* Cursor glow over the whole card */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-20 opacity-0 mix-blend-screen transition-opacity duration-300 group-hover/car:opacity-100"
            style={{
              background:
                "radial-gradient(520px circle at var(--mx, 50%) var(--my, 50%), rgb(255 130 50 / 0.16), transparent 50%)",
            }}
          />

          {/* Controls: team tabs with a progress line, plus arrows */}
          <div className="relative z-30 flex items-stretch border-t border-white/10 bg-ink/80 backdrop-blur-md">
            <div className="flex flex-1" role="tablist" aria-label="Choose a team">
              {TEAMS.map((team, i) => {
                const isActive = active === i;
                return (
                  <button
                    key={team.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-controls={`team-slide-${team.id}`}
                    onClick={() => choose(i)}
                    className={clsx(
                      "relative flex flex-1 items-center justify-center gap-3 px-2 py-4 text-center text-xs font-bold leading-tight transition-colors sm:justify-start sm:whitespace-nowrap sm:px-5 sm:text-left sm:text-sm lg:px-6 lg:text-base",
                      isActive
                        ? "bg-gradient-to-b from-accent/10 to-transparent text-paper"
                        : "text-paper-muted hover:bg-white/5 hover:text-paper"
                    )}
                  >
                    {team.image && (
                      <img
                        src={team.image}
                        alt=""
                        width={40}
                        height={40}
                        className={clsx(
                          "hidden size-10 shrink-0 rounded-full object-cover ring-2 transition sm:block",
                          isActive ? "ring-accent" : "opacity-60 ring-white/10"
                        )}
                        loading="lazy"
                        decoding="async"
                      />
                    )}
                    {team.title}
                    <span className="absolute inset-x-0 top-0 h-0.5 bg-white/10" aria-hidden="true">
                      {isActive && (
                        <span
                          key={`${active}-${autoplay}`}
                          className="block size-full origin-left bg-accent shadow-[0_0_12px_rgb(255_95_5/0.8)]"
                          style={
                            autoplay && !reduceMotion
                              ? {
                                  animation: `team-progress ${AUTOPLAY_MS}ms linear forwards`,
                                  animationPlayState: running ? "running" : "paused",
                                }
                              : undefined
                          }
                          onAnimationEnd={() => goTo(active + 1)}
                        />
                      )}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="hidden border-l border-white/10 sm:flex">
              <button
                type="button"
                onClick={() => choose(active - 1)}
                aria-label="Previous team"
                className="flex w-12 items-center justify-center text-xl text-paper transition hover:bg-accent hover:text-ink active:scale-95 sm:w-16"
              >
                <HiChevronLeft />
              </button>
              <button
                type="button"
                onClick={() => choose(active + 1)}
                aria-label="Next team"
                className="flex w-12 items-center justify-center border-l border-white/10 text-xl text-paper transition hover:bg-accent hover:text-ink active:scale-95 sm:w-16"
              >
                <HiChevronRight />
              </button>
            </div>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
};

export default TeamDetails;
