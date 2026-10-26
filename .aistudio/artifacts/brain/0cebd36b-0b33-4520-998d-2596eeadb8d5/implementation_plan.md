# Leaf & Node — Botanical Community Trading & Verification Platform

Leaf & Node is a high-trust peer-to-peer botanical exchange and trading platform for rare cultivars, established specimens, and cuttings. It combines live in-app camera verification with unalterable digital plant passports, automated 1:1 local matchmaking across radius zones, and real-time transit weather safety monitoring.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following key decisions were confirmed through Phase 1 user input and will guide the prototype build:

- **Confirmed Aesthetic Direction**: Botanical Editorial — warm parchment canvas (`#FBF9F5` / `#F4F0E8`), deep forest greens (`#193527`, `#234937`), warm antique brass accents (`#B68A35`), and refined serif headlines paired with legible body typography.
- **Confirmed Primary Experience Focus**: Full Interactive Prototype — complete coverage of the Have & Want marketplace, automated 1:1 local trade matchmaker (10, 25, 50-mile radius), live Proof of Life camera verification studio, and trade negotiation chat with weather warnings.
- **Confirmed Verification Engine**: Dual-mode camera system featuring real browser webcam capture with live unalterable watermark overlay (user handle, timestamp, geolocation, node count, developmental stage) plus instant specimen presets for immediate testing without requiring camera permissions.

---

## 1. Overview & Core Concept

- **What It Does**: Leaf & Node provides rare plant enthusiasts with a scam-resistant trade network. Plant parents create dual "Have" (available inventory) and "Want" (wishlist) portfolios with granular trait tagging (variegation stability, node count, root maturity). The automated matchmaker pairs local collectors whose Have/Want inventories complement each other. Traders verify specimens via live camera "Proof of Life" passports and negotiate trades or cash top-ups inside an in-app chat equipped with route temperature safety checks (<35°F or >90°F warnings).
- **Target Audience / Persona**: Rare plant collectors, aroid enthusiasts, urban botanists, and boutique propagators seeking verified Thai Constellations, Philodendron Spiritus Sancti, Monstera Albo, and Anthurium hybrids.
- **Key Value**: Replaces unverified social media trade groups with cryptographically stamped live verification, eliminating bait-and-switch scams and transit shock damage.

---

## 2. User Experience & Visual Design

### Key User Flows

1. **Marketplace & Portfolio Discovery**:
   - Filter listings by Have (Available) vs. Want (Wishlist), developmental stage (Unrooted Node, Rooted Cutting, Established Plant), and Variegation Stability (High Marble, Sectoral, Stable, Sport).
   - Card displays verified Digital Plant Passport preview, distance (e.g. `4.2 mi away`), node count, and trader trust score.
2. **Automated 1:1 Local Matchmaker**:
   - Collectors toggle their trading radius (10 mi, 25 mi, 50 mi).
   - Matchmaker calculates symmetric trades (e.g., "Elena has your wishlist *Monstera Albo* and wants your *Anthurium Warocqueanum*") with a one-click "Initiate Trade" action.
3. **Live "Proof of Life" Camera Verification Studio**:
   - Collector opens the verification modal: activates device webcam (or selects sample rare plant preset).
   - Live canvas stamps: `@collector_handle`, `ISO Timestamp`, `GPS / City (e.g. Portland, OR)`, `Leaf / Node Count`, and `Passport ID`.
   - Generates verified listing with the unalterable watermark and assigns verified badge.
4. **Peer-to-Peer Negotiation & Weather Logistics Chat**:
   - Interactive negotiation panel: swap proposal cards, optional cash adjustment counter (+/- $20), and meeting spot selector.
   - Live Weather Transit Monitor: detects transit route between traders (e.g., Denver to Minneapolis) and triggers alert if temperature falls below 35°F or rises above 90°F, recommending insulated heat packs or delayed transit.
5. **Multi-Metric Karma & Review System**:
   - Displays 4-pillar trust breakdown: Plant Health (4.9/5), Packaging Quality (5.0/5), Species Authenticity (5.0/5), Communication (4.8/5).

### Visual Identity & Theme

- **Aesthetic Direction**: Botanical Editorial — reminiscent of vintage botanical compendiums, Kew Gardens field journals, and high-end artisanal floristry.
- **Color Palette & Surface Tones**:
  - `Canvas / Parchment`: `#FAF8F5` (base background), `#F2ECE1` (surface card containers)
  - `Forest Canopy`: `#183628` (primary brand, deep contrast headers), `#244D3A` (interactive buttons)
  - `Sage / Leaf`: `#5B7B6D` (secondary text, borders, structural lines)
  - `Brass / Amber`: `#B38636` (accent highlights, verified seals, warning badges)
  - `Terracotta / Warning`: `#C25B42` (shipping weather temperature warning, low temp alert)
