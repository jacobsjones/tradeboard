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
        // Primary Trading Dark Theme
        trade: {
          900: '#0a0a0f',  // Deepest background
          800: '#12121a',  // Main background
          700: '#1a1a25',  // Card/elevated background
          600: '#252536',  // Border, dividers
          500: '#3a3a4a',  // Hover states
          400: '#6b7280',  // Secondary text
          300: '#9ca3af',  // Muted text
          200: '#d1d5db',  // Primary text
          100: '#f3f4f6',  // Bright text
        },
        // Accent Colors
        accent: {
          blue: '#3b82f6',
          'blue-glow': '#60a5fa',
          purple: '#8b5cf6',
          'purple-glow': '#a78bfa',
          cyan: '#06b6d4',
          'cyan-glow': '#22d3ee',
        },
        // Priority Colors
        priority: {
          high: '#ef4444',
          'high-glow': '#f87171',
          medium: '#f59e0b',
          'medium-glow': '#fbbf24',
          low: '#10b981',
          'low-glow': '#34d399',
        },
        // Column specific colors
        column: {
          todo: '#6366f1',
          inprogress: '#3b82f6',
          hold: '#f59e0b',
          done: '#10b981',
        },
        // Sidebar
        sidebar: {
          bg: '#0f0f16',
          hover: '#1a1a25',
          active: '#252536',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'glow-blue': '0 0 20px rgba(59, 130, 246, 0.15)',
        'glow-purple': '0 0 20px rgba(139, 92, 246, 0.15)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.3)',
        'dragging': '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'glow-overlay': 'radial-gradient(ellipse at top, rgba(59, 130, 246, 0.08) 0%, transparent 50%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(59, 130, 246, 0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)' },
        },
      },
    },
  },
  plugins: [],
}
