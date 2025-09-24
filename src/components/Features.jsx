import { useState, useRef, forwardRef, useEffect } from "react";
import { TiLocationArrow } from "react-icons/ti";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
import { useWindowScroll } from "react-use";

gsap.registerPlugin(ScrollTrigger);

export const BentoTilt = forwardRef(({ children, className = "" }, ref) => {
  const [transformStyle, setTransformStyle] = useState("");
  const itemRef = useRef(null);

  // Use the forwarded ref if available, otherwise use the local ref
  const actualRef = ref || itemRef;

  const handleMouseMove = (event) => {
    if (!actualRef.current) return;

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
      style={{ 
        transform: transformStyle,
        transition: 'transform 0.1s ease-out'
      }}
    >
      {children}
    </div>
  );
});

export const BentoCard = ({ src, title, description, isComingSoon }) => {
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
      <video
        src={src}
        loop
        muted
        autoPlay
        className="absolute left-0 top-0 size-full object-cover object-center"
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
            className="border-hsla relative flex w-fit cursor-pointer items-center gap-1 overflow-hidden rounded-full bg-black px-5 py-2 text-xs uppercase text-white/20"
          >
            {/* Radial gradient hover effect */}
            <div
              className="pointer-events-none absolute -inset-px opacity-0 transition duration-300"
              style={{
                opacity: hoverOpacity,
                background: `radial-gradient(100px circle at ${cursorPosition.x}px ${cursorPosition.y}px, #656fe288, #00000026)`,
              }}
            />
            <TiLocationArrow className="relative z-20" />
            <p className="relative z-20">coming soon</p>
          </div>
        )}
      </div>
    </div>
  );
};

const Features = () => {
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

    // Zigma card animation
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

    // Nexus card animation
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
        scrollTrigger: {
          trigger: nexusRef.current,
          start: "top 90%",
          end: "bottom 40%",
          toggleActions: "play none none reverse"
        }
      }
    );

    // Azul card animation
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
    <section ref={featuresSectionRef} className="bg-black pb-52">
      <div className="container mx-auto px-3 md:px-10">
        <div className="px-5 py-32">
          <p className="font-circular-web text-lg text-blue-50">
            Into the Metagame Layer
          </p>
          <p className="max-w-md font-circular-web text-lg text-blue-50 opacity-50">
            Immerse yourself in a rich and ever-expanding universe where a vibrant
            array of products converge into an interconnected overlay experience
            on your world.
          </p>
        </div>

        <BentoTilt ref={radiantRef} className="border-hsla relative mb-7 h-96 w-full overflow-hidden rounded-md md:h-[65vh]">
          <BentoCard
            src="videos/feature-1.mp4"
            title={
              <>
                radia<b>n</b>t
              </>
            }
            description="A cross-platform metagame app, turning your activities across Web2 and Web3 games into a rewarding adventure."
            isComingSoon
          />
        </BentoTilt>

        <div className="grid h-[135vh] w-full grid-cols-2 grid-rows-3 gap-7">
          <BentoTilt ref={zigmaRef} className="bento-tilt_1 row-span-1 md:col-span-1 md:row-span-2">
            <BentoCard
              src="videos/feature-2.mp4"
              title={
                <>
                  zig<b>m</b>a
                </>
              }
              description="An anime and gaming-inspired NFT collection - the IP primed for expansion."
              isComingSoon
            />
          </BentoTilt>

          <BentoTilt ref={nexusRef} className="bento-tilt_1 row-span-1 ms-32 md:col-span-1 md:ms-0">
            <BentoCard
              src="videos/feature-3.mp4"
              title={
                <>
                  n<b>e</b>xus
                </>
              }
              description="A gamified social hub, adding a new dimension of play to social interaction for Web3 communities."
              isComingSoon
            />
          </BentoTilt>

          <BentoTilt ref={azulRef} className="bento-tilt_1 me-14 md:col-span-1 md:me-0">
            <BentoCard
              src="videos/feature-4.mp4"
              title={
                <>
                  az<b>u</b>l
                </>
              }
              description="A cross-world AI Agent - elevating your gameplay to be more fun and productive."
              isComingSoon
            />
          </BentoTilt>

          <BentoTilt ref={moreComingRef} className="bento-tilt_2">
            <div className="flex size-full flex-col justify-between bg-violet-300 p-5">
              <h1 className="bento-title special-font max-w-64 text-black">
                M<b>o</b>re co<b>m</b>ing s<b>o</b>on.
              </h1>

              <TiLocationArrow className="m-5 scale-[5] self-end" />
            </div>
          </BentoTilt>

          <BentoTilt ref={videoCardRef} className="bento-tilt_2">
            <video
              src="videos/feature-5.mp4"
              loop
              muted
              autoPlay
              className="size-full object-cover object-center"
            />
          </BentoTilt>
        </div>
      </div>
    </section>
  );
};

export default Features;
