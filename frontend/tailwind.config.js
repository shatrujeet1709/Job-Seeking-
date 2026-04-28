/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary:   { DEFAULT: '#6366F1', dark: '#4F46E5', light: '#EEF2FF' },
        secondary: { DEFAULT: '#0EA5E9', dark: '#0284C7', light: '#F0F9FF' },
        accent:    { DEFAULT: '#F59E0B', dark: '#D97706', light: '#FFFBEB' },
        success:   { DEFAULT: '#10B981' },
        danger:    { DEFAULT: '#EF4444' },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
    }
  },
  plugins: [],
}
