import {
  FaDiscord,
  FaYoutube,
  FaInstagram,
  FaTiktok,
  FaLinkedin,
} from "react-icons/fa";

const socialLinks = [
  { href: "https://discord.com", icon: <FaDiscord /> },
  { href: "https://www.youtube.com/@illinivexrobotics", icon: <FaYoutube /> },
  { href: "https://www.instagram.com/illinivexrobotics/", icon: <FaInstagram /> },
  { href: "https://www.linkedin.com/company/illini-vex-robotics/", icon: <FaLinkedin /> },
  { href: "https://www.tiktok.com/@illini.vex.roboti", icon: <FaTiktok /> },
];

const Footer = () => {
  return (
    <footer className="w-screen bg-[#13294B] py-4 text-[#FF5F05]">
      <div className="container mx-auto grid grid-cols-1 items-center gap-4 px-4 md:grid-cols-3">
        <div className="hidden md:block" />

        <div className="flex w-full justify-center gap-4">
          {socialLinks.map((link, index) => (
            <a
              key={index}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#FF5F05] transition-colors duration-500 ease-in-out hover:text-white"
            >
              {link.icon}
            </a>
          ))}
        </div>

        <div className="flex w-full justify-center md:justify-end">
          <p className="text-center text-sm font-light md:text-right">
            © ILLINI VEX Robotics 2025. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
