/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.html',
    './src/partials/**/*.html',
    './js/app.js',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};
