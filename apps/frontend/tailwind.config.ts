import type { Config } from "tailwindcss";

const config: Config = {
	content: [
		"./app/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./lib/**/*.{ts,tsx}",
	],
	theme: {
		extend: {
			colors: {
				background: "hsl(var(--background))",
				foreground: "hsl(var(--foreground))",
				card: "hsl(var(--card))",
				"card-foreground": "hsl(var(--card-foreground))",
				primary: "hsl(var(--primary))",
				"primary-foreground": "hsl(var(--primary-foreground))",
				muted: "hsl(var(--muted))",
				"muted-foreground": "hsl(var(--muted-foreground))",
				border: "hsl(var(--border))",
			},
			borderRadius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},
			keyframes: {
				rise: {
					"0%": { opacity: "0", transform: "translateY(12px)" },
					"100%": { opacity: "1", transform: "translateY(0)" },
				},
			},
			animation: {
				rise: "rise 450ms ease-out both",
			},
			fontFamily: {
				sans: ["var(--font-space-grotesk)", "sans-serif"],
				mono: ["var(--font-ibm-plex-mono)", "monospace"],
			},
		},
	},
	plugins: [],
};

export default config;
