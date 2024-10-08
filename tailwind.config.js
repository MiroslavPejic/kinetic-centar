// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        'custom-teal': '#54c2be',  // Custom teal color for the background
        'custom-teal-dark': '#41a2a1', // Darker teal color for hover
        'custom-text': '#313e48',  // Custom text color
        'custom-blue': '#002f46'
      },
      backgroundImage: {
        'login-pattern': "url('/src/assets/images/physiotherapy_clinic_background.png')"
      }
    },
  },
  plugins: [],
}
