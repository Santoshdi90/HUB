/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#2D6A4F', // Emerald Green
          900: '#1B4332', // Forest Green
          950: '#081c15',
        },
        sage: {
          50: '#f6faf7',
          100: '#eaf4ed',
          200: '#D8F3DC', // Sage Green
          300: '#b8e6be',
          400: '#94d49d',
        },
        warm: {
          50: '#FAFAF9', // Warm Off-White
          100: '#f5f5f4',
          200: '#e7e5e4',
          300: '#d6d3d1',
          800: '#292524',
          900: '#1c1917',
        }
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
      },
      boxShadow: {
        'soft': '0 10px 30px -10px rgba(27, 67, 50, 0.08)',
        'glow': '0 0 25px rgba(45, 106, 79, 0.25)',
      }
    },
  },
  plugins: [],
}
