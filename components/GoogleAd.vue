<template>
  <div v-show="shouldShowAd" class="google-ad-container w-full">
    <!-- 실제 Google AdSense 광고 -->
    <ins 
      class="adsbygoogle"
      :style="adStyle"
      :data-ad-client="adClient"
      :data-ad-slot="adSlot"
      :data-ad-format="adFormat"
      :data-full-width-responsive="type === 'responsive' ? 'true' : 'false'"
    ></ins>
  </div>
</template>

<script setup lang="ts">
interface Props {
  type: 'responsive' | 'banner' | 'square' | 'sidebar'
  width?: string
  height?: string
  adSlot: string // 필수: Google AdSense 슬롯 ID
}

const props = withDefaults(defineProps<Props>(), {
  type: 'responsive',
  width: '100%',
  height: '250px'
})

// AdSense 클라이언트 ID (nuxt.config.ts와 동일)
const adClient = 'ca-pub-2026191960823026'

// 광고 유형별 설정
const adFormat = computed(() => {
  switch (props.type) {
    case 'responsive':
      return 'auto'
    case 'banner':
      return 'horizontal'
    case 'square':
      return 'rectangle'
    case 'sidebar':
      return 'vertical'
    default:
      return 'auto'
  }
})

// 스타일 설정
const adStyle = computed(() => {
  const baseStyle: Record<string, string> = {
    display: 'block'
  }

  if (props.type !== 'responsive') {
    if (props.width) baseStyle.width = props.width
    if (props.height) baseStyle.height = props.height
  }

  return baseStyle
})

// AdSense 스크립트 로드 및 광고 표시
onMounted(() => {
  try {
    // AdSense 스크립트가 로드되었는지 확인
    if (typeof window !== 'undefined' && (window as any).adsbygoogle) {
      // 광고 렌더링
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({})
    }
  } catch (error) {
    console.error('AdSense error:', error)
  }
})

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

// 광고 표시 여부 결정
const shouldShowAd = computed(() => {
  if (props.type === 'sidebar') {
    return isDesktop.value // 사이드바는 데스크톱에서만
  } else if (props.type === 'banner' || props.type === 'responsive') {
    return !isDesktop.value // 배너/반응형은 모바일/태블릿에서만
  }
  return true // 사각형은 항상 표시
})
</script>

<style scoped>
.google-ad-container {
  /* 실제 구글 애드센스 스타일 */
  position: relative;
  overflow: hidden;
}

/* 반응형 지원 */
@media (max-width: 768px) {
  .google-ad-container {
    margin: 0 auto;
  }
}

/* 실제 구현 시에는 이 클래스들을 제거하고 구글 애드센스 코드를 삽입 */
</style>