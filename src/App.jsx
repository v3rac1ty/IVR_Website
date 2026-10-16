import { Suspense, lazy } from "react";

import Hero from "./components/Hero";
import NavBar from "./components/Navbar";
import { VideoProvider } from "./contexts/VideoContext";

const About = lazy(() => import("./components/About"));
const Features = lazy(() => import("./components/Features"));
const Story = lazy(() => import("./components/Story"));
const Sponsors = lazy(() => import("./components/Sponsors"));
const Contact = lazy(() => import("./components/Contact"));
const Footer = lazy(() => import("./components/Footer"));

function App() {
  return (
    <VideoProvider>
      <NavBar />
      <main className="relative min-h-dvh w-full overflow-x-clip">
        <Hero />
        {/* One boundary: sections mount together, so pinned ScrollTriggers measure the final layout */}
        <Suspense fallback={<div className="min-h-dvh" />}>
          <About />
          <Features />
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
