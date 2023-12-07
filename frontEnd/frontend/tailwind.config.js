/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      width: ['important'],
      smmax: { max: '540px' }, // Define a custom breakpoint 'sm-max' for max-width: 400px

    },
  },
  plugins: [],
}

