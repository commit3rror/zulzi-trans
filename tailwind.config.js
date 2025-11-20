
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./resources/**/*.blade.php",
    "./resources/**/*.js",
    "./resources/**/*.jsx", // [PENTING] Pastikan ekstensi .jsx ada di sini!
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}