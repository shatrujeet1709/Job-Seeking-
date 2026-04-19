/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary:   { DEFAULT: '#6366F1', dark: '#4F46E5' },   // Indigo
        secondary: { DEFAULT: '#0EA5E9' },                     // Sky blue
        accent:    { DEFAULT: '#F59E0B' },                     // Amber (freelance)
        success:   { DEFAULT: '#10B981' },
        danger:    { DEFAULT: '#EF4444' },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
      }
    }
  },
  plugins: [],
}
