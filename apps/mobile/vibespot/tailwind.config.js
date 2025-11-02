import { hairlineWidth } from 'nativewind/theme';

/** @type {import('tailwindcss').Config} */
export const darkMode = 'class';
export const content = ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'];
export const presets = [require('nativewind/preset')];
export const theme = {
  extend: {
    colors: {
      border: 'oklch(var(--border))',
      input: 'oklch(var(--input))',
      ring: 'oklch(var(--ring))',
      background: 'oklch(var(--background))',
      foreground: 'oklch(var(--foreground))',
      primary: {
        DEFAULT: 'hsl(var(--primary))',
        foreground: 'oklch(var(--primary-foreground))',
      },
      secondary: {
        DEFAULT: 'oklch(var(--secondary))',
        foreground: 'oklch(var(--secondary-foreground))',
      },
      destructive: {
        DEFAULT: 'oklch(var(--destructive))',
        foreground: 'oklch(var(--destructive-foreground))',
      },
      muted: {
        DEFAULT: 'oklch(var(--muted))',
        foreground: 'oklch(var(--muted-foreground))',
      },
      accent: {
        DEFAULT: 'oklch(var(--accent))',
        foreground: 'oklch(var(--accent-foreground))',
      },
      popover: {
        DEFAULT: 'oklch(var(--popover))',
        foreground: 'oklch(var(--popover-foreground))',
      },
      card: {
        DEFAULT: 'oklch(var(--card))',
        foreground: 'oklch(var(--card-foreground))',
      },
    },
    borderRadius: {
      lg: 'var(--radius)',
      md: 'calc(var(--radius) - 2px)',
      sm: 'calc(var(--radius) - 4px)',
    },
    borderWidth: {
      hairline: hairlineWidth(),
    },
    keyframes: {
      'accordion-down': {
        from: { height: '0' },
        to: { height: 'var(--radix-accordion-content-height)' },
      },
      'accordion-up': {
        from: { height: 'var(--radix-accordion-content-height)' },
        to: { height: '0' },
      },
    },
    animation: {
      'accordion-down': 'accordion-down 0.2s ease-out',
      'accordion-up': 'accordion-up 0.2s ease-out',
    },
  },
};
export const future = {
  hoverOnlyWhenSupported: true,
};
export const plugins = [require('tailwindcss-animate')];