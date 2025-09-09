<template>
  <div class="container mx-auto px-6 py-8">
    <BaseConverter
      :title="t('pages.jsonFormatter.title')"
      icon="i-heroicons-code-bracket"
    >
      <template #main-content>
        <!-- 메인 작업 영역 -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- 입력 영역 -->
          <div class="space-y-4">
            <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div class="p-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                <div class="flex items-center justify-between">
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                    {{ t('pages.jsonFormatter.inputPlaceholder').replace('...', '') }}
                  </h3>
                  <div class="flex gap-2">
                    <UButton
                      @click="clearInput"
                      variant="ghost"
                      size="sm"
                      class="text-gray-600 dark:text-gray-400"
                    >
                      <UIcon name="i-heroicons-trash" class="mr-2" />
                      {{ t('pages.jsonFormatter.clear') }}
                    </UButton>
                    <UButton
                      @click="loadSampleJson"
                      variant="outline"
                      size="sm"
                    >
                      <UIcon name="i-heroicons-document-text" class="mr-2" />
                      {{ t('common.example') }}
                    </UButton>
                  </div>
                </div>
              </div>
              
              <div class="p-4">
                <textarea
                  v-model="inputJson"
                  @input="formatJson"
                  :placeholder="t('pages.jsonFormatter.inputPlaceholder')"
                  class="w-full h-96 p-4 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-mono text-sm resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  :class="{
                    'border-red-500 dark:border-red-400': hasError,
                    'border-green-500 dark:border-green-400': isValid && inputJson.trim()
                  }"
                />
                
                <!-- 상태 표시 -->
                <div class="mt-3 flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <div v-if="hasError" class="flex items-center gap-2 text-red-600 dark:text-red-400">
                      <UIcon name="i-heroicons-exclamation-circle" class="text-sm" />
                      <span class="text-sm">{{ errorMessage }}</span>
                    </div>
                    <div v-else-if="isValid && inputJson.trim()" class="flex items-center gap-2 text-green-600 dark:text-green-400">
                      <UIcon name="i-heroicons-check-circle" class="text-sm" />
                      <span class="text-sm">{{ t('pages.jsonFormatter.validJson') }}</span>
                    </div>
                    <div v-else class="flex items-center gap-2 text-gray-500">
                      <UIcon name="i-heroicons-information-circle" class="text-sm" />
                      <span class="text-sm">{{ t('pages.jsonFormatter.inputPlaceholder') }}</span>
                    </div>
                  </div>
                  
                  <div class="text-sm text-gray-500">
                    {{ inputJson.length }} {{ t('pages.jsonFormatter.size').split(' ')[1] }}
                  </div>
                </div>
              </div>
            </div>

            <!-- 옵션 -->
            <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
              <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">{{ t('pages.jsonFormatter.format') }} {{ t('common.options') }}</h4>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {{ t('pages.jsonFormatter.indentSize') }}
                  </label>
                  <USelect
                    v-model="indentSize"
                    :options="indentOptions"
                    @update:model-value="formatJson"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {{ t('pages.jsonFormatter.sortKeys') }}
                  </label>
                  <UToggle
                    v-model="sortKeys"
                    @update:model-value="formatJson"
                  />
                  <span class="ml-2 text-sm text-gray-600 dark:text-gray-400">{{ t('pages.jsonFormatter.sortKeys') }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 출력 영역 -->
          <div class="space-y-4">
            <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div class="p-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                <div class="flex items-center justify-between">
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                    {{ t('pages.jsonFormatter.format') }}{{ t('common.result') }}
                  </h3>
                  <div class="flex gap-2">
                    <UButton
                      @click="minifyJson"
                      variant="outline"
                      size="sm"
                      :disabled="!isValid || !inputJson.trim()"
                    >
                      <UIcon name="i-heroicons-minus" class="mr-2" />
                      {{ t('pages.jsonFormatter.minify') }}
                    </UButton>
                    <UButton
                      @click="copyToClipboard"
                      color="primary"
                      size="sm"
                      :disabled="!formattedJson"
                    >
                      <UIcon name="i-heroicons-clipboard" class="mr-2" />
                      {{ t('pages.jsonFormatter.copy') }}
                    </UButton>
                  </div>
                </div>
              </div>
              
              <div class="p-4">
                <pre
                  class="w-full h-96 p-4 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-mono text-sm overflow-auto whitespace-pre-wrap"
                  :class="{
                    'text-green-800 dark:text-green-200': isValid && formattedJson,
                    'text-gray-500': !formattedJson
                  }"
                >{{ formattedJson || t('pages.jsonFormatter.inputPlaceholder').replace('입력', '표시') }}</pre>
                
                <!-- 통계 정보 -->
                <div class="mt-3 flex items-center justify-between">
                  <div class="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <span v-if="jsonStats.objects">{{ t('pages.jsonFormatter.objects') }}: {{ jsonStats.objects }}</span>
                    <span v-if="jsonStats.arrays">{{ t('pages.jsonFormatter.arrays') }}: {{ jsonStats.arrays }}</span>
                    <span v-if="jsonStats.properties">{{ t('pages.jsonFormatter.properties') }}: {{ jsonStats.properties }}</span>
                  </div>
                  
                  <div class="text-sm text-gray-500">
                    {{ formattedJson.length }} {{ t('pages.jsonFormatter.size').split(' ')[1] }}
                  </div>
                </div>
              </div>
            </div>

            <!-- 빠른 액션 -->
            <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
              <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">{{ t('common.quickActions') }}</h4>
              <div class="grid grid-cols-2 gap-3">
                <UButton
                  @click="validateOnly"
                  variant="outline"
                  block
                  :disabled="!inputJson.trim()"
                >
                  <UIcon name="i-heroicons-check-badge" class="mr-2" />
                  {{ t('pages.jsonFormatter.validate') }}
                </UButton>
                <UButton
                  @click="downloadJson"
                  variant="outline"
                  block
                  :disabled="!formattedJson"
                >
                  <UIcon name="i-heroicons-arrow-down-tray" class="mr-2" />
                  {{ t('pages.jsonFormatter.download') }}
                </UButton>
                <UButton
                  @click="escapeJson"
                  variant="outline"
                  block
                  :disabled="!formattedJson"
                >
                  <UIcon name="i-heroicons-shield-check" class="mr-2" />
                  {{ t('pages.jsonFormatter.escape') }}
                </UButton>
                <UButton
                  @click="unescapeJson"
                  variant="outline"
                  block
                  :disabled="!inputJson.trim()"
                >
                  <UIcon name="i-heroicons-shield-exclamation" class="mr-2" />
                  {{ t('pages.jsonFormatter.unescape') }}
                </UButton>
              </div>
            </div>
          </div>
        </div>
      </template>
    </BaseConverter>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n();

