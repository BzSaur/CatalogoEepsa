/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        teal: {
          50: '#EEF7F6',
          100: '#DCEFEC',
          500: '#38958D',
          600: '#2F7F78',
          700: '#256560',
        },
        brand: {
          gray: '#8A8C8B',
          ink: '#0F172A',
        }
      },
      fontFamily: {
        sans: ['"DM Sans"', 'sans-serif'],
        heading: ['"Space Grotesk"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
