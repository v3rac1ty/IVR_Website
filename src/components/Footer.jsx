import {
  FaDiscord,
  FaYoutube,
  FaInstagram,
  FaTiktok,
  FaLinkedin,
} from "react-icons/fa";

const socialLinks = [
  { label: "Discord", href: "https://discord.com", icon: <FaDiscord /> },
  { label: "YouTube", href: "https://www.youtube.com/@illinivexrobotics", icon: <FaYoutube /> },
  { label: "Instagram", href: "https://www.instagram.com/illinivexrobotics/", icon: <FaInstagram /> },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/illini-vex-robotics/", icon: <FaLinkedin /> },
  { label: "TikTok", href: "https://www.tiktok.com/@illini.vex.roboti", icon: <FaTiktok /> },
];

const Footer = () => {
  return (
    <footer className="w-full border-t border-white/10 bg-ink-700 py-8 text-paper">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-6 px-4 md:grid-cols-3 md:px-10">
        <img src="/img/opt/logo.webp" alt="Illini VEX Robotics" width={112} height={44} className="mx-auto h-auto w-28 md:mx-0" loading="lazy" decoding="async" />

        <div className="flex w-full justify-center gap-2">
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.label}
              className="flex size-11 items-center justify-center rounded-full text-xl text-accent transition-colors duration-300 hover:bg-white/10 hover:text-paper"
            >
              {link.icon}
            </a>
          ))}
        </div>

        <p className="text-center text-sm text-paper-muted md:text-right">
          © Illini VEX Robotics {new Date().getFullYear()}. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
