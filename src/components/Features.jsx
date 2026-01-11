import { useState, useRef, forwardRef, useEffect } from "react";
import { TiLocationArrow } from "react-icons/ti";
import { IoArrowBack } from "react-icons/io5";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
import { useWindowScroll } from "react-use";
import CrossfadeVideo from "./CrossfadeVideo";

gsap.registerPlugin(ScrollTrigger);

export const BentoTilt = forwardRef(({ children, className = "", onClick, disableTilt = false }, ref) => {
  const [transformStyle, setTransformStyle] = useState("");
  const itemRef = useRef(null);

  // Use the forwarded ref if available, otherwise use the local ref
  const actualRef = ref || itemRef;

  const handleMouseMove = (event) => {
    if (!actualRef.current || disableTilt) return;

    const { left, top, width, height } =
      actualRef.current.getBoundingClientRect();

    const relativeX = (event.clientX - left) / width;
    const relativeY = (event.clientY - top) / height;

    const tiltX = (relativeY - 0.5) * 5;
    const tiltY = (relativeX - 0.5) * -5;

    const newTransform = `perspective(700px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(.95, .95, .95)`;
    setTransformStyle(newTransform);
  };

  const handleMouseLeave = () => {
    setTransformStyle("");
  };

  return (
    <div
      ref={actualRef}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{ 
        transform: disableTilt ? "" : transformStyle,
        transition: 'transform 0.1s ease-out'
      }}
    >
      {children}
    </div>
  );
});

