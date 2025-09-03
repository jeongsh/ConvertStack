<template>
  <UDropdown :items="[languages]" :popper="{ placement: 'bottom-end' }">
    <UButton 
      variant="ghost" 
      color="gray"
      size="sm"
      trailing-icon="i-heroicons-chevron-down-20-solid"
    >
      <template #leading>
        <span class="text-base">{{ currentFlag }}</span>
      </template>
      {{ currentName }}
    </UButton>
  </UDropdown>
</template>

<script setup lang="ts">
const { locale, setLocale } = useI18n()

const languages = [
  { 
    label: '한국어', 
    icon: '🇰🇷',
    click: () => switchLang('ko'),
    code: 'ko'
  },
  { 
    label: 'English', 
    icon: '🇺🇸',
    click: () => switchLang('en'),
    code: 'en'
  },
  { 
    label: '日本語', 
    icon: '🇯🇵',
    click: () => switchLang('ja'),
    code: 'ja'
  },
  { 
    label: '中文', 
    icon: '🇨🇳',
    click: () => switchLang('zh'),
    code: 'zh'
  }
]

const currentFlag = computed(() => {
  const current = languages.find(l => l.code === locale.value)
  return current?.icon || '🇰🇷'
})

const currentName = computed(() => {
  const current = languages.find(l => l.code === locale.value)
  return current?.label || '한국어'
})

const switchLang = (code: 'ko' | 'en' | 'ja' | 'zh') => {
  setLocale(code)
}
</script>
