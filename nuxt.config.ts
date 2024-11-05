// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: false,
  app: {
    head: {
      title: process.env.TITLE,
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: process.env.DESCRIPTION },
        { name: 'format-detection', content: 'telephone=no' }
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/b-care.png' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap' }
      ]
    }
  },
  runtimeConfig: {
    public: {
      title: process.env.TITLE,
      apiBaseUrl: process.env.API_BASE_URL,
      firebaseConfig: {
        apiKey: process.env.FIREBASE_API_KEY,
        authDomain: process.env.FIREBASE_AUTH_DOMAIN,
        projectId: process.env.FIREBASE_PROJECT_ID,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.FIREBASE_APP_ID,
        databaseURL: process.env.FIREBASE_DATABASE_URL
      },
      fcmVapidKey: process.env.FIREBASE_VAPID_KEY,
      reCaptchaSiteKey: process.env.RECAPTCHA_SITE_KEY,
      roleFromFirebase: process.env.ROLE_FROM_FIREBASE,
      host: process.env.HOST,
      cookieMaxAge: process.env.COOKIE_MAX_AGE
    }
  },
  modules: [
    '@nuxtjs/tailwindcss',
    'nuxt-icon',
    '@pinia/nuxt'
    // https://nuxt.com/modules/eslint
    // '@nuxtjs/eslint-module'
  ],
  css: ['@/assets/main.less']

  // loading: '~/components/Loading.vue'
})
