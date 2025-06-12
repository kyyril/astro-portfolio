/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        'mono': ['JetBrains Mono', 'monospace'],
        'sans': ['JetBrains Mono', 'monospace'],
      },
      colors: {
        // Adwaita Dark
        'adwaita': {
          primary: '#3584e4',
          secondary: '#99c1f1',
          accent: '#f6d32d',
          background: '#242424',
          surface: '#303030',
          text: '#ffffff',
          border: '#404040'
        },
        // Adwaita Light
        'adwaita-light': {
          primary: '#3584e4',
          secondary: '#99c1f1',
          accent: '#f6d32d',
          background: '#ffffff',
          surface: '#f6f6f6',
          text: '#000000',
          border: '#e0e0e0'
        },
        // Arc Dark
        'arc': {
          primary: '#5294e2',
          secondary: '#7c818c',
          accent: '#5294e2',
          background: '#2f343f',
          surface: '#383c4a',
          text: '#d3dae3',
          border: '#414652'
        },
        // Arc Light
        'arc-light': {
          primary: '#5294e2',
          secondary: '#7c818c',
          accent: '#5294e2',
          background: '#f8f8f8',
          surface: '#ffffff',
          text: '#4a4a4a',
          border: '#dcdcdc'
        },
        // Catppuccin Mocha
        'catppuccin': {
          primary: '#89b4fa',
          secondary: '#cba6f7',
          accent: '#f9e2af',
          background: '#1e1e2e',
          surface: '#313244',
          text: '#cdd6f4',
          border: '#45475a'
        },
        // Tokyo Night
        'tokyo': {
          primary: '#7aa2f7',
          secondary: '#bb9af7',
          accent: '#e0af68',
          background: '#1a1b26',
          surface: '#1f2335',
          text: '#c0caf5',
          border: '#292e42'
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'twinkle': 'twinkle 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        twinkle: {
          '0%': { opacity: '0.3' },
          '100%': { opacity: '1' },
        },
      },
      backdropBlur: {
        'xs': '2px',
      }
    },
  },
  plugins: [],
}