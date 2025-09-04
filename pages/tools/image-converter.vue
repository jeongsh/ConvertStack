<template>
  <div class="container mx-auto px-6 py-8">
    <BaseConverter
      :title="$t('pages.imageConverter.title')"
      icon="i-heroicons-photo"
      :description="$t('pages.imageConverter.description')"
    >
      <template #inputs>
        <div class="space-y-8">
          <!-- 파일 업로드 섹션 -->
          <UCard>
            <template #header>
              <h3 class="text-lg font-semibold flex items-center gap-2">
                <UIcon name="i-heroicons-cloud-arrow-up" />
                {{ $t('pages.imageConverter.fileUpload') }}
              </h3>
            </template>

            <div class="space-y-4">
              <!-- 드롭존 -->
              <div 
                class="border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200"
                :class="[
                  isDragging ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-300 dark:border-gray-600',
                  'hover:border-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                ]"
                @dragenter.prevent="handleDragEnter"
                @dragover.prevent="handleDragOver" 
                @dragleave.prevent="handleDragLeave"
                @drop.prevent="handleDrop"
                @click="selectFiles"
              >
                <input
                  ref="fileInputRef"
                  type="file"
                  multiple
                  accept="image/*"
                  class="hidden"
                  @change="handleFileSelect"
                />
                <UIcon 
                  name="i-heroicons-photo" 
                  class="text-6xl mx-auto mb-4"
                  :class="isDragging ? 'text-primary-500' : 'text-gray-400'"
                />
                <p class="text-lg font-medium mb-2">
                  {{ isDragging ? $t('pages.imageConverter.dropFilesHere') : $t('pages.imageConverter.dragOrClickToUpload') }}
                </p>
                <p class="text-sm text-gray-500">
                  {{ $t('pages.imageConverter.supportedFormatsWithSize') }}
                </p>
              </div>

              <!-- 업로드된 파일 목록 -->
              <div v-if="uploadedFiles.length > 0" class="space-y-3">
                <div class="flex justify-between items-center">
                  <h4 class="font-medium">{{ $t('pages.imageConverter.uploadedFiles') }} ({{ uploadedFiles.length }}{{ $t('pages.imageConverter.filesUploaded') }})</h4>
                  <UButton size="sm" variant="ghost" color="red" @click="clearAllFiles">
                    {{ $t('pages.imageConverter.clearAll') }}
                  </UButton>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div 
                    v-for="(file, index) in uploadedFiles" 
                    :key="index"
                    class="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <UIcon name="i-heroicons-photo" class="w-12 h-12 text-gray-400" />
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-medium truncate">{{ file.name }}</p>
                      <p class="text-xs text-gray-500">{{ formatFileSize(file.size) }}</p>
                    </div>
                    <UButton 
                      size="sm" 
                      variant="ghost" 
                      color="red"
                      @click="removeFile(index)"
                    >
                      <UIcon name="i-heroicons-x-mark" />
                    </UButton>
                  </div>
                </div>
              </div>
            </div>
          </UCard>

          <!-- 변환 설정 -->
          <UCard v-if="uploadedFiles.length > 0">
            <template #header>
              <h3 class="text-lg font-semibold flex items-center gap-2">
                <UIcon name="i-heroicons-cog-6-tooth" />
                {{ $t('pages.imageConverter.conversionSettings') }}
              </h3>
            </template>
            <div class="space-y-6">
              <!-- 기본 설정 -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium mb-2">{{ $t('pages.imageConverter.format') }}</label>
                  <USelectMenu v-model="settings.format" :options="formatOptions" />
                </div>
                <div v-if="settings.format !== 'png'">
                  <label class="block text-sm font-medium mb-2">{{ $t('pages.imageConverter.quality') }}: {{ settings.quality }}%</label>
                  <URange v-model="settings.quality" :min="10" :max="100" :step="5" />
                </div>
              </div>

              <!-- 크기 조정 -->
              <div>
                <label class="block text-sm font-medium mb-2">{{ $t('pages.imageConverter.resize') }}</label>
                <USelectMenu v-model="settings.resize" :options="resizeOptions" />
              </div>
              <div v-if="settings.resize === 'custom'" class="grid grid-cols-2 gap-4">
                <UInput v-model="settings.customWidth" type="number" :placeholder="$t('pages.imageConverter.customWidth')" :label="$t('pages.imageConverter.customWidth')" />
                <UInput v-model="settings.customHeight" type="number" :placeholder="$t('pages.imageConverter.customHeight')" :label="$t('pages.imageConverter.customHeight')" />
              </div>

              <!-- 최적화 옵션 -->
              <div class="border-t pt-6">
                <h4 class="text-sm font-semibold mb-4 flex items-center gap-2">
                  <UIcon name="i-heroicons-sparkles" class="text-amber-500" />
                  {{ $t('pages.imageConverter.optimizationOptions') }}
                </h4>
                <div class="space-y-4">
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <UCheckbox v-model="settings.removeMetadata" :label="$t('pages.imageConverter.removeMetadata')" />
                    <UCheckbox v-model="settings.webOptimized" :label="$t('pages.imageConverter.webOptimized')" />
                  </div>
                  <div v-if="settings.webOptimized" class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <p class="text-sm text-blue-700 dark:text-blue-300">
                      <UIcon name="i-heroicons-information-circle" class="inline mr-1" />
                      {{ $t('pages.imageConverter.webOptimizedDescription') }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- 변환 버튼 -->
              <UButton 
                @click="startConversion" 
                :loading="isConverting"
                :disabled="uploadedFiles.length === 0"
                size="lg" 
                color="primary" 
                block
                class="mt-6"
              >
                <UIcon name="i-heroicons-arrow-path" class="mr-2" />
                {{ isConverting ? $t('pages.imageConverter.processing') : `${uploadedFiles.length}${$t('pages.imageConverter.filesUploaded')} ${$t('pages.imageConverter.startConversion')}` }}
              </UButton>
            </div>
          </UCard>
        </div>
      </template>

      <template #preview>
        <!-- 이미지 미리보기 -->
        <UCard v-if="uploadedFiles.length > 0 && !isConverting">
          <template #header>
            <h3 class="text-lg font-semibold flex items-center gap-2">
              <UIcon name="i-heroicons-eye" />
              {{ $t('pages.imageConverter.preview') }}
            </h3>
          </template>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div v-for="(fileItem, index) in uploadedFiles.slice(0, 6)" :key="index" class="relative">
              <div class="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                <img 
                  v-if="fileItem.preview" 
                  :src="fileItem.preview" 
                  :alt="fileItem.name"
                  class="w-full h-full object-cover"
                />
                <div v-else class="w-full h-full flex items-center justify-center">
                  <UIcon name="i-heroicons-photo" class="text-4xl text-gray-400" />
                </div>
              </div>
              <div class="mt-2">
                <p class="text-xs font-medium truncate">{{ fileItem.name }}</p>
                <p class="text-xs text-gray-500">{{ formatFileSize(fileItem.size) }}</p>
              </div>
            </div>
          </div>
          <div v-if="uploadedFiles.length > 6" class="mt-4 text-center">
            <p class="text-sm text-gray-500">{{ $t('pages.imageConverter.andMoreFiles', { count: uploadedFiles.length - 6 }) }}</p>
          </div>
        </UCard>

        <!-- 진행률 -->
        <UCard v-if="isConverting">
          <template #header>
            <h3 class="text-lg font-semibold flex items-center gap-2">
              <UIcon name="i-heroicons-arrow-path" class="animate-spin" />
              {{ $t('pages.imageConverter.conversionProgress') }}
            </h3>
          </template>
          <div class="space-y-4">
            <div class="flex justify-between items-center">
              <span class="text-sm font-medium">{{ $t('pages.imageConverter.overallProgress') }}</span>
              <span class="text-sm text-gray-500">{{ conversionProgress.current }}/{{ conversionProgress.total }}</span>
            </div>
            <UProgress :value="conversionProgress.percentage" size="lg" />
            <div v-if="conversionProgress.currentFile" class="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
              <p class="text-sm text-gray-600 dark:text-gray-300">
                <UIcon name="i-heroicons-document-arrow-down" class="inline mr-1" />
                {{ $t('pages.imageConverter.convertingFile') }}: {{ conversionProgress.currentFile }}
              </p>
            </div>
          </div>
        </UCard>
      </template>

      <template #results>
        <!-- 변환 결과 -->
        <UCard v-if="convertedFiles.length > 0">
          <template #header>
            <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div>
                <h3 class="text-lg font-semibold flex items-center gap-2">
                  <UIcon name="i-heroicons-check-circle" class="text-green-500" />
                  {{ $t('pages.imageConverter.conversionComplete') }} ({{ convertedFiles.length }}{{ $t('pages.imageConverter.filesUploaded') }})
                </h3>
                <p class="text-sm text-gray-500 mt-1">
                  {{ $t('pages.imageConverter.totalSize') }}: {{ getTotalSize(convertedFiles) }} 
                  <span v-if="getSizeReduction() !== '0%'" class="text-green-600 font-medium">
                    ({{ getSizeReduction() }} {{ $t('pages.imageConverter.capacitySaved') }})
                  </span>
                </p>
              </div>
              <div class="flex gap-2">
                <UButton @click="downloadAllFiles" color="primary">
                  <UIcon name="i-heroicons-arrow-down-tray" class="mr-2" />
                  {{ $t('pages.imageConverter.downloadAll') }}
                </UButton>
                <UButton @click="clearResults" variant="ghost" color="red">
                  <UIcon name="i-heroicons-trash" class="mr-2" />
                  {{ $t('pages.imageConverter.clearResults') }}
                </UButton>
              </div>
            </div>
          </template>
          
          <!-- 결과 통계 -->
          <div v-if="conversionStats.length > 0" class="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div class="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-center">
              <UIcon name="i-heroicons-check-circle" class="text-2xl text-green-500 mx-auto mb-2" />
              <p class="text-sm text-gray-600 dark:text-gray-300">{{ $t('pages.imageConverter.successCount') }}</p>
              <p class="text-xl font-semibold text-green-600">{{ conversionStats.length }}</p>
            </div>
            <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-center">
              <UIcon name="i-heroicons-arrow-down" class="text-2xl text-blue-500 mx-auto mb-2" />
              <p class="text-sm text-gray-600 dark:text-gray-300">{{ $t('pages.imageConverter.capacitySaved') }}</p>
              <p class="text-xl font-semibold text-blue-600">{{ getSizeReduction() }}</p>
            </div>
            <div class="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg text-center">
              <UIcon name="i-heroicons-bolt" class="text-2xl text-purple-500 mx-auto mb-2" />
              <p class="text-sm text-gray-600 dark:text-gray-300">{{ $t('pages.imageConverter.averageSpeed') }}</p>
              <p class="text-xl font-semibold text-purple-600">{{ getAverageSpeed() }}</p>
            </div>
          </div>

          <!-- 변환된 파일들 -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div v-for="(file, index) in convertedFiles" :key="index" class="group border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-200">
              <!-- 이미지 미리보기 -->
              <div class="relative aspect-video overflow-hidden bg-gray-100 dark:bg-gray-800">
                <img 
                  :src="file.url" 
                  :alt="file.name" 
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
                <div class="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                  {{ file.originalSize ? `${Math.round((file.size / file.originalSize) * 100)}%` : '100%' }}
                </div>
              </div>
              
              <!-- 파일 정보 -->
              <div class="p-4 space-y-3">
                <div>
                  <h5 class="font-medium text-sm truncate group-hover:text-primary-600 transition-colors">
                    {{ file.name }}
                  </h5>
                  <div class="flex items-center justify-between text-xs text-gray-500 mt-1">
                    <span>{{ formatFileSize(file.size) }}</span>
                    <span v-if="file.originalSize" class="text-green-600">
                      -{{ formatFileSize(file.originalSize - file.size) }}
                    </span>
                  </div>
                </div>
                
                <!-- 액션 버튼 -->
                <div class="flex gap-2">
                  <UButton @click="downloadFile(file)" size="sm" color="primary" class="flex-1">
                    <UIcon name="i-heroicons-arrow-down-tray" class="mr-1" /> 
                    {{ $t('common.download') }}
                  </UButton>
                  <UButton @click="previewFile(file)" size="sm" variant="ghost">
                    <UIcon name="i-heroicons-eye" />
                  </UButton>
                  <UButton @click="removeConvertedFile(index)" size="sm" variant="ghost" color="red">
                    <UIcon name="i-heroicons-trash" />
                  </UButton>
                </div>
              </div>
            </div>
          </div>
        </UCard>
      </template>
    </BaseConverter>
  </div>
</template>

<script setup>
const { t } = useI18n()

// SEO 메타데이터
useSeoMeta({
  title: t('pages.imageConverter.seo.title', '이미지 변환기 | ConvertStack'),
  description: t('pages.imageConverter.seo.description', 'JPEG, PNG, WebP 등 이미지 형식을 무료로 변환하세요.'),
  keywords: t('pages.imageConverter.seo.keywords', '이미지 변환, JPEG, PNG, WebP')
})

// 컴포저블
const toast = useToast()

// 반응형 상태
const fileInputRef = ref(null)
const isDragging = ref(false)
const uploadedFiles = ref([])
const convertedFiles = ref([])
const isConverting = ref(false)

// 변환 설정
const settings = reactive({
  format: 'jpeg',
  quality: 85,
  resize: 'original',
  customWidth: '',
  customHeight: '',
  removeMetadata: true,
  webOptimized: false
})

// 진행률 추적
const conversionProgress = reactive({
  current: 0,
  total: 0,
  percentage: 0,
  currentFile: '',
  startTime: 0
})

// 변환 통계
const conversionStats = ref([])
const originalTotalSize = ref(0)

// 옵션 데이터
const formatOptions = computed(() => [
  { label: t('pages.imageConverter.formatOptions.jpeg'), value: 'jpeg' },
  { label: t('pages.imageConverter.formatOptions.png'), value: 'png' },
  { label: t('pages.imageConverter.formatOptions.webp'), value: 'webp' }
])

const resizeOptions = computed(() => [
  { label: t('pages.imageConverter.resizeOptions.original'), value: 'original' },
  { label: t('pages.imageConverter.resizeOptions.50'), value: '50' },
  { label: t('pages.imageConverter.resizeOptions.25'), value: '25' },
  { label: t('pages.imageConverter.resizeOptions.custom'), value: 'custom' }
])

// ==== 안전한 File type 보정 유틸 (Option A) ====
const inferMime = (ext) => {
  switch (ext) {
    case 'jpg':
    case 'jpeg': return 'image/jpeg'
    case 'png': return 'image/png'
    case 'webp': return 'image/webp'
    case 'gif': return 'image/gif'
    case 'bmp': return 'image/bmp'
    default: return 'application/octet-stream'
  }
}

const normalizeFile = (file) => {
  if (!file || typeof file !== 'object') return null
  // 이미 type 존재하고 문자열이면 그대로 사용
  if (file.type && typeof file.type === 'string' && file.type.length > 0) return file
  const name = typeof file.name === 'string' ? file.name : 'file'
  const ext = name.toLowerCase().split('.').pop() || ''
  const mime = inferMime(ext)
  try {
    // 일부 브라우저에서는 File 생성이 실패할 수 있음
    return new File([file], name, { type: mime })
  } catch {
    // fallback: 직접 속성 주입 (비표준) - 라이브러리 보호 목적
    try { file.type = mime } catch (_) {}
    return file
  }
}
// ==============================================

// 파일 선택
const selectFiles = () => {
  if (fileInputRef.value) {
    fileInputRef.value.click()
  }
}

// 간단한 파일 처리
const handleFileSelect = (event) => {
  const files = event.target.files
  if (files && files.length > 0) {
    processFiles(files)
  }
  // 입력 초기화
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}

// 드래그 앤 드롭
const handleDragEnter = (event) => {
  event.preventDefault()
  isDragging.value = true
}

const handleDragOver = (event) => {
  event.preventDefault()
  isDragging.value = true
}

const handleDragLeave = (event) => {
  event.preventDefault()
  isDragging.value = false
}

const handleDrop = (event) => {
  event.preventDefault()
  isDragging.value = false
  
  const files = event.dataTransfer.files
  if (files && files.length > 0) {
    processFiles(files)
  }
}

// 단순한 파일 처리
const processFiles = async (files) => {
  const validFiles = []
  
  for (let i = 0; i < files.length; i++) {
    const original = files[i]
    const file = normalizeFile(original)
    if (!file) continue
    
    if (file && file.name) {
      const fileName = file.name.toLowerCase()
      const isImage = /\.(jpe?g|png|gif|webp|bmp)$/i.test(fileName)
      if (isImage) {
        validFiles.push(file)
      }
    }
  }
  
  if (validFiles.length > 0) {
    await addFilesToList(validFiles)
    toast.add({
      title: `${validFiles.length}${t('pages.imageConverter.filesUploaded')}`,
      color: 'green'
    })
  }
}

// 파일 목록에 추가 (프리뷰 생성)
const addFilesToList = async (files) => {
  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const preview = await generatePreview(file)
    uploadedFiles.value.push({
      file,
      name: file.name,
      size: file.size,
      preview
    })
  }
}

