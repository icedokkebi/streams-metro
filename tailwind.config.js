/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        metro: {
          red: '#E60012',
          blue: '#0052A5',
          green: '#009B3A',
          orange: '#F39800',
          purple: '#9B26B6',
          brown: '#96514D',
          pink: '#E85298',
          yellow: '#FCE300',
        }
      }
    },
  },
  plugins: [],
}
