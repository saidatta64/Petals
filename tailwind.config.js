

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Arc Inspired Colors mapped to CSS Variables
        workspace: {
          bg: 'var(--workspace-bg)',
          sidebar: 'var(--workspace-sidebar)',
          card: 'var(--workspace-card)',
          border: 'var(--workspace-border)',
          primary: '#4F8CFF',
          purple: '#7C5CFF',
          green: '#22C55E',
          yellow: '#FBBF24',
          red: '#EF4444',
          text: 'var(--workspace-text)',
          'text-secondary': 'var(--workspace-text-secondary)',
        },
        // Legacy Light Mode (Keeping for now if needed)
        light: {
          bg: '#F8FAFC',
          surface: '#FFFFFF',
          border: '#E5E7EB',
          primary: '#2563EB',
          success: '#22C55E',
          warning: '#F59E0B',
          danger: '#EF4444',
          text: '#111827',
          'text-secondary': '#6B7280',
        },
        // Legacy Dark Mode
        dark: {
          bg: '#0F172A',
          surface: '#1E293B',
          border: '#334155',
          primary: '#3B82F6',
          success: '#22C55E',
          warning: '#FBBF24',
          danger: '#EF4444',
          text: '#F8FAFC',
          'text-secondary': '#94A3B8',
        },
      },
      borderRadius: {
        card: '12px',
        button: '10px',
        input: '8px',
        dialog: '16px',
      },
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '20px',
        '2xl': '24px',
        '3xl': '32px',
        '4xl': '40px',
        '5xl': '48px',
      },
      fontFamily: {
        sans: ['Inter', 'SF Pro Display', 'sans-serif'],
      },
      fontWeight: {
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      },
      boxShadow: {
        'glass-card': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}
