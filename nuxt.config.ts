export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxt/ui', '@nuxt/icon', '@pinia/nuxt', '@nuxtjs/sitemap', '@nuxtjs/robots', '@nuxtjs/i18n'],
  css: ['~/assets/css/main.css'],
  ssr: false, // CSR 모드
  nitro: {
    preset: 'static'  // Netlify function 말고 정적 모드
  },
  // Tailwind CSS 설정
  tailwindcss: {
    config: {
      theme: {
        extend: {
          colors: {
            primary: {
              50: 'rgb(236 253 245)',
              100: 'rgb(209 250 229)',
              200: 'rgb(167 243 208)',
              300: 'rgb(110 231 183)',
              400: 'rgb(52 211 153)',
              500: 'rgb(16 185 129)',
              600: 'rgb(5 150 105)',
              700: 'rgb(4 120 87)',
              800: 'rgb(6 95 70)',
              900: 'rgb(6 78 59)',
              950: 'rgb(2 44 34)',
            },
            gray: {
              50: 'rgb(250 250 250)',
              100: 'rgb(245 245 245)',
              200: 'rgb(229 229 229)',
              300: 'rgb(212 212 212)',
              400: 'rgb(163 163 163)',
              500: 'rgb(115 115 115)',
              600: 'rgb(82 82 82)',
              700: 'rgb(64 64 64)',
              800: 'rgb(38 38 38)',
              900: 'rgb(23 23 23)',
              950: 'rgb(10 10 10)',
            }
          }
        }
      }
    }
  },
  
  // Nuxt UI 색상 설정
  colorMode: {
    preference: 'system',
    fallback: 'light'
  },
  
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
    strategy: 'prefix'
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
        { rel: 'canonical', href: 'https://converter.example.com' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { 
          rel: 'stylesheet', 
          href: 'https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700&family=Noto+Sans+JP:wght@300;400;500;600;700&family=Noto+Sans+SC:wght@300;400;500;600;700&family=Noto+Sans:wght@300;400;500;600;700&display=swap'
        }
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