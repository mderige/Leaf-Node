<script setup lang="ts">
import { ref, computed } from 'vue';
import { ShieldCheck, Search, ArrowRightLeft, Eye, Sparkles } from 'lucide-vue-next';
import { PlantSpecimen } from '../types';
import { plantImages } from '../assets/plantImages';

const props = defineProps<{
  specimens: PlantSpecimen[];
}>();

const emit = defineEmits<{
  (e: 'inspectPassport', specimen: PlantSpecimen): void;
  (e: 'initiateTrade', specimen: PlantSpecimen): void;
  (e: 'openVerificationModal'): void;
}>();

const activeTab = ref<'all' | 'have' | 'want'>('all');
const selectedStage = ref<string>('all');
const selectedRadius = ref<number>(50);
const searchQuery = ref<string>('');

const filteredSpecimens = computed(() => {
  return props.specimens.filter((specimen) => {
    if (activeTab.value === 'have' && specimen.type !== 'have') return false;
    if (activeTab.value === 'want' && specimen.type !== 'want') return false;
    if (selectedStage.value !== 'all' && specimen.developmentalStage !== selectedStage.value) return false;
    if (specimen.owner.distanceMiles > selectedRadius.value) return false;

    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase();
      const matchCommon = specimen.commonName.toLowerCase().includes(q);
      const matchBotanical = specimen.botanicalName.toLowerCase().includes(q);
      const matchOwner = specimen.owner.name.toLowerCase().includes(q) || specimen.owner.handle.toLowerCase().includes(q);
      if (!matchCommon && !matchBotanical && !matchOwner) return false;
    }

    return true;
  });
});
</script>

