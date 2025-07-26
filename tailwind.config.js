/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // Enable dark mode with class strategy
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3b82f6',
          hover: '#2563eb',
        },
        dark: {
          bg: '#111827',
          surface: '#1f2937',
          text: '#f3f4f6',
          'text-secondary': '#d1d5db',
          border: '#374151',
        },
      },
    },
  },
  plugins: [],
}
