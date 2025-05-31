// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a'
        },
        accent: {
          light: '#818cf8',
          DEFAULT: '#6366f1',
          dark: '#4f46e5'
        },
        surface: {
          light: '#ffffff',
          DEFAULT: '#f8fafc',
          dark: '#f1f5f9'
        },
        background: {
          start: '#1a365d',  // Deep blue
          middle: '#2d3748', // Slate
          end: '#1a365d',    // Deep blue
          accent1: '#4299e1', // Sky blue
          accent2: '#805ad5'  // Purple
        }
      },
      animation: {
        'slide-up': 'slide-up 0.5s ease-out',
        'fade-in': 'fade-in 0.5s ease-out',
        'bounce-slow': 'bounce 3s infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'background-shine': 'background-shine 8s linear infinite',
        'gradient-move': 'gradient-move 15s ease infinite',
        'pulse-soft': 'pulse-soft 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        'glow': {
          '0%': { boxShadow: '0 0 5px rgba(14, 165, 233, 0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(14, 165, 233, 0.6)' }
        },
        'background-shine': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' }
        },
        'gradient-move': {
          '0%, 100%': {
            'background-size': '400% 400%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          }
        },
        'pulse-soft': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.8 }
        }
      }
    },
  },
  plugins: [],
}
