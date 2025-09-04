<template>
  <div class="container mx-auto px-6 py-8">
    <div class="flex gap-20 max-w-8xl mx-auto">
      <!-- 좌측 사이드바 광고 -->
      <div class="hidden xl:block w-40 flex-shrink-0">
        <div class="sticky top-6">
          <GoogleAd type="sidebar" width="160px" height="600px" />
        </div>
      </div>

      <!-- 메인 콘텐츠 -->
      <div class="flex-1 min-w-0">
        <div class="w-full max-w-4xl mx-auto">

          <!-- 기능 선택 탭 -->
          <div class="mb-8">
            <UTabs v-model="selectedTab" :items="tabs" class="w-full" />
          </div>

          <!-- PDF 병합 -->
          <div v-if="selectedTab === 0" class="space-y-6">
            <UCard>
              <template #header>
                <div class="flex items-center gap-3">
                  <UIcon
                    name="i-heroicons-document-duplicate"
                    class="text-2xl text-blue-500"
                  />
                  <h2 class="text-xl font-semibold">
                    {{ $t("pages.pdfConverter.merge.title") }}
                  </h2>
                </div>
              </template>

              <div class="space-y-4">
                <div
                  class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors"
                  @click="triggerFileUpload('merge')"
                  @dragover.prevent
                  @drop.prevent="handleFileDrop($event, 'merge')"
                >
                  <UIcon
                    name="i-heroicons-document-plus"
                    class="text-4xl text-gray-400 mb-4 mx-auto"
                  />
                  <p class="text-gray-600 dark:text-gray-300 mb-2">
                    {{ $t("pages.pdfConverter.merge.dragMultipleFiles") }}
                  </p>
                  <p class="text-sm text-gray-500">
                    {{ $t("pages.pdfConverter.merge.mergeOrderNote") }}
                  </p>
                </div>

                <!-- 업로드된 파일 목록 (병합용) -->
                <div v-if="mergeFiles.length" class="space-y-2">
                  <h4 class="font-semibold">
                    {{ $t("pages.pdfConverter.merge.fileCount") }} ({{
                      mergeFiles.length
                    }}{{ $t("pages.pdfConverter.merge.filesCount") }}):
                  </h4>
                  <div class="space-y-2 max-h-60 overflow-y-auto">
                    <div
                      v-for="(file, index) in mergeFiles"
                      :key="index"
                      class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <div class="flex items-center gap-3">
                        <UIcon
                          name="i-heroicons-document"
                          class="text-red-500"
                        />
                        <div>
                          <p class="text-sm font-medium">{{ file.name }}</p>
                          <p class="text-xs text-gray-500">
                            {{ formatFileSize(file.size) }}
                          </p>
                        </div>
                      </div>
                      <div class="flex items-center gap-2">
                        <UButton
                          size="xs"
                          variant="ghost"
                          @click="moveFileUp(index)"
                          :disabled="index === 0"
                        >
                          <UIcon name="i-heroicons-arrow-up" />
                        </UButton>
                        <UButton
                          size="xs"
                          variant="ghost"
                          @click="moveFileDown(index)"
                          :disabled="index === mergeFiles.length - 1"
                        >
                          <UIcon name="i-heroicons-arrow-down" />
                        </UButton>
                        <UButton
                          size="xs"
                          color="red"
                          variant="ghost"
                          @click="removeFile(index, 'merge')"
                        >
                          <UIcon name="i-heroicons-x-mark" />
                        </UButton>
                      </div>
                    </div>
                  </div>

                  <UButton
                    color="blue"
                    size="lg"
                    block
                    :loading="isProcessing"
                    :disabled="mergeFiles.length < 2"
                    @click="mergePDFs"
                  >
                    {{
                      isProcessing
                        ? $t("pages.pdfConverter.merge.merging")
                        : $t("pages.pdfConverter.merge.startMerge")
                    }}
                  </UButton>
                </div>
              </div>
            </UCard>
          </div>

          <!-- PDF 분할 -->
          <div v-if="selectedTab === 1" class="space-y-6">
            <UCard>
              <template #header>
                <div class="flex items-center gap-3">
                  <UIcon
                    name="i-heroicons-scissors"
                    class="text-2xl text-green-500"
                  />
                  <h2 class="text-xl font-semibold">
                    {{ $t("pages.pdfConverter.split.title") }}
                  </h2>
                </div>
              </template>

              <div class="space-y-4">
                <div
                  class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-green-500 transition-colors"
                  @click="triggerFileUpload('split')"
                  @dragover.prevent
                  @drop.prevent="handleFileDrop($event, 'split')"
                >
                  <UIcon
                    name="i-heroicons-document-arrow-up"
                    class="text-4xl text-gray-400 mb-4 mx-auto"
                  />
                  <p class="text-gray-600 dark:text-gray-300 mb-2">
                    {{ $t("pages.pdfConverter.split.dragSingleFile") }}
                  </p>
                </div>

                <div v-if="splitFile" class="space-y-6">
                  <div class="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-3">
                        <UIcon
                          name="i-heroicons-document"
                          class="text-red-500"
                        />
                        <div>
                          <p class="text-sm font-medium">
                            {{ splitFile.name }}
                          </p>
                          <p class="text-xs text-gray-500">
                            {{ formatFileSize(splitFile.size) }}
                          </p>
                        </div>
                      </div>
                      <UButton
                        size="xs"
                        color="red"
                        variant="ghost"
                        @click="clearSplitFile"
                      >
                        <UIcon name="i-heroicons-x-mark" />
                      </UButton>
                    </div>
                  </div>

                  <UFormGroup :label="$t('pages.pdfConverter.split.splitMode')">
                    <URadioGroup v-model="splitMode" :options="splitOptions" />
                  </UFormGroup>

                  <!-- 썸네일 뷰어를 사용한 시각적 선택 -->
                  <div v-if="splitMode === 'visual'">
                    <div class="border rounded-lg p-4">
                      <h4 class="font-semibold mb-4 flex items-center gap-2">
                        <UIcon name="i-heroicons-photo" class="text-primary" />
                        {{ $t("pages.pdfConverter.split.pageSelection") }}
                      </h4>
                      <ClientOnly>
                        <PdfThumbnailViewer
                          :file="splitFile"
                          @split-selected="handleVisualSplit"
                        />
                        <template #fallback>
                          <div class="flex items-center justify-center p-8">
                            <div
                              class="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mr-3"
                            ></div>
                            <span>{{
                              $t("pages.pdfConverter.split.thumbnailLoading")
                            }}</span>
                          </div>
                        </template>
                      </ClientOnly>
                    </div>
                  </div>

                  <!-- 기존 텍스트 기반 범위 입력 -->
                  <div v-if="splitMode === 'pages'">
                    <UFormGroup
                      :label="$t('pages.pdfConverter.split.pageRangeLabel')"
                    >
                      <UInput
                        v-model="pageRanges"
                        :placeholder="
                          $t('pages.pdfConverter.split.pageRangePlaceholder')
                        "
                      />
                      <template #help>
                        <span class="text-xs text-gray-500">
                          {{ $t("pages.pdfConverter.split.pageRangeHelp") }}
                        </span>
                      </template>
                    </UFormGroup>
                  </div>

                  <div v-if="splitMode === 'size'">
                    <UFormGroup
                      :label="$t('pages.pdfConverter.split.maxPagesPerFile')"
                    >
                      <UInput
                        v-model.number="pagesPerFile"
                        type="number"
                        :min="1"
                        placeholder="5"
                      />
                    </UFormGroup>
                  </div>

                  <!-- 선택된 범위 미리보기 -->
                  <div
                    v-if="visualSelectedRanges.length > 0"
                    class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
                  >
                    <h5
                      class="font-semibold text-blue-800 dark:text-blue-200 mb-2"
                    >
                      {{ $t("pages.pdfConverter.split.selectedRanges") }}:
                    </h5>
                    <div class="flex flex-wrap gap-2">
                      <UBadge
                        v-for="(range, index) in visualSelectedRanges"
                        :key="index"
                        color="blue"
                        variant="soft"
                      >
                        {{ $t("pages.pdfConverter.split.pageLabel") }}
                        {{ range.start + 1
                        }}{{
                          range.start !== range.end ? `-${range.end + 1}` : ""
                        }}
                      </UBadge>
                    </div>
                  </div>

                  <UButton
                    color="green"
                    size="lg"
                    block
                    :loading="isProcessing"
                    @click="splitPDF"
                    :disabled="
                      splitMode === 'visual' &&
                      visualSelectedRanges.length === 0
                    "
                  >
                    {{
                      isProcessing
                        ? $t("pages.pdfConverter.split.splitting")
                        : $t("pages.pdfConverter.split.startSplit")
                    }}
                  </UButton>
                </div>
              </div>
            </UCard>
          </div>

          <!-- PDF 압축 -->
          <div v-if="selectedTab === 2" class="space-y-6">
            <UCard>
              <template #header>
                <div class="flex items-center gap-3">
                  <UIcon
                    name="i-heroicons-archive-box-arrow-down"
                    class="text-2xl text-purple-500"
                  />
                  <h2 class="text-xl font-semibold">
                    {{ $t("pages.pdfConverter.compress.title") }}
                  </h2>
                </div>
              </template>

              <div class="space-y-4">
                <div
                  class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-purple-500 transition-colors"
                  @click="triggerFileUpload('compress')"
                  @dragover.prevent
                  @drop.prevent="handleFileDrop($event, 'compress')"
                >
                  <UIcon
                    name="i-heroicons-document-arrow-up"
                    class="text-4xl text-gray-400 mb-4 mx-auto"
                  />
                  <p class="text-gray-600 dark:text-gray-300 mb-2">
                    {{ $t("pages.pdfConverter.compress.dragFileToCompress") }}
                  </p>
                </div>

                <div v-if="compressFile" class="space-y-4">
                  <div class="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-3">
                        <UIcon
                          name="i-heroicons-document"
                          class="text-red-500"
                        />
                        <div>
                          <p class="text-sm font-medium">
                            {{ compressFile.name }}
                          </p>
                          <p class="text-xs text-gray-500">
                            {{ formatFileSize(compressFile.size) }}
                          </p>
                        </div>
                      </div>
                      <UButton
                        size="xs"
                        color="red"
                        variant="ghost"
                        @click="compressFile = null"
                      >
                        <UIcon name="i-heroicons-x-mark" />
                      </UButton>
                    </div>
                  </div>

                  <UFormGroup
                    :label="$t('pages.pdfConverter.compress.compressionLevel')"
                  >
                    <USelectMenu
                      v-model="compressionLevel"
                      :options="compressionOptions"
                      value-attribute="value"
                      option-attribute="label"
                    />
                  </UFormGroup>

                  <UButton
                    color="purple"
                    size="lg"
                    block
                    :loading="isProcessing"
                    @click="compressPDF"
                  >
                    {{
                      isProcessing
                        ? $t("pages.pdfConverter.compress.compressing")
                        : $t("pages.pdfConverter.compress.startCompress")
                    }}
                  </UButton>
                </div>
              </div>
            </UCard>
          </div>

          <!-- PDF ↔ Word 변환 -->
          <div v-if="selectedTab === 3" class="space-y-6">
            <UCard>
              <template #header>
                <div class="flex items-center gap-3">
                  <UIcon
                    name="i-heroicons-arrow-path"
                    class="text-2xl text-orange-500"
                  />
                  <h2 class="text-xl font-semibold">
                    {{ $t("pages.pdfConverter.convert.title") }}
                  </h2>
                </div>
              </template>

              <div class="space-y-4">
                <UFormGroup
                  :label="$t('pages.pdfConverter.convert.conversionDirection')"
                >
                  <URadioGroup
                    v-model="convertMode"
                    :options="convertOptions"
                  />
                </UFormGroup>

                <div
                  class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-orange-500 transition-colors"
                  @click="triggerFileUpload('convert')"
                  @dragover.prevent
                  @drop.prevent="handleFileDrop($event, 'convert')"
                >
                  <UIcon
                    name="i-heroicons-document-arrow-up"
                    class="text-4xl text-gray-400 mb-4 mx-auto"
                  />
                  <p class="text-gray-600 dark:text-gray-300 mb-2">
                    {{
                      convertMode === "pdf-to-word"
                        ? $t("pages.pdfConverter.convert.selectPdfFile")
                        : $t("pages.pdfConverter.convert.selectWordFile")
                    }}
                  </p>
                  <p class="text-sm text-gray-500">
                    {{ $t("pages.pdfConverter.convert.supportedFormats") }}:
                    {{ convertMode === "pdf-to-word" ? ".pdf" : ".docx, .doc" }}
                  </p>
                </div>

                <div v-if="convertFile" class="space-y-4">
                  <div class="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-3">
                        <UIcon
                          :name="getFileIcon(convertFile.type)"
                          class="text-orange-500"
                        />
                        <div>
                          <p class="text-sm font-medium">
                            {{ convertFile.name }}
                          </p>
                          <p class="text-xs text-gray-500">
                            {{ formatFileSize(convertFile.size) }}
                          </p>
                        </div>
                      </div>
                      <UButton
                        size="xs"
                        color="red"
                        variant="ghost"
                        @click="convertFile = null"
                      >
                        <UIcon name="i-heroicons-x-mark" />
                      </UButton>
                    </div>
                  </div>

                  <UButton
                    color="orange"
                    size="lg"
                    block
                    :loading="isProcessing"
                    @click="convertPDF"
                  >
                    {{
                      isProcessing
                        ? $t("pages.pdfConverter.convert.converting")
                        : convertMode === "pdf-to-word"
                        ? $t("pages.pdfConverter.convert.convertToWord")
                        : $t("pages.pdfConverter.convert.convertToPdf")
                    }}
                  </UButton>
                </div>
              </div>
            </UCard>
          </div>

          <!-- 결과 섹션 -->
          <div v-if="processedFiles.length" class="mt-8">
            <UCard>
              <template #header>
                <div class="flex justify-between items-center">
                  <h3 class="text-lg font-semibold">
                    {{ $t("pages.pdfConverter.results") }}
                  </h3>
                  <UButton
                    v-if="processedFiles.length > 1"
                    color="primary"
                    @click="downloadAll"
                  >
                    {{ $t("pages.pdfConverter.downloadAll") }}
                  </UButton>
                </div>
              </template>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  v-for="(result, index) in processedFiles"
                  :key="index"
                  class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center gap-2 flex-1 min-w-0">
                      <UIcon
                        :name="getFileIcon(result.type)"
                        class="text-primary flex-shrink-0"
                      />
                      <span class="font-medium truncate" :title="result.name">
                        {{ truncateFileName(result.name) }}
                      </span>
                    </div>
                    <UBadge color="green" class="flex-shrink-0">{{
                      $t("pages.pdfConverter.completed")
                    }}</UBadge>
                  </div>

                  <div class="flex gap-2">
                    <UButton
                      size="sm"
                      color="primary"
                      @click="downloadFile(result)"
                    >
                      {{ $t("common.download") }}
                    </UButton>
                  </div>
                </div>
              </div>
            </UCard>
          </div>

          <!-- 파일 선택을 위한 숨겨진 input -->
          <input
            ref="fileInput"
            type="file"
            multiple
            class="hidden"
            @change="handleFileSelect"
          />
        </div>
      </div>

      <!-- 우측 사이드바 광고 -->
      <div class="hidden xl:block w-40 flex-shrink-0">
        <div class="sticky top-6">
          <GoogleAd type="sidebar" width="160px" height="600px" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePdfConverter } from "~/stores/pdfConverter";

