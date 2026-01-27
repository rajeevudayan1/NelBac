/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        'heading': ['Space Grotesk', 'sans-serif'],
        'body': ['Plus Jakarta Sans', 'sans-serif'],
      },
      colors: {
        'nelbac': {
          accent: '#00f3ff',
        }
      }
    },
  },
  plugins: [],
}
