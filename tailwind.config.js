/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './assets/**/*.{vue,js,css}',
    './components/**/*.{vue,js}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './utils/**/*.{js,ts}',
    './nuxt.config.{js,ts}'
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#193261',
          100: '#F6F8FB',
          200: '#A9BAD9',
          300: '#7F98C7',
          400: '#5475B4',
          500: '#2953A1',
          600: '#214281',
          700: '#193261'
        },
        secondary: {
          DEFAULT: '#FCB700',
          text: '#ABA5A2', // Teks Secondary
          100: '#FEF1CC',
          200: '#FEE299',
          300: '#FDD466',
          400: '#FDC533',
          500: '#FCB700',
          600: '#CA9200',
          700: '#976E00',
          800: '#654900',
          900: '#322500'
        },
        neutral: {
          DEFAULT: '#444444',
          100: '#FFFFFF',
          200: '#FAFAFA',
          300: '#B4B4B4',
          400: '#8F8F8F',
          500: '#696969',
          600: '#444444',
          700: '#333333'
        },
        stroke: {
          DEFAULT: '#E2E8F0'
        },
        success: {
          DEFAULT: '#00B894',
          100: '#CCF1EA',
          200: '#99E3D4',
          300: '#66D4BF',
          400: '#00B894',
          500: '#009376',
          600: '#006E59',
          700: '#004A3B'
        },
        error: {
          DEFAULT: '#C01048',
          100: '#F8D0D8',
          200: '#F1A1B1',
          300: '#EA728A',
          400: '#C01048',
          500: '#B01030',
          600: '#840C24',
          700: '#580818'
        }
      }
    }
  },
  plugins: []
}
