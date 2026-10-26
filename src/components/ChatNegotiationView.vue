<script setup lang="ts">
import { ref, computed } from 'vue';
import { Send, Thermometer, ShieldCheck, CheckCircle2, MapPin, Truck, Plus, Minus, ArrowRightLeft } from 'lucide-vue-next';
import { ActiveTradeNegotiation, ChatMessage, PlantSpecimen } from '../types';
import { CURRENT_USER } from '../data/mockData';

const props = defineProps<{
  negotiation: ActiveTradeNegotiation;
}>();

const emit = defineEmits<{
  (e: 'inspectPassport', specimen: PlantSpecimen): void;
  (e: 'updateNegotiation', updated: ActiveTradeNegotiation): void;
}>();

const inputText = ref('');
const cashAmount = ref(props.negotiation.cashAdjustment);
const deliveryMode = ref<'local_meet' | 'weather_shipping'>(props.negotiation.meetingMode);

const originTemp = ref(58);
const destTemp = ref(31); // Triggers <35°F cold alert
const showSimControls = ref(true);

const minTemp = computed(() => Math.min(originTemp.value, destTemp.value));
const maxTemp = computed(() => Math.max(originTemp.value, destTemp.value));

const isColdRisk = computed(() => minTemp.value < 35);
const isHeatRisk = computed(() => maxTemp.value > 90);

const handleSendMessage = () => {
  if (!inputText.value.trim()) return;

  const newMessage: ChatMessage = {
    id: `msg-${Date.now()}`,
    senderId: 'me',
    senderName: CURRENT_USER.name,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    text: inputText.value.trim(),
  };

  const updated: ActiveTradeNegotiation = {
    ...props.negotiation,
    messages: [...props.negotiation.messages, newMessage],
  };

  emit('updateNegotiation', updated);
  inputText.value = '';
};

const handleAcceptProposal = () => {
  const confirmMessage: ChatMessage = {
    id: `msg-${Date.now()}`,
    senderId: 'system',
    senderName: 'Leaf & Node Escrow',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    text: `Trade Terms Confirmed! Both plant passports locked into trade escrow. Cash adjustment of $${cashAmount.value} registered. Safe trading logistics enabled.`,
  };

  const updated: ActiveTradeNegotiation = {
    ...props.negotiation,
    cashAdjustment: cashAmount.value,
    meetingMode: deliveryMode.value,
    status: 'agreed',
    messages: [...props.negotiation.messages, confirmMessage],
  };

  emit('updateNegotiation', updated);
};

const handleSendUpdatedProposal = () => {
  const proposalMessage: ChatMessage = {
    id: `msg-${Date.now()}`,
    senderId: 'me',
    senderName: CURRENT_USER.name,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    text: `Updated Trade Offer: My ${props.negotiation.mySpecimen.commonName} for your ${props.negotiation.partnerSpecimen.commonName} with a $${cashAmount.value} cash adjustment (${deliveryMode.value === 'local_meet' ? 'Local Hand-off' : 'Insulated Courier'}).`,
    isProposal: true,
    proposalDetails: {
      offeredPlantId: props.negotiation.mySpecimen.id,
      requestedPlantId: props.negotiation.partnerSpecimen.id,
      cashAmount: cashAmount.value,
      cashDirection: 'give',
      method: deliveryMode.value,
      status: 'pending',
    },
  };

  const updated: ActiveTradeNegotiation = {
    ...props.negotiation,
    cashAdjustment: cashAmount.value,
    meetingMode: deliveryMode.value,
    messages: [...props.negotiation.messages, proposalMessage],
  };

  emit('updateNegotiation', updated);
};
</script>