// Flippable Bento Card component - includes border that flips with it
export const FlippableBentoCard = ({ src, title, description, isComingSoon, crossfadeDuration = 1, expandedContent, className = "" }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [hoverOpacity, setHoverOpacity] = useState(0);
  const [isCardHovered, setIsCardHovered] = useState(false);
  const [cardHoverPosition, setCardHoverPosition] = useState({ x: 0, y: 0 });
  const hoverButtonRef = useRef(null);
  const cardRef = useRef(null);

  const handleCardMouseMove = (event) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setCardHoverPosition({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    });
    setIsCardHovered(true);
  };

  const handleCardMouseLeave = () => {
    setIsCardHovered(false);
  };

  const handleMouseMove = (event) => {
    if (!hoverButtonRef.current) return;
    const rect = hoverButtonRef.current.getBoundingClientRect();

    setCursorPosition({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    });
  };

  const handleMouseEnter = () => setHoverOpacity(1);
  const handleMouseLeave = () => setHoverOpacity(0);

  const handleFlip = (e) => {
    e.stopPropagation();
    setIsFlipped(!isFlipped);
  };

  return (
    <div 
      ref={cardRef}
      className={`relative size-full ${className}`}
      onMouseMove={handleCardMouseMove}
      onMouseEnter={() => setIsCardHovered(true)}
      onMouseLeave={handleCardMouseLeave}
      style={{ perspective: "2000px" }}
    >
      <div
        className="relative size-full transition-transform duration-700 border-hsla rounded-md"
        style={{ 
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
          borderColor: isCardHovered ? "#FF5F05" : undefined,
          boxShadow: isCardHovered ? "0 0 22px rgba(255, 95, 5, 0.38)" : undefined,
        }}
      >
        {/* Hover glint overlays live inside each face to avoid bleed-through */}

        {/* Front of card */}
        <div 
          className="absolute inset-0 size-full rounded-md overflow-hidden"
          style={{ 
            opacity: isFlipped ? 0 : 1,
            pointerEvents: isFlipped ? "none" : "auto",
            transition: "opacity 0.01s linear",
            transitionDelay: isFlipped ? "250ms" : "250ms",
            backfaceVisibility: "hidden",
            transform: "rotateY(0deg)",
          }}
        >
          <div
            className="pointer-events-none absolute inset-0 z-0 rounded-md transition-opacity duration-200"
            style={{
              opacity: isCardHovered && !isFlipped ? 1 : 0,
              background: `radial-gradient(180px circle at ${cardHoverPosition.x}px ${cardHoverPosition.y}px, rgba(19, 41, 75, 0.22), rgba(19, 41, 75, 0))`,
              mixBlendMode: "screen",
            }}
          />
          <CrossfadeVideo
            src={src}
            crossfadeDuration={crossfadeDuration}
            className="absolute left-0 top-0 size-full"
          />
          <div className="relative z-10 flex size-full flex-col justify-between p-5 text-blue-50">
            <div>
              <h1 className="bento-title special-font">{title}</h1>
              {description && (
                <p className="mt-3 max-w-64 text-xs md:text-base">{description}</p>
              )}
            </div>

            {isComingSoon && (
              <div
                ref={hoverButtonRef}
                onMouseMove={handleMouseMove}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={handleFlip}
                className="border-hsla relative flex w-fit cursor-pointer items-center gap-2 overflow-hidden rounded-full bg-[#13294B] px-6 py-2 text-sm font-semibold uppercase text-[#FF5F05]"
              >
                {/* Subtle highlight on hover (behind text) */}
                <div
                  className="pointer-events-none absolute inset-0 opacity-0 transition duration-200"
                  style={{
                    opacity: hoverOpacity * 0.9,
                    background: `radial-gradient(120px circle at ${cursorPosition.x}px ${cursorPosition.y}px, rgba(255,255,255,0.06), rgba(0,0,0,0))`,
                  }}
                />
                <TiLocationArrow className="relative z-20 text-[#FF5F05]" />
                <p className="relative z-20">Learn More</p>
              </div>
            )}
          </div>
        </div>

        {/* Back of card */}
        <div 
          className="absolute inset-0 size-full overflow-auto rounded-md bg-gradient-to-br from-gray-900 to-black"
          style={{ 
            transform: "rotateY(180deg)",
            opacity: isFlipped ? 1 : 0,
            pointerEvents: isFlipped ? "auto" : "none",
            transition: "opacity 0.01s linear",
            transitionDelay: isFlipped ? "250ms" : "250ms",
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <div
            className="pointer-events-none absolute inset-0 z-0 rounded-md transition-opacity duration-200"
            style={{
              opacity: isCardHovered && isFlipped ? 1 : 0,
              background: `radial-gradient(200px circle at ${cardHoverPosition.x}px ${cardHoverPosition.y}px, rgba(19, 41, 75, 0.20), rgba(19, 41, 75, 0))`,
              mixBlendMode: "screen",
            }}
          />
          <div className="relative z-10 flex size-full flex-col p-5 text-blue-50">
            {/* Header with back button */}
            <div className="mb-4 flex items-center justify-between">
              <h2 className="bento-title special-font text-2xl md:text-4xl">{title}</h2>
              <button
                onClick={handleFlip}
                className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs uppercase transition-colors hover:bg-white/20"
              >
                <IoArrowBack />
                <span>Back</span>
              </button>
            </div>
            
            {/* Content */}
            <div className="flex-1 overflow-auto">
              <p className="mb-4 text-sm opacity-70 md:text-base">{description}</p>
              {expandedContent && (
                <div className="space-y-4">
                  {expandedContent}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Keep original BentoCard for non-flippable cards
export const BentoCard = ({ src, title, description, isComingSoon, crossfadeDuration = 1 }) => {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [hoverOpacity, setHoverOpacity] = useState(0);
  const hoverButtonRef = useRef(null);

  const handleMouseMove = (event) => {
    if (!hoverButtonRef.current) return;
    const rect = hoverButtonRef.current.getBoundingClientRect();

    setCursorPosition({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    });
  };

  const handleMouseEnter = () => setHoverOpacity(1);
  const handleMouseLeave = () => setHoverOpacity(0);

  return (
    <div className="relative size-full">
      <CrossfadeVideo
        src={src}
        crossfadeDuration={crossfadeDuration}
        className="absolute left-0 top-0 size-full"
      />
      <div className="relative z-10 flex size-full flex-col justify-between p-5 text-blue-50">
        <div>
          <h1 className="bento-title special-font">{title}</h1>
          {description && (
            <p className="mt-3 max-w-64 text-xs md:text-base">{description}</p>
          )}
        </div>

        {isComingSoon && (
          <div
            ref={hoverButtonRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="border-hsla relative flex w-fit cursor-pointer items-center gap-2 overflow-hidden rounded-full bg-[#13294B] px-6 py-2 text-sm font-semibold uppercase text-[#FF5F05]"
          >
            <div
              className="pointer-events-none absolute inset-0 opacity-0 transition duration-200"
              style={{
                opacity: hoverOpacity * 0.9,
                background: `radial-gradient(120px circle at ${cursorPosition.x}px ${cursorPosition.y}px, rgba(255,255,255,0.06), rgba(0,0,0,0))`,
              }}
            />
            <TiLocationArrow className="relative z-20 text-[#FF5F05]" />
            <p className="relative z-20">coming soon</p>
          </div>
        )}
      </div>
    </div>
  );
};

const Features = () => {
  // Card content data
  const cardData = {
    departments: {
      title: "Our Departments",
      description: "Three specialized teams: VEX U competing at the collegiate level, plus R&D Mechanical and R&D Software working on independent robotics research projects.",
      src: "videos/bet.mp4",
      expandedContent: (
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-lg bg-white/5 p-4">
            <h3 className="mb-2 text-xl font-bold text-[#FF5F05]">VEX U</h3>
            <p className="text-sm opacity-70">Our competitive collegiate team designs and builds robots to compete at regional, state, and world championship events.</p>
          </div>
          <div className="rounded-lg bg-white/5 p-4">
            <h3 className="mb-2 text-xl font-bold text-[#FF5F05]">R&D Mechanical</h3>
            <p className="text-sm opacity-70">Independent research projects focused on prototyping, CAD design, and fabricating innovative mechanisms outside of competition.</p>
          </div>
          <div className="rounded-lg bg-white/5 p-4">
            <h3 className="mb-2 text-xl font-bold text-[#FF5F05]">R&D Software</h3>
            <p className="text-sm opacity-70">Independent research projects developing autonomous systems, computer vision, and control algorithms for robotics innovation.</p>
          </div>
        </div>
      )
    },
    vexu: {
      title: "VEXU",
      description: "Our competitive collegiate VEX U team, designing and building advanced robots for international competition.",
      src: "videos/feature-2.mp4",
      expandedContent: (
        <div className="space-y-4">
          <p className="opacity-70">VEX U is the collegiate division of the VEX Robotics Competition, where university teams design and build robots to compete in annual game challenges.</p>
          <div className="rounded-lg bg-white/5 p-4">
            <h3 className="mb-2 text-lg font-bold text-[#FF5F05]">What We Do</h3>
            <ul className="list-inside list-disc space-y-1 text-sm opacity-70">
              <li>Design and build competition robots within strict constraints</li>
              <li>Compete at regional, state, and world championship events</li>
              <li>Collaborate across mechanical, electrical, and software disciplines</li>
              <li>Document our engineering process for judged awards</li>
            </ul>
          </div>
        </div>
      )
    },
    mechanical: {
      title: "R&D Mechanical",
      description: "Mechanical research and development—prototyping, CAD, and fabrication for next-generation robotics.",
      src: "videos/feature-3.mp4",
      expandedContent: (
        <div className="space-y-4">
          <p className="opacity-70">Our mechanical R&D team pushes the boundaries of robot design through innovative prototyping and advanced manufacturing.</p>
          <div className="rounded-lg bg-white/5 p-4">
            <h3 className="mb-2 text-lg font-bold text-[#FF5F05]">Focus Areas</h3>
            <ul className="list-inside list-disc space-y-1 text-sm opacity-70">
              <li>CAD design using Solidworks and Fusion 360</li>
              <li>3D printing and rapid prototyping</li>
              <li>CNC machining and precision fabrication</li>
              <li>Mechanism optimization and testing</li>
            </ul>
          </div>
        </div>
      )
    },
    software: {
      title: "R&D Software",
      description: "Software research and development—autonomous code, control systems, and AI for robotics innovation.",
      src: "videos/feature-4.mp4",
      expandedContent: (
        <div className="space-y-4">
          <p className="opacity-70">Our software R&D team develops intelligent systems that make our robots smarter and more capable.</p>
          <div className="rounded-lg bg-white/5 p-4">
            <h3 className="mb-2 text-lg font-bold text-[#FF5F05]">Technologies</h3>
            <ul className="list-inside list-disc space-y-1 text-sm opacity-70">
              <li>Autonomous path planning and motion control</li>
              <li>Computer vision and sensor fusion</li>
              <li>PID tuning and control systems</li>
              <li>Data logging and performance analysis</li>
            </ul>
          </div>
        </div>
      )
    }
  };

  // Refs for each card
  const radiantRef = useRef(null);
  const zigmaRef = useRef(null);
  const nexusRef = useRef(null);
  const azulRef = useRef(null);
  const moreComingRef = useRef(null);
  const videoCardRef = useRef(null);
  const featuresSectionRef = useRef(null);
  const { y: scrollY } = useWindowScroll();

  // Scroll animations for all cards
  useGSAP(() => {
    // Create a timeline for staggered animations
    const tl = gsap.timeline();

    // Radiant card animation
    gsap.fromTo(radiantRef.current, 
      { 
        opacity: 0, 
        scale: 0.7,
        y: 80
      },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: radiantRef.current,
          start: "top 90%",
          end: "bottom 40%",
          toggleActions: "play none none reverse"
        }
      }
    );

    // VEXU card animation
    gsap.fromTo(zigmaRef.current,
      {
        opacity: 0,
        scale: 0.7,
        y: 80
      },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: zigmaRef.current,
          start: "top 90%",
          end: "bottom 40%",
          toggleActions: "play none none reverse"
        }
      }
    );

    // R&D Mechanical card animation
    gsap.fromTo(nexusRef.current,
      {
        opacity: 0,
        scale: 0.7,
        y: 80
      },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 1.2,
        ease: "power3.out",
        force3D: true,
        scrollTrigger: {
          trigger: nexusRef.current,
          start: "top 90%",
          end: "bottom 40%",
          toggleActions: "play none none reverse"
        }
      }
    );

    // R&D Software card animation
    gsap.fromTo(azulRef.current,
      {
        opacity: 0,
        scale: 0.7,
        y: 80
      },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 1.2,
        ease: "power3.out",
        force3D: true,
        scrollTrigger: {
          trigger: azulRef.current,
          start: "top 90%",
          end: "bottom 40%",
          toggleActions: "play none none reverse"
        }
      }
    );

    // More coming soon card animation
    gsap.fromTo(moreComingRef.current,
      {
        opacity: 0,
        scale: 0.7,
        y: 80
      },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: moreComingRef.current,
          start: "top 90%",
          end: "bottom 40%",
          toggleActions: "play none none reverse"
        }
      }
    );

    // Video card animation
    gsap.fromTo(videoCardRef.current,
      {
        opacity: 0,
        scale: 0.7,
        y: 80
      },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: videoCardRef.current,
          start: "top 90%",
          end: "bottom 40%",
          toggleActions: "play none none reverse"
        }
      }
    );
  });

  // Scroll-based video pause/resume for Features section
  useEffect(() => {
    if (!featuresSectionRef.current) return;

    const featuresRect = featuresSectionRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const padding = 100; // Extra padding for off-screen detection

    // Check if features section is off-screen with padding
    const isOffScreen = featuresRect.bottom < -padding || featuresRect.top > viewportHeight + padding;

    // Get all video elements in the features section
    const videos = featuresSectionRef.current.querySelectorAll('video');
    
    videos.forEach(video => {
      if (isOffScreen) {
        // Pause video when off-screen
        if (!video.paused) {
          video.pause();
        }
      } else {
        // Resume video when back on-screen
        if (video.paused) {
          video.play();
        }
      }
    });
  }, [scrollY]);

  return (
    <section id="departments" ref={featuresSectionRef} className="bg-black pb-52">
      <div className="container mx-auto px-3 md:px-10">
        <div className="px-5 py-32">
          <p className="font-circular-web text-lg text-blue-50">
            Explore All We Do
          </p>
          <p className="max-w-md font-circular-web text-lg text-blue-50 opacity-50">
            From competitive VEX U robotics to independent R&D projects in mechanical and software engineering—discover how we push the boundaries of innovation.
          </p>
        </div>

        <BentoTilt ref={radiantRef} className="relative mb-7 h-96 w-full md:h-[65vh]">
          <FlippableBentoCard
            src={cardData.departments.src}
            title={cardData.departments.title}
            description={cardData.departments.description}
            isComingSoon
            expandedContent={cardData.departments.expandedContent}
          />
        </BentoTilt>

        <div className="grid h-[135vh] w-full grid-cols-2 grid-rows-3 gap-7">
          <BentoTilt ref={zigmaRef} className="relative col-span-2 row-span-1 md:col-span-1 md:row-span-2">
            <FlippableBentoCard
              src={cardData.vexu.src}
              title={cardData.vexu.title}
              description={cardData.vexu.description}
              isComingSoon
              expandedContent={cardData.vexu.expandedContent}
            />
          </BentoTilt>

          <BentoTilt ref={nexusRef} className="relative col-span-1 row-span-1 ms-32 md:ms-0">
            <FlippableBentoCard
              src={cardData.mechanical.src}
              title={cardData.mechanical.title}
              description={cardData.mechanical.description}
              isComingSoon
              expandedContent={cardData.mechanical.expandedContent}
            />
          </BentoTilt>

          <BentoTilt ref={azulRef} className="relative col-span-1 me-14 md:me-0">
            <FlippableBentoCard
              src={cardData.software.src}
              title={cardData.software.title}
              description={cardData.software.description}
              isComingSoon
              expandedContent={cardData.software.expandedContent}
            />
          </BentoTilt>

          <BentoTilt ref={moreComingRef} className="bento-tilt_2">
            <div className="flex size-full flex-col justify-between !bg-[#FF5F05] p-5">
              <h1 className="bento-title special-font max-w-64 text-black">
                More coming soon.
              </h1>

              <TiLocationArrow className="m-5 scale-[5] self-end" />
            </div>
          </BentoTilt>

          <BentoTilt ref={videoCardRef} className="bento-tilt_2">
            <CrossfadeVideo
              src="videos/feature-5.mp4"
              crossfadeDuration={1}
              className="size-full"
            />
          </BentoTilt>
        </div>
      </div>
    </section>
  );
};

export default Features;
