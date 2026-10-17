import { useEffect, useRef } from "react";
import clsx from "clsx";

import { prefersReducedMotion } from "../lib/motion";

// Muted looping clip that downloads nothing until it nears the viewport and only decodes while visible.
// Like the team carousel, it holds its first frame (the poster) while its card fades in, then plays;
// the clip itself eases from slow motion up to full speed. Leaving the screen rewinds it, so it
// starts the same way next time.
const FIRST_HOLD_MS = 900; // the card's scroll reveal
const HOLD_MS = 350;

const LazyVideo = ({ src, poster, className }) => {
  const ref = useRef(null);

  useEffect(() => {
    const video = ref.current;
    if (!video || prefersReducedMotion()) return;
    let timer;
    let seen = false;

    const observer = new IntersectionObserver(
      ([entry]) => {
        clearTimeout(timer);
        if (entry.isIntersecting) {
          timer = setTimeout(() => video.play().catch(() => {}), seen ? HOLD_MS : FIRST_HOLD_MS);
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
