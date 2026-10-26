<script setup lang="ts">
import { ShieldCheck, Sprout } from 'lucide-vue-next';
import { CURRENT_USER } from '../data/mockData';

defineProps<{
  activeTab: 'marketplace' | 'matchmaker' | 'verification' | 'chat';
  matchCount: number;
}>();

const emit = defineEmits<{
  (e: 'update:activeTab', tab: 'marketplace' | 'matchmaker' | 'verification' | 'chat'): void;
  (e: 'openVerificationModal'): void;
}>();
</script>

<template>
  <header class="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-colors">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
      <!-- Zone 1: Single text wordmark with sleek modern logo (Top Bar Contract) -->
      <div 
        @click="emit('update:activeTab', 'marketplace')"
        class="flex items-center gap-2.5 cursor-pointer group shrink-0"
      >
        <div class="w-8 h-8 rounded-lg bg-[#227C5B] flex items-center justify-center text-white shadow-xs group-hover:bg-[#1A6247] transition-all">
          <Sprout class="w-4 h-4 text-emerald-100" />
        </div>
        <span class="font-display text-xl font-bold tracking-tight text-slate-900 whitespace-nowrap">
          Leaf &amp; Node
        </span>
      </div>

      <!-- Zone 2: 4 single-line links with sleek modern styling -->
      <nav class="hidden md:flex items-center gap-7 text-sm font-medium">
        <button
          @click="emit('update:activeTab', 'marketplace')"
          :class="[
            'whitespace-nowrap shrink-0 transition-colors py-1.5 border-b-2 text-xs uppercase tracking-wider font-semibold cursor-pointer',
            activeTab === 'marketplace'
              ? 'text-[#227C5B] border-[#227C5B]'
              : 'text-slate-600 border-transparent hover:text-slate-900'
          ]"
        >
          Marketplace &amp; Wishlists
        </button>

        <button
          @click="emit('update:activeTab', 'matchmaker')"
          :class="[
            'whitespace-nowrap shrink-0 transition-colors py-1.5 border-b-2 text-xs uppercase tracking-wider font-semibold flex items-center gap-1.5 cursor-pointer',
            activeTab === 'matchmaker'
              ? 'text-[#227C5B] border-[#227C5B]'
              : 'text-slate-600 border-transparent hover:text-slate-900'
          ]"
        >
          <span>1:1 Matchmaker</span>
          <span 
            v-if="matchCount > 0"
            class="text-[11px] bg-emerald-100 text-[#1A6247] px-1.5 py-0.2 rounded-full font-mono font-bold"
          >
            {{ matchCount }}
          </span>
        </button>

        <button
          @click="emit('update:activeTab', 'verification')"
          :class="[
            'whitespace-nowrap shrink-0 transition-colors py-1.5 border-b-2 text-xs uppercase tracking-wider font-semibold flex items-center gap-1.5 cursor-pointer',
            activeTab === 'verification'
              ? 'text-[#227C5B] border-[#227C5B]'
              : 'text-slate-600 border-transparent hover:text-slate-900'
          ]"
        >
          <span>Proof of Life Studio</span>
        </button>

        <button
          @click="emit('update:activeTab', 'chat')"
          :class="[
            'whitespace-nowrap shrink-0 transition-colors py-1.5 border-b-2 text-xs uppercase tracking-wider font-semibold flex items-center gap-1.5 cursor-pointer',
            activeTab === 'chat'
              ? 'text-[#227C5B] border-[#227C5B]'
              : 'text-slate-600 border-transparent hover:text-slate-900'
          ]"
        >
          <span>Trade Chat &amp; Weather</span>
        </button>
      </nav>

      <!-- Zone 3: 1 primary action -->
      <div class="flex items-center gap-4 shrink-0">
        <div class="hidden lg:flex items-center gap-2 text-xs text-slate-500 pr-2">
          <span class="font-mono text-slate-700">{{ CURRENT_USER.handle }}</span>
          <span aria-hidden="true">·</span>
          <span class="font-mono tabular-nums text-[#227C5B] font-semibold">
            ★ {{ CURRENT_USER.karma.overall.toFixed(2) }}
          </span>
        </div>

        <button
          @click="emit('openVerificationModal')"
          class="flex items-center gap-2 bg-[#227C5B] hover:bg-[#1A6247] text-white active:scale-98 px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all shadow-xs whitespace-nowrap cursor-pointer"
        >
          <ShieldCheck class="w-3.5 h-3.5 text-emerald-200" />
          <span>Verify Specimen</span>
        </button>
      </div>
    </div>
  </header>
</template>
