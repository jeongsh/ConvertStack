<template>
  <div class="container mx-auto px-6 py-8">
    <BaseConverter
      :title="t('pages.base64Encoder.title')"
      icon="i-heroicons-lock-closed"
    >
      <template #main-content>
        <div class="space-y-6">
          <!-- 모드 선택 -->
          <div class="flex gap-4 mb-6">
            <UButton
              :variant="mode === 'encode' ? 'solid' : 'outline'"
              color="primary"
              @click="mode = 'encode'"
              class="flex-1"
            >
              {{ t('pages.base64Encoder.encode') }}
            </UButton>
            <UButton
              :variant="mode === 'decode' ? 'solid' : 'outline'"
              color="primary"
              @click="mode = 'decode'"
              class="flex-1"
            >
              {{ t('pages.base64Encoder.decode') }}
            </UButton>
          </div>

          <!-- 입력 영역 -->
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                {{ mode === 'encode' ? t('pages.base64Encoder.plainText') : t('pages.base64Encoder.base64Text') }}
              </label>
              <div class="flex gap-2">
                <UButton
                  size="xs"
                  variant="outline"
                  @click="clearInput"
                  :disabled="!inputText"
                >
                  {{ t('common.clear') }}
                </UButton>
                <UButton
                  size="xs"
                  variant="outline"
                  @click="pasteFromClipboard"
                >
                  {{ t('common.paste') }}
                </UButton>
              </div>
            </div>
            
            <UTextarea
              v-model="inputText"
              :placeholder="mode === 'encode' ? t('pages.base64Encoder.inputPlaceholder') : t('pages.base64Encoder.base64Placeholder')"
              :rows="8"
              resize
              class="font-mono text-sm"
            />

            <div class="text-xs text-gray-500 dark:text-gray-400">
              {{ t('common.characters') }}: {{ inputText.length }}
              <span v-if="mode === 'encode'">
                | {{ t('common.bytes') }}: {{ getByteLength(inputText) }}
              </span>
            </div>
          </div>

          <!-- 결과 영역 -->
          <div v-if="result" class="space-y-4">
            <div class="flex items-center justify-between">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                {{ mode === 'encode' ? t('pages.base64Encoder.base64Result') : t('pages.base64Encoder.plainResult') }}
              </label>
              <div class="flex gap-2">
                <UButton
                  size="xs"
                  variant="outline"
                  @click="copyResult"
                  :disabled="!result"
                >
                  {{ t('common.copy') }}
                </UButton>
                <UButton
                  size="xs"
                  variant="outline"
                  @click="downloadResult"
                  :disabled="!result"
                >
                  {{ t('common.download') }}
                </UButton>
              </div>
            </div>

            <UTextarea
              :value="result"
              readonly
              :rows="8"
              class="font-mono text-sm bg-gray-50 dark:bg-gray-800"
            />

            <div class="text-xs text-gray-500 dark:text-gray-400">
              {{ t('common.characters') }}: {{ result.length }}
              <span v-if="mode === 'decode'">
                | {{ t('common.bytes') }}: {{ getByteLength(result) }}
              </span>
            </div>
          </div>

          <!-- 에러 메시지 -->
          <UAlert
            v-if="error"
            color="red"
            variant="soft"
            :title="t('common.error')"
            :description="error"
          />

          <!-- 파일 업로드 (인코드 모드) -->
          <div v-if="mode === 'encode'" class="border-t pt-6">
            <h3 class="text-lg font-semibold mb-4">{{ t('pages.base64Encoder.fileEncode') }}</h3>
            
            <div
              @drop="handleFileDrop"
              @dragover.prevent
              @dragenter.prevent
              class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-primary-400 transition-colors cursor-pointer"
              :class="{ 'border-primary-400 bg-primary-50 dark:bg-primary-900/20': isDragging }"
              @click="fileInput?.click()"
            >
              <UIcon name="i-heroicons-cloud-arrow-up" class="text-4xl text-gray-400 mb-4" />
              <p class="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                {{ t('pages.base64Encoder.dropFile') }}
              </p>
              <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
                {{ t('pages.base64Encoder.fileSupport') }}
              </p>
              <UButton variant="outline">
                {{ t('common.selectFile') }}
              </UButton>
            </div>

            <input
              ref="fileInput"
              type="file"
              @change="handleFileSelect"
              class="hidden"
            />

            <div v-if="fileResult" class="mt-4 space-y-4">
              <div class="flex items-center justify-between">
                <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {{ t('pages.base64Encoder.fileResult') }}
                </label>
                <div class="flex gap-2">
                  <UButton
                    size="xs"
                    variant="outline"
                    @click="copyFileResult"
                  >
                    {{ t('common.copy') }}
                  </UButton>
                  <UButton
                    size="xs"
                    variant="outline"
                    @click="downloadFileResult"
                  >
                    {{ t('common.download') }}
                  </UButton>
                </div>
              </div>

              <UTextarea
                :value="fileResult"
                readonly
                :rows="6"
                class="font-mono text-sm bg-gray-50 dark:bg-gray-800"
              />

              <div class="text-xs text-gray-500 dark:text-gray-400">
                {{ t('common.characters') }}: {{ fileResult.length }}
                | {{ t('pages.base64Encoder.originalSize') }}: {{ formatFileSize(originalFileSize) }}
              </div>
            </div>
          </div>

          <!-- Base64 정보 -->
          <div class="border-t pt-6">
            <h3 class="text-lg font-semibold mb-4">{{ t('pages.base64Encoder.aboutBase64') }}</h3>
            <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-2 text-sm">
              <p>{{ t('pages.base64Encoder.description') }}</p>
              <ul class="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-400">
                <li>{{ t('pages.base64Encoder.feature1') }}</li>
                <li>{{ t('pages.base64Encoder.feature2') }}</li>
                <li>{{ t('pages.base64Encoder.feature3') }}</li>
                <li>{{ t('pages.base64Encoder.feature4') }}</li>
              </ul>
            </div>
          </div>
        </div>
      </template>
    </BaseConverter>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()

