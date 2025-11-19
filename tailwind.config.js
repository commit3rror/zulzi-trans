/** @type {import('tailwindcss').Config} */
export default {
  // Tentukan di mana Tailwind harus mencari class
  content: [
    "./resources/**/*.blade.php",
    "./resources/**/*.js",
    "./resources/**/*.jsx", 
    "./resources/**/*.tsx",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Menggunakan Montserrat sebagai font utama
        sans: ['Montserrat', ...defaultTheme.fontFamily.sans], 
      },
    },
  },
  plugins: [],
}