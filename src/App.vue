<script setup lang="ts">
import { ref } from 'vue';
import Navbar from './components/Navbar.vue';
import MarketplaceFeed from './components/MarketplaceFeed.vue';
import MatchmakerView from './components/MatchmakerView.vue';
import ProofOfLifeStudio from './components/ProofOfLifeStudio.vue';
import ChatNegotiationView from './components/ChatNegotiationView.vue';
import PassportDetailModal from './components/PassportDetailModal.vue';
import CameraVerificationModal from './components/CameraVerificationModal.vue';
import { INITIAL_SPECIMENS, INITIAL_MATCHES, SAMPLE_NEGOTIATION, CURRENT_USER } from './data/mockData';
import { PlantSpecimen, TradeMatch, ActiveTradeNegotiation } from './types';
import { Sprout, ShieldCheck } from 'lucide-vue-next';

const activeTab = ref<'marketplace' | 'matchmaker' | 'verification' | 'chat'>('marketplace');
const specimens = ref<PlantSpecimen[]>(INITIAL_SPECIMENS);
const matches = ref<TradeMatch[]>(INITIAL_MATCHES);
const negotiation = ref<ActiveTradeNegotiation>(SAMPLE_NEGOTIATION);
const selectedPassportSpecimen = ref<PlantSpecimen | null>(null);
const isVerificationModalOpen = ref(false);
const notification = ref<string | null>(null);

const showNotification = (msg: string) => {
  notification.value = msg;
  setTimeout(() => {
    notification.value = null;
  }, 4000);
};

const handleInspectPassport = (specimen: PlantSpecimen) => {
  selectedPassportSpecimen.value = specimen;
};

const handleInitiateTrade = (partnerSpecimen: PlantSpecimen) => {
  const elenaSpecimen = specimens.value.find(s => s.owner.id === CURRENT_USER.id) || specimens.value[0];
  const valueGap = partnerSpecimen.estimatedValueUsd - elenaSpecimen.estimatedValueUsd;

  const newNeg: ActiveTradeNegotiation = {
    id: `neg-${Date.now()}`,
    partnerId: partnerSpecimen.owner.id,
    partnerName: partnerSpecimen.owner.name,
    partnerHandle: partnerSpecimen.owner.handle,
    partnerCity: `${partnerSpecimen.owner.city}, ${partnerSpecimen.owner.state}`,
    partnerDistanceMiles: partnerSpecimen.owner.distanceMiles,
    mySpecimen: elenaSpecimen,
    partnerSpecimen: partnerSpecimen,
    cashAdjustment: Math.max(0, valueGap),
    cashDirection: valueGap > 0 ? 'give' : 'receive',
    meetingMode: partnerSpecimen.owner.distanceMiles <= 20 ? 'local_meet' : 'weather_shipping',
    weatherReport: {
      originCity: `${CURRENT_USER.city}, ${CURRENT_USER.state}`,
      originTempF: 58,
      destinationCity: `${partnerSpecimen.owner.city}, ${partnerSpecimen.owner.state}`,
      destinationTempF: 32,
      transitRisk: 'freeze_warning',
      warningThresholdText: 'Cold threshold alert: destination below 35°F. Heat pack advised.',
      recommendedLogistics: '72-hour UniHeat pack or arrange climate-controlled vehicle hand-off.',
      heatPackRequired: true,
    },
    messages: [
      {
        id: `init-msg-1`,
        senderId: 'me',
        senderName: CURRENT_USER.name,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text: `Hi ${partnerSpecimen.owner.name}! I noticed your verified ${partnerSpecimen.commonName} and would love to propose a mutual exchange for my verified ${elenaSpecimen.commonName}.`,
        isProposal: true,
        proposalDetails: {
          offeredPlantId: elenaSpecimen.id,
          requestedPlantId: partnerSpecimen.id,
          cashAmount: Math.max(0, valueGap),
          cashDirection: 'give',
          method: partnerSpecimen.owner.distanceMiles <= 20 ? 'local_meet' : 'weather_shipping',
          status: 'pending',
        },
      },
    ],
    status: 'active',
  };

  negotiation.value = newNeg;
  activeTab.value = 'chat';
  showNotification(`Trade room initialized with ${partnerSpecimen.owner.name}!`);
};

