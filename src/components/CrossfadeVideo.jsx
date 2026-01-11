import { useState, useRef, useEffect, useCallback } from "react";

/**
 * CrossfadeVideo - A reusable video component that smoothly crossfades 
 * when looping from end to start instead of hard cutting.
 * 
 * @param {string} src - Video source URL
 * @param {number} crossfadeDuration - Duration of the crossfade in seconds (default: 1)
 * @param {string} className - Additional CSS classes
 * @param {boolean} muted - Whether the video is muted (default: true)
 * @param {boolean} autoPlay - Whether to autoplay (default: true)
 * @param {object} style - Additional inline styles
 */
const CrossfadeVideo = ({
  src,
  crossfadeDuration = 1,
  className = "",
  muted = true,
  autoPlay = true,
  style = {},
  ...props
}) => {
  const video1Ref = useRef(null);
  const video2Ref = useRef(null);
  const [activeVideo, setActiveVideo] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const transitionTimeoutRef = useRef(null);

  // Handle the crossfade transition
  const handleTimeUpdate = useCallback(() => {
    const activeVideoRef = activeVideo === 1 ? video1Ref : video2Ref;
    const inactiveVideoRef = activeVideo === 1 ? video2Ref : video1Ref;
    
    if (!activeVideoRef.current || !inactiveVideoRef.current) return;
    
    const video = activeVideoRef.current;
    const timeRemaining = video.duration - video.currentTime;
    
    // Start crossfade when approaching the end
    if (timeRemaining <= crossfadeDuration && !isTransitioning && video.duration > 0) {
      setIsTransitioning(true);
      
      // Prepare and start the inactive video from the beginning
      const inactiveVideo = inactiveVideoRef.current;
      inactiveVideo.currentTime = 0;
      inactiveVideo.play().catch(() => {});
      
      // Switch active video after crossfade completes
      transitionTimeoutRef.current = setTimeout(() => {
        setActiveVideo(activeVideo === 1 ? 2 : 1);
        setIsTransitioning(false);
        
        // Pause the now-inactive video and reset it
        video.pause();
        video.currentTime = 0;
      }, crossfadeDuration * 1000);
    }
  }, [activeVideo, crossfadeDuration, isTransitioning]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, []);

  // Initialize videos
  useEffect(() => {
    const video1 = video1Ref.current;
    const video2 = video2Ref.current;
    
    if (video1 && autoPlay) {
      video1.play().catch(() => {});
    }
    
    // Preload the second video
    if (video2) {
      video2.load();
    }
  }, [src, autoPlay]);

  const baseVideoStyle = {
    position: "absolute",
    left: 0,
    top: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition: "center",
    transition: `opacity ${crossfadeDuration}s ease-in-out`,
  };

  const getVideoOpacity = (videoNum) => {
    if (isTransitioning) {
      // During transition: fade out active, fade in inactive
      return videoNum === activeVideo ? 0 : 1;
    }
    // Normal state: active is visible, inactive is hidden
    return videoNum === activeVideo ? 1 : 0;
  };

  return (
    <div 
      className={className} 
      style={{ position: "absolute", overflow: "hidden", zIndex: 0, ...style }}
      {...props}
    >
      <video
        ref={video1Ref}
        src={src}
        muted={muted}
        playsInline
        onTimeUpdate={activeVideo === 1 ? handleTimeUpdate : undefined}
        style={{
          ...baseVideoStyle,
          opacity: getVideoOpacity(1),
        }}
      />
      <video
        ref={video2Ref}
        src={src}
        muted={muted}
        playsInline
        onTimeUpdate={activeVideo === 2 ? handleTimeUpdate : undefined}
        style={{
          ...baseVideoStyle,
          opacity: getVideoOpacity(2),
        }}
      />
    </div>
  );
};

export default CrossfadeVideo;
