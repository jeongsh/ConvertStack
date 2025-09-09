<template>
  <div class="container mx-auto p-6">
    <BaseConverter
      :title="$t('pages.unitConverter.title')"
      icon="i-heroicons-calculator"
    >
      <template #inputs>
        <div class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <UFormGroup :label="$t('pages.unitConverter.conversionType')">
              <USelect
                v-model="selectedCategory"
                :options="categoryOptions"
                option-attribute="label"
                value-attribute="value"
                size="lg"
              />
            </UFormGroup>
            
            <UFormGroup :label="$t('pages.unitConverter.inputValue')">
              <UInput
                v-model="inputValue"
                type="number"
                :placeholder="$t('pages.unitConverter.inputPlaceholder')"
                size="lg"
              />
            </UFormGroup>
            
            <UFormGroup :label="$t('pages.unitConverter.fromUnit')">
              <USelect
                v-model="fromUnit"
                :options="availableUnits"
                option-attribute="label"
                value-attribute="value"
                size="lg"
              />
            </UFormGroup>
            
            <UFormGroup :label="$t('pages.unitConverter.toUnit')">
              <USelect
                v-model="toUnit"
                :options="availableUnits"
                option-attribute="label"
                value-attribute="value"
                size="lg"
              />
            </UFormGroup>
          </div>
        </div>
      </template>

      <template #results>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <UCard>
            <template #header>
              <div class="flex items-center justify-between">
                <h3 class="font-semibold text-lg">{{ $t('pages.unitConverter.inputLabel') }}</h3>
                <UBadge color="blue" variant="soft">{{ $t('pages.unitConverter.inputLabel') }}</UBadge>
              </div>
            </template>
            <div class="space-y-4">
              <div class="text-2xl font-bold">{{ inputValue || '0' }} {{ getUnitLabel(fromUnit) }}</div>
              <div class="flex justify-end">
                <UButton
                  icon="i-heroicons-clipboard-document-list"
                  variant="ghost"
                  size="sm"
                  @click="copyToClipboard(formattedInput)"
                >
                  {{ $t('pages.unitConverter.copy') }}
                </UButton>
              </div>
            </div>
          </UCard>
          
          <UCard>
            <template #header>
              <div class="flex items-center justify-between">
                <h3 class="font-semibold text-lg">{{ $t('pages.unitConverter.result') }}</h3>
                <UBadge color="green" variant="soft">{{ $t('pages.unitConverter.result') }}</UBadge>
              </div>
            </template>
            <div class="space-y-4">
              <div class="text-2xl font-bold">{{ result }} {{ getUnitLabel(toUnit) }}</div>
              <div class="flex justify-end">
                <UButton
                  icon="i-heroicons-clipboard-document-list"
                  variant="ghost"
                  size="sm"
                  @click="copyToClipboard(formattedResult)"
                >
                  {{ $t('pages.unitConverter.copy') }}
                </UButton>
              </div>
            </div>
          </UCard>
        </div>

        <div class="mt-6">
          <UCard>
            <template #header>
              <h4 class="font-semibold">{{ $t('pages.unitConverter.quickConversionTable') }}</h4>
            </template>
            
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div v-for="conversion in quickConversions" :key="conversion.unit" class="text-center">
                <div class="font-medium">{{ getUnitLabel(conversion.unit) }}</div>
                <div class="text-gray-600">{{ conversion.value }}</div>
              </div>
            </div>
          </UCard>
        </div>
      </template>
    </BaseConverter>
  </div>
</template>

<script setup lang="ts">
import convert from 'convert-units'

const { t } = useI18n()

useSeoMeta({
  title: t('pages.unitConverter.seo.title', '단위 변환기 | 길이, 무게, 온도, 속도 변환 무료 툴 - ConvertStack'),
  description: t('pages.unitConverter.seo.description', '길이, 무게, 온도, 속도, 부피, 넓이, 시간 단위를 실시간으로 변환하는 무료 온라인 도구입니다. 미터, 피트, 킬로그램, 파운드, 섭씨, 화씨 등 다양한 단위 지원.'),
  keywords: '단위변환기, 길이변환, 무게변환, 온도변환, 속도변환, 미터 피트 변환, 킬로그램 파운드 변환, 섭씨 화씨 변환, 무료단위변환',
  ogTitle: '단위 변환기 | 길이, 무게, 온도, 속도 변환 무료 툴 - ConvertStack',
  ogDescription: '길이, 무게, 온도, 속도 등 다양한 단위를 실시간으로 변환하는 무료 온라인 도구입니다.',
  ogImage: '/og-unit-converter.png',
  ogUrl: 'https://convertstack.xyz/tools/unit-converter',
  twitterCard: 'summary_large_image',
  twitterTitle: '단위 변환기 | 길이, 무게, 온도, 속도 변환',
  twitterDescription: '길이, 무게, 온도, 속도 등 다양한 단위를 실시간으로 변환하는 무료 온라인 도구입니다.',
  twitterImage: '/og-unit-converter.png'
})

