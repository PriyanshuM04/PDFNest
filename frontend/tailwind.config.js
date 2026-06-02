/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        ink: "#17212b",
        paper: "#f8fafc",
        nest: "#2563eb",
        coral: "#f97316",
      },
    },
  },
  plugins: [],
};
