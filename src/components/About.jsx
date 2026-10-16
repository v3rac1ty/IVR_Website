import { useGSAP } from "@gsap/react";
import { useRef } from "react";

import AnimatedTitle from "./AnimatedTitle";
import { gsap, prefersReducedMotion } from "../lib/motion";

const About = () => {
  const sectionRef = useRef(null);
  const maskRef = useRef(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;

      // Pinned reveal: the framed photo grows to fill the viewport.
      gsap
        .timeline({
          scrollTrigger: {
            trigger: "#clip",
            start: "center center",
            end: "+=800 center",
            scrub: 0.5,
            pin: true,
            pinSpacing: true,
          },
        })
        .to(maskRef.current, {
          width: "100vw",
          height: "100vh",
          borderRadius: 0,
        });
    },
    { scope: sectionRef }
  );

  return (
    <section id="about" ref={sectionRef} className="min-h-screen w-full">
      <div className="relative mb-8 mt-36 flex flex-col items-center gap-5">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
          Welcome to Illini VEX Robotics
        </p>

        <AnimatedTitle
          title="Build the future of <br /> robotics innovation"
          containerClass="mt-5 text-center"
        />

        <div className="absolute bottom-[-80dvh] left-1/2 w-full max-w-md -translate-x-1/2 px-6 text-center text-lg md:max-w-xl">
          <p className="font-semibold text-paper">
            From design to competition, engineering excellence in every build.
          </p>
          <p className="mt-2 leading-relaxed text-paper-muted">
            Illini VEX Robotics brings together engineers and builders at the
            University of Illinois to push the limits of robotics and compete at
            the highest level.
          </p>
        </div>
      </div>

      <div className="h-dvh w-full" id="clip">
        <div ref={maskRef} className="mask-clip-path about-image">
          <img
            src="/img/opt/about.webp"
            alt="Illini VEX Robotics team holding an Illinois flag behind their robots at a competition"
            width={1920}
            height={1440}
            className="absolute left-0 top-0 size-full object-cover"
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>
    </section>
  );
};

export default About;
