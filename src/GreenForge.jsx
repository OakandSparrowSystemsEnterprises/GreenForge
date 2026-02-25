import { useState } from "react";

// ─────────────────────────────────────────────
// ISSUE / SEVERITY / SOIL DEFINITIONS
// ─────────────────────────────────────────────

const ISSUES = [
  { id: "anxiety",      label: "Anxiety",      emoji: "🔵", bg: "#EEF3FF", border: "#3A5BA0" },
  { id: "pain",         label: "Pain",          emoji: "🔴", bg: "#FFF0F0", border: "#A03A3A" },
  { id: "chronic_pain", label: "Chronic Pain",  emoji: "🩸", bg: "#FFE8E8", border: "#8B2020" },
  { id: "sleep",        label: "Sleep",         emoji: "🟣", bg: "#F0F0FF", border: "#4A3A8B" },
  { id: "focus",        label: "Focus",         emoji: "🟡", bg: "#FFFBE8", border: "#8B7A20" },
  { id: "nausea",       label: "Nausea",        emoji: "🟢", bg: "#F0FFF8", border: "#2A7A50" },
  { id: "appetite",     label: "Appetite",      emoji: "🟠", bg: "#FFF8F0", border: "#8B5A20" },
  { id: "mood",         label: "Mood",          emoji: "🌸", bg: "#FFF0F8", border: "#8B3A6A" },
  { id: "arousal",      label: "Arousal",       emoji: "💜", bg: "#FFF0FB", border: "#7A2080" },
  { id: "creativity",   label: "Creativity",    emoji: "🩵", bg: "#F0FFFF", border: "#206A7A" },
];

const SEVERITIES = [
  { id: "mild",     label: "Mild",     sub: "Light / occasional" },
  { id: "moderate", label: "Moderate", sub: "Regular / notable" },
  { id: "heavy",    label: "Heavy",    sub: "Chronic / intense" },
];

const SOIL_TYPES = [
  { id: "indoor",              label: "Indoor",             sub: "Controlled, consistent" },
  { id: "outdoor_living_soil", label: "Living Soil",        sub: "Sun-grown, complex terps" },
  { id: "greenhouse",          label: "Greenhouse",         sub: "Sun + environment" },
  { id: "any",                 label: "Any / Don't Know",   sub: "Score all equally" },
];

// ─────────────────────────────────────────────
// GOLD STANDARD PROFILES — 10 ISSUES
// primaryThreshold / secondaryThreshold: { flower, concentrate }
// cbdRole: "essential" | "helpful" | "optional" | "avoid"
// minorBonus: "cbn" | "thcv" | null
// negativeTerpene: penalized only when dominant
// ─────────────────────────────────────────────