// 프리뷰 생성
const generatePreview = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target.result)
    reader.onerror = () => resolve(null)
    reader.readAsDataURL(file)
  })
}

// 파일 제거
const removeFile = (index) => {
  uploadedFiles.value.splice(index, 1)
}

const clearAllFiles = () => {
  uploadedFiles.value = []
  originalTotalSize.value = 0
}

// 결과 정리
const clearResults = () => {
  convertedFiles.value.forEach(file => {
    if (file && file.url) {
      URL.revokeObjectURL(file.url)
    }
  })
  convertedFiles.value = []
  conversionStats.value = []
}

// 향상된 변환 시작
const startConversion = async () => {
  if (uploadedFiles.value.length === 0) return
  
  isConverting.value = true
  conversionProgress.current = 0
  conversionProgress.total = uploadedFiles.value.length
  conversionProgress.percentage = 0
  conversionProgress.startTime = Date.now()
  
  // 원본 파일 크기 계산
  originalTotalSize.value = uploadedFiles.value.reduce((sum, item) => sum + item.size, 0)
  
  const results = []
  conversionStats.value = []
  
  for (let i = 0; i < uploadedFiles.value.length; i++) {
    const fileItem = uploadedFiles.value[i]
    
    conversionProgress.current = i + 1
    conversionProgress.currentFile = fileItem.name
    conversionProgress.percentage = ((i + 1) / uploadedFiles.value.length) * 100
    
    try {
      const convertedFile = await convertImageAdvanced(fileItem.file)
      results.push(convertedFile)
      
      // 변환 통계 추가
      conversionStats.value.push({
        originalSize: fileItem.size,
        convertedSize: convertedFile.size,
        reduction: fileItem.size - convertedFile.size
      })
    } catch (error) {
      console.error('변환 실패:', error)
      toast.add({
        title: `${t('pages.imageConverter.conversionFailed')}: ${fileItem.name}`,
        color: 'red'
      })
    }
    
    await new Promise(resolve => setTimeout(resolve, 50))
  }
  
  if (results.length > 0) {
    convertedFiles.value.push(...results)
    toast.add({
      title: `${results.length}${t('pages.imageConverter.conversionCompleteWithCount')}`,
      description: t('pages.imageConverter.totalSizeSaved', { reduction: getSizeReduction() }),
      color: 'green'
    })
  }
  
  isConverting.value = false
  conversionProgress.currentFile = ''
}

