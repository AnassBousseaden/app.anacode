import { createPreset } from 'tailwindcss-shadcn-ui';

/** @type {import('tailwindcss').Config} */
const config = {
	darkMode: ['class'],
	content: ['./src/**/*.{html,js,svelte,ts}'],
	safelist: ['dark'],
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			typography: {
				DEFAULT: {
					css: {
						'--tw-prose-body': 'hsl(var(--foreground))',
						'--tw-prose-headings': 'hsl(var(--foreground))',
						'--tw-prose-links': 'hsl(var(--primary))',
						'--tw-prose-bold': 'hsl(var(--foreground))',
						'--tw-prose-counters': 'hsl(var(--muted-foreground))',
						'--tw-prose-bullets': 'hsl(var(--muted-foreground))',
						'--tw-prose-hr': 'hsl(var(--border))',
						'--tw-prose-quotes': 'hsl(var(--foreground))',
						'--tw-prose-quote-borders': 'hsl(var(--border))',
						'--tw-prose-captions': 'hsl(var(--muted-foreground))',
						'--tw-prose-code': 'hsl(var(--foreground))',
						'--tw-prose-code-bg': 'hsl(var(--muted))',
						'--tw-prose-pre-code': 'hsl(var(--foreground))',
						'--tw-prose-pre-bg': 'hsl(var(--secondary))',
						'--tw-prose-th-borders': 'hsl(var(--border))',
						'--tw-prose-td-borders': 'hsl(var(--border))',

						// Dark mode
						'--tw-prose-invert-body': 'hsl(var(--foreground))',
						'--tw-prose-invert-headings': 'hsl(var(--foreground))',
						'--tw-prose-invert-links': 'hsl(var(--primary))',
						'--tw-prose-invert-bold': 'hsl(var(--foreground))',
						'--tw-prose-invert-counters': 'hsl(var(--muted-foreground))',
						'--tw-prose-invert-bullets': 'hsl(var(--muted-foreground))',
						'--tw-prose-invert-hr': 'hsl(var(--border))',
						'--tw-prose-invert-quotes': 'hsl(var(--foreground))',
						'--tw-prose-invert-quote-borders': 'hsl(var(--border))',
						'--tw-prose-invert-captions': 'hsl(var(--muted-foreground))',
						'--tw-prose-invert-code': 'hsl(var(--foreground))',
						'--tw-prose-invert-code-bg': 'hsl(var(--muted))',
						'--tw-prose-invert-pre-code': 'hsl(var(--foreground))',
						'--tw-prose-invert-pre-bg': 'hsl(var(--secondary))',
						'--tw-prose-invert-th-borders': 'hsl(var(--border))',
						'--tw-prose-invert-td-borders': 'hsl(var(--border))',

						// Base styles
						maxWidth: 'none',
						color: 'var(--tw-prose-body)',
						lineHeight: '1.7142857',
						'> *': {
							marginTop: '1rem',
							marginBottom: '1rem'
						},
						p: {
							marginTop: '0.75rem',
							marginBottom: '0.75rem'
						},
						'[class~="lead"]': {
							color: 'var(--tw-prose-bold)'
						},
						a: {
							color: 'var(--tw-prose-links)',
							textDecoration: 'underline',
							fontWeight: '500'
						},
						'a:hover': {
							textDecoration: 'none'
						},
						strong: {
							color: 'var(--tw-prose-bold)',
							fontWeight: '600'
						},
						h1: {
							color: 'var(--tw-prose-headings)',
							fontWeight: '800',
							fontSize: '1.75em',
							marginTop: '0',
							marginBottom: '0.8888889em',
							lineHeight: '1.1111111'
						},
						h2: {
							color: 'var(--tw-prose-headings)',
							fontWeight: '700',
							fontSize: '1.375em',
							marginTop: '2em',
							marginBottom: '1em',
							lineHeight: '1.3333333'
						},
						h3: {
							color: 'var(--tw-prose-headings)',
							fontWeight: '600',
							fontSize: '1.125em',
							marginTop: '1.6em',
							marginBottom: '0.6em',
							lineHeight: '1.6'
						},
						h4: {
							color: 'var(--tw-prose-headings)',
							fontWeight: '600',
							marginTop: '1.5em',
							marginBottom: '0.5em',
							lineHeight: '1.5'
						},
						code: {
							color: 'var(--tw-prose-code)',
							fontWeight: '600',
							fontSize: '0.8125em',
							backgroundColor: 'var(--tw-prose-code-bg)',
							borderRadius: 'var(--radius)',
							paddingLeft: '0.2em',
							paddingRight: '0.2em',
							paddingTop: '0.1em',
							paddingBottom: '0.1em'
						},
						'code::before': {
							content: 'none'
						},
						'code::after': {
							content: 'none'
						},
						'pre code': {
							backgroundColor: 'transparent',
							borderWidth: '0',
							borderRadius: '0',
							padding: '0',
							fontWeight: 'inherit',
							color: 'inherit',
							fontSize: 'inherit',
							fontFamily: 'inherit',
							lineHeight: 'inherit'
						},
						pre: {
							color: 'var(--tw-prose-pre-code)',
							backgroundColor: 'var(--tw-prose-pre-bg)',
							borderRadius: 'var(--radius)',
							padding: '0.75rem',
							overflowX: 'auto'
						}
					}
				}
			},
			colors: {
				border: 'hsl(var(--border) / <alpha-value>)',
				input: 'hsl(var(--input) / <alpha-value>)',
				ring: 'hsl(var(--ring) / <alpha-value>)',
				background: 'hsl(var(--background) / <alpha-value>)',
				foreground: 'hsl(var(--foreground) / <alpha-value>)',
				primary: {
					DEFAULT: 'hsl(var(--primary) / <alpha-value>)',
					foreground: 'hsl(var(--primary-foreground) / <alpha-value>)'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary) / <alpha-value>)',
					foreground: 'hsl(var(--secondary-foreground) / <alpha-value>)'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive) / <alpha-value>)',
					foreground: 'hsl(var(--destructive-foreground) / <alpha-value>)'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted) / <alpha-value>)',
					foreground: 'hsl(var(--muted-foreground) / <alpha-value>)'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent) / <alpha-value>)',
					foreground: 'hsl(var(--accent-foreground) / <alpha-value>)'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover) / <alpha-value>)',
					foreground: 'hsl(var(--popover-foreground) / <alpha-value>)'
				},
				card: {
					DEFAULT: 'hsl(var(--card) / <alpha-value>)',
					foreground: 'hsl(var(--card-foreground) / <alpha-value>)'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			fontFamily: {
				sans: [
					'Geist Sans',
					'ui-sans-serif',
					'system-ui',
					'-apple-system',
					'BlinkMacSystemFont',
					'Segoe UI',
					'Roboto',
					'Helvetica Neue',
					'Arial',
					'Noto Sans',
					'sans-serif'
				]
			}
		}
	},
	plugins: [require('@tailwindcss/typography')],
	presets: [createPreset()]
};

export default config;