// 반응형 상태
const mode = ref<'encode' | 'decode'>('encode')
const inputText = ref('')
const result = ref('')
const error = ref('')
const fileResult = ref('')
const originalFileSize = ref(0)
const isDragging = ref(false)
const fileInput = ref<HTMLInputElement>()

// SEO 메타 데이터
useSeoMeta({
  title: () => t('pages.base64Encoder.seo.title'),
  description: () => t('pages.base64Encoder.seo.description')
})

// 입력 텍스트 변화 감지
watch([inputText, mode], () => {
  if (inputText.value) {
    processText()
  } else {
    result.value = ''
    error.value = ''
  }
})

// 텍스트 처리
function processText() {
  error.value = ''
  
  try {
    if (mode.value === 'encode') {
      result.value = btoa(unescape(encodeURIComponent(inputText.value)))
    } else {
      // Base64 디코딩
      const decoded = atob(inputText.value)
      result.value = decodeURIComponent(escape(decoded))
    }
  } catch (err) {
    error.value = mode.value === 'encode' 
      ? t('pages.base64Encoder.encodeError')
      : t('pages.base64Encoder.decodeError')
    result.value = ''
  }
}

// 바이트 길이 계산
function getByteLength(text: string): number {
  return new Blob([text]).size
}

// 클립보드에서 붙여넣기
async function pasteFromClipboard() {
  try {
    const text = await navigator.clipboard.readText()
    inputText.value = text
  } catch (err) {
    console.error('Failed to read clipboard:', err)
  }
}

// 입력 클리어
function clearInput() {
  inputText.value = ''
  result.value = ''
  error.value = ''
}

// 결과 복사
async function copyResult() {
  if (result.value) {
    try {
      await navigator.clipboard.writeText(result.value)
      // 토스트 알림 (옵션)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }
}

// 결과 다운로드
function downloadResult() {
  if (result.value) {
    const blob = new Blob([result.value], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = mode.value === 'encode' ? 'encoded.txt' : 'decoded.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }
}

// 파일 드래그 앤 드롭
function handleFileDrop(event: DragEvent) {
  event.preventDefault()
  isDragging.value = false
  
  const files = event.dataTransfer?.files
  if (files && files.length > 0) {
    handleFile(files[0])
  }
}

// 파일 선택
function handleFileSelect(event: Event) {
  const target = event.target as HTMLInputElement
  const files = target.files
  if (files && files.length > 0) {
    handleFile(files[0])
  }
}

// 파일 처리
function handleFile(file: File) {
  originalFileSize.value = file.size
  
  const reader = new FileReader()
  reader.onload = (e) => {
    const result = e.target?.result
    if (typeof result === 'string') {
      // Data URL에서 Base64 부분만 추출
      const base64 = result.split(',')[1]
      fileResult.value = base64
    }
  }
  reader.readAsDataURL(file)
}

// 파일 결과 복사
async function copyFileResult() {
  if (fileResult.value) {
    try {
      await navigator.clipboard.writeText(fileResult.value)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }
}

// 파일 결과 다운로드
function downloadFileResult() {
  if (fileResult.value) {
    const blob = new Blob([fileResult.value], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'file_encoded.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }
}

// 파일 크기 포맷팅
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 드래그 이벤트 핸들러
onMounted(() => {
  document.addEventListener('dragenter', (e) => {
    e.preventDefault()
    isDragging.value = true
  })
  
  document.addEventListener('dragleave', (e) => {
    e.preventDefault()
    if (!e.relatedTarget) {
      isDragging.value = false
    }
  })
  
  document.addEventListener('drop', (e) => {
    e.preventDefault()
    isDragging.value = false
  })
})
</script>
