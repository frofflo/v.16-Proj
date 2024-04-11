import { join } from 'path'
import type { Config } from 'tailwindcss'
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import { skeleton } from '@skeletonlabs/tw-plugin'

export default {
	darkMode: 'class',
	content: ['./src/**/*.{html,js,svelte,ts}', join(require.resolve('@skeletonlabs/skeleton'), '../**/*.{html,js,svelte,ts}')],
	theme: {
		extend: {
			keyframes: {
				'firework': {
					'0%': { transform: 'scale(0)', opacity: '1' },
					'100%': { transform: 'scale(1)', opacity: '0' },
				},
			},
			animation: {
				'firework': 'firework 1s ease-in-out',
			},
		},
	},
	plugins: [
		forms,
		typography,
		skeleton({
			themes: {
				preset: [
					{
						name: 'modern',
						enhancements: true,
					},
				],
			},
		}),
	],
	
} satisfies Config;