const { t } = useI18n();

useSeoMeta({
  title: t("pages.pdfConverter.seo.title", "PDF 도구 | ConvertStack"),
  description: t(
    "pages.pdfConverter.seo.description",
    "PDF 파일을 병합, 분할, 압축하고 Word 문서와 변환하는 무료 온라인 도구. 간편하고 안전한 PDF 처리 솔루션."
  ),
  keywords: t(
    "pages.pdfConverter.seo.keywords",
    "PDF병합, PDF분할, PDF압축, PDF워드변환, Word PDF변환, 무료PDF도구, 온라인PDF변환"
  ),
  ogTitle: t("pages.pdfConverter.seo.title", "PDF 도구 | ConvertStack"),
  ogDescription: t(
    "pages.pdfConverter.seo.description",
    "PDF 파일을 병합, 분할, 압축하고 Word 문서와 변환하는 무료 온라인 도구"
  ),
  ogImage: "/og-pdf-converter.png",
});

const pdfConverter = usePdfConverter();
const fileInput = ref<HTMLInputElement>();
const toast = useToast();

// 상태 관리
const selectedTab = ref(0);
const isProcessing = ref(false);
const currentOperation = ref("");

// 탭 정의
const tabs = computed(() => [
  {
    label: t("pages.pdfConverter.tabs.merge"),
    icon: "i-heroicons-document-duplicate",
  },
  { label: t("pages.pdfConverter.tabs.split"), icon: "i-heroicons-scissors" },
  {
    label: t("pages.pdfConverter.tabs.compress"),
    icon: "i-heroicons-archive-box-arrow-down",
  },
  {
    label: t("pages.pdfConverter.tabs.convert"),
    icon: "i-heroicons-arrow-path",
  },
]);

