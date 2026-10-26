<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue';
import { Camera, RefreshCw, X, ShieldCheck, AlertTriangle } from 'lucide-vue-next';
import { PlantSpecimen, DevelopmentalStage, VariegationStability } from '../types';
import { CURRENT_USER } from '../data/mockData';
import { plantImages } from '../assets/plantImages';

const props = defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'specimenCreated', specimen: PlantSpecimen): void;
}>();

const PRESET_SPECIMENS = [
  {
    name: 'Monstera Albo Top Cutting',
    botanical: 'Monstera deliciosa var. borsigiana',
    cultivar: "'Albo Borsigiana'",
    stage: 'rooted_cutting' as DevelopmentalStage,
    nodes: 2,
    variegation: 'high_marble' as VariegationStability,
    value: 145,
    image: plantImages.heroMonstera,
  },
  {
    name: 'Philodendron Spiritus Sancti Node',
    botanical: 'Philodendron spiritus-sancti',
    cultivar: 'Espirito Santo Lineage',
    stage: 'unrooted_node' as DevelopmentalStage,
    nodes: 1,
    variegation: 'standard' as VariegationStability,
    value: 290,
    image: plantImages.spiritusSancti,
  },
  {
    name: 'Queen Anthurium Dark Form',
    botanical: 'Anthurium warocqueanum',
    cultivar: 'Dark Narrow Emerald',
    stage: 'established' as DevelopmentalStage,
    nodes: 4,
    variegation: 'standard' as VariegationStability,
    value: 160,
    image: plantImages.anthurium,
  },
  {
    name: 'Monstera Thai Constellation',
    botanical: 'Monstera deliciosa var. borsigiana',
    cultivar: "'Thai Constellation'",
    stage: 'established' as DevelopmentalStage,
    nodes: 3,
    variegation: 'stable' as VariegationStability,
    value: 180,
    image: plantImages.thaiConstellation,
  },
];

const useCamera = ref(true);
const cameraError = ref<string | null>(null);
const selectedPresetIndex = ref(0);
const capturedWatermarkUrl = ref<string | null>(null);
const isCapturing = ref(false);

const commonName = ref('Variegated Monstera Albo');
const botanicalName = ref('Monstera deliciosa var. borsigiana');
const cultivar = ref("'Albo Borsigiana'");
const listingType = ref<'have' | 'want'>('have');
const stage = ref<DevelopmentalStage>('rooted_cutting');
const nodeCount = ref(2);
const leafCount = ref(1);
const variegation = ref<VariegationStability>('high_marble');
const estimatedValue = ref(140);
const notes = ref('Freshly inspected under greenhouse lighting. Active auxiliary bud visible with sectoral white sectoring.');

const videoRef = ref<HTMLVideoElement | null>(null);
let streamRef: MediaStream | null = null;

const stopCamera = () => {
  if (streamRef) {
    streamRef.getTracks().forEach((track) => track.stop());
    streamRef = null;
  }
};

const startCamera = () => {
  stopCamera();
  if (!useCamera.value || capturedWatermarkUrl.value) return;

  navigator.mediaDevices
    ?.getUserMedia({
      video: {
        width: { ideal: 1280 },
        height: { ideal: 960 },
        facingMode: 'environment',
      },
      audio: false,
    })
    .then((mediaStream) => {
      streamRef = mediaStream;
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }
      cameraError.value = null;
    })
    .catch((err) => {
      console.warn('Camera access unavailable:', err);
      cameraError.value = 'Webcam unavailable in this sandbox environment. Select specimen presets below to simulate real-time watermarking.';
      useCamera.value = false;
    });
};

watch(
  () => [props.isOpen, useCamera.value, capturedWatermarkUrl.value],
  ([isOpen]) => {
    if (isOpen && useCamera.value && !capturedWatermarkUrl.value) {
      setTimeout(() => startCamera(), 100);
    } else {
      stopCamera();
    }
  },
  { immediate: true }
);

