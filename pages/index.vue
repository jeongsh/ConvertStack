<template>
  <div class="container mx-auto px-6">

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
      <ToolCard
        title="색상 변환기"
        description="HEX, RGB, HSL 색상 형식을 실시간으로 변환하고 미리보기할 수 있습니다."
        icon="i-heroicons-swatch"
        color="blue"
        to="/tools/color-converter"
        :features="colorFeatures"
      />

      <ToolCard
        title="단위 변환기"
        description="길이, 무게, 온도, 속도 등 다양한 단위를 정확하게 변환합니다."
        icon="i-heroicons-calculator"
        color="green"
        to="/tools/unit-converter"
        :features="unitFeatures"
      />

      <ToolCard
        title="PDF 도구"
        description="PDF 파일을 병합, 분할, 압축하고 Word 문서와 변환할 수 있습니다."
        icon="i-heroicons-document-arrow-down"
        color="red"
        to="/tools/pdf-converter"
        :features="pdfFeatures"
      />
    </div>

    <!-- 구글 애드 영역 -->
    <div class="mt-12 mb-12">
      <GoogleAd type="banner" width="100%" height="90px" />
    </div>

    <div class="mt-16 text-center">
      <UCard class="max-w-2xl mx-auto">
        <div class="text-center space-y-4">
          <UIcon name="i-heroicons-rocket-launch" class="text-3xl text-primary" />
          <h2 class="text-2xl font-semibold">더 많은 도구가 준비 중입니다!</h2>
          <p class="text-gray-600 dark:text-gray-300">
            향후 업데이트에서 더 많은 유용한 도구들을 만나보실 수 있습니다.
          </p>
          <div class="flex flex-wrap justify-center gap-2 pt-4">
            <UBadge color="gray" variant="soft">환율 변환기</UBadge>
            <UBadge color="gray" variant="soft">QR 코드 생성기</UBadge>
            <UBadge color="gray" variant="soft">JSON 포매터</UBadge>
            <UBadge color="gray" variant="soft">Base64 인코더</UBadge>
            <UBadge color="gray" variant="soft">이미지 압축기</UBadge>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'ConvertStack | 무료 온라인 변환기 플랫폼',
  description: '개발자와 디자이너를 위한 무료 온라인 변환 도구 모음. 색상 변환기(HEX, RGB, HSL), 단위 변환기(길이, 무게, 온도) 등 유용한 도구를 제공합니다.',
  keywords: '온라인도구, 변환도구, 색상변환기, 단위변환기, 개발자도구, 디자이너도구, 무료도구, HEX RGB 변환, 길이변환',
  ogTitle: 'ConvertStack | 무료 온라인 변환기 플랫폼',
  ogDescription: '개발자와 디자이너를 위한 무료 온라인 변환 도구 모음',
  ogImage: '/og-home.png',
  ogUrl: 'https://converter.example.com',
  twitterCard: 'summary_large_image',
  twitterTitle: 'ConvertStack | 무료 온라인 변환기',
  twitterDescription: '개발자와 디자이너를 위한 무료 온라인 변환 도구 모음',
  twitterImage: '/og-home.png'
})

// Schema.org 구조화 데이터
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "ConvertStack",
        "url": "https://converter.example.com",
        "description": "개발자와 디자이너를 위한 무료 온라인 변환 도구 모음",
        "author": {
          "@type": "Organization",
          "name": "ConvertStack"
        },
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://converter.example.com/search?q={search_term_string}",
          "query-input": "required name=search_term_string"
        },
        "mainEntity": [
          {
            "@type": "SoftwareApplication",
            "name": "색상 변환기",
            "applicationCategory": "UtilityApplication",
            "url": "https://converter.example.com/tools/color-converter"
          },
          {
            "@type": "SoftwareApplication", 
            "name": "단위 변환기",
            "applicationCategory": "UtilityApplication",
            "url": "https://converter.example.com/tools/unit-converter"
          }
        ]
      })
    }
  ]
})

const colorFeatures = [
  '실시간 변환',
  '색상 미리보기',
  '대비율 검사',
  '웹 안전 색상 확인'
]

const unitFeatures = [
  '7가지 단위 유형',
  '빠른 변환표',
  '정확한 계산',
  '복사 기능'
]

const pdfFeatures = [
  'PDF 파일 병합',
  'PDF 파일 분할',
  'PDF 파일 압축',
  'PDF ↔ Word 변환'
]
</script>