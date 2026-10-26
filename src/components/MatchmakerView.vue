<script setup lang="ts">
import { ref, computed } from 'vue';
import { ArrowRightLeft, Sparkles, MapPin, Scale, ChevronRight } from 'lucide-vue-next';
import { TradeMatch, PlantSpecimen } from '../types';

const props = defineProps<{
  matches: TradeMatch[];
}>();

const emit = defineEmits<{
  (e: 'openNegotiation', match: TradeMatch): void;
  (e: 'inspectPassport', specimen: PlantSpecimen): void;
}>();

const selectedRadius = ref<number>(25);
const minMatchScore = ref<number>(80);

const filteredMatches = computed(() => {
  return props.matches.filter(
    (m) => m.distanceMiles <= selectedRadius.value && m.matchScore >= minMatchScore.value
  );
});
</script>

<template>
  <div class="space-y-8 pb-16">
    <!-- Modern Greenhouse Matchmaker Explainer -->
    <div class="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-xs">
      <div class="max-w-3xl space-y-3">
        <div class="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#227C5B] bg-emerald-100/70 px-3 py-1 rounded-md w-fit border border-emerald-200/60 font-semibold">
          <Sparkles class="w-3.5 h-3.5 text-[#227C5B]" />
          <span>Algorithmic 1:1 Local Matchmaking Engine</span>
        </div>

        <h2 class="font-display text-2xl md:text-3xl font-bold text-slate-900 leading-tight">
          Complementary Swaps Within Your Geographic Radius
        </h2>

        <p class="text-sm text-slate-600 leading-relaxed">
          The engine automatically pairs your registered <strong>Have</strong> inventory with verified collectors in your commute radius who have your <strong>Want</strong> wishlists, providing instant fair market value gap calculations.
        </p>
      </div>

      <!-- Radius & Match Filter Strip -->
      <div class="mt-6 pt-5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-600">
        <div class="flex items-center gap-3">
          <span class="font-semibold text-slate-800 flex items-center gap-1.5">
            <MapPin class="w-4 h-4 text-slate-400" />
            Radius Corridor:
          </span>
          <div class="flex items-center gap-1.5">
            <button
              v-for="radius in [10, 25, 50]"
              :key="radius"
              @click="selectedRadius = radius"
              :class="[
                'px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer',
                selectedRadius === radius
                  ? 'bg-[#227C5B] text-white shadow-xs'
                  : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/80'
              ]"
            >
              {{ radius }} Miles
            </button>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <span class="font-semibold text-slate-800">Compatibility Threshold:</span>
          <div class="flex items-center gap-1.5">
            <button
              v-for="score in [80, 90, 95]"
              :key="score"
              @click="minMatchScore = score"
              :class="[
                'px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer',
                minMatchScore === score
                  ? 'bg-[#227C5B] text-white shadow-xs'
                  : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/80'
              ]"
            >
              {{ score }}%+
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Match Cards -->
    <div class="space-y-6">
      <div v-if="filteredMatches.length === 0" class="text-center py-16 bg-white rounded-xl border border-slate-200 space-y-3">
        <p class="font-display text-lg font-bold text-slate-900">No mutual 1:1 matches in this radius.</p>
        <p class="text-xs text-slate-500">Expand your radius or lower the compatibility score to discover more collectors.</p>
        <button
          @click="selectedRadius = 50; minMatchScore = 80"
          class="px-4 py-2 bg-[#227C5B] text-white rounded-lg text-xs font-semibold hover:bg-[#1A6247] transition-colors cursor-pointer"
        >
          Expand to 50 Miles
        </button>
      </div>

      <div
        v-else
        v-for="match in filteredMatches"
        :key="match.id"
        class="bg-white rounded-xl border border-slate-200/90 p-6 md:p-7 shadow-xs hover:border-[#227C5B]/50 transition-all"
      >
        <!-- Match Header Bar -->
        <div class="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div class="flex items-center gap-3">
            <img
              :src="match.partnerRequested.owner.avatarUrl"
              :alt="match.partnerRequested.owner.name"
              class="w-10 h-10 rounded-full object-cover border border-slate-200"
            />
            <div>
              <div class="flex items-center gap-2">
                <h3 class="font-display text-base font-bold text-slate-900">
                  Mutual Trade with {{ match.partnerRequested.owner.name }}
                </h3>
                <span class="text-xs text-slate-500 font-mono">{{ match.partnerRequested.owner.handle }}</span>
              </div>
              <div class="flex items-center gap-2 text-xs text-slate-500">
                <span>{{ match.partnerRequested.owner.city }}, {{ match.partnerRequested.owner.state }}</span>
                <span aria-hidden="true">·</span>
                <span class="font-semibold text-slate-800">{{ match.distanceMiles }} miles away</span>
                <span aria-hidden="true">·</span>
                <span class="text-[#227C5B] font-mono">
                  ★ {{ match.partnerRequested.owner.karma.overall.toFixed(2) }} ({{ match.partnerRequested.owner.karma.totalTrades }} trades)
                </span>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <div class="text-right">
              <span class="text-xs text-slate-400 block font-mono">Match Score</span>
              <span class="font-display text-xl font-bold text-[#227C5B]">
                {{ match.matchScore }}%
              </span>
            </div>

            <div class="w-10 h-10 rounded-full bg-emerald-50 text-[#227C5B] border border-emerald-200 flex items-center justify-center">
              <ArrowRightLeft class="w-5 h-5" />
            </div>
          </div>
        </div>

        <!-- Side-by-Side Exchange Visualization -->
        <div class="grid grid-cols-1 md:grid-cols-11 gap-4 items-center my-6">
          <!-- Left: Your Offering -->
          <div class="md:col-span-5 bg-slate-50/70 p-4 rounded-xl border border-slate-200/80 flex gap-4">
            <img
              :src="match.userOffered.imageUrl"
              :alt="match.userOffered.commonName"
              class="w-22 h-22 rounded-lg object-cover border border-slate-200 shrink-0 cursor-pointer"
              @click="emit('inspectPassport', match.userOffered)"
            />
            <div class="space-y-1 min-w-0">
              <span class="text-[10px] text-slate-500 font-mono uppercase tracking-wider block font-semibold">
                Your Offering (Have)
              </span>
              <h4 class="font-display text-sm font-bold text-slate-900 truncate">
                {{ match.userOffered.commonName }}
              </h4>
              <p class="text-[11px] italic text-slate-500 truncate">
                {{ match.userOffered.botanicalName }}
              </p>
              <div class="text-xs text-slate-500 pt-1">
                <span>{{ match.userOffered.nodeCount }} Nodes</span>
                <span aria-hidden="true"> · </span>
                <span class="capitalize">{{ match.userOffered.developmentalStage.replace('_', ' ') }}</span>
              </div>
              <div class="font-mono text-xs font-bold text-slate-900">
                Est. ${{ match.userOffered.estimatedValueUsd }} USD
              </div>
            </div>
          </div>

          <!-- Middle Arrow -->
          <div class="md:col-span-1 flex justify-center py-2 md:py-0">
            <div class="w-8 h-8 rounded-full bg-[#227C5B] text-white flex items-center justify-center shadow-xs">
              <ArrowRightLeft class="w-4 h-4 text-emerald-100" />
            </div>
          </div>

          <!-- Right: Partner's Offering -->
          <div class="md:col-span-5 bg-slate-50/70 p-4 rounded-xl border border-slate-200/80 flex gap-4">
            <img
              :src="match.partnerRequested.imageUrl"
              :alt="match.partnerRequested.commonName"
              class="w-22 h-22 rounded-lg object-cover border border-slate-200 shrink-0 cursor-pointer"
              @click="emit('inspectPassport', match.partnerRequested)"
            />
            <div class="space-y-1 min-w-0">
              <span class="text-[10px] text-slate-500 font-mono uppercase tracking-wider block font-semibold">
                Partner's Offering (Your Wishlist)
              </span>
              <h4 class="font-display text-sm font-bold text-slate-900 truncate">
                {{ match.partnerRequested.commonName }}
              </h4>
              <p class="text-[11px] italic text-slate-500 truncate">
                {{ match.partnerRequested.botanicalName }}
              </p>
              <div class="text-xs text-slate-500 pt-1">
                <span>{{ match.partnerRequested.nodeCount }} Nodes</span>
                <span aria-hidden="true"> · </span>
                <span class="capitalize">{{ match.partnerRequested.developmentalStage.replace('_', ' ') }}</span>
              </div>
              <div class="font-mono text-xs font-bold text-slate-900">
                Est. ${{ match.partnerRequested.estimatedValueUsd }} USD
              </div>
            </div>
          </div>
        </div>

        <!-- Fair Trade Valuation -->
        <div class="bg-emerald-50/50 p-4 rounded-xl border border-emerald-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div class="flex items-start gap-2.5">
            <Scale class="w-4 h-4 text-[#227C5B] shrink-0 mt-0.5" />
            <div>
              <span class="font-semibold text-slate-900 block">
                Equitable Value Assessment:
              </span>
              <span class="text-slate-600">
                {{ match.rationale }}
              </span>
            </div>
          </div>

          <div class="shrink-0 font-mono text-right bg-white px-3 py-1.5 rounded-md border border-slate-200 shadow-2xs">
            <span class="text-slate-500 block text-[10px]">Suggested Adjustment</span>
            <span class="font-bold text-[#227C5B] text-xs">
              {{ 
                match.partnerRequested.estimatedValueUsd - match.userOffered.estimatedValueUsd > 0
                  ? `+ $${match.partnerRequested.estimatedValueUsd - match.userOffered.estimatedValueUsd} (You provide)`
                  : match.partnerRequested.estimatedValueUsd - match.userOffered.estimatedValueUsd < 0
                  ? `+ $${Math.abs(match.partnerRequested.estimatedValueUsd - match.userOffered.estimatedValueUsd)} (Partner provides)`
                  : 'Direct Even Swap'
              }}
            </span>
          </div>
        </div>

        <!-- Footer Action -->
        <div class="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
          <button
            @click="emit('inspectPassport', match.partnerRequested)"
            class="text-xs font-semibold text-slate-600 hover:text-[#227C5B] transition-colors cursor-pointer"
          >
            View Partner's Proof of Life Passport →
          </button>

          <button
            @click="emit('openNegotiation', match)"
            class="flex items-center gap-2 bg-[#227C5B] hover:bg-[#1A6247] text-white px-5 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all shadow-xs cursor-pointer"
          >
            <span>Open Negotiation &amp; Weather Route</span>
            <ChevronRight class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
