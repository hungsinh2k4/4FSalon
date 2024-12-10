// /** @type {import('tailwindcss').Config} */
// export default {
//   content: [],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// }

// module.exports = {
//   content: [
//     "./index.html",
//     "./src/**/*.{js,ts,jsx,tsx}",
//   ],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// }
const flowbite = require("flowbite-react/tailwind");

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    flowbite.content()
  ],
  theme: {
    extend: {
      colors: {
        primary: 'hsl(194, 50%, 90%)',
        secondary: 'hsl(194, 50%, 10%)',
        tertiary: 'hsl(254, 80%, 20%)',
        accent: 'hsl(134, 80%, 20%)',
      },
    },
  },
  
  plugins: [
    flowbite.plugin(),
  ],
}