const GOLD = {
  anxiety: {
    primary: "linalool",
    primaryThreshold: { flower: 0.20, concentrate: 1.5 },
    secondary: "caryophyllene",
    secondaryThreshold: { flower: 0.35, concentrate: 2.5 },
    bonus: ["bisabolol", "nerolidol"],
    bonusThreshold: { flower: 0.05, concentrate: 0.3 },
    negative: "limonene",
    thcWindow: { mild: [15, 18], moderate: [18, 22], heavy: [20, 22] },
    thcCeiling: 22,
    cbdRole: "helpful",
    minorBonus: null,
  },
  pain: {
    primary: "caryophyllene",
    primaryThreshold: { flower: 0.35, concentrate: 2.5 },
    secondary: "myrcene",
    secondaryThreshold: { flower: 0.40, concentrate: 3.0 },
    bonus: ["pinene"],
    bonusThreshold: { flower: 0.15, concentrate: 1.0 },
    negative: null,
    thcWindow: { mild: [18, 22], moderate: [22, 26], heavy: [24, 28] },
    thcCeiling: 30,
    cbdRole: "optional",
    minorBonus: null,
  },
  chronic_pain: {
    primary: "caryophyllene",
    primaryThreshold: { flower: 0.35, concentrate: 2.5 },
    secondary: "myrcene",
    secondaryThreshold: { flower: 0.40, concentrate: 3.0 },
    bonus: ["bisabolol", "linalool", "nerolidol"],
    bonusThreshold: { flower: 0.05, concentrate: 0.3 },
    negative: null,
    thcWindow: { mild: [15, 20], moderate: [18, 24], heavy: [20, 26] },
    thcCeiling: 26,
    cbdRole: "essential",
    minorBonus: null,
  },
  sleep: {
    primary: "myrcene",
    primaryThreshold: { flower: 0.40, concentrate: 3.0 },
    secondary: "linalool",
    secondaryThreshold: { flower: 0.20, concentrate: 1.5 },
    bonus: ["nerolidol", "terpineol"],
    bonusThreshold: { flower: 0.05, concentrate: 0.3 },
    negative: "terpinolene",
    thcWindow: { mild: [15, 20], moderate: [18, 24], heavy: [20, 24] },
    thcCeiling: 26,
    cbdRole: "optional",
    minorBonus: "cbn",
  },
  focus: {
    primary: "pinene",
    primaryThreshold: { flower: 0.15, concentrate: 1.0 },
    secondary: "terpinolene",
    secondaryThreshold: { flower: 0.20, concentrate: 1.5 },
    bonus: ["ocimene"],
    bonusThreshold: { flower: 0.10, concentrate: 0.8 },
    negative: "myrcene",
    thcWindow: { mild: [12, 16], moderate: [14, 18], heavy: [16, 20] },
    thcCeiling: 20,
    cbdRole: "avoid",
    minorBonus: "thcv",
  },
  nausea: {
    primary: "myrcene",
    primaryThreshold: { flower: 0.30, concentrate: 2.0 },
    secondary: "linalool",
    secondaryThreshold: { flower: 0.15, concentrate: 1.0 },
    bonus: ["ocimene"],
    bonusThreshold: { flower: 0.10, concentrate: 0.8 },
    negative: null,
    thcWindow: { mild: [12, 16], moderate: [16, 20], heavy: [18, 22] },
    thcCeiling: 24,
    cbdRole: "helpful",
    minorBonus: null,
  },
  appetite: {
    primary: "myrcene",
    primaryThreshold: { flower: 0.40, concentrate: 3.0 },
    secondary: "limonene",
    secondaryThreshold: { flower: 0.25, concentrate: 2.0 },
    bonus: ["caryophyllene"],
    bonusThreshold: { flower: 0.25, concentrate: 2.0 },
    negative: null,
    thcWindow: { mild: [18, 22], moderate: [22, 26], heavy: [24, 28] },
    thcCeiling: 30,
    cbdRole: "optional",
    minorBonus: null,
  },
  mood: {
    primary: "limonene",
    primaryThreshold: { flower: 0.25, concentrate: 2.0 },
    secondary: "terpinolene",
    secondaryThreshold: { flower: 0.20, concentrate: 1.5 },
    bonus: ["ocimene", "valencene"],
    bonusThreshold: { flower: 0.10, concentrate: 0.8 },
    negative: "linalool",
    thcWindow: { mild: [18, 20], moderate: [20, 24], heavy: [22, 26] },
    thcCeiling: 28,
    cbdRole: "optional",
    minorBonus: null,
  },
  arousal: {
    primary: "limonene",
    primaryThreshold: { flower: 0.25, concentrate: 2.0 },
    secondary: "terpinolene",
    secondaryThreshold: { flower: 0.20, concentrate: 1.5 },
    bonus: ["farnesene", "geraniol"],
    bonusThreshold: { flower: 0.05, concentrate: 0.3 },
    negative: "myrcene",
    thcWindow: { mild: [14, 17], moderate: [16, 20], heavy: [18, 22] },
    thcCeiling: 22,
    cbdRole: "optional",
    minorBonus: null,
  },
  creativity: {
    primary: "terpinolene",
    primaryThreshold: { flower: 0.20, concentrate: 1.5 },
    secondary: "pinene",
    secondaryThreshold: { flower: 0.15, concentrate: 1.0 },
    bonus: ["ocimene", "farnesene"],
    bonusThreshold: { flower: 0.05, concentrate: 0.3 },
    negative: "myrcene",
    thcWindow: { mild: [16, 18], moderate: [18, 22], heavy: [20, 24] },
    thcCeiling: 24,
    cbdRole: "avoid",
    minorBonus: "thcv",
  },
};

const PRODUCT_TYPES = [
  {
    id: "flower",
    label: "Flower",
    emoji: "🌿",
    sub: "Whole flower — indoor, greenhouse, outdoor",
    formats: ["flower"],
  },
  {
    id: "rosin_resin",
    label: "Rosin / Live Resin",
    emoji: "🔥",
    sub: "Solventless rosin, live resin carts, disposables",
    formats: ["solventless", "live_resin"],
  },
  {
    id: "edible",
    label: "Edible",
    emoji: "🍬",
    sub: "Gummies, chocolates, beverages, pre-rolls",
    formats: ["edible", "preroll"],
  },
  {
    id: "medical",
    label: "Tincture / Topical",
    emoji: "💊",
    sub: "RSO, CO₂ extract, sublingual, topical balm",
    formats: ["rso", "co2_extract", "topical"],
  },
];

