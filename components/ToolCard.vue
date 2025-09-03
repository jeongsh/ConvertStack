<template>
  <UCard class="h-full hover:shadow-lg transition-shadow duration-200 group">
    <div class="p-6">
      <div class="flex items-center gap-4 mb-4">
        <div :class="`p-3 rounded-lg bg-${color}-100 dark:bg-${color}-900/20`">
          <UIcon 
            :name="icon" 
            :class="`text-2xl text-${color}-600 dark:text-${color}-400`" 
          />
        </div>
        <div>
          <h3 class="text-xl font-bold text-gray-900 dark:text-white">
            {{ title }}
          </h3>
        </div>
      </div>
      
      <!-- <p class="text-gray-600 dark:text-gray-300 mb-6">
        {{ description }}
      </p> -->
      
      <div class="space-y-3 mb-6">
        <h4 class="font-semibold text-gray-900 dark:text-white">{{ t('common.features') }}:</h4>
        <ul class="space-y-2">
          <li 
            v-for="feature in features" 
            :key="feature"
            class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300"
          >
            <UIcon 
              name="i-heroicons-check-circle" 
              :class="`text-${color}-500`" 
              class="text-sm"
            />
            {{ feature }}
          </li>
        </ul>
      </div>
      
      <NuxtLink :to="to" class="block">
        <UButton 
          :color="color" 
          size="lg" 
          block
          class="group-hover:shadow-md transition-shadow duration-200"
        >
          {{ t('common.startConverting') }}
          <template #trailing>
            <UIcon name="i-heroicons-arrow-right" />
          </template>
        </UButton>
      </NuxtLink>
    </div>
  </UCard>
</template>

<script setup lang="ts">
const { t } = useI18n()

interface Props {
  title: string
  description: string
  icon: string
  color: string
  to: string
  features: string[]
}

defineProps<Props>()
</script>