// 향상된 이미지 변환 (최적화 기능 포함)
const convertImageAdvanced = (file) => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      
      // 크기 계산
      const { width, height } = calculateDimensions(img.width, img.height)
      canvas.width = width
      canvas.height = height
      
      // 웹 최적화를 위한 캔버스 설정
      if (settings.webOptimized) {
        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = 'high'
      }
      
      // JPEG 배경 (투명도 제거)
      if (settings.format === 'jpeg') {
        ctx.fillStyle = '#FFFFFF'
        ctx.fillRect(0, 0, width, height)
      }
      
      // 이미지 그리기
      ctx.drawImage(img, 0, 0, width, height)
      
      // 품질 설정
      let quality = settings.format === 'png' ? 1 : settings.quality / 100
      
      // 웹 최적화 시 품질 조정
      if (settings.webOptimized && settings.format !== 'png') {
        quality = Math.min(quality, 0.85) // 최대 85%로 제한
      }
      
      const mimeType = `image/${settings.format}`
      
      canvas.toBlob((blob) => {
        if (blob) {
          const extension = settings.format === 'jpeg' ? 'jpg' : settings.format
          const fileName = file.name.replace(/\.[^/.]+$/, '') + '.' + extension
          
          resolve({
            name: fileName,
            size: blob.size,
            originalSize: file.size,
            url: URL.createObjectURL(blob),
            blob,
            optimized: settings.webOptimized,
            metadataRemoved: settings.removeMetadata
          })
        } else {
          reject(new Error(t('pages.imageConverter.conversionError')))
        }
      }, mimeType, quality)
    }
    
    img.onerror = () => reject(new Error(t('pages.imageConverter.imageLoadError')))
    
    const reader = new FileReader()
    reader.onload = (e) => {
      img.src = e.target.result
    }
    reader.readAsDataURL(file)
  })
}

