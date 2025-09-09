<template>
  <div class="container mx-auto px-6 py-8">
    <!-- 모바일/태블릿 상단 광고 -->
    <div class="block xl:hidden mb-6">
      <GoogleAd type="banner" width="100%" height="90px" />
    </div>

    <!-- 데스크탑 레이아웃 -->
    <div class="flex gap-6 xl:gap-8 max-w-8xl mx-auto">
      <!-- 좌측 사이드바 광고 (데스크탑) -->
      <div class="hidden xl:block w-40 flex-shrink-0">
        <div class="sticky top-6">
          <GoogleAd type="sidebar" width="160px" height="600px" />
        </div>
      </div>

      <!-- 메인 콘텐츠 -->
      <div class="flex-1 min-w-0">
        <!-- 파일이 없을 때: 시작 화면 -->
        <div v-if="!selectedImage">
          <div class="max-w-2xl mx-auto">
            <div
              @drop.prevent="handleDrop"
              @dragover.prevent="handleDragOver"
              @dragenter.prevent="handleDragEnter"
              @dragleave.prevent="handleDragLeave"
              @click="triggerFileInput"
              class="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-16 text-center hover:border-gray-900 dark:hover:border-gray-100 transition-all duration-300 cursor-pointer bg-white dark:bg-gray-800"
              :class="{
                'border-gray-900 bg-gray-50 dark:border-gray-100 dark:bg-gray-700/50':
                  isDragOver,
              }"
            >
              <UIcon
                name="i-heroicons-cloud-arrow-up"
                class="text-6xl text-gray-400 mb-6 mx-auto"
              />
              <h3
                class="text-2xl font-semibold text-gray-900 dark:text-white mb-4"
              >
                {{ t("pages.imageEditor.dropOrClick") }}
              </h3>
              <p class="text-gray-500 dark:text-gray-400 mb-8">
                {{ t("pages.imageEditor.supportedFormats") }}
              </p>
              <UButton size="xl" color="gray" variant="solid" class="px-8 py-3">
                <UIcon name="i-heroicons-photo" class="mr-2" />
                {{ t("pages.imageEditor.selectImage") }}
              </UButton>
              <input
                ref="fileInput"
                type="file"
                accept="image/*"
                @change="handleFileSelect"
                class="hidden"
              />
            </div>
          </div>
        </div>

        <!-- 파일이 있을 때: 에디터 스튜디오 -->
        <div v-else class="space-y-6">
          <!-- 상단 헤더 -->
          <div class="bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <UIcon name="i-heroicons-photo" class="text-white text-xl" />
                </div>
                <div>
                  <h1 class="text-xl font-bold text-gray-900 dark:text-white truncate max-w-md" :title="selectedImage.name">
                    {{ selectedImage.name }}
                  </h1>
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    {{ formatFileSize(selectedImage.size) }} • 이미지 편집기
                  </p>
                </div>
              </div>

              <div class="flex items-center gap-3">
                <UButton @click="resetImage" variant="ghost" size="sm" class="text-gray-600 dark:text-gray-400">
                  <UIcon name="i-heroicons-arrow-path" class="mr-2" />
                  초기화
                </UButton>
                <UButton @click="downloadImage" color="primary" variant="solid" size="sm">
                  <UIcon name="i-heroicons-arrow-down-tray" class="mr-2" />
                  저장하기
                </UButton>
                <UButton @click="changeImage" variant="outline" size="sm">
                  <UIcon name="i-heroicons-arrow-path" class="mr-2" />
                  새 이미지
                </UButton>
              </div>
            </div>
          </div>

          <!-- 메인 에디터 영역 -->
          <div class="grid grid-cols-12 gap-6 h-[calc(100vh-300px)] min-h-[600px]">
            <!-- 좌측 도구 패널 -->
            <div class="col-span-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div class="p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">편집 도구</h3>
                <div class="grid grid-cols-2 gap-3">
                  <button
                    v-for="tool in tools"
                    :key="tool.id"
                    @click="setActiveTool(tool.id)"
                    :class=" [
                      'p-4 rounded-xl flex flex-col items-center gap-2 transition-all duration-200',
                      activeTool === tool.id
                        ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg scale-105'
                        : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 hover:scale-102'
                    ]"
                  >
                    <UIcon :name="tool.icon" class="text-2xl" />
                    <span class="text-sm font-medium">{{ tool.name }}</span>
                  </button>
                </div>
              </div>

              <!-- 도구별 옵션 -->
              <div class="flex-1 p-4 overflow-y-auto">
                <!-- 선택 도구 -->
                <div v-if="activeTool === 'select'" class="space-y-6">
                  <div class="text-center">
                    <UIcon name="i-heroicons-cursor-arrow-rays" class="text-4xl text-blue-500 mx-auto mb-2" />
                    <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">객체 선택</h4>
                    <p class="text-sm text-gray-500 dark:text-gray-400">캔버스에서 객체를 선택하여 편집하세요</p>
                  </div>

                  <div v-if="selectedObject" class="space-y-4">
                    <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <label class="block text-sm font-medium text-gray-900 dark:text-white mb-3">투명도 조절</label>
                      <input
                        v-model="objectOpacity"
                        @input="updateObjectOpacity"
                        type="range"
                        min="0"
                        max="100"
                        class="w-full accent-blue-500"
                      />
                      <div class="flex justify-between text-xs text-gray-500 mt-1">
                        <span>0%</span>
                        <span class="font-medium">{{ objectOpacity }}%</span>
                        <span>100%</span>
                      </div>
                    </div>
                  </div>

                  <div v-else class="text-center py-8">
                    <UIcon name="i-heroicons-square-3-stack-3d" class="text-3xl text-gray-400 mx-auto mb-2" />
                    <p class="text-sm text-gray-500">선택된 객체가 없습니다</p>
                  </div>
                </div>

                <!-- 크기조절 도구 -->
                <div v-if="activeTool === 'resize'" class="space-y-6">
                  <div class="text-center">
                    <UIcon name="i-heroicons-arrows-right-left" class="text-4xl text-green-500 mx-auto mb-2" />
                    <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">크기 조절</h4>
                    <p class="text-sm text-gray-500 dark:text-gray-400">객체의 크기를 조절하세요</p>
                  </div>

                  <div v-if="selectedObject" class="space-y-4">
                    <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <label class="block text-sm font-medium text-gray-900 dark:text-white mb-3">너비</label>
                      <input
                        v-model="selectedObject.scaleX"
                        @input="updateObjectScale"
                        type="range"
                        min="0.1"
                        max="3"
                        step="0.1"
                        class="w-full accent-green-500"
                      />
                      <div class="flex justify-between text-xs text-gray-500 mt-1">
                        <span>0.1배</span>
                        <span class="font-medium">{{ (selectedObject.scaleX * 100).toFixed(0) }}%</span>
                        <span>3배</span>
                      </div>
                    </div>

                    <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <label class="block text-sm font-medium text-gray-900 dark:text-white mb-3">높이</label>
                      <input
                        v-model="selectedObject.scaleY"
                        @input="updateObjectScale"
                        type="range"
                        min="0.1"
                        max="3"
                        step="0.1"
                        class="w-full accent-green-500"
                      />
                      <div class="flex justify-between text-xs text-gray-500 mt-1">
                        <span>0.1배</span>
                        <span class="font-medium">{{ (selectedObject.scaleY * 100).toFixed(0) }}%</span>
                        <span>3배</span>
                      </div>
                    </div>
                  </div>

                  <div v-else class="text-center py-8">
                    <UIcon name="i-heroicons-square-3-stack-3d" class="text-3xl text-gray-400 mx-auto mb-2" />
                    <p class="text-sm text-gray-500">선택된 객체가 없습니다</p>
                  </div>
                </div>

                <!-- 필터 도구 -->
                <div v-if="activeTool === 'filter'" class="space-y-6">
                  <div class="text-center">
                    <UIcon name="i-heroicons-photo" class="text-4xl text-orange-500 mx-auto mb-2" />
                    <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">이미지 필터</h4>
                    <p class="text-sm text-gray-500 dark:text-gray-400">다양한 필터로 이미지를 꾸며보세요</p>
                  </div>

                  <div class="grid grid-cols-2 gap-3">
                    <button
                      v-for="filter in filters"
                      :key="filter.name"
                      @click="applyFilter(filter.name)"
                      class="p-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:border-orange-300 dark:hover:border-orange-600 transition-all duration-200 group"
                    >
                      <span class="text-sm font-medium text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400">
                        {{ filter.label }}
                      </span>
                    </button>
                  </div>

                  <UButton @click="resetFilters" variant="outline" size="lg" block class="mt-4">
                    <UIcon name="i-heroicons-arrow-path" class="mr-2" />
                    필터 초기화
                  </UButton>
                </div>

                <!-- 조정 도구 -->
                <div v-if="activeTool === 'adjust'" class="space-y-6">
                  <div class="text-center">
                    <UIcon name="i-heroicons-adjustments-horizontal" class="text-4xl text-indigo-500 mx-auto mb-2" />
                    <h4 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">이미지 조정</h4>
                    <p class="text-sm text-gray-500 dark:text-gray-400">밝기, 대비, 채도를 조절하세요</p>
                  </div>

                  <div class="space-y-4">
                    <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <label class="block text-sm font-medium text-gray-900 dark:text-white mb-3">밝기</label>
                      <input
                        v-model="brightness"
                        @input="applyAdjustments"
                        type="range"
                        min="-100"
                        max="100"
                        class="w-full accent-indigo-500"
                      />
                      <div class="flex justify-between text-xs text-gray-500 mt-1">
                        <span>-100</span>
                        <span class="font-medium">{{ brightness }}</span>
                        <span>+100</span>
                      </div>
                    </div>

                    <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <label class="block text-sm font-medium text-gray-900 dark:text-white mb-3">대비</label>
                      <input
                        v-model="contrast"
                        @input="applyAdjustments"
                        type="range"
                        min="-100"
                        max="100"
                        class="w-full accent-indigo-500"
                      />
                      <div class="flex justify-between text-xs text-gray-500 mt-1">
                        <span>-100</span>
                        <span class="font-medium">{{ contrast }}</span>
                        <span>+100</span>
                      </div>
                    </div>

                    <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <label class="block text-sm font-medium text-gray-900 dark:text-white mb-3">채도</label>
                      <input
                        v-model="saturation"
                        @input="applyAdjustments"
                        type="range"
                        min="-100"
                        max="100"
                        class="w-full accent-indigo-500"
                      />
                      <div class="flex justify-between text-xs text-gray-500 mt-1">
                        <span>-100</span>
                        <span class="font-medium">{{ saturation }}</span>
                        <span>+100</span>
                      </div>
                    </div>

                    <UButton @click="resetAdjustments" variant="outline" size="lg" block class="mt-4">
                      <UIcon name="i-heroicons-arrow-path" class="mr-2" />
                      조정 초기화
                    </UButton>
                  </div>
                </div>
              </div>
            </div>

            <!-- 중앙 캔버스 영역 -->
            <div class="col-span-9 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center justify-center p-8">
              <div class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-600 overflow-hidden max-w-full max-h-full">
                <canvas
                  ref="fabricCanvas"
                  id="fabric-canvas"
                  class="max-w-full max-h-[calc(100vh-400px)] min-h-[500px]"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- 모바일/태블릿 하단 광고 -->
        <div class="block xl:hidden mt-6">
          <GoogleAd type="responsive" width="100%" height="90px" />
        </div>
      </div>

      <!-- 우측 사이드바 광고 (데스크탑) -->
      <div class="hidden xl:block w-40 flex-shrink-0">
        <div class="sticky top-6">
          <GoogleAd type="sidebar" width="160px" height="600px" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n();

