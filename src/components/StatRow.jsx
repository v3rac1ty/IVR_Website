import { useEffect, useRef, useState } from "react";

import { prefersReducedMotion } from "../lib/motion";

// Big keynote-style figures that count up once when they scroll into view.
// Each stat: { value, label, suffix? } - suffix renders smaller, e.g. "×" or "rd".
const CountUp = ({ value, duration = 1600 }) => {
  const ref = useRef(null);
  const [shown, setShown] = useState(() => (prefersReducedMotion() ? value : 0));

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    let frame;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      const start = performance.now();
      const tick = (now) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(2, -10 * t); // ease-out expo
        setShown(Math.round(value * (t === 1 ? 1 : eased)));
        if (t < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    }, { threshold: 0.6 });
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value, duration]);

  return (
    <span ref={ref} className="tabular-nums" aria-label={String(value)}>
      {shown}
    </span>
  );
};

const StatRow = ({ stats }) => (
  <dl className="grid gap-10 sm:grid-cols-3 sm:gap-6">
    {stats.map((stat, i) => (
      <div
        key={stat.label}
        className="reveal text-center"
        style={{ "--reveal-delay": `${i * 120}ms` }}
      >
        <dt className="sr-only">{stat.label}</dt>
        <dd className="text-keynote font-display text-7xl font-extrabold leading-none -tracking-wider md:text-8xl lg:text-9xl">
          <CountUp value={stat.value} />
          {stat.suffix && <span className="ml-1 align-top text-[0.45em] tracking-normal">{stat.suffix}</span>}
        </dd>
        <dd aria-hidden="true" className="mt-3 text-base font-semibold text-paper-muted md:text-lg">
          {stat.label}
        </dd>
      </div>
    ))}
  </dl>
);

export default StatRow;
