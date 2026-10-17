// ==========================================
// TEAM HISTORY - edit or add seasons here
// ==========================================
// Newest season goes last. Markers light orange as the timeline line reaches them; the last one fills solid.
export const HISTORY_STATS = [
  { value: 5, label: "Trips to the World Championship" },
  { value: 3, suffix: "rd", label: "In the Innovate Division at Worlds" },
  // 3 Robot Skills Champion, 2 Design, 1 Amaze, 1 Innovate, 1 Onshape Challenge (RobotEvents + team records)
  { value: 8, label: "Awards won since 2021" },
];

// Season results from RobotEvents (team ICTRL for 2021-22, ILLIN1 after). Event codes carry the season start year.
export const SEASONS = [
  {
    years: "2021-22",
    game: "Tipping Point",
    title: "First trip to Worlds",
    text: "Competing as iCTRL: Robot Skills Champion at Nebraska's remote skills event, then Tournament Finalists and the Design Award at West Virginia to qualify for our first World Championship, where we reached the quarterfinals and placed 5th in World Skills.",
  },
  {
    years: "2022-23",
    game: "Spin Up",
    title: "Amaze Award at Worlds",
    text: "Our first season as Illini VEX Robotics (ILLIN1): Robot Skills Champion and the Design Award at our own Cornfield Clash, the Onshape Challenge win, then the Amaze Award, 2nd in the Skills Challenge, and 5th in World Skills at the 2023 World Championship.",
    highlight: true,
  },
  {
    years: "2023-24",
    game: "Over Under",
    title: "3rd at Worlds",
    text: "Tournament Finalists and the Innovate Award at Purdue's Slam and Jam, then our best World Championship yet: 3rd in the Innovate Division, 7-1-1.",
    highlight: true,
  },
  {
    years: "2024-25",
    game: "High Stakes",
    title: "Signature Event Skills Champion",
    text: "Robot Skills Champion at the RiverBots III Signature Event and Tournament Finalists at NUKEtown, on the way to the 2025 World Championship.",
  },
  {
    years: "2025-26",
    game: "Push Back",
    title: "Salt and Pepper at Worlds",
    text: "Our robots Salt and Pepper carried us to the 2026 World Championship, our fifth straight trip.",
  },
  {
    years: "2026-27",
    game: "Override",
    title: "Road to Worlds",
    text: "Working toward 2026-27 World Championship qualification in VEX Override, and hosting Cornfield Clash at the Siebel Center for Design.",
    current: true,
  },
];
