<template>
  <UCard class="w-full max-w-4xl mx-auto">
    <template #header>
      <div class="flex items-center gap-3">
        <UIcon :name="icon" class="text-2xl" />
        <h1 class="text-2xl font-bold">{{ title }}</h1>
      </div>
    </template>

    <div class="space-y-6">
      <slot name="inputs" />
      
      <div v-if="$slots.preview" class="border-t pt-6">
        <slot name="preview" />
      </div>
      
      <div v-if="$slots.results" class="border-t pt-6">
        <h3 class="text-lg font-semibold mb-4">변환 결과</h3>
        <slot name="results" />
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
interface Props {
  title: string
  icon: string
}

defineProps<Props>()
</script>