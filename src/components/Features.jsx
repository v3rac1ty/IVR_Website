import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { TiLocationArrow } from "react-icons/ti";
import { IoArrowBack } from "react-icons/io5";
import clsx from "clsx";

import LazyVideo from "./LazyVideo";
import { gsap, ScrollTrigger, prefersReducedMotion } from "../lib/motion";

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
    <div className={clsx("bento-reveal", className)}>
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

const FeatureList = ({ heading, items }) => (
  <div className="rounded-lg bg-white/5 p-4">
    <h4 className="mb-2 text-lg font-bold text-accent">{heading}</h4>
    <ul className="list-inside list-disc space-y-1 text-sm text-paper-muted">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  </div>
);

// Card with a looping clip on the front and details on the back.
export const FlippableBentoCard = ({ src, poster, title, description, details }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const cardRef = useRef(null);

  // Spotlight position lives in CSS variables, not React state.
  const handleMouseMove = (event) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--x", `${event.clientX - rect.left}px`);
    el.style.setProperty("--y", `${event.clientY - rect.top}px`);
  };

  const faceClass =
    "absolute inset-0 size-full overflow-hidden rounded-card transition-opacity duration-0 delay-200 [backface-visibility:hidden]";

  return (
    <div
      ref={cardRef}
      className="group relative size-full [perspective:2000px]"
      onMouseMove={handleMouseMove}
    >
      <div
        className={clsx(
          "relative size-full rounded-card border border-white/10 transition-[transform,border-color,box-shadow] duration-700 [transform-style:preserve-3d] group-hover:border-accent/70 group-hover:shadow-[0_0_24px_rgb(255_95_5/0.25)]",
          isFlipped && "[transform:rotateY(180deg)]"
        )}
      >
        {/* Front */}
        <div
          className={clsx(faceClass, isFlipped ? "pointer-events-none opacity-0" : "opacity-100")}
          inert={isFlipped ? "" : undefined}
        >
          <LazyVideo src={src} poster={poster} />
          <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/10 to-ink/60" />
          <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 [background:radial-gradient(220px_circle_at_var(--x)_var(--y),rgb(255_95_5/0.18),transparent)] group-hover:opacity-100" />

          <div className="relative z-10 flex size-full flex-col justify-between p-5 md:p-7">
            <div>
              <h3 className="section-title text-paper">{title}</h3>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-paper/85 md:text-base">
                {description}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsFlipped(true)}
              className="flex w-fit items-center gap-2 rounded-full bg-ink-700 px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-accent ring-1 ring-white/10 transition hover:bg-accent hover:text-ink active:scale-[0.98]"
            >
              <TiLocationArrow />
              Learn more
            </button>
          </div>
        </div>

        {/* Back */}
        <div
          className={clsx(
            faceClass,
            "bg-gradient-to-br from-ink-700 to-ink [transform:rotateY(180deg)]",
            isFlipped ? "opacity-100" : "pointer-events-none opacity-0"
          )}
          inert={isFlipped ? undefined : ""}
        >
          <div className="relative z-10 flex size-full flex-col p-5 md:p-7">
            <div className="mb-4 flex items-center justify-between gap-4">
              <h3 className="font-title text-2xl uppercase text-paper md:text-4xl">{title}</h3>
              <button
                type="button"
                onClick={() => setIsFlipped(false)}
                className="flex shrink-0 items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-bold uppercase transition-colors hover:bg-white/20"
              >
                <IoArrowBack />
                Back
              </button>
            </div>
            <div className="flex-1 space-y-4 overflow-auto pr-1">{details}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DEPARTMENTS = {
  departments: {
    title: "Our Departments",
    description:
      "Three teams: VEX U competing at the collegiate level, plus R&D Mechanical and R&D Software running independent research projects.",
    src: "/videos/bet.mp4",
    poster: "/img/posters/bet.webp",
    details: (
      <div className="grid gap-4 md:grid-cols-3">
        {[
          ["VEX U", "Our collegiate competition team designs and builds robots for regional, state, and world championship events."],
          ["R&D Mechanical", "Independent projects in prototyping, CAD, and fabricating new mechanisms outside of competition."],
          ["R&D Software", "Independent projects in autonomous systems, computer vision, and control algorithms."],
        ].map(([name, text]) => (
          <div key={name} className="rounded-lg bg-white/5 p-4">
            <h4 className="mb-2 text-lg font-bold text-accent">{name}</h4>
            <p className="text-sm text-paper-muted">{text}</p>
          </div>
        ))}
      </div>
    ),
  },
  vexu: {
    title: "VEX U",
    description:
      "Our competitive collegiate team, designing and building advanced robots for international competition.",
    src: "/videos/feature-2.mp4",
    poster: "/img/posters/feature-2.webp",
    details: (
      <>
        <p className="text-paper-muted">
          VEX U is the collegiate division of the VEX Robotics Competition, where
          university teams design and build robots for each season&apos;s game.
        </p>
        <FeatureList
          heading="What we do"
          items={[
            "Design and build competition robots within strict constraints",
            "Compete at regional, state, and world championship events",
            "Collaborate across mechanical, electrical, and software",
            "Document our engineering process for judged awards",
          ]}
        />
      </>
    ),
  },
  mechanical: {
    title: "R&D Mechanical",
    description: "Prototyping, CAD, and fabrication for the next generation of robots.",
    src: "/videos/feature-3.mp4",
    poster: "/img/posters/feature-3.webp",
    details: (
      <>
        <p className="text-paper-muted">
          Our mechanical R&amp;D team pushes robot design forward through
          prototyping and advanced manufacturing.
        </p>
        <FeatureList
          heading="Focus areas"
          items={[
            "CAD design in SolidWorks and Fusion 360",
            "3D printing and rapid prototyping",
            "CNC machining and precision fabrication",
            "Mechanism optimization and testing",
          ]}
        />
      </>
    ),
  },
  software: {
    title: "R&D Software",
    description: "Autonomous code, control systems, and AI for smarter robots.",
    src: "/videos/feature-4.mp4",
    poster: "/img/posters/feature-4.webp",
    details: (
      <>
        <p className="text-paper-muted">
          Our software R&amp;D team builds the systems that make our robots
          smarter and more capable.
        </p>
        <FeatureList
          heading="Technologies"
          items={[
            "Autonomous path planning and motion control",
            "Computer vision and sensor fusion",
            "PID tuning and control systems",
            "Data logging and performance analysis",
          ]}
        />
      </>
    ),
  },
};

