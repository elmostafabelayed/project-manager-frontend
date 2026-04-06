/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#185FA5',
        'primary-dark': '#0C447C',
        'primary-light': '#E6F1FB',
        success: '#1D9E75',
        'success-light': '#E1F5EE',
        danger: '#E24B4A',
        'danger-light': '#FCEBEB',
        jobsy: '#172A39',
      },
    },
  },
  plugins: [],
}