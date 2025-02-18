import type { Config } from 'tailwindcss';

import plugin from 'tailwindcss/plugin';

import type { PluginAPI } from 'tailwindcss/types/config';

// Let's create a plugin that adds utilities!
const capitalizeFirst = plugin(function ({
	addUtilities
}: {
	addUtilities: PluginAPI['addUtilities'];
}) {
	const newUtilities = {
		'.capitalize-first:first-letter': {
			textTransform: 'uppercase'
		}
	};
	addUtilities(newUtilities);
});

const config: Config = {
	darkMode: ['class'],
	content: [
		'./pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./components/**/*.{js,ts,jsx,tsx,mdx}',
		'./app/**/*.{js,ts,jsx,tsx,mdx}',
		'./sanity/**/*.{js,ts,jsx,tsx,mdx}'
	],
	theme: {
		extend: {
			screens: {
				xs: '475px'
			},
			colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
				primary: {
					'100': '#FFE8F0',
					DEFAULT: '#EE2B69'
				},
				secondary: '#FBE842',
				black: {
					'100': '#333333',
					'200': '#141413',
					'300': '#7D8087',
					DEFAULT: '#000000'
				},
				white: {
					'100': '#F7F7F7',
					DEFAULT: '#FFFFFF'
				},
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
			},
			fontFamily: {
				'work-sans': ['var(--font-work-sans)']
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			boxShadow: {
				100: '2px 2px 0px 0px rgb(0, 0, 0)',
				200: '2px 2px 0px 2px rgb(0, 0, 0)',
				300: '2px 2px 0px 2px rgb(238, 43, 105)'
			}
		}
	},
	plugins: [
		require('tailwindcss-animate'),
		require('@tailwindcss/typography'),
		capitalizeFirst
	]
};

export default config;