// 파일 상태
const mergeFiles = ref<File[]>([]);
const splitFile = ref<File | null>(null);
const compressFile = ref<File | null>(null);
const convertFile = ref<File | null>(null);
const processedFiles = ref<any[]>([]);

// 분할 옵션
const splitMode = ref("visual");
const splitOptions = computed(() => [
  { label: t("pages.pdfConverter.split.visualSplit"), value: "visual" },
  { label: t("pages.pdfConverter.split.pageRange"), value: "pages" },
  { label: t("pages.pdfConverter.split.equalSplit"), value: "size" },
]);
const pageRanges = ref("");
const pagesPerFile = ref(5);
const visualSelectedRanges = ref<Array<{ start: number; end: number }>>([]);

// 압축 옵션
const compressionLevel = ref("medium");
const compressionOptions = computed(() => [
  { label: t("pages.pdfConverter.compressionOptions.low"), value: "low" },
  { label: t("pages.pdfConverter.compressionOptions.medium"), value: "medium" },
  { label: t("pages.pdfConverter.compressionOptions.high"), value: "high" },
]);

// 변환 옵션
const convertMode = ref("pdf-to-word");
const convertOptions = computed(() => [
  {
    label: t("pages.pdfConverter.convertOptions.pdfToWord"),
    value: "pdf-to-word",
  },
  {
    label: t("pages.pdfConverter.convertOptions.wordToPdf"),
    value: "word-to-pdf",
  },
]);

