const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
    colors: {
      transparent: 'transparent',
      current: '#951B81',
      'eds': '#951B81',
    },
  },
  plugins: [],
});