// SEO 메타 데이터
useSeoMeta({
  title: () => t("pages.imageEditor.seo.title"),
  description: () => t("pages.imageEditor.seo.description"),
  keywords: () => t("pages.imageEditor.seo.keywords"),
});

// 반응형 데이터
const selectedImage = ref<any>(null);
const isDragOver = ref(false);
const isProcessing = ref(false);

const fileInput = ref<HTMLInputElement>();
const fabricCanvas = ref<HTMLCanvasElement>();

// Fabric.js 관련
let canvas: any = null;
let originalImageObject: any = null;

// 도구 상태
const activeTool = ref('select');
const selectedObject = ref<any>(null);

// 브러시 설정
const brushSize = ref(10);
const brushColor = ref('#000000');

// 객체 설정
const objectOpacity = ref(100);
const objectScale = ref(100);

// 이미지 조정
const brightness = ref(0);
const contrast = ref(0);
const saturation = ref(0);

// 자르기 관련
const isCropping = ref(false);
const cropRect = ref<any>(null);

// 도구 목록
const tools = [
  { id: 'select', name: '선택', icon: 'i-heroicons-cursor-arrow-rays' },
  { id: 'crop', name: '자르기', icon: 'i-heroicons-scissors' },
  { id: 'resize', name: '크기조절', icon: 'i-heroicons-arrows-right-left' },
  { id: 'filter', name: '필터', icon: 'i-heroicons-photo' },
  { id: 'adjust', name: '조정', icon: 'i-heroicons-adjustments-horizontal' },
];

