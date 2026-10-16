import { useGSAP } from "@gsap/react";
import { useRef } from "react";

import { gsap, prefersReducedMotion } from "../lib/motion";

// Keynote-style statement: each word brightens in turn as you scroll through the paragraph.
const ScrollLitText = ({ text, className }) => {
  const ref = useRef(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.fromTo(
        ".lit-word",
        { opacity: 0.15 },
        {
          opacity: 1,
          ease: "none",
          stagger: 0.1,
          // refreshPriority -1: measure after pinned sections above add their spacing
          scrollTrigger: { trigger: ref.current, start: "top 80%", end: "bottom 45%", scrub: true, refreshPriority: -1 },
        }
      );
    },
    { scope: ref }
  );

  return (
    <p ref={ref} className={className}>
      {text.split(" ").map((word, i) => (
        <span key={i} className="lit-word">
          {word}{" "}
        </span>
      ))}
    </p>
  );
};

export default ScrollLitText;
