<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
// 다국어 설정 및 HTML lang 속성 동적 변경
const { locale } = useI18n()

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