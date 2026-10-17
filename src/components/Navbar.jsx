import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { TiLocationArrow } from "react-icons/ti";
import { HiOutlineMenuAlt4, HiX } from "react-icons/hi";

import { useVideo } from "../contexts/VideoContext";
import { ScrollTrigger, smoothScrollTo } from "../lib/motion";
import { NAV_ITEMS, MERCH_URL, scrollToSection } from "../data/nav";

const NavBar = () => {
  const { soundActive, toggleSound } = useVideo();
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [isFloating, setIsFloating] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navContainerRef = useRef(null);

  // One ScrollTrigger instead of re-rendering on every scroll event.
  // State only changes when direction or the top-of-page flag flips.
  useEffect(() => {
    const trigger = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        const atTop = self.scroll() < 8;
        setIsFloating(!atTop);
        setIsNavVisible(atTop || self.direction === -1);
      },
    });
    return () => trigger.kill();
  }, []);

  useEffect(() => {
    if (!isNavVisible) setMenuOpen(false);
  }, [isNavVisible]);

  return (
    <div
      ref={navContainerRef}
      data-nav
      className={clsx(
        "fixed inset-x-3 top-3 z-50 transition-all duration-300 ease-out sm:inset-x-6 sm:top-4",
        isFloating && "floating-nav",
        isNavVisible ? "translate-y-0 opacity-100" : "-translate-y-24 opacity-0"
      )}
    >
      <header>
        <nav className="flex h-16 items-center justify-between px-4" aria-label="Main">
          <div className="flex items-center gap-6">
            <a href="#top" onClick={(e) => { e.preventDefault(); smoothScrollTo(0); }} aria-label="Illini VEX Robotics home">
              <img
                src="/img/opt/logo.webp"
                alt=""
                width={96}
                height={37}
                className="h-auto w-24"
                decoding="async"
              />
            </a>

            <a
              href={MERCH_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative hidden items-center gap-1 overflow-hidden rounded-full bg-paper px-6 py-2.5 text-xs font-bold uppercase tracking-wide text-ink transition-transform active:scale-[0.98] md:flex"
            >
              <span className="relative inline-flex overflow-hidden">
                <span className="transition duration-500 group-hover:translate-y-[-160%] group-hover:skew-y-12">
                  Merch
                </span>
                <span aria-hidden="true" className="absolute translate-y-[164%] skew-y-12 transition duration-500 group-hover:translate-y-0 group-hover:skew-y-0">
                  Merch
                </span>
              </span>
              <TiLocationArrow />
            </a>
          </div>

          <div className="flex h-full items-center gap-2">
            <div className="hidden md:block">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.href}
                  href={`#${item.href}`}
                  className="nav-hover-btn"
                  onClick={(e) => scrollToSection(e, item.href)}
                >
                  {item.label}
                </a>
              ))}
            </div>

            <button
              type="button"
              data-sound-toggle
              onClick={toggleSound}
              aria-label={soundActive ? "Mute video sound" : "Play video sound"}
              aria-pressed={soundActive}
              className="ml-4 flex min-h-11 min-w-11 items-center justify-center space-x-0.5 rounded-full p-3"
            >
              {[1, 2, 3, 4].map((bar) => (
                <div
                  key={bar}
                  className={clsx("indicator-line", { active: soundActive })}
                  style={{ animationDelay: `${bar * 0.1}s` }}
                />
              ))}
            </button>

            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className="flex min-h-11 min-w-11 items-center justify-center rounded-full text-2xl text-paper md:hidden"
            >
              {menuOpen ? <HiX /> : <HiOutlineMenuAlt4 />}
            </button>
          </div>
        </nav>

        {/* Mobile menu */}
        <div
          id="mobile-menu"
          className={clsx(
            "grid overflow-hidden rounded-card bg-ink/95 backdrop-blur-md transition-all duration-300 md:hidden",
            menuOpen ? "grid-rows-[1fr] border border-white/10 opacity-100" : "grid-rows-[0fr] opacity-0"
          )}
        >
          <div className="min-h-0">
            <ul className="flex flex-col gap-1 p-3">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <a
                    href={`#${item.href}`}
                    tabIndex={menuOpen ? 0 : -1}
                    onClick={(e) => { scrollToSection(e, item.href); setMenuOpen(false); }}
                    className="block rounded-lg p-3 font-display text-2xl font-extrabold tracking-[-0.04em] text-paper hover:bg-white/5"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={MERCH_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  tabIndex={menuOpen ? 0 : -1}
                  className="flex items-center gap-1 rounded-lg p-3 font-display text-2xl font-extrabold tracking-[-0.04em] text-accent hover:bg-white/5"
                >
                  Merch <TiLocationArrow />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </header>
    </div>
  );
};

export default NavBar;
