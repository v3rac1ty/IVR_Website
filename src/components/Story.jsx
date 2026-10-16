import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { TiLocationArrow } from "react-icons/ti";
import clsx from "clsx";

import Button from "./Button";
import AnimatedTitle from "./AnimatedTitle";
import { gsap, prefersReducedMotion } from "../lib/motion";

// ==========================================
// EVENT CONFIGURATION - Edit dates here
// ==========================================
const EVENTS = [
  {
    level: "VEXU", // Competition level
    name: "Cornfield Clash",
    date: "2026-01-31T08:30:00-06:00", // 31-Jan-2026 8:30 AM CST
    robotEventsUrl: "https://www.robotevents.com/robot-competitions/college-competition/RE-VURC-25-3654.html#general-info",
  },
  {
    level: "V5RC",
    name: "Cornfield Clash Jr",
    date: "2026-02-07T08:30:00-06:00", // 7-Feb-2026 8:30 AM CST
    robotEventsUrl: "https://www.robotevents.com/robot-competitions/vex-robotics-competition/RE-V5RC-25-3653.html",
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

// Ticks only while the events panel is open.
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

const TimeUnit = ({ value, label }) => (
  <div className="flex flex-col items-center">
    <span className="min-w-[3ch] text-center font-mono text-2xl font-bold tabular-nums leading-none text-paper">
      {String(value).padStart(2, "0")}
    </span>
    <span className="mt-1 text-[11px] uppercase text-paper-muted">{label}</span>
  </div>
);

const EventCard = ({ event, active }) => {
  const timeLeft = useCountdown(event.date, active);
  const eventDate = new Date(event.date);
  const isPast = new Date() > eventDate;

  return (
    <article className="flex flex-col rounded-card border border-white/10 bg-ink-700 p-5">
      <p className="text-xs font-bold uppercase tracking-wide text-accent">{event.level}</p>
      <h3 className="mt-1 font-title text-xl uppercase text-paper">{event.name}</h3>
      <p className="mt-1 text-sm text-paper-muted">
        {eventDate.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>

      <div className="my-4">
        {isPast ? (
          <p className="text-sm font-semibold text-paper">Event completed</p>
        ) : (
          <div className="flex gap-3" aria-label="Time until event">
            <TimeUnit value={timeLeft.days} label="Days" />
            <TimeUnit value={timeLeft.hours} label="Hrs" />
            <TimeUnit value={timeLeft.minutes} label="Min" />
            <TimeUnit value={timeLeft.seconds} label="Sec" />
          </div>
        )}
      </div>

      <a
        href={event.robotEventsUrl}
        target="_blank"
        rel="noopener noreferrer"
        tabIndex={active ? 0 : -1}
        className="mt-auto inline-flex w-fit items-center whitespace-nowrap gap-1 rounded-full bg-accent px-4 py-2 text-xs font-bold uppercase tracking-wide text-ink transition hover:bg-accent-hover active:scale-[0.98]"
      >
        View on RobotEvents <TiLocationArrow />
      </a>
    </article>
  );
};

const Story = () => {
  const frameRef = useRef(null);
  const [open, setOpen] = useState(false);
  const tiltTo = useRef(null);

  // quickTo reuses one tween per axis instead of creating a new tween on every mousemove.
  useGSAP(() => {
    gsap.set(frameRef.current, { rotateX: 8, transformPerspective: 600 });
    tiltTo.current = {
      x: gsap.quickTo(frameRef.current, "rotateX", { duration: 0.4, ease: "power2.out" }),
      y: gsap.quickTo(frameRef.current, "rotateY", { duration: 0.4, ease: "power2.out" }),
    };
  });

  const handleMouseMove = (e) => {
    if (!tiltTo.current || prefersReducedMotion()) return;
    const rect = frameRef.current.getBoundingClientRect();
    const dx = (e.clientX - rect.left) / rect.width - 0.5;
    const dy = (e.clientY - rect.top) / rect.height - 0.5;
    tiltTo.current.x(8 - dy * 20);
    tiltTo.current.y(dx * 20);
  };

  const handleMouseLeave = () => {
    tiltTo.current?.x(8);
    tiltTo.current?.y(0);
  };

  return (
    <section id="story" className="w-full bg-ink py-24 text-paper md:py-32">
      <div className="mx-auto max-w-7xl px-4 md:px-10">
        <p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-accent">
          Illinois&apos; premier VEX competition
        </p>

        <AnimatedTitle title="For young <br /> engineers" containerClass="mt-5 text-center" />

        <div className="mt-16 grid items-center gap-12 md:grid-cols-2 md:gap-16">
          <div onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
            <img
              ref={frameRef}
              src="/img/opt/vex-cc-jr.webp"
              alt="Cornfield Clash VEX V5 Robotics Competition, presented by Prismier and the Siebel Center for Design"
              width={1400}
              height={933}
              className="h-auto w-full"
              loading="lazy"
              decoding="async"
            />
          </div>

          <div className="flex flex-col items-start">
            <p className="max-w-[60ch] text-lg leading-relaxed text-paper-muted">
              Cornfield Clash is Illini VEX Robotics&apos; flagship competition,
              welcoming middle school, high school, and university teams (CC and
              CC Jr). Students get a hands-on place to learn, design, and compete,
              growing their skills on the way to international events while
              strengthening the Illinois VEX community.
            </p>

            <Button
              id="realm-btn"
              title={open ? "Hide events" : "Discover events"}
              containerClass="mt-8"
              aria-expanded={open}
              aria-controls="events-panel"
              onClick={() => setOpen((s) => !s)}
            />

            <div
              id="events-panel"
              className={clsx(
                "grid w-full transition-all duration-500 ease-out",
                open ? "mt-8 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              )}
              inert={open ? undefined : ""}
            >
              <div className="min-h-0 overflow-hidden">
                <div className="grid gap-4 lg:grid-cols-2">
                  {EVENTS.map((event) => (
                    <EventCard key={event.name} event={event} active={open} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Story;
