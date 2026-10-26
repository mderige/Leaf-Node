export type DevelopmentalStage = 'unrooted_node' | 'rooted_cutting' | 'established';

export type VariegationStability = 'high_marble' | 'sectoral' | 'stable' | 'sport' | 'standard';

export interface TraderKarma {
  overall: number; // e.g. 4.9
  plantHealth: number; // e.g. 5.0
  packagingQuality: number; // e.g. 4.8
  authenticity: number; // e.g. 5.0
  communication: number; // e.g. 4.9
  totalTrades: number;
  joinedYear: number;
}

export interface DigitalPassport {
  id: string; // e.g. "LN-PASSPORT-8942"
  capturedAt: string;
  watermarkHash: string;
  isLiveCameraVerified: boolean;
  city: string;
  state: string;
  geoCoords: string;
  nodeCountStated: number;
  leafCount: number;
  variegationClass: string;
}

export interface PlantSpecimen {
  id: string;
  commonName: string;
  botanicalName: string;
  cultivar?: string;
  type: 'have' | 'want';
  developmentalStage: DevelopmentalStage;
  nodeCount: number;
  leafCount: number;
  variegationStability: VariegationStability;
  variegationDescription: string;
  estimatedValueUsd: number;
  imageUrl: string;
  notes: string;
  owner: {
    id: string;
    name: string;
    handle: string;
    city: string;
    state: string;
    distanceMiles: number;
    avatarUrl: string;
    karma: TraderKarma;
  };
  passport: DigitalPassport;
  featured?: boolean;
}

export interface TradeMatch {
  id: string;
  userOffered: PlantSpecimen;
  partnerRequested: PlantSpecimen;
  distanceMiles: number;
  matchScore: number; // 0 - 100%
  recommendedCashAdjustment: number; // e.g. +$25 or 0
  adjustmentDirection: 'receive' | 'give' | 'even';
  rationale: string;
}

export interface WeatherTransitReport {
  originCity: string;
  originTempF: number;
  destinationCity: string;
  destinationTempF: number;
  transitRisk: 'safe' | 'freeze_warning' | 'heat_warning';
  warningThresholdText: string;
  recommendedLogistics: string;
  heatPackRequired: boolean;
}

export interface ChatMessage {
  id: string;
  senderId: 'me' | 'partner' | 'system';
  senderName: string;
  timestamp: string;
  text: string;
  isProposal?: boolean;
  proposalDetails?: {
    offeredPlantId: string;
    requestedPlantId: string;
    cashAmount: number;
    cashDirection: 'give' | 'receive' | 'none';
    method: 'local_meet' | 'weather_shipping';
    status: 'pending' | 'accepted' | 'declined';
  };
}

export interface ActiveTradeNegotiation {
  id: string;
  partnerId: string;
  partnerName: string;
  partnerHandle: string;
  partnerCity: string;
  partnerDistanceMiles: number;
  mySpecimen: PlantSpecimen;
  partnerSpecimen: PlantSpecimen;
  cashAdjustment: number;
  cashDirection: 'give' | 'receive' | 'none';
  meetingMode: 'local_meet' | 'weather_shipping';
  weatherReport: WeatherTransitReport;
  messages: ChatMessage[];
  status: 'active' | 'agreed' | 'completed';
}