<template>
  <div class="space-y-8 pb-16">
    <!-- Modern Greenhouse Hero Banner -->
    <section class="relative rounded-2xl bg-gradient-to-br from-emerald-50/70 via-white to-slate-50 border border-slate-200/90 overflow-hidden shadow-xs">
      <div class="grid grid-cols-1 lg:grid-cols-12 items-center">
        <div class="lg:col-span-7 p-8 md:p-12 space-y-4">
          <div class="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#227C5B] bg-emerald-100/70 px-3 py-1 rounded-md w-fit border border-emerald-200/60 font-semibold">
            <Sparkles class="w-3.5 h-3.5 text-[#227C5B]" />
            <span>Next-Gen Botanical Exchange</span>
          </div>

          <h1 class="font-display text-3xl md:text-5xl font-bold tracking-tight text-slate-900 leading-[1.15] text-balance">
            Trade Verified Rare Cultivars with Zero Guesswork.
          </h1>

          <p class="text-sm md:text-base text-slate-600 max-w-xl leading-relaxed">
            Every specimen is authenticated using real-time live camera capture, instant tamper-proof digital passports, node-level developmental tagging, and route weather monitoring.
          </p>

          <div class="pt-2 flex flex-wrap items-center gap-3">
            <button
              @click="emit('openVerificationModal')"
              class="bg-[#227C5B] text-white hover:bg-[#1A6247] active:scale-98 px-5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all shadow-xs cursor-pointer"
            >
              Mint Plant Passport
            </button>

            <div class="flex items-center gap-2 text-xs text-slate-500 px-2 font-mono">
              <ShieldCheck class="w-4 h-4 text-[#227C5B]" />
              <span>100% Anti-fraud hardware verified</span>
            </div>
          </div>
        </div>

        <div class="lg:col-span-5 h-64 lg:h-full min-h-[290px] relative">
          <img
            :src="plantImages.heroMonstera"
            alt="Variegated Monstera Albo"
            class="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-white/90 via-transparent to-transparent lg:bg-gradient-to-r lg:from-white/90 lg:via-transparent lg:to-transparent"></div>
          <div class="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-md text-[11px] font-mono text-[#1A6247] border border-slate-200/80 shadow-xs font-semibold">
            #LN-OR-8821-POL · 2 Nodes Verified
          </div>
        </div>
      </div>
    </section>

    <!-- Sleek Filter Bar -->
    <section class="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-4">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <!-- Segmented Filter Control -->
        <div class="flex items-center gap-1 p-1 bg-slate-100/80 rounded-lg border border-slate-200/60 w-fit">
          <button
            @click="activeTab = 'all'"
            :class="[
              'px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap cursor-pointer',
              activeTab === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            ]"
          >
            All Listings ({{ specimens.length }})
          </button>
          <button
            @click="activeTab = 'have'"
            :class="[
              'px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap cursor-pointer',
              activeTab === 'have'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            ]"
          >
            Have (Available)
          </button>
          <button
            @click="activeTab = 'want'"
            :class="[
              'px-3.5 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap cursor-pointer',
              activeTab === 'want'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            ]"
          >
            Want (Wishlist)
          </button>
        </div>

        <!-- Sleek Search Bar -->
        <div class="relative flex-1 max-w-xs">
          <Search class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search cultivar, species, collector..."
            v-model="searchQuery"
            class="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-[#227C5B] transition-colors"
          />
        </div>
      </div>

      <!-- Secondary Trait Filters -->
      <div class="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
        <div class="flex flex-wrap items-center gap-3">
          <div class="flex items-center gap-2">
            <span class="font-semibold text-slate-700">Maturity:</span>
            <select
              v-model="selectedStage"
              class="px-2.5 py-1 rounded-md border border-slate-200 bg-slate-50/60 text-xs focus:outline-none focus:border-[#227C5B]"
            >
              <option value="all">All Developmental Stages</option>
              <option value="unrooted_node">Unrooted Node</option>
              <option value="rooted_cutting">Rooted Cutting</option>
              <option value="established">Established Plant</option>
            </select>
          </div>

          <div class="flex items-center gap-2">
            <span class="font-semibold text-slate-700">Radius:</span>
            <div class="flex items-center gap-1">
              <button
                v-for="radius in [10, 25, 50]"
                :key="radius"
                @click="selectedRadius = radius"
                :class="[
                  'px-2.5 py-1 rounded-md text-xs font-mono transition-all cursor-pointer',
                  selectedRadius === radius
                    ? 'bg-[#227C5B] text-white font-semibold shadow-xs'
                    : 'bg-slate-100/70 text-slate-600 hover:bg-slate-200/60'
                ]"
              >
                {{ radius }}mi
              </button>
            </div>
          </div>
        </div>

        <div class="text-slate-500 text-xs font-mono">
          Showing <span class="font-semibold text-slate-900">{{ filteredSpecimens.length }}</span> verified specimens
        </div>
      </div>
    </section>

    <!-- Specimen Cards Grid (Sleek Modern Cards) -->
    <div v-if="filteredSpecimens.length === 0" class="text-center py-16 bg-white rounded-xl border border-slate-200 space-y-3">
      <p class="font-display text-lg font-bold text-slate-900">No verified specimens match your query.</p>
      <p class="text-xs text-slate-500">Try adjusting your geographic radius or resetting the maturity filter.</p>
      <button
        @click="selectedStage = 'all'; selectedRadius = 50; searchQuery = ''; activeTab = 'all'"
        class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
      >
        Reset Filters
      </button>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <article
        v-for="specimen in filteredSpecimens"
        :key="specimen.id"
        class="group bg-white rounded-xl border border-slate-200/90 overflow-hidden flex flex-col justify-between hover:border-[#227C5B]/50 hover:shadow-md transition-all duration-200"
      >
        <div>
          <!-- Product Imagery -->
          <div class="relative aspect-4/3 bg-slate-100 overflow-hidden">
            <img
              :src="specimen.imageUrl"
              :alt="specimen.commonName"
              class="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
              referrerPolicy="no-referrer"
            />

            <!-- Header overlay tag -->
            <div class="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
              <div class="flex items-center gap-1.5 bg-white/95 backdrop-blur-md text-[#1A6247] px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold border border-emerald-200/60 shadow-xs">
                <ShieldCheck class="w-3.5 h-3.5 text-[#227C5B]" />
                <span>POL VERIFIED</span>
              </div>

              <span :class="[
                'text-[11px] font-semibold px-2 py-0.5 rounded-md shadow-xs',
                specimen.type === 'have'
                  ? 'bg-slate-900 text-white'
                  : 'bg-emerald-100 text-[#1A6247]'
              ]">
                {{ specimen.type === 'have' ? 'Available to Trade' : 'Wishlist Request' }}
              </span>
            </div>

            <!-- Bottom Image Scrim -->
            <div class="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[11px] text-slate-100 font-mono bg-slate-900/75 backdrop-blur-sm px-2.5 py-1 rounded-md border border-white/10">
              <span class="truncate">{{ specimen.owner.city }}, {{ specimen.owner.state }}</span>
              <span>{{ specimen.owner.distanceMiles === 0 ? 'Your Portfolio' : `${specimen.owner.distanceMiles} mi away` }}</span>
            </div>
          </div>

          <!-- Sleek Content Body -->
          <div class="p-5 space-y-3">
            <div>
              <span class="text-[11px] text-slate-500 uppercase font-mono tracking-wider block">
                {{ specimen.cultivar || 'Species Wildtype' }}
              </span>
              <h3 class="font-display text-base font-bold text-slate-900 leading-snug group-hover:text-[#227C5B] transition-colors">
                {{ specimen.commonName }}
              </h3>
              <p class="text-xs italic text-slate-500">
                {{ specimen.botanicalName }}
              </p>
            </div>

            <!-- Clean Unboxed Metadata with Interpuncts -->
            <div class="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 py-1 border-y border-slate-100">
              <span class="font-mono font-semibold text-slate-900">
                {{ specimen.nodeCount }} {{ specimen.nodeCount === 1 ? 'Node' : 'Nodes' }}
              </span>
              <span aria-hidden="true">·</span>
              <span class="capitalize">{{ specimen.developmentalStage.replace('_', ' ') }}</span>
              <span aria-hidden="true">·</span>
              <span class="capitalize">{{ specimen.variegationStability.replace('_', ' ') }}</span>
            </div>

            <!-- Trader Karma Row -->
            <div class="flex items-center justify-between text-xs text-slate-600">
              <div class="flex items-center gap-1.5">
                <img
                  :src="specimen.owner.avatarUrl"
                  :alt="specimen.owner.name"
                  class="w-5 h-5 rounded-full object-cover border border-slate-200"
                />
                <span class="font-medium text-slate-900">{{ specimen.owner.handle }}</span>
              </div>

              <div class="font-mono text-[11px] text-[#227C5B] font-semibold">
                ★ {{ specimen.owner.karma.overall.toFixed(2) }} ({{ specimen.owner.karma.totalTrades }})
              </div>
            </div>

            <!-- Price Valuation -->
            <div class="flex items-baseline justify-between pt-1">
              <span class="text-[11px] text-slate-500">Fair Market Valuation</span>
              <span class="font-mono text-base font-bold text-slate-900">
                ${{ specimen.estimatedValueUsd }} <span class="text-[10px] text-slate-400 font-sans">USD</span>
              </span>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="p-5 pt-0 grid grid-cols-2 gap-2">
          <button
            type="button"
            @click="emit('inspectPassport', specimen)"
            class="w-full flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-lg border border-slate-200 bg-slate-50/60 text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <Eye class="w-3.5 h-3.5 text-slate-500" />
            <span>Passport</span>
          </button>

          <button
            type="button"
            @click="emit('initiateTrade', specimen)"
            class="w-full flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-lg bg-[#227C5B] text-white hover:bg-[#1A6247] transition-colors shadow-2xs cursor-pointer"
          >
            <ArrowRightLeft class="w-3.5 h-3.5 text-emerald-200" />
            <span>Propose Trade</span>
          </button>
        </div>
      </article>
    </div>
  </div>
</template>
