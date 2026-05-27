/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#f5f5f5',
          secondary: '#ebebeb',
          hover: '#e2e2e2',
          active: '#d8d8d8',
        },
        text: {
          primary: '#1c1c1e',
          secondary: '#6e6e73',
          muted: '#aeaeb2',
        },
        accent: '#007aff',
        border: '#d1d1d6',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"SF Pro Text"', '"Segoe UI"', 'sans-serif'],
        serif: ['Georgia', '"Times New Roman"', 'serif'],
      },
    },
  },
  plugins: [],
}

