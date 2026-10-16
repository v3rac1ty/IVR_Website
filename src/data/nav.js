// Section links shared by the navbar and the footer.
export const NAV_ITEMS = [
  { label: "About", href: "about" },
  { label: "Departments", href: "departments" },
  { label: "Events", href: "story" },
  { label: "Sponsors", href: "sponsors" },
  { label: "Contact", href: "contact" },
];

export const MERCH_URL = "https://guardianproline.com/collections/illini-robotics";

export const scrollToSection = (e, id) => {
  e.preventDefault();
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
};