// Schema.org 구조화 데이터
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "단위 변환기",
        "applicationCategory": "UtilityApplication",
        "description": "길이, 무게, 온도, 속도, 부피, 넓이, 시간 단위를 실시간으로 변환하는 무료 온라인 도구",
        "url": "https://convertstack.xyz/tools/unit-converter",
        "operatingSystem": "Web",
        "permissions": "무료 사용",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "KRW"
        },
        "author": {
          "@type": "Organization",
          "name": "ConvertStack"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "ratingCount": "280"
        },
        "featureList": [
          "길이 단위 변환 (미터, 센티미터, 인치, 피트)",
          "무게 단위 변환 (킬로그램, 그램, 파운드, 온스)",
          "온도 단위 변환 (섭씨, 화씨, 켈빈)",
          "속도 단위 변환 (km/h, mph, m/s)",
          "부피 단위 변환 (리터, 갤런, 컵)",
          "넓이 단위 변환 (제곱미터, 제곱피트)",
          "시간 단위 변환 (초, 분, 시간, 일)"
        ]
      })
    }
  ]
})

const selectedCategory = ref<string>('length')
const inputValue = ref<string>('1')
const fromUnit = ref<string>('m')
const toUnit = ref<string>('cm')

const categoryOptions = computed(() => [
  { value: 'length', label: t('pages.unitConverter.categories.length') },
  { value: 'mass', label: t('pages.unitConverter.categories.mass') },
  { value: 'temperature', label: t('pages.unitConverter.categories.temperature') },
  { value: 'speed', label: t('pages.unitConverter.categories.speed') },
  { value: 'volume', label: t('pages.unitConverter.categories.volume') },
  { value: 'area', label: t('pages.unitConverter.categories.area') },
  { value: 'time', label: t('pages.unitConverter.categories.time') }
])

const availableUnits = computed(() => {
  try {
    const units = convert().list(selectedCategory.value as any)
    return units.map((unit: any) => {
      const translatedLabel = t(`pages.unitConverter.units.${unit.abbr}`)
      const label = translatedLabel !== `pages.unitConverter.units.${unit.abbr}` 
        ? translatedLabel 
        : unit.plural
      return {
        value: unit.abbr,
        label: `${label} (${unit.abbr})`
      }
    })
  } catch (error) {
    return []
  }
})

const result = computed(() => {
  try {
    if (!inputValue.value || isNaN(Number(inputValue.value))) return '0'
    
    const value = convert(Number(inputValue.value))
      .from(fromUnit.value as any)
      .to(toUnit.value as any)
    
    return formatNumber(value)
  } catch (error) {
    return t('common.conversionError')
  }
})

const formattedInput = computed(() => {
  return `${inputValue.value || '0'} ${getUnitLabel(fromUnit.value)}`
})

const formattedResult = computed(() => {
  return `${result.value} ${getUnitLabel(toUnit.value)}`
})

const quickConversions = computed(() => {
  if (!inputValue.value || isNaN(Number(inputValue.value))) return []
  
  try {
    const baseValue = Number(inputValue.value)
    const commonUnits = availableUnits.value.slice(0, 8)
    
    return commonUnits.map((unit: any) => {
      try {
        const convertedValue = convert(baseValue)
          .from(fromUnit.value as any)
          .to(unit.value as any)
        
        return {
          unit: unit.value,
          value: formatNumber(convertedValue)
        }
      } catch {
        return {
          unit: unit.value,
          value: '-'
        }
      }
    }).filter((item: any) => item.unit !== fromUnit.value)
  } catch {
    return []
  }
})

const getUnitLabel = (unit: string): string => {
  const translatedUnit = t(`pages.unitConverter.units.${unit}`)
  return translatedUnit !== `pages.unitConverter.units.${unit}` ? translatedUnit : unit
}

const formatNumber = (num: number): string => {
  if (num === 0) return '0'
  if (Math.abs(num) >= 1000000) return num.toExponential(3)
  if (Math.abs(num) >= 1000) return num.toLocaleString()
  if (Math.abs(num) < 0.001) return num.toExponential(3)
  return Number(num.toFixed(6)).toString()
}

const toast = useToast()

const copyToClipboard = async (value: string) => {
  try {
    await navigator.clipboard.writeText(value)
    toast.add({
      title: t('common.copiedToClipboard'),
      color: 'green'
    })
  } catch (error) {
    toast.add({
      title: t('common.copyFailed'),
      color: 'red'
    })
  }
}

watch(selectedCategory, () => {
  const units = availableUnits.value
  if (units.length > 0) {
    fromUnit.value = units[0].value
    toUnit.value = units[1]?.value || units[0].value
  }
})

watch(fromUnit, (newUnit) => {
  if (newUnit === toUnit.value && availableUnits.value.length > 1) {
    const otherUnit = availableUnits.value.find((u: any) => u.value !== newUnit)
    if (otherUnit) {
      toUnit.value = otherUnit.value
    }
  }
})
</script>