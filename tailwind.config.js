/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
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
        gurajada: ['Gurajada_400Regular'],
        urbanist: ['Urbanist_400Regular', 'Urbanist_500Medium', 'Urbanist_600SemiBold', 'Urbanist_700Bold'],
        poppins: ['Poppins_400Regular', 'Poppins_600SemiBold'],
      }
    },
  },
  plugins: [],
}
