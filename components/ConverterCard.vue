<template>
  <UCard class="h-full">
    <template #header>
      <div class="flex items-center justify-between">
        <h3 class="font-semibold text-lg">{{ title }}</h3>
        <UBadge v-if="badge" :color="badgeColor" variant="soft">{{ badge }}</UBadge>
      </div>
    </template>

    <div class="space-y-4">
      <slot name="input">
        <UInput
          :model-value="modelValue"
          :placeholder="placeholder"
          :disabled="readonly"
          size="lg"
          @update:model-value="$emit('update:modelValue', $event)"
        />
      </slot>

      <slot />

      <div v-if="copyable && modelValue" class="flex justify-end">
        <UButton
          icon="i-heroicons-clipboard-document-list"
          variant="ghost"
          size="sm"
          @click="copyToClipboard"
        >
          복사
        </UButton>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
interface Props {
  title: string
  modelValue: string
  placeholder?: string
  readonly?: boolean
  copyable?: boolean
  badge?: string
  badgeColor?: 'primary' | 'gray' | 'red' | 'orange' | 'amber' | 'yellow' | 'lime' | 'green' | 'emerald' | 'teal' | 'cyan' | 'sky' | 'blue' | 'indigo' | 'violet' | 'purple' | 'fuchsia' | 'pink' | 'rose'
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const toast = useToast()

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(props.modelValue)
    toast.add({
      title: '클립보드에 복사되었습니다',
      color: 'green'
    })
  } catch (error) {
    toast.add({
      title: '복사에 실패했습니다',
      color: 'red'
    })
  }
}
</script>