// 필터 목록
const filters = [
  { name: 'grayscale', label: '흑백' },
  { name: 'sepia', label: '세피아' },
  { name: 'blur', label: '블러' },
  { name: 'sharpen', label: '선명도' },
  { name: 'vintage', label: '빈티지' },
  { name: 'invert', label: '반전' },
];

// 파일 선택 트리거
const triggerFileInput = () => {
  fileInput.value?.click();
};

// 파일 선택 처리
const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    processFile(file);
  }
};

// 드래그 앤 드롭 처리
const handleDrop = (event: DragEvent) => {
  event.preventDefault();
  isDragOver.value = false;

  const files = event.dataTransfer?.files;
  if (files && files.length > 0) {
    const file = files[0];
    if (file.type.startsWith("image/")) {
      processFile(file);
    }
  }
};

// 드래그 오버 이벤트 처리
const handleDragOver = (event: DragEvent) => {
  event.preventDefault();
  event.dataTransfer!.dropEffect = "copy";
};

const handleDragEnter = (event: DragEvent) => {
  event.preventDefault();
  isDragOver.value = true;
};

const handleDragLeave = (event: DragEvent) => {
  event.preventDefault();
  isDragOver.value = false;
};

// 파일 처리
const processFile = (file: File) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    selectedImage.value = {
      file,
      name: file.name,
      size: file.size,
      url: e.target?.result as string,
    };

    // Fabric.js 캔버스 초기화
    nextTick(() => {
      initializeFabricCanvas();
    });
  };
  reader.readAsDataURL(file);
};