// SEO 메타 데이터
useSeoMeta({
  title: () => t("pages.jsonFormatter.seo.title"),
  description: () => t("pages.jsonFormatter.seo.description"),
  keywords: () => t("pages.jsonFormatter.seo.keywords"),
});

// 반응형 데이터
const inputJson = ref('');
const formattedJson = ref('');
const hasError = ref(false);
const errorMessage = ref('');
const isValid = ref(false);
const indentSize = ref('2spaces');
const sortKeys = ref(false);

// 통계 정보
const jsonStats = ref({
  objects: 0,
  arrays: 0,
  properties: 0
});

// 들여쓰기 옵션
const indentOptions = computed(() => [
  { label: '2 ' + t('pages.jsonFormatter.indentSize').split(' ')[1], value: '2spaces' },
  { label: '4 ' + t('pages.jsonFormatter.indentSize').split(' ')[1], value: '4spaces' }
]);

// JSON 포맷팅
const formatJson = () => {
  if (!inputJson.value.trim()) {
    formattedJson.value = '';
    hasError.value = false;
    isValid.value = false;
    resetStats();
    return;
  }

  try {
    let parsed = JSON.parse(inputJson.value);
    
    // 키 정렬 옵션
    if (sortKeys.value) {
      parsed = sortObjectKeys(parsed);
    }
    
    // 들여쓰기 처리: 실제 스페이스 문자열로 변환
    let indent;
    if (indentSize.value === '2spaces') {
      indent = 2;
    } else if (indentSize.value === '4spaces') {
      indent = 4;
    } else {
      indent = 2; // 기본값
    }
    
    formattedJson.value = JSON.stringify(parsed, null, indent);
    hasError.value = false;
    isValid.value = true;
    errorMessage.value = '';
    
    // 통계 계산
    calculateStats(parsed);
    
  } catch (error: any) {
    hasError.value = true;
    isValid.value = false;
    errorMessage.value = error.message;
    formattedJson.value = '';
    resetStats();
  }
};

// 객체 키 정렬
const sortObjectKeys = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map(sortObjectKeys);
  } else if (obj !== null && typeof obj === 'object') {
    const sorted: any = {};
    Object.keys(obj).sort().forEach(key => {
      sorted[key] = sortObjectKeys(obj[key]);
    });
    return sorted;
  }
  return obj;
};

