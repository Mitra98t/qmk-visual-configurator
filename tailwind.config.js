/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui"), require("tailwind-scrollbar")({ nocompatible: true })],
  daisyui: {
    themes: [
      "coffee",
      "dim",
      "sunset",
      "valentine",
      "bumblebee",
      "dracula",
      "night",
    ],
  },
};
