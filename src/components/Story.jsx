import gsap from "gsap";
import { useRef, useState, useEffect } from "react";

import Button from "./Button";
import AnimatedTitle from "./AnimatedTitle";
import { BentoTilt } from "./Features";

// ==========================================
// EVENT CONFIGURATION - Edit dates here
// ==========================================
const EVENTS = [
  {
    level: "VEXU", // Competition level
    name: "Cornfield Clash",
    date: "2026-01-31T08:30:00-06:00", // 31-Jan-2026 8:30 AM CST
    robotEventsUrl: "https://www.robotevents.com/robot-competitions/college-competition/RE-VURC-25-3654.html#general-info",
  },
  {
    level: "V5RC",
    name: "Cornfield Clash Jr",
    date: "2026-02-07T08:30:00-06:00", // 7-Feb-2026 8:30 AM CST
    robotEventsUrl: "https://www.robotevents.com/robot-competitions/vex-robotics-competition/RE-V5RC-25-3653.html",
  },
];
// ==========================================

const useCountdown = (targetDate) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(targetDate) - new Date();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return timeLeft;
};

const CountdownTimer = ({ event }) => {
  const timeLeft = useCountdown(event.date);
  const eventDate = new Date(event.date);
  const isPast = new Date() > eventDate;

  return (
    <div className="flex flex-col items-center rounded-lg bg-[#13294B] p-4">
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[#FF5F05]">{event.level}</p>
      <h3 className="mb-3 text-lg font-bold text-[#FF5F05]">{event.name}</h3>
      <p className="mb-2 text-sm text-gray-300">
        {eventDate.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>
      {isPast ? (
        <p className="text-sm text-green-400">Event Completed!</p>
      ) : (
        <div className="flex gap-1">
          <TimeUnit value={timeLeft.days} label="Days" />
          <TimeUnit value={timeLeft.hours} label="Hrs" />
          <TimeUnit value={timeLeft.minutes} label="Min" />
          <TimeUnit value={timeLeft.seconds} label="Sec" />
        </div>
      )}
      <a
        href={event.robotEventsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 rounded bg-[#FF5F05] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#e5540a]"
      >
        View on Robot Events
      </a>
    </div>
  );
};

const TimeUnit = ({ value, label }) => (
  <div className="flex flex-col items-center">
    <span
      className="text-2xl font-bold text-white font-mono tabular-nums leading-none text-center"
      style={{ minWidth: "3ch" }}
    >
      {String(value).padStart(2, "0")}
    </span>
    <span className="text-xs text-gray-400">{label}</span>
  </div>
);

const FloatingImage = () => {
  const frameRef = useRef(null);
  const baseRotateX = 8; // slight tilt inward by default
  const baseRotateY = 0;
  const [open, setOpen] = useState(false);

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const element = frameRef.current;

    if (!element) return;

    const rect = element.getBoundingClientRect();
    const xPos = clientX - rect.left;
    const yPos = clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = baseRotateX + ((yPos - centerY) / centerY) * -10;
    const rotateY = baseRotateY + ((xPos - centerX) / centerX) * 10;

    gsap.to(element, {
      duration: 0.3,
      rotateX,
      rotateY,
      transformPerspective: 500,
      ease: "power1.inOut",
    });
  };

  const handleMouseLeave = () => {
    const element = frameRef.current;

    if (element) {
      gsap.to(element, {
        duration: 0.3,
        rotateX: baseRotateX,
        rotateY: baseRotateY,
        ease: "power1.inOut",
      });
    }
  };

  // Ensure the image starts at the base rotation on mount
  useEffect(() => {
    if (frameRef.current) {
      gsap.set(frameRef.current, {
        rotateX: baseRotateX,
        rotateY: baseRotateY,
        transformPerspective: 500,
      });
    }
  }, [baseRotateX, baseRotateY]);

  return (
    <div id="story" className="min-h-dvh w-screen bg-black text-blue-50">
      <div className="flex size-full flex-col items-center py-10 pb-24">
        <p className="font-general text-sm uppercase md:text-[10px]">
          Illinois&#39; Premier VEX Competition
        </p>

        <div className="relative size-full">
          <AnimatedTitle
            title="For young <br /> engineers"
            containerClass="mt-5 pointer-events-none mix-blend-difference relative z-10"
          />

          <div className="story-img-container">
            <div className="story-img-mask">
              <div className="story-img-content">
                <img
                  ref={frameRef}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                  onMouseUp={handleMouseLeave}
                  onMouseEnter={handleMouseLeave}
                  src="/img/Vex_CC_Jr.png"
                  alt="Vex_CC_Jr.png"
                  className="object-contain"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>

            {/* for the rounded corner */}
            <svg
              className="invisible absolute size-0"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <filter id="flt_tag">
                  <feGaussianBlur
                    in="SourceGraphic"
                    stdDeviation="8"
                    result="blur"
                  />
                  <feColorMatrix
                    in="blur"
                    mode="matrix"
                    values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
                    result="flt_tag"
                  />
                  <feComposite
                    in="SourceGraphic"
                    in2="flt_tag"
                    operator="atop"
                  />
                </filter>
              </defs>
            </svg>
          </div>
        </div>

        <div className="-mt-96 flex w-full justify-center md:-mt-96">
          <div className="flex h-full w-fit flex-col items-center">
            <p className="mt-3 max-w-3xl text-center font-circular-web text-violet-50">
              Cornfield Clash is Illini VEX Robotics' premier competition,
              welcoming middle school, high school, and university teams
              (CC &amp; CC Jr).
              We provide a hands-on platform to learn,
              design, and compete, helping students grow their skills and
              advance to international-level events while strengthening the
              Illinois VEX community.
            </p>

            <Button
              id="realm-btn"
              title="discover events"
              containerClass="mt-5 cursor-pointer"
              onClick={() => setOpen((s) => !s)}
            />

            <div
              className={`mt-6 w-full overflow-hidden transition-all duration-700 ease-in-out ${
                open
                  ? "max-h-[600px] opacity-100 translate-y-0 scale-100"
                  : "max-h-0 opacity-0 -translate-y-2 scale-[0.99]"
              }`}
            >
              <div className="rounded-lg bg-black/80 p-6 backdrop-blur-sm">
                <h2 className="mb-4 text-center text-xl font-bold text-[#FF5F05]">
                  Upcoming Events
                </h2>
                <div className="flex flex-col items-center gap-4 md:flex-row md:justify-center">
                  {EVENTS.map((event, index) => (
                    <BentoTilt key={index} className="m-2 w-64">
                      <CountdownTimer event={event} />
                    </BentoTilt>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FloatingImage;
