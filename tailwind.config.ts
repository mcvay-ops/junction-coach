import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          50: "#f7f7f8",
          100: "#eeeef1",
          200: "#d9dae0",
          300: "#b8b9c5",
          400: "#8e90a1",
          500: "#6c6f83",
          600: "#54576a",
          700: "#3f4254",
          800: "#272a3a",
          900: "#16182a",
          950: "#0b0c17",
        },
        accent: {
          DEFAULT: "#5b8def",
          muted: "#dde7fb",
        },
      },
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Inter", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Consolas", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
