
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
				headline: ["Satoshi", "sans-serif"],
				sans: ["Inter", "sans-serif"],
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
			},
			borderRadius: {
				lg: '16px', 
				card: '12px',
				pill: '20px',
			},
			colors: {
				background: "#0A0A0A",
				surface: "#1A1A1A",
				card: "#161616",
				cardnew: "#1A1A1A",
				border: "#2A2A2A",
				accent: "#5D5FEF",
				"accent-start": "#9A4DFF",
				"accent-end": "#5D5FEF",
				"body-text": "#C3C3C3",
				"headline": "#F9F9F9",
				tagline: "#E0E0E0",
				"slider-track": "#3A3A3A",
				"slider-thumb": "#5D5FEF",
				"toast": "#1E1E1E",
			},
			maxWidth: {
				card: "620px",
			},
			boxShadow: {
				coverart: "0 0 0 4px #FFF inset",
				"slider-thumb": "0 2px 12px 0 #5D5FEF66",
				btn: "0 3px #4445A2",
				"card-inner": "inset 0 0 4px 0 #2226",
			},
			keyframes: {
				"btn-raise": {
					"0%": { transform: "scale(1)" },
					"100%": { transform: "scale(1.04)" },
				},
				"btn-press": {
					"0%": { transform: "scale(1.04)" },
					"100%": { transform: "scale(0.97)" },
				},
			},
			animation: {
				"btn-raise": "btn-raise 0.15s cubic-bezier(.23,1.03,.65,1.19) forwards",
				"btn-press": "btn-press 0.95s cubic-bezier(.4,0,.6,1) forwards",
			},
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
