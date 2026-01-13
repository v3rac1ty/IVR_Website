import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
import { TiLocationArrow } from "react-icons/ti";
import { useEffect, useRef, useState } from "react";
import { useWindowScroll } from "react-use";

import Button from "./Button";
import VideoPreview from "./VideoPreview";
import { useVideo } from "../contexts/VideoContext";

gsap.registerPlugin(ScrollTrigger);

// ============================================
// HERO VIDEO CONFIGURATION
// ============================================

// Video external links (opens in new tab when "Watch Video" clicked)
const HERO_VIDEO_LINKS = {
  1: "https://www.youtube.com/@illinivexrobotics",
  2: "https://youtu.be/gK4IB5Sx-sM",
  3: "https://youtu.be/Ul3QTyyPic4",
  4: "https://youtu.be/Ctw2Fyd9iS0",
};

// Video thumbnails (leave empty to use video's poster frame)
// Example: 1: "/img/hero-thumb-1.webp"
const HERO_VIDEO_THUMBNAILS = {
  1: "",
  2: "/img/hero-2.png",
  3: "",
  4: "/img/hero-4.png",
};

// Video poster frame times in seconds (used if no thumbnail image provided)
// Example: 1: 2.5 (shows frame at 2.5 seconds)
// Leave as 0 or empty to use first frame (thumbnail overrides this)
const HERO_VIDEO_POSTER_TIMES = {
  1: 0,
  2: 0,
  3: 100,
  4: 0,
};

// Helper to get thumbnail or undefined (uses poster/first frame as fallback)
const getThumbnail = (index) => HERO_VIDEO_THUMBNAILS[index] || undefined;

// Helper to get poster time (returns seconds or 0 for first frame)
const getPosterTime = (index) => HERO_VIDEO_POSTER_TIMES[index] || 0;

// ============================================

