/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                // You can add your custom colors here if they were in the v4 CSS theme block
            },
        },
    },
    plugins: [],
}
