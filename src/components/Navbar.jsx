import clsx from "clsx";
import gsap from "gsap";
import { useWindowScroll } from "react-use";
import { useEffect, useRef, useState } from "react";
import { TiLocationArrow } from "react-icons/ti";

import Button from "./Button";
import { useVideo } from "../contexts/VideoContext";

const navItems = ["Nexus", "Vault", "Prologue", "About", "Contact"];

const NavBar = () => {
  // State for visual indicator
  const [isIndicatorActive, setIsIndicatorActive] = useState(false);

  // Refs for audio and navigation container
  const audioElementRef = useRef(null);
  const navContainerRef = useRef(null);
  const { currentVideoSrc, currentVideoTime, getCurrentVideoTime, isAudioPlaying, updateAudioState } = useVideo();

  const { y: currentScrollY } = useWindowScroll();
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Toggle audio and visual indicator
  const toggleAudioIndicator = () => {
    const newAudioState = !isAudioPlaying;
    setIsIndicatorActive(newAudioState);
    updateAudioState(newAudioState);
  };

  // Update audio source when currentVideoSrc changes
  useEffect(() => {
    if (audioElementRef.current) {
      audioElementRef.current.src = `/${currentVideoSrc}`;
      // If audio is currently playing, restart it with the new source
      if (isAudioPlaying) {
        const videoTime = getCurrentVideoTime();
        audioElementRef.current.currentTime = videoTime;
        const playPromise = audioElementRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch((err) => {
            console.warn('Autoplay failed:', err);
            const resumePlayback = () => {
              try {
                const videoTime = getCurrentVideoTime();
                audioElementRef.current.currentTime = videoTime;
                audioElementRef.current.play().then(() => {
                  updateAudioState(true);
                  setIsIndicatorActive(true);
                }).catch((e) => console.warn('Play after gesture failed:', e));
              } catch (e) {
                console.warn('Resume handler error:', e);
              } finally {
                window.removeEventListener('pointerdown', resumePlayback);
              }
            };
            window.addEventListener('pointerdown', resumePlayback, { once: true });
          });
        }
      }
    }
  }, [currentVideoSrc, isAudioPlaying, getCurrentVideoTime]);

  // Manage audio playback - only sync when starting to play
  useEffect(() => {
    if (isAudioPlaying) {
      // Set the audio to the current video time before playing
      const videoTime = getCurrentVideoTime();
      if (audioElementRef.current) {
        audioElementRef.current.currentTime = videoTime;
        const playPromise = audioElementRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch((err) => {
            console.warn('Autoplay failed:', err);
            const resumePlayback = () => {
              try {
                const videoTime = getCurrentVideoTime();
                audioElementRef.current.currentTime = videoTime;
                audioElementRef.current.play().then(() => {
                  updateAudioState(true);
                  setIsIndicatorActive(true);
                }).catch((e) => console.warn('Play after gesture failed:', e));
              } catch (e) {
                console.warn('Resume handler error:', e);
              } finally {
                window.removeEventListener('pointerdown', resumePlayback);
              }
            };
            window.addEventListener('pointerdown', resumePlayback, { once: true });
          });
        }
      }
    } else {
      if (audioElementRef.current) {
        audioElementRef.current.pause();
      }
    }
  }, [isAudioPlaying, getCurrentVideoTime]);

  // Audio sync is now handled by the Hero component to prevent desync issues

  useEffect(() => {
    if (currentScrollY === 0) {
      // Topmost position: show navbar without floating-nav
      setIsNavVisible(true);
      navContainerRef.current.classList.remove("floating-nav");
    } else if (currentScrollY > lastScrollY) {
      // Scrolling down: hide navbar and apply floating-nav
      setIsNavVisible(false);
      navContainerRef.current.classList.add("floating-nav");
    } else if (currentScrollY < lastScrollY) {
      // Scrolling up: show navbar with floating-nav
      setIsNavVisible(true);
      navContainerRef.current.classList.add("floating-nav");
    }

    setLastScrollY(currentScrollY);
  }, [currentScrollY, lastScrollY]);

  useEffect(() => {
    gsap.to(navContainerRef.current, {
      y: isNavVisible ? 0 : -100,
      opacity: isNavVisible ? 1 : 0,
      duration: 0.2,
    });
  }, [isNavVisible]);

  return (
    <div
      ref={navContainerRef}
      className="fixed inset-x-0 top-4 z-50 h-16 border-none transition-all duration-700 sm:inset-x-6"
    >
      <header className="absolute top-1/2 w-full -translate-y-1/2">
        <nav className="flex size-full items-center justify-between p-4">
          {/* Logo and Product button */}
          <div className="flex items-center gap-7">
            <img src="/img/logo.png" alt="logo" className="w-10" />

            <a
              id="product-button"
              href="https://guardianproline.com/collections/illini-robotics"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative z-10 hidden w-fit cursor-pointer items-center justify-center gap-1 overflow-hidden rounded-full bg-violet-50 px-7 py-3 text-black md:flex"
            >
              <span className="relative inline-flex overflow-hidden font-general text-xs uppercase">
                <div className="translate-y-0 skew-y-0 transition duration-500 group-hover:translate-y-[-160%] group-hover:skew-y-12">
                  Merch
                </div>
                <div className="absolute translate-y-[164%] skew-y-12 transition duration-500 group-hover:translate-y-0 group-hover:skew-y-0">
                  Merch
                </div>
              </span>
              <TiLocationArrow />
            </a>
          </div>

          {/* Navigation Links and Audio Button */}
          <div className="flex h-full items-center">
            <div className="hidden md:block">
              {navItems.map((item, index) => {
                if (item.toLowerCase() === "contact") {
                  return (
                    <a
                      key={index}
                      href="#contact"
                      className="nav-hover-btn"
                      onClick={e => {
                        e.preventDefault();
                        const el = document.getElementById("contact");
                        if (el) {
                          el.scrollIntoView({ behavior: "smooth" });
                        }
                      }}
                    >
                      {item}
                    </a>
                  );
                }
                return (
                  <a
                    key={index}
                    href={`#${item.toLowerCase()}`}
                    className="nav-hover-btn"
                  >
                    {item}
                  </a>
                );
              })}
            </div>

            <button
              type="button"
              onClick={toggleAudioIndicator}
              aria-label={isAudioPlaying ? "Pause audio" : "Play audio"}
              className="ml-10 flex items-center space-x-0.5 rounded-full p-3 min-h-11 min-w-11"
            >
              <audio
                ref={audioElementRef}
                className="hidden"
                src={`/${currentVideoSrc}`}
                loop
              />
              {[1, 2, 3, 4].map((bar) => (
                <div
                  key={bar}
                  className={clsx("indicator-line", {
                    active: isIndicatorActive,
                  })}
                  style={{
                    animationDelay: `${bar * 0.1}s`,
                  }}
                />
              ))}
            </button>
          </div>
        </nav>
      </header>
    </div>
  );
};

export default NavBar;
