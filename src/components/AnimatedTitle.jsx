import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import clsx from "clsx";

import { gsap, prefersReducedMotion } from "../lib/motion";

// Title lines are separated by "<br />". Words fly in as the title scrolls into view.
const AnimatedTitle = ({ title, containerClass, as: Tag = "h2" }) => {
  const containerRef = useRef(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.to(".animated-word", {
        opacity: 1,
        transform: "translate3d(0, 0, 0) rotateY(0deg) rotateX(0deg)",
        ease: "power2.inOut",
        stagger: 0.02,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "100 bottom",
          end: "center bottom",
          toggleActions: "play none none reverse",
        },
      });
    },
    { scope: containerRef }
  );

  const lines = title.split("<br />");

  return (
    <Tag
      ref={containerRef}
      className={clsx("animated-title", containerClass)}
      aria-label={lines.join(" ")}
    >
      {lines.map((line, index) => (
        <span
          key={index}
          aria-hidden="true"
          className="flex-center max-w-full flex-wrap gap-x-3 gap-y-1 px-6 md:gap-x-4"
        >
          {line.split(" ").map((word, idx) => (
            <span key={idx} className="animated-word">
              {word}
            </span>
          ))}
        </span>
      ))}
    </Tag>
  );
};

export default AnimatedTitle;
