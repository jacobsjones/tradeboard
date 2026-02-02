/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        sidebar: {
          DEFAULT: '#1e1e2e',
          dark: '#16161e',
        },
        kanban: {
          bg: '#f8fafc',
          dark: '#0f0f1a',
          column: '#f1f5f9',
          'column-dark': '#1a1a2e',
        }
      }
    },
  },
  plugins: [],
}
