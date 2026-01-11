import Hero from "./components/Hero";
import NavBar from "./components/Navbar";
import { Suspense, lazy } from "react";
const About = lazy(() => import("./components/About"));
const Features = lazy(() => import("./components/Features"));
const Story = lazy(() => import("./components/Story"));
const Sponsors = lazy(() => import("./components/Sponsors"));
const Contact = lazy(() => import("./components/Contact"));
const Footer = lazy(() => import("./components/Footer"));
import { VideoProvider } from "./contexts/VideoContext";

function App() {
  return (
    <VideoProvider>
      <main className="relative min-h-screen w-screen overflow-x-hidden">
        <NavBar />
        <Hero />
        <Suspense fallback={<div className="min-h-[40vh]" />}> 
          <About />
        </Suspense>
        <Suspense fallback={<div className="min-h-[40vh]" />}> 
          <Features />
        </Suspense>
        <Suspense fallback={<div className="min-h-[40vh]" />}> 
          <Story />
        </Suspense>
        <Suspense fallback={<div className="min-h-[40vh]" />}> 
          <Sponsors />
        </Suspense>
        <Suspense fallback={<div className="min-h-[40vh]" />}> 
          <Contact />
        </Suspense>
        <Suspense fallback={<div className="min-h-[20vh]" />}> 
          <Footer />
        </Suspense>
      </main>
    </VideoProvider>
  );
}

export default App;