const handleOpenNegotiationFromMatch = (match: TradeMatch) => {
  const valueGap = match.partnerRequested.estimatedValueUsd - match.userOffered.estimatedValueUsd;

  const loadedNeg: ActiveTradeNegotiation = {
    id: `neg-${match.id}`,
    partnerId: match.partnerRequested.owner.id,
    partnerName: match.partnerRequested.owner.name,
    partnerHandle: match.partnerRequested.owner.handle,
    partnerCity: `${match.partnerRequested.owner.city}, ${match.partnerRequested.owner.state}`,
    partnerDistanceMiles: match.distanceMiles,
    mySpecimen: match.userOffered,
    partnerSpecimen: match.partnerRequested,
    cashAdjustment: Math.abs(valueGap),
    cashDirection: valueGap > 0 ? 'give' : 'receive',
    meetingMode: match.distanceMiles <= 25 ? 'local_meet' : 'weather_shipping',
    weatherReport: {
      originCity: 'Portland, OR',
      originTempF: 58,
      destinationCity: `${match.partnerRequested.owner.city}, ${match.partnerRequested.owner.state}`,
      destinationTempF: 32,
      transitRisk: 'freeze_warning',
      warningThresholdText: 'Destination temperature is below 35°F (1.6°C). Heat pack required for safe transport.',
      recommendedLogistics: 'Insulated shipper box with UniHeat 72hr or local hand-off.',
      heatPackRequired: true,
    },
    messages: [
      {
        id: `match-msg-1`,
        senderId: 'partner',
        senderName: match.partnerRequested.owner.name,
        timestamp: '9:45 AM',
        text: `Hey Elena! The matchmaker flagged our portfolios as a 94% mutual match. I love the sectoring on your Monstera Albo!`,
      },
      {
        id: `match-msg-2`,
        senderId: 'me',
        senderName: CURRENT_USER.name,
        timestamp: '9:50 AM',
        text: `Hi ${match.partnerRequested.owner.name}! Yes, your ${match.partnerRequested.commonName} is at the top of my wishlist. Let's arrange terms.`,
        isProposal: true,
        proposalDetails: {
          offeredPlantId: match.userOffered.id,
          requestedPlantId: match.partnerRequested.id,
          cashAmount: Math.abs(valueGap),
          cashDirection: valueGap > 0 ? 'give' : 'receive',
          method: match.distanceMiles <= 25 ? 'local_meet' : 'weather_shipping',
          status: 'pending',
        },
      },
    ],
    status: 'active',
  };

  negotiation.value = loadedNeg;
  activeTab.value = 'chat';
};

const handleSpecimenCreated = (newSpecimen: PlantSpecimen) => {
  specimens.value = [newSpecimen, ...specimens.value];
  
  const partnerPlant = specimens.value.find(s => s.owner.id !== CURRENT_USER.id) || specimens.value[1];
  const newMatch: TradeMatch = {
    id: `match-dyn-${Date.now()}`,
    userOffered: newSpecimen,
    partnerRequested: partnerPlant,
    distanceMiles: partnerPlant.owner.distanceMiles,
    matchScore: 96,
    recommendedCashAdjustment: Math.abs(partnerPlant.estimatedValueUsd - newSpecimen.estimatedValueUsd),
    adjustmentDirection: partnerPlant.estimatedValueUsd > newSpecimen.estimatedValueUsd ? 'give' : 'receive',
    rationale: `Instant match generated for newly watermarked ${newSpecimen.commonName} with ${partnerPlant.owner.name}.`,
  };
  matches.value = [newMatch, ...matches.value];

  showNotification(`Digital Plant Passport #${newSpecimen.passport.id} burned & listed in marketplace!`);
  activeTab.value = 'marketplace';
};

