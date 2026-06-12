import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      // ── Palette — "Monochrome + Forge" ─────────────────────────
      // Cool precision base + single warm accent (forge amber).
      // Every colour has a named semantic role — no magic hex values in components.
      colors: {
        ink: {
          950: '#0F0F12', // Primary text, headings
          800: '#1A1A22', // Dark headings on light surfaces
          600: '#52525F', // Secondary text
          400: '#7F7F8C', // Muted / disabled
          300: '#A0A0AD', // Placeholder text
          200: '#C8C8D4', // Subtle labels
          100: '#E0E0EA', // Borders (alternate)
        },
        border: '#DCDCE8',
        surface: {
          DEFAULT: '#FAFAFC', // Page background — faint cool tint, not harsh white
          raised: '#F0F0F5', // Cards, inputs, elevated surfaces
        },
        accent: {
          DEFAULT: '#E07B00', // Forge amber — the single colour pop
          dim: '#C46800',     // Hover / pressed state
          subtle: '#E07B0018', // Low-opacity wash for backgrounds
        },
      },

      // ── Typography ─────────────────────────────────────────────
      fontFamily: {
        display: ['"Bricolage Grotesque"', 'system-ui', 'sans-serif'],
        body: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },

      // ── Type Scale (modular, tracking tightened at display sizes) ─
      fontSize: {
        'display-2xl': ['4.5rem',   { lineHeight: '1.05', letterSpacing: '-0.03em' }],
        'display-xl':  ['3.75rem',  { lineHeight: '1.08', letterSpacing: '-0.025em' }],
        'display-lg':  ['3rem',     { lineHeight: '1.1',  letterSpacing: '-0.02em' }],
        'display-md':  ['2.25rem',  { lineHeight: '1.2',  letterSpacing: '-0.015em' }],
        'display-sm':  ['1.875rem', { lineHeight: '1.25', letterSpacing: '-0.01em' }],
        'heading-xl':  ['1.5rem',   { lineHeight: '1.3',  letterSpacing: '-0.01em' }],
        'heading-lg':  ['1.25rem',  { lineHeight: '1.35', letterSpacing: '-0.005em' }],
        'heading-md':  ['1.125rem', { lineHeight: '1.4',  letterSpacing: '0' }],
        'body-lg':     ['1.125rem', { lineHeight: '1.65', letterSpacing: '0' }],
        'body-md':     ['1rem',     { lineHeight: '1.6',  letterSpacing: '0' }],
        'body-sm':     ['0.875rem', { lineHeight: '1.55', letterSpacing: '0' }],
        'label-lg':    ['0.875rem', { lineHeight: '1.4',  letterSpacing: '0.05em' }],
        'label-sm':    ['0.75rem',  { lineHeight: '1.4',  letterSpacing: '0.07em' }],
        'code':        ['0.875rem', { lineHeight: '1.5',  letterSpacing: '-0.01em' }],
      },

      // ── 8-pt Spacing Grid ──────────────────────────────────────
      spacing: {
        'section-y':    '6rem',  // Vertical padding between page sections
        'content-gap':  '2rem',  // Gap between content blocks
        'component-gap':'1rem',  // Internal component spacing
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
        '34': '8.5rem',
        '38': '9.5rem',
      },

      maxWidth: {
        content: '75rem', // 1200px — max content width
      },

      // ── Easing Tokens ──────────────────────────────────────────
      // Keep in sync with src/lib/motion-tokens.ts and CSS custom props
      transitionTimingFunction: {
        'out-expo':  'cubic-bezier(0.16, 1, 0.3, 1)',
        'out-cubic': 'cubic-bezier(0.33, 1, 0.68, 1)',
        'out-quart': 'cubic-bezier(0.25, 1, 0.5, 1)',
        'in-cubic':  'cubic-bezier(0.32, 0, 0.67, 0)',
      },

      // ── Duration Tokens ────────────────────────────────────────
      transitionDuration: {
        'instant':  '150ms',
        'fast':     '300ms',
        'moderate': '500ms',
        'slow':     '700ms',
      },
    },
  },
  plugins: [],
}

export default config
