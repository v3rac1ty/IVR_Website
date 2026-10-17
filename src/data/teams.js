import { smoothScrollTo } from "../lib/motion";

// ==========================================
// TEAMS - edit or add teams here
// ==========================================
// Each team shows up in two places on the page:
//   1. a card in the "Find your team" grid (title, tagline, video) - only teams placed in Features.jsx
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
      "VEX U is the college division of the VEX Robotics Competition: a new, sport-like game every year, played against universities from around the world. College teams get more room to engineer than high school teams, with two robots per team and custom-made parts.",
    ],
    lists: [
      {
        heading: "What you'll do",
        items: [
          "Design robots in CAD and prototype mechanisms",
          "Manufacture parts with 3D printing, laser cutting, and water jetting",
          "Program routines for the autonomous period",
          "Design custom PCBs and integrate Raspberry Pi sensors",
        ],
      },
      {
        heading: "How the season runs",
        items: [
          "Fall: learn VEX U basics, prototype, and build first iterations",
          "Fall: take on the season's first competitions",
          "Spring: finalize two competition robots",
          "Spring: compete at the World Championship",
        ],
      },
    ],
  },
  {
    id: "rd-mechanical",
    title: "R&D Mechanical",
    tagline: "Hands-on robotics projects beyond competition, from tangram-solving robots to a robotic arm.",
    video: "/videos/team-mech-fab.mp4",
    poster: "/img/posters/team-mech-fab.webp",
    image: "/img/teams/rd-mechanical-tangram.webp",
    slideVideo: "/videos/team-mech-fab.mp4",
    imageAlt: "The Tangram robot: a triangular omni-wheel base with a Prismier plate",
    intro: [
      "Mechanical R&D works on alternative robotics projects in 4-5 person subteams, doing mostly mechanical and electrical design. We work alongside Professor Hsiao-Wecksler and the Human Dynamics and Controls Lab, and present at Engineering Open House every April. Any level of experience is welcome.",
    ],
    lists: [
      {
        heading: "Last year's projects",
        items: [
          "Tangram robot: cleaning up the electronics and building a new base plate",
          "Robotic arm: moved from a SCARA design to a more typical robotic arm",
        ],
      },
      {
        heading: "Skills you'll learn",
        items: [
          "Mechanical and electrical design in Fusion 360",
          "Soldering",
          "Laser and waterjet cutting",
          "3D printing",
        ],
      },
    ],
  },
  {
    id: "rd-software",
    title: "R&D Software",
    tagline: "Experimental projects in reinforcement learning, computer vision, and path planning.",
    video: "/videos/team-software.mp4",
    poster: "/img/posters/team-software.webp",
    image: "/img/teams/rd-software-conference.webp",
    imageAlt: "Software R&D members presenting their reinforcement learning research poster",
    intro: [
      "Software R&D is different from VEX U programming: experimental, research-driven projects. Our goal-conditioned adversarial reinforcement learning research was presented at the Midwest ML Conference. Work ethic matters more than experience, and we're open to your project ideas.",
    ],
    lists: [
      {
        heading: "This year",
        items: [
          "Wrap up our RL research for publication and a conference",
          "Tangram bots: computer vision team building AprilTag detection",
          "Tangram bots: algorithms team building a modified A* path planner in simulation",
          "Present at Engineering Open House and the Undergraduate Symposium",
        ],
      },
    ],
  },
  {
    id: "business",
    title: "Business",
    tagline: "Outreach, marketing, and the corporate partnerships that keep the team running.",
    image: "/img/teams/business-quad-day.webp",
    imageAlt: "An Illini VEX Robotics member at the team's Quad Day booth",
    intro: [
      "The business team runs our outreach, marketing, and sponsor relationships, from Quad Day booths to resume workshops.",
    ],
    lists: [
      {
        heading: "Outreach & marketing",
        items: [
          "Social event planning",
          "Promotional content and social media",
          "Graphic design",
          "Quad Day, E-Night, and Engineering Open House",
          "Collaborations with other organizations",
        ],
      },
      {
        heading: "Corporate sponsorships",
        items: [
          "Corporate sponsorship outreach",
          "Maintaining company relationships",
          "Professional development events",
          "Career day prep and resume workshops",
        ],
      },
    ],
  },
];

export const SELECT_TEAM_EVENT = "select-team";

// Scrolls down to the team carousel and opens the given team's slide.
// Pass "teams" (or any section id) to just scroll there.
export const scrollToTeam = (id) => {
  smoothScrollTo(document.getElementById("teams"));
  if (id !== "teams") window.dispatchEvent(new CustomEvent(SELECT_TEAM_EVENT, { detail: id }));
};
