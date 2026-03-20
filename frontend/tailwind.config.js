/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./services/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-outfit)', 'sans-serif'],
      },
      colors: {
        mantle: {
          50: '#f4fbf9',
          100: '#d7f4ea',
          200: '#aee7d4',
          300: '#7bd3b8',
          400: '#4fb89a',
          500: '#2e9d7f',
          600: '#1f7d66',
          700: '#1a6453',
          800: '#175043',
          900: '#144238',
          950: '#0b2621',
        },
        dark: {
          900: '#070A0F',
          800: '#0B111A',
          700: '#111827',
          600: '#1F2937',
        },
        glass: {
          DEFAULT: 'rgba(17, 24, 39, 0.45)',
          strong: 'rgba(17, 24, 39, 0.85)',
          border: 'rgba(255, 255, 255, 0.08)',
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-glass': 'linear-gradient(145deg, rgba(31,41,55,0.4) 0%, rgba(17,24,39,0.8) 100%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'slide-up': 'slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          'from': { boxShadow: '0 0 10px -5px rgba(46, 157, 127, 0.5)' },
          'to': { boxShadow: '0 0 20px 5px rgba(46, 157, 127, 0.4)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
};
