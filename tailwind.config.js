/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        title: ["Russo One", "system-ui", "sans-serif"],
        general: ["Manrope Variable", "system-ui", "sans-serif"],
      },
      colors: {
        // Illinois brand palette. One accent (orange) across the whole page.
        ink: {
          DEFAULT: "#0A101C", // page background
          800: "#0E1828", // raised surface
          700: "#13294B", // Illinois navy
        },
        paper: {
          DEFAULT: "#EEF1F7", // primary text
          muted: "#A3ADC2", // secondary text
        },
        accent: {
          DEFAULT: "#FF5F05", // Illinois orange
          hover: "#FF7A2E",
        },
      },
      borderRadius: {
        card: "1rem",
      },
    },
  },
  plugins: [],
};
