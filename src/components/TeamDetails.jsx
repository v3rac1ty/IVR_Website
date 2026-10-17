import { useCallback, useEffect, useRef, useState } from "react";
import { HiArrowLeft, HiArrowRight, HiCheck } from "react-icons/hi";
import clsx from "clsx";

import { TEAMS, SELECT_TEAM_EVENT } from "../data/teams";
import { prefersReducedMotion } from "../lib/motion";

// Team carousel as a 3D coverflow: the active team sits front and center (its video plays),
// neighbours angle away on either side. Click a side card, use the arrows, or swipe.
// The active team's details crossfade underneath. Content comes from src/data/teams.js.
const SWIPE_THRESHOLD = 50; // px

// Where each card sits relative to the active one (-1 left, 0 center, 1 right).
// Side cards turn to face the center, sit back in depth, and dim.
const CARD_POSE = {
  0: { transform: "translate(-50%, -50%) translateZ(0) rotateY(0deg) scale(1)", opacity: 1, filter: "brightness(1)", zIndex: 30 },
  1: { transform: "translate(30%, -50%) translateZ(-140px) rotateY(52deg) scale(0.92)", opacity: 0.85, filter: "brightness(0.45)", zIndex: 20 },
  [-1]: { transform: "translate(-130%, -50%) translateZ(-140px) rotateY(-52deg) scale(0.92)", opacity: 0.85, filter: "brightness(0.45)", zIndex: 20 },
};
// Cards two or more steps away wait hidden behind the center card.
const HIDDEN_POSE = { transform: "translate(-50%, -50%) translateZ(-420px) scale(0.7)", opacity: 0, filter: "brightness(0.3)", zIndex: 10, pointerEvents: "none" };
// Before the carousel is first seen: every card waits in a tilted stack far back, then fans out into place.
const ENTRY_POSE = {
  0: { transform: "translate(-50%, -34%) translateZ(-320px) rotateX(28deg) scale(0.82)", opacity: 0, filter: "brightness(0.5)", zIndex: 30 },
  side: { transform: "translate(-50%, -38%) translateZ(-460px) rotateX(28deg) scale(0.74)", opacity: 0, filter: "brightness(0.3)", zIndex: 20 },
};
const ENTRY_MS = 1400; // entrance length; side cards follow the center one by SIDE_DELAY_MS
const SIDE_DELAY_MS = 260;
const FADE_MS = 800; // a slide's video fades in on its held first frame, then plays

// Signed distance from the active card, wrapping around the ends.
const offsetOf = (i, active, n) => {
  let d = (i - active + n) % n;
  if (d > n / 2) d -= n;
  return d;
};

