<script setup lang="ts">
import { Camera, ShieldCheck, Hash, Sparkles } from 'lucide-vue-next';
import { PlantSpecimen } from '../types';
import { CURRENT_USER } from '../data/mockData';

defineProps<{
  userSpecimens: PlantSpecimen[];
}>();

const emit = defineEmits<{
  (e: 'openModal'): void;
  (e: 'inspectPassport', specimen: PlantSpecimen): void;
}>();
</script>

<template>
  <div class="space-y-8 pb-16">
    <!-- Modern Greenhouse Hero -->
    <div class="bg-gradient-to-br from-emerald-50/70 via-white to-slate-50 rounded-2xl border border-slate-200 p-6 md:p-10 shadow-xs">
      <div class="max-w-3xl space-y-4">
        <div class="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#227C5B] bg-emerald-100/70 px-3 py-1 rounded-md w-fit border border-emerald-200/60 font-semibold">
          <Camera class="w-3.5 h-3.5" />
          <span>Proof of Life &amp; Digital Passport Engine</span>
        </div>

        <h1 class="font-display text-3xl md:text-4xl font-bold text-slate-900 leading-tight text-balance">
          Tamper-Proof Camera Verification for Rare Cultivars
        </h1>

        <p class="text-sm md:text-base text-slate-600 leading-relaxed">
          Leaf &amp; Node strictly bans stock photos, screenshot uploads, and archived gallery images. Every specimen listed for trade requires an in-app live camera capture that burns user handle, GPS coordinates, UTC timestamp, and node count directly into the image raster.
        </p>

        <div class="pt-2 flex flex-wrap items-center gap-4">
          <button
            @click="emit('openModal')"
            class="flex items-center gap-2 bg-[#227C5B] hover:bg-[#1A6247] text-white px-6 py-3 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all shadow-xs cursor-pointer"
          >
            <Camera class="w-4 h-4 text-emerald-200" />
            <span>Launch Live Camera &amp; Mint Passport</span>
          </button>
          <span class="text-xs text-slate-500 font-mono">
            Supports live webcams or instant rare specimen presets
          </span>
        </div>
      </div>

      <!-- 3 Verification Principles -->
      <div class="mt-8 pt-8 border-t border-slate-200/80 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-700">
        <div class="space-y-2 p-5 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <div class="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#227C5B]">
            <ShieldCheck class="w-4 h-4" />
          </div>
          <h4 class="font-display text-sm font-bold text-slate-900">
            01. Hardware-Direct Stream
          </h4>
          <p class="text-slate-500 leading-relaxed">
            Video is captured directly from device optics into canvas memory, preventing manipulated image file uploads.
          </p>
        </div>

        <div class="space-y-2 p-5 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <div class="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#227C5B]">
            <Hash class="w-4 h-4" />
          </div>
          <h4 class="font-display text-sm font-bold text-slate-900">
            02. Cryptographic Stamp
          </h4>
          <p class="text-slate-500 leading-relaxed">
            Stamps verified GPS latitude/longitude, collector handle, UTC date, and SHA-256 seal onto the permanent image.
          </p>
        </div>

        <div class="space-y-2 p-5 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <div class="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[#227C5B]">
            <Sparkles class="w-4 h-4" />
          </div>
          <h4 class="font-display text-sm font-bold text-slate-900">
            03. Node &amp; Trait Registration
          </h4>
          <p class="text-slate-500 leading-relaxed">
            Visual crosshair aligns nodes and verifies developmental stage: unrooted node, rooted cutting, or established plant.
          </p>
        </div>
      </div>
    </div>

    <!-- User's Verified Portfolio Registry -->
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="font-display text-2xl font-bold text-slate-900">
            Your Registered Plant Passports ({{ userSpecimens.length }})
          </h2>
          <p class="text-xs text-slate-500">
            Active specimens registered under {{ CURRENT_USER.handle }} in Portland, OR
          </p>
        </div>

        <button
          @click="emit('openModal')"
          class="text-xs font-semibold text-[#227C5B] hover:text-[#1A6247] cursor-pointer"
        >
          + Register Another Specimen
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="specimen in userSpecimens"
          :key="specimen.id"
          class="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs hover:border-[#227C5B]/50 transition-all flex flex-col justify-between"
        >
          <div>
            <div class="relative aspect-4/3 bg-slate-100">
              <img
                :src="specimen.imageUrl"
                :alt="specimen.commonName"
                class="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div class="absolute top-3 left-3 bg-slate-900/90 text-white px-2 py-0.5 rounded text-[10px] font-mono border border-white/10">
                PASSPORT #{{ specimen.passport.id }}
              </div>
            </div>

            <div class="p-4 space-y-2">
              <h3 class="font-display text-base font-bold text-slate-900">
                {{ specimen.commonName }}
              </h3>
              <p class="text-xs italic text-slate-500">
                {{ specimen.botanicalName }}
              </p>

              <div class="text-xs text-slate-600 space-y-1 pt-2 border-t border-slate-100">
                <div class="flex justify-between">
                  <span class="text-slate-400">Maturity:</span>
                  <span class="font-semibold text-slate-800 capitalize">
                    {{ specimen.developmentalStage.replace('_', ' ') }}
                  </span>
                </div>
                <div class="flex justify-between">
                  <span class="text-slate-400">Nodes Stated:</span>
                  <span class="font-mono font-semibold text-slate-900">
                    {{ specimen.nodeCount }} verified nodes
                  </span>
                </div>
                <div class="flex justify-between">
                  <span class="text-slate-400">Valuation:</span>
                  <span class="font-mono font-bold text-[#227C5B]">
                    ${{ specimen.estimatedValueUsd }} USD
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div class="p-4 pt-0">
            <button
              type="button"
              @click="emit('inspectPassport', specimen)"
              class="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            >
              Inspect Full Passport Record
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