// 메서드
const triggerFileUpload = (operation: string) => {
  currentOperation.value = operation;

  // 파일 타입 필터 설정
  if (
    operation === "merge" ||
    operation === "split" ||
    operation === "compress"
  ) {
    fileInput.value!.accept = ".pdf";
    fileInput.value!.multiple = operation === "merge";
  } else if (operation === "convert") {
    if (convertMode.value === "pdf-to-word") {
      fileInput.value!.accept = ".pdf";
    } else {
      fileInput.value!.accept = ".docx,.doc";
    }
    fileInput.value!.multiple = false;
  }

  fileInput.value?.click();
};

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files) {
    const files = Array.from(target.files);
    handleFiles(files, currentOperation.value);
  }
};

const handleFileDrop = (event: DragEvent, operation: string) => {
  const files = event.dataTransfer?.files;
  if (files) {
    handleFiles(Array.from(files), operation);
  }
};

const handleFiles = (files: File[], operation: string) => {
  switch (operation) {
    case "merge":
      mergeFiles.value.push(
        ...files.filter((f) => f.type === "application/pdf")
      );
      break;
    case "split":
      if (files[0]?.type === "application/pdf") {
        splitFile.value = files[0];
      }
      break;
    case "compress":
      if (files[0]?.type === "application/pdf") {
        compressFile.value = files[0];
      }
      break;
    case "convert":
      convertFile.value = files[0];
      break;
  }
};

