<template>
  <div class="google-ad-container">
    <!-- 반응형 광고 영역 -->
    <div 
      v-if="type === 'responsive'"
      class="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 text-center"
      :style="{ minHeight: height || '250px' }"
    >
      <div class="flex flex-col items-center justify-center h-full">
        <UIcon name="i-heroicons-squares-2x2" class="text-4xl text-gray-400 mb-2" />
        <p class="text-sm text-gray-500">Google AdSense</p>
        <p class="text-xs text-gray-400">{{ width }} × {{ height }}</p>
      </div>
    </div>

    <!-- 배너 광고 -->
    <div 
      v-else-if="type === 'banner'"
      class="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 text-center"
      :style="{ minHeight: height || '90px', width: width || '100%' }"
    >
      <div class="flex items-center justify-center h-full">
        <UIcon name="i-heroicons-rectangle-stack" class="text-2xl text-gray-400 mr-2" />
        <div>
          <p class="text-sm text-gray-500">Google AdSense</p>
          <p class="text-xs text-gray-400">{{ width }} × {{ height }}</p>
        </div>
      </div>
    </div>

    <!-- 사각형 광고 -->
    <div 
      v-else-if="type === 'square'"
      class="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 text-center"
      :style="{ minHeight: height || '300px', width: width || '300px' }"
    >
      <div class="flex flex-col items-center justify-center h-full">
        <UIcon name="i-heroicons-stop" class="text-4xl text-gray-400 mb-2" />
        <p class="text-sm text-gray-500">Google AdSense</p>
        <p class="text-xs text-gray-400">{{ width }} × {{ height }}</p>
      </div>
    </div>

    <!-- 세로형 광고 -->
    <div 
      v-else-if="type === 'sidebar'"
      class="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 text-center"
      :style="{ minHeight: height || '600px', width: width || '300px' }"
    >
      <div class="flex flex-col items-center justify-center h-full">
        <UIcon name="i-heroicons-bars-3" class="text-4xl text-gray-400 mb-2" />
        <p class="text-sm text-gray-500">Google AdSense</p>
        <p class="text-xs text-gray-400">{{ width }} × {{ height }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  type: 'responsive' | 'banner' | 'square' | 'sidebar'
  width?: string
  height?: string
  adSlot?: string // Google AdSense 슬롯 ID (실제 구현 시 사용)
}

withDefaults(defineProps<Props>(), {
  type: 'responsive',
  width: '100%',
  height: '250px'
})
</script>

<style scoped>
.google-ad-container {
  /* 실제 구글 애드센스 스타일 */
  position: relative;
  overflow: hidden;
}

/* 실제 구현 시에는 이 클래스들을 제거하고 구글 애드센스 코드를 삽입 */
</style>