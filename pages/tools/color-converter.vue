<template>
  <div class="container mx-auto p-6">
    <BaseConverter
      :title="$t('pages.colorConverter.title')"
      icon="i-heroicons-swatch"
    >
      <template #inputs>
        <div class="space-y-6">
          <!-- 기본 색상 포맷 (불투명) -->
          <div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ConverterCard
                :model-value="store.hexValue"
                title="HEX"
                :placeholder="$t('pages.colorConverter.hexPlaceholder')"
                badge="HEX"
                badge-color="blue"
                :copyable="true"
                @update:model-value="store.setHexValue"
              />
              
              <ConverterCard
                :model-value="store.rgbValue"
                title="RGB"
                :placeholder="$t('pages.colorConverter.rgbPlaceholder')"
                badge="RGB"
                badge-color="green"
                :copyable="true"
                @update:model-value="store.setRgbValue"
              />
              
              <ConverterCard
                :model-value="store.hslValue"
                title="HSL"
                :placeholder="$t('pages.colorConverter.hslPlaceholder')"
                badge="RGB"
                badge-color="purple"
                :copyable="true"
                @update:model-value="store.setHslValue"
              />
            </div>
          </div>
        </div>
      </template>

      <template #preview>
        <div class="flex flex-col items-center space-y-4">
          <h3 class="text-lg font-semibold">{{ $t('pages.colorConverter.preview') }}</h3>
          <div class="relative">
            <!-- 숨겨진 네이티브 컬러 피커 -->
            <input
              ref="colorPickerInput"
              type="color"
              :value="store.previewColor"
              @input="onDirectColorChange"
              class="absolute opacity-0 w-32 h-32 cursor-pointer"
            />
            <!-- 미리보기 박스 -->
            <div 
              class="w-32 h-32 rounded-lg border-2 border-gray-200 shadow-md transition-all duration-200 cursor-pointer hover:scale-105 hover:shadow-lg relative group"
              :style="{ backgroundColor: store.previewColor }"
              @click="openColorPicker"
            >
              <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 rounded-lg flex items-center justify-center transition-all duration-200">
                <UIcon 
                  name="i-heroicons-swatch" 
                  class="text-white text-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                />
              </div>
            </div>
          </div>
          <div class="text-center">
            <p class="text-sm text-gray-600">{{ $t('pages.colorConverter.currentColor') }}</p>
            <p class="font-mono font-medium">{{ store.previewColor }}</p>
            <p class="text-xs text-gray-500 mt-1">{{ $t('pages.colorConverter.clickToSelect') }}</p>
          </div>
        </div>
      </template>

      <template #results>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <UCard>
            <h4 class="font-semibold mb-2">{{ $t('pages.colorConverter.colorInfo') }}</h4>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span>{{ $t('pages.colorConverter.brightness') }}:</span>
                <span>{{ store.colorInfo.brightness }}%</span>
              </div>
              <div class="flex justify-between">
                <span>{{ $t('pages.colorConverter.saturation') }}:</span>
                <span>{{ store.colorInfo.saturation }}%</span>
              </div>
              <div class="flex justify-between">
                <span>{{ $t('pages.colorConverter.luminance') }}:</span>
                <span>{{ store.colorInfo.luminance }}</span>
              </div>
              <div class="flex justify-between">
                <span>{{ $t('pages.colorConverter.transparency') }}:</span>
                <span>{{ Math.round(store.colorInfo.alpha * 100) }}%</span>
              </div>
            </div>
          </UCard>

          <UCard>
            <h4 class="font-semibold mb-2">{{ $t('pages.colorConverter.webSafeColor') }}</h4>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span>{{ $t('pages.colorConverter.webSafe') }}:</span>
                <UBadge :color="store.colorInfo.isWebSafe ? 'green' : 'red'">
                  {{ store.colorInfo.isWebSafe ? $t('pages.colorConverter.yes') : $t('pages.colorConverter.no') }}
                </UBadge>
              </div>
              <div class="flex justify-between">
                <span>{{ $t('pages.colorConverter.contrastWhite') }}:</span>
                <span>{{ store.colorInfo.contrastWhite }}:1</span>
              </div>
              <div class="flex justify-between">
                <span>{{ $t('pages.colorConverter.contrastBlack') }}:</span>
                <span>{{ store.colorInfo.contrastBlack }}:1</span>
              </div>
            </div>
          </UCard>
        </div>
      </template>
    </BaseConverter>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()

useSeoMeta({
  title: t('pages.colorConverter.seo.title', '무료 색상 변환기 | HEX ↔ RGB ↔ HSL 변환 도구 - ConvertStack'),
  description: t('pages.colorConverter.seo.description', 'HEX, RGB, HSL, RGBA, HSLA 색상 코드를 실시간으로 변환하는 무료 온라인 도구입니다. 색상 미리보기, 대비율 계산, 웹 안전 색상 확인 기능을 제공합니다.'),
  keywords: 'HEX RGB 변환, 색상변환기, HEX to RGB, RGB to HSL, 색상코드변환, 컬러피커, 색상도구, 무료색상변환',
  ogTitle: '무료 색상 변환기 | HEX ↔ RGB ↔ HSL 변환 도구 - ConvertStack',
  ogDescription: 'HEX, RGB, HSL 색상 코드를 실시간으로 변환하는 무료 온라인 도구입니다.',
  ogImage: '/og-color-converter.png',
  ogUrl: 'https://converter.example.com/tools/color-converter',
  twitterCard: 'summary_large_image',
  twitterTitle: '무료 색상 변환기 | HEX ↔ RGB ↔ HSL 변환',
  twitterDescription: 'HEX, RGB, HSL 색상 코드를 실시간으로 변환하는 무료 온라인 도구입니다.',
  twitterImage: '/og-color-converter.png'
})

// Schema.org 구조화 데이터
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "색상 변환기",
        "applicationCategory": "UtilityApplication",
        "description": "HEX, RGB, HSL 색상 코드를 실시간으로 변환하는 무료 온라인 도구",
        "url": "https://converter.example.com/tools/color-converter",
        "operatingSystem": "Web",
        "permissions": "무료 사용",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "KRW"
        },
        "author": {
          "@type": "Organization",
          "name": "ConvertStack"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.8",
          "ratingCount": "150"
        },
        "featureList": [
          "HEX to RGB 변환",
          "RGB to HSL 변환",
          "실시간 색상 미리보기",
          "색상 대비율 계산",
          "웹 안전 색상 확인",
          "투명도 지원 (RGBA, HSLA)"
        ]
      })
    }
  ]
})

const store = useColorConverterStore()
const colorPickerInput = ref<HTMLInputElement>()

const openColorPicker = () => {
  colorPickerInput.value?.click()
}

const onDirectColorChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  store.setColorFromPicker(target.value.toUpperCase())
}

onMounted(() => {
  store.initialize()
})
</script>