// ─────────────────────────────────────────────
// PRODUCT DATABASE — 15 products from brand audit
// thcEquiv: normalized effective THC (0-35 scale)
//   flower: label % (THCa used as-is for simplicity)
//   concentrate: dose-equivalent (typical session ~ strong flower)
//   edible: mg → equiv score
// terpenes: flower in %, concentrates in % (higher range)
// ─────────────────────────────────────────────


  {
    id: 2,
    name: "Indica Rosin (OG lineage)",
    brand: "710 Labs",
    tier: 4,
    format: "solventless",
    soilType: "indoor",
    thcEquiv: 21,
    cbd: 0.8,
    cbn: 0.3,
    thcv: 0,
    terpenes: {
      myrcene: 5.2, caryophyllene: 3.1, linalool: 2.8,
      limonene: 0.9, pinene: 0.6, terpinolene: 0.2,
      ocimene: 0.1, nerolidol: 0.65, farnesene: 0,
      bisabolol: 0.42, terpineol: 0.5, humulene: 1.1,
      valencene: 0, geraniol: 0,
    },
  },
  {
    id: 3,
    name: "1:1 RSO Tincture",
    brand: "Papa & Barkley",
    tier: 2,
    format: "rso",
    soilType: "greenhouse",
    thcEquiv: 12,
    cbd: 12,
    cbn: 0.8,
    thcv: 0,
    terpenes: {
      myrcene: 2.1, caryophyllene: 1.9, linalool: 1.2,
      limonene: 0.8, pinene: 0.6, terpinolene: 0.1,
      ocimene: 0.15, nerolidol: 0.38, farnesene: 0,
      bisabolol: 0.41, terpineol: 0.3, humulene: 0.5,
      valencene: 0, geraniol: 0,
    },
  },
  {
    id: 4,
    name: "OG Gas Live Resin Cart",
    brand: "Raw Garden",
    tier: 3,
    format: "live_resin",
    soilType: "greenhouse",
    thcEquiv: 20,
    cbd: 0.5,
    cbn: 0.1,
    thcv: 0,
    terpenes: {
      myrcene: 4.2, caryophyllene: 3.8, linalool: 0.8,
      limonene: 1.2, pinene: 0.6, terpinolene: 0.3,
      ocimene: 0.2, nerolidol: 0, farnesene: 0,
      bisabolol: 0.1, terpineol: 0.2, humulene: 0.9,
      valencene: 0, geraniol: 0,
    },
  },
  {
    id: 5,
    name: "Durban Poison",
    brand: "UpNorth Humboldt",
    tier: 5,
    format: "flower",
    soilType: "outdoor_living_soil",
    thcEquiv: 18,
    cbd: 0.1,
    cbn: 0,
    thcv: 0.4,
    terpenes: {
      myrcene: 0.12, caryophyllene: 0.14, linalool: 0.06,
      limonene: 0.18, pinene: 0.38, terpinolene: 0.62,
      ocimene: 0.22, nerolidol: 0, farnesene: 0.06,
      bisabolol: 0, terpineol: 0.04, humulene: 0.05,
      valencene: 0, geraniol: 0,
    },
  },
  {
    id: 6,
    name: "Area 41",
    brand: "Alien Labs",
    tier: 5,
    format: "flower",
    soilType: "indoor",
    thcEquiv: 28,
    cbd: 0.05,
    cbn: 0,
    thcv: 0,
    terpenes: {
      myrcene: 0.28, caryophyllene: 0.38, linalool: 0.12,
      limonene: 0.52, pinene: 0.1, terpinolene: 0.28,
      ocimene: 0.18, nerolidol: 0, farnesene: 0,
      bisabolol: 0.04, terpineol: 0.05, humulene: 0.08,
      valencene: 0.06, geraniol: 0,
    },
  },
  {
    id: 7,
    name: "Midnight Blueberry (CBN)",
    brand: "Kiva",
    tier: 1,
    format: "edible",
    soilType: "any",
    thcEquiv: 10,
    cbd: 0,
    cbn: 0.5,
    thcv: 0,
    terpenes: {
      myrcene: 0.8, caryophyllene: 0.2, linalool: 0.6,
      limonene: 0.1, pinene: 0, terpinolene: 0,
      ocimene: 0, nerolidol: 0, farnesene: 0,
      bisabolol: 0, terpineol: 0, humulene: 0,
      valencene: 0, geraniol: 0,
    },
  },
  {
    id: 8,
    name: "Haze Live Resin Cart",
    brand: "Friendly Farms",
    tier: 3,
    format: "live_resin",
    soilType: "indoor",
    thcEquiv: 19,
    cbd: 0.4,
    cbn: 0,
    thcv: 0,
    terpenes: {
      myrcene: 0.8, caryophyllene: 0.5, linalool: 0.3,
      limonene: 2.1, pinene: 1.1, terpinolene: 3.2,
      ocimene: 1.8, nerolidol: 0, farnesene: 0,
      bisabolol: 0, terpineol: 0, humulene: 0.2,
      valencene: 0, geraniol: 0,
    },
  },
  {
    id: 9,
    name: "Granddaddy Purple",
    brand: "Glass House Brands",
    tier: 5,
    format: "flower",
    soilType: "greenhouse",
    thcEquiv: 22,
    cbd: 0.06,
    cbn: 0.1,
    thcv: 0,
    terpenes: {
      myrcene: 0.72, caryophyllene: 0.28, linalool: 0.35,
      limonene: 0.10, pinene: 0.06, terpinolene: 0.03,
      ocimene: 0.02, nerolidol: 0.08, farnesene: 0,
      bisabolol: 0.04, terpineol: 0.15, humulene: 0.12,
      valencene: 0, geraniol: 0,
    },
  },
  {
    id: 10,
    name: "Indica Live Rosin Cart",
    brand: "Almora Farm",
    tier: 4,
    format: "solventless",
    soilType: "outdoor_living_soil",
    thcEquiv: 20,
    cbd: 0.6,
    cbn: 0.2,
    thcv: 0,
    terpenes: {
      myrcene: 4.8, caryophyllene: 2.6, linalool: 2.2,
      limonene: 0.6, pinene: 0.4, terpinolene: 0.1,
      ocimene: 0.15, nerolidol: 0.2, farnesene: 0,
      bisabolol: 0.5, terpineol: 0.8, humulene: 0.6,
      valencene: 0, geraniol: 0,
    },
  },
  {
    id: 11,
    name: "THCV Tablet",
    brand: "Level Blends",
    tier: 2,
    format: "co2_extract",
    soilType: "any",
    thcEquiv: 8,
    cbd: 0,
    cbn: 0,
    thcv: 0.6,
    terpenes: {
      myrcene: 0.1, caryophyllene: 0.1, linalool: 0,
      limonene: 0.1, pinene: 0, terpinolene: 0,
      ocimene: 0, nerolidol: 0, farnesene: 0,
      bisabolol: 0, terpineol: 0, humulene: 0,
      valencene: 0, geraniol: 0,
    },
  },
  {
    id: 12,
    name: "2:1 CBD Cart",
    brand: "Care By Design",
    tier: 2,
    format: "co2_extract",
    soilType: "any",
    thcEquiv: 10,
    cbd: 20,
    cbn: 0,
    thcv: 0,
    terpenes: {
      myrcene: 0.8, caryophyllene: 1.2, linalool: 0.6,
      limonene: 0.4, pinene: 0.2, terpinolene: 0,
      ocimene: 0, nerolidol: 0, farnesene: 0,
      bisabolol: 0, terpineol: 0, humulene: 0.3,
      valencene: 0, geraniol: 0,
    },
  },
  {
    id: 13,
    name: "Infused Pre-roll",
    brand: "Jeeter",
    tier: 1,
    format: "preroll",
    soilType: "any",
    thcEquiv: 28,
    cbd: 0,
    cbn: 0,
    thcv: 0,
    terpenes: {
      myrcene: 0.6, caryophyllene: 0.4, linalool: 0,
      limonene: 0.2, pinene: 0, terpinolene: 0,
      ocimene: 0, nerolidol: 0, farnesene: 0,
      bisabolol: 0, terpineol: 0, humulene: 0,
      valencene: 0, geraniol: 0,
    },
  },
  {
    id: 14,
    name: "Durban Poison Cart",
    brand: "Raw Garden",
    tier: 3,
    format: "live_resin",
    soilType: "greenhouse",
    thcEquiv: 18,
    cbd: 0.2,
    cbn: 0,
    thcv: 0.3,
    terpenes: {
      myrcene: 0.6, caryophyllene: 0.5, linalool: 0.2,
      limonene: 0.9, pinene: 1.8, terpinolene: 4.1,
      ocimene: 1.4, nerolidol: 0, farnesene: 0,
      bisabolol: 0, terpineol: 0, humulene: 0.1,
      valencene: 0, geraniol: 0,
    },
  },
  {
    id: 15,
    name: "Haze Flower",
    brand: "Wonderbrett",
    tier: 5,
    format: "flower",
    soilType: "indoor",
    thcEquiv: 22,
    cbd: 0.05,
    cbn: 0,
    thcv: 0,
    terpenes: {
      myrcene: 0.14, caryophyllene: 0.18, linalool: 0.08,
      limonene: 0.44, pinene: 0.22, terpinolene: 0.58,
      ocimene: 0.28, nerolidol: 0, farnesene: 0.09,
      bisabolol: 0, terpineol: 0, humulene: 0.05,
      valencene: 0, geraniol: 0.04,
    },
  },
];

