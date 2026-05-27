/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        tsv: {
          blue:  '#003d7a',
          light: '#0060c0',
          gold:  '#f0b400',
        }
      }
    }
  },
  plugins: []
}
