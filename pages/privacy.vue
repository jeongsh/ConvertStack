<template>
  <div class="container mx-auto px-6 py-8">
    <div class="flex gap-20 max-w-8xl mx-auto">
      <!-- 좌측 사이드바 광고 -->
      <!-- <div class="hidden xl:block w-40 flex-shrink-0">
        <div class="sticky top-6">
          <GoogleAd type="sidebar" width="160px" height="600px" />
        </div>
      </div> -->

      <!-- 메인 콘텐츠 -->
      <div class="flex-1 min-w-0">
        <div class="max-w-4xl mx-auto">
          <div class="text-center mb-12">
            <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {{ t('privacy.title') }}
            </h1>
            <p class="text-lg text-gray-600 dark:text-gray-300">
              {{ t('privacy.subtitle') }}
            </p>
          </div>

          <div class="space-y-8">
            <!-- 핵심 원칙 -->
            <UCard>
              <div class="p-6">
                <div class="flex items-center mb-4">
                  <UIcon name="i-heroicons-shield-check" class="text-3xl text-green-500 mr-3" />
                  <h2 class="text-2xl font-semibold">{{ t('privacy.coreTitle') }}</h2>
                </div>
                <div class="grid md:grid-cols-3 gap-6">
                  <div class="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <UIcon name="i-heroicons-computer-desktop" class="text-2xl text-green-600 mb-2" />
                    <h3 class="font-semibold mb-2">{{ t('privacy.localProcessing') }}</h3>
                    <p class="text-sm text-gray-600 dark:text-gray-300">{{ t('privacy.localProcessingDesc') }}</p>
                  </div>
                  <div class="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <UIcon name="i-heroicons-no-symbol" class="text-2xl text-blue-600 mb-2" />
                    <h3 class="font-semibold mb-2">{{ t('privacy.noServerTransfer') }}</h3>
                    <p class="text-sm text-gray-600 dark:text-gray-300">{{ t('privacy.noServerTransferDesc') }}</p>
                  </div>
                  <div class="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                    <UIcon name="i-heroicons-trash" class="text-2xl text-purple-600 mb-2" />
                    <h3 class="font-semibold mb-2">{{ t('privacy.autoDelete') }}</h3>
                    <p class="text-sm text-gray-600 dark:text-gray-300">{{ t('privacy.autoDeleteDesc') }}</p>
                  </div>
                </div>
              </div>
            </UCard>

            <!-- 데이터 보안 -->
            <UCard>
              <div class="p-6">
                <div class="flex items-center mb-4">
                  <UIcon name="i-heroicons-lock-closed" class="text-3xl text-blue-500 mr-3" />
                  <h2 class="text-2xl font-semibold">{{ t('privacy.dataSecurityTitle') }}</h2>
                </div>
                <div class="space-y-4">
                  <div class="flex items-start">
                    <UIcon name="i-heroicons-check-circle" class="text-green-500 mt-1 mr-3" />
                    <div>
                      <h3 class="font-semibold mb-1">{{ t('privacy.clientSideTitle') }}</h3>
                      <p class="text-gray-600 dark:text-gray-300">{{ t('privacy.clientSideDesc') }}</p>
                    </div>
                  </div>
                  <div class="flex items-start">
                    <UIcon name="i-heroicons-check-circle" class="text-green-500 mt-1 mr-3" />
                    <div>
                      <h3 class="font-semibold mb-1">{{ t('privacy.memoryBasedTitle') }}</h3>
                      <p class="text-gray-600 dark:text-gray-300">{{ t('privacy.memoryBasedDesc') }}</p>
                    </div>
                  </div>
                  <div class="flex items-start">
                    <UIcon name="i-heroicons-check-circle" class="text-green-500 mt-1 mr-3" />
                    <div>
                      <h3 class="font-semibold mb-1">{{ t('privacy.httpsTitle') }}</h3>
                      <p class="text-gray-600 dark:text-gray-300">{{ t('privacy.httpsDesc') }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </UCard>

            <!-- 수집하지 않는 정보 -->
            <UCard>
              <div class="p-6">
                <div class="flex items-center mb-4">
                  <UIcon name="i-heroicons-eye-slash" class="text-3xl text-red-500 mr-3" />
                  <h2 class="text-2xl font-semibold">{{ t('privacy.notCollectedTitle') }}</h2>
                </div>
                <div class="grid md:grid-cols-2 gap-4">
                  <div class="space-y-3">
                    <div class="flex items-center">
                      <UIcon name="i-heroicons-x-mark" class="text-red-500 mr-2" />
                      <span>{{ t('privacy.uploadedFiles') }}</span>
                    </div>
                    <div class="flex items-center">
                      <UIcon name="i-heroicons-x-mark" class="text-red-500 mr-2" />
                      <span>{{ t('privacy.convertedFiles') }}</span>
                    </div>
                    <div class="flex items-center">
                      <UIcon name="i-heroicons-x-mark" class="text-red-500 mr-2" />
                      <span>{{ t('privacy.fileMetadata') }}</span>
                    </div>
                  </div>
                  <div class="space-y-3">
                    <div class="flex items-center">
                      <UIcon name="i-heroicons-x-mark" class="text-red-500 mr-2" />
                      <span>{{ t('privacy.personalInfo') }}</span>
                    </div>
                    <div class="flex items-center">
                      <UIcon name="i-heroicons-x-mark" class="text-red-500 mr-2" />
                      <span>{{ t('privacy.loginInfo') }}</span>
                    </div>
                    <div class="flex items-center">
                      <UIcon name="i-heroicons-x-mark" class="text-red-500 mr-2" />
                      <span>{{ t('privacy.cookieData') }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </UCard>

            <!-- 웹 분석 -->
            <UCard>
              <div class="p-6">
                <div class="flex items-center mb-4">
                  <UIcon name="i-heroicons-chart-bar" class="text-3xl text-orange-500 mr-3" />
                  <h2 class="text-2xl font-semibold">{{ t('privacy.analyticsTitle') }}</h2>
                </div>
                <div class="space-y-4">
                  <div class="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                    <div class="flex items-start">
                      <UIcon name="i-heroicons-information-circle" class="text-yellow-600 mt-1 mr-3" />
                      <div>
                        <h3 class="font-semibold mb-1">{{ t('privacy.analyticsSubtitle') }}</h3>
                        <p class="text-gray-600 dark:text-gray-300 text-sm">
                          {{ t('privacy.analyticsDesc') }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </UCard>

            <!-- 광고 -->
            <UCard>
              <div class="p-6">
                <div class="flex items-center mb-4">
                  <UIcon name="i-heroicons-megaphone" class="text-3xl text-indigo-500 mr-3" />
                  <h2 class="text-2xl font-semibold">{{ t('privacy.adsTitle') }}</h2>
                </div>
                <div class="space-y-4">
                  <p class="text-gray-600 dark:text-gray-300">
                    {{ t('privacy.adsDesc') }}
                  </p>
                  <div class="space-y-3">
                    <div class="flex items-start">
                      <UIcon name="i-heroicons-check-circle" class="text-green-500 mt-1 mr-3" />
                      <div>
                        <h3 class="font-semibold mb-1">{{ t('privacy.targetedAdsTitle') }}</h3>
                        <p class="text-gray-600 dark:text-gray-300 text-sm">{{ t('privacy.targetedAdsDesc') }}</p>
                      </div>
                    </div>
                    <div class="flex items-start">
                      <UIcon name="i-heroicons-check-circle" class="text-green-500 mt-1 mr-3" />
                      <div>
                        <h3 class="font-semibold mb-1">{{ t('privacy.cookieUsageTitle') }}</h3>
                        <p class="text-gray-600 dark:text-gray-300 text-sm">{{ t('privacy.cookieUsageDesc') }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </UCard>

            <!-- 연락처 -->
            <!-- <UCard>
              <div class="p-6">
                <div class="flex items-center mb-4">
                  <UIcon name="i-heroicons-envelope" class="text-3xl text-green-500 mr-3" />
                  <h2 class="text-2xl font-semibold">{{ t('privacy.contactTitle') }}</h2>
                </div>
                <p class="text-gray-600 dark:text-gray-300 mb-4">
                  {{ t('privacy.contactDesc') }}
                </p>
                <div class="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <div class="flex items-center">
                    <UIcon name="i-heroicons-at-symbol" class="text-gray-500 mr-2" />
                    <span class="text-gray-700 dark:text-gray-300">privacy@convertstack.com</span>
                  </div>
                </div>
              </div>
            </UCard> -->

            <!-- 마지막 업데이트 -->
            <!-- <div class="text-center text-sm text-gray-500 mt-8">
              {{ t('privacy.lastUpdated') }}
            </div> -->
          </div>
        </div>
      </div>

      <!-- 우측 사이드바 광고 -->
      <!-- <div class="hidden xl:block w-40 flex-shrink-0">
        <div class="sticky top-6">
          <GoogleAd type="sidebar" width="160px" height="600px" />
        </div>
      </div> -->
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()

// SEO 메타 데이터 설정
useSeoMeta({
  title: () => `ConvertStack - ${t('privacy.title')}`,
  description: () => t('privacy.subtitle'),
  keywords: () => 'privacy policy, data protection, file security, local processing, ConvertStack',
  ogTitle: () => `ConvertStack - ${t('privacy.title')}`,
  ogDescription: () => t('privacy.subtitle'),
  ogImage: '/og-privacy.png',
  ogUrl: 'https://converter.example.com/privacy',
  twitterCard: 'summary_large_image',
  twitterTitle: () => `ConvertStack - ${t('privacy.title')}`,
  twitterDescription: () => t('privacy.subtitle'),
  twitterImage: '/og-privacy.png'
})

// Schema.org 구조화 데이터
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": t('privacy.title') + " - ConvertStack",
        "description": t('privacy.subtitle'),
        "url": "https://converter.example.com/privacy",
        "author": {
          "@type": "Organization",
          "name": "ConvertStack"
        },
        "publisher": {
          "@type": "Organization",
          "name": "ConvertStack"
        },
        "mainEntity": {
          "@type": "Article",
          "headline": t('privacy.title'),
          "description": t('privacy.subtitle'),
          "datePublished": "2024-09-04",
          "dateModified": "2024-09-04"
        }
      })
    }
  ]
})
</script>