// ─────────────────────────────────────────────
// SCORING ENGINE
// ─────────────────────────────────────────────

const TIER_MULTIPLIER = { 1: 0.55, 2: 0.72, 3: 0.88, 4: 0.97, 5: 1.0 };
// RSO (Papa & Barkley format) gets elevated confidence
function getTierMultiplier(product) {
  if (product.format === 'rso') return 0.85;
  if (product.format === 'topical') return 0.82;
  // Edibles and prerolls: terpenes are in a food matrix — more reliable than distillate vapes
  if (product.format === 'edible' || product.format === 'preroll') return 0.65;
  return TIER_MULTIPLIER[product.tier] || 0.55;
}

// Edibles, tinctures, and CO2 extracts carry terpenes at flower-range concentrations.
// Using concentrate thresholds against them produces wrong results.
const FLOWER_THRESHOLD_FORMATS = new Set([
  'flower', 'edible', 'preroll', 'co2_extract', 'rso', 'topical'
]);

function isFlower(format) {
  return FLOWER_THRESHOLD_FORMATS.has(format);
}

function dominantTerpene(terpenes) {
  return Object.entries(terpenes).reduce(
    (best, [k, v]) => (v > best.val ? { key: k, val: v } : best),
    { key: null, val: -1 }
  ).key;
}

