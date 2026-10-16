import { useGSAP } from "@gsap/react";
import { TiLocationArrow } from "react-icons/ti";
import { useCallback, useEffect, useRef, useState } from "react";

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

// Splits a word into letters that rise out of a clipped line during the intro.
const SplitWord = ({ text }) => (
  <span aria-hidden="true" className="inline-block overflow-hidden pb-[0.04em] align-bottom">
    {[...text].map((ch, i) => (
      <span key={i} className="hero-char inline-block">
        {ch}
      </span>
    ))}
  </span>
);

const Hero = () => {
  const [index, setIndex] = useState(0);
  // Index of the video being transitioned in (poster grows from the preview tile)
  const [incoming, setIncoming] = useState(null);

  const heroRef = useRef(null);
  const videoRef = useRef(null);
  const overlayRef = useRef(null);
  const mediaRef = useRef(null);
  const inViewRef = useRef(true);
  const { soundActive } = useVideo();

  const current = HERO_VIDEOS[index];
  const nextIndex = (index + 1) % HERO_VIDEOS.length;

  // Audio fades instead of cutting: volume eases toward a target with requestAnimationFrame.
  // Target = how much of the hero is on screen (so scrolling away softens it), or 0 when muted.
  // (iOS Safari ignores video.volume, so there it simply mutes/unmutes.)
  const fadeFrame = useRef(0);
  const soundRef = useRef(soundActive);
  const visibleRef = useRef(1);

  const fadeVolume = useCallback((target, duration, onDone) => {
    const video = videoRef.current;
    if (!video) return;
    cancelAnimationFrame(fadeFrame.current);
    const from = video.volume;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = t * (2 - t); // ease-out
      video.volume = Math.max(0, Math.min(1, from + (target - from) * eased));
      if (t < 1) fadeFrame.current = requestAnimationFrame(tick);
      else onDone?.();
    };
    fadeFrame.current = requestAnimationFrame(tick);
  }, []);

  const syncAudio = useCallback(
    (duration = 700) => {
      const video = videoRef.current;
      if (!video) return;
      const visible = visibleRef.current;

      if (visible > 0 && video.paused) video.play().catch(() => {});

      if (soundRef.current && visible > 0) {
        if (video.muted) {
          video.volume = 0;
          video.muted = false;
        }
        fadeVolume(Math.min(1, visible * 1.25), duration);
      } else {
        fadeVolume(0, duration, () => {
          video.muted = true;
          if (visibleRef.current === 0) video.pause();
        });
      }
    },
    [fadeVolume]
  );

  // Track how much of the hero is visible; volume follows it, and the video pauses once it's gone.
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting ? entry.intersectionRatio : 0;
        inViewRef.current = entry.isIntersecting;
        syncAudio(400);
      },
      { threshold: Array.from({ length: 11 }, (_, i) => i / 10) }
    );
    observer.observe(hero);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(fadeFrame.current);
    };
  }, [syncAudio]);

  // Sound toggle in the navbar fades this same video's audio in or out.
  useEffect(() => {
    soundRef.current = soundActive;
    syncAudio(700);
  }, [soundActive, syncAudio]);

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

  // First-load intro: the video opens from a small window, the headline letters rise,
  // then the copy, button and navbar settle in.
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap
        .timeline({ defaults: { ease: "power4.out" } })
        .from(mediaRef.current, {
          clipPath: "inset(32% 36% 32% 36% round 28px)",
          scale: 1.15,
          duration: 1.6,
          ease: "expo.inOut",
        })
        .from(".hero-char", { yPercent: 115, duration: 1, stagger: 0.035 }, "-=0.75")
        .from(".hero-fade", { y: 24, opacity: 0, duration: 0.8, stagger: 0.1 }, "-=0.6")
        .from(
          document.querySelector("[data-nav]"),
          { y: -24, opacity: 0, duration: 0.8, clearProps: "transform,opacity" },
          "<"
        );
    },
    { scope: heroRef }
  );

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

        <div ref={mediaRef} className="absolute inset-0">
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
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink/50 via-transparent to-ink/40" />
        </div>

        <p
          aria-hidden="true"
          className="hero-heading absolute bottom-5 right-5 z-40 text-paper"
        >
          <SplitWord text="Robotics" />
        </p>

        <div className="absolute left-0 top-0 z-40 size-full">
          <div className="mt-24 px-5 sm:px-10">
            <h1 className="hero-heading text-paper" aria-label="Redefine robotics">
              <SplitWord text="Redefine" />
            </h1>

            <p className="hero-fade mb-6 mt-2 max-w-72 text-base font-medium leading-relaxed text-paper/90">
              From concept to competition.
              <br />
              Design. Build. Win.
            </p>

            <Button
              id="watch-trailer"
              containerClass="hero-fade"
              title="Watch Video"
              href={current.link}
              leftIcon={<TiLocationArrow />}
            />
          </div>
        </div>
      </div>

      {/* Revealed behind the video frame as it clips on scroll.
          Same SplitWord structure as the white copies so they line up exactly. */}
      <p
        aria-hidden="true"
        className="hero-heading absolute bottom-5 right-5 text-accent"
      >
        <SplitWord text="Robotics" />
      </p>
      <p
        aria-hidden="true"
        className="hero-heading absolute left-5 top-24 text-accent sm:left-10"
      >
        <SplitWord text="Redefine" />
      </p>
    </section>
  );
};

export default Hero;
