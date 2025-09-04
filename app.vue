<template>
  <div>
    <!-- 전역 로딩 화면 -->
    <div v-if="pending" class="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-black">
      <div class="text-center space-y-4">
        <!-- 로딩 스피너 -->
        <div class="relative">
          <div class="w-16 h-16 border-4 border-gray-200 dark:border-gray-800 rounded-full animate-spin mx-auto">
            <div class="absolute top-0 left-0 w-16 h-16 border-4 border-primary-500 rounded-full animate-spin" style="border-right-color: transparent; border-bottom-color: transparent;"></div>
          </div>
        </div>
        
        <!-- 로딩 텍스트 -->
        <div class="space-y-2">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {{ $t('loading.title') }}
          </h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            {{ $t('loading.subtitle') }}
          </p>
        </div>
        
        <!-- 진행률 바 (선택적) -->
        <div class="w-64 bg-gray-200 dark:bg-gray-800 rounded-full h-2 mx-auto">
          <div 
            class="bg-primary-500 h-2 rounded-full transition-all duration-300 ease-out"
            :style="{ width: loadingProgress + '%' }"
          ></div>
        </div>
      </div>
    </div>

    <!-- 메인 콘텐츠 -->
    <div :class="{ 'opacity-0': pending, 'opacity-100': !pending }" class="transition-opacity duration-300">
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </div>
  </div>
</template>

<script setup>
// 다국어 설정 및 HTML lang 속성 동적 변경
const { locale, t } = useI18n()

// 로딩 상태 관리
const pending = ref(true)
const loadingProgress = ref(0)

// 로딩 진행률 시뮬레이션
const simulateLoading = () => {
  let progress = 0
  const interval = setInterval(() => {
    progress += Math.random() * 15
    loadingProgress.value = Math.min(progress, 95)
    
    if (progress >= 95) {
      clearInterval(interval)
    }
  }, 100)
  
  return interval
}

// 페이지 전환 시 로딩 상태 관리
const route = useRoute()
let loadingInterval = null

// 라우트 변경 감지
watch(() => route.path, (newPath, oldPath) => {
  if (oldPath && newPath !== oldPath) {
    pending.value = true
    loadingProgress.value = 0
    loadingInterval = simulateLoading()
  }
}, { immediate: false })

// 초기 로딩 완료 처리
onMounted(() => {
  loadingInterval = simulateLoading()
  
  // 최소 로딩 시간 보장 (UX 개선)
  const minLoadTime = 800
  const startTime = Date.now()
  
  nextTick(() => {
    const checkReady = () => {
      const elapsedTime = Date.now() - startTime
      const isMinTimeElapsed = elapsedTime >= minLoadTime
      
      if (isMinTimeElapsed) {
        loadingProgress.value = 100
        setTimeout(() => {
          pending.value = false
          if (loadingInterval) {
            clearInterval(loadingInterval)
          }
        }, 200)
      } else {
        setTimeout(checkReady, 50)
      }
    }
    
    checkReady()
  })
})

// 페이지 로딩 완료 시 처리
const nuxtApp = useNuxtApp()
nuxtApp.hook('page:finish', () => {
  setTimeout(() => {
    loadingProgress.value = 100
    setTimeout(() => {
      pending.value = false
      if (loadingInterval) {
        clearInterval(loadingInterval)
      }
    }, 200)
  }, 300)
})

// HTML lang 속성을 현재 언어로 설정
useHead(() => ({
  htmlAttrs: {
    lang: locale.value
  }
}))

// 메타 태그 언어별 설정
watch(locale, (newLocale) => {
  const langMap = {
    'ko': 'ko-KR',
    'en': 'en-US', 
    'ja': 'ja-JP',
    'zh': 'zh-CN'
  }
  
  useHead({
    htmlAttrs: {
      lang: langMap[newLocale] || newLocale
    }
  })
}, { immediate: true })
</script>