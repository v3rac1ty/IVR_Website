// ==========================================
// TEAMS - edit or add teams here
// ==========================================
// Each team shows up in two places on the page:
//   1. a card in the "Find your team" grid (title, tagline, video)
//   2. its own slide in the team carousel below (intro, image, lists)
// `image` is the slide's still/poster; `slideVideo` (optional) plays behind the active slide.
// To add more detail, add paragraphs to `intro` or another { heading, items } block to `lists`.
// To add a team, add an object with a unique `id` (it becomes the #anchor link).
export const TEAMS = [
  {
    id: "vex-u",
    title: "VEX U",
    tagline: "Our competition team. We design, build, and drive robots against universities from around the world.",
    video: "/videos/team-vexu.mp4",
    poster: "/img/posters/team-vexu.webp",
    image: "/img/teams/vex-u.webp",
    slideVideo: "/videos/team-vexu-wide.mp4",
    imageAlt: "Overhead view of an Illini VEX U match at the VEX World Championship",
    intro: [
      "VEX U is the college division of the VEX Robotics Competition. Every season brings a new game, and college teams get more room to engineer than high school teams: two robots per team and custom-made parts.",
    ],
    lists: [
      {
        heading: "What you'll do",
        items: [
          "Design and build two robots for each season's game",
          "Compete at regional events and the VEX World Championship",
          "Work across mechanical, electrical, and software",
          "Document the build in an engineering notebook for judged awards",
        ],
      },
    ],
  },
  {
    id: "rd-mechanical",
    title: "R&D Mechanical",
    tagline: "Model, prototype, and machine mechanisms that go beyond what competition rules allow.",
    video: "/videos/team-mech.mp4",
    poster: "/img/posters/team-mech.webp",
    image: "/img/teams/rd-mechanical.webp",
    slideVideo: "/videos/team-mech.mp4",
    imageAlt: "Close-up of gears and sprockets on an Illini robot",
    intro: [
      "Mechanical R&D runs longer projects outside of competition, taking ideas from first sketch to finished, tested part.",
    ],
    lists: [
      {
        heading: "Skills you'll use",
        items: [
          "CAD in SolidWorks and Fusion 360",
          "3D printing and rapid prototyping",
          "CNC machining and precision fabrication",
          "Testing and iterating on mechanisms",
        ],
      },
    ],
  },
  {
    id: "rd-software",
    title: "R&D Software",
    tagline: "Autonomous routines, computer vision, and control systems that let robots drive themselves.",
    video: "/videos/team-software.mp4",
    poster: "/img/posters/team-software.webp",
    image: "/img/teams/rd-software.webp",
    slideVideo: "/videos/team-software.mp4",
    imageAlt: "A team member writing robot code on a laptop beside the field",
    intro: [
      "Software R&D writes the code that runs our robots, then proves it on real hardware.",
    ],
    lists: [
      {
        heading: "What we work on",
        items: [
          "Path planning and motion control",
          "Computer vision and sensor fusion",
          "PID tuning and control systems",
          "Data logging and performance analysis",
        ],
      },
    ],
  },
];

export const SELECT_TEAM_EVENT = "select-team";

// Scrolls down to the team carousel and opens the given team's slide.
// Pass "teams" (or any section id) to just scroll there.
export const scrollToTeam = (id) => {
  document.getElementById("teams")?.scrollIntoView({ behavior: "smooth", block: "start" });
  if (id !== "teams") window.dispatchEvent(new CustomEvent(SELECT_TEAM_EVENT, { detail: id }));
};
