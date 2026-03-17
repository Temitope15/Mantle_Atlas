/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./services/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mantle: {
          50: "#f4f7ff",
          100: "#e8efff",
          200: "#cddcff",
          300: "#a8c0ff",
          400: "#7d99ff",
          500: "#5b72ff",
          600: "#4654f5",
          700: "#3a43db",
          800: "#3238b1",
          900: "#2d338b",
        },
        atlas: {
          bg: "#0b1020",
          panel: "#121a2f",
          border: "#24304d",
          text: "#e6edf7",
          muted: "#94a3b8",
          accent: "#22c55e",
          warning: "#f59e0b",
        },
      },
      boxShadow: {
        panel: "0 10px 30px rgba(0, 0, 0, 0.25)",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
      },
    },
  },
  plugins: [],
};
