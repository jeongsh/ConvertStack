<template>
  <div class="container mx-auto px-6">

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
      <ToolCard
        :title="t('tools.pdfConverter.title')"
        :description="t('tools.pdfConverter.description')"
        icon="i-heroicons-document-arrow-down"
        color="red"
        :to="localePath('/tools/pdf-converter')"
        :features="pdfFeatures"
      />

      <ToolCard
        :title="t('tools.imageConverter.title')"
        :description="t('tools.imageConverter.description')"
        icon="i-heroicons-photo"
        color="purple"
        :to="localePath('/tools/image-converter')"
        :features="imageFeatures"
      />

      <ToolCard
        :title="t('tools.colorConverter.title')"
        :description="t('tools.colorConverter.description')"
        icon="i-heroicons-swatch"
        color="blue"
        :to="localePath('/tools/color-converter')"
        :features="colorFeatures"
      />

      <ToolCard
        :title="t('tools.unitConverter.title')"
        :description="t('tools.unitConverter.description')"
        icon="i-heroicons-calculator"
        color="green"
        :to="localePath('/tools/unit-converter')"
        :features="unitFeatures"
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
          <h2 class="text-2xl font-semibold">{{ t('home.futureTools.title') }}</h2>
          <p class="text-gray-600 dark:text-gray-300">
            {{ t('home.futureTools.description') }}
          </p>
          <div class="flex flex-wrap justify-center gap-2 pt-4">
            <UBadge color="gray" variant="soft">{{ t('home.futureTools.upcomingTools.currencyConverter') }}</UBadge>
            <UBadge color="gray" variant="soft">{{ t('home.futureTools.upcomingTools.qrGenerator') }}</UBadge>
            <UBadge color="gray" variant="soft">{{ t('home.futureTools.upcomingTools.jsonFormatter') }}</UBadge>
            <UBadge color="gray" variant="soft">{{ t('home.futureTools.upcomingTools.base64Encoder') }}</UBadge>
            <UBadge color="gray" variant="soft">{{ t('home.futureTools.upcomingTools.imageCompressor') }}</UBadge>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()

// SEO 메타 데이터 설정
useSeoMeta({
  title: () => t('meta.title'),
  description: () => t('meta.description'),
  keywords: () => t('meta.keywords'),
  ogTitle: () => t('meta.title'),
  ogDescription: () => t('meta.description'),
  ogImage: '/og-home.png',
  ogUrl: 'https://converter.example.com',
  twitterCard: 'summary_large_image',
  twitterTitle: () => t('meta.title'),
  twitterDescription: () => t('meta.description'),
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
        "description": t('meta.description'),
        "author": {
          "@type": "Organization",
          "name": t('meta.author')
        },
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://converter.example.com/search?q={search_term_string}",
          "query-input": "required name=search_term_string"
        },
        "mainEntity": [
          {
            "@type": "SoftwareApplication",
            "name": t('tools.colorConverter.title'),
            "applicationCategory": "UtilityApplication",
            "url": "https://converter.example.com/tools/color-converter"
          },
          {
            "@type": "SoftwareApplication", 
            "name": t('tools.unitConverter.title'),
            "applicationCategory": "UtilityApplication",
            "url": "https://converter.example.com/tools/unit-converter"
          },
          {
            "@type": "SoftwareApplication", 
            "name": t('tools.imageConverter.title'),
            "applicationCategory": "UtilityApplication",
            "url": "https://converter.example.com/tools/image-converter"
          }
        ]
      })
    }
  ]
})

// 번역된 기능 배열들을 직접 정의 (i18n 배열 처리 문제 회피)
const { locale } = useI18n()

const colorFeatures = computed(() => {
  switch (locale.value) {
    case 'en':
      return [
        "Real-time conversion",
        "Color preview",
        "Contrast ratio check", 
        "Web safe color check"
      ]
    case 'ja':
      return [
        "リアルタイム変換",
        "カラープレビュー",
        "コントラスト比チェック",
        "ウェブセーフカラーチェック"
      ]
    case 'zh':
      return [
        "实时转换",
        "颜色预览",
        "对比度检查",
        "网页安全色检查"
      ]
    default: // ko
      return [
        "실시간 변환",
        "색상 미리보기",
        "대비율 검사",
        "웹 안전 색상 확인"
      ]
  }
})

const unitFeatures = computed(() => {
  switch (locale.value) {
    case 'en':
      return [
        "7 unit types",
        "Quick conversion table",
        "Accurate calculation",
        "Copy function"
      ]
    case 'ja':
      return [
        "7つの単位タイプ",
        "クイック変換表",
        "精密な計算",
        "コピー機能"
      ]
    case 'zh':
      return [
        "7种单位类型",
        "快速转换表",
        "精确计算",
        "复制功能"
      ]
    default: // ko
      return [
        "7가지 단위 유형",
        "빠른 변환표",
        "정확한 계산",
        "복사 기능"
      ]
  }
})

const imageFeatures = computed(() => {
  switch (locale.value) {
    case 'en':
      return [
        "JPEG, PNG, WebP support",
        "Drag and drop",
        "Resize images",
        "Quality settings"
      ]
    case 'ja':
      return [
        "JPEG、PNG、WebP対応",
        "ドラッグ&ドロップ",
        "画像サイズ調整",
        "品質設定"
      ]
    case 'zh':
      return [
        "JPEG、PNG、WebP支持",
        "拖放上传",
        "图像大小调整",
        "质量设置"
      ]
    default: // ko
      return [
        "JPEG, PNG, WebP 지원",
        "드래그 앤 드롭",
        "크기 조정",
        "품질 설정"
      ]
  }
})

const pdfFeatures = computed(() => {
  switch (locale.value) {
    case 'en':
      return [
        "PDF file merging",
        "PDF file splitting",
        "PDF file compression",
        "PDF ↔ Word conversion"
      ]
    case 'ja':
      return [
        "PDFファイル結合",
        "PDFファイル分割",
        "PDFファイル圧縮",
        "PDF ↔ Word変換"
      ]
    case 'zh':
      return [
        "PDF文件合并",
        "PDF文件拆分",
        "PDF文件压缩",
        "PDF ↔ Word转换"
      ]
    default: // ko
      return [
        "PDF 파일 병합",
        "PDF 파일 분할",
        "PDF 파일 압축",
        "PDF ↔ Word 변환"
      ]
  }
})
</script>