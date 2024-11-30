import defaultTheme from 'tailwindcss/defaultTheme'

export default {
  theme: {
    extend: {
      colors: {
        primary: defaultTheme.colors.green,
        transparent: 'transparent',
        current: 'currentColor',
        // general colors 
        dark: 'rgb(256,256,256)',
        light: 'rgb(30,30,30)',
        white: 'rgb(256,256,256)',
        gray: 'rgb(128,128,128)',
        backdark: 'rgb(256,256,256)',
        backlight: 'rgb(30,30,30)',
      },
      spacing: {
        '128': '32rem',
        '256': '64rem',
      }
    }
  },
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
    "./node_modules/flowbite/**/*.{js,ts}"
  ],

  plugins: [
  require('tailwindcss-animated')
  ],
}