// Fabric.js 캔버스 초기화
const initializeFabricCanvas = async () => {
  if (process.client) {
    try {
      // CDN에서 Fabric.js 로드
      if (!(window as any).fabric) {
        await loadFabricJS();
      }
      
      const fabric = (window as any).fabric;
      
      // 기존 캔버스가 있으면 제거
      if (canvas) {
        canvas.dispose();
      }

      // 캔버스 요소 확인
      const canvasElement = fabricCanvas.value;
      if (!canvasElement) {
        console.error('Canvas 요소를 찾을 수 없습니다.');
        return;
      }

      // Fabric 캔버스 생성
      canvas = new fabric.Canvas(canvasElement, {
        width: 800,
        height: 600,
        backgroundColor: '#ffffff',
      });

      // 이미지 로드
      fabric.Image.fromURL(selectedImage.value.url, (img: any) => {
        // 이미지 크기 조정
        const scale = Math.min(
          canvas.width / img.width,
          canvas.height / img.height
        );
        
        img.scale(scale);
        img.set({
          left: canvas.width / 2,
          top: canvas.height / 2,
          originX: 'center',
          originY: 'center',
          selectable: false,
        });

        originalImageObject = img;
        canvas.add(img);
        canvas.renderAll();
      });

      // 객체 선택 이벤트
      canvas.on('selection:created', (e: any) => {
        selectedObject.value = e.selected[0];
        if (selectedObject.value) {
          objectOpacity.value = Math.round((selectedObject.value.opacity || 1) * 100);
        }
      });

      canvas.on('selection:updated', (e: any) => {
        selectedObject.value = e.selected[0];
        if (selectedObject.value) {
          objectOpacity.value = Math.round((selectedObject.value.opacity || 1) * 100);
        }
      });

      canvas.on('selection:cleared', () => {
        selectedObject.value = null;
      });

      // 브러시 초기 설정
      canvas.freeDrawingBrush.width = brushSize.value;
      canvas.freeDrawingBrush.color = brushColor.value;

    } catch (error) {
      console.error('Fabric.js 초기화 실패:', error);
    }
  }
};

