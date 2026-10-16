import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Import ScrollTrigger directly (not "gsap/all") so unused plugins stay out of the bundle.
gsap.registerPlugin(ScrollTrigger);

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

export { gsap, ScrollTrigger };
