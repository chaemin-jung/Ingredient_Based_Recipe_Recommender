import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#172033",
        sand: "#f8f1e7",
        spice: "#c85c38",
        herb: "#2f7d4e",
        sun: "#f0b85a",
      },
      boxShadow: {
        soft: "0 18px 60px rgba(23, 32, 51, 0.12)",
      },
      backgroundImage: {
        hero: "radial-gradient(circle at top left, rgba(240, 184, 90, 0.45), transparent 30%), radial-gradient(circle at bottom right, rgba(47, 125, 78, 0.28), transparent 25%), linear-gradient(135deg, #fff9f0 0%, #f6ede2 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