<template>
  <div class="space-y-6 pb-16">
    <!-- Top Trade Context Card -->
    <div class="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-[#227C5B] text-white flex items-center justify-center font-display text-lg font-bold">
            {{ negotiation.partnerName.charAt(0) }}
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h3 class="font-display text-lg font-bold text-slate-900">
                Trade Negotiation with {{ negotiation.partnerName }}
              </h3>
              <span class="text-xs font-mono text-slate-500">
                {{ negotiation.partnerHandle }}
              </span>
            </div>
            <div class="flex items-center gap-2 text-xs text-slate-500">
              <span>{{ negotiation.partnerCity }}</span>
              <span aria-hidden="true">·</span>
              <span>{{ negotiation.partnerDistanceMiles }} miles away</span>
              <span aria-hidden="true">·</span>
              <span class="text-[#227C5B] font-semibold font-mono">
                ★ {{ negotiation.partnerSpecimen.owner.karma.overall.toFixed(2) }} Trader Karma
              </span>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <button
            @click="emit('inspectPassport', negotiation.partnerSpecimen)"
            class="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50/70 text-xs font-semibold text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Inspect Partner's Passport
          </button>
          <button
            @click="emit('inspectPassport', negotiation.mySpecimen)"
            class="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50/70 text-xs font-semibold text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Inspect My Passport
          </button>
        </div>
      </div>

      <!-- Trade Items & Cash Counter -->
      <div class="grid grid-cols-1 md:grid-cols-12 gap-4 items-center pt-4">
        <div class="md:col-span-5 flex items-center gap-3 p-3 bg-slate-50/70 rounded-xl border border-slate-200/80">
          <img
            :src="negotiation.mySpecimen.imageUrl"
            :alt="negotiation.mySpecimen.commonName"
            class="w-14 h-14 rounded-lg object-cover border border-slate-200 shrink-0"
          />
          <div class="min-w-0">
            <span class="text-[10px] text-slate-500 font-mono uppercase font-semibold block">You Offer</span>
            <h4 class="font-display text-xs font-bold text-slate-900 truncate">
              {{ negotiation.mySpecimen.commonName }}
            </h4>
            <div class="text-[11px] text-slate-500">
              {{ negotiation.mySpecimen.nodeCount }} Nodes · Est. ${{ negotiation.mySpecimen.estimatedValueUsd }}
            </div>
          </div>
        </div>

        <div class="md:col-span-2 flex flex-col items-center justify-center text-center">
          <ArrowRightLeft class="w-5 h-5 text-[#227C5B] mb-1" />
          <span class="text-[11px] font-mono font-bold text-slate-900">
            +$ {{ cashAmount }} Cash
          </span>
        </div>

        <div class="md:col-span-5 flex items-center gap-3 p-3 bg-slate-50/70 rounded-xl border border-slate-200/80">
          <img
            :src="negotiation.partnerSpecimen.imageUrl"
            :alt="negotiation.partnerSpecimen.commonName"
            class="w-14 h-14 rounded-lg object-cover border border-slate-200 shrink-0"
          />
          <div class="min-w-0">
            <span class="text-[10px] text-slate-500 font-mono uppercase font-semibold block">You Receive</span>
            <h4 class="font-display text-xs font-bold text-slate-900 truncate">
              {{ negotiation.partnerSpecimen.commonName }}
            </h4>
            <div class="text-[11px] text-slate-500">
              {{ negotiation.partnerSpecimen.nodeCount }} Nodes · Est. ${{ negotiation.partnerSpecimen.estimatedValueUsd }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Weather Transit Alert Bar (Live API Specification Implementation) -->
    <div :class="[
      'rounded-xl border p-5 transition-all shadow-xs',
      isColdRisk
        ? 'bg-rose-50/80 border-rose-200'
        : isHeatRisk
        ? 'bg-amber-50/80 border-amber-200'
        : 'bg-emerald-50/60 border-emerald-200/80'
    ]">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="flex items-start gap-3">
          <div :class="[
            'p-2 rounded-lg shrink-0',
            isColdRisk
              ? 'bg-rose-600 text-white'
              : isHeatRisk
              ? 'bg-amber-600 text-white'
              : 'bg-[#227C5B] text-white'
          ]">
            <Thermometer class="w-5 h-5" />
          </div>

          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <span :class="[
                'text-xs font-mono font-bold uppercase tracking-wider',
                isColdRisk ? 'text-rose-700' : isHeatRisk ? 'text-amber-800' : 'text-[#1A6247]'
              ]">
                {{
                  isColdRisk
                    ? 'Transit Route Warning (<35°F Freezing Risk)'
                    : isHeatRisk
                    ? 'Transit Route Warning (>90°F Heat Shock Risk)'
                    : 'Optimal Botanical Transit Route (Safe)'
                }}
              </span>
              <span class="text-xs text-slate-500 font-mono">
                Portland ({{ originTemp }}°F) ↔ Vancouver ({{ destTemp }}°F)
              </span>
            </div>

            <p class="text-xs text-slate-700 leading-relaxed">
              <span v-if="isColdRisk">
                <strong>Cold Threshold Alert (&lt;35°F / 1.6°C):</strong> Risk of plant cellular freeze. <strong>Mandatory 72-hour UniHeat insulated thermal pack required</strong>, or arrange in-person climate-controlled vehicle hand-off.
              </span>
              <span v-else-if="isHeatRisk">
                <strong>Heat Threshold Alert (&gt;90°F / 32°C):</strong> Risk of rapid moisture transpiration and bacterial soft rot. Use Phase22 temperature stabilizer or defer dispatch until cooler evening temperatures.
              </span>
              <span v-else>
                Current temperatures are within safe botanical tolerance (35°F - 90°F). Priority 2-day delivery or local outdoor pickup approved without specialized thermal insulation.
              </span>
            </p>
          </div>
        </div>

        <div class="shrink-0 flex items-center gap-2">
          <button
            type="button"
            @click="showSimControls = !showSimControls"
            class="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-800 hover:bg-slate-50 transition-colors cursor-pointer shadow-2xs"
          >
            {{ showSimControls ? 'Hide Weather Simulator' : 'Test Weather Scenarios' }}
          </button>
        </div>
      </div>

      <!-- Sliders -->
      <div v-if="showSimControls" class="mt-4 pt-4 border-t border-slate-200/60 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div class="bg-white p-3 rounded-lg border border-slate-200 space-y-1 shadow-2xs">
          <div class="flex justify-between font-mono">
            <span>Origin (Portland):</span>
            <span class="font-bold text-slate-900">{{ originTemp }}°F</span>
          </div>
          <input
            type="range"
            min="15"
            max="105"
            v-model.number="originTemp"
            class="w-full accent-[#227C5B]"
          />
        </div>

        <div class="bg-white p-3 rounded-lg border border-slate-200 space-y-1 shadow-2xs">
          <div class="flex justify-between font-mono">
            <span>Destination (Transit):</span>
            <span class="font-bold text-slate-900">{{ destTemp }}°F</span>
          </div>
          <input
            type="range"
            min="15"
            max="105"
            v-model.number="destTemp"
            class="w-full accent-[#227C5B]"
          />
        </div>

        <div class="flex items-center gap-2">
          <button
            type="button"
            @click="originTemp = 28; destTemp = 32"
            class="flex-1 py-2 text-[11px] font-semibold bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors cursor-pointer"
          >
            Test Frost (&lt;35°F)
          </button>
          <button
            type="button"
            @click="originTemp = 94; destTemp = 96"
            class="flex-1 py-2 text-[11px] font-semibold bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors cursor-pointer"
          >
            Test Heat (&gt;90°F)
          </button>
          <button
            type="button"
            @click="originTemp = 58; destTemp = 62"
            class="flex-1 py-2 text-[11px] font-semibold bg-[#227C5B] text-white rounded-lg hover:bg-[#1A6247] transition-colors cursor-pointer"
          >
            Safe (60°F)
          </button>
        </div>
      </div>
    </div>

    <!-- Main Chat Layout -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <!-- Chat History & Input (8 cols) -->
      <div class="lg:col-span-8 bg-white rounded-xl border border-slate-200 flex flex-col h-[520px] shadow-xs overflow-hidden">
        <!-- Messages Area -->
        <div class="flex-1 p-5 overflow-y-auto space-y-4">
          <div
            v-for="msg in negotiation.messages"
            :key="msg.id"
          >
            <div v-if="msg.senderId === 'system'" class="flex justify-center my-2">
              <div class="bg-emerald-50/80 border border-emerald-200/70 text-[#1A6247] text-xs px-4 py-2 rounded-lg max-w-md text-center space-y-1">
                <div class="flex items-center justify-center gap-1.5 font-semibold text-[11px] font-mono text-[#227C5B]">
                  <ShieldCheck class="w-3.5 h-3.5" />
                  <span>{{ msg.senderName }}</span>
                </div>
                <p>{{ msg.text }}</p>
              </div>
            </div>

            <div
              v-else
              :class="['flex flex-col', msg.senderId === 'me' ? 'items-end' : 'items-start']"
            >
              <div class="flex items-center gap-2 mb-1 text-[11px] text-slate-500">
                <span class="font-semibold text-slate-800">{{ msg.senderName }}</span>
                <span aria-hidden="true">·</span>
                <span class="font-mono">{{ msg.timestamp }}</span>
              </div>

              <div :class="[
                'max-w-lg p-3.5 rounded-xl text-xs leading-relaxed',
                msg.senderId === 'me'
                  ? 'bg-[#227C5B] text-white rounded-br-xs shadow-xs'
                  : 'bg-slate-50 text-slate-900 border border-slate-200 rounded-bl-xs'
              ]">
                <p>{{ msg.text }}</p>

                <div 
                  v-if="msg.isProposal && msg.proposalDetails" 
                  :class="[
                    'mt-3 pt-3 border-t space-y-2',
                    msg.senderId === 'me' ? 'border-white/20' : 'border-slate-200'
                  ]"
                >
                  <div class="flex items-center justify-between text-[11px] font-mono">
                    <span>PROPOSAL: +${{ msg.proposalDetails.cashAmount }} CASH ADJUSTMENT</span>
                    <span class="uppercase">{{ msg.proposalDetails.method.replace('_', ' ') }}</span>
                  </div>

                  <div v-if="msg.senderId !== 'me' && negotiation.status !== 'agreed'" class="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      @click="handleAcceptProposal"
                      class="px-3 py-1.5 bg-emerald-100 text-[#1A6247] font-bold rounded text-xs hover:bg-emerald-200 transition-colors cursor-pointer"
                    >
                      Accept Terms &amp; Lock Escrow
                    </button>
                    <span class="text-[10px] text-slate-400">
                      or propose alternative adjustment below
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Chat Input Bar -->
        <form
          @submit.prevent="handleSendMessage"
          class="p-3 bg-slate-50 border-t border-slate-200 flex items-center gap-2"
        >
          <input
            type="text"
            :placeholder="`Message ${negotiation.partnerName} about node maturity, meeting spot, packaging...`"
            v-model="inputText"
            class="flex-1 text-xs px-3.5 py-2.5 rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-[#227C5B]"
          />
          <button
            type="submit"
            class="bg-[#227C5B] hover:bg-[#1A6247] text-white p-2.5 rounded-lg transition-colors cursor-pointer"
          >
            <Send class="w-4 h-4 text-emerald-100" />
          </button>
        </form>
      </div>

      <!-- Right Adjustment & Terms Panel (4 cols) -->
      <div class="lg:col-span-4 space-y-4">
        <div class="bg-white p-5 rounded-xl border border-slate-200 space-y-4 shadow-xs">
          <h4 class="font-display text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
            Coordinate Swap Terms
          </h4>

          <!-- Cash Adjustment Stepper -->
          <div>
            <label class="text-[11px] text-slate-500 font-mono uppercase font-semibold tracking-wider block mb-1.5">
              Cash Adjustment ($ USD)
            </label>
            <div class="flex items-center justify-between p-2 rounded-lg border border-slate-200 bg-slate-50/70">
              <button
                type="button"
                @click="cashAmount = Math.max(0, cashAmount - 10)"
                class="w-8 h-8 rounded border border-slate-200 bg-white flex items-center justify-center text-slate-800 hover:bg-slate-100 font-bold cursor-pointer"
              >
                <Minus class="w-3.5 h-3.5" />
              </button>

              <div class="text-center font-mono">
                <span class="text-slate-400 block text-[10px]">You top up</span>
                <span class="text-lg font-bold text-slate-900">${{ cashAmount }}</span>
              </div>

              <button
                type="button"
                @click="cashAmount = cashAmount + 10"
                class="w-8 h-8 rounded border border-slate-200 bg-white flex items-center justify-center text-slate-800 hover:bg-slate-100 font-bold cursor-pointer"
              >
                <Plus class="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <!-- Logistics Method -->
          <div>
            <label class="text-[11px] text-slate-500 font-mono uppercase font-semibold tracking-wider block mb-1.5">
              Logistics Method
            </label>
            <div class="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                @click="deliveryMode = 'local_meet'"
                :class="[
                  'p-2.5 rounded-lg border text-left transition-all cursor-pointer',
                  deliveryMode === 'local_meet'
                    ? 'border-[#227C5B] bg-emerald-50/70 text-[#1A6247] font-bold shadow-2xs'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                ]"
              >
                <MapPin class="w-3.5 h-3.5 mb-1 text-[#227C5B]" />
                <span>Local Hand-off</span>
                <span class="text-[10px] text-slate-400 block font-normal">Within 8.4 miles</span>
              </button>

              <button
                type="button"
                @click="deliveryMode = 'weather_shipping'"
                :class="[
                  'p-2.5 rounded-lg border text-left transition-all cursor-pointer',
                  deliveryMode === 'weather_shipping'
                    ? 'border-[#227C5B] bg-emerald-50/70 text-[#1A6247] font-bold shadow-2xs'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                ]"
              >
                <Truck class="w-3.5 h-3.5 mb-1 text-[#227C5B]" />
                <span>Insulated Courier</span>
                <span class="text-[10px] text-slate-400 block font-normal">Weather Monitored</span>
              </button>
            </div>
          </div>

          <!-- Counter-proposal button -->
          <button
            type="button"
            @click="handleSendUpdatedProposal"
            class="w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
          >
            Post Counter-Proposal (${{ cashAmount }})
          </button>

          <!-- Final Agreement CTA -->
          <div v-if="negotiation.status === 'agreed'" class="p-3 bg-[#227C5B] text-white rounded-lg text-center space-y-1">
            <div class="flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-100">
              <CheckCircle2 class="w-4 h-4" />
              <span>Trade Agreement Locked</span>
            </div>
            <p class="text-[11px] text-emerald-100/90">
              Digital Passports archived into escrow. Awaiting delivery confirmation.
            </p>
          </div>
          <button
            v-else
            type="button"
            @click="handleAcceptProposal"
            class="w-full py-2.5 bg-[#227C5B] hover:bg-[#1A6247] text-white rounded-lg text-xs font-semibold uppercase tracking-wider transition-all shadow-xs cursor-pointer"
          >
            Accept Terms &amp; Finalize Trade
          </button>
        </div>

        <!-- Guarantee -->
        <div class="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs text-slate-700">
          <div class="flex items-center gap-2 font-semibold text-slate-900">
            <ShieldCheck class="w-4 h-4 text-[#227C5B]" />
            <span>4-Metric Feedback System</span>
          </div>
          <p class="text-[11px] text-slate-500 leading-relaxed">
            Upon physical hand-off or parcel unboxing, both parties rate plant health, packaging quality, species authenticity, and communication.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