// Fabric.js CDN 로드
const loadFabricJS = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/fabric@5.3.0/dist/fabric.min.js';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Fabric.js 로드 실패'));
    document.head.appendChild(script);
  });
};

// 활성 도구 설정
const setActiveTool = (tool: string) => {
  activeTool.value = tool;
  
  if (!canvas) return;

  // 모든 모드 비활성화
  canvas.isDrawingMode = false;
  canvas.selection = true;
  canvas.forEachObject((obj: any) => {
    obj.selectable = true;
  });

  switch (tool) {
    case 'select':
      canvas.defaultCursor = 'default';
      break;
    case 'draw':
      canvas.isDrawingMode = true;
      canvas.defaultCursor = 'crosshair';
      break;
    case 'crop':
      canvas.defaultCursor = 'crosshair';
      break;
    default:
      canvas.defaultCursor = 'default';
  }
};

// 브러시 크기 업데이트
const updateBrushSize = () => {
  if (canvas) {
    canvas.freeDrawingBrush.width = brushSize.value;
  }
};

// 브러시 색상 업데이트
const updateBrushColor = () => {
  if (canvas) {
    canvas.freeDrawingBrush.color = brushColor.value;
  }
};

// 객체 투명도 업데이트
const updateObjectOpacity = () => {
  if (selectedObject.value) {
    selectedObject.value.set('opacity', objectOpacity.value / 100);
    canvas.renderAll();
  }
};

// 크기 조절 업데이트
const updateObjectScale = () => {
  if (selectedObject.value) {
    selectedObject.value.set({
      scaleX: objectScale.value / 100,
      scaleY: objectScale.value / 100,
    });
    canvas.renderAll();
  }
};

// 필터 적용
const applyFilter = (filterName: string) => {
  if (!originalImageObject) return;

  const fabric = (window as any).fabric;
  
  // 필터 제거 후 새로 적용
  originalImageObject.filters = [];

  switch (filterName) {
    case 'grayscale':
      originalImageObject.filters.push(new fabric.Image.filters.Grayscale());
      break;
    case 'sepia':
      originalImageObject.filters.push(new fabric.Image.filters.Sepia());
      break;
    case 'blur':
      originalImageObject.filters.push(new fabric.Image.filters.Blur({ blur: 0.1 }));
      break;
    case 'sharpen':
      originalImageObject.filters.push(new fabric.Image.filters.Convolute({
        matrix: [0, -1, 0, -1, 5, -1, 0, -1, 0]
      }));
      break;
    case 'vintage':
      originalImageObject.filters.push(new fabric.Image.filters.Sepia());
      originalImageObject.filters.push(new fabric.Image.filters.Brightness({ brightness: 0.1 }));
      break;
    case 'invert':
      originalImageObject.filters.push(new fabric.Image.filters.Invert());
      break;
  }

  originalImageObject.applyFilters();
  canvas.renderAll();
};

