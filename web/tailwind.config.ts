import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        apax: {
          bg: '#0E1013',
          panel: '#15181C',
          panel2: '#191D21',
          panel3: '#101317',
          border: '#23272C',
          border2: '#2E343A',
          line: '#1B1F23',
          gold: '#C8A253',
          goldHover: '#E0BC6B',
          goldDim: '#4A3C22',
          goldBg: '#191712',
          text: '#E8E6E1',
          text2: '#C7CCD2',
          muted: '#8B9199',
          dim: '#5F666E',
          dim2: '#4A5057',
          green: '#5E9C7B',
          greenBg: '#141A17',
          greenBorder: '#2E4A3B',
          red: '#B4685E',
          redBg: '#1A1414',
          redBorder: '#4A2E2A',
          silver: '#A9B2BA',
          platinum: '#DCE3E8',
        },
      },
      fontFamily: {
        serif: ['var(--font-spectral)', 'Georgia', 'serif'],
        sans: ['var(--font-plex-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-plex-mono)', 'monospace'],
      },
      keyframes: {
        apaxPulse: {
          '0%, 100%': { opacity: '0.35' },
          '50%': { opacity: '0.9' },
        },
      },
      animation: {
        apaxPulse: 'apaxPulse 1.8s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
