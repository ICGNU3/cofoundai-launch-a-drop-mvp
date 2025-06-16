
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				// Primary: Geist-inspired with Inter fallback
				geist: [
					'"Geist"',
					'"Inter"',
					'system-ui',
					'sans-serif'
				],
				// UI, Headlines - Modern, clean
				neue: [
					'"Inter"',
					'"Neue Montreal"',
					'Montserrat',
					'system-ui',
					'sans-serif'
				],
				// Body - Clean, readable
				satoshi: [
					'"Inter"',
					'"Satoshi"',
					'Montserrat',
					'system-ui',
					'sans-serif'
				],
				// Aliases for legacy and new usage
				headline: [
					'"Inter"',
					'"Neue Montreal"',
					'Montserrat',
					'system-ui',
					'sans-serif'
				],
				sans: [
					'"Inter"',
					'"Satoshi"',
					'Montserrat',
					'system-ui',
					'sans-serif'
				],
			},
			fontWeight: {
				extralight: 200,
				light: 300,
				normal: 400,
				medium: 500,
				semi: 600,
				bold: 700,
			},
			fontSize: {
				base: ['16px', '1.5'],
				'hero': ['36px', '1.2'],
				'hero-lg': ['4rem', '1.1'],
				'hero-xl': ['5rem', '1.1'],
				'pill': ['14px', '1.4'],
				'section': ['20px', '1.4'],
			},
			letterSpacing: {
				tighter: '-0.025em',
				tight: '-0.015em',
				normal: '0',
				wide: '0.025em',
			},
			borderRadius: {
				lg: '16px', 
				card: '12px',
				pill: '20px',
			},
			colors: {
				background: "#000000",
				surface: "#000000",
				card: "#111111",
				cardnew: "#111111",
				border: "#1f1f1f",
				accent: "#60a5fa",
				"accent-start": "#60a5fa",
				"accent-end": "#a855f7",
				success: "#60a5fa",
				blue: {
					400: "#60a5fa",
					500: "#3b82f6",
				},
				purple: {
					400: "#a855f7",
					500: "#8b5cf6",
				},
				gold: "#FFD166",
				yellow: "#FDE68A",
				"body-text": "#d1d5db",
				text: "#f9fafb",
				"headline": "#f9fafb",
				tagline: "#d1d5db",
				"text-muted": "#9ca3af",
				"slider-track": "#1f1f1f",
				"slider-thumb": "#60a5fa",
				"toast": "#111111",
			},
			maxWidth: {
				card: "620px",
			},
			boxShadow: {
				coverart: "0 0 0 4px #FFF inset",
				"slider-thumb": "0 2px 12px 0 #60a5fa66",
				btn: "0 3px #60a5fa",
				"card-inner": "inset 0 0 4px 0 #1f1f1f33",
				"card-elevated": "0 4px 12px rgba(96,165,250, 0.15)",
			},
			keyframes: {
				"btn-raise": {
					"0%": { transform: "scale(1)" },
					"100%": { transform: "scale(1.05)" },
				},
				"btn-press": {
					"0%": { transform: "scale(1.05)" },
					"100%": { transform: "scale(0.95)" },
				},
			},
			animation: {
				"btn-raise": "btn-raise 0.15s cubic-bezier(.23,1.03,.65,1.19) forwards",
				"btn-press": "btn-press 0.15s cubic-bezier(.4,0,.6,1) forwards",
			},
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