// 필터 제거
const resetFilters = () => {
  if (originalImageObject) {
    originalImageObject.filters = [];
    originalImageObject.applyFilters();
    canvas.renderAll();
  }
};

// 이미지 조정 적용
const applyAdjustments = () => {
  if (!originalImageObject) return;

  const fabric = (window as any).fabric;
  
  // 조정 필터 제거 후 새로 적용
  originalImageObject.filters = originalImageObject.filters.filter(
    (filter: any) => !(filter instanceof fabric.Image.filters.Brightness) &&
                     !(filter instanceof fabric.Image.filters.Contrast) &&
                     !(filter instanceof fabric.Image.filters.Saturation)
  );

  if (brightness.value !== 0) {
    originalImageObject.filters.push(new fabric.Image.filters.Brightness({
      brightness: brightness.value / 100
    }));
  }

  if (contrast.value !== 0) {
    originalImageObject.filters.push(new fabric.Image.filters.Contrast({
      contrast: contrast.value / 100
    }));
  }

  if (saturation.value !== 0) {
    originalImageObject.filters.push(new fabric.Image.filters.Saturation({
      saturation: saturation.value / 100
    }));
  }

  originalImageObject.applyFilters();
  canvas.renderAll();
};

// 조정 초기화
const resetAdjustments = () => {
  brightness.value = 0;
  contrast.value = 0;
  saturation.value = 0;
  applyAdjustments();
};

// 이미지 다운로드
const downloadImage = () => {
  if (!canvas) return;

  const dataURL = canvas.toDataURL({
    format: 'png',
    quality: 1,
  });

  const link = document.createElement('a');
  link.download = `edited_${selectedImage.value?.name || 'image.png'}`;
  link.href = dataURL;
  link.click();
};

// 이미지 리셋
const resetImage = () => {
  if (originalImageObject && selectedImage.value) {
    // 필터 및 조정 초기화
    originalImageObject.filters = [];
    originalImageObject.applyFilters();
    
    // 조정값 리셋
    brightness.value = 0;
    contrast.value = 0;
    saturation.value = 0;
    
    canvas.renderAll();
  }
};

// 이미지 변경
const changeImage = () => {
  if (canvas) {
    canvas.dispose();
    canvas = null;
  }
  selectedImage.value = null;
  isDragOver.value = false;
  originalImageObject = null;
  selectedObject.value = null;
};

// 파일 크기 포맷
const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

// 컴포넌트 언마운트 시 정리
onUnmounted(() => {
  if (canvas) {
    canvas.dispose();
  }
});
</script>

<style scoped>
/* TUI Image Editor 커스터마이징 */
:global(.tui-image-editor-header) {
  background-color: #f97316 !important;
  border-bottom: 1px solid #ea580c !important;
}

:global(.tui-image-editor-header-logo) {
  display: none !important;
}

:global(.tui-image-editor-header-buttons) {
  display: flex !important;
  gap: 8px !important;
}

:global(.tui-image-editor-download-btn),
:global(.tui-image-editor-load-btn) {
  background-color: #f97316 !important;
  border: 1px solid #f97316 !important;
  color: white !important;
  font-family: system-ui, -apple-system, sans-serif !important;
  font-size: 12px !important;
  padding: 8px 16px !important;
  border-radius: 6px !important;
  transition: all 0.2s ease !important;
}

:global(.tui-image-editor-download-btn:hover),
:global(.tui-image-editor-load-btn:hover) {
  background-color: #ea580c !important;
  border-color: #ea580c !important;
}

:global(.tui-image-editor-main) {
  background-color: #ffffff !important;
}

