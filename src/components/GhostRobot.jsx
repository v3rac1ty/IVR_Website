import { useEffect, useRef } from "react";

import { gsap, ScrollTrigger, prefersReducedMotion } from "../lib/motion";

// A line drawing of the robot fixed in the page background. It draws in, front face on, as the hero
// scrolls away and turns from the front round to the back over the rest of the page, eased so the turn
// glides. It keeps turning while the About photo expands over it; the photo covers it fully only as the
// expansion ends, and it's turning again as soon as the photo scrolls off. The lines drift and grow a
// little. One all-keyframe video (traced from the render) keeps memory to a single decoded frame; it
// loads after the page settles. The whole look is baked into the frames: lines warming to the accent at
// the base, a soft halo and a scan light that sweeps up as it turns, over the page colour. So the layer is a plain opaque video: no blending and nothing to repaint
// per frame, only a seek and a GPU transform.
const SRC = "/videos/robot-ink.mp4";
const FRAME = 1 / 120; // 361 frames, 1076x1080, drawn as ink-style line art (difference-of-Gaussians) from the render
const FEATHER =
  "linear-gradient(to right, transparent, #000 12%, #000 88%, transparent), linear-gradient(to bottom, transparent, #000 10%, #000 90%, transparent)";
const STILL = 0.45; // frame shown with reduced motion (a three-quarter view)
const MASK = "linear-gradient(to top, #000 calc(var(--draw) * 130% - 30%), transparent calc(var(--draw) * 130%))";
// Drifts left and up and grows a little over the page (turn: 0 at the start, 1 at the bottom).
const drift = (turn) =>
  `translate3d(${((0.5 - turn) * 6).toFixed(3)}vw, ${((0.5 - turn) * 10).toFixed(3)}vh, 0) scale(${(0.92 + turn * 0.12).toFixed(4)})`;

const GhostRobot = () => {
  const layerRef = useRef(null);
  const artRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const layer = layerRef.current;
    const art = artRef.current;
    const video = videoRef.current;
    // The layer is hidden below md, so phones skip the video entirely.
    if (!layer || !art || !video || !window.matchMedia("(min-width: 768px)").matches) return;

    const load = () => {
      video.preload = "auto";
      video.src = SRC;
    };
    const idle = window.requestIdleCallback
      ? window.requestIdleCallback(load, { timeout: 2500 })
      : window.setTimeout(load, 1500);
    const cancelIdle = () =>
      window.cancelIdleCallback ? window.cancelIdleCallback(idle) : window.clearTimeout(idle);

    if (prefersReducedMotion()) {
      art.style.maskImage = art.style.webkitMaskImage = "none";
      const still = () => (video.currentTime = video.duration * STILL);
      video.addEventListener("loadedmetadata", still, { once: true });
      return () => {
        cancelIdle();
        video.removeEventListener("loadedmetadata", still);
      };
    }

    let target = 0;
    let current = 0;

    // Ease toward the scroll position each frame, then seek the video (front -> back) and move the layer.
    // `synced` keeps it running until the video shows the current angle (e.g. the first seek after it loads).
    let synced = false;
    const tick = () => {
      const delta = target - current;
      if (Math.abs(delta) < 0.00005 && synced) return;
      if (Math.abs(delta) >= 0.00005) {
        current += delta * (1 - Math.pow(0.85, gsap.ticker.deltaRatio()));
        art.style.transform = drift(current);
      }
      if (video.readyState < 1 || video.seeking) return;
      const t = (1 - current) * (video.duration - FRAME);
      synced = Math.abs(t - video.currentTime) <= FRAME / 2;
      if (!synced) video.currentTime = t;
    };
    gsap.ticker.add(tick);

    // Mask only while drawing in; once fully drawn it's removed so it costs nothing per frame.
    const setMask = (drawn) => {
      art.style.maskImage = art.style.webkitMaskImage = drawn ? "none" : MASK;
    };
    setMask(false);

    // Lines draw in from the bottom up while the hero leaves.
    const draw = gsap.fromTo(
      layer,
      { "--draw": 0 },
      {
        "--draw": 1,
        ease: "none",
        scrollTrigger: { start: 0, end: () => window.innerHeight * 1.2, scrub: true },
        onUpdate() {
          setMask(this.progress() >= 1);
        },
      }
    );

    const turn = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => (target = self.progress),
      onRefresh: (self) => (target = self.progress),
    });

    return () => {
      cancelIdle();
      gsap.ticker.remove(tick);
      draw.scrollTrigger?.kill();
      draw.kill();
      turn.kill();
    };
  }, []);

  return (
    <div
      ref={layerRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-y-0 right-[3vw] -z-10 hidden w-[44vw] max-w-[740px] items-center md:flex"
      style={{ "--draw": 0 }}
    >
      <div ref={artRef} className="relative aspect-[1076/1080] w-full will-change-transform" style={{ transform: drift(0) }}>
        <video
          ref={videoRef}
          muted
          playsInline
          preload="none"
          disablePictureInPicture
          tabIndex={-1}
          className="absolute inset-0 size-full"
          // Feathered edges: the frame's background matches the page, but some GPUs convert video colour
          // slightly differently, so fading the edges keeps the frame from ever showing as a box.
          style={{ maskImage: FEATHER, WebkitMaskImage: FEATHER, maskComposite: "intersect", WebkitMaskComposite: "source-in" }}
        />
      </div>
    </div>
  );
};

export default GhostRobot;
