import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { TiLocationArrow } from "react-icons/ti";
import { HiOutlineCalendar } from "react-icons/hi";
import clsx from "clsx";

import AnimatedTitle from "./AnimatedTitle";
import SectionHeader from "./SectionHeader";
import { gsap, prefersReducedMotion } from "../lib/motion";

// ==========================================
// EVENT CONFIGURATION - Edit dates here
// ==========================================
// Each season is one weekend: CC Jr (middle/high school) Saturday, CC (VEX U) Sunday.
// Start times assume 8:30 AM Central; update if the agenda says otherwise.
const EVENT_SEASONS = [
  {
    season: "Fall Event",
    events: [
      {
        level: "V5RC", // Competition level
        name: "Cornfield Clash Jr",
        date: "2026-11-07T08:30:00-06:00", // Sat 7-Nov-2026
        url: "https://events.vex.com/robot-competitions/vex-robotics-competition/RE-V5RC-26-4351.html#general-info",
      },
      {
        level: "VEX U",
        name: "Cornfield Clash",
        date: "2026-11-08T08:30:00-06:00", // Sun 8-Nov-2026
        url: "https://events.vex.com/robot-competitions/college-competition/VE-U-26-65716.html#general-info",
      },
    ],
  },
  {
    season: "Winter Event",
    events: [
      {
        level: "V5RC",
        name: "Cornfield Clash Jr",
        date: "2027-01-30T08:30:00-06:00", // Sat 30-Jan-2027
        url: "https://events.vex.com/robot-competitions/vex-robotics-competition/RE-V5RC-26-4756.html#general-info",
      },
      {
        level: "VEX U",
        name: "Cornfield Clash",
        date: "2027-01-31T08:30:00-06:00", // Sun 31-Jan-2027
        url: "https://events.vex.com/robot-competitions/college-competition/RE-VURC-26-4757.html#general-info",
      },
    ],
  },
];
// ==========================================

const getTimeLeft = (targetDate) => {
  const difference = Math.max(0, new Date(targetDate) - new Date());
  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
};

// Ticks only while the schedule is on screen.
const useCountdown = (targetDate, active) => {
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(targetDate));

  useEffect(() => {
    if (!active) return;
    setTimeLeft(getTimeLeft(targetDate));
    const timer = setInterval(() => setTimeLeft(getTimeLeft(targetDate)), 1000);
    return () => clearInterval(timer);
  }, [targetDate, active]);

  return timeLeft;
};

const TZ = "America/Chicago";
const VENUE = "Siebel Center for Design, University of Illinois";
const AUDIENCE = { V5RC: "Middle & High School", "VEX U": "Collegiate" };

const formatDate = (date, opts) => new Date(date).toLocaleDateString("en-US", { timeZone: TZ, ...opts });

// An event counts as finished 12 hours after it starts.
const isFinished = (event) => Date.now() > new Date(event.date).getTime() + 12 * 60 * 60 * 1000;

// All-day Google Calendar link (start times aren't published yet).
const calendarUrl = (event, season) => {
  const start = event.date.slice(0, 10).replaceAll("-", "");
  const next = new Date(`${event.date.slice(0, 10)}T00:00:00Z`);
  next.setUTCDate(next.getUTCDate() + 1);
  const end = next.toISOString().slice(0, 10).replaceAll("-", "");
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `Illini ${event.name} (${season})`,
    dates: `${start}/${end}`,
    location: VENUE,
    details: event.url,
  });
  return `https://calendar.google.com/calendar/render?${params}`;
};

const TimeTile = ({ value, label }) => (
  <div className="flex min-w-[4.25rem] flex-col items-center rounded-xl border border-white/10 bg-ink p-3">
    <span className="font-mono text-3xl font-bold tabular-nums leading-none text-paper md:text-4xl">
      {String(value).padStart(2, "0")}
    </span>
    <span className="mt-2 text-[11px] font-semibold uppercase tracking-wide text-paper-muted">{label}</span>
  </div>
);

const DateChip = ({ date, muted }) => (
  <div
    className={clsx(
      "flex w-16 shrink-0 flex-col items-center rounded-xl border py-2",
      muted ? "border-white/5 bg-ink/60" : "border-white/10 bg-ink"
    )}
  >
    <span className="text-[11px] font-bold uppercase tracking-wide text-accent">
      {formatDate(date, { month: "short" })}
    </span>
    <span className="font-title text-3xl leading-none text-paper">{formatDate(date, { day: "numeric" })}</span>
    <span className="mt-1 text-[11px] font-semibold uppercase text-paper-muted">
      {formatDate(date, { weekday: "short" })}
    </span>
  </div>
);

