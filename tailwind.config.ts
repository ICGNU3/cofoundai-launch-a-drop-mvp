
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
				headline: ["Migra", "serif"],
				sans: ["General Sans", "sans-serif"],
			},
			colors: {
				background: "#0A0A0A",
				card: "#161616",
				border: "#2A2A2A",
				accent: "#5D5FEF",
				"body-text": "#C3C3C3",
				"headline": "#F9F9F9",
				"slider-track": "#3A3A3A",
				"slider-thumb": "#5D5FEF",
				"toast": "#1E1E1E",
			},
			borderRadius: {
				lg: '16px',
			},
			boxShadow: {
				coverart: "0 0 0 4px #FFF inset",
				"slider-thumb": "0 2px 12px 0 #5D5FEF66",
				btn: "0 3px #4445A2",
			},
			keyframes: {
				"btn-raise": {
					"0%": { transform: "translateY(0px)" },
					"100%": { transform: "translateY(-3px)" },
				},
			},
			animation: {
				"btn-raise": "btn-raise 0.15s ease-in",
			},
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
