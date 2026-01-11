\# Illini VEX Robotics @ UIUC — Website

Marketing + recruitment website for **Illini VEX Robotics (IVR)** at the University of Illinois Urbana-Champaign.

This repo contains the front-end for our club site (hero videos, team overview, feature highlights, and a contact form).

## What is Illini VEX Robotics?

Illini VEX Robotics is a student organization at UIUC focused on building competitive VEX robots and growing the Illinois VEX community through engineering, outreach, and events.

## Tech stack

- React + Vite
- Tailwind CSS
- GSAP (scroll + transition animations)

## Running locally

Prereqs: Node.js + npm

```bash
npm install
npm run dev
```

Then open http://localhost:5173

Build + preview:

```bash
npm run build
npm run preview
```

Lint:

```bash
npm run lint
```

## Content you’ll likely edit

- Hero videos live in `public/videos/hero-*.mp4`
- Hero thumbnails live in `public/img/hero-*.png`
  - Hero 2 and 4 use custom thumbnails (`/img/hero-2.png`, `/img/hero-4.png`)
  - Hero 3 auto-generates a mid-video thumbnail because the first frame is black
- Images live in `public/img/`
- Fonts live in `public/fonts/`

### Quick data edits (content without touching layout)

- **Events (Upcoming Events accordion)**: edit the `EVENTS` array in `src/components/Story.jsx` (name, date, location, robotEventsUrl). Adding/removing items automatically updates the countdown list.
- **Sponsors (Orange & Blue / Platinum / Bronze)**: edit `SPONSOR_TIERS` in `src/components/Sponsors.jsx`.
  - To use a logo: set `logo: "/img/sponsors/your-logo.png"`.
  - To force text-only: set `textOnly: true` or leave `logo` empty.
  - Add/remove sponsors by editing the array items; layout centers automatically.
- **Feature cards (Departments / VEX U / R&D)**: update `cardData` in `src/components/Features.jsx` (titles, descriptions, expandedContent, video srcs).
- **Hero external video links**: update `HERO_VIDEO_LINKS` in `src/components/Hero.jsx` for the “Watch Video” button.
- **Contact form endpoint**: update the FormSubmit endpoint in `src/components/Contact.jsx` if the destination email changes.

## Contact form

The site contact form sends submissions to `vexuiuc@gmail.com` via FormSubmit.

If you need to change the destination email or add extra fields, update the FormSubmit endpoint usage in `src/components/Contact.jsx`.

## Notes on video/audio autoplay

Modern browsers commonly block autoplay **with sound** until a user interacts with the page. The site attempts to enable audio on load, but still relies on a user gesture fallback for reliability.

## Acknowledgements

The UI/animation structure started from an Awwwards-style template inspired by Zentry and tutorial content from JavaScript Mastery. The current content, branding, and assets are customized for Illini VEX Robotics.
    @apply relative md:h-dvh h-[90vh] w-full;
    filter: url("#flt_tag");
  }

  .story-img-mask {
    @apply absolute left-0 top-0 size-full overflow-hidden md:left-[20%] md:top-[-10%] md:size-4/5;
    clip-path: polygon(4% 0, 83% 21%, 100% 73%, 0% 100%);
  }

  .story-img-content {
    @apply absolute w-full md:h-dvh h-[50dvh] opacity-100 left-10 top-16 md:left-0 md:top-10 lg:left-[-300px] lg:top-[-100px];
    transform: translate3d(0, 0, 0) rotateX(0) rotateY(0) rotateZ(0) scale(1);
  }

  .gallery-img-container {
    @apply size-64 overflow-hidden bg-violet-300;
  }

  .gallery-img {
    @apply size-full bg-cover;
  }

  .gallery-img-4 {
    @apply sm:size-80 md:h-96 md:w-[25rem] rounded-lg;
  }

  .sword-man-clip-path {
    clip-path: polygon(16% 0, 89% 15%, 75% 100%, 0 97%);
  }

  .contact-clip-path-1 {
    clip-path: polygon(25% 0%, 74% 0, 69% 64%, 34% 73%);
  }

  .contact-clip-path-2 {
    clip-path: polygon(29% 15%, 85% 30%, 50% 100%, 10% 64%);
  }
}

