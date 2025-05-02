/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",   // Inclua todos os arquivos relevantes para a análise do Tailwind
    "./components/**/*.{js,ts,jsx,tsx}", // Se você tiver pastas de componentes
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
