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
          primary: '#ffffff',
          secondary: '#f5f5f5',
          hover: '#ebebeb',
          active: '#e2e2e2',
        },
        text: {
          primary: '#1a1a1a',
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