const RegisterLink = ({ event, season, large }) => (
  <a
    href={event.url}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={`Register for ${event.name} ${season} on VEX Events`}
    className={clsx(
      "inline-flex items-center gap-1 whitespace-nowrap rounded-full bg-accent font-bold uppercase tracking-wide text-ink transition hover:bg-accent-hover active:scale-[0.98]",
      large ? "px-6 py-3 text-xs" : "px-4 py-2 text-[11px]"
    )}
  >
    Register <TiLocationArrow />
  </a>
);

const CalendarLink = ({ event, season, large }) => (
  <a
    href={calendarUrl(event, season)}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={`Add ${event.name} ${season} to Google Calendar`}
    className={clsx(
      "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-white/15 font-bold uppercase tracking-wide text-paper transition hover:border-paper/50 hover:bg-white/5 active:scale-[0.98]",
      large ? "px-6 py-3 text-xs" : "size-9 justify-center p-0 text-base"
    )}
  >
    <HiOutlineCalendar className={large ? "text-base" : undefined} />
    {large && "Add to calendar"}
  </a>
);

const NextUp = ({ event, active }) => {
  const timeLeft = useCountdown(event.date, active);
  const started = Date.now() > new Date(event.date).getTime();

  return (
    <div className="reveal spotlight relative overflow-hidden rounded-card border border-accent/40 bg-gradient-to-br from-ink-700 via-ink-800 to-ink-800 p-6 md:p-10">
      <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-accent/10 blur-3xl" />
      <div className="relative grid items-center gap-8 lg:grid-cols-[1fr_auto]">
        <div>
          <p className="inline-flex rounded-full bg-accent/15 px-3 py-1 text-xs font-bold uppercase tracking-wide text-accent">
            {started ? "Happening now" : "Next up"}
          </p>
          <h4 className="mt-4 font-title text-3xl uppercase leading-none text-paper md:text-5xl">{event.name}</h4>
          <p className="mt-3 text-paper-muted">
            {event.season} · {formatDate(event.date, { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
          </p>
          <p className="text-sm text-paper-muted">
            {AUDIENCE[event.level]} teams, {VENUE}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <RegisterLink event={event} season={event.season} large />
            <CalendarLink event={event} season={event.season} large />
          </div>
        </div>

        {!started && (
          <div className="flex gap-2 sm:gap-3" role="timer" aria-label={`Time until ${event.name}`}>
            <TimeTile value={timeLeft.days} label="Days" />
            <TimeTile value={timeLeft.hours} label="Hrs" />
            <TimeTile value={timeLeft.minutes} label="Min" />
            <TimeTile value={timeLeft.seconds} label="Sec" />
          </div>
        )}
      </div>
    </div>
  );
};

const EventRow = ({ event, season, isNext }) => {
  const done = isFinished(event);

  return (
    <li
      className={clsx(
        "grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-3 rounded-xl p-3 sm:grid-cols-[auto_1fr_auto]",
        isNext && "bg-accent/5 ring-1 ring-accent/40",
        done && "opacity-50"
      )}
    >
      <DateChip date={event.date} muted={done} />
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-md bg-white/10 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-paper">
            {event.level}
          </span>
          <span className="text-xs text-paper-muted">{AUDIENCE[event.level]}</span>
        </div>
        <p className="mt-1 font-semibold text-paper">{event.name}</p>
      </div>
      <div className="col-span-2 flex items-center gap-2 sm:col-span-1">
        {done ? (
          <span className="text-xs font-semibold uppercase tracking-wide text-paper-muted">Completed</span>
        ) : (
          <>
            <RegisterLink event={event} season={season} />
            <CalendarLink event={event} season={season} />
          </>
        )}
      </div>
    </li>
  );
};

const SeasonCard = ({ season, events, nextUrl, index = 0 }) => {
  const first = events[0];
  const last = events[events.length - 1];

  return (
    <article
      className="reveal spotlight relative flex flex-col rounded-card border border-white/10 bg-ink-800 p-4 md:p-6"
      style={{ "--reveal-delay": `${index * 120}ms` }}
    >
      <div className="relative flex flex-wrap items-baseline justify-between gap-2 px-2 pb-3">
        <h4 className="text-xl font-extrabold tracking-tight text-paper md:text-2xl">{season}</h4>
        <p className="text-sm font-semibold text-paper-muted">
          {formatDate(first.date, { month: "short", day: "numeric" })} to{" "}
          {formatDate(last.date, { month: "short", day: "numeric", year: "numeric" })}
        </p>
      </div>
      <ul className="relative flex flex-col gap-2">
        {events.map((event) => (
          <EventRow key={event.url} event={event} season={season} isNext={event.url === nextUrl} />
        ))}
      </ul>
    </article>
  );
};

const Story = () => {
  const frameRef = useRef(null);
  const scheduleRef = useRef(null);
  const [scheduleVisible, setScheduleVisible] = useState(false);
  const tiltTo = useRef(null);
  const nextEvent = EVENT_SEASONS.flatMap((s) => s.events.map((e) => ({ ...e, season: s.season }))).find(
    (e) => !isFinished(e)
  );

  // quickTo reuses one tween per axis instead of creating a new tween on every mousemove.
  useGSAP(() => {
    gsap.set(frameRef.current, { rotationX: 8, transformPerspective: 600 });
    const opts = { duration: 0.5, ease: "power2.out" };
    tiltTo.current = {
      x: gsap.quickTo(frameRef.current, "rotationX", opts),
      y: gsap.quickTo(frameRef.current, "rotationY", opts),
      dx: gsap.quickTo(frameRef.current, "x", opts),
      dy: gsap.quickTo(frameRef.current, "y", opts),
      scale: gsap.quickTo(frameRef.current, "scale", opts),
      spin: gsap.quickTo(frameRef.current, "rotation", opts),
    };
  });

  useEffect(() => {
    const el = scheduleRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setScheduleVisible(entry.isIntersecting));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Mouse or touch: tilt, lean (rotate), drift and zoom toward the pointer.
  const handleMouseMove = (e) => {
    if (!tiltTo.current || prefersReducedMotion()) return;
    const rect = frameRef.current.getBoundingClientRect();
    const dx = Math.max(-0.5, Math.min(0.5, (e.clientX - rect.left) / rect.width - 0.5));
    const dy = Math.max(-0.5, Math.min(0.5, (e.clientY - rect.top) / rect.height - 0.5));
    tiltTo.current.x(8 - dy * 16); // forward/back tilt
    tiltTo.current.y(dx * 14); // side-to-side tilt
    tiltTo.current.spin(dx * 12); // rotation toward the cursor
    tiltTo.current.dx(dx * 50);
    tiltTo.current.dy(dy * 40);
    tiltTo.current.scale(1.07);
  };

  const handleSpotlight = (e) => {
    scheduleRef.current?.querySelectorAll(".spotlight").forEach((card) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - rect.left}px`);
      card.style.setProperty("--my", `${e.clientY - rect.top}px`);
    });
  };

  const handleMouseLeave = () => {
    if (!tiltTo.current) return;
    tiltTo.current.spin(0);
    tiltTo.current.x(8);
    tiltTo.current.y(0);
    tiltTo.current.dx(0);
    tiltTo.current.dy(0);
    tiltTo.current.scale(1);
  };

  return (
    <section id="story" className="w-full bg-ink py-24 text-paper md:py-32">
      <div className="mx-auto max-w-7xl px-4 md:px-10">
        <AnimatedTitle
          title="For young <br /> engineers"
          containerClass="pointer-events-none relative z-10 text-center mix-blend-difference"
        />

        <div
          className="mx-auto -mt-8 max-w-5xl touch-pan-y sm:-mt-14 md:-mt-24"
          onPointerMove={handleMouseMove}
          onPointerLeave={handleMouseLeave}
          onPointerUp={(e) => e.pointerType !== "mouse" && handleMouseLeave()}
          onPointerCancel={handleMouseLeave}
        >
          <div className="relative isolate">
            <div aria-hidden="true" className="cc-ambient pointer-events-none absolute inset-x-[-4%] inset-y-[-8%] -z-10" />
            <div ref={frameRef} className="relative will-change-transform">
              <img
                src="/img/opt/vex-cc-jr.webp"
                alt="Cornfield Clash VEX V5 Robotics Competition, presented by Prismier and the Siebel Center for Design"
                width={1400}
                height={933}
                className="h-auto w-full"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </div>

        <div className="reveal relative z-10 mx-auto mt-12 max-w-3xl text-center md:mt-16">
          <h3 className="font-title text-3xl uppercase text-paper md:text-5xl">Cornfield Clash</h3>
          <p className="mt-5 text-lg leading-relaxed text-paper-muted md:text-xl">
            Illinois&apos; premier VEX competition, hosted by Illini VEX Robotics
            at the Siebel Center for Design. Middle and high school teams compete
            in CC Jr, collegiate teams in CC, with spots at VEX Worlds on the line.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-paper-muted md:text-xl">
            Every event is open to the public, so bring family and friends to
            cheer your team on.
          </p>
        </div>

        <div ref={scheduleRef} data-spotlight-group className="mt-20 md:mt-28" onMouseMove={handleSpotlight}>
          <SectionHeader
            as="h3"
            size="md"
            title="2026-27 schedule"
            aside={`All events at the ${VENUE}`}
            className="mb-8"
          />

          {nextEvent ? (
            <NextUp event={nextEvent} active={scheduleVisible} />
          ) : (
            <div className="rounded-card border border-white/10 bg-ink-800 p-6 text-paper-muted md:p-8">
              This season is complete. Thanks to every team that competed. Next season&apos;s dates are coming soon.
            </div>
          )}

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {EVENT_SEASONS.map((s, i) => (
              <SeasonCard key={s.season} {...s} index={i} nextUrl={nextEvent?.url} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Story;