const handleUpdateNegotiation = (updated: ActiveTradeNegotiation) => {
  negotiation.value = updated;
};
</script>

<template>
  <div class="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans selection:bg-[#DCFCE7] selection:text-[#15803D]">
    <!-- Top Notification Toast -->
    <div 
      v-if="notification"
      class="fixed top-20 right-6 z-50 bg-[#227C5B] text-white px-4 py-2.5 rounded-lg shadow-lg border border-emerald-400/40 text-xs flex items-center gap-2 animate-bounce"
    >
      <ShieldCheck class="w-4 h-4 text-emerald-200" />
      <span>{{ notification }}</span>
    </div>

    <!-- Primary Top Bar -->
    <Navbar
      :activeTab="activeTab"
      :matchCount="matches.length"
      @update:activeTab="activeTab = $event"
      @openVerificationModal="isVerificationModalOpen = true"
    />

    <!-- Main Workspace -->
    <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <MarketplaceFeed
        v-if="activeTab === 'marketplace'"
        :specimens="specimens"
        @inspectPassport="handleInspectPassport"
        @initiateTrade="handleInitiateTrade"
        @openVerificationModal="isVerificationModalOpen = true"
      />

      <MatchmakerView
        v-else-if="activeTab === 'matchmaker'"
        :matches="matches"
        @openNegotiation="handleOpenNegotiationFromMatch"
        @inspectPassport="handleInspectPassport"
      />

      <ProofOfLifeStudio
        v-else-if="activeTab === 'verification'"
        :userSpecimens="specimens.filter((s) => s.owner.id === CURRENT_USER.id)"
        @openModal="isVerificationModalOpen = true"
        @inspectPassport="handleInspectPassport"
      />

      <ChatNegotiationView
        v-else-if="activeTab === 'chat'"
        :negotiation="negotiation"
        @inspectPassport="handleInspectPassport"
        @updateNegotiation="handleUpdateNegotiation"
      />
    </main>

    <!-- Modals -->
    <PassportDetailModal
      :specimen="selectedPassportSpecimen"
      @close="selectedPassportSpecimen = null"
      @initiateTrade="handleInitiateTrade"
    />

    <CameraVerificationModal
      :isOpen="isVerificationModalOpen"
      @close="isVerificationModalOpen = false"
      @specimenCreated="handleSpecimenCreated"
    />

    <!-- Modern Clean Footer -->
    <footer class="mt-auto border-t border-slate-200/80 bg-white text-xs text-slate-500 py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="flex items-center gap-2.5">
          <div class="w-6 h-6 rounded bg-[#227C5B] flex items-center justify-center text-white">
            <Sprout class="w-3.5 h-3.5" />
          </div>
          <span class="font-display font-bold text-slate-900 text-sm">Leaf &amp; Node</span>
          <span aria-hidden="true">·</span>
          <span>Modern Botanical Trust &amp; Cultivar Exchange Protocol (Vue.js + Tailwind)</span>
        </div>

        <div class="flex items-center gap-6 text-slate-500 font-medium">
          <button 
            @click="activeTab = 'marketplace'" 
            class="hover:text-slate-900 transition-colors cursor-pointer"
          >
            Marketplace
          </button>
          <button 
            @click="activeTab = 'matchmaker'" 
            class="hover:text-slate-900 transition-colors cursor-pointer"
          >
            1:1 Radius Matchmaker
          </button>
          <button 
            @click="isVerificationModalOpen = true" 
            class="hover:text-slate-900 transition-colors cursor-pointer"
          >
            Mint Passport
          </button>
          <button 
            @click="activeTab = 'chat'" 
            class="hover:text-slate-900 transition-colors cursor-pointer"
          >
            Weather Logistics
          </button>
        </div>
      </div>
    </footer>
  </div>
</template>