onUnmounted(() => {
  stopCamera();
});

const selectPreset = (index: number) => {
  selectedPresetIndex.value = index;
  const p = PRESET_SPECIMENS[index];
  commonName.value = p.name;
  botanicalName.value = p.botanical;
  cultivar.value = p.cultivar;
  stage.value = p.stage;
  nodeCount.value = p.nodes;
  variegation.value = p.variegation;
  estimatedValue.value = p.value;
  useCamera.value = false;
  stopCamera();
};

const captureAndStampWatermark = () => {
  isCapturing.value = true;
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 900;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    isCapturing.value = false;
    return;
  }

  const drawWatermarkOverlay = () => {
    const now = new Date();
    const isoString = now.toISOString();
    const hash = `sha256-${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 8)}`;

    ctx.fillStyle = 'rgba(15, 23, 42, 0.90)';
    ctx.fillRect(0, canvas.height - 130, canvas.width, 130);

    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.fillRect(0, 0, canvas.width, 50);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 18px "JetBrains Mono", monospace';
    ctx.fillText('LEAF & NODE · PROOF OF LIFE DIGITAL PASSPORT', 30, 32);

    ctx.fillStyle = '#6EE7B7';
    ctx.font = '16px "JetBrains Mono", monospace';
    ctx.fillText(`GEO: 45.5152° N, 122.6784° W (PORTLAND, OR)`, canvas.width - 450, 32);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 22px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(`${commonName.value} [${stage.value.toUpperCase()}]`, 30, canvas.height - 80);

    ctx.font = '16px "Plus Jakarta Sans", sans-serif';
    ctx.fillStyle = '#94A3B8';
    ctx.fillText(`Collector: ${CURRENT_USER.handle} (${CURRENT_USER.city}, ${CURRENT_USER.state})`, 30, canvas.height - 40);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '15px "JetBrains Mono", monospace';
    ctx.fillText(`STAMP: ${isoString.replace('T', ' ').substring(0, 19)} UTC`, canvas.width - 460, canvas.height - 80);

    ctx.fillStyle = '#34D399';
    ctx.fillText(`NODES: ${nodeCount.value} · LEAVES: ${leafCount.value} · VARIEGATION: ${variegation.value.toUpperCase()}`, canvas.width - 460, canvas.height - 45);

    ctx.fillStyle = '#CBD5E1';
    ctx.font = '13px "JetBrains Mono", monospace';
    ctx.fillText(`SEAL: ${hash}`, canvas.width - 460, canvas.height - 20);

    ctx.strokeStyle = 'rgba(52, 211, 153, 0.8)';
    ctx.lineWidth = 2;
    ctx.strokeRect(canvas.width / 2 - 140, canvas.height / 2 - 120, 280, 240);

    ctx.fillStyle = 'rgba(52, 211, 153, 0.95)';
    ctx.font = 'bold 14px "JetBrains Mono", monospace';
    ctx.fillText(`NODE RETICLE [${nodeCount.value} NODES]`, canvas.width / 2 - 130, canvas.height / 2 - 130);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    capturedWatermarkUrl.value = dataUrl;
    isCapturing.value = false;
    stopCamera();
  };

  if (useCamera.value && videoRef.value) {
    ctx.drawImage(videoRef.value, 0, 0, canvas.width, canvas.height);
    drawWatermarkOverlay();
  } else {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      drawWatermarkOverlay();
    };
    img.src = PRESET_SPECIMENS[selectedPresetIndex.value].image;
  }
};

