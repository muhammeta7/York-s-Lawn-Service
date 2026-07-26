import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        green: {
          950: "#0b1f12",
        },
        brand: {
          50: "#f0faf1",
          100: "#dcf3df",
          200: "#b9e6c1",
          300: "#8ad198",
          400: "#57b56b",
          500: "#339949",
          600: "#237a38",
          700: "#1e612f",
          800: "#1c4e29",
          900: "#194123",
          950: "#0a2412",
        },
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
        display: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
      },
      letterSpacing: {
        tightish: "-0.015em",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(10, 36, 18, 0.04), 0 8px 24px rgba(10, 36, 18, 0.08)",
      },
    },
  },
  plugins: [],
};
export default config;