.indicator-line {
  @apply h-1 w-px rounded-full bg-white transition-all duration-200 ease-in-out;
}

.indicator-line.active {
  animation: indicator-line 0.5s ease infinite;
  animation-delay: calc(var(--animation-order) * 0.1s);
}

@keyframes indicator-line {
  0% {
    height: 4px;
    transform: translateY(-0px);
  }
  50% {
    height: 16px;
    transform: translateY(-4px);
  }
  100% {
    height: 4px;
    transform: translateY(-0px);
  }
}

/* From Uiverse.io by G4b413l */
/* https://uiverse.io/G4b413l/tidy-walrus-92 */
.three-body {
  --uib-size: 35px;
  --uib-speed: 0.8s;
  --uib-color: #5d3fd3;
  position: relative;
  display: inline-block;
  height: var(--uib-size);
  width: var(--uib-size);
  animation: spin78236 calc(var(--uib-speed) * 2.5) infinite linear;
}

.three-body__dot {
  position: absolute;
  height: 100%;
  width: 30%;
}

.three-body__dot:after {
  content: "";
  position: absolute;
  height: 0%;
  width: 100%;
  padding-bottom: 100%;
  background-color: var(--uib-color);
  border-radius: 50%;
}

.three-body__dot:nth-child(1) {
  bottom: 5%;
  left: 0;
  transform: rotate(60deg);
  transform-origin: 50% 85%;
}

.three-body__dot:nth-child(1)::after {
  bottom: 0;
  left: 0;
  animation: wobble1 var(--uib-speed) infinite ease-in-out;
  animation-delay: calc(var(--uib-speed) * -0.3);
}

.three-body__dot:nth-child(2) {
  bottom: 5%;
  right: 0;
  transform: rotate(-60deg);
  transform-origin: 50% 85%;
}

.three-body__dot:nth-child(2)::after {
  bottom: 0;
  left: 0;
  animation: wobble1 var(--uib-speed) infinite calc(var(--uib-speed) * -0.15)
    ease-in-out;
}

.three-body__dot:nth-child(3) {
  bottom: -5%;
  left: 0;
  transform: translateX(116.666%);
}

.three-body__dot:nth-child(3)::after {
  top: 0;
  left: 0;
  animation: wobble2 var(--uib-speed) infinite ease-in-out;
}

@keyframes spin78236 {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

@keyframes wobble1 {
  0%,
  100% {
    transform: translateY(0%) scale(1);
    opacity: 1;
  }

  50% {
    transform: translateY(-66%) scale(0.65);
    opacity: 0.8;
  }
}

@keyframes wobble2 {
  0%,
  100% {
    transform: translateY(0%) scale(1);
    opacity: 1;
  }

  50% {
    transform: translateY(66%) scale(0.65);
    opacity: 0.8;
  }
}
```

</details>

<details>
  <summary><code>components/RoundedCorners.jsx</code></summary>

```js
import React from 'react'

const RoundedCorners = () => {
  return (
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
  )
}
export default RoundedCorners
```

</details>

## <a name="links">🔗 Assets</a>

Assets used in the project can be found [here](https://drive.google.com/file/d/12hCVnanOAUmM1vzz2dTWZ_uEFGG8xDcT/view?usp=sharing)

> This project uses some assets and fonts from **[Zentry](https://zentry.com/)** purely for educational and demonstration purposes. All rights to these assets and fonts belong to their respective owners. If you plan to use this project commercially or publicly, please replace these assets and fonts with ones you own or have permission to use. This project is not affiliated with or endorsed by **[Zentry](https://zentry.com/)**.

## <a name="more">🚀 More</a>

**Advance your skills with Next.js Pro Course**

Enjoyed creating this project? Dive deeper into our PRO courses for a richer learning adventure. They're packed with
detailed explanations, cool features, and exercises to boost your skills. Give it a go!

<a href="https://jsmastery.pro/next15" target="_blank">
   <img src="https://github.com/user-attachments/assets/b8760e69-1f81-4a71-9108-ceeb1de36741" alt="Project Banner">
</a>
