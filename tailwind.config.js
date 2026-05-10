/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#0A0A0A',
        surface: '#111111',
        'surface-2': '#161616',
        border: '#1e1e1e',
        'border-2': '#2a2a2a',
        accent: '#E8A530',
        'accent-dim': 'rgba(232,165,48,0.08)',
        'accent-glow': 'rgba(232,165,48,0.2)',
        success: '#00D084',
        'text-primary': '#ffffff',
        'text-secondary': '#888888',
        'text-muted': '#2e2e2e',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['"Instrument Serif"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        card: '1.25rem',
        'card-lg': '2rem',
        btn: '0.625rem',
      },
    },
  },
  plugins: [],
}