const TeamDetails = () => {
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(false);
  const [reduceMotion] = useState(prefersReducedMotion);
  // entered: the one-time entrance has started; settled: it has finished (normal transitions from then on).
  const [entered, setEntered] = useState(reduceMotion);
  const [settled, setSettled] = useState(reduceMotion);
  // Slides whose video has its first frame ready (it only fades in once there's a frame to show).
  const [loaded, setLoaded] = useState(() => new Set());
  const sectionRef = useRef(null);
  const swipeStart = useRef(null);
  const videoRefs = useRef([]);
  const prevOffsets = useRef(TEAMS.map((_, i) => offsetOf(i, 0, TEAMS.length)));

  const goTo = useCallback((index) => {
    setActive((index + TEAMS.length) % TEAMS.length);
  }, []);

  // "Learn more" buttons elsewhere on the page ask for a specific team.
  useEffect(() => {
    const onSelect = (e) => {
      const i = TEAMS.findIndex((t) => t.id === e.detail);
      if (i >= 0) goTo(i);
    };
    window.addEventListener(SELECT_TEAM_EVENT, onSelect);
    return () => window.removeEventListener(SELECT_TEAM_EVENT, onSelect);
  }, [goTo]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.3 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // First time on screen: run the entrance once, then switch to the normal card transitions.
  useEffect(() => {
    if (inView && !entered) setEntered(true);
  }, [inView, entered]);
  useEffect(() => {
    if (!entered || settled) return;
    const timer = setTimeout(() => setSettled(true), ENTRY_MS + SIDE_DELAY_MS);
    return () => clearTimeout(timer);
  }, [entered, settled]);

  // Only the center card's video plays, and only while the carousel is on screen. It holds its first
  // frame while the card turns to the front and the video fades in, then starts.
  useEffect(() => {
    let timer;
    videoRefs.current.forEach((video, i) => {
      if (!video) return;
      if (i === active && inView && !reduceMotion && loaded.has(i)) {
        timer = setTimeout(() => video.play().catch(() => {}), settled ? FADE_MS + 100 : ENTRY_MS);
      } else {
        video.pause();
        // Rewind slides that aren't showing, so each one starts on its held first frame and eases into
        // motion (the clips ramp from slow to full speed at the start).
        if (i !== active && video.readyState >= 1) video.currentTime = 0;
      }
    });
    return () => clearTimeout(timer);
  }, [active, inView, reduceMotion, loaded, settled]);

  const markLoaded = (i) => setLoaded((s) => (s.has(i) ? s : new Set(s).add(i)));

  // Remember each card's position so a card wrapping from one side to the other jumps instead of sweeping across.
  const offsets = TEAMS.map((_, i) => offsetOf(i, active, TEAMS.length));
  // Only a card swapping from one visible side straight to the other (possible with 3 teams) jumps;
  // moves into or out of the hidden spot behind the center animate.
  const jumping = offsets.map((d, i) => {
    const prev = prevOffsets.current[i];
    return Math.abs(d) === 1 && Math.abs(prev) === 1 && d !== prev;
  });
  useEffect(() => {
    prevOffsets.current = offsets;
  });

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
    if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy)) goTo(active + (dx < 0 ? 1 : -1));
  };

  const team = TEAMS[active];

  return (
    <section
      id="teams"
      ref={sectionRef}
      aria-roledescription="carousel"
      aria-label="Our teams"
      className="w-full scroll-mt-20 overflow-hidden pb-24 md:pb-32"
    >
      <div className="mx-auto max-w-7xl px-4 md:px-10">
        {/* Coverflow stage */}
        <div
          className="relative mx-auto aspect-[16/9.5] touch-pan-y [perspective:1200px] sm:aspect-[16/8] lg:aspect-[16/7]"
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerCancel={() => (swipeStart.current = null)}
        >
          {/* Light that blooms behind the stage as it enters (static paint; only opacity and scale animate) */}
          <div
            aria-hidden="true"
            className={clsx(
              "pointer-events-none absolute inset-x-[8%] inset-y-[6%] rounded-full bg-[radial-gradient(closest-side,rgb(255_95_5/0.32),rgb(58_95_158/0.22)_55%,transparent)] blur-2xl transition-[opacity,transform] duration-[1600ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
              entered ? "scale-100 opacity-100" : "scale-75 opacity-0"
            )}
          />
          {TEAMS.map((t, i) => {
            const d = offsets[i];
            const isActive = d === 0;
            const pose = entered
              ? (CARD_POSE[d] ?? HIDDEN_POSE)
              : d === 0
                ? ENTRY_POSE[0]
                : Math.abs(d) === 1
                  ? ENTRY_POSE.side
                  : HIDDEN_POSE;
            const entering = entered && !settled;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => !isActive && goTo(i)}
                tabIndex={isActive ? -1 : 0}
                aria-label={isActive ? `${t.title} (showing)` : `Show ${t.title}`}
                aria-hidden={isActive ? true : undefined}
                className={clsx(
                  // Floor reflection like Cover Flow (Chromium and Safari; other browsers just skip it).
                  "absolute left-1/2 top-1/2 aspect-[16/11] w-[66%] overflow-hidden rounded-[1.75rem] border border-white/10 bg-ink-800 shadow-[0_40px_80px_-30px_rgb(0_0_0/0.8)] [-webkit-box-reflect:below_12px_linear-gradient(transparent_72%,rgb(0_0_0/0.2))] [transform-style:preserve-3d] sm:w-[56%] lg:w-[50%]",
                  isActive ? "cursor-default" : "cursor-pointer",
                  jumping[i] || reduceMotion
                    ? "transition-none"
                    : entering
                      ? "transition-[transform,opacity,filter] ease-[cubic-bezier(0.16,1,0.3,1)]"
                      : "transition-[transform,opacity,filter] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                )}
                style={
                  entering
                    ? { ...pose, transitionDuration: `${ENTRY_MS}ms`, transitionDelay: d === 0 ? "0ms" : `${SIDE_DELAY_MS}ms` }
                    : pose
                }
              >
                <img
                  src={t.image}
                  alt=""
                  width={1280}
                  height={720}
                  className="absolute inset-0 size-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
                {t.slideVideo && (
                  <video
                    ref={(el) => (videoRefs.current[i] = el)}
                    src={t.slideVideo}
                    poster={t.image}
                    muted
                    loop
                    playsInline
                    // Load only the slide that's showing; it fades in once its first frame is ready.
                    preload={isActive && inView ? "auto" : "none"}
                    onLoadedData={() => markLoaded(i)}
                    aria-hidden="true"
                    className={clsx(
                      "absolute inset-0 size-full object-cover transition-opacity duration-[800ms] ease-in-out",
                      isActive && loaded.has(i) ? "opacity-100" : "opacity-0"
                    )}
                  />
                )}
                <span className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink/80 to-transparent" />
                <span
                  className={clsx(
                    "absolute bottom-4 left-5 font-display text-xl font-extrabold tracking-tight text-paper transition-opacity duration-500 md:bottom-6 md:left-7 md:text-3xl",
                    isActive ? "opacity-100" : "opacity-0"
                  )}
                >
                  {t.title}
                </span>
              </button>
            );
          })}
        </div>

        {/* Controls */}
        <div className="relative z-40 mt-2 flex items-center justify-center gap-4 md:mt-3">
          <button
            type="button"
            onClick={() => goTo(active - 1)}
            aria-label="Previous team"
            className="flex size-14 items-center justify-center rounded-full border border-white/25 text-xl text-paper transition hover:border-accent hover:bg-accent hover:text-ink active:scale-95"
          >
            <HiArrowLeft />
          </button>
          <div className="flex gap-2" role="tablist" aria-label="Choose a team">
            {TEAMS.map((t, i) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={active === i}
                aria-label={t.title}
                onClick={() => goTo(i)}
                className={clsx(
                  "h-2 rounded-full transition-all duration-300",
                  active === i ? "w-8 bg-accent" : "w-2 bg-white/25 hover:bg-white/50"
                )}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => goTo(active + 1)}
            aria-label="Next team"
            className="flex size-14 items-center justify-center rounded-full border border-white/25 text-xl text-paper transition hover:border-accent hover:bg-accent hover:text-ink active:scale-95"
          >
            <HiArrowRight />
          </button>
        </div>

        {/* Active team's details (all panels share one grid cell and crossfade) */}
        <div className="mx-auto mt-12 grid max-w-4xl md:mt-16" aria-live="polite">
          {TEAMS.map((t, i) => (
            <article
              key={t.id}
              id={`team-slide-${t.id}`}
              role="tabpanel"
              aria-label={t.title}
              inert={i === active ? undefined : ""}
              aria-hidden={i === active ? undefined : true}
              className={clsx(
                "text-center transition-all duration-500 ease-out [grid-area:1/1]",
                i === active ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
              )}
            >
              <h3 className="text-keynote font-display text-4xl font-extrabold leading-[0.95] tracking-[-0.04em] md:text-6xl">
                {t.title}
              </h3>
              {t.intro?.map((p) => (
                <p key={p} className="mx-auto mt-5 max-w-[60ch] text-lg leading-relaxed text-paper-muted">
                  {p}
                </p>
              ))}
              {t.lists?.map((list) => (
                <div key={list.heading} className="mt-8">
                  <h4 className="text-sm font-bold uppercase tracking-wide text-accent">{list.heading}</h4>
                  <ul className="mt-4 grid gap-2 text-left sm:grid-cols-2">
                    {list.items.map((item) => (
                      <li key={item} className="flex gap-2.5 rounded-lg border border-white/10 bg-ink-800 p-3 text-sm text-paper">
                        <HiCheck className="mt-0.5 shrink-0 text-accent" aria-hidden="true" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </article>
          ))}
        </div>
        <p className="sr-only" aria-live="polite">
          Showing {team.title}
        </p>
      </div>
    </section>
  );
};

export default TeamDetails;
