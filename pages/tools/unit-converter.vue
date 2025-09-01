<template>
  <div class="container mx-auto p-6">
    <BaseConverter
      title="단위 변환기"
      icon="i-heroicons-calculator"
    >
      <template #inputs>
        <div class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <UFormGroup label="변환 유형">
              <USelect
                v-model="selectedCategory"
                :options="categoryOptions"
                option-attribute="label"
                value-attribute="value"
                size="lg"
              />
            </UFormGroup>
            
            <UFormGroup label="입력 값">
              <UInput
                v-model="inputValue"
                type="number"
                placeholder="숫자 입력"
                size="lg"
              />
            </UFormGroup>
            
            <UFormGroup label="변환 전 단위">
              <USelect
                v-model="fromUnit"
                :options="availableUnits"
                option-attribute="label"
                value-attribute="value"
                size="lg"
              />
            </UFormGroup>
            
            <UFormGroup label="변환 후 단위">
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
                <h3 class="font-semibold text-lg">입력값</h3>
                <UBadge color="blue" variant="soft">입력</UBadge>
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
                  복사
                </UButton>
              </div>
            </div>
          </UCard>
          
          <UCard>
            <template #header>
              <div class="flex items-center justify-between">
                <h3 class="font-semibold text-lg">결과</h3>
                <UBadge color="green" variant="soft">결과</UBadge>
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
                  복사
                </UButton>
              </div>
            </div>
          </UCard>
        </div>

        <div class="mt-6">
          <UCard>
            <template #header>
              <h4 class="font-semibold">빠른 변환표</h4>
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

useSeoMeta({
  title: '단위 변환기 | 길이, 무게, 온도, 속도 변환 무료 툴 - ConvertStack',
  description: '길이, 무게, 온도, 속도, 부피, 넓이, 시간 단위를 실시간으로 변환하는 무료 온라인 도구입니다. 미터, 피트, 킬로그램, 파운드, 섭씨, 화씨 등 다양한 단위 지원.',
  keywords: '단위변환기, 길이변환, 무게변환, 온도변환, 속도변환, 미터 피트 변환, 킬로그램 파운드 변환, 섭씨 화씨 변환, 무료단위변환',
  ogTitle: '단위 변환기 | 길이, 무게, 온도, 속도 변환 무료 툴 - ConvertStack',
  ogDescription: '길이, 무게, 온도, 속도 등 다양한 단위를 실시간으로 변환하는 무료 온라인 도구입니다.',
  ogImage: '/og-unit-converter.png',
  ogUrl: 'https://converter.example.com/tools/unit-converter',
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
        "url": "https://converter.example.com/tools/unit-converter",
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

const categoryOptions = [
  { value: 'length', label: '길이' },
  { value: 'mass', label: '무게' },
  { value: 'temperature', label: '온도' },
  { value: 'speed', label: '속도' },
  { value: 'volume', label: '부피' },
  { value: 'area', label: '넓이' },
  { value: 'time', label: '시간' }
]

const unitLabels: Record<string, string> = {
  // Length
  'mm': '밀리미터',
  'cm': '센티미터',
  'm': '미터',
  'km': '킬로미터',
  'in': '인치',
  'ft': '피트',
  'yd': '야드',
  'mi': '마일',
  
  // Mass
  'mg': '밀리그램',
  'g': '그램',
  'kg': '킬로그램',
  't': '톤',
  'oz': '온스',
  'lb': '파운드',
  
  // Temperature
  'C': '섭씨',
  'F': '화씨',
  'K': '켈빈',
  
  // Speed
  'm/s': '미터/초',
  'km/h': '킬로미터/시간',
  'mph': '마일/시간',
  'knot': '노트',
  
  // Volume
  'ml': '밀리리터',
  'l': '리터',
  'tsp': '티스푼',
  'tbsp': '테이블스푼',
  'cup': '컵',
  'fl-oz': '액량 온스',
  
  // Area
  'mm2': '제곱밀리미터',
  'cm2': '제곱센티미터',
  'm2': '제곱미터',
  'km2': '제곱킬로미터',
  'in2': '제곱인치',
  'ft2': '제곱피트',
  
  // Time
  'ns': '나노초',
  'mu': '마이크로초',
  'ms': '밀리초',
  's': '초',
  'min': '분',
  'h': '시간',
  'd': '일',
  'week': '주',
  'month': '월',
  'year': '년'
}

const availableUnits = computed(() => {
  try {
    const units = convert().list(selectedCategory.value as any)
    return units.map((unit: any) => ({
      value: unit.abbr,
      label: `${unitLabels[unit.abbr] || unit.plural} (${unit.abbr})`
    }))
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
    return '변환 오류'
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
  return unitLabels[unit] || unit
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