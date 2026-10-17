import { smoothScrollTo } from "../lib/motion";

// Section links shared by the navbar and the footer.
export const NAV_ITEMS = [
  { label: "About", href: "about" },
  { label: "Departments", href: "departments" },
  { label: "Events", href: "story" },
  { label: "Sponsors", href: "sponsors" },
  { label: "Contact", href: "contact" },
];

export const MERCH_URL = "https://guardianproline.com/collections/illini-robotics";
export const DISCORD_URL = "https://discord.gg/n24Fd7pk4P"; // from linktr.ee/illinivexrobotics

export const scrollToSection = (e, id) => {
  e.preventDefault();
  smoothScrollTo(document.getElementById(id));
};
