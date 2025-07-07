/** @type {import('tailwindcss').Config} */
export default {
  content: ["./client/src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4285F4',
          50: '#E8F0FE',
          100: '#D2E3FC',
          500: '#4285F4',
          600: '#1A73E8',
          700: '#1557B0',
        },
        maternity: {
          DEFAULT: '#34A853',
          50: '#E6F4EA',
          500: '#34A853',
          700: '#137333',
        },
        parental: {
          DEFAULT: '#1A73E8',
          50: '#E8F0FE',
          500: '#1A73E8',
          700: '#1557B0',
        },
        recommended: {
          DEFAULT: '#9C27B0',
          50: '#F3E5F5',
          500: '#9C27B0',
          700: '#7B1FA2',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}