// 크기 계산 개선
const calculateDimensions = (originalWidth, originalHeight) => {
  if (settings.resize === 'original') {
    return { width: originalWidth, height: originalHeight }
  }
  
  if (settings.resize === 'custom') {
    const width = parseInt(settings.customWidth) || originalWidth
    const height = parseInt(settings.customHeight) || originalHeight
    return { width, height }
  }
  
  // 퍼센트 기반 리사이징
  const scale = parseInt(settings.resize) / 100
  return {
    width: Math.round(originalWidth * scale),
    height: Math.round(originalHeight * scale)
  }
}

// 파일 크기 포맷팅
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return (bytes / Math.pow(k, i)).toFixed(1) + ' ' + sizes[i]
}

// 총 크기 계산
const getTotalSize = (files) => {
  const total = files.reduce((sum, file) => sum + file.size, 0)
  return formatFileSize(total)
}

// 용량 절약률 계산
const getSizeReduction = () => {
  if (conversionStats.value.length === 0) return '0%'
  
  const totalOriginal = conversionStats.value.reduce((sum, stat) => sum + stat.originalSize, 0)
  const totalConverted = conversionStats.value.reduce((sum, stat) => sum + stat.convertedSize, 0)
  const reduction = totalOriginal - totalConverted
  
  if (reduction <= 0) return '0%'
  
  const percentage = Math.round((reduction / totalOriginal) * 100)
  return `${percentage}%`
}

