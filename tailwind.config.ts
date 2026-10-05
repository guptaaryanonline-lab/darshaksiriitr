import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  // Stops hover styles from "sticking" after a tap on touch screens
  // (e.g. a menu item staying grey after tapping it on a phone).
  future: { hoverOnlyWhenSupported: true },
  theme: {
    extend: {
      colors: {
        ink: "#172033",
        navy: "#1f3a5f",
        teal: "#116466",
        gold: "#b7791f"
      },
      boxShadow: {
        soft: "0 14px 40px rgba(23, 32, 51, 0.08)"
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" }
        },
        "slide-in": {
          from: { transform: "translateX(100%)" },
          to: { transform: "translateX(0)" }
        },
        "hero-progress": {
          from: { transform: "scaleX(0)" },
          to: { transform: "scaleX(1)" }
        }
      }
    }
  },
  plugins: []
};

export default config;
