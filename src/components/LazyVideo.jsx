import { useEffect, useRef } from "react";
import clsx from "clsx";

import { prefersReducedMotion } from "../lib/motion";

// Muted looping clip that downloads nothing until it nears the viewport and only decodes while visible.
// Like the team carousel, it holds its first frame (the poster) while its card fades in, then plays;
// the clip itself eases from slow motion up to full speed. Leaving the screen rewinds it, so it
// starts the same way next time.
//
// First loads are spread out so they don't stall a frame: each clip starts buffering a screen ahead
// of where it appears, and clips start playing one at a time instead of all on the same frame.
const FIRST_HOLD_MS = 900; // the card's scroll reveal
const HOLD_MS = 350;
const START_GAP_MS = 150;

// One queue for every LazyVideo on the page: each start waits for the previous one plus a short gap.
let startQueue = Promise.resolve();
const queueStart = (fn) => {
  const run = startQueue.then(fn);
  startQueue = run.then(() => new Promise((r) => setTimeout(r, START_GAP_MS)));
  return run;
};

const LazyVideo = ({ src, poster, className }) => {
  const ref = useRef(null);

  useEffect(() => {
    const video = ref.current;
    if (!video || prefersReducedMotion()) return;
    let timer;
    let seen = false;
    let visible = false;

    // A screen ahead: begin buffering (and set up the decoder) before the clip is on screen.
    const prefetch = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        prefetch.disconnect();
        queueStart(() => {
          video.preload = "auto";
          video.load();
        });
      },
      { rootMargin: "100% 0px" }
    );
    prefetch.observe(video);

    const observer = new IntersectionObserver(
      ([entry]) => {
        clearTimeout(timer);
        visible = entry.isIntersecting;
        if (visible) {
          timer = setTimeout(
            () => queueStart(() => visible && video.play().catch(() => {})),
            seen ? HOLD_MS : FIRST_HOLD_MS
          );
          seen = true;
        } else {
          video.pause();
          if (video.readyState >= 1) video.currentTime = 0;
        }
      },
      { rootMargin: "120px 0px" }
    );
    observer.observe(video);
    return () => {
      clearTimeout(timer);
      prefetch.disconnect();
      observer.disconnect();
    };
  }, []);

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
      className={clsx("absolute inset-0 size-full object-cover", className)}
    />
  );
};

export default LazyVideo;