// 평균 속도 계산
const getAverageSpeed = () => {
  if (conversionStats.value.length === 0 || !conversionProgress.startTime) return '0 파일/초'
  
  const elapsedTime = (Date.now() - conversionProgress.startTime) / 1000
  const avgSpeed = (conversionStats.value.length / elapsedTime).toFixed(1)
  return `${avgSpeed} 파일/초`
}

// 단순한 다운로드
const downloadFile = (file) => {
  const link = document.createElement('a')
  link.href = file.url
  link.download = file.name
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  toast.add({
    title: t('pages.imageConverter.downloadStarted'),
    color: 'green'
  })
}

const downloadAllFiles = async () => {
  if (convertedFiles.value.length === 0) return
  
  toast.add({
    title: t('pages.imageConverter.bulkDownloadStarted'),
    description: t('pages.imageConverter.filesDownloading', { count: convertedFiles.value.length }),
    color: 'blue'
  })
  
  for (const file of convertedFiles.value) {
    downloadFile(file)
    await new Promise(resolve => setTimeout(resolve, 200))
  }
}

// 파일 미리보기
const previewFile = (file) => {
  window.open(file.url, '_blank')
}

// 파일 제거
const removeConvertedFile = (index) => {
  const file = convertedFiles.value[index]
  if (file && file.url) {
    URL.revokeObjectURL(file.url)
  }
  convertedFiles.value.splice(index, 1)
}

// 정리
onUnmounted(() => {
  convertedFiles.value.forEach(file => {
    if (file && file.url) {
      URL.revokeObjectURL(file.url)
    }
  })
})
</script>