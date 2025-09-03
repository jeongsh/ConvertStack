<template>
  <div class="pdf-thumbnail-viewer">
    <div v-if="isLoading" class="flex items-center justify-center p-8">
      <div class="flex items-center gap-3">
        <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
        <span>{{ $t('pages.pdfConverter.thumbnailViewer.loading') }}</span>
      </div>
    </div>

    <div v-else-if="thumbnails.length > 0" class="space-y-4">
      <!-- 선택 도구 -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <UButton
            size="sm"
            color="primary"
            variant="solid"
            @click="selectAll"
          >
            {{ $t('pages.pdfConverter.thumbnailViewer.selectAll') }}
          </UButton>
          <UButton
            size="sm"
            color="gray"
            variant="outline"
            @click="clearSelection"
          >
            {{ $t('pages.pdfConverter.thumbnailViewer.clearSelection') }}
          </UButton>
          <span class="text-sm text-gray-600">
            {{ selectedPages.length }}{{ $t('pages.pdfConverter.thumbnailViewer.pagesSelected') }}
          </span>
        </div>
        
        <div class="flex items-center gap-2">
          <span class="text-sm text-gray-600">
            {{ $t('pages.pdfConverter.thumbnailViewer.totalPages') }} {{ totalPages }}{{ $t('pages.pdfConverter.thumbnailViewer.pagesUnit') }}
          </span>
        </div>
      </div>

      <!-- 썸네일 그리드 -->
      <div 
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
        @mousedown="startSelection"
        @mousemove="updateSelection"
        @mouseup="endSelection"
        @mouseleave="endSelection"
      >
        <div
          v-for="(thumbnail, index) in thumbnails"
          :key="index"
          :data-page-index="index"
          class="thumbnail-item relative cursor-pointer transition-all duration-200"
          :class="{
            'selected': selectedPages.includes(index),
            'selecting': isSelecting && isPageInSelectionRange(index)
          }"
        >
          <!-- 썸네일 이미지 -->
          <div class="relative border-2 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            :class="{
              'border-primary bg-primary/10': selectedPages.includes(index) || (isSelecting && isPageInSelectionRange(index)),
              'border-gray-200 dark:border-gray-700': !selectedPages.includes(index) && !(isSelecting && isPageInSelectionRange(index))
            }">
            <img
              :src="thumbnail.dataUrl"
              :alt="`${$t('pages.pdfConverter.thumbnailViewer.pageAlt')} ${index + 1}`"
              class="w-full h-auto block"
              draggable="false"
            />
            
            <!-- 페이지 번호 -->
            <div class="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
              {{ index + 1 }}
            </div>
            
            <!-- 선택 체크박스 -->
            <div class="absolute top-2 right-2">
              <div
                class="w-5 h-5 rounded border-2 flex items-center justify-center transition-colors"
                :class="{
                  'bg-primary border-primary': selectedPages.includes(index) || (isSelecting && isPageInSelectionRange(index)),
                  'bg-white border-gray-300': !selectedPages.includes(index) && !(isSelecting && isPageInSelectionRange(index))
                }"
              >
                <UIcon 
                  v-if="selectedPages.includes(index) || (isSelecting && isPageInSelectionRange(index))"
                  name="i-heroicons-check" 
                  class="text-white text-xs"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 선택된 범위 정보 -->
      <div v-if="selectedPages.length > 0" class="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h4 class="font-semibold mb-2">{{ $t('pages.pdfConverter.thumbnailViewer.selectedPages') }}</h4>
        <p class="text-sm text-gray-600 dark:text-gray-300">
          {{ getSelectedRangesText() }}
        </p>
        <div class="mt-3 flex gap-2">
          <UButton
            color="primary"
            size="sm"
            @click="handleSplitSelected()"
            :disabled="selectedPages.length === 0"
          >
            {{ $t('pages.pdfConverter.thumbnailViewer.splitSelected') }}
          </UButton>
        </div>
      </div>
    </div>

    <div v-else-if="error" class="text-center p-8 text-red-600">
      <UIcon name="i-heroicons-exclamation-triangle" class="text-4xl mb-2" />
      <p>{{ $t('pages.pdfConverter.thumbnailViewer.loadError') }}</p>
      <p class="text-sm mt-1">{{ error }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
// PDF.js를 동적으로 import하여 클라이언트에서만 로드
let pdfjsLib: any = null

// 브라우저 환경에서만 PDF.js 초기화
const initPdfjs = async () => {
  if (process.client && !pdfjsLib) {
    pdfjsLib = await import('pdfjs-dist')
    
    // 로컬 파일을 data URI로 변환하여 사용
    try {
      const workerResponse = await fetch('/pdfjs/pdf.worker.min.mjs')
      const workerCode = await workerResponse.text()
      const workerBlob = new Blob([workerCode], { type: 'application/javascript' })
      pdfjsLib.GlobalWorkerOptions.workerSrc = URL.createObjectURL(workerBlob)
    } catch (error) {
      console.warn('Local worker load failed, using default CDN')
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`
    }
  }
}

interface ThumbnailData {
  dataUrl: string
  pageNumber: number
}

interface Props {
  file: File | null
}

interface Emits {
  (e: 'split-selected', ranges: Array<{start: number, end: number}>): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const { t } = useI18n()

// 상태 관리
const thumbnails = ref<ThumbnailData[]>([])
const isLoading = ref(false)
const error = ref('')
const totalPages = ref(0)

// 선택 관련 상태
const selectedPages = ref<number[]>([])
const isSelecting = ref(false)
const selectionStart = ref<number>(-1)
const selectionEnd = ref<number>(-1)

// PDF 로드 및 썸네일 생성
const loadPdfThumbnails = async (file: File) => {
  if (!file || !process.client) return

  isLoading.value = true
  error.value = ''
  thumbnails.value = []
  selectedPages.value = []

  try {
    // PDF.js 초기화
    await initPdfjs()
    
    if (!pdfjsLib) {
      throw new Error(t('pages.pdfConverter.thumbnailViewer.pdfjsLoadFailed'))
    }

    const arrayBuffer = await file.arrayBuffer()
    const pdf = await pdfjsLib.getDocument(arrayBuffer).promise
    totalPages.value = pdf.numPages

    const thumbnailPromises = []
    
    for (let i = 1; i <= pdf.numPages; i++) {
      thumbnailPromises.push(renderPageThumbnail(pdf, i))
    }

    thumbnails.value = await Promise.all(thumbnailPromises)
  } catch (err) {
    console.error('PDF load error:', err)
    error.value = t('pages.pdfConverter.thumbnailViewer.unsupportedFile')
  } finally {
    isLoading.value = false
  }
}

// 개별 페이지 썸네일 렌더링
const renderPageThumbnail = async (pdf: any, pageNumber: number): Promise<ThumbnailData> => {
  const page = await pdf.getPage(pageNumber)
  const viewport = page.getViewport({ scale: 0.3 }) // 썸네일 크기 조정
  
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')!
  
  canvas.height = viewport.height
  canvas.width = viewport.width
  
  await page.render({
    canvasContext: context,
    viewport: viewport
  }).promise
  
  return {
    dataUrl: canvas.toDataURL('image/jpeg', 0.8),
    pageNumber
  }
}

// 선택 관리
const togglePage = (pageIndex: number) => {
  const index = selectedPages.value.indexOf(pageIndex)
  if (index > -1) {
    selectedPages.value.splice(index, 1)
  } else {
    selectedPages.value.push(pageIndex)
  }
  selectedPages.value.sort((a, b) => a - b)
}

const selectAll = () => {
  selectedPages.value = Array.from({ length: totalPages.value }, (_, i) => i)
}

const clearSelection = () => {
  selectedPages.value = []
}

// 드래그 선택
const startSelection = (event: MouseEvent) => {
  if (event.target && (event.target as HTMLElement).closest('.thumbnail-item')) {
    const pageIndex = parseInt((event.target as HTMLElement).closest('.thumbnail-item')?.getAttribute('data-page-index') || '0')
    isSelecting.value = true
    selectionStart.value = pageIndex
    selectionEnd.value = pageIndex
    
    // 단순 클릭인지 드래그인지 구분하기 위해 초기화 방지
    // Shift 키가 눌려있지 않고 드래그가 시작될 때만 기존 선택 초기화
  }
}

const updateSelection = (event: MouseEvent) => {
  if (isSelecting.value && event.target) {
    const thumbnailItem = (event.target as HTMLElement).closest('.thumbnail-item')
    if (thumbnailItem) {
      const pageIndex = parseInt(thumbnailItem.getAttribute('data-page-index') || '0')
      selectionEnd.value = pageIndex
    }
  }
}

const endSelection = () => {
  if (isSelecting.value) {
    const start = Math.min(selectionStart.value, selectionEnd.value)
    const end = Math.max(selectionStart.value, selectionEnd.value)
    
    // 실제로 드래그가 발생했는지 확인 (시작과 끝이 다르거나 마우스가 움직였을 때)
    if (start !== end) {
      // 드래그 선택: 기존 선택을 유지하고 새로운 범위 추가
      for (let i = start; i <= end; i++) {
        if (!selectedPages.value.includes(i)) {
          selectedPages.value.push(i)
        }
      }
    } else {
      // 단순 클릭: 개별 토글
      const index = selectedPages.value.indexOf(start)
      if (index > -1) {
        selectedPages.value.splice(index, 1)
      } else {
        selectedPages.value.push(start)
      }
    }
    
    selectedPages.value.sort((a, b) => a - b)
    
    isSelecting.value = false
    selectionStart.value = -1
    selectionEnd.value = -1
  }
}

const isPageInSelectionRange = (pageIndex: number): boolean => {
  if (!isSelecting.value) return false
  const start = Math.min(selectionStart.value, selectionEnd.value)
  const end = Math.max(selectionStart.value, selectionEnd.value)
  return pageIndex >= start && pageIndex <= end
}

// 선택된 범위를 텍스트로 변환
const getSelectedRangesText = (): string => {
  if (selectedPages.value.length === 0) return ''
  
  const ranges = getSelectedRanges()
  return ranges.map(range => 
    range.start === range.end 
      ? `${range.start + 1}` 
      : `${range.start + 1}-${range.end + 1}`
  ).join(', ')
}

// 선택된 페이지를 연속 범위로 그룹화
const getSelectedRanges = () => {
  if (selectedPages.value.length === 0) return []
  
  const ranges: Array<{start: number, end: number}> = []
  let start = selectedPages.value[0]
  let end = selectedPages.value[0]
  
  for (let i = 1; i < selectedPages.value.length; i++) {
    if (selectedPages.value[i] === end + 1) {
      end = selectedPages.value[i]
    } else {
      ranges.push({ start, end })
      start = selectedPages.value[i]
      end = selectedPages.value[i]
    }
  }
  ranges.push({ start, end })
  
  return ranges
}

// 선택된 페이지 분할 처리
const handleSplitSelected = () => {
  // 선택된 페이지를 연속 범위로 그룹화하여 배열로 전달
  const ranges = getSelectedRanges()
  
  // 부모 컴포넌트에 전달
  emit('split-selected', ranges)
  
  // 선택 해제
  selectedPages.value = []
}

// 파일 변경 감지
watch(() => props.file, (newFile) => {
  if (newFile) {
    loadPdfThumbnails(newFile)
  }
}, { immediate: true })
</script>

<style scoped>
.thumbnail-item.selected {
  transform: scale(1.05);
}

.thumbnail-item.selecting {
  transform: scale(1.02);
}

.pdf-thumbnail-viewer {
  user-select: none;
}

/* 드래그 선택 시 텍스트 선택 방지 */
.pdf-thumbnail-viewer * {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
</style>