const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(1);
  const [activeVideoIndex, setActiveVideoIndex] = useState(1); // Video currently playing (for audio sync)
  const [hasClicked, setHasClicked] = useState(false);
  const [isNextVideoReady, setIsNextVideoReady] = useState(false);
  const [showThumbnail, setShowThumbnail] = useState(true);
  const [posterFrames, setPosterFrames] = useState({}); // Cached poster frame data URLs

  const [loading, setLoading] = useState(true);
  const [loadedVideos, setLoadedVideos] = useState(0);

  const totalVideos = 4;
  const nextVideoRef = useRef(null);
  const mainVideoRef = useRef(null);
  const heroSectionRef = useRef(null);
  const { updateCurrentVideo, setMainVideoRef, updateCurrentVideoTime, isAudioPlaying } = useVideo();
  const { y: scrollY } = useWindowScroll();

  const getVideoSrc = (index) => `videos/hero-${index}.mp4`;

  const handleVideoLoad = () => {
    setLoadedVideos((prev) => prev + 1);
  };

  // Generate poster frame from video at specific time
  const generatePosterFrame = (videoIndex) => {
    const posterTime = getPosterTime(videoIndex);
    if (!posterTime || getThumbnail(videoIndex)) return; // Skip if has thumbnail or time is 0

    const video = document.createElement("video");
    video.src = `videos/hero-${videoIndex}.mp4`;
    video.crossOrigin = "anonymous";
    video.muted = true;
    video.preload = "auto";

    video.addEventListener("loadeddata", () => {
      video.currentTime = posterTime;
    });

    video.addEventListener("seeked", () => {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
      setPosterFrames((prev) => ({ ...prev, [videoIndex]: dataUrl }));
      video.remove();
    });
  };

  // Generate poster frames on mount for videos with poster times
  useEffect(() => {
    for (let i = 1; i <= totalVideos; i++) {
      if (getPosterTime(i) > 0 && !getThumbnail(i)) {
        generatePosterFrame(i);
      }
    }
  }, []);

  // Helper to get the best poster source (thumbnail > generated frame > undefined)
  const getPosterSrc = (index) => {
    // Prefer explicit thumbnail, then generated poster frame; fall back to a generic image
    return getThumbnail(index) || posterFrames[index] || "/img/logo.png";
  };

  // Handle when main video is ready to play
  const handleMainVideoCanPlay = () => {
    setLoading(false);
  };

  // Register the main video ref with context
  useEffect(() => {
    setMainVideoRef(mainVideoRef);
  }, [setMainVideoRef]);

  // Update current video source when ACTIVE video changes (after transition completes)
  useEffect(() => {
    updateCurrentVideo(getVideoSrc(activeVideoIndex));
  }, [activeVideoIndex, updateCurrentVideo]);

  // Scroll-based video pause/resume with audio sync
  useEffect(() => {
    if (!heroSectionRef.current || !mainVideoRef.current) return;

    const heroRect = heroSectionRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const padding = 0; // Extra padding for off-screen detection

    // Check if hero section is off-screen with padding
    const isOffScreen = heroRect.bottom < -padding || heroRect.top > viewportHeight + padding;

    // Get audio element from navbar
    const audioElement = document.querySelector('audio');

    if (isOffScreen) {
      // Pause video when off-screen
      if (mainVideoRef.current && !mainVideoRef.current.paused) {
        mainVideoRef.current.pause();
      }
      // Only pause audio if the audio button is active
      if (audioElement && !audioElement.paused && isAudioPlaying) {
        audioElement.pause();
      }
    } else {
      // Resume video when back on-screen
      if (mainVideoRef.current && mainVideoRef.current.paused) {
        mainVideoRef.current.play();
      }
      // Only resume audio if the audio button is active
      if (audioElement && audioElement.paused && isAudioPlaying) {
        const videoTime = mainVideoRef.current.currentTime;
        audioElement.currentTime = videoTime;
        audioElement.play();
      }
    }
  }, [scrollY, isAudioPlaying]);

  // No need for continuous time updates - we'll get the time when needed

  const handleMiniVdClick = () => {
    setHasClicked(true);
    setIsNextVideoReady(false);
    setShowThumbnail(true); // Show thumbnail during transition

    setCurrentIndex((prevIndex) => (prevIndex % totalVideos) + 1);
  };

  const handleNextVideoLoaded = () => {
    handleVideoLoad();
    setIsNextVideoReady(true);
  };

  // Fade out thumbnail after scale animation completes
  const handleVideoPlay = () => {
    // Don't auto-fade here, let GSAP control it
  };

  useGSAP(
    () => {
      if (!hasClicked || !isNextVideoReady) return;

      const hasThumbnail = !!getPosterSrc(currentIndex);

      if (hasThumbnail) {
        // With thumbnail: scale thumbnail, then fade to video
        gsap.set("#next-thumbnail", { 
          visibility: "visible", 
          opacity: 1, 
          scale: 0.15,
          width: "16rem",
          height: "16rem"
        });
        gsap.set("#next-video", { 
          visibility: "visible", 
          opacity: 0, 
          scale: 0.15,
          width: "16rem",
          height: "16rem"
        });
        
        // Scale in thumbnail over the current video
        gsap.to("#next-thumbnail", {
          transformOrigin: "center center",
          scale: 1,
          width: "100%",
          height: "100%",
          duration: 1.1,
          ease: "power2.inOut",
          onComplete: () => {
            // Start playing video behind thumbnail
            nextVideoRef.current?.play?.();
            // Update active video index NOW that the new video is playing (this syncs audio)
            setActiveVideoIndex(currentIndex);
            // Fade out thumbnail to reveal video
            gsap.to("#next-thumbnail", {
              opacity: 0,
              duration: 0.5,
              ease: "power2.out",
              onComplete: () => {
                setShowThumbnail(false);
              }
            });
            gsap.to("#next-video", {
              opacity: 1,
              duration: 0.3,
              ease: "power2.out",
            });
          }
        });
        
        // Scale video along with thumbnail (but hidden)
        gsap.to("#next-video", {
          transformOrigin: "center center",
          scale: 1,
          width: "100%",
          height: "100%",
          duration: 1.1,
          ease: "power2.inOut",
        });
      } else {
        // No thumbnail: scale video directly
        gsap.set("#next-video", { 
          visibility: "visible", 
          opacity: 1, 
          scale: 0.15,
          width: "16rem",
          height: "16rem"
        });
        
        // Start playing immediately so we see the video while scaling
        nextVideoRef.current?.play?.();
        
        gsap.to("#next-video", {
          transformOrigin: "center center",
          scale: 1,
          width: "100%",
          height: "100%",
          duration: 1.1,
          ease: "power2.inOut",
          onComplete: () => {
            // Update active video index after scale completes
            setActiveVideoIndex(currentIndex);
            setShowThumbnail(false);
          }
        });
      }
    },
    {
      dependencies: [currentIndex, hasClicked, isNextVideoReady],
      revertOnUpdate: true,
    }
  );

  useGSAP(() => {
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

  const mainVideoIndex = currentIndex;
  const nextVideoIndex = (currentIndex % totalVideos) + 1;
  const currentVideoLink = HERO_VIDEO_LINKS[mainVideoIndex];

  const handleWatchVideoClick = () => {
    if (!currentVideoLink) return;
    window.open(currentVideoLink, "_blank", "noopener,noreferrer");
  };

  return (
    <div ref={heroSectionRef} data-hero-section className="relative h-dvh w-screen overflow-x-hidden">
      {loading && (
        <div className="flex-center absolute z-[100] h-dvh w-screen overflow-hidden bg-violet-50">
          {/* https://uiverse.io/G4b413l/tidy-walrus-92 */}
          <div className="three-body">
            <div className="three-body__dot"></div>
            <div className="three-body__dot"></div>
            <div className="three-body__dot"></div>
          </div>
        </div>
      )}

      <div
        id="video-frame"
        className="relative z-10 h-dvh w-screen overflow-hidden rounded-lg bg-black"
      >
        <div>
          <div className="mask-clip-path absolute-center absolute z-50 size-64 cursor-pointer overflow-hidden rounded-lg">
            <VideoPreview>
              <div
                onClick={handleMiniVdClick}
                className="origin-center scale-50 opacity-0 transition-all duration-500 ease-in hover:scale-100 hover:opacity-100"
              >
                {/* Preview: use thumbnail/poster frame if available, otherwise video first frame */}
                {getPosterSrc(nextVideoIndex) ? (
                  <img
                    src={getPosterSrc(nextVideoIndex)}
                    alt={`Preview video ${nextVideoIndex}`}
                    className="size-64 origin-center scale-150 object-cover object-center bg-black"
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <video
                    src={getVideoSrc(nextVideoIndex)}
                    preload="metadata"
                    playsInline
                    loop
                    muted
                    id="current-video"
                    className="size-64 origin-center scale-150 object-cover object-center bg-black"
                    onLoadedData={handleVideoLoad}
                  />
                )}
              </div>
            </VideoPreview>
          </div>

          {/* Scaling thumbnail overlay for next video - scales in then fades to reveal video */}
          {getPosterSrc(currentIndex) && (
            <img
              src={getPosterSrc(currentIndex)}
              alt="Video thumbnail"
              id="next-thumbnail"
              className="absolute-center invisible absolute z-30 size-64 object-cover object-center bg-black"
              style={{ opacity: 0 }}
            />
          )}

          <video
            ref={nextVideoRef}
            src={getVideoSrc(currentIndex)}
            preload="auto"
            playsInline
            loop
            muted
            id="next-video"
            className="absolute-center invisible absolute z-20 size-64 object-cover object-center bg-black"
            style={{ opacity: 0 }}
            onLoadedData={handleNextVideoLoaded}
          />
          <video
            ref={mainVideoRef}
            src={getVideoSrc(mainVideoIndex)}
            poster={getPosterSrc(mainVideoIndex)}
            preload="metadata"
            playsInline
            autoPlay
            loop
            muted
            className="absolute left-0 top-0 size-full object-cover object-center bg-black"
            onCanPlay={handleMainVideoCanPlay}
          />
        </div>

        <h1 className="special-font hero-heading absolute bottom-5 right-5 z-40 text-blue-75">
          ROBOTICS
        </h1>

        <div className="absolute left-0 top-0 z-40 size-full">
          <div className="mt-24 px-5 sm:px-10">
            <h1 className="special-font hero-heading text-blue-100">
              REDEFINE
            </h1>

            <p className="mb-5 max-w-64 font-robert-regular text-blue-100">
              From Concept to Competition <br /> Design. Build. Win.
            </p>

            <Button
              id="watch-trailer"
              title="Watch Video"
              leftIcon={<TiLocationArrow />}
              onClick={handleWatchVideoClick}
              disabled={!currentVideoLink}
              containerClass="!bg-[#13294B] !text-[#FF5F05] flex-center gap-1 disabled:opacity-60"
            />
          </div>
        </div>
      </div>

      <h1 className="special-font hero-heading absolute bottom-5 right-5 text-black">
        ROBOTICS
      </h1>

      <h1 className="special-font hero-heading absolute top-24 left-5 sm:left-10 text-black">
        REDEFINE
      </h1>
    </div>
  );
};

export default Hero;