:global(.tui-image-editor-menu) {
  background-color: #f9fafb !important;
  border-top: 1px solid #e5e7eb !important;
}

:global(.tui-image-editor-item) {
  color: #6b7280 !important;
  transition: all 0.2s ease !important;
}

:global(.tui-image-editor-item:hover) {
  color: #f97316 !important;
  background-color: #fed7aa !important;
}

:global(.tui-image-editor-item.active) {
  color: #f97316 !important;
  background-color: #fed7aa !important;
}

:global(.tui-image-editor-submenu) {
  background-color: #ffffff !important;
  border-right: 1px solid #e5e7eb !important;
}

:global(.tui-image-editor-partition) {
  border-color: #e5e7eb !important;
}

:global(.tui-image-editor-submenu-item) {
  color: #374151 !important;
  transition: all 0.2s ease !important;
}

:global(.tui-image-editor-submenu-item:hover) {
  color: #f97316 !important;
  background-color: #fef3c7 !important;
}

:global(.tui-image-editor-submenu-item.active) {
  color: #f97316 !important;
  background-color: #fef3c7 !important;
  font-weight: 600 !important;
}

/* 슬라이더 커스터마이징 */
:global(.tui-image-editor-range-wrap) {
  margin: 8px 0 !important;
}

:global(.tui-image-editor-range) {
  background-color: #e5e7eb !important;
  height: 6px !important;
  border-radius: 3px !important;
}

:global(.tui-image-editor-range-pointer) {
  background-color: #f97316 !important;
  border: 2px solid white !important;
  box-shadow: 0 2px 4px rgba(249, 115, 22, 0.3) !important;
  width: 18px !important;
  height: 18px !important;
}

:global(.tui-image-editor-range-value) {
  background-color: #f9fafb !important;
  color: #374151 !important;
  border: 1px solid #e5e7eb !important;
  border-radius: 4px !important;
  font-size: 11px !important;
  padding: 2px 6px !important;
}

/* 컬러피커 커스터마이징 */
:global(.tui-image-editor-button) {
  border: 1px solid #d1d5db !important;
  border-radius: 4px !important;
  transition: all 0.2s ease !important;
}

:global(.tui-image-editor-button:hover) {
  border-color: #f97316 !important;
}

/* 체크박스 커스터마이징 */
:global(.tui-image-editor-checkbox) {
  border: 1px solid #d1d5db !important;
  background-color: #ffffff !important;
}

:global(.tui-image-editor-checkbox:checked) {
  background-color: #f97316 !important;
  border-color: #f97316 !important;
}

/* 캔버스 영역 */
:global(.tui-image-editor-canvas-container) {
  background-color: #f8fafc !important;
  border-radius: 8px !important;
  overflow: hidden !important;
}

/* 스크롤바 커스터마이징 */
:global(.tui-image-editor-submenu::-webkit-scrollbar) {
  width: 6px !important;
}

:global(.tui-image-editor-submenu::-webkit-scrollbar-track) {
  background: #f1f5f9 !important;
}

:global(.tui-image-editor-submenu::-webkit-scrollbar-thumb) {
  background: #cbd5e1 !important;
  border-radius: 3px !important;
}

:global(.tui-image-editor-submenu::-webkit-scrollbar-thumb:hover) {
  background: #94a3b8 !important;
}

/* 다크모드 지원 */
@media (prefers-color-scheme: dark) {
  :global(.tui-image-editor-main) {
    background-color: #1f2937 !important;
  }
  
  :global(.tui-image-editor-submenu) {
    background-color: #374151 !important;
    border-right-color: #4b5563 !important;
  }
  
  :global(.tui-image-editor-submenu-item) {
    color: #d1d5db !important;
  }
  
  :global(.tui-image-editor-canvas-container) {
    background-color: #111827 !important;
  }
}

/* 8xl max-width 커스텀 클래스 */
.max-w-8xl {
  max-width: 96rem; /* 1536px */
}
</style>
