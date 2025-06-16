
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
				// UI, Headlines
				neue: [
					'"Neue Montreal"',
					'Montserrat',
					'Inter',
					'system-ui',
					'sans-serif'
				],
				// Body
				satoshi: [
					'"Satoshi"',
					'Inter',
					'Montserrat',
					'system-ui',
					'sans-serif'
				],
				// Aliases for legacy utility classes
				headline: [
					'"Neue Montreal"',
					'Montserrat',
					'Inter',
					'system-ui',
					'sans-serif'
				],
				sans: [
					'"Satoshi"',
					'Inter',
					'Montserrat',
					'system-ui',
					'sans-serif'
				],
			},
			fontWeight: {
				semi: 500,
				normal: 400,
				bold: 700,
			},
			fontSize: {
				base: ['16px', '1.5'],
				'hero': ['36px', '1.2'],
				'pill': ['14px', '1.4'],
				'section': ['20px', '1.4'],
			},
			borderRadius: {
				lg: '16px', 
				card: '12px',
				pill: '20px',
			},
			colors: {
				background: "#0d0d0d",
				surface: "#0d0d0d",
				card: "#1E1E1E",
				cardnew: "#1E1E1E",
				border: "#2A2A2A",
				accent: "#FFD166",
				"accent-start": "#FFD166",
				"accent-end": "#F2AA4C",
				success: "#FFD166",
				gold: "#FFD166",
				yellow: "#FDE68A",
				"body-text": "#e8e8e8",
				"headline": "#e8e8e8",
				tagline: "#e8e8e8",
				"slider-track": "#3A3A3A",
				"slider-thumb": "#FFD166",
				"toast": "#1E1E1E",
			},
			maxWidth: {
				card: "620px",
			},
			boxShadow: {
				coverart: "0 0 0 4px #FFF inset",
				"slider-thumb": "0 2px 12px 0 #FFD16666",
				btn: "0 3px #FFD166",
				"card-inner": "inset 0 0 4px 0 #2226",
				"card-elevated": "0 4px 12px rgba(255,209,102, 0.15)",
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
