// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: true,

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/content',
    '@nuxtjs/color-mode',
    '@element-plus/nuxt',
    '@nuxt/image',
    '@stefanobartoletti/nuxt-social-share',
    'nuxt-lazy-load'
  ],

  content: {
    // https://content.nuxtjs.org/api/configuration
    documentDriven: true,
    experimental: {
      search: {
        ignoredTags: [],
        filterQuery: { /* your query here */ },
      },
    },
  },

  image: {
    // Options
    inject: true,
    format: ['jpeg'],
    // The screen sizes predefined by `@nuxt/image`:
    screens: {
      'xs': 320,
      'sm': 640,
      'md': 768,
      'lg': 1024,
      'xl': 1280,
      'xxl': 1536,
      '2xl': 1536
    },
    presets: {
      cover: {
        modifiers: {
          fit: 'cover',
          format: 'jpg',
          width: 300,
          height: 300,
        },
      },
    },
  },

  plugins: [
    '@/plugins/global-components.js',
  ],

  lazyLoad: {
    // These are the default values
    images: true,
    videos: true,
    audios: true,
    iframes: true,
    native: false,
    directiveOnly: false,
  },
    
  css: [
    '~/assets/styles/colormode.css',
    '~/assets/styles/styles.css',
    '~/assets/styles/fonts.css',
    '~/assets/styles/transitions.css',
    '~/assets/styles/masonry.css'
  ],

  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
    }
  },

  // module options
  socialShare: {
    baseUrl: 'https://bpdecapstudents.netlify.app', // required!
    // other optional module options
    styled: false,
    label: true,
  },
  
  devtools: { enabled: true },
  compatibilityDate: '2024-08-30'
})