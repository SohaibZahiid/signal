/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        primary: "#202c33",
        secondary: "#111b21",
        tertiary: "#005c4b",
        input: "#2a3942",
      },
    },
  },
  plugins: [],
};
