import { createContext, useContext, useEffect, useState } from "react";

const VideoContext = createContext();

export const useVideo = () => {
  const context = useContext(VideoContext);
  if (!context) {
    throw new Error("useVideo must be used within a VideoProvider");
  }
  return context;
};

// Sound comes straight from the hero <video> (unmuted), so there is no second
// media element downloading and decoding the same file just for its audio.
export const VideoProvider = ({ children }) => {
  // What the visitor wants (defaults to on, like before)
  const [soundOn, setSoundOn] = useState(true);
  // Browsers block unmuted playback until the first user gesture
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    if (unlocked) return;
    const unlock = (e) => {
      // The sound toggle handles its own first click
      if (e.target.closest?.("[data-sound-toggle]")) return;
      setUnlocked(true);
    };
    window.addEventListener("pointerdown", unlock, { once: true });
    window.addEventListener("keydown", unlock, { once: true });
    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, [unlocked]);

  const toggleSound = () => {
    if (!unlocked) {
      setUnlocked(true);
      setSoundOn(true);
      return;
    }
    setSoundOn((on) => !on);
  };

  return (
    <VideoContext.Provider
      value={{ soundActive: soundOn && unlocked, toggleSound }}
    >
      {children}
    </VideoContext.Provider>
  );
};