const handlePublishListing = () => {
  const finalImage = capturedWatermarkUrl.value || PRESET_SPECIMENS[selectedPresetIndex.value].image;
  const newSpecimen: PlantSpecimen = {
    id: `specimen-${Date.now()}`,
    commonName: commonName.value,
    botanicalName: botanicalName.value,
    cultivar: cultivar.value,
    type: listingType.value,
    developmentalStage: stage.value,
    nodeCount: nodeCount.value,
    leafCount: leafCount.value,
    variegationStability: variegation.value,
    variegationDescription: `${variegation.value.replace('_', ' ')} verified via live camera capture`,
    estimatedValueUsd: estimatedValue.value,
    imageUrl: finalImage,
    notes: notes.value,
    owner: {
      id: CURRENT_USER.id,
      name: CURRENT_USER.name,
      handle: CURRENT_USER.handle,
      city: CURRENT_USER.city,
      state: CURRENT_USER.state,
      distanceMiles: 0,
      avatarUrl: CURRENT_USER.avatarUrl,
      karma: CURRENT_USER.karma,
    },
    passport: {
      id: `LN-OR-${Math.floor(1000 + Math.random() * 9000)}-POL`,
      capturedAt: new Date().toISOString(),
      watermarkHash: `sha256-${Math.random().toString(36).substring(2, 12)}`,
      isLiveCameraVerified: true,
      city: CURRENT_USER.city,
      state: CURRENT_USER.state,
      geoCoords: '45.5152° N, 122.6784° W',
      nodeCountStated: nodeCount.value,
      leafCount: leafCount.value,
      variegationClass: `${variegation.value.toUpperCase()} Registered`,
    },
  };

  emit('specimenCreated', newSpecimen);
  emit('close');
};
</script>

