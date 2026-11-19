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
        space: {
          950: '#06080F',
          900: '#0B0F19',
          850: '#0F1524',
          800: '#141B2D',
          700: '#1F293D',
        },
        rajyotsava: {
          gold: '#FACC15',
          goldGlow: 'rgba(250, 204, 21, 0.4)',
          crimson: '#E11D48',
          crimsonGlow: 'rgba(225, 29, 72, 0.4)',
          red: '#DC2626',
          amber: '#F59E0B',
        },
        cyber: {
          cyan: '#06B6D4',
          emerald: '#10B981',
          violet: '#8B5CF6',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans Kannada', 'system-ui', 'sans-serif'],
        kannada: ['"Noto Sans Kannada"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'glow-gold': '0 0 20px rgba(250, 204, 21, 0.35)',
        'glow-crimson': '0 0 20px rgba(225, 29, 72, 0.35)',
        'glow-cyan': '0 0 20px rgba(6, 182, 212, 0.35)',
        'hud': '0 8px 32px 0 rgba(0, 0, 0, 0.6)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scanline': 'scan 2.5s linear infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}
