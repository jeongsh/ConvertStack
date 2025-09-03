<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <header class="border-b bg-white dark:bg-gray-800">
      <div class="container mx-auto px-6 h-16 flex items-center justify-between">
        <NuxtLink to="/" class="flex items-center gap-2">
          <UIcon name="i-heroicons-wrench-screwdriver" class="text-2xl text-primary" />
          <span class="font-bold text-xl">ConvertStack</span>
        </NuxtLink>

        <div class="flex items-center gap-3">
          <LanguageSelector />
          <UButton
            :icon="isDark ? 'i-heroicons-sun' : 'i-heroicons-moon'"
            color="gray"
            variant="ghost"
            :aria-label="t('nav.themeToggle')"
            @click="toggleDark"
          />
        </div>
      </div>
    </header>

    <main class="py-8">
      <slot />
    </main>

    <!-- <footer class="border-t bg-white dark:bg-gray-800 mt-16">
      <div class="container mx-auto px-6 py-8">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <div class="flex items-center gap-2 mb-4 md:mb-0">
            <UIcon name="i-heroicons-wrench-screwdriver" class="text-primary" />
            <span class="font-semibold">ConvertStack</span>
          </div>
          
          <div class="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <span>© 2024 Converter Tools</span>
            <span>•</span>
            <NuxtLink to="/about" class="hover:text-primary">소개</NuxtLink>
          </div>
        </div>
      </div>
    </footer> -->
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
const isDark = ref(false)

const toggleDark = () => {
  isDark.value = !isDark.value
  if (process.client) {
    document.documentElement.classList.toggle('dark', isDark.value)
    localStorage.setItem('color-mode', isDark.value ? 'dark' : 'light')
  }
}

onMounted(() => {
  if (process.client) {
    const saved = localStorage.getItem('color-mode')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    isDark.value = saved ? saved === 'dark' : prefersDark
    document.documentElement.classList.toggle('dark', isDark.value)
  }
})
</script>