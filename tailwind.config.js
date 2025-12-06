/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          pink: '#FFD3E7',
          dark: '#A72761',
        },
        input: {
          bg: '#F7F8F9',
          border: '#E8ECF4',
          text: '#1E232C',
          placeholder: '#8391A1',
        }
      },
      fontFamily: {
        gurajada: ['Gurajada', 'serif'],
        urbanist: ['Urbanist', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
