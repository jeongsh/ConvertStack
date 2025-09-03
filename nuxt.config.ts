export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxt/ui', '@nuxt/icon', '@pinia/nuxt', '@nuxtjs/sitemap', '@nuxtjs/robots', '@nuxtjs/i18n'],
  css: ['~/assets/css/main.css'],
  
  // 다국어 설정
  i18n: {
    locales: [
      {
        code: 'ko',
        iso: 'ko-KR',
        name: '한국어',
        file: 'ko.json'
      },
      {
        code: 'en',
        iso: 'en-US',
        name: 'English',
        file: 'en.json'
      },
      {
        code: 'ja',
        iso: 'ja-JP',
        name: '日本語',
        file: 'ja.json'
      },
      {
        code: 'zh',
        iso: 'zh-CN',
        name: '中文',
        file: 'zh.json'
      }
    ],
    langDir: 'locales',
    defaultLocale: 'en',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
      alwaysRedirect: false,
      fallbackLocale: 'en'
    },
    strategy: 'prefix_except_default'
  },
  
  icon: {
    serverBundle: 'auto'
  },
  
  // SEO 기본 설정
  app: {
    head: {
      title: 'ConvertStack | 무료 온라인 변환기',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: '색상 변환기, 단위 변환기 등 다양한 무료 온라인 도구를 제공합니다. HEX, RGB, HSL 색상 변환 및 길이, 무게, 온도 단위 변환을 간편하게 이용하세요.' },
        { name: 'keywords', content: '색상변환기, 단위변환기, HEX RGB 변환, 길이변환, 무게변환, 온도변환, 온라인도구, 무료도구' },
        { name: 'author', content: 'ConvertStack' },
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: 'ConvertStack | 무료 온라인 변환기' },
        { property: 'og:description', content: '색상 변환기, 단위 변환기 등 다양한 무료 온라인 도구를 제공합니다.' },
        { property: 'og:image', content: '/og-image.png' },
        { property: 'og:url', content: 'https://converter.example.com' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'ConvertStack | 무료 온라인 변환기' },
        { name: 'twitter:description', content: '색상 변환기, 단위 변환기 등 다양한 무료 온라인 도구를 제공합니다.' },
        { name: 'twitter:image', content: '/og-image.png' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'canonical', href: 'https://converter.example.com' }
      ]
    }
  },

  // Nitro 설정 (sitemap과 robots를 위한)
  nitro: {
    prerender: {
      routes: ['/sitemap.xml', '/robots.txt']
    }
  },

  // Runtime config
  runtimeConfig: {
    public: {
      siteUrl: 'https://converter.example.com'
    }
  }
})