const removeFile = (index: number, operation: string) => {
  if (operation === "merge") {
    mergeFiles.value.splice(index, 1);
  }
};

const moveFileUp = (index: number) => {
  if (index > 0) {
    const files = [...mergeFiles.value];
    [files[index - 1], files[index]] = [files[index], files[index - 1]];
    mergeFiles.value = files;
  }
};

const moveFileDown = (index: number) => {
  if (index < mergeFiles.value.length - 1) {
    const files = [...mergeFiles.value];
    [files[index], files[index + 1]] = [files[index + 1], files[index]];
    mergeFiles.value = files;
  }
};

const mergePDFs = async () => {
  if (mergeFiles.value.length < 2) return;

  isProcessing.value = true;
  try {
    const result = await pdfConverter.mergePDFs(mergeFiles.value);
    processedFiles.value = [...processedFiles.value, result];
  } catch (error) {
    console.error("병합 중 오류:", error);
  } finally {
    isProcessing.value = false;
  }
};

const splitPDF = async () => {
  if (!splitFile.value) return;

  isProcessing.value = true;
  try {
    let options: any = {
      mode: splitMode.value,
      pageRanges: pageRanges.value,
      pagesPerFile: pagesPerFile.value,
    };

    // 시각적 선택 모드인 경우 선택된 범위를 페이지 범위 문자열로 변환
    if (splitMode.value === "visual" && visualSelectedRanges.value.length > 0) {
      const rangeStrings = visualSelectedRanges.value.map((range) =>
        range.start === range.end
          ? `${range.start + 1}`
          : `${range.start + 1}-${range.end + 1}`
      );
      options.pageRanges = rangeStrings.join(", ");
      options.mode = "pages"; // 내부적으로는 pages 모드로 처리
    }

    const results = await pdfConverter.splitPDF(splitFile.value, options);
    processedFiles.value = [...processedFiles.value, ...results];
  } catch (error) {
    console.error("분할 중 오류:", error);
  } finally {
    isProcessing.value = false;
  }
};