<template>
  <div 
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto"
    @click="emit('close')"
  >
    <div 
      class="relative bg-white border border-slate-200 rounded-xl shadow-2xl max-w-4xl w-full overflow-hidden my-6"
      @click.stop
    >
      <!-- Header -->
      <div class="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-[#227C5B] flex items-center justify-center text-white">
            <Camera class="w-5 h-5" />
          </div>
          <div>
            <span class="text-[11px] uppercase tracking-wider text-emerald-300 font-mono font-semibold">
              Proof of Life Capture Studio
            </span>
            <h3 class="font-display text-lg font-bold text-white">
              Register Verified Digital Plant Passport
            </h3>
          </div>
        </div>

        <button
          @click="emit('close')"
          class="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Studio Content Grid -->
      <div class="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 max-h-[80vh] overflow-y-auto">
        <!-- Left Column: Viewfinder (7 cols) -->
        <div class="lg:col-span-7 space-y-4">
          <div class="flex items-center justify-between text-xs text-slate-600">
            <span class="font-semibold text-slate-800">Camera Viewfinder &amp; Trait Frame</span>
            <div class="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg">
              <button
                type="button"
                @click="capturedWatermarkUrl = null; useCamera = true; startCamera()"
                :class="[
                  'px-2.5 py-1 rounded text-xs transition-all cursor-pointer font-medium',
                  useCamera && !capturedWatermarkUrl
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                ]"
              >
                Live Webcam
              </button>
              <button
                type="button"
                @click="capturedWatermarkUrl = null; useCamera = false; stopCamera()"
                :class="[
                  'px-2.5 py-1 rounded text-xs transition-all cursor-pointer font-medium',
                  !useCamera && !capturedWatermarkUrl
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                ]"
              >
                Specimen Presets
              </button>
            </div>
          </div>

          <!-- Display Frame -->
          <div class="relative aspect-4/3 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center shadow-inner">
            <img
              v-if="capturedWatermarkUrl"
              :src="capturedWatermarkUrl"
              alt="Watermarked Proof of Life"
              class="w-full h-full object-cover"
            />
            <template v-else-if="useCamera">
              <video
                ref="videoRef"
                autoplay
                playsinline
                muted
                class="w-full h-full object-cover"
              ></video>
              <div class="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 border border-dashed border-emerald-400/60 m-2 rounded-lg">
                <div class="flex items-center justify-between text-[11px] font-mono text-emerald-300 bg-slate-900/80 px-2 py-1 rounded w-fit">
                  <span>● LIVE SENSOR ACTIVE</span>
                </div>
                <div class="self-center text-center bg-slate-900/80 px-3 py-1.5 rounded text-white text-xs font-mono">
                  Align nodes within reticle
                </div>
                <div class="text-[11px] font-mono text-emerald-300 bg-slate-900/80 px-2 py-1 rounded w-fit">
                  {{ CURRENT_USER.handle }} · PORTLAND, OR
                </div>
              </div>
            </template>
            <div v-else class="relative w-full h-full">
              <img
                :src="PRESET_SPECIMENS[selectedPresetIndex].image"
                alt="Preset Specimen"
                class="w-full h-full object-cover"
              />
              <div class="absolute bottom-3 left-3 bg-slate-900/90 text-white text-xs font-mono px-3 py-1.5 rounded-md border border-white/10">
                Preset: {{ PRESET_SPECIMENS[selectedPresetIndex].name }}
              </div>
            </div>

            <div 
              v-if="cameraError"
              class="absolute inset-x-4 top-4 bg-rose-600 text-white p-3 rounded-lg text-xs flex items-center gap-2 z-20 shadow-md"
            >
              <AlertTriangle class="w-4 h-4 shrink-0" />
              <span>{{ cameraError }}</span>
            </div>
          </div>

          <!-- Presets Grid -->
          <div v-if="!capturedWatermarkUrl" class="space-y-1.5">
            <span class="text-[11px] text-slate-500 block uppercase tracking-wider font-semibold font-mono">
              Quick Select Rare Cultivar Preset:
            </span>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                v-for="(preset, idx) in PRESET_SPECIMENS"
                :key="preset.name"
                type="button"
                @click="selectPreset(idx)"
                :class="[
                  'p-2.5 rounded-lg border text-left text-xs transition-all cursor-pointer',
                  !useCamera && selectedPresetIndex === idx
                    ? 'border-[#227C5B] bg-emerald-50/70 font-semibold text-[#1A6247] shadow-xs'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                ]"
              >
                <span class="truncate block font-medium">{{ preset.name }}</span>
                <span class="text-[10px] text-slate-500 block font-mono">
                  {{ preset.nodes }} nodes · ${{ preset.value }}
                </span>
              </button>
            </div>
          </div>

          <!-- Capture CTA -->
          <div class="pt-2">
            <button
              v-if="!capturedWatermarkUrl"
              type="button"
              @click="captureAndStampWatermark"
              :disabled="isCapturing"
              class="w-full flex items-center justify-center gap-2 bg-[#227C5B] hover:bg-[#1A6247] text-white py-3 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all shadow-xs cursor-pointer"
            >
              <Camera class="w-4 h-4 text-emerald-200" />
              <span>{{ isCapturing ? 'Minting Passport Hash...' : 'Capture & Burn Digital Watermark' }}</span>
            </button>
            <button
              v-else
              type="button"
              @click="capturedWatermarkUrl = null; useCamera = true; startCamera()"
              class="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 py-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            >
              <RefreshCw class="w-3.5 h-3.5" />
              <span>Retake / Select Another Specimen</span>
            </button>
          </div>
        </div>

        <!-- Right Column: Form (5 cols) -->
        <div class="lg:col-span-5 space-y-4">
          <div class="bg-slate-50/70 p-4 rounded-xl border border-slate-200 space-y-3">
            <h4 class="font-display text-sm font-bold text-slate-900">
              Passport Registration Details
            </h4>

            <div>
              <label class="text-[11px] text-slate-500 uppercase font-mono font-semibold tracking-wider block mb-1">
                Listing Type
              </label>
              <div class="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  @click="listingType = 'have'"
                  :class="[
                    'py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer',
                    listingType === 'have'
                      ? 'bg-[#227C5B] text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  ]"
                >
                  Have (For Trade)
                </button>
                <button
                  type="button"
                  @click="listingType = 'want'"
                  :class="[
                    'py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer',
                    listingType === 'want'
                      ? 'bg-[#227C5B] text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  ]"
                >
                  Want (Wishlist)
                </button>
              </div>
            </div>

            <div>
              <label class="text-[11px] text-slate-500 font-medium block mb-1">
                Common Name
              </label>
              <input
                type="text"
                v-model="commonName"
                class="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-[#227C5B]"
              />
            </div>

            <div>
              <label class="text-[11px] text-slate-500 font-medium block mb-1">
                Botanical Species &amp; Cultivar
              </label>
              <input
                type="text"
                v-model="botanicalName"
                class="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-[#227C5B]"
              />
            </div>

            <div class="grid grid-cols-2 gap-2">
              <div>
                <label class="text-[11px] text-slate-500 font-medium block mb-1">
                  Maturity Stage
                </label>
                <select
                  v-model="stage"
                  class="w-full text-xs px-2.5 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-[#227C5B]"
                >
                  <option value="unrooted_node">Unrooted Node</option>
                  <option value="rooted_cutting">Rooted Cutting</option>
                  <option value="established">Established Plant</option>
                </select>
              </div>

              <div>
                <label class="text-[11px] text-slate-500 font-medium block mb-1">
                  Active Node Count
                </label>
                <div class="flex items-center gap-1">
                  <button
                    type="button"
                    @click="nodeCount = Math.max(1, nodeCount - 1)"
                    class="w-7 h-8 rounded border border-slate-200 bg-white text-xs font-bold hover:bg-slate-100"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    v-model.number="nodeCount"
                    class="w-full text-xs py-1.5 text-center font-mono rounded border border-slate-200 bg-white"
                  />
                  <button
                    type="button"
                    @click="nodeCount = nodeCount + 1"
                    class="w-7 h-8 rounded border border-slate-200 bg-white text-xs font-bold hover:bg-slate-100"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-2">
              <div>
                <label class="text-[11px] text-slate-500 font-medium block mb-1">
                  Variegation Class
                </label>
                <select
                  v-model="variegation"
                  class="w-full text-xs px-2.5 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-[#227C5B]"
                >
                  <option value="high_marble">High Marble</option>
                  <option value="sectoral">Sectoral / Halfmoon</option>
                  <option value="stable">Genetically Stable</option>
                  <option value="sport">Sport Variegation</option>
                  <option value="standard">Standard Green</option>
                </select>
              </div>

              <div>
                <label class="text-[11px] text-slate-500 font-medium block mb-1">
                  Est. Value ($ USD)
                </label>
                <input
                  type="number"
                  v-model.number="estimatedValue"
                  class="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-[#227C5B] font-mono"
                />
              </div>
            </div>

            <div>
              <label class="text-[11px] text-slate-500 font-medium block mb-1">
                Substrate &amp; Growth Notes
              </label>
              <textarea
                rows="2"
                v-model="notes"
                class="w-full text-xs px-3 py-1.5 rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-[#227C5B]"
              ></textarea>
            </div>
          </div>

          <!-- Guarantee -->
          <div class="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200/60 flex items-center gap-2 text-xs text-[#1A6247]">
            <ShieldCheck class="w-5 h-5 text-[#227C5B] shrink-0" />
            <span>
              Timestamp, GPS location and user handle will be burned directly into the image raster.
            </span>
          </div>
        </div>
      </div>

      <!-- Footer Actions -->
      <div class="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
        <button
          type="button"
          @click="emit('close')"
          class="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
        >
          Cancel
        </button>

        <button
          type="button"
          @click="handlePublishListing"
          class="flex items-center gap-2 bg-[#227C5B] hover:bg-[#1A6247] text-white px-6 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all shadow-xs cursor-pointer"
        >
          <ShieldCheck class="w-4 h-4 text-emerald-200" />
          <span>Publish Verified Passport Listing</span>
        </button>
      </div>
    </div>
  </div>
</template>