function scoreProduct(product, issue, severity, selectedSoil) {
  const profile = GOLD[issue];
  const flower = isFlower(product.format);
  const t = product.terpenes;

  // ── TERPENE SCORE (0–100, floor 0) ──
  let terpScore = 0;
  let bonusTerpFound = null;
  let primaryDriven = false;

  // Primary terpene
  const pThresh = flower
    ? profile.primaryThreshold.flower
    : profile.primaryThreshold.concentrate;
  const pVal = t[profile.primary] || 0;

  if (pVal >= pThresh) {
    terpScore += 40;
    primaryDriven = true;
    if (dominantTerpene(t) === profile.primary) {
      terpScore += 10; // dominance bonus
    }
  } else if (pVal > 0) {
    terpScore += 20; // present but below threshold
  }

  // Secondary terpene
  const sThresh = flower
    ? profile.secondaryThreshold.flower
    : profile.secondaryThreshold.concentrate;
  const sVal = t[profile.secondary] || 0;
  if (sVal >= sThresh) {
    terpScore += 25;
  } else if (sVal > 0) {
    terpScore += 10;
  }

  // Bonus terpenes
  const bThresh = flower
    ? profile.bonusThreshold.flower
    : profile.bonusThreshold.concentrate;
  for (const b of profile.bonus) {
    if ((t[b] || 0) >= bThresh) {
      terpScore += 8;
      if (!bonusTerpFound) bonusTerpFound = b;
    }
  }

  terpScore = Math.min(terpScore, 100);

  // Negative terpene penalty (only if dominant)
  if (profile.negative) {
    const negVal = t[profile.negative] || 0;
    if (dominantTerpene(t) === profile.negative && negVal > 0) {
      terpScore -= 15;
    }
  }

  // Distillate terpene source penalty (added/synthetic)
  if (product.tier === 1) {
    terpScore -= 10;
  }

  terpScore = Math.max(0, terpScore);

  // ── CANNABINOID SCORE (0–80) ──
  let cannScore = 0;
  let cbdDriven = false;
  let minorDriven = null;

  const window = profile.thcWindow[severity];
  const thc = product.thcEquiv;

  if (thc >= window[0] && thc <= window[1]) {
    cannScore += 50;
  } else if (thc < window[0]) {
    const deficit = window[0] - thc;
    cannScore += Math.max(0, 50 - deficit * 2);
  } else {
    const excess = thc - profile.thcCeiling;
    cannScore += Math.max(0, 50 - excess * 5);
  }

  // CBD scoring
  if (profile.cbdRole === "essential") {
    if (product.cbd >= 0.5) {
      cannScore += 20;
      cbdDriven = true;
    }
    // 1:1 ratio bonus (roughly equal THC and CBD)
    if (product.cbd >= product.thcEquiv * 0.7) {
      cannScore += 10;
      cbdDriven = true;
    }
  } else if (profile.cbdRole === "helpful") {
    if (product.cbd >= 0.5) cannScore += 10;
  }
  // "optional" = no points, no penalty
  // "avoid" = no points, no penalty (CBD doesn't hurt)

  cannScore = Math.min(cannScore, 80);

  // Minor cannabinoid bonuses
  if (profile.minorBonus === "cbn" && product.cbn >= 0.1) {
    cannScore = Math.min(80, cannScore + 10);
    minorDriven = "cbn";
  }
  if (profile.minorBonus === "thcv" && product.thcv >= 0.15) {
    cannScore = Math.min(80, cannScore + 10);
    minorDriven = "thcv";
  }

  // Appetite: penalize THCV (appetite suppressant)
  if (issue === "appetite" && product.thcv >= 0.2) {
    cannScore = Math.max(0, cannScore - 12);
  }

  // ── WEIGHTED SUBTOTAL ──
  const subtotal = terpScore * 0.40 + cannScore * 0.30;

  // ── TIER MULTIPLIER ──
  const multiplied = subtotal * getTierMultiplier(product);

  // ── SEVERITY / FORMAT / SOIL MODIFIER ──
  let modifier = 0;

  if (severity === "mild") modifier += 5;
  if (severity === "heavy" && product.tier >= 4) modifier += 8;

  // Format bonuses/penalties
  if (issue === "nausea") {
    if (product.format === "edible") modifier -= 30;
    if (product.format === "live_resin" || product.format === "solventless" ||
        product.format === "rso" || product.format === "co2_extract") modifier += 10;
  }
  if ((issue === "chronic_pain" || issue === "arousal") && product.format === "topical") {
    modifier += 10;
  }

  // Soil type bonus
  if (selectedSoil !== "any") {
    if (
      (issue === "focus" || issue === "creativity") &&
      product.soilType === "outdoor_living_soil" &&
      selectedSoil === "outdoor_living_soil"
    ) {
      modifier += 12;
    }
    if (
      ["sleep", "pain", "anxiety", "chronic_pain"].includes(issue) &&
      product.soilType === "indoor" &&
      selectedSoil === "indoor"
    ) {
      modifier += 5;
    }
  }

  const finalScore = Math.max(0, Math.min(100, multiplied + modifier));

  return {
    product,
    score: Math.round(finalScore),
    primaryDriven,
    cbdDriven,
    minorDriven,
    bonusTerpFound,
    soilBonus:
      selectedSoil !== "any" && product.soilType === selectedSoil,
  };
};

function getResults(issue, severity, soilType, productType) {
  const allowed = PRODUCT_TYPES.find((p) => p.id === productType)?.formats || [];
  const filtered = PRODUCTS.filter((p) => allowed.includes(p.format));

  const scored = filtered
    .map((p) => scoreProduct(p, issue, severity, soilType))
    .sort((a, b) => b.score - a.score);

  // Return top products above threshold (35+), max 3
  return scored.filter((r) => r.score >= 18).slice(0, 3);
}

function generateOneLiner(result, issue) {
  const { product, cbdDriven, minorDriven, bonusTerpFound, soilBonus, primaryDriven } = result;
  const profile = GOLD[issue];
  const issueLabel = ISSUES.find((i) => i.id === issue)?.label || issue;

  if (cbdDriven && product.format === "rso") {
    return `1:1 whole-plant extract — CBD + caryophyllene together. Best long-term ${issueLabel.toLowerCase()} protocol on shelf.`;
  }
  if (cbdDriven) {
    return `CBD ratio moderates the THC effect — reduces tolerance buildup over time. Right call for chronic use.`;
  }
  if (minorDriven === "cbn") {
    return `CBN extends sleep duration, not just onset. Most sleep products just knock you out — this one keeps you under.`;
  }
  if (minorDriven === "thcv") {
    return `THCV adds a clear-headed lift that regular THC doesn't. Best ${issueLabel.toLowerCase()} signal on the shelf right now.`;
  }
  if (soilBonus && product.soilType === "outdoor_living_soil" && (issue === "focus" || issue === "creativity")) {
    return `Living soil — UV stress elevated the terpinolene beyond what you'd get from the same genetics grown indoor.`;
  }
  if (bonusTerpFound) {
    return `${profile.primary}-forward with ${bonusTerpFound} — rare combination. Full-spectrum ${issueLabel.toLowerCase()} profile.`;
  }
  if (primaryDriven && product.tier >= 4) {
    return `${profile.primary.charAt(0).toUpperCase() + profile.primary.slice(1)}-dominant, full-spectrum expression. Right terpene profile, no shortcuts.`;
  }
  if (primaryDriven) {
    return `Real ${profile.primary} expression from flash-frozen plant material. Solid ${issueLabel.toLowerCase()} match at accessible price.`;
  }
  return `Best available ${issueLabel.toLowerCase()} match on today's menu.`;
}

