import { useGSAP } from "@gsap/react";
import { TiLocationArrow } from "react-icons/ti";
import { useEffect, useRef, useState } from "react";

import Button from "./Button";
import VideoPreview from "./VideoPreview";
import { useVideo } from "../contexts/VideoContext";
import { gsap, prefersReducedMotion } from "../lib/motion";

// ============================================
// HERO VIDEO CONFIGURATION
// ============================================
// src:    the looping background video (720p H.264, faststart)
// poster: still frame shown instantly and used for the preview tile
// link:   opened by the "Watch Video" button
const HERO_VIDEOS = [
  {
    src: "/videos/hero-1.mp4",
    poster: "/img/posters/hero-1.webp",
    link: "https://www.youtube.com/@illinivexrobotics",
  },
  {
    src: "/videos/hero-2.mp4",
    poster: "/img/posters/hero-2.webp",
    link: "https://youtu.be/gK4IB5Sx-sM",
  },
  {
    src: "/videos/hero-3.mp4",
    poster: "/img/posters/hero-3.webp",
    link: "https://youtu.be/Ul3QTyyPic4",
  },
  {
    src: "/videos/hero-4.mp4",
    poster: "/img/posters/hero-4.webp",
    link: "https://youtu.be/Ctw2Fyd9iS0",
  },
];
// ============================================

const PREVIEW_SIZE = 256; // px, matches size-64 on the preview tile

const Hero = () => {
  const [index, setIndex] = useState(0);
  // Index of the video being transitioned in (poster grows from the preview tile)
  const [incoming, setIncoming] = useState(null);

  const heroRef = useRef(null);
  const videoRef = useRef(null);
  const overlayRef = useRef(null);
  const inViewRef = useRef(true);
  const { soundActive } = useVideo();

  const current = HERO_VIDEOS[index];
  const nextIndex = (index + 1) % HERO_VIDEOS.length;

  // Only one <video> exists in the hero. Pause it whenever the hero is off-screen.
  useEffect(() => {
    const video = videoRef.current;
    const hero = heroRef.current;
    if (!video || !hero) return;

    const observer = new IntersectionObserver(([entry]) => {
      inViewRef.current = entry.isIntersecting;
      if (entry.isIntersecting) video.play().catch(() => {});
      else video.pause();
    });
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  // Sound toggle in the navbar just unmutes this same video.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !soundActive;
    if (inViewRef.current && video.paused) video.play().catch(() => {});
  }, [soundActive]);

  const handlePreviewClick = () => {
    if (incoming !== null) return;
    if (prefersReducedMotion()) {
      setIndex(nextIndex);
      return;
    }
    setIncoming(nextIndex);
  };

  // Grow the next poster out of the preview tile using clip-path (no layout work),
  // then swap the video source underneath it.
  useGSAP(
    () => {
      if (incoming === null || !overlayRef.current) return;
      const x = Math.max(0, (window.innerWidth - PREVIEW_SIZE) / 2);
      const y = Math.max(0, (window.innerHeight - PREVIEW_SIZE) / 2);

      gsap.fromTo(
        overlayRef.current,
        { clipPath: `inset(${y}px ${x}px ${y}px ${x}px round 8px)`, opacity: 1 },
        {
          clipPath: "inset(0px 0px 0px 0px round 0px)",
          duration: 1.1,
          ease: "power2.inOut",
          onComplete: () => setIndex(incoming),
        }
      );
    },
    { dependencies: [incoming] }
  );

  const revealVideo = () => {
    if (incoming === null || index !== incoming || !overlayRef.current) return;
    gsap.to(overlayRef.current, {
      opacity: 0,
      duration: 0.45,
      ease: "power2.out",
      onComplete: () => setIncoming(null),
    });
  };

  // Safety net: never leave the overlay up if the next video is slow to start.
  useEffect(() => {
    if (incoming === null || index !== incoming) return;
    const t = setTimeout(revealVideo, 2500);
    return () => clearTimeout(t);
  });

  useGSAP(() => {
    if (prefersReducedMotion()) return;
    gsap.set("#video-frame", {
      clipPath: "polygon(14% 0, 72% 0, 88% 90%, 0 95%)",
      borderRadius: "0% 0% 40% 10%",
    });
    gsap.from("#video-frame", {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      borderRadius: "0% 0% 0% 0%",
      ease: "power1.inOut",
      scrollTrigger: {
        trigger: "#video-frame",
        start: "center center",
        end: "bottom center",
        scrub: true,
      },
    });
  });

  return (
    <section
      ref={heroRef}
      className="relative h-dvh w-full overflow-hidden"
      aria-label="Introduction"
    >
      <div
        id="video-frame"
        className="relative z-10 h-dvh w-full overflow-hidden bg-ink"
      >
        <div className="absolute-center z-50 size-64">
          <VideoPreview>
            <button
              type="button"
              onClick={handlePreviewClick}
              aria-label="Play next video"
              className="block size-64 origin-center scale-50 cursor-pointer overflow-hidden rounded-lg opacity-0 transition-all duration-500 ease-out hover:scale-100 hover:opacity-100 focus-visible:scale-100 focus-visible:opacity-100 [@media(hover:none)]:scale-[0.45] [@media(hover:none)]:opacity-90"
            >
              <img
                src={HERO_VIDEOS[nextIndex].poster}
                alt=""
                width={256}
                height={256}
                className="size-64 origin-center scale-150 object-cover"
                decoding="async"
              />
            </button>
          </VideoPreview>
        </div>

        {incoming !== null && (
          <img
            ref={overlayRef}
            src={HERO_VIDEOS[incoming].poster}
            alt=""
            className="absolute inset-0 z-30 size-full object-cover"
            style={{ clipPath: "inset(50%)" }}
          />
        )}

        <video
          ref={videoRef}
          src={current.src}
          poster={current.poster}
          preload="auto"
          playsInline
          autoPlay
          loop
          muted
          onPlaying={revealVideo}
          className="absolute inset-0 size-full object-cover"
        />

        {/* Scrim keeps the headline readable on bright frames */}
        <div className="pointer-events-none absolute inset-0 z-[35] bg-gradient-to-b from-ink/50 via-transparent to-ink/40" />

        <p
          aria-hidden="true"
          className="hero-heading absolute bottom-5 right-5 z-40 text-paper"
        >
          Robotics
        </p>

        <div className="absolute left-0 top-0 z-40 size-full">
          <div className="mt-24 px-5 sm:px-10">
            <h1 className="hero-heading text-paper">
              Redefine<span className="sr-only"> robotics</span>
            </h1>

            <p className="mb-6 mt-2 max-w-72 text-base font-medium leading-relaxed text-paper/90">
              From concept to competition.
              <br />
              Design. Build. Win.
            </p>

            <Button
              id="watch-trailer"
              title="Watch Video"
              href={current.link}
              leftIcon={<TiLocationArrow />}
            />
          </div>
        </div>
      </div>

      {/* Revealed behind the video frame as it clips on scroll */}
      <p
        aria-hidden="true"
        className="hero-heading absolute bottom-5 right-5 text-accent"
      >
        Robotics
      </p>
      <p
        aria-hidden="true"
        className="hero-heading absolute left-5 top-24 text-accent sm:left-10"
      >
        Redefine
      </p>
    </section>
  );
};

export default Hero;
