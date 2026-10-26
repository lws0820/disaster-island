/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        civil: {
          DEFAULT: '#1A2B4C', // Deep Civil Defense Blue
          900: '#0F1B33',
          800: '#1A2B4C',
          700: '#243A63',
          600: '#30497A',
          400: '#6F86B3',
        },
        rescue: {
          DEFAULT: '#D96B27', // Resilience Rescue Orange
          400: '#F08A4B',
          600: '#B95517',
        },
      },
      fontFamily: {
        sans: ['"Noto Sans TC"', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        'alert-pulse': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(217,107,39,0.75)', borderColor: '#D96B27' },
          '50%': { boxShadow: '0 0 0 14px rgba(217,107,39,0)', borderColor: '#F08A4B' },
        },
        'flow-dash': {
          to: { strokeDashoffset: '-40' },
        },
        'sweep': {
          to: { transform: 'rotate(360deg)' },
        },
        // Expanding ring behind the compass pad (transform + opacity only, so it stays on the GPU).
        'pad-ring': {
          '0%': { transform: 'scale(1)', opacity: '0.7' },
          '100%': { transform: 'scale(1.3)', opacity: '0' },
        },
      },
      animation: {
        'alert-pulse': 'alert-pulse 1.4s ease-out infinite',
        'flow-dash': 'flow-dash 1.2s linear infinite',
        'sweep': 'sweep 6s linear infinite',
        'pad-ring': 'pad-ring 2.4s cubic-bezier(0.22, 1, 0.36, 1) infinite',
      },
      transitionTimingFunction: {
        'lock': 'cubic-bezier(0.34, 1.56, 0.64, 1)', // slight overshoot, then lock
      },
    },
  },
  plugins: [],
};
