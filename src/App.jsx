import { Suspense, lazy } from "react";

import Hero from "./components/Hero";
import NavBar from "./components/Navbar";
import GhostRobot from "./components/GhostRobot";
import { VideoProvider } from "./contexts/VideoContext";

const About = lazy(() => import("./components/About"));
const History = lazy(() => import("./components/History"));
const Features = lazy(() => import("./components/Features"));
const TeamDetails = lazy(() => import("./components/TeamDetails"));
const Manufacturing = lazy(() => import("./components/Manufacturing"));
const Story = lazy(() => import("./components/Story"));
const Sponsors = lazy(() => import("./components/Sponsors"));
const Contact = lazy(() => import("./components/Contact"));
const Footer = lazy(() => import("./components/Footer"));

function App() {
  return (
    <VideoProvider>
      <div
        aria-hidden="true"
        className="scroll-progress pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px] bg-accent shadow-[0_0_10px_rgb(255_95_5/0.7)]"
      />
      <GhostRobot />
      <NavBar />
      <main className="relative min-h-dvh w-full overflow-x-clip">
        <Hero />
        {/* One boundary: sections mount together, so pinned ScrollTriggers measure the final layout */}
        <Suspense fallback={<div className="min-h-dvh" />}>
          <About />
          <History />
          <Features />
          <TeamDetails />
          <Manufacturing />
          <Story />
          <Sponsors />
          <Contact />
        </Suspense>
      </main>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </VideoProvider>
  );
}

export default App;