// ─────────────────────────────────────────────
// TIER LABELS AND COLORS
// ─────────────────────────────────────────────

const TIER_LABEL = {
  1: "Distillate",
  2: "CO₂ / RSO",
  3: "Live Resin",
  4: "Solventless",
  5: "Whole Flower",
};

const FORMAT_LABEL = {
  flower: "Flower",
  live_resin: "Live Resin Cart",
  solventless: "Live Rosin",
  rso: "RSO Tincture",
  co2_extract: "CO₂ Extract",
  edible: "Edible",
  preroll: "Pre-Roll",
  topical: "Topical",
};

const TIER_COLOR = {
  1: "#FFF0F0",
  2: "#FFF8EC",
  3: "#EEF3FF",
  4: "#EDFFF4",
  5: "#FFFFF0",
};

const TIER_BORDER = {
  1: "#C06060",
  2: "#C08020",
  3: "#4060C0",
  4: "#208040",
  5: "#806020",
};

// ─────────────────────────────────────────────
// UI COMPONENTS
// ─────────────────────────────────────────────

function ScoreBar({ score }) {
  const color =
    score >= 60 ? "#2D8C50" : score >= 45 ? "#B8860B" : "#B04040";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
      <div
        style={{
          flex: 1,
          height: 8,
          background: "#E0E0E0",
          borderRadius: 4,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${Math.min(100, (score / 85) * 100)}%`,
            height: "100%",
            background: color,
            borderRadius: 4,
            transition: "width 0.5s ease",
          }}
        />
      </div>
      <span style={{ fontSize: 13, fontWeight: 700, color, minWidth: 28, textAlign: "right" }}>
        {score}
      </span>
    </div>
  );
}

function TierBadge({ tier, format }) {
  return (
    <span
      style={{
        fontSize: 11,
        fontWeight: 600,
        padding: "2px 8px",
        borderRadius: 12,
        background: TIER_COLOR[tier],
        border: `1px solid ${TIER_BORDER[tier]}`,
        color: TIER_BORDER[tier],
        whiteSpace: "nowrap",
      }}
    >
      {FORMAT_LABEL[format] || TIER_LABEL[tier]}
    </span>
  );
}

function ResultCard({ result, rank, issue }) {
  const { product, score } = result;
  const oneLiner = generateOneLiner(result, issue);
  const rankColors = ["#2D5A3D", "#4A7C59", "#6A9A78"];

  return (
    <div
      style={{
        background: "#FAFAFA",
        border: `1px solid #D0D0D0`,
        borderLeft: `4px solid ${rankColors[rank]}`,
        borderRadius: 10,
        padding: "14px 16px",
        marginBottom: 12,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 6 }}>
        <div>
          <div style={{ fontSize: 17, fontWeight: 700, color: "#111" }}>
            {rank === 0 && <span style={{ color: rankColors[0], marginRight: 6 }}>★</span>}
            {product.name}
          </div>
          <div style={{ fontSize: 13, color: "#666", marginTop: 2 }}>{product.brand}</div>
        </div>
        <TierBadge tier={product.tier} format={product.format} />
      </div>
      <ScoreBar score={score} />
      <div
        style={{
          marginTop: 10,
          fontSize: 14,
          color: "#333",
          lineHeight: 1.5,
          fontStyle: "italic",
          background: "#F0F5F0",
          borderRadius: 6,
          padding: "8px 10px",
        }}
      >
        {oneLiner}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// SCREENS
// ─────────────────────────────────────────────

function IssueScreen({ onSelect }) {
  return (
    <div>
      <div style={{ fontSize: 22, fontWeight: 700, color: "#2D5A3D", marginBottom: 6 }}>
        What are they going for?
      </div>
      <div style={{ fontSize: 14, color: "#666", marginBottom: 20 }}>
        Select the primary issue
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 10,
        }}
      >
        {ISSUES.map((issue) => (
          <button
            key={issue.id}
            onClick={() => onSelect(issue.id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "14px 16px",
              background: issue.bg,
              border: `2px solid ${issue.border}`,
              borderRadius: 10,
              cursor: "pointer",
              fontSize: 16,
              fontWeight: 600,
              color: "#111",
              textAlign: "left",
              transition: "transform 0.1s",
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.97)")}
            onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <span style={{ fontSize: 22 }}>{issue.emoji}</span>
            {issue.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function SeverityScreen({ issue, onSelect, onBack }) {
  const issueObj = ISSUES.find((i) => i.id === issue);
  return (
    <div>
      <button
        onClick={onBack}
        style={{
          background: "none",
          border: "none",
          color: "#4A7C59",
          fontSize: 14,
          cursor: "pointer",
          marginBottom: 16,
          padding: 0,
          display: "flex",
          alignItems: "center",
          gap: 4,
        }}
      >
        ← Back
      </button>
      <div style={{ fontSize: 13, color: "#666", marginBottom: 4 }}>
        {issueObj?.emoji} {issueObj?.label}
      </div>
      <div style={{ fontSize: 22, fontWeight: 700, color: "#2D5A3D", marginBottom: 6 }}>
        How severe?
      </div>
      <div style={{ fontSize: 14, color: "#666", marginBottom: 20 }}>
        Sets the THC window and scoring threshold
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {SEVERITIES.map((sev) => (
          <button
            key={sev.id}
            onClick={() => onSelect(sev.id)}
            style={{
              padding: "18px 20px",
              background: "#F8F8F8",
              border: "2px solid #D0D0D0",
              borderRadius: 10,
              cursor: "pointer",
              textAlign: "left",
              transition: "border-color 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#4A7C59")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#D0D0D0")}
          >
            <div style={{ fontSize: 17, fontWeight: 700, color: "#111" }}>
              {sev.label}
            </div>
            <div style={{ fontSize: 13, color: "#666", marginTop: 2 }}>
              {sev.sub}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function SoilScreen({ issue, severity, onSelect, onBack }) {
  const issueObj = ISSUES.find((i) => i.id === issue);
  return (
    <div>
      <button
        onClick={onBack}
        style={{
          background: "none",
          border: "none",
          color: "#4A7C59",
          fontSize: 14,
          cursor: "pointer",
          marginBottom: 16,
          padding: 0,
          display: "flex",
          alignItems: "center",
          gap: 4,
        }}
      >
        ← Back
      </button>
      <div style={{ fontSize: 13, color: "#666", marginBottom: 4 }}>
        {issueObj?.emoji} {issueObj?.label} · {severity}
      </div>
      <div style={{ fontSize: 22, fontWeight: 700, color: "#2D5A3D", marginBottom: 6 }}>
        Grow type?
      </div>
      <div style={{ fontSize: 14, color: "#666", marginBottom: 20 }}>
        Soil type changes the terpene expression — especially for focus and creativity
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {SOIL_TYPES.map((soil) => (
          <button
            key={soil.id}
            onClick={() => onSelect(soil.id)}
            style={{
              padding: "16px 20px",
              background: "#F8F8F8",
              border: "2px solid #D0D0D0",
              borderRadius: 10,
              cursor: "pointer",
              textAlign: "left",
              transition: "border-color 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#4A7C59")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#D0D0D0")}
          >
            <div style={{ fontSize: 16, fontWeight: 600, color: "#111" }}>
              {soil.label}
            </div>
            <div style={{ fontSize: 13, color: "#666", marginTop: 2 }}>
              {soil.sub}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function ProductTypeScreen({ issue, severity, soilType, onSelect, onBack }) {
  const issueObj = ISSUES.find((i) => i.id === issue);
  const soilObj = SOIL_TYPES.find((s) => s.id === soilType);
  return (
    <div>
      <button
        onClick={onBack}
        style={{
          background: "none", border: "none", color: "#4A7C59",
          fontSize: 14, cursor: "pointer", marginBottom: 16,
          padding: 0, display: "flex", alignItems: "center", gap: 4,
        }}
      >
        ← Back
      </button>
      <div style={{ fontSize: 13, color: "#666", marginBottom: 4 }}>
        {issueObj?.emoji} {issueObj?.label} · {severity} · {soilObj?.label}
      </div>
      <div style={{ fontSize: 22, fontWeight: 700, color: "#2D5A3D", marginBottom: 6 }}>
        What kind of product?
      </div>
      <div style={{ fontSize: 14, color: "#666", marginBottom: 20 }}>
        Filters results to what the customer actually wants
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {PRODUCT_TYPES.map((pt) => (
          <button
            key={pt.id}
            onClick={() => onSelect(pt.id)}
            style={{
              display: "flex", alignItems: "center", gap: 14,
              padding: "16px 18px",
              background: "#F8F8F8",
              border: "2px solid #D0D0D0",
              borderRadius: 10, cursor: "pointer", textAlign: "left",
              transition: "border-color 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#4A7C59")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#D0D0D0")}
          >
            <span style={{ fontSize: 26 }}>{pt.emoji}</span>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#111" }}>{pt.label}</div>
              <div style={{ fontSize: 13, color: "#666", marginTop: 2 }}>{pt.sub}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}


// When a format genuinely can't serve an issue well, tell the budtender why
// and point them to the right format instead — rather than returning a bad result.
const FORMAT_ISSUE_REDIRECT = {
  edible: {
    focus:      'Edibles don't carry the terpinolene or pinene that drive focus. Live resin or flower is the right call here.',
    creativity: 'No edible on the CA shelf delivers meaningful terpinolene. Recommend a sativa live resin or Durban Poison flower instead.',
    arousal:    'The terpene profile for arousal (terpinolene, farnesene) doesn't survive edible processing. Try a sativa flower or live resin cart.',
  },
  preroll: {
    focus:      'An infused pre-roll won't carry the focus profile. Try whole flower — Durban Poison or Jack Herer.',
    creativity: 'Pre-rolls don't hit the terpinolene concentration needed for creativity. Recommend living soil sativa flower.',
  },
};

function getRedirectMessage(productType, issue) {
  return FORMAT_ISSUE_REDIRECT[productType]?.[issue] || null;
}

function ResultsScreen({ issue, severity, soilType, productType, onBack, onReset }) {
  const issueObj = ISSUES.find((i) => i.id === issue);
  const soilObj = SOIL_TYPES.find((s) => s.id === soilType);
  const productTypeObj = PRODUCT_TYPES.find((p) => p.id === productType);
  const results = getResults(issue, severity, soilType, productType);

  return (
    <div>
      <button
        onClick={onBack}
        style={{
          background: "none",
          border: "none",
          color: "#4A7C59",
          fontSize: 14,
          cursor: "pointer",
          marginBottom: 16,
          padding: 0,
          display: "flex",
          alignItems: "center",
          gap: 4,
        }}
      >
        ← Back
      </button>

      <div
        style={{
          background: issueObj?.bg || "#F0F0F0",
          border: `1px solid ${issueObj?.border || "#CCC"}`,
          borderRadius: 10,
          padding: "12px 14px",
          marginBottom: 20,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 6,
        }}
      >
        <div>
          <span style={{ fontSize: 20 }}>{issueObj?.emoji}</span>
          <span style={{ fontSize: 16, fontWeight: 700, color: "#111", marginLeft: 8 }}>
            {issueObj?.label}
          </span>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <span style={{ fontSize: 12, background: "#FFF", borderRadius: 20, padding: "3px 10px", border: "1px solid #CCC", color: "#444" }}>
            {productTypeObj?.emoji} {productTypeObj?.label}
          </span>
          <span style={{ fontSize: 12, background: "#FFF", borderRadius: 20, padding: "3px 10px", border: "1px solid #CCC", color: "#444" }}>
            {severity}
          </span>
          <span style={{ fontSize: 12, background: "#FFF", borderRadius: 20, padding: "3px 10px", border: "1px solid #CCC", color: "#444" }}>
            {soilObj?.label}
          </span>
        </div>
      </div>

      {results.length === 0 ? (
        <div
          style={{
            background: "#FFF8F0",
            border: "1px solid #C8A060",
            borderRadius: 10,
            padding: 20,
            color: "#664020",
          }}
        >
          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>
            No strong match in this category
          </div>
          <div style={{ fontSize: 14, lineHeight: 1.6 }}>
            {getRedirectMessage(productType, issue) ||
              "No products in today's inventory hit the profile threshold for this combination. Try a different soil type filter or ask about incoming stock."}
          </div>
        </div>
      ) : (
        <>
          <div style={{ fontSize: 13, color: "#666", marginBottom: 12 }}>
            {results.length} match{results.length !== 1 ? "es" : ""} — ranked by profile score
          </div>
          {results.map((result, i) => (
            <ResultCard key={result.product.id} result={result} rank={i} issue={issue} />
          ))}
        </>
      )}

      <button
        onClick={onReset}
        style={{
          marginTop: 16,
          width: "100%",
          padding: "14px",
          background: "#2D5A3D",
          color: "#FFF",
          border: "none",
          borderRadius: 10,
          fontSize: 15,
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        New Lookup
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────
// APP
// ─────────────────────────────────────────────

export default function App() {
  const [screen, setScreen] = useState("issue");
  const [issue, setIssue] = useState(null);
  const [severity, setSeverity] = useState(null);
  const [soilType, setSoilType] = useState(null);
  const [productType, setProductType] = useState(null);

  function handleIssueSelect(id) {
    setIssue(id);
    setScreen("severity");
  }

  function handleSeveritySelect(id) {
    setSeverity(id);
    setScreen("soil");
  }

  function handleSoilSelect(id) {
    setSoilType(id);
    setScreen("producttype");
  }

  function handleProductTypeSelect(id) {
    setProductType(id);
    setScreen("results");
  }

  function handleReset() {
    setIssue(null);
    setSeverity(null);
    setSoilType(null);
    setProductType(null);
    setScreen("issue");
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F2F5F2",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        padding: "20px 16px",
        fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 520,
          background: "#FFF",
          borderRadius: 16,
          padding: "24px 20px",
          boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 24,
            paddingBottom: 16,
            borderBottom: "1px solid #E8E8E8",
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              background: "#2D5A3D",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#FFF",
              fontSize: 18,
            }}
          >
            🌿
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#2D5A3D" }}>
              GreenForge
            </div>
            <div style={{ fontSize: 11, color: "#888" }}>
              Pharmacognosy Engine · Budtender Edition
            </div>
          </div>
          {/* Step indicator */}
          <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
            {["issue", "severity", "soil", "producttype", "results"].map((s, i) => (
              <div
                key={s}
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background:
                    screen === s
                      ? "#2D5A3D"
                      : ["issue", "severity", "soil", "producttype", "results"].indexOf(screen) > i
                      ? "#8BB89B"
                      : "#DDD",
                  transition: "background 0.2s",
                }}
              />
            ))}
          </div>
        </div>

        {/* Screens */}
        {screen === "issue" && <IssueScreen onSelect={handleIssueSelect} />}
        {screen === "severity" && (
          <SeverityScreen
            issue={issue}
            onSelect={handleSeveritySelect}
            onBack={() => setScreen("issue")}
          />
        )}
        {screen === "soil" && (
          <SoilScreen
            issue={issue}
            severity={severity}
            onSelect={handleSoilSelect}
            onBack={() => setScreen("severity")}
          />
        )}
        {screen === "producttype" && (
          <ProductTypeScreen
            issue={issue}
            severity={severity}
            soilType={soilType}
            onSelect={handleProductTypeSelect}
            onBack={() => setScreen("soil")}
          />
        )}
        {screen === "results" && (
          <ResultsScreen
            issue={issue}
            severity={severity}
            soilType={soilType}
            productType={productType}
            onBack={() => setScreen("producttype")}
            onReset={handleReset}
          />
        )}
      </div>
    </div>
  );
}
