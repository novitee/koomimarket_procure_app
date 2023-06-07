/** @type {import('tailwindcss').Config} */

const colors = require('./src/configs/colors');

const scaledFontSizes = [10, 12, 16, 18, 20, 24, 32, 48].reduce((prev, s) => {
  return {
    ...prev,
    [s]: `${s}px`,
  };
}, {});

module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter'],
      },
      colors: colors,
      fontSize: scaledFontSizes,
    },
  },
  plugins: [],
};
