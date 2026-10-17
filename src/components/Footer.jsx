import {
  FaDiscord,
  FaYoutube,
  FaInstagram,
  FaTiktok,
  FaLinkedin,
} from "react-icons/fa";
import { TiLocationArrow } from "react-icons/ti";

import { NAV_ITEMS, MERCH_URL, DISCORD_URL, scrollToSection } from "../data/nav";

const socialLinks = [
  { label: "Discord", href: DISCORD_URL, icon: <FaDiscord /> },
  { label: "YouTube", href: "https://www.youtube.com/@illinivexrobotics", icon: <FaYoutube /> },
  { label: "Instagram", href: "https://www.instagram.com/illinivexrobotics/", icon: <FaInstagram /> },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/illini-vex-robotics/", icon: <FaLinkedin /> },
  { label: "TikTok", href: "https://www.tiktok.com/@illini.vex.roboti", icon: <FaTiktok /> },
];

const Footer = () => {
  return (
    <footer className="w-full border-t border-white/10 bg-ink-700 text-paper">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-[1fr_auto] md:px-10">
        <div>
          <img src="/img/opt/logo.webp" alt="Illini VEX Robotics" width={128} height={50} className="h-auto w-32" loading="lazy" decoding="async" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-paper-muted">
            The University of Illinois VEX U team and host of Cornfield Clash.
          </p>
        </div>

        <nav aria-label="Footer" className="flex flex-wrap items-center gap-x-6 gap-y-3 md:flex-nowrap md:justify-end">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={`#${item.href}`}
              onClick={(e) => scrollToSection(e, item.href)}
              className="text-sm font-semibold text-paper transition-colors hover:text-accent"
            >
              {item.label}
            </a>
          ))}
          <a
            href={MERCH_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm font-semibold text-accent transition-colors hover:text-accent-hover"
          >
            Merch <TiLocationArrow />
          </a>
        </nav>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 sm:flex-row md:px-10">
          <p className="text-sm text-paper-muted">© Illini VEX Robotics {new Date().getFullYear()}. All rights reserved.</p>
          <div className="flex gap-1">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
                className="flex size-11 items-center justify-center rounded-full text-xl text-paper-muted transition-colors duration-300 hover:bg-white/10 hover:text-accent"
              >
                {link.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
