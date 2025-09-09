<template>
  <UCard class="h-full hover:shadow-lg transition-shadow duration-200 group dark:bg-gray-950">
    <div class="p-4">
      <div class="flex items-center gap-4 mb-4">
        <div 
          :class="[
            'p-3 rounded-lg',
            color === 'red' ? 'bg-[rgba(220,38,38,0.125)] dark:bg-[rgba(220,38,38,0.125)]' :
            color === 'purple' ? 'bg-[rgba(124,58,237,0.125)] dark:bg-[rgba(124,58,237,0.125)]' :
            color === 'blue' ? 'bg-[rgba(37,99,235,0.125)] dark:bg-[rgba(37,99,235,0.125)]' :
            color === 'green' ? 'bg-[rgba(5,150,105,0.125)] dark:bg-[rgba(5,150,105,0.125)]' :
            color === 'emerald' ? 'bg-[rgba(5,150,105,0.125)] dark:bg-[rgba(5,150,105,0.125)]' :
            color === 'orange' ? 'bg-[rgba(249,115,22,0.125)] dark:bg-[rgba(249,115,22,0.125)]' :
            color === 'teal' ? 'bg-[rgba(20,184,166,0.125)] dark:bg-[rgba(20,184,166,0.125)]' :
            `bg-${color}-100 dark:bg-${color}-900/30`
          ]"
        >
          <UIcon 
            :name="icon" 
            :class="[
              'text-2xl',
              color === 'red' ? 'text-[rgb(220,38,38)]' :
              color === 'purple' ? 'text-[rgb(124,58,237)]' :
              color === 'blue' ? 'text-[rgb(37,99,235)]' :
              color === 'green' ? 'text-[rgb(5,150,105)]' :
              color === 'emerald' ? 'text-[rgb(5,150,105)]' :
              color === 'orange' ? 'text-[rgb(249,115,22)]' :
              color === 'teal' ? 'text-[rgb(20,184,166)]' :
              `text-${color}-600 dark:text-${color}-300`
            ]"
          />
        </div>
        <div>
          <h3 class="text-xl font-bold text-gray-900 dark:text-gray-100">
            {{ title }}
          </h3>
        </div>
      </div>
      
      <!-- <p class="text-gray-600 dark:text-gray-300 mb-6">
        {{ description }}
      </p> -->
      
      <div class="space-y-3 mb-6">
        <h4 class="font-semibold text-gray-900 dark:text-gray-100">{{ t('common.features') }}:</h4>
        <ul class="space-y-2">
          <li 
            v-for="feature in features" 
            :key="feature"
            class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300"
          >
            <UIcon 
              name="i-heroicons-check-circle" 
              :class="[
                'text-sm',
                color === 'red' ? 'text-[rgb(220,38,38)]' :
                color === 'purple' ? 'text-[rgb(124,58,237)]' :
                color === 'blue' ? 'text-[rgb(37,99,235)]' :
                color === 'green' ? 'text-[rgb(5,150,105)]' :
                color === 'emerald' ? 'text-[rgb(5,150,105)]' :
                color === 'orange' ? 'text-[rgb(249,115,22)]' :
                color === 'teal' ? 'text-[rgb(20,184,166)]' :
                `text-${color}-500 dark:text-${color}-400`
              ]"
            />
            {{ feature }}
          </li>
        </ul>
      </div>
      
      <NuxtLink :to="to" class="block">
        <UButton 
          :color="color === 'emerald' ? 'green' : color === 'orange' ? 'orange' : color === 'teal' ? 'teal' : color"
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

<style scoped>
:deep(.iconify) {
  display: block;
}
</style>