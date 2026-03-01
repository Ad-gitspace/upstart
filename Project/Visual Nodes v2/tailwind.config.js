/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            // Custom animations for the space theme
            animation: {
                'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
            },
            keyframes: {
                'glow-pulse': {
                    '0%, 100%': { filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.8))' },
                    '50%': { filter: 'drop-shadow(0 0 16px rgba(255,255,255,1))' },
                },
            },
        },
    },
    plugins: [],
}
