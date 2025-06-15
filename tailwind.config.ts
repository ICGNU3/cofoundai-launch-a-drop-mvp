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
				headline: [
					"Helvetica Neue",
					"Helvetica",
					"Arial",
					"sans-serif",
					"Satoshi",
				],
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
				'section': ['20px', '1.4'],
			},
			borderRadius: {
				lg: '16px', 
				card: '12px',
				pill: '20px',
			},
			colors: {
				background: "#0A0A0A",
				surface: "#161C18", // a subtle green-black
				card: "#1E1E1E",
				cardnew: "#1E1E1E",
				border: "#2A2A2A",
				accent: "#22C55E", // modern success green
				"accent-start": "#22C55E", // vibrant green for gradients
				"accent-end": "#A3E635",   // lime-green for gradients
				success: "#4ADE80", // pastel green
				gold: "#FFD700",
				yellow: "#FDE68A",
				"body-text": "#C3C3C3",
				"headline": "#F9F9F9",
				tagline: "#E0E0E0",
				"slider-track": "#3A3A3A",
				"slider-thumb": "#22C55E",
				"toast": "#1E1E1E",
			},
			maxWidth: {
				card: "620px",
			},
			boxShadow: {
				coverart: "0 0 0 4px #FFF inset",
				"slider-thumb": "0 2px 12px 0 #5D5FEF66",
				btn: "0 3px #22C55E",
				"card-inner": "inset 0 0 4px 0 #2226",
				"card-elevated": "0 4px 12px rgba(34,197,94, 0.15)",
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
