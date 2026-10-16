import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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

export { gsap, ScrollTrigger };
