import type { Config } from 'tailwindcss'

export default {
  theme: {
    
    extend: {
      // Breakpoints สำหรับ POS System
      screens: {
        'xs': '475px',      // Mobile phones
        'sm': '640px',      // Large phones / Small tablets
        'md': '768px',      // Tablets
        'lg': '1024px',     // Desktop / POS terminals
        'xl': '1280px',     // Large desktop
        '2xl': '1536px',    // Very large screens
        // POS specific breakpoints
        'pos-sm': '800px',  // Small POS terminal
        'pos-md': '1024px', // Medium POS terminal  
        'pos-lg': '1200px', // Large POS terminal
        'pos-xl': '1440px', // Extra large POS display
      },
      
      // POS System Color Theme
      colors: {
        // Primary brand colors
        primary: {
          50: 'oklch(0.98 0.01 220)',
          100: 'oklch(0.95 0.03 220)',
          200: 'oklch(0.89 0.06 220)',
          300: 'oklch(0.81 0.09 220)',
          400: 'oklch(0.72 0.12 220)',
          500: 'oklch(0.63 0.15 220)',
          600: 'oklch(0.54 0.16 220)',
          700: 'oklch(0.46 0.17 220)',
          800: 'oklch(0.38 0.15 220)',
          900: 'oklch(0.31 0.12 220)',
          950: 'oklch(0.21 0.08 220)',
        },
        
        // Success colors (สำหรับ confirmed orders, payments)
        success: {
          50: 'oklch(0.97 0.02 142)',
          100: 'oklch(0.93 0.05 142)',
          200: 'oklch(0.86 0.10 142)',
          300: 'oklch(0.78 0.15 142)',
          400: 'oklch(0.69 0.18 142)',
          500: 'oklch(0.60 0.20 142)',
          600: 'oklch(0.51 0.21 142)',
          700: 'oklch(0.43 0.20 142)',
          800: 'oklch(0.35 0.18 142)',
          900: 'oklch(0.29 0.15 142)',
          950: 'oklch(0.19 0.10 142)',
        },
        
        // Warning colors (สำหรับ pending orders, low stock)
        warning: {
          50: 'oklch(0.98 0.02 85)',
          100: 'oklch(0.95 0.05 85)',
          200: 'oklch(0.89 0.10 85)',
          300: 'oklch(0.82 0.15 85)',
          400: 'oklch(0.74 0.18 85)',
          500: 'oklch(0.66 0.20 85)',
          600: 'oklch(0.57 0.21 85)',
          700: 'oklch(0.49 0.20 85)',
          800: 'oklch(0.41 0.18 85)',
          900: 'oklch(0.35 0.15 85)',
          950: 'oklch(0.23 0.10 85)',
        },
        
        // Error colors (สำหรับ failed payments, errors)
        error: {
          50: 'oklch(0.98 0.02 25)',
          100: 'oklch(0.95 0.05 25)',
          200: 'oklch(0.90 0.10 25)',
          300: 'oklch(0.84 0.15 25)',
          400: 'oklch(0.76 0.18 25)',
          500: 'oklch(0.68 0.20 25)',
          600: 'oklch(0.59 0.21 25)',
          700: 'oklch(0.51 0.20 25)',
          800: 'oklch(0.43 0.18 25)',
          900: 'oklch(0.37 0.15 25)',
          950: 'oklch(0.25 0.10 25)',
        },
        
        // Info colors (สำหรับ notifications, info messages)
        info: {
          50: 'oklch(0.97 0.02 220)',
          100: 'oklch(0.93 0.05 220)',
          200: 'oklch(0.86 0.10 220)',
          300: 'oklch(0.78 0.15 220)',
          400: 'oklch(0.69 0.18 220)',
          500: 'oklch(0.60 0.20 220)',
          600: 'oklch(0.51 0.21 220)',
          700: 'oklch(0.43 0.20 220)',
          800: 'oklch(0.35 0.18 220)',
          900: 'oklch(0.29 0.15 220)',
          950: 'oklch(0.19 0.10 220)',
        },
        
        // Neutral colors (สำหรับ backgrounds, borders)
        neutral: {
          50: 'oklch(0.98 0.005 220)',
          100: 'oklch(0.96 0.005 220)',
          200: 'oklch(0.92 0.005 220)',
          300: 'oklch(0.87 0.005 220)',
          400: 'oklch(0.71 0.005 220)',
          500: 'oklch(0.56 0.005 220)',
          600: 'oklch(0.45 0.005 220)',
          700: 'oklch(0.38 0.005 220)',
          800: 'oklch(0.25 0.005 220)',
          900: 'oklch(0.15 0.005 220)',
          950: 'oklch(0.08 0.005 220)',
        },
        
        // POS specific colors
        pos: {
          // Cash register colors
          cash: 'oklch(0.60 0.12 142)',
          card: 'oklch(0.55 0.15 220)',
          qr: 'oklch(0.62 0.18 300)',
          
          // Order status colors
          pending: 'oklch(0.70 0.15 85)',
          preparing: 'oklch(0.65 0.18 45)',
          ready: 'oklch(0.60 0.20 142)',
          completed: 'oklch(0.55 0.15 220)',
          cancelled: 'oklch(0.60 0.18 25)',
          
          // Table status colors
          available: 'oklch(0.90 0.05 142)',
          occupied: 'oklch(0.85 0.10 25)',
          reserved: 'oklch(0.88 0.08 85)',
          cleaning: 'oklch(0.92 0.05 220)',
        }
      },
      
      // Font families - Noto Sans Lao support
      fontFamily: {
        sans: [
          'Noto Sans Lao',
          'Noto Sans', 
          'system-ui', 
          '-apple-system', 
          'BlinkMacSystemFont', 
          'Segoe UI', 
          'Roboto', 
          'sans-serif'
        ],
        mono: [
          'JetBrains Mono',
          'Fira Code',
          'Consolas',
          'Monaco',
          'monospace'
        ],
        display: [
          'Noto Sans Lao',
          'Noto Sans',
          'system-ui',
          'sans-serif'
        ]
      },
      
      // Font sizes optimized for POS
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        // POS specific sizes
        'pos-xs': ['0.6875rem', { lineHeight: '0.875rem' }],
        'pos-sm': ['0.8125rem', { lineHeight: '1.125rem' }],
        'pos-base': ['0.9375rem', { lineHeight: '1.375rem' }],
        'pos-lg': ['1.0625rem', { lineHeight: '1.5rem' }],
        'pos-xl': ['1.1875rem', { lineHeight: '1.625rem' }],
        'pos-display': ['1.375rem', { lineHeight: '1.875rem' }],
        'pos-price': ['1.5625rem', { lineHeight: '2rem' }],
        'pos-total': ['1.875rem', { lineHeight: '2.25rem' }],
      },
      
      // Spacing optimized for touch interfaces
      spacing: {
        '18': '4.5rem',   // 72px
        '22': '5.5rem',   // 88px
        '26': '6.5rem',   // 104px
        '30': '7.5rem',   // 120px
        '34': '8.5rem',   // 136px
        '38': '9.5rem',   // 152px
        '42': '10.5rem',  // 168px
        '46': '11.5rem',  // 184px
        '50': '12.5rem',  // 200px
        // Touch-friendly sizes
        'touch-sm': '2.75rem',  // 44px - minimum touch target
        'touch-md': '3rem',     // 48px - comfortable touch
        'touch-lg': '3.5rem',   // 56px - large touch target
        'touch-xl': '4rem',     // 64px - extra large touch
      },
      
      // Border radius for modern POS interface
      borderRadius: {
        'pos-sm': '0.375rem',
        'pos-md': '0.5rem',
        'pos-lg': '0.75rem',
        'pos-xl': '1rem',
      },
      
      // Box shadows for depth
      boxShadow: {
        'pos-sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'pos-md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'pos-lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        'pos-xl': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        'pos-card': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'pos-button': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'pos-float': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
      },
      
      // Animation durations
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
        '1200': '1200ms',
      },
      
      // Z-index scale
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
        'modal': '1000',
        'overlay': '1100',
        'dropdown': '1200',
        'toast': '1300',
        'tooltip': '1400',
      }
    },
  },
  plugins: [],
} satisfies Config