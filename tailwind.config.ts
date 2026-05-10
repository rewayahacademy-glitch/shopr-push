import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        outfit: ['Outfit', 'system-ui', 'sans-serif'],
      },
      colors: {
        teal: {
          DEFAULT: '#025259',
          deep:    '#034F5A',
          mid:     '#11525B',
          light:   'rgba(2,82,89,0.08)',
        },
        slate: '#3E4F4C',
        salmon: {
          DEFAULT: '#ff947a',
          hover:   '#e8836b',
          light:   'rgba(255,148,122,0.12)',
        },
        bg: {
          DEFAULT: '#F7F5F2',
          surface: '#FFFFFF',
          alt:     '#F0EDE9',
        },
        'bg-alt': '#F0EDE9',
      },
      fontSize: {
        display: ['3.5rem', { lineHeight: '1.05', fontWeight: '800' }],
        h2:      ['1.75rem', { lineHeight: '1.2', fontWeight: '700' }],
        h4:      ['1.125rem',{ lineHeight: '1.4', fontWeight: '600' }],
        '4xl':   ['2.5rem', { lineHeight: '1.1',  fontWeight: '700' }],
        '3xl':   ['2rem',   { lineHeight: '1.2',  fontWeight: '700' }],
        '2xl':   ['1.5rem', { lineHeight: '1.3',  fontWeight: '600' }],
        xl:      ['1.25rem',{ lineHeight: '1.4',  fontWeight: '600' }],
        lg:      ['1.125rem',{lineHeight: '1.5',  fontWeight: '500' }],
        base:    ['1rem',   { lineHeight: '1.6',  fontWeight: '400' }],
        sm:      ['0.875rem',{lineHeight: '1.5',  fontWeight: '400' }],
        xs:      ['0.75rem',{ lineHeight: '1.4',  fontWeight: '400' }],
      },
      spacing: { 18: '4.5rem', 22: '5.5rem' },
      boxShadow: {
        card:  '0 4px 24px rgba(2,82,89,0.08)',
        hover: '0 12px 40px rgba(2,82,89,0.14), 0 4px 12px rgba(2,82,89,0.08)',
        nav:   '0 1px 0 rgba(2,82,89,0.08), 0 8px 32px rgba(2,82,89,0.1)',
        glow:  '0 0 40px rgba(255,148,122,0.25)',
      },
      borderRadius: {
        xl: '0.75rem', '2xl': '1rem', '3xl': '1.5rem',
      },
      keyframes: {
        'float-slow': {
          '0%,100%': { transform: 'translateY(0px) rotate(0deg) scale(1)' },
          '33%':      { transform: 'translateY(-22px) rotate(5deg) scale(1.02)' },
          '66%':      { transform: 'translateY(-10px) rotate(-4deg) scale(0.98)' },
        },
        'float-med': {
          '0%,100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%':      { transform: 'translateY(-16px) rotate(-7deg)' },
        },
        'float-fast': {
          '0%,100%': { transform: 'translateY(0px) scale(1)' },
          '50%':      { transform: 'translateY(-10px) scale(1.03)' },
        },
        'orbit-cw':  { from: { transform: 'rotate(0deg)'    }, to: { transform: 'rotate(360deg)'  } },
        'orbit-ccw': { from: { transform: 'rotate(0deg)'    }, to: { transform: 'rotate(-360deg)' } },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(26px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': { from: { opacity: '0' }, to: { opacity: '1' } },
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition:  '200% 0' },
        },
        'pulse-slow': {
          '0%,100%': { opacity: '1' },
          '50%':      { opacity: '0.5' },
        },
        drift: {
          '0%':   { transform: 'translate(0,0)',       opacity: '0.55' },
          '25%':  { transform: 'translate(14px,-22px)',opacity: '0.85' },
          '50%':  { transform: 'translate(26px,-6px)', opacity: '0.55' },
          '75%':  { transform: 'translate(6px,-30px)', opacity: '0.75' },
          '100%': { transform: 'translate(0,0)',       opacity: '0.55' },
        },
      },
      animation: {
        'float-slow': 'float-slow 10s ease-in-out infinite',
        'float-med':  'float-med   7s ease-in-out infinite',
        'float-fast': 'float-fast  4.5s ease-in-out infinite',
        'orbit-cw':   'orbit-cw   30s linear infinite',
        'orbit-ccw':  'orbit-ccw  22s linear infinite',
        'fade-up':    'fade-up    0.6s ease-out forwards',
        'fade-in':    'fade-in    0.6s ease-out forwards',
        float:        'float       4s ease-in-out infinite',
        shimmer:      'shimmer    1.6s linear infinite',
        'pulse-slow': 'pulse-slow  3s ease-in-out infinite',
        drift:        'drift      13s ease-in-out infinite',
      },
    },
  },
};

export default config;
