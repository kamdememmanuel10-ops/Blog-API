/** @type {import('tailwindcss').config} */
export default {
     content: [
          "./index.html",
          "./src/**/*.{js,ts,jsx,tsx}",
     ],
     theme: {
          extend: {
               colors: {
                    dark: '#0d0d0d',
                    surface: '#161616',
                    accent: '#2196F3',

               },
          },
     },
     plugins: [],
}