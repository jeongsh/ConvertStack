<template>
  <div class="w-full">
    <!-- 모바일/태블릿 상단 광고 -->
    <div v-show="!isDesktop" class="mb-6">
      <GoogleAd 
        type="banner" 
        width="100%" 
        height="90px" 
        ad-slot="1234567890"
      />
    </div>

    <!-- 데스크탑 레이아웃 -->
    <div class="flex gap-6 xl:gap-8 max-w-8xl mx-auto">
      <!-- 좌측 사이드바 광고 (데스크탑) -->
      <div v-show="isDesktop" class="w-40 flex-shrink-0">
        <div class="sticky top-6">
          <GoogleAd 
            type="sidebar" 
            width="160px" 
            height="600px" 
            ad-slot="0987654321"
          />
        </div>
      </div>

      <!-- 메인 콘텐츠 -->
      <div class="flex-1 min-w-0">
        <UCard class="w-full max-w-4xl mx-auto">
          <template #header>
            <div class="flex items-center gap-3">
              <UIcon :name="icon" class="text-2xl text-gray-900 dark:text-gray-100" />
              <h1 class="text-xl xl:text-2xl font-bold text-gray-900 dark:text-gray-100">{{ title }}</h1>
            </div>
          </template>

          <div class="space-y-6">
            <slot name="upload-area" />
            
            <slot name="inputs" />
            
            <div v-if="$slots.preview" class="border-t pt-6">
              <slot name="preview" />
            </div>
            
            <div v-if="$slots.results" class="border-t pt-6">
              <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">{{ t('common.result') }}</h3>
              <slot name="results" />
            </div>
            
            <slot name="main-content" />
          </div>
        </UCard>

        <!-- 모바일/태블릿 하단 광고 -->
        <div v-show="!isDesktop" class="mt-6">
          <GoogleAd 
            type="responsive" 
            width="100%" 
            height="90px" 
            ad-slot="1111111111"
          />
        </div>
      </div>

      <!-- 우측 사이드바 광고 (데스크탑) -->
      <div v-show="isDesktop" class="w-40 flex-shrink-0">
        <div class="sticky top-6">
          <GoogleAd 
            type="sidebar" 
            width="160px" 
            height="600px" 
            ad-slot="2222222222"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()

interface Props {
  title: string
  icon: string
}

defineProps<Props>()

// 화면 크기 감지 (반응형 대응)
const isDesktop = ref(false)

const checkScreenSize = () => {
  if (typeof window !== 'undefined') {
    isDesktop.value = window.innerWidth >= 1280 // xl 브레이크포인트
  }
}

onMounted(() => {
  checkScreenSize()
  window.addEventListener('resize', checkScreenSize)
})

onBeforeUnmount(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', checkScreenSize)
  }
})
</script>