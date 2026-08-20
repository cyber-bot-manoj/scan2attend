/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#FAF8F5',
        'text-primary': '#212121',
        'text-secondary': '#757575',
        'accent-green': '#00C853',
        'accent-orange': '#FF9100',
        'accent-red': '#DD2C00',
        'accent-blue': '#2979FF',
        'border-color': '#E0E0E0',
      }
    },
  },
  plugins: [],
}
