import { useEffect, useRef } from "react";
import clsx from "clsx";

import { prefersReducedMotion } from "../lib/motion";

// Muted looping clip that downloads nothing until it nears the viewport
// and only decodes while visible. Replaces the old two-<video> crossfade.
const LazyVideo = ({ src, poster, className }) => {
  const ref = useRef(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const reduce = prefersReducedMotion();

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !reduce) video.play().catch(() => {});
        else video.pause();
      },
      { rootMargin: "120px 0px" }
    );
    observer.observe(video);
    return () => observer.disconnect();
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
