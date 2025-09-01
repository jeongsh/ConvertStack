<template>
  <div class="container mx-auto px-6 max-w-4xl">
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
        소개
      </h1>
      <p class="text-lg text-gray-600 dark:text-gray-300">
        ConvertStack에 대해 알아보세요
      </p>
    </div>

    <div class="space-y-8">
      <UCard>
        <div class="p-6">
          <h2 class="text-2xl font-semibold mb-4">프로젝트 소개</h2>
          <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
            ConvertStack은 개발자와 디자이너들이 일상적으로 사용하는 변환 작업들을 
            빠르고 정확하게 수행할 수 있도록 도와주는 웹 기반 도구 모음입니다.
            복잡한 소프트웨어 설치 없이 브라우저에서 바로 사용할 수 있습니다.
          </p>
        </div>
      </UCard>

      <UCard>
        <div class="p-6">
          <h2 class="text-2xl font-semibold mb-4">기술 스택</h2>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="text-center">
              <div class="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg mb-2">
                <UIcon name="i-logos-nuxt-icon" class="text-2xl" />
              </div>
              <span class="text-sm font-medium">Nuxt 3</span>
            </div>
            <div class="text-center">
              <div class="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg mb-2">
                <UIcon name="i-logos-tailwindcss-icon" class="text-2xl" />
              </div>
              <span class="text-sm font-medium">TailwindCSS</span>
            </div>
            <div class="text-center">
              <div class="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg mb-2">
                <UIcon name="i-logos-vue" class="text-2xl" />
              </div>
              <span class="text-sm font-medium">Vue 3</span>
            </div>
            <div class="text-center">
              <div class="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg mb-2">
                <UIcon name="i-logos-typescript-icon" class="text-2xl" />
              </div>
              <span class="text-sm font-medium">TypeScript</span>
            </div>
          </div>
        </div>
      </UCard>

      <UCard>
        <div class="p-6">
          <h2 class="text-2xl font-semibold mb-4">현재 지원되는 도구</h2>
          <div class="space-y-4">
            <div class="flex items-center gap-3">
              <UIcon name="i-heroicons-swatch" class="text-blue-500" />
              <div>
                <h3 class="font-semibold">색상 변환기</h3>
                <p class="text-sm text-gray-600 dark:text-gray-300">
                  HEX, RGB, HSL 색상 형식 간의 실시간 변환 및 미리보기
                </p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <UIcon name="i-heroicons-calculator" class="text-green-500" />
              <div>
                <h3 class="font-semibold">단위 변환기</h3>
                <p class="text-sm text-gray-600 dark:text-gray-300">
                  길이, 무게, 온도, 속도 등 7가지 단위 유형의 정확한 변환
                </p>
              </div>
            </div>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: '소개 | ConvertStack - 프로젝트 정보',
  description: 'ConvertStack 프로젝트 소개, 기술 스택(Nuxt 3, Vue 3, TypeScript), 지원되는 변환 도구들에 대한 정보를 확인하세요.',
  keywords: '프로젝트소개, 기술스택, Nuxt 3, Vue 3, TypeScript, 온라인도구개발',
  ogTitle: '소개 | ConvertStack - 프로젝트 정보',
  ogDescription: 'ConvertStack 프로젝트 소개 및 기술 스택 정보',
  ogImage: '/og-about.png',
  ogUrl: 'https://converter.example.com/about',
  twitterCard: 'summary_large_image'
})

// Schema.org 구조화 데이터
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "AboutPage",
        "name": "ConvertStack 소개",
        "description": "ConvertStack 프로젝트에 대한 상세 정보",
        "url": "https://converter.example.com/about",
        "mainEntity": {
          "@type": "SoftwareApplication",
          "name": "ConvertStack",
          "applicationCategory": "UtilityApplication",
          "operatingSystem": "Web",
          "programmingLanguage": [
            "TypeScript",
            "Vue.js",
            "Nuxt.js"
          ],
          "author": {
            "@type": "Organization",
            "name": "ConvertStack 개발팀"
          }
        }
      })
    }
  ]
})
</script>