/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Fixed palette from the brief — do not drift from these.
        bg: '#111318', // page background (dark gray, not pure black)
        surface: '#1a1d24', // cards
        'surface-2': '#1f222b', // raised surface inside cards
        border: '#2a2d3a',
        'border-bright': '#363a4a', // hover/active border
        accent: '#39FF14', // bright neon green (420) — used sparingly
        rav3d: '#9B30FF', // neon purple — RAV3D + monitoring namespace
        sys: '#36b8c8', // teal — kube-system namespace
        ink: '#e8eaf0', // text primary
        muted: '#6b7080', // text muted
        live: '#3ecf8e', // status: live
        progress: '#f5b942', // status: in progress
        crit: '#ff4d5e', // status: failed/down (pod phases, degraded workloads)
      },
      fontFamily: {
        sans: ['"Inter Variable"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono Variable"', '"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      keyframes: {
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.35' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
        shimmer: 'shimmer 1.6s ease-in-out infinite',
        'fade-up': 'fade-up 0.5s ease-out both',
      },
    },
  },
  plugins: [],
}