const handleVisualSplit = async (ranges: { start: number; end: number }[]) => {
  if (!splitFile.value) return;

  try {
    isProcessing.value = true;
    currentOperation.value = "split";

    // 범위에서 페이지 번호들을 추출
    const pages: number[] = [];
    ranges.forEach((range) => {
      for (let i = range.start; i <= range.end; i++) {
        pages.push(i);
      }
    });

    // 선택된 페이지들을 하나의 PDF로 생성
    const result = await pdfConverter.splitSelectedPages(
      splitFile.value,
      pages
    );
    processedFiles.value = [...processedFiles.value, result];

    // 성공 메시지
    toast.add({
      title: t("common.success"),
      color: "green",
    });
  } catch (error) {
    console.error("PDF 분할 오류:", error);
    toast.add({
      title: t("common.error"),
      color: "red",
    });
  } finally {
    isProcessing.value = false;
    currentOperation.value = "";
  }
};

const clearSplitFile = () => {
  splitFile.value = null;
  visualSelectedRanges.value = [];
  pageRanges.value = "";
};

const compressPDF = async () => {
  if (!compressFile.value) return;

  isProcessing.value = true;
  try {
    const result = await pdfConverter.compressPDF(
      compressFile.value,
      compressionLevel.value
    );
    processedFiles.value = [...processedFiles.value, result];
  } catch (error) {
    console.error("압축 중 오류:", error);
  } finally {
    isProcessing.value = false;
  }
};

const convertPDF = async () => {
  if (!convertFile.value) return;

  isProcessing.value = true;
  try {
    const result = await pdfConverter.convertPDFWord(
      convertFile.value,
      convertMode.value
    );
    processedFiles.value = [result];
  } catch (error) {
    console.error("변환 중 오류:", error);
  } finally {
    isProcessing.value = false;
  }
};

const getFileIcon = (type: string) => {
  if (type.includes("pdf")) return "i-heroicons-document";
  if (type.includes("word") || type.includes("document"))
    return "i-heroicons-document-text";
  return "i-heroicons-document";
};

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const truncateFileName = (fileName: string, maxLength: number = 25) => {
  if (fileName.length <= maxLength) return fileName;

  const extension = fileName.split(".").pop();
  const nameWithoutExt = fileName.replace(`.${extension}`, "");
  const truncatedName = nameWithoutExt.slice(
    0,
    maxLength - 3 - extension!.length
  );

  return `${truncatedName}...${extension}`;
};

const downloadFile = (file: any) => {
  const link = document.createElement("a");
  link.href = file.url;
  link.download = file.name;
  link.click();
};

const downloadAll = () => {
  processedFiles.value.forEach((file) => {
    downloadFile(file);
  });
};

// 탭 변경 시 결과 초기화
watch(selectedTab, () => {
  processedFiles.value = [];
});
</script>
