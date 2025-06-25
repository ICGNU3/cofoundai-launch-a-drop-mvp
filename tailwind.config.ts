
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
				// Primary: Modern web3 typography
				geist: [
					'"Geist"',
					'"Inter"',
					'system-ui',
					'sans-serif'
				],
				// UI, Headlines - Premium, clean
				neue: [
					'"Inter"',
					'"Neue Montreal"',
					'SF Pro Display',
					'system-ui',
					'sans-serif'
				],
				// Body - Clean, readable
				satoshi: [
					'"Inter"',
					'"Satoshi"',
					'SF Pro Text',
					'system-ui',
					'sans-serif'
				],
				// Modern mono for addresses/code
				mono: [
					'"JetBrains Mono"',
					'"Fira Code"',
					'monospace'
				],
				// Aliases for semantic usage
				headline: [
					'"Inter"',
					'"Neue Montreal"',
					'SF Pro Display',
					'system-ui',
					'sans-serif'
				],
				sans: [
					'"Inter"',
					'"Satoshi"',
					'SF Pro Text',
					'system-ui',
					'sans-serif'
				],
			},
			fontWeight: {
				extralight: '200',
				light: '300',
				normal: '400',
				medium: '500',
				semibold: '600',
				bold: '700',
				extrabold: '800',
				black: '900',
			},
			fontSize: {
				// Modern scale with better line heights
				'xs': ['0.75rem', { lineHeight: '1.5' }],
				'sm': ['0.875rem', { lineHeight: '1.5' }],
				'base': ['1rem', { lineHeight: '1.6' }],
				'lg': ['1.125rem', { lineHeight: '1.6' }],
				'xl': ['1.25rem', { lineHeight: '1.5' }],
				'2xl': ['1.5rem', { lineHeight: '1.4' }],
				'3xl': ['1.875rem', { lineHeight: '1.3' }],
				'4xl': ['2.25rem', { lineHeight: '1.2' }],
				'5xl': ['3rem', { lineHeight: '1.1' }],
				'6xl': ['3.75rem', { lineHeight: '1' }],
				'7xl': ['4.5rem', { lineHeight: '1' }],
				'8xl': ['6rem', { lineHeight: '1' }],
				'9xl': ['8rem', { lineHeight: '1' }],
				// Custom sizes
				'hero': ['clamp(2.5rem, 5vw, 4rem)', { lineHeight: '1.1' }],
				'display': ['clamp(1.75rem, 3vw, 2.5rem)', { lineHeight: '1.2' }],
			},
			letterSpacing: {
				tightest: '-0.075em',
				tighter: '-0.05em',
				tight: '-0.025em',
				normal: '0',
				wide: '0.025em',
				wider: '0.05em',
				widest: '0.1em',
			},
			borderRadius: {
				'2xs': '0.125rem',
				'xs': '0.25rem',
				'sm': '0.375rem',
				'md': '0.5rem',
				'lg': '0.75rem',
				'xl': '1rem',
				'2xl': '1.5rem',
				'3xl': '2rem',
				'4xl': '2.5rem',
				// Custom radii
				'card': '1rem',
				'button': '0.75rem',
				'pill': '9999px',
			},
			colors: {
				// 2025 Web3 Color System
				background: "#0a0a0a",
				surface: "#111111",
				'surface-elevated': "#1a1a1a",
				card: "#141414",
				cardnew: "#161616",
				border: "#2a2a2a",
				'border-subtle': "#1f1f1f",
				
				// Primary brand colors - Modern web3 palette
				primary: {
					50: "#f0f9ff",
					100: "#e0f2fe", 
					200: "#bae6fd",
					300: "#7dd3fc",
					400: "#38bdf8",
					500: "#0ea5e9",
					600: "#0284c7",
					700: "#0369a1",
					800: "#075985",
					900: "#0c4a6e",
					950: "#082f49"
				},
				
				// Accent colors
				accent: "#6366f1",
				'accent-hover': "#5855eb",
				'accent-muted': "#a5b4fc",
				
				// Secondary palette
				secondary: {
					50: "#f8fafc",
					100: "#f1f5f9",
					200: "#e2e8f0",
					300: "#cbd5e1",
					400: "#94a3b8",
					500: "#64748b",
					600: "#475569",
					700: "#334155",
					800: "#1e293b",
					900: "#0f172a",
					950: "#020617"
				},
				
				// Status colors
				success: "#10b981",
				warning: "#f59e0b",
				error: "#ef4444",
				info: "#3b82f6",
				
				// Gradient colors
				'gradient-start': "#6366f1",
				'gradient-end': "#8b5cf6",
				'gradient-accent': "#06b6d4",
				
				// Text colors
				text: "#f8fafc",
				'text-primary': "#ffffff",
				'text-secondary': "#cbd5e1",
				'text-muted': "#94a3b8",
				'text-subtle': "#64748b",
				
				// Web3 specific
				'crypto-green': "#00d4aa",
				'crypto-blue': "#0052ff",
				'crypto-purple': "#8b5cf6",
				'crypto-orange': "#ff6b35",
			},
			backgroundImage: {
				// Modern gradients
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
				'gradient-mesh': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
				'gradient-aurora': 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #06b6d4 100%)',
				'gradient-web3': 'linear-gradient(135deg, #0052ff 0%, #00d4aa 100%)',
				'gradient-card': 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
			},
			boxShadow: {
				// Modern shadow system
				'xs': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
				'sm': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
				'md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
				'lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
				'xl': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
				'2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
				'inner': 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
				// Custom shadows
				'glow': '0 0 20px rgb(99 102 241 / 0.3)',
				'glow-lg': '0 0 40px rgb(99 102 241 / 0.4)',
				'card': '0 4px 12px rgb(0 0 0 / 0.15)',
				'card-hover': '0 8px 25px rgb(0 0 0 / 0.2)',
				'button': '0 2px 8px rgb(0 0 0 / 0.12)',
				'button-hover': '0 4px 16px rgb(0 0 0 / 0.2)',
			},
			spacing: {
				// Enhanced spacing scale
				'18': '4.5rem',
				'22': '5.5rem',
				'26': '6.5rem',
				'30': '7.5rem',
				'34': '8.5rem',
				'38': '9.5rem',
				'42': '10.5rem',
				'46': '11.5rem',
				'50': '12.5rem',
				'54': '13.5rem',
				'58': '14.5rem',
				'62': '15.5rem',
				'66': '16.5rem',
				'70': '17.5rem',
				'74': '18.5rem',
				'78': '19.5rem',
				'82': '20.5rem',
				'86': '21.5rem',
				'90': '22.5rem',
				'94': '23.5rem',
				'98': '24.5rem',
			},
			animation: {
				// Modern animations
				'fade-in': 'fadeIn 0.5s ease-out',
				'fade-out': 'fadeOut 0.5s ease-out',
				'slide-up': 'slideUp 0.5s ease-out',
				'slide-down': 'slideDown 0.5s ease-out',
				'scale-in': 'scaleIn 0.3s ease-out',
				'scale-out': 'scaleOut 0.3s ease-out',
				'glow': 'glow 2s ease-in-out infinite alternate',
				'float': 'float 3s ease-in-out infinite',
				'shimmer': 'shimmer 2s linear infinite',
				'gradient': 'gradient 3s ease infinite',
			},
			keyframes: {
				fadeIn: {
					'0%': { opacity: '0', transform: 'translateY(10px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' },
				},
				fadeOut: {
					'0%': { opacity: '1', transform: 'translateY(0)' },
					'100%': { opacity: '0', transform: 'translateY(10px)' },
				},
				slideUp: {
					'0%': { transform: 'translateY(100%)' },
					'100%': { transform: 'translateY(0)' },
				},
				slideDown: {
					'0%': { transform: 'translateY(-100%)' },
					'100%': { transform: 'translateY(0)' },
				},
				scaleIn: {
					'0%': { transform: 'scale(0.95)', opacity: '0' },
					'100%': { transform: 'scale(1)', opacity: '1' },
				},
				scaleOut: {
					'0%': { transform: 'scale(1)', opacity: '1' },
					'100%': { transform: 'scale(0.95)', opacity: '0' },
				},
				glow: {
					'0%': { boxShadow: '0 0 20px rgb(99 102 241 / 0.3)' },
					'100%': { boxShadow: '0 0 40px rgb(99 102 241 / 0.6)' },
				},
				float: {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-10px)' },
				},
				shimmer: {
					'0%': { transform: 'translateX(-100%)' },
					'100%': { transform: 'translateX(100%)' },
				},
				gradient: {
					'0%, 100%': { backgroundPosition: '0% 50%' },
					'50%': { backgroundPosition: '100% 50%' },
				},
			},
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