// 통계 계산
const calculateStats = (obj: any) => {
  const stats = { objects: 0, arrays: 0, properties: 0 };
  
  const traverse = (item: any) => {
    if (Array.isArray(item)) {
      stats.arrays++;
      item.forEach(traverse);
    } else if (item !== null && typeof item === 'object') {
      stats.objects++;
      stats.properties += Object.keys(item).length;
      Object.values(item).forEach(traverse);
    }
  };
  
  traverse(obj);
  jsonStats.value = stats;
};

// 통계 초기화
const resetStats = () => {
  jsonStats.value = { objects: 0, arrays: 0, properties: 0 };
};

// JSON 압축
const minifyJson = () => {
  if (!isValid.value) return;
  
  try {
    const parsed = JSON.parse(inputJson.value);
    formattedJson.value = JSON.stringify(parsed);
  } catch (error) {
    console.error('Minify error:', error);
  }
};

// 유효성 검사만 수행
const validateOnly = () => {
  formatJson();
};

// 클립보드 복사
const copyToClipboard = async () => {
  if (!formattedJson.value) return;
  
  try {
    await navigator.clipboard.writeText(formattedJson.value);
    // 복사 성공 알림 (필요시 토스트 추가)
  } catch (error) {
    console.error('Copy failed:', error);
  }
};

// 파일 다운로드
const downloadJson = () => {
  if (!formattedJson.value) return;
  
  const blob = new Blob([formattedJson.value], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'formatted.json';
  link.click();
  URL.revokeObjectURL(url);
};

// JSON 이스케이프 - JSON을 문자열로 변환 (다른 JSON에 포함시킬 때 사용)
const escapeJson = () => {
  if (!formattedJson.value) return;
  // JSON 전체를 문자열로 변환하여 이스케이프 처리
  const escaped = JSON.stringify(formattedJson.value);
  formattedJson.value = escaped;
};

// JSON 언이스케이프 - 이스케이프된 JSON 문자열을 원래 JSON으로 복원
const unescapeJson = () => {
  try {
    let input = inputJson.value.trim();
    
    // 빈 입력 체크
    if (!input) {
      return;
    }
    
    // 여러 단계의 이스케이프 해제 시도
    let unescaped = input;
    let attempts = 0;
    const maxAttempts = 5; // 무한 루프 방지
    
    while (attempts < maxAttempts) {
      try {
        const parsed = JSON.parse(unescaped);
        
        // 파싱된 결과가 문자열이면 계속 언이스케이프
        if (typeof parsed === 'string') {
          unescaped = parsed;
          attempts++;
        } else {
          // 객체나 배열이 나오면 최종 결과
          inputJson.value = JSON.stringify(parsed, null, 2);
          formatJson();
          return;
        }
      } catch (e) {
        // 더 이상 파싱할 수 없으면 현재까지의 결과 사용
        break;
      }
    }
    
    // 최종적으로 파싱된 문자열이 있다면 사용
    if (unescaped !== input) {
      try {
        const finalParsed = JSON.parse(unescaped);
        inputJson.value = JSON.stringify(finalParsed, null, 2);
        formatJson();
      } catch (e) {
        // 최종 파싱 실패 시 문자열 자체를 JSON으로 표시
        inputJson.value = unescaped;
        formatJson();
      }
    }
    
  } catch (error) {
    console.error('Unescape error:', error);
    // 사용자에게 에러 표시
    hasError.value = true;
    errorMessage.value = t('pages.jsonFormatter.error');
  }
};

// 입력 지우기
const clearInput = () => {
  inputJson.value = '';
  formattedJson.value = '';
  hasError.value = false;
  isValid.value = false;
  resetStats();
};

// 예제 JSON 로드
const loadSampleJson = () => {
  inputJson.value = `{
  "name": "ConvertStack",
  "version": "1.0.0",
  "description": "온라인 변환 도구",
  "tools": [
    {
      "id": 1,
      "name": "JSON 포매터",
      "category": "개발도구",
      "features": ["포맷팅", "유효성 검사", "압축"]
    },
    {
      "id": 2,
      "name": "색상 변환기",
      "category": "디자인",
      "features": ["HEX", "RGB", "HSL"]
    }
  ],
  "settings": {
    "theme": "dark",
    "language": "ko",
    "autoSave": true
  }
}`;
  formatJson();
};

// 파일 크기 포맷
const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};
</script>

<style scoped>
/* 코드 하이라이팅 스타일 */
pre {
  tab-size: 2;
}

/* 스크롤바 커스텀 */
pre::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

pre::-webkit-scrollbar-track {
  background: transparent;
}

pre::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

pre::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

.dark pre::-webkit-scrollbar-thumb {
  background: #475569;
}

.dark pre::-webkit-scrollbar-thumb:hover {
  background: #64748b;
}
</style>
