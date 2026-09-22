/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        // File bro code V10 design tokens — used by the UI.
        filebro: {
          black: '#0A0A0A',
          base: '#1E201E',
          surface: '#171817',
          surface2: '#1D1E1D',
          surface3: '#232423',
          surface4: '#2A2B2A',
          line: '#292A29',
          white: '#F5F5F5',
          muted: '#A1A1A1',
          muted2: '#737373',
          error: '#FF7E7E',
        },
        // Kept in config for the original brief, but not used by the V10 UI.
        legacy: {
          background: '#FFEDB9',
          accent: '#FFCB56',
          secondary: '#FFA259',
          warning: '#FF7E7E',
        },
      },
      borderRadius: {
        '4xl': '22px',
      },
      boxShadow: {
        'filebro': '0 24px 70px rgba(0,0,0,.34)',
      },
      letterSpacing: {
        'tight-v10': '-0.055em',
      },
    },
  },
  plugins: [],
}
