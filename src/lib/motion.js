import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

// Import ScrollTrigger directly (not "gsap/all") so unused plugins stay out of the bundle.
gsap.registerPlugin(ScrollTrigger);

if (typeof window !== "undefined" && "ResizeObserver" in window) {
  let timer;
  let lastHeight = 0;
  new ResizeObserver(([entry]) => {
    const height = Math.round(entry.contentRect.height);
    if (height === lastHeight) return;
    lastHeight = height;
    clearTimeout(timer);
    timer = setTimeout(() => ScrollTrigger.refresh(), 150);
  }).observe(document.body);
}

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

// Inertial wheel scrolling on top of native scroll (touch keeps the platform's own momentum).
// It runs on GSAP's ticker so ScrollTrigger and the smoothed scroll share one frame loop.
export const lenis =
  typeof window !== "undefined" && !prefersReducedMotion() ? new Lenis({ lerp: 0.1, anchors: false }) : null;

if (lenis) {
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

// Smooth scroll to an element (or a y offset) through Lenis when it's running.
export const smoothScrollTo = (target) => {
  if (target == null) return;
  if (lenis) lenis.scrollTo(target, { duration: 1.4 });
  else if (typeof target === "number") window.scrollTo({ top: target, behavior: "smooth" });
  else target.scrollIntoView({ behavior: "smooth", block: "start" });
};

export { gsap, ScrollTrigger };
