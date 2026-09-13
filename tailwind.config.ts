import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "media",
  theme: {
    extend: {
      colors: {
        earth: {
          50: "#faf8f5",
          100: "#f0ebe0",
          200: "#e0d5c0",
          300: "#c4a882",
          400: "#a0926b",
          500: "#8b7355",
          600: "#6d5a42",
          700: "#564635",
          800: "#3d3228",
          900: "#2a221b",
          950: "#1a1510",
        },
        primary: {
          50: "#f0fdf0",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#2d6a4f",
          600: "#1b5e3b",
          700: "#14532d",
          800: "#0f3d21",
          900: "#0a2e18",
          950: "#051a0e",
        },
        navy: {
          DEFAULT: "#0a1628",
          light: "#132240",
        },
        gold: {
          DEFAULT: "#c9a227",
          glow: "#e6c44a",
        },
        cream: {
          DEFAULT: "#faf7f2",
          dark: "#f0ebe0",
        },
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        sans:  ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        "4xl": "2rem",
      },
      boxShadow: {
        "soft": "0 2px 15px -3px rgba(0,0,0,.07), 0 10px 20px -2px rgba(0,0,0,.04)",
        "glow": "0 0 40px rgba(201,162,39,.15)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "1" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out forwards",
        "pulse-soft": "pulse-soft 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
