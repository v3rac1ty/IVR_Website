import { createContext, useContext, useState } from 'react';

const VideoContext = createContext();

export const useVideo = () => {
  const context = useContext(VideoContext);
  if (!context) {
    throw new Error('useVideo must be used within a VideoProvider');
  }
  return context;
};

export const VideoProvider = ({ children }) => {
  const [currentVideoSrc, setCurrentVideoSrc] = useState('videos/hero-1.mp4');
  const [currentVideoTime, setCurrentVideoTime] = useState(0);
  const [mainVideoRef, setMainVideoRefState] = useState(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  const updateCurrentVideo = (src) => {
    setCurrentVideoSrc(src);
  };

  const updateCurrentVideoTime = (time) => {
    setCurrentVideoTime(time);
  };

  const setMainVideoRef = (ref) => {
    setMainVideoRefState(ref);
  };

  const getCurrentVideoTime = () => {
    return mainVideoRef?.current?.currentTime || 0;
  };

  const updateAudioState = (playing) => {
    setIsAudioPlaying(playing);
  };

  return (
    <VideoContext.Provider value={{ 
      currentVideoSrc, 
      updateCurrentVideo, 
      currentVideoTime,
      updateCurrentVideoTime,
      setMainVideoRef,
      getCurrentVideoTime,
      isAudioPlaying,
      updateAudioState
    }}>
      {children}
    </VideoContext.Provider>
  );
};