const Features = () => {
  const sectionRef = useRef(null);

  // One batched ScrollTrigger reveals every card as it enters the viewport.
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.set(".bento-reveal", { opacity: 0, y: 60, scale: 0.92 });
      ScrollTrigger.batch(".bento-reveal", {
        start: "top 90%",
        onEnter: (els) =>
          gsap.to(els, { opacity: 1, y: 0, scale: 1, duration: 1, ease: "power3.out", stagger: 0.12, overwrite: true }),
        onLeaveBack: (els) =>
          gsap.to(els, { opacity: 0, y: 60, scale: 0.92, duration: 0.4, overwrite: true }),
      });
    },
    { scope: sectionRef }
  );

  return (
    <section id="departments" ref={sectionRef} className="bg-ink pb-40">
      <div className="mx-auto max-w-7xl px-4 md:px-10">
        <div className="max-w-xl py-28 md:py-32">
          <h2 className="section-title text-paper">Explore all we do</h2>
          <p className="mt-4 text-lg leading-relaxed text-paper-muted">
            From competitive VEX U robotics to independent R&amp;D in mechanical
            and software engineering.
          </p>
        </div>

        <BentoTilt className="relative mb-6 h-[28rem] w-full md:h-[65vh]">
          <FlippableBentoCard {...DEPARTMENTS.departments} />
        </BentoTilt>

        <div className="grid w-full grid-cols-1 gap-6 md:h-[135vh] md:grid-cols-2 md:grid-rows-3">
          <BentoTilt className="relative h-[28rem] md:row-span-2 md:h-auto">
            <FlippableBentoCard {...DEPARTMENTS.vexu} />
          </BentoTilt>

          <BentoTilt className="relative h-96 md:h-auto">
            <FlippableBentoCard {...DEPARTMENTS.mechanical} />
          </BentoTilt>

          <BentoTilt className="relative h-96 md:h-auto">
            <FlippableBentoCard {...DEPARTMENTS.software} />
          </BentoTilt>

          <BentoTilt className="relative h-64 md:h-auto" innerClassName="overflow-hidden rounded-card">
            <div className="flex size-full flex-col justify-between bg-accent p-5 md:p-7">
              <h3 className="section-title max-w-64 text-ink">More coming soon.</h3>
              <TiLocationArrow className="self-end text-7xl text-ink" aria-hidden="true" />
            </div>
          </BentoTilt>

          <BentoTilt className="relative h-64 md:h-auto" innerClassName="relative overflow-hidden rounded-card border border-white/10">
            <LazyVideo src="/videos/feature-5.mp4" poster="/img/posters/feature-5.webp" />
          </BentoTilt>
        </div>
      </div>
    </section>
  );
};

export default Features;
