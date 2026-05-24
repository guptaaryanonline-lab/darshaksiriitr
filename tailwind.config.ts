import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
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
      }
    }
  },
  plugins: []
};

export default config;
