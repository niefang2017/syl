// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: ['@nuxt/ui-pro'],

  modules: [
    '@nuxt/content',
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/image',
    '@nuxt/ui',
    '@nuxthq/studio',
    '@vueuse/nuxt',
    'nuxt-og-image',
    "@nuxtjs/i18n",
    "@nuxtjs/tailwindcss",
    // "@nuxt/icon"
  ],
  // icon: {
  //   provider: 'server',
  //   serverBundle: {
  //     collections: ['heroicons', 'simple-icons'] // <!--- this
  //   },
  //   customCollections: [
  //     {
  //       prefix: 'my-icon',
  //       dir: './app/assets/icons'
  //     },
  //   ],
  // },
  i18n: {
    vueI18n: './i18n.config.ts' // if you are using custom path, default
  },
  css: ['~/assets/css/tailwind.css',"animate.css"],
  tailwindcss: {
  },

  hooks: {
    // Define `@nuxt/ui` components as global to use them in `.md` (feel free to add those you need)
    'components:extend': (components) => {
      const globals = components.filter(c => ['UButton'].includes(c.pascalName))

      globals.forEach(c => c.global = true)
    }
  },

  ui: {
    icons: ['heroicons', 'simple-icons']
  },

  colorMode: {
    disableTransition: true
  },

  routeRules: {
    // Temporary workaround for prerender regression. see https://github.com/nuxt/nuxt/issues/27490
    '/': { prerender: true },
    '/api/search.json': { prerender: true },
    '/docs': { redirect: '/docs/getting-started', prerender: false }
  },

  devtools: {
    enabled: true
  },

  typescript: {
    strict: false
  },

  future: {
    compatibilityVersion: 4
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },

  compatibilityDate: '2024-07-11'
})
