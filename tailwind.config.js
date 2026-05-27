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
          primary:  'var(--bg-primary)',
          secondary: 'var(--bg-secondary)',
          sidebar:  'var(--bg-sidebar)',
          hover:    'var(--bg-hover)',
          active:   'var(--bg-active)',
        },
        text: {
          primary:   'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          muted:     'var(--text-muted)',
        },
        accent: '#007aff',
        border: 'var(--border)',
      },
      fontFamily: {
        sans:  ['-apple-system', 'BlinkMacSystemFont', '"SF Pro Text"', '"Segoe UI"', 'sans-serif'],
        serif: ['Georgia', '"Times New Roman"', 'serif'],
      },
    },
  },
  plugins: [],
}