- **Typography & Scale**:
  - Display / Hero: `Fraunces` / `Playfair Display` serif for botanical gravitas and elegance.
  - Body: `Plus Jakarta Sans` for clean legibility across metadata, node counts, and chat logs.
  - Data / Passports: `JetBrains Mono` / `tabular-nums` for passport hash IDs, timestamps, and temperature ranges.
- **Zero-Pill Discipline**:
  - Trait metadata rendered cleanly with typographic interpuncts: `2 Nodes · High Variegation · Rooted Cutting · 12 mi away`.
  - Tabs and radius switchers styled as understated segmented tactile controls.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Real In-Browser Webcam Capture with Canvas Watermarking**:
  - *Chosen Approach*: Direct `navigator.mediaDevices.getUserMedia` stream into an HTML5 Canvas that stamps the cryptographic metadata, timestamp, geolocation, and user watermark directly into pixel data. Includes sample specimen fallback mode for environments without a webcam.
  - *Why*: Eliminates stock photo scams and gallery uploads per specification while ensuring 100% testability on any browser or sandbox.
  - *Alternatives Considered*: Standard file upload dialog (rejected because specification requires live camera to prevent stock uploads).
- **Decision 2: Interactive 1:1 Matchmaker Simulation Engine**:
  - *Chosen Approach*: Algorithmically links mock user portfolios so changing active profile or radius dynamically recalculates direct mutual matches and generates pre-filled trade proposals.
  - *Why*: Demonstrates the core differentiator of Leaf & Node over generic marketplaces.
- **Decision 3: Integrated Weather Alert Simulation**:
  - *Chosen Approach*: Interactive transit weather inspector that allows testing safe temperatures (e.g., 68°F), freeze risk (<35°F with heat pack recommendations), and heat shock (>90°F with delay alerts).
  - *Why*: Directly satisfies the specification's cold/heat threshold warning requirement without requiring live external billing keys.

---

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Leaf & Node Application                         │
├────────────────────────────────────────────────────────────────────────┤
│ Top Navigation Contract: [Brand Wordmark] - [4 Nav Links] - [New Post] │
├────────────────────────────────────────────────────────────────────────┤
│                       Main Content & View Router                       │
│  ┌──────────────────┬─────────────────┬─────────────────┬───────────┐  │
│  │ Marketplace Feed │ 1:1 Matchmaker  │ Passport Studio │ Live Chat │  │
│  │ (Have vs Want)   │ (10/25/50 mi)   │ (Webcam Canvas) │ & Weather │  │
│  └──────────────────┴─────────────────┴─────────────────┴───────────┘  │
├────────────────────────────────────────────────────────────────────────┤
│                        State & Data Management                         │
│  ┌───────────────────────┬────────────────────────┬─────────────────┐  │
│  │ Plant Portfolio Store │ Mutual Match Engine    │ Negotiation Log │  │
│  │ (Traits, Nodes, Proof)│ (Radius, Spatial Math) │ (Weather Alerts)│  │
│  └───────────────────────┴────────────────────────┴─────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

### Core Data Models

- **PlantSpecimen**: `id`, `commonName`, `botanicalName`, `type` ('have' | 'want'), `developmentalStage` ('unrooted_node' | 'rooted_cutting' | 'established'), `nodeCount`, `variegationStability` ('high_marble' | 'sectoral' | 'stable' | 'sport'), `owner` (`handle`, `city`, `distanceMiles`, `karma`), `passport` (`timestamp`, `hash`, `watermarkUrl`), `estimatedValue`.
- **TradeMatch**: `userA`, `userB`, `offeredSpecimen`, `requestedSpecimen`, `distanceMiles`, `matchScore`, `compatibilityTraits`.
- **TradeNegotiation**: `id`, `matchId`, `status`, `messages`, `cashAdjustment`, `meetingMethod` ('local_dropoff' | 'insured_shipping'), `routeWeather` (`originTemp`, `destTemp`, `alertLevel`, `warningMessage`).
- **TraderKarma**: `overall`, `plantHealth`, `packagingQuality`, `authenticity`, `communication`, `totalTrades`.

### Verification & Testing Plan

1. Verify real camera video stream access and canvas watermark rendering.
2. Test radius filter switching (10, 25, 50 miles) and verify match recalculation.
3. Verify live chat message sending, cash adjustment modification, and weather threshold warnings (<35°F and >90°F).
4. Run `compile_applet` and test responsive layout at desktop (1440px) and tablet/mobile viewports.
