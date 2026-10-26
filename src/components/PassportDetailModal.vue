<script setup lang="ts">
import { X, ShieldCheck, CheckCircle } from 'lucide-vue-next';
import { PlantSpecimen } from '../types';

defineProps<{
  specimen: PlantSpecimen | null;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'initiateTrade', specimen: PlantSpecimen): void;
}>();
</script>

<template>
  <div 
    v-if="specimen"
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto"
    @click="emit('close')"
  >
    <div 
      class="relative bg-white border border-slate-200 rounded-xl shadow-2xl max-w-3xl w-full overflow-hidden my-8"
      @click.stop
    >
      <!-- Header Ribbon -->
      <div class="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-[#227C5B] flex items-center justify-center text-white">
            <ShieldCheck class="w-5 h-5" />
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="text-[11px] uppercase tracking-wider text-emerald-300 font-mono font-semibold">
                Digital Plant Passport
              </span>
              <span class="text-xs text-slate-400 font-mono">
                #{{ specimen.passport.id }}
              </span>
            </div>
            <h3 class="font-display text-lg font-bold text-white leading-tight">
              {{ specimen.commonName }}
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

      <!-- Content Body -->
      <div class="p-6 md:p-8 space-y-6 max-h-[80vh] overflow-y-auto">
        <!-- Main Visual & Stamped Proof -->
        <div class="relative rounded-lg overflow-hidden border border-slate-200 bg-slate-950 group">
          <img
            :src="specimen.imageUrl"
            :alt="specimen.commonName"
            class="w-full h-80 object-cover"
            referrerPolicy="no-referrer"
          />

          <!-- Unalterable Watermark Overlay Simulation -->
          <div class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/40 pointer-events-none flex flex-col justify-between p-4 text-white">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded text-xs font-mono border border-emerald-500/40">
                <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span class="text-emerald-300 font-semibold">LIVE CAMERA VERIFIED</span>
              </div>
              <span class="text-xs font-mono text-slate-300">
                {{ specimen.passport.geoCoords }}
              </span>
            </div>

            <div class="space-y-1 font-mono text-xs text-slate-200 bg-slate-950/75 backdrop-blur-md p-3 rounded border border-white/10">
              <div class="flex items-center justify-between">
                <span class="text-emerald-300">PROPRIETOR: {{ specimen.owner.handle }}</span>
                <span>STAMP: {{ new Date(specimen.passport.capturedAt).toLocaleString() }}</span>
              </div>
              <div class="flex items-center justify-between text-slate-400 text-[11px]">
                <span>HASH: {{ specimen.passport.watermarkHash }}</span>
                <span>COUNT: {{ specimen.nodeCount }} Nodes · {{ specimen.leafCount }} Leaves</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Botanical Classification & Trait Breakdown -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/80 p-5 rounded-xl border border-slate-200">
          <div>
            <span class="text-[11px] uppercase tracking-wider text-[#227C5B] font-mono font-semibold block">
              Botanical Classification
            </span>
            <h4 class="font-display text-xl font-bold text-slate-900 mt-0.5">
              {{ specimen.botanicalName }}
            </h4>
            <p class="text-xs text-slate-500 mt-1">
              Cultivar: <span class="text-slate-900 font-medium">{{ specimen.cultivar || 'Wildtype' }}</span>
            </p>

            <div class="mt-4 space-y-2 text-xs text-slate-700">
              <div class="flex items-center justify-between py-1 border-b border-slate-200/80">
                <span class="text-slate-500">Developmental Maturity</span>
                <span class="font-semibold capitalize text-slate-900">
                  {{ specimen.developmentalStage.replace('_', ' ') }}
                </span>
              </div>
              <div class="flex items-center justify-between py-1 border-b border-slate-200/80">
                <span class="text-slate-500">Verified Active Nodes</span>
                <span class="font-mono font-semibold text-slate-900">{{ specimen.nodeCount }} node(s)</span>
              </div>
              <div class="flex items-center justify-between py-1 border-b border-slate-200/80">
                <span class="text-slate-500">Variegation Stability</span>
                <span class="font-semibold capitalize text-slate-900">
                  {{ specimen.variegationStability.replace('_', ' ') }}
                </span>
              </div>
              <div class="flex items-center justify-between py-1">
                <span class="text-slate-500">Fair Estimated Value</span>
                <span class="font-mono font-bold text-[#227C5B]">
                  ${{ specimen.estimatedValueUsd }} USD
                </span>
              </div>
            </div>
          </div>

          <!-- Phenotype & Growth Notes -->
          <div class="border-t md:border-t-0 md:border-l md:border-slate-200 md:pl-6 flex flex-col justify-between">
            <div>
              <span class="text-[11px] uppercase tracking-wider text-[#227C5B] font-mono font-semibold block">
                Phenotype &amp; Chimera Description
              </span>
              <p class="text-xs text-slate-600 mt-1 leading-relaxed">
                {{ specimen.variegationDescription }}
              </p>

              <span class="text-[11px] uppercase tracking-wider text-slate-500 font-mono font-semibold block mt-4">
                Collector Growth Record
              </span>
              <p class="text-xs text-slate-600 mt-1 leading-relaxed italic bg-white p-2.5 rounded-lg border border-slate-200/60">
                "{{ specimen.notes }}"
              </p>
            </div>

            <div class="mt-4 pt-3 border-t border-slate-200 flex items-center gap-2 text-xs text-[#227C5B]">
              <CheckCircle class="w-4 h-4 text-[#227C5B] shrink-0" />
              <span>Anti-fraud verification: live sensor stream required at capture</span>
            </div>
          </div>
        </div>

        <!-- Trader Multi-Metric Karma Scorecard -->
        <div class="border border-slate-200 rounded-xl p-5 bg-white shadow-2xs">
          <div class="flex items-center justify-between mb-4">
            <div>
              <span class="text-[11px] text-slate-400 font-mono uppercase tracking-wider block font-semibold">
                Trader Reliability Profile
              </span>
              <div class="flex items-center gap-2 mt-0.5">
                <h5 class="font-display text-base font-bold text-slate-900">
                  {{ specimen.owner.name }} ({{ specimen.owner.handle }})
                </h5>
                <span class="text-xs text-slate-500">
                  · {{ specimen.owner.city }}, {{ specimen.owner.state }} ({{ specimen.owner.distanceMiles }} mi away)
                </span>
              </div>
            </div>

            <div class="text-right">
              <span class="font-display text-2xl font-bold text-[#227C5B]">
                {{ specimen.owner.karma.overall.toFixed(2) }}
              </span>
              <span class="text-xs text-slate-400 block font-mono">
                {{ specimen.owner.karma.totalTrades }} verified trades
              </span>
            </div>
          </div>

          <!-- 4-Metric Breakdown -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div class="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span class="text-slate-500 block text-[11px]">Plant Health</span>
              <span class="font-mono font-bold text-slate-900 text-sm">
                {{ specimen.owner.karma.plantHealth.toFixed(1) }} / 5.0
              </span>
            </div>
            <div class="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span class="text-slate-500 block text-[11px]">Packaging Quality</span>
              <span class="font-mono font-bold text-slate-900 text-sm">
                {{ specimen.owner.karma.packagingQuality.toFixed(1) }} / 5.0
              </span>
            </div>
            <div class="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span class="text-slate-500 block text-[11px]">Species Authenticity</span>
              <span class="font-mono font-bold text-slate-900 text-sm">
                {{ specimen.owner.karma.authenticity.toFixed(1) }} / 5.0
              </span>
            </div>
            <div class="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span class="text-slate-500 block text-[11px]">Communication</span>
              <span class="font-mono font-bold text-slate-900 text-sm">
                {{ specimen.owner.karma.communication.toFixed(1) }} / 5.0
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Footer Actions -->
      <div class="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
        <button
          @click="emit('close')"
          class="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-lg transition-colors cursor-pointer"
        >
          Close Record
        </button>

        <button
          @click="emit('initiateTrade', specimen); emit('close')"
          class="flex items-center gap-2 bg-[#227C5B] hover:bg-[#1A6247] text-white px-5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all shadow-xs cursor-pointer"
        >
          <span>Propose Mutual Trade</span>
        </button>
      </div>
    </div>
  </div>
</template>
