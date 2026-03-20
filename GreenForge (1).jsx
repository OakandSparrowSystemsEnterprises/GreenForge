import { useState } from "react";

// ─────────────────────────────────────────────
// DATA DEFINITIONS
// ─────────────────────────────────────────────

const ISSUES = [
  { id: "anxiety",      label: "Anxiety",      emoji: "🔵", accent: "#7B9CDB" },
  { id: "pain",         label: "Pain",          emoji: "🔴", accent: "#DB7B7B" },
  { id: "chronic_pain", label: "Chronic Pain",  emoji: "🩸", accent: "#C45C5C" },
  { id: "sleep",        label: "Sleep",         emoji: "🟣", accent: "#9B7BDB" },
  { id: "focus",        label: "Focus",         emoji: "🟡", accent: "#D4B84A" },
  { id: "nausea",       label: "Nausea",        emoji: "🟢", accent: "#5BBD8A" },
  { id: "appetite",     label: "Appetite",      emoji: "🟠", accent: "#D48B4A" },
  { id: "mood",         label: "Mood",          emoji: "🌸", accent: "#D47BAA" },
  { id: "arousal",      label: "Arousal",       emoji: "💜", accent: "#B07BD4" },
  { id: "creativity",   label: "Creativity",    emoji: "🩵", accent: "#5BBDBD" },
];

const SEVERITIES = [
  { id: "mild",     label: "Mild",     sub: "Light · Occasional" },
  { id: "moderate", label: "Moderate", sub: "Regular · Notable" },
  { id: "heavy",    label: "Heavy",    sub: "Chronic · Intense" },
];

const SOIL_TYPES = [
  { id: "indoor",              label: "Indoor",           sub: "Controlled, consistent" },
  { id: "outdoor_living_soil", label: "Living Soil",      sub: "Sun-grown, complex terps" },
  { id: "greenhouse",          label: "Greenhouse",       sub: "Sun + environment" },
  { id: "any",                 label: "Any / Don't Know", sub: "Score all equally" },
];

const PRODUCT_TYPES = [
  { id: "flower",      label: "Flower / Pre-Roll",  emoji: "🌿", sub: "Whole flower, pre-rolls — inhalation formats", formats: ["flower", "preroll"] },
  { id: "rosin_resin", label: "Rosin / Live Resin", emoji: "🔥", sub: "Solventless rosin, live resin carts",       formats: ["solventless", "live_resin"] },
  { id: "edible",      label: "Edible",             emoji: "🍬", sub: "Gummies, chocolates, infused food",         formats: ["edible"] },
  { id: "medical",     label: "Tincture / Topical", emoji: "💊", sub: "RSO, CO₂ extract, sublingual, topical",    formats: ["rso", "co2_extract", "topical"] },
];

// ─────────────────────────────────────────────
// GOLD STANDARD PROFILES
// ─────────────────────────────────────────────

const GOLD = {
  anxiety:      { primary:"linalool",      primaryThreshold:{flower:0.20,concentrate:1.5}, secondary:"caryophyllene", secondaryThreshold:{flower:0.35,concentrate:2.5}, bonus:["bisabolol","nerolidol"],           bonusThreshold:{flower:0.05,concentrate:0.3}, negative:"limonene",    thcWindow:{mild:[15,18],moderate:[18,22],heavy:[20,22]}, thcCeiling:22, cbdRole:"helpful",   minorBonus:null, cbgBonus:null, cbcBonus:null },
  pain:         { primary:"caryophyllene", primaryThreshold:{flower:0.35,concentrate:2.5}, secondary:"myrcene",       secondaryThreshold:{flower:0.40,concentrate:3.0}, bonus:["pinene"],                          bonusThreshold:{flower:0.15,concentrate:1.0}, negative:null,          thcWindow:{mild:[18,22],moderate:[22,26],heavy:[24,28]}, thcCeiling:30, cbdRole:"optional",  minorBonus:null, cbgBonus:null, cbcBonus:0.08 },
  chronic_pain: { primary:"caryophyllene", primaryThreshold:{flower:0.35,concentrate:2.5}, secondary:"myrcene",       secondaryThreshold:{flower:0.40,concentrate:3.0}, bonus:["bisabolol","linalool","nerolidol"], bonusThreshold:{flower:0.05,concentrate:0.3}, negative:null,          thcWindow:{mild:[15,20],moderate:[18,24],heavy:[20,26]}, thcCeiling:26, cbdRole:"essential", minorBonus:null, cbgBonus:0.08, cbcBonus:0.08 },
  sleep:        { primary:"myrcene",       primaryThreshold:{flower:0.40,concentrate:3.0}, secondary:"linalool",      secondaryThreshold:{flower:0.20,concentrate:1.5}, bonus:["nerolidol","terpineol"],           bonusThreshold:{flower:0.05,concentrate:0.3}, negative:"terpinolene", thcWindow:{mild:[15,20],moderate:[18,24],heavy:[20,24]}, thcCeiling:26, cbdRole:"optional",  minorBonus:"cbn", cbgBonus:null, cbcBonus:null },
  focus:        { primary:"pinene",        primaryThreshold:{flower:0.15,concentrate:1.0}, secondary:"terpinolene",   secondaryThreshold:{flower:0.20,concentrate:1.5}, bonus:["ocimene"],                         bonusThreshold:{flower:0.10,concentrate:0.8}, negative:"myrcene",     thcWindow:{mild:[12,16],moderate:[14,18],heavy:[16,20]}, thcCeiling:20, cbdRole:"avoid",     minorBonus:"thcv", cbgBonus:0.08, cbcBonus:null },
  nausea:       { primary:"myrcene",       primaryThreshold:{flower:0.30,concentrate:2.0}, secondary:"linalool",      secondaryThreshold:{flower:0.15,concentrate:1.0}, bonus:["ocimene"],                         bonusThreshold:{flower:0.10,concentrate:0.8}, negative:null,          thcWindow:{mild:[12,16],moderate:[16,20],heavy:[18,22]}, thcCeiling:24, cbdRole:"helpful",   minorBonus:null, cbgBonus:null, cbcBonus:null },
  appetite:     { primary:"myrcene",       primaryThreshold:{flower:0.40,concentrate:3.0}, secondary:"limonene",      secondaryThreshold:{flower:0.25,concentrate:2.0}, bonus:["caryophyllene"],                   bonusThreshold:{flower:0.25,concentrate:2.0}, negative:null,          thcWindow:{mild:[18,22],moderate:[22,26],heavy:[24,28]}, thcCeiling:30, cbdRole:"optional",  minorBonus:null, cbgBonus:0.1, cbcBonus:null },
  mood:         { primary:"limonene",      primaryThreshold:{flower:0.25,concentrate:2.0}, secondary:"terpinolene",   secondaryThreshold:{flower:0.20,concentrate:1.5}, bonus:["ocimene","valencene"],             bonusThreshold:{flower:0.10,concentrate:0.8}, negative:"linalool",    thcWindow:{mild:[18,20],moderate:[20,24],heavy:[22,26]}, thcCeiling:28, cbdRole:"optional",  minorBonus:null, cbgBonus:0.08, cbcBonus:0.1 },
  arousal:      { primary:"limonene",      primaryThreshold:{flower:0.25,concentrate:2.0}, secondary:"terpinolene",   secondaryThreshold:{flower:0.20,concentrate:1.5}, bonus:["farnesene","geraniol"],            bonusThreshold:{flower:0.05,concentrate:0.3}, negative:"myrcene",     thcWindow:{mild:[14,17],moderate:[16,20],heavy:[18,22]}, thcCeiling:22, cbdRole:"optional",  minorBonus:null, cbgBonus:null, cbcBonus:null },
  creativity:   { primary:"terpinolene",   primaryThreshold:{flower:0.20,concentrate:1.5}, secondary:"pinene",        secondaryThreshold:{flower:0.15,concentrate:1.0}, bonus:["ocimene","farnesene"],             bonusThreshold:{flower:0.05,concentrate:0.3}, negative:"myrcene",     thcWindow:{mild:[16,18],moderate:[18,22],heavy:[20,24]}, thcCeiling:24, cbdRole:"avoid",     minorBonus:"thcv", cbgBonus:0.08, cbcBonus:0.1 },
};

// ─────────────────────────────────────────────
// PRODUCT DATABASE — 42 products
// ─────────────────────────────────────────────

const PRODUCTS = [
  { id:1,  name:"Forbidden Fruit",       brand:"Cannabiotix (CBX)",      tier:5, format:"flower",      strainType:"indica",      soilType:"indoor",              thcEquiv:26, cbd:0.05, cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.55,caryophyllene:0.38,linalool:0.42,limonene:0.18,pinene:0.08,terpinolene:0.04,ocimene:0.02,nerolidol:0,   farnesene:0,   bisabolol:0.06,terpineol:0.05,humulene:0.12,valencene:0,   geraniol:0}},
  { id:5,  name:"Durban Poison",          brand:"UpNorth Humboldt",       tier:5, format:"flower",      strainType:"sativa",      soilType:"outdoor_living_soil", thcEquiv:18, cbd:0.1,  cbn:0,   thcv:0.4,   cbg:0,   cbc:0,   terpenes:{myrcene:0.12,caryophyllene:0.14,linalool:0.06,limonene:0.18,pinene:0.38,terpinolene:0.62,ocimene:0.22,nerolidol:0,   farnesene:0.06,bisabolol:0,    terpineol:0.04,humulene:0.05,valencene:0,   geraniol:0}},
  { id:6,  name:"Area 41",                brand:"Alien Labs",             tier:5, format:"flower",      strainType:"hybrid",      soilType:"indoor",              thcEquiv:28, cbd:0.05, cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.28,caryophyllene:0.38,linalool:0.12,limonene:0.52,pinene:0.10,terpinolene:0.28,ocimene:0.18,nerolidol:0,   farnesene:0,   bisabolol:0.04,terpineol:0.05,humulene:0.08,valencene:0.06,geraniol:0}},
  { id:9,  name:"Granddaddy Purple",      brand:"Glass House Brands",     tier:5, format:"flower",      strainType:"indica",      soilType:"greenhouse",          thcEquiv:22, cbd:0.06, cbn:0.1, thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.72,caryophyllene:0.28,linalool:0.35,limonene:0.10,pinene:0.06,terpinolene:0.03,ocimene:0.02,nerolidol:0.08,farnesene:0,   bisabolol:0.04,terpineol:0.15,humulene:0.12,valencene:0,   geraniol:0}},
  { id:15, name:"Haze Flower",            brand:"Wonderbrett",            tier:5, format:"flower",      strainType:"sativa",      soilType:"indoor",              thcEquiv:22, cbd:0.05, cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.14,caryophyllene:0.18,linalool:0.08,limonene:0.44,pinene:0.22,terpinolene:0.58,ocimene:0.28,nerolidol:0,   farnesene:0.09,bisabolol:0,    terpineol:0,   humulene:0.05,valencene:0,   geraniol:0.04}},
  { id:16, name:"OG Kush",                brand:"Cannabiotix (CBX)",      tier:5, format:"flower",      strainType:"indica",      soilType:"indoor",              thcEquiv:24, cbd:0.06, cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.62,caryophyllene:0.52,linalool:0.18,limonene:0.22,pinene:0.18,terpinolene:0.03,ocimene:0.02,nerolidol:0,   farnesene:0,   bisabolol:0.02,terpineol:0.08,humulene:0.22,valencene:0,   geraniol:0}},
  { id:17, name:"Gelato",                 brand:"Connected Cannabis Co.", tier:5, format:"flower",      strainType:"hybrid",      soilType:"indoor",              thcEquiv:26, cbd:0.04, cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.38,caryophyllene:0.34,linalool:0.14,limonene:0.48,pinene:0.08,terpinolene:0.22,ocimene:0.14,nerolidol:0,   farnesene:0,   bisabolol:0.02,terpineol:0.04,humulene:0.10,valencene:0.04,geraniol:0}},
  { id:19, name:"Jack Herer",             brand:"Seed Junky Genetics",    tier:5, format:"flower",      strainType:"sativa",      soilType:"indoor",              thcEquiv:20, cbd:0.08, cbn:0,   thcv:0.1,   cbg:0,   cbc:0,   terpenes:{myrcene:0.18,caryophyllene:0.16,linalool:0.08,limonene:0.24,pinene:0.44,terpinolene:0.38,ocimene:0.18,nerolidol:0,   farnesene:0,   bisabolol:0,    terpineol:0.06,humulene:0.06,valencene:0,   geraniol:0}},
  { id:38, name:"Wedding Cake",           brand:"Seed Junky Genetics",    tier:5, format:"flower",      strainType:"indica",      soilType:"indoor",              thcEquiv:27, cbd:0.04, cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.50,caryophyllene:0.44,linalool:0.16,limonene:0.36,pinene:0.06,terpinolene:0.08,ocimene:0.06,nerolidol:0,   farnesene:0,   bisabolol:0.03,terpineol:0.06,humulene:0.14,valencene:0.02,geraniol:0}},
  { id:39, name:"Zkittlez",               brand:"Alien Labs",             tier:5, format:"flower",      strainType:"hybrid",      soilType:"indoor",              thcEquiv:23, cbd:0.05, cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.42,caryophyllene:0.36,linalool:0.38,limonene:0.44,pinene:0.06,terpinolene:0.04,ocimene:0.03,nerolidol:0,   farnesene:0,   bisabolol:0.05,terpineol:0.07,humulene:0.10,valencene:0.03,geraniol:0}},
  { id:2,  name:"Indica Rosin (OG)",      brand:"710 Labs",               tier:4, format:"solventless",      strainType:"hybrid", soilType:"indoor",              thcEquiv:21, cbd:0.8,  cbn:0.3, thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:5.2,caryophyllene:3.1,linalool:2.8,limonene:0.9,pinene:0.6,terpinolene:0.2,ocimene:0.1,nerolidol:0.65,farnesene:0,   bisabolol:0.42,terpineol:0.5,humulene:1.1,valencene:0,   geraniol:0}},
  { id:10, name:"Indica Live Rosin",      brand:"Almora Farm",            tier:4, format:"solventless",      strainType:"hybrid", soilType:"outdoor_living_soil", thcEquiv:20, cbd:0.6,  cbn:0.2, thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:4.8,caryophyllene:2.6,linalool:2.2,limonene:0.6,pinene:0.4,terpinolene:0.1,ocimene:0.15,nerolidol:0.2, farnesene:0,   bisabolol:0.5, terpineol:0.8,humulene:0.6,valencene:0,   geraniol:0}},
  { id:20, name:"Haze Rosin (Sativa)",    brand:"710 Labs",               tier:4, format:"solventless",      strainType:"sativa", soilType:"indoor",              thcEquiv:19, cbd:0.3,  cbn:0,   thcv:0.2,   cbg:0,   cbc:0,   terpenes:{myrcene:0.6,caryophyllene:0.8,linalool:0.4,limonene:3.2,pinene:1.8,terpinolene:4.8,ocimene:2.2,nerolidol:0,   farnesene:0.4, bisabolol:0,    terpineol:0,   humulene:0.2,valencene:0.3,geraniol:0.1}},
  { id:21, name:"GDP Live Rosin",         brand:"Woodstocks",             tier:4, format:"solventless",      strainType:"indica", soilType:"indoor",              thcEquiv:20, cbd:0.4,  cbn:0.3, thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:5.8,caryophyllene:1.8,linalool:3.1,limonene:0.4,pinene:0.3,terpinolene:0.08,ocimene:0.05,nerolidol:0.55,farnesene:0,   bisabolol:0.38,terpineol:0.9,humulene:0.5,valencene:0,   geraniol:0}},
  { id:22, name:"Sativa Rosin",           brand:"Jungle Boys",            tier:4, format:"solventless",      strainType:"sativa", soilType:"indoor",              thcEquiv:18, cbd:0.2,  cbn:0,   thcv:0.15,   cbg:0,   cbc:0,   terpenes:{myrcene:0.5,caryophyllene:0.6,linalool:0.3,limonene:2.8,pinene:1.4,terpinolene:3.6,ocimene:1.6,nerolidol:0,   farnesene:0.35,bisabolol:0,    terpineol:0,   humulene:0.15,valencene:0.2,geraniol:0.12}},
  { id:4,  name:"OG Gas Cart",            brand:"Raw Garden",             tier:3, format:"live_resin",      strainType:"hybrid",  soilType:"greenhouse",          thcEquiv:20, cbd:0.5,  cbn:0.1, thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:4.2,caryophyllene:3.8,linalool:0.8,limonene:1.2,pinene:0.6,terpinolene:0.3,ocimene:0.2,nerolidol:0,   farnesene:0,   bisabolol:0.1, terpineol:0.2,humulene:0.9,valencene:0,   geraniol:0}},
  { id:8,  name:"Haze Cart",              brand:"Friendly Farms",         tier:3, format:"live_resin",      strainType:"hybrid",  soilType:"indoor",              thcEquiv:19, cbd:0.4,  cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.8,caryophyllene:0.5,linalool:0.3,limonene:2.1,pinene:1.1,terpinolene:3.2,ocimene:1.8,nerolidol:0,   farnesene:0,   bisabolol:0,    terpineol:0,   humulene:0.2,valencene:0,   geraniol:0}},
  { id:13, name:"Sour Diesel",           brand:"Green Dawg Genetics",    tier:5, format:"flower",      strainType:"hybrid",      soilType:"indoor",              thcEquiv:22, cbd:0.06, cbn:0,   thcv:0.1,   cbg:0,   cbc:0,   terpenes:{myrcene:0.16,caryophyllene:0.22,linalool:0.08,limonene:0.32,pinene:0.28,terpinolene:0.46,ocimene:0.18,nerolidol:0,   farnesene:0.06,bisabolol:0,    terpineol:0.04,humulene:0.08,valencene:0,   geraniol:0.02}},
  { id:25, name:"Indica Sauce (OG)",      brand:"Beezle Brands",          tier:3, format:"live_resin",      strainType:"indica",  soilType:"indoor",              thcEquiv:22, cbd:0.4,  cbn:0.1, thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:5.0,caryophyllene:4.2,linalool:1.4,limonene:0.8,pinene:0.5,terpinolene:0.2,ocimene:0.1,nerolidol:0,   farnesene:0,   bisabolol:0.15,terpineol:0.3,humulene:1.2,valencene:0,   geraniol:0}},
  { id:26, name:"Sativa Cart",            brand:"Ember Valley",           tier:3, format:"live_resin",      strainType:"sativa",  soilType:"indoor",              thcEquiv:18, cbd:0.3,  cbn:0,   thcv:0.1,   cbg:0,   cbc:0,   terpenes:{myrcene:0.5,caryophyllene:0.4,linalool:0.2,limonene:2.6,pinene:1.2,terpinolene:2.8,ocimene:1.4,nerolidol:0,   farnesene:0.2, bisabolol:0,    terpineol:0,   humulene:0.1,valencene:0.15,geraniol:0.08}},
  { id:40, name:"Indica Cart",            brand:"Friendly Farms",         tier:3, format:"live_resin",      strainType:"indica",  soilType:"indoor",              thcEquiv:22, cbd:0.3,  cbn:0.1, thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:4.6,caryophyllene:2.8,linalool:1.9,limonene:0.7,pinene:0.4,terpinolene:0.1,ocimene:0.1,nerolidol:0.2, farnesene:0,   bisabolol:0.2, terpineol:0.4,humulene:0.8,valencene:0,   geraniol:0}},
  { id:7,  name:"Midnight Blueberry",     brand:"Kiva",                   tier:1, format:"edible",      strainType:"hybrid",      soilType:"any",                 thcEquiv:10, cbd:0,    cbn:0.5, thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.8,caryophyllene:0.2,linalool:0.6,limonene:0.1,pinene:0,terpinolene:0,ocimene:0,nerolidol:0,farnesene:0,bisabolol:0,terpineol:0,humulene:0,valencene:0,geraniol:0}},
  { id:29, name:"Raspberry Gummies",      brand:"Wyld",                   tier:1, format:"edible",      strainType:"hybrid",      soilType:"any",                 thcEquiv:12, cbd:0,    cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.2,caryophyllene:0.3,linalool:0.1,limonene:0.7,pinene:0,terpinolene:0,ocimene:0,nerolidol:0,farnesene:0,bisabolol:0,terpineol:0,humulene:0,valencene:0,geraniol:0}},
  { id:31, name:"Quick Gummies",          brand:"Wana",                   tier:1, format:"edible",      strainType:"hybrid",      soilType:"any",                 thcEquiv:14, cbd:0,    cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.5,caryophyllene:0.5,linalool:0.2,limonene:0.4,pinene:0,terpinolene:0,ocimene:0,nerolidol:0,farnesene:0,bisabolol:0,terpineol:0,humulene:0,valencene:0,geraniol:0}},
  { id:32, name:"Infused Pre-roll",       brand:"Jeeter",                 tier:1, format:"preroll",      strainType:"hybrid",     soilType:"any",                 thcEquiv:28, cbd:0,    cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.6,caryophyllene:0.4,linalool:0,limonene:0.2,pinene:0,terpinolene:0,ocimene:0,nerolidol:0,farnesene:0,bisabolol:0,terpineol:0,humulene:0,valencene:0,geraniol:0}},
  { id:33, name:"Whole Flower Pre-rolls", brand:"Lowell Herb Co.",        tier:5, format:"preroll",      strainType:"hybrid",     soilType:"outdoor_living_soil", thcEquiv:20, cbd:0.1,  cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.42,caryophyllene:0.36,linalool:0.22,limonene:0.28,pinene:0.14,terpinolene:0.16,ocimene:0.10,nerolidol:0,farnesene:0.04,bisabolol:0.03,terpineol:0.06,humulene:0.12,valencene:0,geraniol:0}},
  { id:3,  name:"1:1 RSO Tincture",       brand:"Papa & Barkley",         tier:2, format:"rso",      strainType:"hybrid",         soilType:"greenhouse",          thcEquiv:12, cbd:12,   cbn:0.8, thcv:0,   cbg:0.2,   cbc:0.1,   terpenes:{myrcene:2.1,caryophyllene:1.9,linalool:1.2,limonene:0.8,pinene:0.6,terpinolene:0.1,ocimene:0.15,nerolidol:0.38,farnesene:0,bisabolol:0.41,terpineol:0.3,humulene:0.5,valencene:0,geraniol:0}},
  { id:12, name:"2:1 CBD Cart",           brand:"Care By Design",         tier:2, format:"co2_extract",      strainType:"hybrid", soilType:"any",                 thcEquiv:10, cbd:20,   cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.8,caryophyllene:1.2,linalool:0.6,limonene:0.4,pinene:0.2,terpinolene:0,ocimene:0,nerolidol:0,farnesene:0,bisabolol:0,terpineol:0,humulene:0.3,valencene:0,geraniol:0}},
  { id:37, name:"18:1 CBD Tincture",      brand:"Care By Design",         tier:2, format:"co2_extract",      strainType:"hybrid", soilType:"any",                 thcEquiv:4,  cbd:36,   cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.5,caryophyllene:1.0,linalool:0.8,limonene:0.3,pinene:0.15,terpinolene:0,ocimene:0,nerolidol:0,farnesene:0,bisabolol:0,terpineol:0,humulene:0.2,valencene:0,geraniol:0}},

  // ── TIER 5 INDOOR — HEIRBLOOM (CBX) ──
  { id:44, name:"Green Crack",           brand:"Heirbloom (CBX)",        tier:5, format:"flower",      strainType:"sativa",      soilType:"indoor",              thcEquiv:22, cbd:0.06, cbn:0,   thcv:0.2,   cbg:0,   cbc:0,   terpenes:{myrcene:0.10,caryophyllene:0.12,linalool:0.05,limonene:0.22,pinene:0.36,terpinolene:0.68,ocimene:0.28,nerolidol:0,   farnesene:0.05,bisabolol:0,    terpineol:0.04,humulene:0.04,valencene:0,   geraniol:0.02}},
  { id:45, name:"Master Kush",           brand:"Heirbloom (CBX)",        tier:5, format:"flower",      strainType:"indica",      soilType:"indoor",              thcEquiv:23, cbd:0.07, cbn:0.1, thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.68,caryophyllene:0.44,linalool:0.32,limonene:0.12,pinene:0.10,terpinolene:0.04,ocimene:0.02,nerolidol:0.08,farnesene:0,   bisabolol:0.05,terpineol:0.12,humulene:0.18,valencene:0,   geraniol:0}},
  // ── TIER 5 INDOOR — FIG FARMS ──
  // ── TIER 5 INDOOR — THC DESIGN ──
  { id:48, name:"Papaya Nights",         brand:"THC Design",             tier:5, format:"flower",      strainType:"indica",      soilType:"indoor",              thcEquiv:26, cbd:0.05, cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.62,caryophyllene:0.38,linalool:0.20,limonene:0.34,pinene:0.08,terpinolene:0.12,ocimene:0.08,nerolidol:0.05,farnesene:0,   bisabolol:0.04,terpineol:0.06,humulene:0.14,valencene:0.03,geraniol:0}},
  { id:49, name:"LA Kush Cake",          brand:"THC Design",             tier:5, format:"flower",      strainType:"indica",      soilType:"indoor",              thcEquiv:29, cbd:0.03, cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.55,caryophyllene:0.46,linalool:0.22,limonene:0.26,pinene:0.07,terpinolene:0.06,ocimene:0.03,nerolidol:0,   farnesene:0,   bisabolol:0.04,terpineol:0.06,humulene:0.16,valencene:0.02,geraniol:0}},
  // ── TIER 5 INDOOR — BLEM ──
  { id:50, name:"Rail Up Trainwreck",    brand:"Blem",                   tier:5, format:"flower",      strainType:"sativa",      soilType:"indoor",              thcEquiv:20, cbd:0.08, cbn:0,   thcv:0.15,   cbg:0,   cbc:0,   terpenes:{myrcene:0.11,caryophyllene:0.14,linalool:0.06,limonene:0.28,pinene:0.42,terpinolene:0.72,ocimene:0.32,nerolidol:0,   farnesene:0.08,bisabolol:0,    terpineol:0.04,humulene:0.05,valencene:0,   geraniol:0.02}},
  { id:51, name:"Lemon Ting",            brand:"Blem",                   tier:5, format:"flower",      strainType:"sativa",      soilType:"indoor",              thcEquiv:21, cbd:0.06, cbn:0,   thcv:0.1,   cbg:0,   cbc:0,   terpenes:{myrcene:0.09,caryophyllene:0.16,linalool:0.07,limonene:0.62,pinene:0.26,terpinolene:0.54,ocimene:0.20,nerolidol:0,   farnesene:0.06,bisabolol:0,    terpineol:0.03,humulene:0.04,valencene:0.03,geraniol:0.03}},
  // ── TIER 5 INDOOR — COMPOUND GENETICS ──
  { id:52, name:"La Bomba",              brand:"Compound Genetics",      tier:5, format:"flower",      strainType:"hybrid",      soilType:"indoor",              thcEquiv:29, cbd:0.04, cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.28,caryophyllene:0.32,linalool:0.12,limonene:0.56,pinene:0.10,terpinolene:0.26,ocimene:0.14,nerolidol:0,   farnesene:0,   bisabolol:0.03,terpineol:0.04,humulene:0.10,valencene:0.06,geraniol:0}},
  { id:53, name:"Gushers (Compound)",    brand:"Compound Genetics",      tier:5, format:"flower",      strainType:"hybrid",      soilType:"indoor",              thcEquiv:26, cbd:0.04, cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.44,caryophyllene:0.36,linalool:0.28,limonene:0.42,pinene:0.06,terpinolene:0.08,ocimene:0.04,nerolidol:0,   farnesene:0,   bisabolol:0.04,terpineol:0.05,humulene:0.10,valencene:0.04,geraniol:0}},
  // ── TIER 5 INDOOR — KHALIFA KUSH ──
  { id:54, name:"KK Original",           brand:"Khalifa Kush",           tier:5, format:"flower",      strainType:"indica",      soilType:"indoor",              thcEquiv:26, cbd:0.05, cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.58,caryophyllene:0.48,linalool:0.16,limonene:0.24,pinene:0.16,terpinolene:0.04,ocimene:0.02,nerolidol:0,   farnesene:0,   bisabolol:0.03,terpineol:0.08,humulene:0.20,valencene:0,   geraniol:0}},
  // ── TIER 5 INDOOR — ELYON CANNABIS ──
  { id:55, name:"Apple Fritter",         brand:"Elyon Cannabis",         tier:5, format:"flower",      strainType:"hybrid",      soilType:"indoor",              thcEquiv:27, cbd:0.04, cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.46,caryophyllene:0.38,linalool:0.18,limonene:0.44,pinene:0.08,terpinolene:0.14,ocimene:0.08,nerolidol:0,   farnesene:0,   bisabolol:0.04,terpineol:0.05,humulene:0.12,valencene:0.04,geraniol:0}},
  { id:56, name:"Runtz",                 brand:"Elyon Cannabis",         tier:5, format:"flower",      strainType:"hybrid",      soilType:"indoor",              thcEquiv:24, cbd:0.04, cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.38,caryophyllene:0.32,linalool:0.36,limonene:0.46,pinene:0.06,terpinolene:0.06,ocimene:0.04,nerolidol:0,   farnesene:0,   bisabolol:0.06,terpineol:0.06,humulene:0.08,valencene:0.04,geraniol:0}},
  // ── TIER 5 INDOOR — CONNECTED CANNABIS (additional) ──
  { id:57, name:"Biscotti",              brand:"Connected Cannabis Co.", tier:5, format:"flower",      strainType:"indica",      soilType:"indoor",              thcEquiv:27, cbd:0.04, cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.50,caryophyllene:0.40,linalool:0.26,limonene:0.30,pinene:0.07,terpinolene:0.08,ocimene:0.04,nerolidol:0,   farnesene:0,   bisabolol:0.04,terpineol:0.05,humulene:0.12,valencene:0.02,geraniol:0}},
  // ── TIER 5 SUN-GROWN — AUTUMN BRANDS ──
  { id:58, name:"Sungrown Sativa",       brand:"Autumn Brands",          tier:5, format:"flower",      strainType:"sativa",      soilType:"outdoor_living_soil", thcEquiv:17, cbd:0.12, cbn:0,   thcv:0.2,   cbg:0,   cbc:0,   terpenes:{myrcene:0.14,caryophyllene:0.18,linalool:0.08,limonene:0.26,pinene:0.32,terpinolene:0.58,ocimene:0.24,nerolidol:0,   farnesene:0.10,bisabolol:0,    terpineol:0.05,humulene:0.06,valencene:0.05,geraniol:0.03}},
  { id:59, name:"Sungrown Indica",       brand:"Autumn Brands",          tier:5, format:"flower",      strainType:"indica",      soilType:"outdoor_living_soil", thcEquiv:19, cbd:0.10, cbn:0.1, thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.66,caryophyllene:0.32,linalool:0.28,limonene:0.14,pinene:0.08,terpinolene:0.04,ocimene:0.02,nerolidol:0.06,farnesene:0,   bisabolol:0.06,terpineol:0.10,humulene:0.12,valencene:0,   geraniol:0}},
  // ── TIER 5 SUN-GROWN — SOMA ROSA FARMS ──
  { id:60, name:"Haze (Living Soil)",    brand:"Soma Rosa Farms",        tier:5, format:"flower",      strainType:"sativa",      soilType:"outdoor_living_soil", thcEquiv:18, cbd:0.10, cbn:0,   thcv:0.18,   cbg:0,   cbc:0,   terpenes:{myrcene:0.10,caryophyllene:0.12,linalool:0.06,limonene:0.24,pinene:0.34,terpinolene:0.74,ocimene:0.30,nerolidol:0,   farnesene:0.12,bisabolol:0,    terpineol:0.04,humulene:0.04,valencene:0.06,geraniol:0.04}},
  { id:61, name:"Purple (Living Soil)",  brand:"Soma Rosa Farms",        tier:5, format:"flower",      strainType:"indica",      soilType:"outdoor_living_soil", thcEquiv:20, cbd:0.08, cbn:0.1, thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.70,caryophyllene:0.26,linalool:0.40,limonene:0.10,pinene:0.06,terpinolene:0.03,ocimene:0.02,nerolidol:0.10,farnesene:0,   bisabolol:0.05,terpineol:0.14,humulene:0.10,valencene:0,   geraniol:0}},
  // ── TIER 5 SUN-GROWN — EMERALD BAY EXTRACTS ──
  { id:62, name:"Emerald Triangle Haze", brand:"Emerald Bay Extracts",   tier:5, format:"flower",      strainType:"sativa",      soilType:"outdoor_living_soil", thcEquiv:17, cbd:0.14, cbn:0,   thcv:0.22,   cbg:0,   cbc:0,   terpenes:{myrcene:0.08,caryophyllene:0.10,linalool:0.05,limonene:0.20,pinene:0.38,terpinolene:0.80,ocimene:0.34,nerolidol:0,   farnesene:0.14,bisabolol:0,    terpineol:0.04,humulene:0.04,valencene:0.08,geraniol:0.05}},
  // ── TIER 5 SUN-GROWN — SUNDAY GOODS ──
  { id:63, name:"Sunday Sativa",         brand:"Sunday Goods",           tier:5, format:"flower",      strainType:"sativa",      soilType:"outdoor_living_soil", thcEquiv:18, cbd:0.10, cbn:0,   thcv:0.14,   cbg:0,   cbc:0,   terpenes:{myrcene:0.12,caryophyllene:0.14,linalool:0.06,limonene:0.28,pinene:0.30,terpinolene:0.62,ocimene:0.22,nerolidol:0,   farnesene:0.08,bisabolol:0,    terpineol:0.04,humulene:0.05,valencene:0.04,geraniol:0.02}},
  { id:64, name:"Sunday Indica",         brand:"Sunday Goods",           tier:5, format:"flower",      strainType:"indica",      soilType:"outdoor_living_soil", thcEquiv:20, cbd:0.08, cbn:0.1, thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.64,caryophyllene:0.30,linalool:0.34,limonene:0.12,pinene:0.08,terpinolene:0.04,ocimene:0.02,nerolidol:0.06,farnesene:0,   bisabolol:0.05,terpineol:0.10,humulene:0.12,valencene:0,   geraniol:0}},
  // ── TIER 5 SUN-GROWN — GOLD FLORA ──
  { id:65, name:"Sungrown OG",           brand:"Gold Flora",             tier:5, format:"flower",      strainType:"indica",      soilType:"greenhouse",          thcEquiv:21, cbd:0.06, cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.58,caryophyllene:0.46,linalool:0.16,limonene:0.24,pinene:0.16,terpinolene:0.04,ocimene:0.02,nerolidol:0,   farnesene:0,   bisabolol:0.03,terpineol:0.08,humulene:0.18,valencene:0,   geraniol:0}},
  { id:66, name:"Sungrown Hybrid",       brand:"Gold Flora",             tier:5, format:"flower",      strainType:"hybrid",      soilType:"greenhouse",          thcEquiv:22, cbd:0.06, cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.38,caryophyllene:0.34,linalool:0.20,limonene:0.40,pinene:0.10,terpinolene:0.22,ocimene:0.12,nerolidol:0,   farnesene:0.04,bisabolol:0.04,terpineol:0.06,humulene:0.10,valencene:0.04,geraniol:0}},
  // ── TIER 5 SUN-GROWN — HAVA GARDENS ──
  { id:67, name:"Hava Haze",             brand:"Hava Gardens",           tier:5, format:"flower",      strainType:"sativa",      soilType:"outdoor_living_soil", thcEquiv:16, cbd:0.14, cbn:0,   thcv:0.24,   cbg:0,   cbc:0,   terpenes:{myrcene:0.09,caryophyllene:0.11,linalool:0.05,limonene:0.22,pinene:0.36,terpinolene:0.76,ocimene:0.32,nerolidol:0,   farnesene:0.12,bisabolol:0,    terpineol:0.03,humulene:0.04,valencene:0.07,geraniol:0.04}},
  // ── TIER 5 SUN-GROWN — HUMBOLDT SEED CO ──
  { id:68, name:"Pineapple Upside Down", brand:"Humboldt Seed Co.",      tier:5, format:"flower",      strainType:"sativa",      soilType:"outdoor_living_soil", thcEquiv:19, cbd:0.08, cbn:0,   thcv:0.12,   cbg:0,   cbc:0,   terpenes:{myrcene:0.22,caryophyllene:0.18,linalool:0.10,limonene:0.38,pinene:0.20,terpinolene:0.44,ocimene:0.18,nerolidol:0,   farnesene:0.08,bisabolol:0,    terpineol:0.04,humulene:0.06,valencene:0.04,geraniol:0.03}},
  { id:69, name:"Blue Dream (Humb.)",    brand:"Humboldt Seed Co.",      tier:5, format:"flower",      strainType:"hybrid",      soilType:"outdoor_living_soil", thcEquiv:20, cbd:0.08, cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.46,caryophyllene:0.22,linalool:0.18,limonene:0.36,pinene:0.18,terpinolene:0.28,ocimene:0.14,nerolidol:0,   farnesene:0.06,bisabolol:0.04,terpineol:0.06,humulene:0.08,valencene:0.04,geraniol:0.02}},
  // ── TIER 5 SUN-GROWN — LOWELL (additional) ──
  { id:70, name:"Indica Pre-roll Pack",  brand:"Lowell Herb Co.",        tier:5, format:"preroll",      strainType:"indica",     soilType:"outdoor_living_soil", thcEquiv:19, cbd:0.10, cbn:0.1, thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.58,caryophyllene:0.32,linalool:0.30,limonene:0.14,pinene:0.08,terpinolene:0.04,ocimene:0.02,nerolidol:0.06,farnesene:0,   bisabolol:0.05,terpineol:0.08,humulene:0.12,valencene:0,   geraniol:0}},
  // ── TIER 4 SOLVENTLESS — FIDEL'S ──
  { id:71, name:"Indica Rosin (OG)",     brand:"Fidel's",                tier:4, format:"solventless",      strainType:"indica", soilType:"indoor",              thcEquiv:22, cbd:0.6,  cbn:0.2, thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:5.4,caryophyllene:3.8,linalool:1.6,limonene:1.0,pinene:0.8,terpinolene:0.2,ocimene:0.1,nerolidol:0.2, farnesene:0,   bisabolol:0.3, terpineol:0.5,humulene:1.2,valencene:0,   geraniol:0}},
  { id:72, name:"Sativa Rosin (Haze)",   brand:"Fidel's",                tier:4, format:"solventless",      strainType:"sativa", soilType:"indoor",              thcEquiv:19, cbd:0.3,  cbn:0,   thcv:0.2,   cbg:0,   cbc:0,   terpenes:{myrcene:0.5,caryophyllene:0.7,linalool:0.3,limonene:3.4,pinene:1.6,terpinolene:5.0,ocimene:2.0,nerolidol:0,   farnesene:0.4, bisabolol:0,    terpineol:0,   humulene:0.2,valencene:0.3,geraniol:0.1}},
  // ── TIER 4 SOLVENTLESS — OLIO ──
  { id:73, name:"Rosin (Indica)",        brand:"Olio",                   tier:4, format:"solventless",      strainType:"indica", soilType:"indoor",              thcEquiv:23, cbd:0.4,  cbn:0.1, thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:4.4,caryophyllene:3.2,linalool:2.0,limonene:1.2,pinene:0.6,terpinolene:0.3,ocimene:0.1,nerolidol:0.4, farnesene:0,   bisabolol:0.3, terpineol:0.5,humulene:0.9,valencene:0,   geraniol:0}},
  { id:74, name:"Live Rosin (Sativa)",   brand:"Olio",                   tier:4, format:"solventless",      strainType:"sativa", soilType:"indoor",              thcEquiv:20, cbd:0.3,  cbn:0,   thcv:0.15,   cbg:0,   cbc:0,   terpenes:{myrcene:0.6,caryophyllene:0.7,linalool:0.3,limonene:3.0,pinene:1.6,terpinolene:4.2,ocimene:1.8,nerolidol:0,   farnesene:0.3, bisabolol:0,    terpineol:0,   humulene:0.2,valencene:0.2,geraniol:0.08}},
  // ── TIER 4 SOLVENTLESS — RAW GARDEN LIVE ROSIN ──
  // ── TIER 4 SOLVENTLESS — JUNGLE BOYS ──
  { id:77, name:"Indica Rosin (GDP)",    brand:"Jungle Boys",            tier:4, format:"solventless",      strainType:"indica", soilType:"indoor",              thcEquiv:21, cbd:0.5,  cbn:0.3, thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:5.6,caryophyllene:2.0,linalool:3.0,limonene:0.5,pinene:0.3,terpinolene:0.1,ocimene:0.05,nerolidol:0.5,farnesene:0,   bisabolol:0.4, terpineol:0.9,humulene:0.5,valencene:0,   geraniol:0}},
  { id:78, name:"Hybrid Rosin (Gelato)", brand:"Jungle Boys",            tier:4, format:"solventless",      strainType:"hybrid", soilType:"indoor",              thcEquiv:22, cbd:0.4,  cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:3.2,caryophyllene:2.8,linalool:1.2,limonene:2.4,pinene:0.6,terpinolene:0.8,ocimene:0.4,nerolidol:0,   farnesene:0,   bisabolol:0.2, terpineol:0.4,humulene:0.8,valencene:0.3,geraniol:0}},
  // ── TIER 4 SOLVENTLESS — ALMORA (additional) ──
  { id:79, name:"Abacus Diesel Rosin",   brand:"Almora Farm",            tier:4, format:"solventless",      strainType:"sativa", soilType:"outdoor_living_soil", thcEquiv:18, cbd:0.5,  cbn:0.1, thcv:0.1,   cbg:0,   cbc:0,   terpenes:{myrcene:0.8,caryophyllene:1.0,linalool:0.4,limonene:2.0,pinene:1.0,terpinolene:3.2,ocimene:1.2,nerolidol:0,   farnesene:0.2, bisabolol:0,    terpineol:0,   humulene:0.2,valencene:0.15,geraniol:0.05}},
  // ── LIVE RESIN — STIIIZY PREMIUM ──
  // ── LIVE RESIN — HEAVY HITTERS PREMIUM ──
  // ── LIVE RESIN — MOXIE ──
  { id:84, name:"Indica Sauce",          brand:"Moxie",                  tier:3, format:"live_resin",      strainType:"indica",  soilType:"indoor",              thcEquiv:22, cbd:0.4,  cbn:0.1, thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:4.6,caryophyllene:3.4,linalool:1.2,limonene:0.9,pinene:0.5,terpinolene:0.2,ocimene:0.1,nerolidol:0.2, farnesene:0,   bisabolol:0.15,terpineol:0.3,humulene:1.0,valencene:0,   geraniol:0}},
  { id:85, name:"Sativa Sauce",          brand:"Moxie",                  tier:3, format:"live_resin",      strainType:"sativa",  soilType:"indoor",              thcEquiv:19, cbd:0.3,  cbn:0,   thcv:0.1,   cbg:0,   cbc:0,   terpenes:{myrcene:0.5,caryophyllene:0.4,linalool:0.2,limonene:3.2,pinene:1.2,terpinolene:3.8,ocimene:1.6,nerolidol:0,   farnesene:0.25,bisabolol:0,    terpineol:0,   humulene:0.1,valencene:0.2,geraniol:0.08}},
  // ── LIVE RESIN — BEEZLE (additional) ──
  { id:86, name:"Sativa Sauce (Haze)",   brand:"Beezle Brands",          tier:3, format:"live_resin",      strainType:"sativa",  soilType:"indoor",              thcEquiv:19, cbd:0.3,  cbn:0,   thcv:0.1,   cbg:0,   cbc:0,   terpenes:{myrcene:0.5,caryophyllene:0.5,linalool:0.2,limonene:2.6,pinene:1.2,terpinolene:3.8,ocimene:1.6,nerolidol:0,   farnesene:0.2, bisabolol:0,    terpineol:0,   humulene:0.1,valencene:0.15,geraniol:0.06}},
  // ── LIVE RESIN — JETTY (additional) ──
  // ── EDIBLES — PLUS PRODUCTS ──
  { id:89, name:"Sour Watermelon",       brand:"PLUS Products",          tier:1, format:"edible",      strainType:"sativa",      soilType:"any",                 thcEquiv:10, cbd:0,    cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.2,caryophyllene:0.3,linalool:0.1,limonene:0.8,pinene:0,terpinolene:0,ocimene:0,nerolidol:0,farnesene:0,bisabolol:0,terpineol:0,humulene:0,valencene:0,geraniol:0}},
  { id:90, name:"Calm Gummies",          brand:"PLUS Products",          tier:1, format:"edible",      strainType:"hybrid",      soilType:"any",                 thcEquiv:11, cbd:0,    cbn:0.3, thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.5,caryophyllene:0.3,linalool:0.6,limonene:0.1,pinene:0,terpinolene:0,ocimene:0,nerolidol:0,farnesene:0,bisabolol:0,terpineol:0,humulene:0,valencene:0,geraniol:0}},
  // ── EDIBLES — KANHA ──
  { id:91, name:"Tranquil Mint",         brand:"Kanha",                  tier:1, format:"edible",      strainType:"hybrid",      soilType:"any",                 thcEquiv:10, cbd:0,    cbn:0.4, thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.6,caryophyllene:0.3,linalool:0.7,limonene:0.1,pinene:0,terpinolene:0,ocimene:0,nerolidol:0,farnesene:0,bisabolol:0,terpineol:0,humulene:0,valencene:0,geraniol:0}},
  { id:92, name:"CBD Nano Gummies",      brand:"Kanha",                  tier:1, format:"edible",      strainType:"hybrid",      soilType:"any",                 thcEquiv:5,  cbd:25,   cbn:0,   thcv:0,   cbg:0.2,   cbc:0,   terpenes:{myrcene:0.4,caryophyllene:0.6,linalool:0.4,limonene:0.2,pinene:0,terpinolene:0,ocimene:0,nerolidol:0,farnesene:0,bisabolol:0,terpineol:0,humulene:0,valencene:0,geraniol:0}},
  // ── EDIBLES — KIVA (additional) ──
  { id:93, name:"Dark Chocolate Bar",    brand:"Kiva",                   tier:1, format:"edible",      strainType:"indica",      soilType:"any",                 thcEquiv:15, cbd:0,    cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.5,caryophyllene:0.4,linalool:0.2,limonene:0.3,pinene:0,terpinolene:0,ocimene:0,nerolidol:0,farnesene:0,bisabolol:0,terpineol:0,humulene:0,valencene:0,geraniol:0}},
  // ── MEDICAL — CARE BY DESIGN (expanded ratios) ──
  { id:94, name:"4:1 CBD Tincture",      brand:"Care By Design",         tier:2, format:"rso",      strainType:"hybrid",         soilType:"any",                 thcEquiv:8,  cbd:32,   cbn:0,   thcv:0,   cbg:0.1,   cbc:0,   terpenes:{myrcene:0.8,caryophyllene:1.0,linalool:0.6,limonene:0.4,pinene:0.15,terpinolene:0,ocimene:0,nerolidol:0,farnesene:0,bisabolol:0,terpineol:0,humulene:0.2,valencene:0,geraniol:0}},
  { id:95, name:"8:1 CBD Tincture",      brand:"Care By Design",         tier:2, format:"rso",      strainType:"hybrid",         soilType:"any",                 thcEquiv:5,  cbd:40,   cbn:0,   thcv:0,   cbg:0.1,   cbc:0,   terpenes:{myrcene:0.6,caryophyllene:1.2,linalool:0.8,limonene:0.3,pinene:0.12,terpinolene:0,ocimene:0,nerolidol:0,farnesene:0,bisabolol:0,terpineol:0,humulene:0.2,valencene:0,geraniol:0}},
  // ── MEDICAL — LEVEL BLENDS (CBG / CBC isolates) ──
  // ── MEDICAL — PAPA & BARKLEY (additional) ──
  { id:98, name:"Releaf Tincture 1:3",   brand:"Papa & Barkley",         tier:2, format:"rso",      strainType:"indica",         soilType:"greenhouse",          thcEquiv:18, cbd:6,    cbn:0.3, thcv:0,   cbg:0.2,   cbc:0.1,   terpenes:{myrcene:2.4,caryophyllene:2.2,linalool:1.0,limonene:0.9,pinene:0.5,terpinolene:0.1,ocimene:0.1,nerolidol:0.3, farnesene:0,bisabolol:0.4,terpineol:0.3,humulene:0.5,valencene:0,geraniol:0}},
  { id:99, name:"Releaf Patch",          brand:"Papa & Barkley",         tier:2, format:"topical",      strainType:"indica",     soilType:"greenhouse",          thcEquiv:6,  cbd:30,   cbn:0.4, thcv:0,   cbg:0.15,   cbc:0.1,   terpenes:{myrcene:1.4,caryophyllene:2.6,linalool:1.2,limonene:0.4,pinene:0.3,terpinolene:0,ocimene:0.08,nerolidol:0.4,farnesene:0,bisabolol:0.7,terpineol:0.2,humulene:0.4,valencene:0,geraniol:0}},
  { id:100,name:"Solventless Rosin (OG)","brand":"Woodstocks",           tier:4, format:"solventless",      strainType:"indica", soilType:"indoor",              thcEquiv:22, cbd:0.4,  cbn:0.1, thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:4.6,caryophyllene:3.6,linalool:1.8,limonene:1.0,pinene:0.6,terpinolene:0.2,ocimene:0.1,nerolidol:0.3, farnesene:0,   bisabolol:0.3, terpineol:0.4,humulene:1.0,valencene:0,   geraniol:0}},

  // ══════════════════════════════════════════════
  // NECTAR MANTECA EXPANSION — FLOWER
  // ══════════════════════════════════════════════

  // ── ASTER ──
  { id:101, name:"Governmint Oasis",     brand:"Aster",                  tier:3, format:"flower",      strainType:"hybrid",      soilType:"indoor",              thcEquiv:23, cbd:0.05, cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.46,caryophyllene:0.42,linalool:0.58,limonene:0.18,pinene:0.10,terpinolene:0.06,ocimene:0.04,nerolidol:0.05,farnesene:0,   bisabolol:0.08,terpineol:0.12,humulene:0.14,valencene:0,   geraniol:0}},

  // ── BAGGIE BUDS ──
  { id:102, name:"Tangie",               brand:"Baggie Buds",             tier:2, format:"flower",      strainType:"sativa",      soilType:"greenhouse",          thcEquiv:24, cbd:0.15, cbn:0,   thcv:0.1,   cbg:0,   cbc:0,   terpenes:{myrcene:0.12,caryophyllene:0.14,linalool:0.05,limonene:0.64,pinene:0.18,terpinolene:0.44,ocimene:0.28,nerolidol:0,   farnesene:0.06,bisabolol:0,    terpineol:0.04,humulene:0.04,valencene:0.08,geraniol:0.04}},

  // ── CED ──
  { id:103, name:"Gelato",               brand:"CED",                     tier:1, format:"flower",      strainType:"indica",      soilType:"indoor",              thcEquiv:23, cbd:0.18, cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.36,caryophyllene:0.28,linalool:0.22,limonene:0.32,pinene:0.06,terpinolene:0.06,ocimene:0.04,nerolidol:0,   farnesene:0,   bisabolol:0.04,terpineol:0.04,humulene:0.08,valencene:0.02,geraniol:0}},
  { id:104, name:"Gorilla Glue #4",      brand:"CED",                     tier:1, format:"flower",      strainType:"sativa",      soilType:"indoor",              thcEquiv:18, cbd:0.04, cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.38,caryophyllene:0.44,linalool:0.06,limonene:0.26,pinene:0.08,terpinolene:0.10,ocimene:0.04,nerolidol:0,   farnesene:0,   bisabolol:0.03,terpineol:0.04,humulene:0.18,valencene:0,   geraniol:0}},
  { id:105, name:"Legend OG",            brand:"CED",                     tier:1, format:"flower",      strainType:"indica",      soilType:"indoor",              thcEquiv:15, cbd:0.20, cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.52,caryophyllene:0.38,linalool:0.12,limonene:0.22,pinene:0.10,terpinolene:0.04,ocimene:0.02,nerolidol:0,   farnesene:0,   bisabolol:0.03,terpineol:0.06,humulene:0.14,valencene:0,   geraniol:0}},
  { id:106, name:"Headmount",            brand:"CED",                     tier:1, format:"flower",      strainType:"indica",      soilType:"indoor",              thcEquiv:31, cbd:0.04, cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.40,caryophyllene:0.36,linalool:0.14,limonene:0.30,pinene:0.08,terpinolene:0.12,ocimene:0.06,nerolidol:0,   farnesene:0,   bisabolol:0.03,terpineol:0.04,humulene:0.10,valencene:0.02,geraniol:0}},

  // ── DELIGHTED ──
  { id:107, name:"Traffic Stopper",      brand:"Delighted",               tier:3, format:"flower",      strainType:"hybrid",      soilType:"indoor",              thcEquiv:32, cbd:0.05, cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.44,caryophyllene:0.38,linalool:0.16,limonene:0.38,pinene:0.08,terpinolene:0.14,ocimene:0.08,nerolidol:0,   farnesene:0,   bisabolol:0.04,terpineol:0.05,humulene:0.10,valencene:0.03,geraniol:0}},

  // ── MAVEN GENETICS ──
  { id:108, name:"French Lotus",         brand:"Maven Genetics",          tier:4, format:"flower",      strainType:"sativa",      soilType:"indoor",              thcEquiv:27, cbd:0.19, cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.34,caryophyllene:0.30,linalool:0.28,limonene:0.48,pinene:0.08,terpinolene:0.16,ocimene:0.10,nerolidol:0,   farnesene:0,   bisabolol:0.06,terpineol:0.06,humulene:0.08,valencene:0.04,geraniol:0}},

  // ── MOUNTAIN SCRATCH ──
  { id:109, name:"Bolo Runtz",           brand:"Mountain Scratch",        tier:2, format:"flower",      strainType:"indica",      soilType:"indoor",              thcEquiv:24, cbd:0.05, cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.40,caryophyllene:0.30,linalool:0.22,limonene:0.40,pinene:0.06,terpinolene:0.08,ocimene:0.04,nerolidol:0,   farnesene:0,   bisabolol:0.04,terpineol:0.04,humulene:0.08,valencene:0.03,geraniol:0}},
  { id:110, name:"Gelato 33",            brand:"Mountain Scratch",        tier:2, format:"flower",      strainType:"indica",      soilType:"indoor",              thcEquiv:20, cbd:0.05, cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.42,caryophyllene:0.32,linalool:0.26,limonene:0.34,pinene:0.06,terpinolene:0.06,ocimene:0.04,nerolidol:0,   farnesene:0,   bisabolol:0.05,terpineol:0.05,humulene:0.08,valencene:0.02,geraniol:0}},
  { id:111, name:"Gelato Twist",         brand:"Mountain Scratch",        tier:2, format:"flower",      strainType:"hybrid",      soilType:"indoor",              thcEquiv:25, cbd:0.05, cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.38,caryophyllene:0.34,linalool:0.24,limonene:0.36,pinene:0.06,terpinolene:0.08,ocimene:0.04,nerolidol:0,   farnesene:0,   bisabolol:0.04,terpineol:0.05,humulene:0.08,valencene:0.02,geraniol:0}},

  // ── NORTHERN HARVEST ──
  { id:112, name:"Berry Pie",            brand:"Northern Harvest",        tier:2, format:"flower",      strainType:"indica",      soilType:"greenhouse",          thcEquiv:20, cbd:0.08, cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.50,caryophyllene:0.28,linalool:0.18,limonene:0.26,pinene:0.08,terpinolene:0.06,ocimene:0.04,nerolidol:0.04,farnesene:0.06,bisabolol:0.04,terpineol:0.06,humulene:0.08,valencene:0,   geraniol:0}},

  // ── PURE BEAUTY ──
  { id:113, name:"Mango Mintality",      brand:"Pure Beauty",             tier:4, format:"flower",      strainType:"sativa",      soilType:"indoor",              thcEquiv:29, cbd:0.05, cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.54,caryophyllene:0.22,linalool:0.12,limonene:0.42,pinene:0.10,terpinolene:0.26,ocimene:0.14,nerolidol:0,   farnesene:0.06,bisabolol:0.03,terpineol:0.06,humulene:0.06,valencene:0.04,geraniol:0.03}},
  { id:114, name:"Strawberries & Durban",brand:"Pure Beauty",             tier:4, format:"flower",      strainType:"sativa",      soilType:"indoor",              thcEquiv:22, cbd:0.06, cbn:0,   thcv:0.18,   cbg:0,   cbc:0,   terpenes:{myrcene:0.10,caryophyllene:0.14,linalool:0.06,limonene:0.26,pinene:0.30,terpinolene:0.66,ocimene:0.28,nerolidol:0,   farnesene:0.10,bisabolol:0,    terpineol:0.04,humulene:0.04,valencene:0.05,geraniol:0.03}},

  // ── SMOKE-RITE ──
  { id:115, name:"Kush",                 brand:"Smoke-Rite",              tier:2, format:"flower",      strainType:"indica",      soilType:"indoor",              thcEquiv:28, cbd:0.05, cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.60,caryophyllene:0.44,linalool:0.18,limonene:0.16,pinene:0.10,terpinolene:0.04,ocimene:0.02,nerolidol:0,   farnesene:0,   bisabolol:0.03,terpineol:0.08,humulene:0.16,valencene:0,   geraniol:0}},
  { id:116, name:"Iced Gelato",          brand:"Smoke-Rite",              tier:2, format:"flower",      strainType:"indica",      soilType:"indoor",              thcEquiv:24, cbd:0.05, cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.42,caryophyllene:0.32,linalool:0.24,limonene:0.34,pinene:0.06,terpinolene:0.06,ocimene:0.03,nerolidol:0,   farnesene:0,   bisabolol:0.04,terpineol:0.04,humulene:0.08,valencene:0.02,geraniol:0}},
  { id:117, name:"Obama Runtz",          brand:"Smoke-Rite",              tier:2, format:"flower",      strainType:"hybrid",      soilType:"indoor",              thcEquiv:20, cbd:0.05, cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.38,caryophyllene:0.28,linalool:0.20,limonene:0.38,pinene:0.06,terpinolene:0.08,ocimene:0.04,nerolidol:0,   farnesene:0,   bisabolol:0.04,terpineol:0.04,humulene:0.08,valencene:0.02,geraniol:0}},
  { id:118, name:"Lemon Cherry Gelato",  brand:"Smoke-Rite",              tier:2, format:"flower",      strainType:"sativa",      soilType:"indoor",              thcEquiv:21, cbd:0.05, cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.30,caryophyllene:0.26,linalool:0.16,limonene:0.58,pinene:0.06,terpinolene:0.14,ocimene:0.08,nerolidol:0,   farnesene:0,   bisabolol:0.03,terpineol:0.04,humulene:0.08,valencene:0.04,geraniol:0}},
  { id:119, name:"Jealousy",             brand:"Smoke-Rite",              tier:2, format:"flower",      strainType:"hybrid",      soilType:"indoor",              thcEquiv:20, cbd:0.05, cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.44,caryophyllene:0.40,linalool:0.14,limonene:0.32,pinene:0.07,terpinolene:0.06,ocimene:0.03,nerolidol:0,   farnesene:0,   bisabolol:0.03,terpineol:0.05,humulene:0.12,valencene:0.02,geraniol:0}},
  { id:120, name:"Lilac Mintz",          brand:"Smoke-Rite",              tier:2, format:"flower",      strainType:"hybrid",      soilType:"indoor",              thcEquiv:27, cbd:0.05, cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.28,caryophyllene:0.36,linalool:0.48,limonene:0.30,pinene:0.07,terpinolene:0.06,ocimene:0.03,nerolidol:0,   farnesene:0,   bisabolol:0.06,terpineol:0.10,humulene:0.10,valencene:0.02,geraniol:0}},
  { id:121, name:"GMO",                  brand:"Smoke-Rite",              tier:2, format:"flower",      strainType:"indica",      soilType:"indoor",              thcEquiv:21, cbd:0.05, cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.36,caryophyllene:0.62,linalool:0.08,limonene:0.18,pinene:0.06,terpinolene:0.04,ocimene:0.02,nerolidol:0,   farnesene:0,   bisabolol:0.02,terpineol:0.04,humulene:0.24,valencene:0,   geraniol:0}},

  // ── SUNSHINE ──
  { id:122, name:"Forbidden Lavender",   brand:"Sunshine",                tier:2, format:"flower",      strainType:"hybrid",      soilType:"greenhouse",          thcEquiv:18, cbd:0.08, cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.44,caryophyllene:0.28,linalool:0.62,limonene:0.12,pinene:0.06,terpinolene:0.04,ocimene:0.02,nerolidol:0.06,farnesene:0,   bisabolol:0.08,terpineol:0.10,humulene:0.08,valencene:0,   geraniol:0}},
  { id:123, name:"Gelato 41",            brand:"Sunshine",                tier:2, format:"flower",      strainType:"hybrid",      soilType:"greenhouse",          thcEquiv:22, cbd:0.05, cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.46,caryophyllene:0.34,linalool:0.26,limonene:0.32,pinene:0.06,terpinolene:0.08,ocimene:0.04,nerolidol:0,   farnesene:0,   bisabolol:0.04,terpineol:0.05,humulene:0.10,valencene:0.02,geraniol:0}},
  { id:124, name:"Mint Oasis",           brand:"Sunshine",                tier:2, format:"flower",      strainType:"indica",      soilType:"greenhouse",          thcEquiv:21, cbd:0.06, cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.40,caryophyllene:0.36,linalool:0.54,limonene:0.14,pinene:0.08,terpinolene:0.04,ocimene:0.03,nerolidol:0.04,farnesene:0,   bisabolol:0.06,terpineol:0.10,humulene:0.10,valencene:0,   geraniol:0}},
  { id:125, name:"Simple Syrup",         brand:"Sunshine",                tier:2, format:"flower",      strainType:"indica",      soilType:"greenhouse",          thcEquiv:20, cbd:0.06, cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.58,caryophyllene:0.30,linalool:0.24,limonene:0.14,pinene:0.06,terpinolene:0.04,ocimene:0.02,nerolidol:0.05,farnesene:0,   bisabolol:0.05,terpineol:0.08,humulene:0.10,valencene:0,   geraniol:0}},

  // ── WAVVY ──
  { id:126, name:"Gummiez",              brand:"Wavvy",                   tier:3, format:"flower",      strainType:"sativa",      soilType:"indoor",              thcEquiv:22, cbd:0.05, cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.42,caryophyllene:0.30,linalool:0.24,limonene:0.44,pinene:0.06,terpinolene:0.10,ocimene:0.06,nerolidol:0,   farnesene:0,   bisabolol:0.04,terpineol:0.04,humulene:0.08,valencene:0.03,geraniol:0}},
  { id:127, name:"Wavvy Runtz",          brand:"Wavvy",                   tier:3, format:"flower",      strainType:"sativa",      soilType:"indoor",              thcEquiv:23, cbd:0.05, cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.40,caryophyllene:0.28,linalool:0.22,limonene:0.46,pinene:0.06,terpinolene:0.10,ocimene:0.06,nerolidol:0,   farnesene:0,   bisabolol:0.04,terpineol:0.04,humulene:0.08,valencene:0.03,geraniol:0}},
  { id:128, name:"Black Runtz",          brand:"Wavvy",                   tier:3, format:"preroll",      strainType:"hybrid",     soilType:"indoor",              thcEquiv:22, cbd:0.05, cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.44,caryophyllene:0.30,linalool:0.20,limonene:0.42,pinene:0.06,terpinolene:0.08,ocimene:0.05,nerolidol:0,   farnesene:0,   bisabolol:0.04,terpineol:0.04,humulene:0.08,valencene:0.02,geraniol:0}},

  // ── WEST COAST CURE ──
  { id:129, name:"Headstash",            brand:"West Coast Cure",         tier:4, format:"flower",      strainType:"indica",      soilType:"indoor",              thcEquiv:29, cbd:0.04, cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.56,caryophyllene:0.44,linalool:0.14,limonene:0.26,pinene:0.08,terpinolene:0.06,ocimene:0.03,nerolidol:0,   farnesene:0,   bisabolol:0.03,terpineol:0.06,humulene:0.16,valencene:0,   geraniol:0}},
  { id:130, name:"GMO (WCC)",            brand:"West Coast Cure",         tier:4, format:"preroll",      strainType:"hybrid",     soilType:"indoor",              thcEquiv:26, cbd:0.07, cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.38,caryophyllene:0.64,linalool:0.08,limonene:0.16,pinene:0.06,terpinolene:0.04,ocimene:0.02,nerolidol:0,   farnesene:0,   bisabolol:0.02,terpineol:0.04,humulene:0.22,valencene:0,   geraniol:0}},
  { id:131, name:"Tangie (WCC)",         brand:"West Coast Cure",         tier:4, format:"preroll",      strainType:"sativa",     soilType:"indoor",              thcEquiv:23, cbd:0.05, cbn:0,   thcv:0.1,   cbg:0,   cbc:0,   terpenes:{myrcene:0.12,caryophyllene:0.14,linalool:0.05,limonene:0.62,pinene:0.18,terpinolene:0.42,ocimene:0.22,nerolidol:0,   farnesene:0.06,bisabolol:0,    terpineol:0.04,humulene:0.04,valencene:0.08,geraniol:0.04}},

  // ── YADA YADA (budget ground) ──
  { id:132, name:"Bob Hope Ground",      brand:"Yada Yada",               tier:1, format:"flower",      strainType:"indica",      soilType:"greenhouse",          thcEquiv:16, cbd:0.06, cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.38,caryophyllene:0.28,linalool:0.14,limonene:0.22,pinene:0.08,terpinolene:0.06,ocimene:0.03,nerolidol:0,   farnesene:0,   bisabolol:0.02,terpineol:0.04,humulene:0.10,valencene:0,   geraniol:0}},

  // ══════════════════════════════════════════════
  // VAPORIZERS
  // ══════════════════════════════════════════════

  // ── BUDDIES — Live Resin (LR) Tier 3, Cure Resin (CR) Tier 2 ──
  { id:133, name:"Afghan OG Lemon LR",   brand:"Buddies",                 tier:3, format:"live_resin",      strainType:"indica",  soilType:"indoor",              thcEquiv:19, cbd:0.13, cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:2.8,caryophyllene:2.0,linalool:0.8,limonene:3.4,pinene:0.8,terpinolene:0.3,ocimene:0.1,nerolidol:0,   farnesene:0,   bisabolol:0.2, terpineol:0.3,humulene:0.6,valencene:0.2,geraniol:0.08}},
  { id:134, name:"Cannalope Haze CR",    brand:"Buddies",                 tier:2, format:"live_resin",      strainType:"sativa",  soilType:"greenhouse",          thcEquiv:19, cbd:0.15, cbn:0,   thcv:0.12,   cbg:0,   cbc:0,   terpenes:{myrcene:0.6,caryophyllene:0.5,linalool:0.2,limonene:2.4,pinene:0.8,terpinolene:3.8,ocimene:1.6,nerolidol:0,   farnesene:0.2, bisabolol:0,    terpineol:0,   humulene:0.1,valencene:0.14,geraniol:0.05}},
  { id:135, name:"Ice Cream Man LR",     brand:"Buddies",                 tier:3, format:"live_resin",      strainType:"indica",  soilType:"indoor",              thcEquiv:21, cbd:0.21, cbn:0.1, thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:4.2,caryophyllene:2.4,linalool:1.6,limonene:1.0,pinene:0.4,terpinolene:0.2,ocimene:0.1,nerolidol:0.3, farnesene:0,   bisabolol:0.2, terpineol:0.3,humulene:0.7,valencene:0,   geraniol:0}},
  { id:136, name:"Crossbow CR",          brand:"Buddies",                 tier:2, format:"live_resin",      strainType:"sativa",  soilType:"greenhouse",          thcEquiv:20, cbd:0.15, cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.8,caryophyllene:0.6,linalool:0.3,limonene:2.0,pinene:0.8,terpinolene:2.6,ocimene:1.2,nerolidol:0,   farnesene:0.2, bisabolol:0,    terpineol:0,   humulene:0.1,valencene:0.1,geraniol:0.04}},

  // ── FLOW — Distillate Tier 1 ──
  { id:137, name:"Forbidden Fruit Dist", brand:"Flow",                    tier:1, format:"co2_extract",      strainType:"hybrid", soilType:"any",                 thcEquiv:22, cbd:2,    cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.8,caryophyllene:0.4,linalool:0.3,limonene:0.3,pinene:0,terpinolene:0,ocimene:0,nerolidol:0,farnesene:0,bisabolol:0,terpineol:0,humulene:0,valencene:0,geraniol:0}},
  { id:138, name:"Pineapple Express Dist",brand:"Flow",                   tier:1, format:"co2_extract",      strainType:"sativa", soilType:"any",                 thcEquiv:22, cbd:2,    cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.5,caryophyllene:0.3,linalool:0.1,limonene:0.5,pinene:0.1,terpinolene:0.3,ocimene:0.1,nerolidol:0,farnesene:0,bisabolol:0,terpineol:0,humulene:0,valencene:0,geraniol:0}},
  { id:139, name:"Mimosa Dist",          brand:"Flow",                    tier:1, format:"co2_extract",      strainType:"sativa", soilType:"any",                 thcEquiv:22, cbd:2,    cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.4,caryophyllene:0.2,linalool:0.1,limonene:0.7,pinene:0.05,terpinolene:0.2,ocimene:0.1,nerolidol:0,farnesene:0,bisabolol:0,terpineol:0,humulene:0,valencene:0,geraniol:0}},

  // ── GLOBS — Live Resin Tier 3 ──
  { id:140, name:"Hella Grapes LR",      brand:"Globs",                   tier:3, format:"live_resin",      strainType:"indica",  soilType:"indoor",              thcEquiv:21, cbd:0.10, cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:4.0,caryophyllene:2.2,linalool:1.4,limonene:0.8,pinene:0.4,terpinolene:0.2,ocimene:0.1,nerolidol:0.3, farnesene:0,   bisabolol:0.2, terpineol:0.3,humulene:0.6,valencene:0,   geraniol:0}},
  { id:141, name:"Sweet-N-Sour Diesel",  brand:"Globs",                   tier:3, format:"live_resin",      strainType:"sativa",  soilType:"indoor",              thcEquiv:20, cbd:0.16, cbn:0,   thcv:0.1,   cbg:0,   cbc:0,   terpenes:{myrcene:0.6,caryophyllene:0.5,linalool:0.2,limonene:2.8,pinene:1.0,terpinolene:3.2,ocimene:1.4,nerolidol:0,   farnesene:0.2, bisabolol:0,    terpineol:0,   humulene:0.1,valencene:0.15,geraniol:0.06}},

  // ── HANABI — Live Resin Diamond Tier 3 ──
  { id:142, name:"Jack Herer LR Diamond",brand:"Hanabi",                  tier:3, format:"live_resin",      strainType:"sativa",  soilType:"indoor",              thcEquiv:20, cbd:2,    cbn:0,   thcv:0.12,   cbg:0,   cbc:0,   terpenes:{myrcene:0.4,caryophyllene:0.5,linalool:0.2,limonene:1.6,pinene:1.2,terpinolene:2.4,ocimene:1.0,nerolidol:0,   farnesene:0.1, bisabolol:0,    terpineol:0,   humulene:0.1,valencene:0.1,geraniol:0.04}},
  { id:143, name:"Mimosa LR Diamond",    brand:"Hanabi",                  tier:3, format:"live_resin",      strainType:"sativa",  soilType:"indoor",              thcEquiv:21, cbd:2,    cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.5,caryophyllene:0.4,linalool:0.2,limonene:2.2,pinene:0.4,terpinolene:0.8,ocimene:0.4,nerolidol:0,   farnesene:0,   bisabolol:0,    terpineol:0,   humulene:0.1,valencene:0.1,geraniol:0.04}},

  // ── HIGH RISE — Distillate Tier 1 ──
  { id:144, name:"Maui Dist",            brand:"High Rise",               tier:1, format:"co2_extract",      strainType:"sativa", soilType:"any",                 thcEquiv:21, cbd:0.17, cbn:0,   thcv:0.1,   cbg:0,   cbc:0,   terpenes:{myrcene:0.4,caryophyllene:0.2,linalool:0.1,limonene:0.4,pinene:0.1,terpinolene:0.5,ocimene:0.2,nerolidol:0,farnesene:0,bisabolol:0,terpineol:0,humulene:0,valencene:0,geraniol:0}},

  // ── HIMALAYA — LR Tier 3, CR Tier 2 ──
  { id:145, name:"Animal Mintz CR",      brand:"Himalaya",                tier:2, format:"live_resin",      strainType:"indica",  soilType:"indoor",              thcEquiv:21, cbd:0.21, cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.5,caryophyllene:0.5,linalool:0.4,limonene:0.4,pinene:0.08,terpinolene:0.06,ocimene:0.03,nerolidol:0,   farnesene:0,   bisabolol:0.05,terpineol:0.06,humulene:0.08,valencene:0,   geraniol:0}},
  { id:146, name:"Crushmintz LR",        brand:"Himalaya",                tier:3, format:"live_resin",      strainType:"indica",  soilType:"indoor",              thcEquiv:21, cbd:0.22, cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:1.2,caryophyllene:1.4,linalool:1.8,limonene:0.6,pinene:0.2,terpinolene:0.1,ocimene:0.05,nerolidol:0.2, farnesene:0,   bisabolol:0.2, terpineol:0.4,humulene:0.3,valencene:0,   geraniol:0}},
  { id:147, name:"Super Grape Haze LR",  brand:"Himalaya",                tier:3, format:"live_resin",      strainType:"sativa",  soilType:"indoor",              thcEquiv:20, cbd:0.42, cbn:0,   thcv:0.1,   cbg:0,   cbc:0,   terpenes:{myrcene:0.5,caryophyllene:0.4,linalool:0.2,limonene:1.4,pinene:0.6,terpinolene:2.8,ocimene:1.2,nerolidol:0,   farnesene:0.2, bisabolol:0,    terpineol:0,   humulene:0.08,valencene:0.12,geraniol:0.04}},
  { id:148, name:"Sour Strawberry Rosin",brand:"Himalaya",                tier:4, format:"solventless",      strainType:"sativa", soilType:"indoor",              thcEquiv:21, cbd:0.2,  cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:1.4,caryophyllene:1.8,linalool:0.4,limonene:3.2,pinene:0.6,terpinolene:1.0,ocimene:0.4,nerolidol:0,   farnesene:0.1, bisabolol:0.1, terpineol:0.1,humulene:0.3,valencene:0.1,geraniol:0.04}},

  // ── MICRO BAR — Distillate Tier 1 ──
  { id:149, name:"Blueberry Kush Dist",  brand:"Micro Bar",               tier:1, format:"co2_extract",      strainType:"indica", soilType:"any",                 thcEquiv:21, cbd:0.05, cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.7,caryophyllene:0.3,linalool:0.3,limonene:0.2,pinene:0,terpinolene:0,ocimene:0,nerolidol:0,farnesene:0,bisabolol:0,terpineol:0,humulene:0,valencene:0,geraniol:0}},

  // ── PAX — Tier 2 (Distillate pods) ──
  { id:150, name:"Mango Crack Pod",      brand:"PAX",                     tier:2, format:"co2_extract",      strainType:"hybrid", soilType:"any",                 thcEquiv:20, cbd:0.19, cbn:0,   thcv:0.1,   cbg:0,   cbc:0,   terpenes:{myrcene:0.5,caryophyllene:0.2,linalool:0.1,limonene:0.6,pinene:0.1,terpinolene:0.5,ocimene:0.2,nerolidol:0,farnesene:0,bisabolol:0,terpineol:0,humulene:0,valencene:0,geraniol:0}},
  { id:151, name:"Blue Zushi Pod",       brand:"PAX",                     tier:2, format:"co2_extract",      strainType:"hybrid", soilType:"any",                 thcEquiv:20, cbd:0.05, cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.5,caryophyllene:0.3,linalool:0.3,limonene:0.4,pinene:0.06,terpinolene:0.08,ocimene:0.04,nerolidol:0,farnesene:0,bisabolol:0,terpineol:0,humulene:0,valencene:0,geraniol:0}},

  // ── PLUG PLAY — Distillate Tier 1 ──
  { id:152, name:"Fire OG Pod",          brand:"Plug Play",               tier:1, format:"co2_extract",      strainType:"hybrid", soilType:"any",                 thcEquiv:20, cbd:0.24, cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.6,caryophyllene:0.4,linalool:0.2,limonene:0.3,pinene:0.1,terpinolene:0.04,ocimene:0.02,nerolidol:0,farnesene:0,bisabolol:0,terpineol:0,humulene:0.1,valencene:0,geraniol:0}},
  { id:153, name:"Paradise Punch Pod",   brand:"Plug Play",               tier:1, format:"co2_extract",      strainType:"hybrid", soilType:"any",                 thcEquiv:20, cbd:0.05, cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.4,caryophyllene:0.2,linalool:0.1,limonene:0.5,pinene:0.05,terpinolene:0.2,ocimene:0.1,nerolidol:0,farnesene:0,bisabolol:0,terpineol:0,humulene:0,valencene:0,geraniol:0}},

  // ── SURPLUS — Distillate Tier 1 ──
  { id:154, name:"King Louie Dist",      brand:"Surplus",                 tier:1, format:"co2_extract",      strainType:"indica", soilType:"any",                 thcEquiv:21, cbd:0.27, cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.7,caryophyllene:0.3,linalool:0.2,limonene:0.2,pinene:0.05,terpinolene:0.04,ocimene:0.02,nerolidol:0,farnesene:0,bisabolol:0,terpineol:0,humulene:0.1,valencene:0,geraniol:0}},
  { id:155, name:"Trainwreck Dist",      brand:"Surplus",                 tier:1, format:"co2_extract",      strainType:"sativa", soilType:"any",                 thcEquiv:21, cbd:0.54, cbn:0,   thcv:0.1,   cbg:0,   cbc:0,   terpenes:{myrcene:0.3,caryophyllene:0.2,linalool:0.1,limonene:0.4,pinene:0.3,terpinolene:0.7,ocimene:0.3,nerolidol:0,farnesene:0.1,bisabolol:0,terpineol:0,humulene:0,valencene:0,geraniol:0}},
  { id:156, name:"Purple Lemonade Dist", brand:"Surplus",                 tier:1, format:"co2_extract",      strainType:"hybrid", soilType:"any",                 thcEquiv:21, cbd:0.22, cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.5,caryophyllene:0.2,linalool:0.3,limonene:0.5,pinene:0.05,terpinolene:0.1,ocimene:0.06,nerolidol:0,farnesene:0,bisabolol:0,terpineol:0,humulene:0,valencene:0,geraniol:0}},

  // ── TIMELESS — LR Noir Tier 3, Distillate Tier 1 ──
  { id:157, name:"Ace of Spades LR",     brand:"Timeless",                tier:3, format:"live_resin",      strainType:"sativa",  soilType:"indoor",              thcEquiv:20, cbd:0.53, cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:3.8,caryophyllene:2.6,linalool:0.8,limonene:1.4,pinene:0.4,terpinolene:0.2,ocimene:0.1,nerolidol:0.2, farnesene:0,   bisabolol:0.2, terpineol:0.3,humulene:0.7,valencene:0,   geraniol:0}},
  { id:158, name:"Deadhead OG LR",       brand:"Timeless",                tier:3, format:"live_resin",      strainType:"indica",  soilType:"indoor",              thcEquiv:20, cbd:0.51, cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:4.0,caryophyllene:3.0,linalool:0.6,limonene:1.2,pinene:0.5,terpinolene:0.2,ocimene:0.1,nerolidol:0,   farnesene:0,   bisabolol:0.2, terpineol:0.3,humulene:1.0,valencene:0,   geraniol:0}},
  { id:159, name:"Maui Wowie Dist",      brand:"Timeless",                tier:1, format:"co2_extract",      strainType:"sativa", soilType:"any",                 thcEquiv:20, cbd:0.47, cbn:0,   thcv:0.1,   cbg:0,   cbc:0,   terpenes:{myrcene:0.4,caryophyllene:0.2,linalool:0.1,limonene:0.4,pinene:0.2,terpinolene:0.6,ocimene:0.2,nerolidol:0,farnesene:0,bisabolol:0,terpineol:0,humulene:0,valencene:0,geraniol:0}},
  { id:160, name:"Peach Dreams Dist",    brand:"Timeless",                tier:1, format:"co2_extract",      strainType:"hybrid", soilType:"any",                 thcEquiv:20, cbd:0.39, cbn:0,   thcv:0.1,   cbg:0,   cbc:0,   terpenes:{myrcene:0.5,caryophyllene:0.2,linalool:0.2,limonene:0.5,pinene:0.1,terpinolene:0.3,ocimene:0.1,nerolidol:0,farnesene:0,bisabolol:0,terpineol:0,humulene:0,valencene:0,geraniol:0}},

  // ── CLSICS — Live Rosin Cart Tier 4 ──
  { id:161, name:"Watermelon Haze Rosin",brand:"CLSICS",                  tier:4, format:"solventless",      strainType:"sativa", soilType:"indoor",              thcEquiv:19, cbd:0.09, cbn:0,   thcv:0.1,   cbg:0,   cbc:0,   terpenes:{myrcene:0.5,caryophyllene:0.5,linalool:0.2,limonene:1.4,pinene:0.6,terpinolene:2.8,ocimene:1.2,nerolidol:0,   farnesene:0.1, bisabolol:0,    terpineol:0,   humulene:0.1,valencene:0.1,geraniol:0.04}},
  { id:162, name:"Clockwork Lemon Rosin",brand:"CLSICS",                  tier:4, format:"solventless",      strainType:"sativa", soilType:"indoor",              thcEquiv:19, cbd:0.42, cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.6,caryophyllene:0.5,linalool:0.2,limonene:2.2,pinene:0.5,terpinolene:1.4,ocimene:0.6,nerolidol:0,   farnesene:0.1, bisabolol:0,    terpineol:0,   humulene:0.1,valencene:0.08,geraniol:0.04}},

  // ══════════════════════════════════════════════
  // CONCENTRATES (DAB)
  // ══════════════════════════════════════════════

  // ── ASTRONAUTS — Solvent-based sugar/badder Tier 2 ──
  { id:163, name:"Cherry Rush Sugar",    brand:"Astronauts",              tier:2, format:"live_resin",      strainType:"sativa",  soilType:"indoor",              thcEquiv:21, cbd:0.08, cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:1.4,caryophyllene:2.2,linalool:0.4,limonene:2.0,pinene:0.4,terpinolene:0.4,ocimene:0.2,nerolidol:0,   farnesene:0.1, bisabolol:0.1, terpineol:0.1,humulene:0.4,valencene:0.1,geraniol:0}},
  { id:164, name:"Purple Gluelato Sugar",brand:"Astronauts",              tier:2, format:"live_resin",      strainType:"hybrid",  soilType:"indoor",              thcEquiv:21, cbd:0.10, cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:3.0,caryophyllene:2.0,linalool:1.0,limonene:1.2,pinene:0.3,terpinolene:0.2,ocimene:0.1,nerolidol:0,   farnesene:0,   bisabolol:0.1, terpineol:0.2,humulene:0.4,valencene:0,   geraniol:0}},

  // ── COWBOY'S RESERVE — Hash Rosin Tier 4 ──
  { id:165, name:"Donny Burger Rosin",   brand:"Cowboy's Reserve",        tier:4, format:"solventless",      strainType:"indica", soilType:"indoor",              thcEquiv:21, cbd:0.31, cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:3.8,caryophyllene:5.2,linalool:0.6,limonene:0.8,pinene:0.3,terpinolene:0.1,ocimene:0.05,nerolidol:0,   farnesene:0,   bisabolol:0.1, terpineol:0.2,humulene:1.8,valencene:0,   geraniol:0}},
  { id:166, name:"Frozen Banana Rosin",  brand:"Cowboy's Reserve",        tier:4, format:"solventless",      strainType:"indica", soilType:"indoor",              thcEquiv:20, cbd:0.31, cbn:0.1, thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:4.8,caryophyllene:2.4,linalool:1.4,limonene:1.4,pinene:0.3,terpinolene:0.1,ocimene:0.05,nerolidol:0.2, farnesene:0,   bisabolol:0.2, terpineol:0.4,humulene:0.6,valencene:0,   geraniol:0}},
  { id:167, name:"Sour Strawberry Rosin",brand:"Cowboy's Reserve",        tier:4, format:"solventless",      strainType:"sativa", soilType:"indoor",              thcEquiv:22, cbd:0.31, cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:1.4,caryophyllene:1.8,linalool:0.4,limonene:3.2,pinene:0.6,terpinolene:1.0,ocimene:0.4,nerolidol:0,   farnesene:0.1, bisabolol:0.1, terpineol:0.1,humulene:0.3,valencene:0.1,geraniol:0.04}},
  { id:168, name:"Rainbow Belts Rosin",  brand:"Cowboy's Reserve",        tier:4, format:"solventless",      strainType:"sativa", soilType:"indoor",              thcEquiv:21, cbd:0.21, cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:2.2,caryophyllene:2.0,linalool:0.8,limonene:2.4,pinene:0.3,terpinolene:0.4,ocimene:0.2,nerolidol:0,   farnesene:0,   bisabolol:0.1, terpineol:0.2,humulene:0.5,valencene:0.1,geraniol:0}},

  // ── GREENLINE — Diamond Dust (THCA) Tier 1 ──
  { id:169, name:"Gotti Beltz Diamonds", brand:"Greenline",               tier:1, format:"co2_extract",      strainType:"hybrid", soilType:"any",                 thcEquiv:23, cbd:0.05, cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.4,caryophyllene:0.3,linalool:0.2,limonene:0.3,pinene:0.05,terpinolene:0.06,ocimene:0.03,nerolidol:0,farnesene:0,bisabolol:0,terpineol:0,humulene:0.06,valencene:0,geraniol:0}},

  // ── PURE BEAUTY — Rosin Carts Tier 4 ──
  { id:170, name:"Bermuda Triangle Rosin",brand:"Pure Beauty",            tier:4, format:"solventless",      strainType:"hybrid", soilType:"indoor",              thcEquiv:21, cbd:0.05, cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:2.8,caryophyllene:2.4,linalool:1.0,limonene:1.4,pinene:0.4,terpinolene:0.4,ocimene:0.2,nerolidol:0,   farnesene:0,   bisabolol:0.2, terpineol:0.3,humulene:0.6,valencene:0.1,geraniol:0}},
  { id:171, name:"Silver Haze Rosin",    brand:"Pure Beauty",             tier:4, format:"solventless",      strainType:"sativa", soilType:"indoor",              thcEquiv:19, cbd:0.05, cbn:0,   thcv:0.12,   cbg:0,   cbc:0,   terpenes:{myrcene:0.4,caryophyllene:0.5,linalool:0.2,limonene:1.2,pinene:0.8,terpinolene:3.2,ocimene:1.4,nerolidol:0,   farnesene:0.2, bisabolol:0,    terpineol:0,   humulene:0.1,valencene:0.1,geraniol:0.04}},

  // ── WEST COAST CURE — Live Rosin Concentrate Tier 4 ──
  { id:172, name:"Grillz Kush Rosin",    brand:"West Coast Cure",         tier:4, format:"solventless",      strainType:"indica", soilType:"indoor",              thcEquiv:20, cbd:0.05, cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:4.8,caryophyllene:3.2,linalool:1.2,limonene:0.8,pinene:0.4,terpinolene:0.2,ocimene:0.1,nerolidol:0.2, farnesene:0,   bisabolol:0.2, terpineol:0.4,humulene:1.0,valencene:0,   geraniol:0}},

  // ── CANNABIOTIX — Dry Sift Rosin Tier 4 ──
  { id:173, name:"Juicy Froot Rosin",    brand:"Cannabiotix",             tier:4, format:"solventless",      strainType:"indica", soilType:"indoor",              thcEquiv:20, cbd:0.05, cbn:0,   thcv:0.1,   cbg:0,   cbc:0,   terpenes:{myrcene:0.6,caryophyllene:0.5,linalool:0.2,limonene:2.6,pinene:0.6,terpinolene:2.4,ocimene:1.0,nerolidol:0,   farnesene:0.1, bisabolol:0,    terpineol:0,   humulene:0.1,valencene:0.12,geraniol:0.04}},

  // ══════════════════════════════════════════════
  // PRE-ROLL ONLY BRANDS
  // ══════════════════════════════════════════════

  // ── CAM ──
  { id:174, name:"Jack Herer Preroll",   brand:"CAM",                     tier:2, format:"preroll",      strainType:"sativa",     soilType:"outdoor_living_soil", thcEquiv:19, cbd:0.13, cbn:0,   thcv:0.12,   cbg:0,   cbc:0,   terpenes:{myrcene:0.12,caryophyllene:0.16,linalool:0.06,limonene:0.32,pinene:0.28,terpinolene:0.58,ocimene:0.22,nerolidol:0,   farnesene:0.08,bisabolol:0,    terpineol:0.04,humulene:0.06,valencene:0.04,geraniol:0.02}},

  // ── FROOT INFUSED PREROLLS ──
  { id:175, name:"Cherry Pie Infused",   brand:"Froot",                   tier:1, format:"preroll",      strainType:"hybrid",     soilType:"any",                 thcEquiv:20, cbd:0.05, cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.42,caryophyllene:0.34,linalool:0.10,limonene:0.24,pinene:0.08,terpinolene:0.06,ocimene:0.03,nerolidol:0,   farnesene:0.06,bisabolol:0.03,terpineol:0.04,humulene:0.08,valencene:0,   geraniol:0}},
  { id:176, name:"Pineapple Express Inf",brand:"Froot",                   tier:1, format:"preroll",      strainType:"sativa",     soilType:"any",                 thcEquiv:18, cbd:0.05, cbn:0,   thcv:0.08,   cbg:0,   cbc:0,   terpenes:{myrcene:0.28,caryophyllene:0.20,linalool:0.06,limonene:0.40,pinene:0.16,terpinolene:0.36,ocimene:0.16,nerolidol:0,   farnesene:0.06,bisabolol:0,    terpineol:0.03,humulene:0.04,valencene:0.04,geraniol:0.02}},

  // ── GARDEN SOCIETY ──
  { id:177, name:"Gush Mintz Preroll",   brand:"Garden Society",          tier:3, format:"preroll",      strainType:"hybrid",     soilType:"outdoor_living_soil", thcEquiv:20, cbd:0.06, cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.30,caryophyllene:0.36,linalool:0.44,limonene:0.28,pinene:0.06,terpinolene:0.06,ocimene:0.03,nerolidol:0,   farnesene:0,   bisabolol:0.05,terpineol:0.08,humulene:0.10,valencene:0.02,geraniol:0}},
  { id:178, name:"Key Lime Jack Preroll",brand:"Garden Society",          tier:3, format:"preroll",      strainType:"sativa",     soilType:"outdoor_living_soil", thcEquiv:19, cbd:0.21, cbn:0,   thcv:0.1,   cbg:0,   cbc:0,   terpenes:{myrcene:0.10,caryophyllene:0.14,linalool:0.06,limonene:0.44,pinene:0.26,terpinolene:0.48,ocimene:0.18,nerolidol:0,   farnesene:0.06,bisabolol:0,    terpineol:0.04,humulene:0.04,valencene:0.05,geraniol:0.03}},

  // ── JEETER ──
  { id:179, name:"Papaya Melon Rosin",   brand:"Jeeter",                  tier:3, format:"preroll",      strainType:"hybrid",     soilType:"indoor",              thcEquiv:19, cbd:0.05, cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.52,caryophyllene:0.28,linalool:0.14,limonene:0.34,pinene:0.08,terpinolene:0.12,ocimene:0.06,nerolidol:0.04,farnesene:0,   bisabolol:0.04,terpineol:0.06,humulene:0.08,valencene:0.03,geraniol:0}},
  { id:180, name:"Master Kush LR Inf",   brand:"Jeeter",                  tier:3, format:"preroll",      strainType:"indica",     soilType:"indoor",              thcEquiv:20, cbd:0.05, cbn:0.1, thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.62,caryophyllene:0.40,linalool:0.30,limonene:0.12,pinene:0.10,terpinolene:0.04,ocimene:0.02,nerolidol:0.08,farnesene:0,   bisabolol:0.05,terpineol:0.10,humulene:0.16,valencene:0,   geraniol:0}},

  // ── LIFT TICKETS ──
  { id:181, name:"XJ-13 Infused",        brand:"Lift Tickets",            tier:3, format:"preroll",      strainType:"sativa",     soilType:"indoor",              thcEquiv:20, cbd:0.05, cbn:0,   thcv:0.1,   cbg:0,   cbc:0,   terpenes:{myrcene:0.14,caryophyllene:0.20,linalool:0.08,limonene:0.44,pinene:0.22,terpinolene:0.52,ocimene:0.20,nerolidol:0,   farnesene:0.06,bisabolol:0,    terpineol:0.04,humulene:0.06,valencene:0.04,geraniol:0.02}},

  // ── NATURALS ──
  { id:182, name:"Forbidden Fruit",      brand:"Naturals",                tier:2, format:"preroll",      strainType:"indica",     soilType:"greenhouse",          thcEquiv:24, cbd:0.05, cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.54,caryophyllene:0.30,linalool:0.36,limonene:0.20,pinene:0.06,terpinolene:0.04,ocimene:0.02,nerolidol:0.04,farnesene:0,   bisabolol:0.06,terpineol:0.08,humulene:0.08,valencene:0,   geraniol:0}},
  { id:183, name:"Papaya Punch",         brand:"Naturals",                tier:2, format:"preroll",      strainType:"indica",     soilType:"greenhouse",          thcEquiv:23, cbd:0.05, cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.56,caryophyllene:0.26,linalool:0.18,limonene:0.30,pinene:0.08,terpinolene:0.10,ocimene:0.06,nerolidol:0.04,farnesene:0,   bisabolol:0.04,terpineol:0.06,humulene:0.08,valencene:0.03,geraniol:0}},

  // ── NECTAR GOLD ──
  { id:184, name:"GMO (Nectar Gold)",    brand:"Nectar Gold",             tier:2, format:"preroll",      strainType:"indica",     soilType:"indoor",              thcEquiv:21, cbd:0.05, cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.36,caryophyllene:0.58,linalool:0.08,limonene:0.16,pinene:0.06,terpinolene:0.04,ocimene:0.02,nerolidol:0,   farnesene:0,   bisabolol:0.02,terpineol:0.04,humulene:0.22,valencene:0,   geraniol:0}},
  { id:185, name:"Jungle Juice",         brand:"Nectar Gold",             tier:2, format:"preroll",      strainType:"sativa",     soilType:"indoor",              thcEquiv:24, cbd:0.05, cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.44,caryophyllene:0.30,linalool:0.18,limonene:0.38,pinene:0.08,terpinolene:0.12,ocimene:0.06,nerolidol:0,   farnesene:0,   bisabolol:0.04,terpineol:0.04,humulene:0.08,valencene:0.03,geraniol:0}},
  { id:186, name:"Sage OG",              brand:"Nectar Gold",             tier:2, format:"preroll",      strainType:"indica",     soilType:"indoor",              thcEquiv:19, cbd:0.05, cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.48,caryophyllene:0.38,linalool:0.16,limonene:0.22,pinene:0.12,terpinolene:0.06,ocimene:0.03,nerolidol:0,   farnesene:0,   bisabolol:0.04,terpineol:0.06,humulene:0.14,valencene:0,   geraniol:0}},

  // ── SLIMMIES ──
  { id:187, name:"Canal Street Runtz",   brand:"Slimmies",                tier:2, format:"preroll",      strainType:"sativa",     soilType:"indoor",              thcEquiv:24, cbd:0.05, cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.40,caryophyllene:0.28,linalool:0.20,limonene:0.42,pinene:0.06,terpinolene:0.08,ocimene:0.04,nerolidol:0,   farnesene:0,   bisabolol:0.04,terpineol:0.04,humulene:0.08,valencene:0.03,geraniol:0}},
  { id:188, name:"Lemon Tart",           brand:"Slimmies",                tier:2, format:"preroll",      strainType:"sativa",     soilType:"indoor",              thcEquiv:21, cbd:0.06, cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.22,caryophyllene:0.20,linalool:0.10,limonene:0.58,pinene:0.12,terpinolene:0.28,ocimene:0.12,nerolidol:0,   farnesene:0,   bisabolol:0,    terpineol:0.03,humulene:0.06,valencene:0.04,geraniol:0.02}},
  { id:189, name:"Apple Fritter CBD",    brand:"Slimmies",                tier:2, format:"preroll",      strainType:"sativa",     soilType:"indoor",              thcEquiv:10, cbd:11.7, cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.46,caryophyllene:0.38,linalool:0.18,limonene:0.44,pinene:0.08,terpinolene:0.14,ocimene:0.08,nerolidol:0,   farnesene:0,   bisabolol:0.04,terpineol:0.05,humulene:0.12,valencene:0.04,geraniol:0}},

  // ── SLUGGERS ──
  { id:190, name:"Blue Zushi Infused",   brand:"Sluggers",                tier:3, format:"preroll",      strainType:"hybrid",     soilType:"indoor",              thcEquiv:21, cbd:0.05, cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.46,caryophyllene:0.32,linalool:0.28,limonene:0.36,pinene:0.06,terpinolene:0.08,ocimene:0.04,nerolidol:0,   farnesene:0,   bisabolol:0.04,terpineol:0.05,humulene:0.08,valencene:0.03,geraniol:0}},
  { id:191, name:"NYC Diesel Infused",   brand:"Sluggers",                tier:3, format:"preroll",      strainType:"sativa",     soilType:"indoor",              thcEquiv:19, cbd:0.38, cbn:0,   thcv:0.1,   cbg:0,   cbc:0,   terpenes:{myrcene:0.14,caryophyllene:0.18,linalool:0.06,limonene:0.38,pinene:0.22,terpinolene:0.54,ocimene:0.22,nerolidol:0,   farnesene:0.08,bisabolol:0,    terpineol:0.04,humulene:0.06,valencene:0.04,geraniol:0.02}},

  // ── TRADITIONAL ──
  { id:192, name:"Caicos Preroll",       brand:"Traditional",             tier:3, format:"preroll",      strainType:"indica",     soilType:"indoor",              thcEquiv:19, cbd:0.73, cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.38,caryophyllene:0.28,linalool:0.16,limonene:0.28,pinene:0.08,terpinolene:0.08,ocimene:0.04,nerolidol:0,   farnesene:0,   bisabolol:0.04,terpineol:0.05,humulene:0.08,valencene:0.02,geraniol:0}},
  { id:193, name:"Milk Censored Preroll",brand:"Traditional",             tier:3, format:"preroll",      strainType:"indica",     soilType:"indoor",              thcEquiv:22, cbd:0.10, cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.48,caryophyllene:0.36,linalool:0.24,limonene:0.26,pinene:0.06,terpinolene:0.06,ocimene:0.03,nerolidol:0,   farnesene:0,   bisabolol:0.04,terpineol:0.05,humulene:0.10,valencene:0.02,geraniol:0}},

  // ── TUMBLE ──
  { id:194, name:"Maui Wowie Infused",   brand:"Tumble",                  tier:2, format:"preroll",      strainType:"sativa",     soilType:"outdoor_living_soil", thcEquiv:18, cbd:0.05, cbn:0,   thcv:0.1,   cbg:0,   cbc:0,   terpenes:{myrcene:0.20,caryophyllene:0.16,linalool:0.08,limonene:0.34,pinene:0.18,terpinolene:0.52,ocimene:0.20,nerolidol:0,   farnesene:0.06,bisabolol:0,    terpineol:0.04,humulene:0.04,valencene:0.04,geraniol:0.02}},
  { id:195, name:"Blackberry Kush Inf",  brand:"Tumble",                  tier:2, format:"preroll",      strainType:"indica",     soilType:"indoor",              thcEquiv:19, cbd:0.05, cbn:0.1, thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.58,caryophyllene:0.34,linalool:0.28,limonene:0.14,pinene:0.06,terpinolene:0.04,ocimene:0.02,nerolidol:0.06,farnesene:0,   bisabolol:0.05,terpineol:0.08,humulene:0.10,valencene:0,   geraniol:0}},

  // ── UP NORTH ──
  { id:196, name:"GMO Preroll 5PK",      brand:"Up North",                tier:3, format:"preroll",      strainType:"sativa",     soilType:"indoor",              thcEquiv:21, cbd:0.05, cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.38,caryophyllene:0.60,linalool:0.08,limonene:0.14,pinene:0.06,terpinolene:0.04,ocimene:0.02,nerolidol:0,   farnesene:0,   bisabolol:0.02,terpineol:0.04,humulene:0.22,valencene:0,   geraniol:0}},
  { id:197, name:"Grand Daddy Purple",   brand:"Up North",                tier:3, format:"preroll",      strainType:"indica",     soilType:"indoor",              thcEquiv:19, cbd:0.05, cbn:0.2, thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.68,caryophyllene:0.22,linalool:0.44,limonene:0.08,pinene:0.04,terpinolene:0.02,ocimene:0.01,nerolidol:0.10,farnesene:0,   bisabolol:0.06,terpineol:0.12,humulene:0.06,valencene:0,   geraniol:0}},

  // ══════════════════════════════════════════════
  // EDIBLES — ALL BRANDS
  // ══════════════════════════════════════════════

  // ── BIG PETE'S ──
  { id:198, name:"Choc Chip Cookie Ind", brand:"Big Pete's Treats",       tier:1, format:"edible",      strainType:"indica",      soilType:"any",                 thcEquiv:10, cbd:0,    cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.4,caryophyllene:0.2,linalool:0.1,limonene:0.1,pinene:0,terpinolene:0,ocimene:0,nerolidol:0,farnesene:0,bisabolol:0,terpineol:0,humulene:0,valencene:0,geraniol:0}},
  { id:199, name:"PB Cookie Indica",     brand:"Big Pete's Treats",       tier:1, format:"edible",      strainType:"indica",      soilType:"any",                 thcEquiv:10, cbd:0,    cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.6,caryophyllene:0.3,linalool:0.2,limonene:0.05,pinene:0,terpinolene:0,ocimene:0,nerolidol:0,farnesene:0,bisabolol:0,terpineol:0,humulene:0,valencene:0,geraniol:0}},
  { id:200, name:"Cherries & Berries CBN",brand:"Big Pete's Treats",      tier:1, format:"edible",      strainType:"indica",      soilType:"any",                 thcEquiv:10, cbd:0,    cbn:0.4, thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.5,caryophyllene:0.2,linalool:0.4,limonene:0.1,pinene:0,terpinolene:0,ocimene:0,nerolidol:0,farnesene:0,bisabolol:0,terpineol:0,humulene:0,valencene:0,geraniol:0}},

  // ── BODEGA ──
  { id:201, name:"Cherry Limeade Drink", brand:"Bodega",                  tier:1, format:"edible",      strainType:"hybrid",      soilType:"any",                 thcEquiv:6,  cbd:0,    cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.1,caryophyllene:0.1,linalool:0.05,limonene:0.4,pinene:0,terpinolene:0,ocimene:0,nerolidol:0,farnesene:0,bisabolol:0,terpineol:0,humulene:0,valencene:0,geraniol:0}},

  // ── BREEZ ──
  { id:202, name:"Berry Daytime Mints",  brand:"BREEZ",                   tier:1, format:"edible",      strainType:"sativa",      soilType:"any",                 thcEquiv:5,  cbd:0,    cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.1,caryophyllene:0.1,linalool:0.08,limonene:0.3,pinene:0,terpinolene:0,ocimene:0,nerolidol:0,farnesene:0,bisabolol:0,terpineol:0,humulene:0,valencene:0,geraniol:0}},
  { id:203, name:"Berry Nighttime CBN",  brand:"BREEZ",                   tier:1, format:"edible",      strainType:"hybrid",      soilType:"any",                 thcEquiv:3,  cbd:0,    cbn:0.6, thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.4,caryophyllene:0.2,linalool:0.5,limonene:0.1,pinene:0,terpinolene:0,ocimene:0,nerolidol:0,farnesene:0,bisabolol:0,terpineol:0,humulene:0,valencene:0,geraniol:0}},
  { id:204, name:"Extra Strength 1:1",   brand:"BREEZ",                   tier:1, format:"edible",      strainType:"hybrid",      soilType:"any",                 thcEquiv:10, cbd:9.8,  cbn:0,   thcv:0,   cbg:0,   cbc:0.15,   terpenes:{myrcene:0.3,caryophyllene:0.4,linalool:0.3,limonene:0.2,pinene:0,terpinolene:0,ocimene:0,nerolidol:0,farnesene:0,bisabolol:0,terpineol:0,humulene:0,valencene:0,geraniol:0}},

  // ── BURSTS — Live Rosin Gummies ──
  { id:205, name:"Sour Grape LR Gummies",brand:"Bursts",                  tier:2, format:"edible",      strainType:"hybrid",      soilType:"any",                 thcEquiv:10, cbd:0,    cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.4,caryophyllene:0.3,linalool:0.2,limonene:0.4,pinene:0,terpinolene:0.05,ocimene:0,nerolidol:0,farnesene:0,bisabolol:0,terpineol:0,humulene:0,valencene:0,geraniol:0}},
  { id:206, name:"Watermelon LR Gummies",brand:"Bursts",                  tier:2, format:"edible",      strainType:"hybrid",      soilType:"any",                 thcEquiv:10, cbd:0,    cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.5,caryophyllene:0.2,linalool:0.2,limonene:0.3,pinene:0,terpinolene:0.05,ocimene:0,nerolidol:0,farnesene:0,bisabolol:0,terpineol:0,humulene:0,valencene:0,geraniol:0}},

  // ── CAM GUMMIES ──
  { id:207, name:"Blue Raspberry Gummies",brand:"CAM",                    tier:1, format:"edible",      strainType:"sativa",      soilType:"any",                 thcEquiv:10, cbd:0,    cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.2,caryophyllene:0.2,linalool:0.1,limonene:0.3,pinene:0,terpinolene:0,ocimene:0,nerolidol:0,farnesene:0,bisabolol:0,terpineol:0,humulene:0,valencene:0,geraniol:0}},
  { id:208, name:"Strawberry Kiwi THCV", brand:"CAM",                     tier:1, format:"edible",      strainType:"sativa",      soilType:"any",                 thcEquiv:10, cbd:0,    cbn:0,   thcv:0.4,   cbg:0,   cbc:0,   terpenes:{myrcene:0.1,caryophyllene:0.1,linalool:0.05,limonene:0.3,pinene:0.05,terpinolene:0.1,ocimene:0,nerolidol:0,farnesene:0,bisabolol:0,terpineol:0,humulene:0,valencene:0,geraniol:0}},
  { id:209, name:"Grape Gummies CBN",    brand:"CAM",                     tier:1, format:"edible",      strainType:"hybrid",      soilType:"any",                 thcEquiv:10, cbd:0,    cbn:0.5, thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.5,caryophyllene:0.2,linalool:0.4,limonene:0.1,pinene:0,terpinolene:0,ocimene:0,nerolidol:0,farnesene:0,bisabolol:0,terpineol:0,humulene:0,valencene:0,geraniol:0}},

  // ── CLSICS GUMMIES ──
  { id:210, name:"Melatonin Blueberry CBN",brand:"CLSICS",                tier:2, format:"edible",      strainType:"hybrid",      soilType:"any",                 thcEquiv:10, cbd:10,   cbn:0.5, thcv:0,   cbg:0.1,   cbc:0,   terpenes:{myrcene:0.6,caryophyllene:0.3,linalool:0.5,limonene:0.1,pinene:0,terpinolene:0,ocimene:0,nerolidol:0,farnesene:0,bisabolol:0,terpineol:0,humulene:0,valencene:0,geraniol:0}},
  { id:211, name:"Watermelon Haze LR Gum",brand:"CLSICS",                 tier:2, format:"edible",      strainType:"sativa",      soilType:"any",                 thcEquiv:10, cbd:0,    cbn:0,   thcv:0.1,   cbg:0,   cbc:0,   terpenes:{myrcene:0.3,caryophyllene:0.2,linalool:0.1,limonene:0.5,pinene:0.1,terpinolene:0.3,ocimene:0.1,nerolidol:0,farnesene:0,bisabolol:0,terpineol:0,humulene:0,valencene:0,geraniol:0}},

  // ── DROPS ──
  { id:212, name:"Lemon Gummies Sativa", brand:"Drops",                   tier:1, format:"edible",      strainType:"sativa",      soilType:"any",                 thcEquiv:10, cbd:0,    cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.1,caryophyllene:0.1,linalool:0.05,limonene:0.5,pinene:0,terpinolene:0.1,ocimene:0,nerolidol:0,farnesene:0,bisabolol:0,terpineol:0,humulene:0,valencene:0,geraniol:0}},
  { id:213, name:"Blueberry CBN Gummy",  brand:"Drops",                   tier:1, format:"edible",      strainType:"hybrid",      soilType:"any",                 thcEquiv:10, cbd:20,   cbn:0.6, thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.5,caryophyllene:0.2,linalool:0.4,limonene:0.1,pinene:0,terpinolene:0,ocimene:0,nerolidol:0,farnesene:0,bisabolol:0,terpineol:0,humulene:0,valencene:0,geraniol:0}},
  { id:214, name:"Cranberry 1:1 CBD",    brand:"Drops",                   tier:1, format:"edible",      strainType:"hybrid",      soilType:"any",                 thcEquiv:10, cbd:10,   cbn:0,   thcv:0,   cbg:0,   cbc:0.2,   terpenes:{myrcene:0.3,caryophyllene:0.3,linalool:0.2,limonene:0.2,pinene:0,terpinolene:0,ocimene:0,nerolidol:0,farnesene:0,bisabolol:0,terpineol:0,humulene:0,valencene:0,geraniol:0}},

  // ── EMERALD SKY ──
  { id:215, name:"Berry Blaze Indica",   brand:"Emerald Sky",             tier:1, format:"edible",      strainType:"hybrid",      soilType:"any",                 thcEquiv:9,  cbd:0.97, cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.5,caryophyllene:0.2,linalool:0.2,limonene:0.1,pinene:0,terpinolene:0,ocimene:0,nerolidol:0,farnesene:0,bisabolol:0,terpineol:0,humulene:0,valencene:0,geraniol:0}},
  { id:216, name:"Sleep PB Cups CBN",    brand:"Emerald Sky",             tier:1, format:"edible",      strainType:"indica",      soilType:"any",                 thcEquiv:9,  cbd:2.19, cbn:0.4, thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.6,caryophyllene:0.2,linalool:0.5,limonene:0.05,pinene:0,terpinolene:0,ocimene:0,nerolidol:0,farnesene:0,bisabolol:0,terpineol:0,humulene:0,valencene:0,geraniol:0}},

  // ── FROOT GUMMIES ──
  { id:217, name:"Mellow Berry CBN",     brand:"Froot",                   tier:1, format:"edible",      strainType:"hybrid",      soilType:"any",                 thcEquiv:10, cbd:0,    cbn:0.4, thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.5,caryophyllene:0.2,linalool:0.4,limonene:0.1,pinene:0,terpinolene:0,ocimene:0,nerolidol:0,farnesene:0,bisabolol:0,terpineol:0,humulene:0,valencene:0,geraniol:0}},

  // ── GARDEN SOCIETY GUMMIES ──
  { id:218, name:"Kiwi Lime THCV",       brand:"Garden Society",          tier:2, format:"edible",      strainType:"hybrid",      soilType:"any",                 thcEquiv:5,  cbd:0,    cbn:0,   thcv:0.4,   cbg:0.2,   cbc:0,   terpenes:{myrcene:0.1,caryophyllene:0.1,linalool:0.05,limonene:0.4,pinene:0.05,terpinolene:0.1,ocimene:0,nerolidol:0,farnesene:0,bisabolol:0,terpineol:0,humulene:0,valencene:0,geraniol:0}},
  { id:219, name:"Pineapple CBG Gummies",brand:"Garden Society",          tier:2, format:"edible",      strainType:"hybrid",      soilType:"any",                 thcEquiv:5,  cbd:0,    cbn:0,   thcv:0,   cbg:0.3,   cbc:0,   terpenes:{myrcene:0.2,caryophyllene:0.2,linalool:0.1,limonene:0.3,pinene:0,terpinolene:0.05,ocimene:0,nerolidol:0,farnesene:0,bisabolol:0,terpineol:0,humulene:0,valencene:0,geraniol:0}},

  // ── GOLDMINE ──
  { id:220, name:"Anti-Gravity Indica",  brand:"Goldmine Gummies",        tier:1, format:"edible",      strainType:"indica",      soilType:"any",                 thcEquiv:10, cbd:0,    cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.5,caryophyllene:0.2,linalool:0.2,limonene:0.1,pinene:0,terpinolene:0,ocimene:0,nerolidol:0,farnesene:0,bisabolol:0,terpineol:0,humulene:0,valencene:0,geraniol:0}},
  { id:221, name:"Slumberjack CBN",      brand:"Goldmine Gummies",        tier:1, format:"edible",      strainType:"indica",      soilType:"any",                 thcEquiv:10, cbd:0,    cbn:0.5, thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.6,caryophyllene:0.2,linalool:0.5,limonene:0.05,pinene:0,terpinolene:0,ocimene:0,nerolidol:0,farnesene:0,bisabolol:0,terpineol:0,humulene:0,valencene:0,geraniol:0}},
  { id:222, name:"Tropic Trip Hybrid",   brand:"Goldmine Gummies",        tier:1, format:"edible",      strainType:"hybrid",      soilType:"any",                 thcEquiv:10, cbd:0,    cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.3,caryophyllene:0.2,linalool:0.1,limonene:0.4,pinene:0,terpinolene:0.05,ocimene:0,nerolidol:0,farnesene:0,bisabolol:0,terpineol:0,humulene:0,valencene:0,geraniol:0}},

  // ── WYLD / GOOD TIDE ──
  { id:223, name:"Raspberry Gummies",    brand:"Wyld",                    tier:1, format:"edible",      strainType:"hybrid",      soilType:"any",                 thcEquiv:10, cbd:0,    cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.3,caryophyllene:0.2,linalool:0.2,limonene:0.3,pinene:0,terpinolene:0,ocimene:0,nerolidol:0,farnesene:0,bisabolol:0,terpineol:0,humulene:0,valencene:0,geraniol:0}},
  { id:224, name:"Pomegranate CBD 1:1",  brand:"Wyld",                    tier:1, format:"edible",      strainType:"hybrid",      soilType:"any",                 thcEquiv:10, cbd:10.8, cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.3,caryophyllene:0.3,linalool:0.2,limonene:0.2,pinene:0,terpinolene:0,ocimene:0,nerolidol:0,farnesene:0,bisabolol:0,terpineol:0,humulene:0,valencene:0,geraniol:0}},
  { id:225, name:"Kiwi THCv 1:1",        brand:"Wyld",                    tier:1, format:"edible",      strainType:"sativa",      soilType:"any",                 thcEquiv:10, cbd:0,    cbn:0,   thcv:0.4,   cbg:0,   cbc:0,   terpenes:{myrcene:0.1,caryophyllene:0.1,linalool:0.05,limonene:0.4,pinene:0.05,terpinolene:0.1,ocimene:0,nerolidol:0,farnesene:0,bisabolol:0,terpineol:0,humulene:0,valencene:0,geraniol:0}},
  { id:226, name:"Blood Orange CBC 1:1", brand:"Wyld",                    tier:1, format:"edible",      strainType:"sativa",      soilType:"any",                 thcEquiv:9,  cbd:0,    cbn:0,   thcv:0,   cbg:0,   cbc:0.4,   terpenes:{myrcene:0.2,caryophyllene:0.2,linalool:0.1,limonene:0.5,pinene:0,terpinolene:0,ocimene:0,nerolidol:0,farnesene:0,bisabolol:0,terpineol:0,humulene:0,valencene:0,geraniol:0}},
  { id:227, name:"Pear CBG 1:1",         brand:"Wyld",                    tier:1, format:"edible",      strainType:"sativa",      soilType:"any",                 thcEquiv:10, cbd:0,    cbn:0,   thcv:0,   cbg:0.4,   cbc:0,   terpenes:{myrcene:0.2,caryophyllene:0.3,linalool:0.2,limonene:0.3,pinene:0,terpinolene:0,ocimene:0,nerolidol:0,farnesene:0,bisabolol:0,terpineol:0,humulene:0,valencene:0,geraniol:0}},

  // ── HIGHATUS ──
  { id:228, name:"Caramel Rosin ChronBon",brand:"Highatus",               tier:2, format:"edible",      strainType:"hybrid",      soilType:"any",                 thcEquiv:10, cbd:0,    cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.4,caryophyllene:0.3,linalool:0.2,limonene:0.2,pinene:0,terpinolene:0,ocimene:0,nerolidol:0,farnesene:0,bisabolol:0,terpineol:0,humulene:0,valencene:0,geraniol:0}},
  { id:229, name:"S'mores Rosin ChronBon",brand:"Highatus",               tier:2, format:"edible",      strainType:"hybrid",      soilType:"any",                 thcEquiv:10, cbd:0,    cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.4,caryophyllene:0.3,linalool:0.2,limonene:0.2,pinene:0,terpinolene:0,ocimene:0,nerolidol:0,farnesene:0,bisabolol:0,terpineol:0,humulene:0,valencene:0,geraniol:0}},

  // ── KEEF ──
  { id:230, name:"Root Beer Soda 10MG",  brand:"Keef",                    tier:1, format:"edible",      strainType:"hybrid",      soilType:"any",                 thcEquiv:10, cbd:0,    cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.2,caryophyllene:0.1,linalool:0.1,limonene:0.1,pinene:0,terpinolene:0,ocimene:0,nerolidol:0,farnesene:0,bisabolol:0,terpineol:0,humulene:0,valencene:0,geraniol:0}},

  // ── LOST FARM — Live Rosin Gummies ──
  { id:231, name:"Dark Cherry LR Gummy", brand:"Lost Farm",               tier:2, format:"edible",      strainType:"indica",      soilType:"any",                 thcEquiv:10, cbd:0,    cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.5,caryophyllene:0.3,linalool:0.2,limonene:0.2,pinene:0,terpinolene:0,ocimene:0,nerolidol:0,farnesene:0,bisabolol:0,terpineol:0,humulene:0,valencene:0,geraniol:0}},
  { id:232, name:"Dragon Fruit LR Gummy",brand:"Lost Farm",               tier:2, format:"edible",      strainType:"hybrid",      soilType:"any",                 thcEquiv:10, cbd:0,    cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.3,caryophyllene:0.2,linalool:0.1,limonene:0.4,pinene:0,terpinolene:0.05,ocimene:0,nerolidol:0,farnesene:0,bisabolol:0,terpineol:0,humulene:0,valencene:0,geraniol:0}},

  // ── PABST LABS ──
  { id:233, name:"Lemon Seltzer 10MG",   brand:"Pabst Labs",              tier:1, format:"edible",      strainType:"hybrid",      soilType:"any",                 thcEquiv:10, cbd:0,    cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.1,caryophyllene:0.1,linalool:0.05,limonene:0.4,pinene:0,terpinolene:0,ocimene:0,nerolidol:0,farnesene:0,bisabolol:0,terpineol:0,humulene:0,valencene:0,geraniol:0}},
  { id:234, name:"Mango Coconut 25MG",   brand:"Pabst Labs",              tier:1, format:"edible",      strainType:"hybrid",      soilType:"any",                 thcEquiv:12, cbd:2,    cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.3,caryophyllene:0.1,linalool:0.1,limonene:0.3,pinene:0,terpinolene:0.1,ocimene:0,nerolidol:0,farnesene:0,bisabolol:0,terpineol:0,humulene:0,valencene:0,geraniol:0}},

  // ── PAPA & BARKLEY GUMMIES ──
  { id:235, name:"Strawberry Peach CBD", brand:"Papa & Barkley",          tier:2, format:"edible",      strainType:"hybrid",      soilType:"greenhouse",          thcEquiv:3,  cbd:30,   cbn:0,   thcv:0,   cbg:0.15,   cbc:0,   terpenes:{myrcene:0.6,caryophyllene:0.8,linalool:0.4,limonene:0.3,pinene:0.1,terpinolene:0,ocimene:0,nerolidol:0,farnesene:0,bisabolol:0,terpineol:0,humulene:0.1,valencene:0,geraniol:0}},

  // ── PETRA MINTS ──
  { id:236, name:"Moroccan Mint 2.5mg",  brand:"Petra",                   tier:2, format:"edible",      strainType:"hybrid",      soilType:"any",                 thcEquiv:2,  cbd:0,    cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.1,caryophyllene:0.1,linalool:0.08,limonene:0.2,pinene:0,terpinolene:0,ocimene:0,nerolidol:0,farnesene:0,bisabolol:0,terpineol:0,humulene:0,valencene:0,geraniol:0}},
  { id:237, name:"Blackberry CBN Mints", brand:"Petra",                   tier:2, format:"edible",      strainType:"hybrid",      soilType:"any",                 thcEquiv:2,  cbd:0,    cbn:0.5, thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.3,caryophyllene:0.1,linalool:0.3,limonene:0.1,pinene:0,terpinolene:0,ocimene:0,nerolidol:0,farnesene:0,bisabolol:0,terpineol:0,humulene:0,valencene:0,geraniol:0}},

  // ── UNCLE ARNIE'S ──
  { id:238, name:"Sunrise Orange 100MG", brand:"Uncle Arnie's",           tier:1, format:"edible",      strainType:"sativa",      soilType:"any",                 thcEquiv:10, cbd:0,    cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.2,caryophyllene:0.1,linalool:0.05,limonene:0.5,pinene:0,terpinolene:0.1,ocimene:0.05,nerolidol:0,farnesene:0,bisabolol:0,terpineol:0,humulene:0,valencene:0,geraniol:0}},
  { id:239, name:"Cherry Limeade 10MG",  brand:"Uncle Arnie's",           tier:1, format:"edible",      strainType:"sativa",      soilType:"any",                 thcEquiv:10, cbd:0,    cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.1,caryophyllene:0.1,linalool:0.05,limonene:0.5,pinene:0,terpinolene:0,ocimene:0,nerolidol:0,farnesene:0,bisabolol:0,terpineol:0,humulene:0,valencene:0,geraniol:0}},

  // ── WEST COAST CURE GUMMIES ──
  { id:240, name:"Peach Mango Gummies",  brand:"West Coast Cure",         tier:2, format:"edible",      strainType:"hybrid",      soilType:"any",                 thcEquiv:10, cbd:0,    cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.3,caryophyllene:0.2,linalool:0.1,limonene:0.4,pinene:0,terpinolene:0.05,ocimene:0,nerolidol:0,farnesene:0,bisabolol:0,terpineol:0,humulene:0,valencene:0,geraniol:0}},

  // ══════════════════════════════════════════════
  // TINCTURES & TOPICALS (new brands)
  // ══════════════════════════════════════════════

  // ── HIGH DESERT PURE ──
  { id:241, name:"CBN Honey Almond Tinc",brand:"High Desert Pure",        tier:2, format:"rso",      strainType:"indica",         soilType:"any",                 thcEquiv:5,  cbd:15.68,cbn:0.4, thcv:0,   cbg:0.2,   cbc:0,   terpenes:{myrcene:0.5,caryophyllene:0.6,linalool:0.4,limonene:0.2,pinene:0.1,terpinolene:0,ocimene:0,nerolidol:0,farnesene:0,bisabolol:0,terpineol:0,humulene:0.1,valencene:0,geraniol:0}},
  { id:242, name:"Big Balm 1:1",         brand:"High Desert Pure",        tier:2, format:"topical",      strainType:"hybrid",     soilType:"any",                 thcEquiv:8,  cbd:8,    cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:1.0,caryophyllene:1.4,linalool:0.8,limonene:0.4,pinene:0.2,terpinolene:0,ocimene:0.05,nerolidol:0.2,farnesene:0,bisabolol:0.4,terpineol:0.2,humulene:0.3,valencene:0,geraniol:0}},
  { id:243, name:"Eucalyptus Balm 1:1",  brand:"High Desert Pure",        tier:2, format:"topical",      strainType:"hybrid",     soilType:"any",                 thcEquiv:8,  cbd:8,    cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.8,caryophyllene:1.2,linalool:0.6,limonene:0.3,pinene:0.4,terpinolene:0,ocimene:0.05,nerolidol:0.2,farnesene:0,bisabolol:0.4,terpineol:0.3,humulene:0.3,valencene:0,geraniol:0}},

  // ── MARY'S MEDICINALS ──
  { id:244, name:"Transdermal Cream 1:1",brand:"Mary's Medicinals",       tier:2, format:"topical",      strainType:"hybrid",     soilType:"any",                 thcEquiv:5,  cbd:40,   cbn:0,   thcv:0,   cbg:0.1,   cbc:0.1,   terpenes:{myrcene:0.6,caryophyllene:0.8,linalool:0.6,limonene:0.3,pinene:0.1,terpinolene:0,ocimene:0,nerolidol:0.2,farnesene:0,bisabolol:0.3,terpineol:0.2,humulene:0.2,valencene:0,geraniol:0}},
  { id:245, name:"Transdermal Patch Ind",brand:"Mary's Medicinals",       tier:2, format:"topical",      strainType:"indica",     soilType:"any",                 thcEquiv:5,  cbd:0,    cbn:0.1, thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.7,caryophyllene:0.5,linalool:0.4,limonene:0.1,pinene:0.1,terpinolene:0,ocimene:0,nerolidol:0.1,farnesene:0,bisabolol:0.2,terpineol:0.2,humulene:0.2,valencene:0,geraniol:0}},
  { id:246, name:"Muscle Freeze CBD",    brand:"Mary's Medicinals",       tier:2, format:"topical",      strainType:"hybrid",     soilType:"any",                 thcEquiv:0,  cbd:32,   cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.2,caryophyllene:0.4,linalool:0.3,limonene:0.2,pinene:0.6,terpinolene:0,ocimene:0,nerolidol:0,farnesene:0,bisabolol:0.2,terpineol:0.4,humulene:0.1,valencene:0,geraniol:0}},
  { id:247, name:"Remedy Tincture 1:1",  brand:"Mary's Medicinals",       tier:2, format:"rso",      strainType:"hybrid",         soilType:"any",                 thcEquiv:5,  cbd:5,    cbn:0,   thcv:0,   cbg:0.15,   cbc:0.1,   terpenes:{myrcene:0.5,caryophyllene:0.6,linalool:0.4,limonene:0.2,pinene:0.1,terpinolene:0,ocimene:0,nerolidol:0,farnesene:0,bisabolol:0,terpineol:0,humulene:0.1,valencene:0,geraniol:0}},


  // ══════════════════════════════════════════════
  // FINAL NECTAR GAPS — TRUE 100%
  // ══════════════════════════════════════════════

  // ── EIGHTY EAST (flower) ──
  { id:248, name:"Bubblegum G Smalls",   brand:"Eighty East",             tier:2, format:"flower",      strainType:"indica",      soilType:"greenhouse",          thcEquiv:20, cbd:0.05, cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.52,caryophyllene:0.26,linalool:0.18,limonene:0.30,pinene:0.06,terpinolene:0.08,ocimene:0.04,nerolidol:0,   farnesene:0,   bisabolol:0.04,terpineol:0.05,humulene:0.08,valencene:0.02,geraniol:0}},

  // ── DIME INDUSTRIES (diamond-infused prerolls) ──
  { id:249, name:"GG4 Diamond Infused",  brand:"Dime Industries",         tier:2, format:"preroll",      strainType:"sativa",     soilType:"indoor",              thcEquiv:22, cbd:0.05, cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.38,caryophyllene:0.44,linalool:0.08,limonene:0.26,pinene:0.08,terpinolene:0.10,ocimene:0.04,nerolidol:0,   farnesene:0,   bisabolol:0.03,terpineol:0.04,humulene:0.18,valencene:0,   geraniol:0}},
  { id:250, name:"Lemon Cherry Gelato D",brand:"Dime Industries",         tier:2, format:"preroll",      strainType:"sativa",     soilType:"indoor",              thcEquiv:22, cbd:0.05, cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.28,caryophyllene:0.26,linalool:0.14,limonene:0.60,pinene:0.06,terpinolene:0.14,ocimene:0.08,nerolidol:0,   farnesene:0,   bisabolol:0.03,terpineol:0.04,humulene:0.08,valencene:0.04,geraniol:0}},

  // ── EL BLUNTO (diamond-infused blunt) ──
  { id:251, name:"Verde Especial Blunt", brand:"El Blunto",               tier:2, format:"preroll",      strainType:"hybrid",     soilType:"any",                 thcEquiv:21, cbd:0.05, cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.42,caryophyllene:0.32,linalool:0.14,limonene:0.38,pinene:0.06,terpinolene:0.08,ocimene:0.04,nerolidol:0,   farnesene:0,   bisabolol:0.03,terpineol:0.04,humulene:0.08,valencene:0.02,geraniol:0}},

  // ── FUZZIES / SUBLIME (infused prerolls) ──
  { id:252, name:"Grape Ape Infused",    brand:"Sublime",                 tier:2, format:"preroll",      strainType:"indica",     soilType:"greenhouse",          thcEquiv:21, cbd:0.39, cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.64,caryophyllene:0.24,linalool:0.38,limonene:0.10,pinene:0.04,terpinolene:0.02,ocimene:0.01,nerolidol:0.08,farnesene:0,   bisabolol:0.06,terpineol:0.10,humulene:0.06,valencene:0,   geraniol:0}},
  { id:253, name:"Northern Lights Inf",  brand:"Sublime",                 tier:2, format:"preroll",      strainType:"indica",     soilType:"greenhouse",          thcEquiv:21, cbd:0.05, cbn:0.2, thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.70,caryophyllene:0.28,linalool:0.32,limonene:0.08,pinene:0.06,terpinolene:0.03,ocimene:0.01,nerolidol:0.10,farnesene:0,   bisabolol:0.06,terpineol:0.12,humulene:0.08,valencene:0,   geraniol:0}},

  // ── HIMALAYA INFUSED PREROLLS ──
  { id:254, name:"Runtz Infused",        brand:"Himalaya",                tier:2, format:"preroll",      strainType:"hybrid",     soilType:"indoor",              thcEquiv:22, cbd:0.05, cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.42,caryophyllene:0.30,linalool:0.22,limonene:0.42,pinene:0.06,terpinolene:0.08,ocimene:0.04,nerolidol:0,   farnesene:0,   bisabolol:0.04,terpineol:0.04,humulene:0.08,valencene:0.03,geraniol:0}},
  { id:255, name:"Peanut Butter Souffle",brand:"Himalaya",                tier:2, format:"preroll",      strainType:"indica",     soilType:"indoor",              thcEquiv:23, cbd:0.05, cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.56,caryophyllene:0.40,linalool:0.14,limonene:0.18,pinene:0.06,terpinolene:0.04,ocimene:0.02,nerolidol:0,   farnesene:0,   bisabolol:0.03,terpineol:0.06,humulene:0.12,valencene:0,   geraniol:0}},
  { id:256, name:"Purple Punch Infused", brand:"Himalaya",                tier:2, format:"preroll",      strainType:"indica",     soilType:"indoor",              thcEquiv:21, cbd:0.05, cbn:0.1, thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.68,caryophyllene:0.24,linalool:0.42,limonene:0.08,pinene:0.04,terpinolene:0.02,ocimene:0.01,nerolidol:0.08,farnesene:0,   bisabolol:0.05,terpineol:0.10,humulene:0.06,valencene:0,   geraniol:0}},

  // ── KING ROLL ──
  { id:257, name:"White RNTZ x Apple F", brand:"King Roll",               tier:2, format:"preroll",      strainType:"hybrid",     soilType:"indoor",              thcEquiv:21, cbd:0.05, cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.44,caryophyllene:0.30,linalool:0.20,limonene:0.42,pinene:0.06,terpinolene:0.10,ocimene:0.05,nerolidol:0,   farnesene:0,   bisabolol:0.04,terpineol:0.04,humulene:0.08,valencene:0.03,geraniol:0}},

  // ── ST. IDES (infused blunt) ──
  { id:258, name:"Detroit Muscle Blunt", brand:"St. Ides",                tier:2, format:"preroll",      strainType:"indica",     soilType:"any",                 thcEquiv:22, cbd:0.05, cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.40,caryophyllene:0.38,linalool:0.12,limonene:0.28,pinene:0.06,terpinolene:0.06,ocimene:0.03,nerolidol:0,   farnesene:0,   bisabolol:0.02,terpineol:0.04,humulene:0.10,valencene:0,   geraniol:0}},

  // ── TUTTI (infused preroll) ──
  { id:259, name:"Apple Diesel Infused", brand:"Tutti",                   tier:1, format:"preroll",      strainType:"sativa",     soilType:"any",                 thcEquiv:18, cbd:0.05, cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.22,caryophyllene:0.20,linalool:0.08,limonene:0.42,pinene:0.18,terpinolene:0.36,ocimene:0.14,nerolidol:0,   farnesene:0.06,bisabolol:0,    terpineol:0.03,humulene:0.06,valencene:0.04,geraniol:0.02}},
  { id:260, name:"Cherry Pie Infused",   brand:"Tutti",                   tier:1, format:"preroll",      strainType:"hybrid",     soilType:"any",                 thcEquiv:18, cbd:0.05, cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.44,caryophyllene:0.34,linalool:0.10,limonene:0.24,pinene:0.08,terpinolene:0.06,ocimene:0.03,nerolidol:0,   farnesene:0.06,bisabolol:0.03,terpineol:0.04,humulene:0.08,valencene:0,   geraniol:0}},

  // ── JEETER JUICE (vape — separate brand line from Jeeter prerolls) ──
  { id:261, name:"Honey Dew Diamond Cart",brand:"Jeeter Juice",           tier:2, format:"live_resin",      strainType:"hybrid",  soilType:"indoor",              thcEquiv:20, cbd:0.05, cbn:0,   thcv:0.1,   cbg:0,   cbc:0,   terpenes:{myrcene:0.30,caryophyllene:0.20,linalool:0.10,limonene:0.54,pinene:0.12,terpinolene:0.36,ocimene:0.14,nerolidol:0,   farnesene:0.06,bisabolol:0,    terpineol:0.03,humulene:0.06,valencene:0.04,geraniol:0.03}},

  // ── CQ DRINKS (edible/drink) ──
  { id:262, name:"Strawberry Lemonade",  brand:"CQ Drinks",               tier:1, format:"edible",      strainType:"hybrid",      soilType:"any",                 thcEquiv:10, cbd:0,    cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.1,caryophyllene:0.1,linalool:0.05,limonene:0.5,pinene:0,terpinolene:0,ocimene:0,nerolidol:0,farnesene:0,bisabolol:0,terpineol:0,humulene:0,valencene:0,geraniol:0}},
  { id:263, name:"Wyldberry Guava Shot", brand:"CQ Drinks",               tier:1, format:"edible",      strainType:"hybrid",      soilType:"any",                 thcEquiv:5,  cbd:0,    cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.2,caryophyllene:0.1,linalool:0.05,limonene:0.4,pinene:0,terpinolene:0.05,ocimene:0,nerolidol:0,farnesene:0,bisabolol:0,terpineol:0,humulene:0,valencene:0,geraniol:0}},


  // ── PACIFIC STONE (Tier 2 greenhouse) ──
  { id:264, name:"805 Glue",             brand:"Pacific Stone",           tier:2, format:"flower",      strainType:"indica",      soilType:"greenhouse",          thcEquiv:24, cbd:0.06, cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.44,caryophyllene:0.44,linalool:0.10,limonene:0.22,pinene:0.08,terpinolene:0.08,ocimene:0.04,nerolidol:0,   farnesene:0,   bisabolol:0.03,terpineol:0.05,humulene:0.14,valencene:0,   geraniol:0}},
  { id:265, name:"Big Chainz",           brand:"Pacific Stone",           tier:2, format:"flower",      strainType:"sativa",      soilType:"greenhouse",          thcEquiv:22, cbd:0.06, cbn:0,   thcv:0.08,   cbg:0,   cbc:0,   terpenes:{myrcene:0.12,caryophyllene:0.12,linalool:0.05,limonene:0.56,pinene:0.20,terpinolene:0.46,ocimene:0.22,nerolidol:0,   farnesene:0.06,bisabolol:0,    terpineol:0.04,humulene:0.04,valencene:0.06,geraniol:0.03}},
  { id:266, name:"Wedding Cake",         brand:"Pacific Stone",           tier:2, format:"flower",      strainType:"indica",      soilType:"greenhouse",          thcEquiv:24, cbd:0.09, cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.48,caryophyllene:0.36,linalool:0.24,limonene:0.30,pinene:0.06,terpinolene:0.06,ocimene:0.03,nerolidol:0,   farnesene:0,   bisabolol:0.04,terpineol:0.05,humulene:0.10,valencene:0.02,geraniol:0}},
  { id:267, name:"805 Glue Preroll",     brand:"Pacific Stone",           tier:2, format:"preroll",      strainType:"indica",     soilType:"greenhouse",          thcEquiv:24, cbd:0.06, cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.44,caryophyllene:0.44,linalool:0.10,limonene:0.22,pinene:0.08,terpinolene:0.08,ocimene:0.04,nerolidol:0,   farnesene:0,   bisabolol:0.03,terpineol:0.05,humulene:0.14,valencene:0,   geraniol:0}},
  { id:268, name:"Blue Dream Preroll",   brand:"Pacific Stone",           tier:2, format:"preroll",      strainType:"sativa",     soilType:"greenhouse",          thcEquiv:22, cbd:0.22, cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.46,caryophyllene:0.18,linalool:0.10,limonene:0.42,pinene:0.18,terpinolene:0.38,ocimene:0.18,nerolidol:0,   farnesene:0.06,bisabolol:0,    terpineol:0.04,humulene:0.04,valencene:0.05,geraniol:0.02}},
  { id:269, name:"Wedding Cake Preroll", brand:"Pacific Stone",           tier:2, format:"preroll",      strainType:"indica",     soilType:"greenhouse",          thcEquiv:24, cbd:0.09, cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.48,caryophyllene:0.36,linalool:0.24,limonene:0.30,pinene:0.06,terpinolene:0.06,ocimene:0.03,nerolidol:0,   farnesene:0,   bisabolol:0.04,terpineol:0.05,humulene:0.10,valencene:0.02,geraniol:0}},
  // ── HEAVY HITTERS GUMMIES (edibles on Nectar menu) ──
  { id:270, name:"Blackberry Lemon Rosin",brand:"Heavy Hitters",          tier:2, format:"edible",      strainType:"hybrid",      soilType:"any",                 thcEquiv:10, cbd:0,    cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.4,caryophyllene:0.2,linalool:0.2,limonene:0.4,pinene:0,terpinolene:0,ocimene:0,nerolidol:0,farnesene:0,bisabolol:0,terpineol:0,humulene:0,valencene:0,geraniol:0}},
  { id:271, name:"Sour Peach Fast Acting",brand:"Heavy Hitters",          tier:2, format:"edible",      strainType:"sativa",      soilType:"any",                 thcEquiv:10, cbd:0,    cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.3,caryophyllene:0.1,linalool:0.1,limonene:0.5,pinene:0,terpinolene:0,ocimene:0,nerolidol:0,farnesene:0,bisabolol:0,terpineol:0,humulene:0,valencene:0,geraniol:0}},
  { id:272, name:"Midnight Cherry CBN",  brand:"Heavy Hitters",           tier:2, format:"edible",      strainType:"indica",      soilType:"any",                 thcEquiv:10, cbd:0,    cbn:0.4, thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.5,caryophyllene:0.2,linalool:0.4,limonene:0.1,pinene:0,terpinolene:0,ocimene:0,nerolidol:0,farnesene:0,bisabolol:0,terpineol:0,humulene:0,valencene:0,geraniol:0}},
  // ── STIIIZY GUMMIES ──
  { id:273, name:"Mango Tango Gummies",  brand:"Stiiizy",                 tier:1, format:"edible",      strainType:"sativa",      soilType:"any",                 thcEquiv:10, cbd:0,    cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.4,caryophyllene:0.2,linalool:0.1,limonene:0.4,pinene:0,terpinolene:0.1,ocimene:0,nerolidol:0,farnesene:0,bisabolol:0,terpineol:0,humulene:0,valencene:0,geraniol:0}},
  // ── FIG FARMS PREROLLS ──
  { id:274, name:"Donut Shop Preroll",   brand:"Fig Farms",               tier:5, format:"preroll",      strainType:"sativa",     soilType:"indoor",              thcEquiv:33, cbd:0.05, cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.38,caryophyllene:0.36,linalool:0.18,limonene:0.44,pinene:0.06,terpinolene:0.12,ocimene:0.06,nerolidol:0,   farnesene:0,   bisabolol:0.04,terpineol:0.04,humulene:0.10,valencene:0.02,geraniol:0}},
  { id:275, name:"Holy Moly! Flower",    brand:"Fig Farms",               tier:5, format:"flower",      strainType:"hybrid",      soilType:"indoor",              thcEquiv:30, cbd:0.05, cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.44,caryophyllene:0.36,linalool:0.22,limonene:0.40,pinene:0.06,terpinolene:0.10,ocimene:0.05,nerolidol:0,   farnesene:0,   bisabolol:0.04,terpineol:0.04,humulene:0.10,valencene:0.03,geraniol:0}},


  // ══════════════════════════════════════════════
  // NECTAR-SPECIFIC REPLACEMENTS (exact SKUs)
  // ══════════════════════════════════════════════

  // ── KIVA — exact Nectar SKUs ──
  { id:276, name:"Midnight Mint CBN Bar",brand:"Kiva",                    tier:1, format:"edible",      strainType:"indica",      soilType:"any",                 thcEquiv:5,  cbd:0,    cbn:0.5, thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.5,caryophyllene:0.2,linalool:0.5,limonene:0.1,pinene:0,terpinolene:0,ocimene:0,nerolidol:0,farnesene:0,bisabolol:0,terpineol:0,humulene:0,valencene:0,geraniol:0}},
  { id:277, name:"Blackberry Dark Choc",  brand:"Kiva",                   tier:1, format:"edible",      strainType:"hybrid",      soilType:"any",                 thcEquiv:5,  cbd:0,    cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.4,caryophyllene:0.2,linalool:0.2,limonene:0.2,pinene:0,terpinolene:0,ocimene:0,nerolidol:0,farnesene:0,bisabolol:0,terpineol:0,humulene:0,valencene:0,geraniol:0}},
  { id:278, name:"Churro Milk Choc Bar",  brand:"Kiva",                   tier:1, format:"edible",      strainType:"hybrid",      soilType:"any",                 thcEquiv:5,  cbd:0,    cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.3,caryophyllene:0.2,linalool:0.2,limonene:0.3,pinene:0,terpinolene:0,ocimene:0,nerolidol:0,farnesene:0,bisabolol:0,terpineol:0,humulene:0,valencene:0,geraniol:0}},
  { id:279, name:"Sea Salt Caramel Bites",brand:"Kiva",                   tier:1, format:"edible",      strainType:"hybrid",      soilType:"any",                 thcEquiv:5,  cbd:0,    cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.3,caryophyllene:0.2,linalool:0.2,limonene:0.2,pinene:0,terpinolene:0,ocimene:0,nerolidol:0,farnesene:0,bisabolol:0,terpineol:0,humulene:0,valencene:0,geraniol:0}},
  { id:280, name:"Terra Blueberry Bites", brand:"Kiva",                   tier:1, format:"edible",      strainType:"indica",      soilType:"any",                 thcEquiv:5,  cbd:0,    cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.4,caryophyllene:0.2,linalool:0.2,limonene:0.2,pinene:0,terpinolene:0,ocimene:0,nerolidol:0,farnesene:0,bisabolol:0,terpineol:0,humulene:0,valencene:0,geraniol:0}},
  { id:281, name:"Terra Milk & Cookies CBN",brand:"Kiva",                 tier:1, format:"edible",      strainType:"indica",      soilType:"any",                 thcEquiv:5,  cbd:0,    cbn:0.4, thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.5,caryophyllene:0.2,linalool:0.5,limonene:0.1,pinene:0,terpinolene:0,ocimene:0,nerolidol:0,farnesene:0,bisabolol:0,terpineol:0,humulene:0,valencene:0,geraniol:0}},

  // ── CAMINO — exact Nectar SKUs ──
  { id:282, name:"Orchard Peach 1:1 CBD", brand:"Camino",                 tier:1, format:"edible",      strainType:"hybrid",      soilType:"any",                 thcEquiv:5,  cbd:5,    cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.3,caryophyllene:0.2,linalool:0.2,limonene:0.4,pinene:0,terpinolene:0,ocimene:0,nerolidol:0,farnesene:0,bisabolol:0,terpineol:0,humulene:0,valencene:0,geraniol:0}},
  { id:283, name:"Pineapple Habanero",    brand:"Camino",                 tier:1, format:"edible",      strainType:"sativa",      soilType:"any",                 thcEquiv:5,  cbd:0,    cbn:0,   thcv:0.1,   cbg:0,   cbc:0,   terpenes:{myrcene:0.2,caryophyllene:0.2,linalool:0.1,limonene:0.6,pinene:0.05,terpinolene:0.2,ocimene:0.1,nerolidol:0,farnesene:0,bisabolol:0,terpineol:0,humulene:0,valencene:0,geraniol:0}},
  { id:284, name:"Wild Berry Chill",      brand:"Camino",                 tier:1, format:"edible",      strainType:"indica",      soilType:"any",                 thcEquiv:5,  cbd:0,    cbn:0.2, thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.5,caryophyllene:0.2,linalool:0.4,limonene:0.2,pinene:0,terpinolene:0,ocimene:0,nerolidol:0,farnesene:0,bisabolol:0,terpineol:0,humulene:0,valencene:0,geraniol:0}},
  { id:285, name:"Raspberry Lemonade",    brand:"Camino",                 tier:1, format:"edible",      strainType:"sativa",      soilType:"any",                 thcEquiv:10, cbd:0,    cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.2,caryophyllene:0.1,linalool:0.1,limonene:0.6,pinene:0,terpinolene:0,ocimene:0,nerolidol:0,farnesene:0,bisabolol:0,terpineol:0,humulene:0,valencene:0,geraniol:0}},

  // ── LEVEL — exact Nectar SKUs ──
  { id:286, name:"Hashtab Indica 10pk",   brand:"Level Blends",           tier:2, format:"edible",      strainType:"indica",      soilType:"any",                 thcEquiv:26, cbd:0,    cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.5,caryophyllene:0.3,linalool:0.3,limonene:0.1,pinene:0,terpinolene:0,ocimene:0,nerolidol:0,farnesene:0,bisabolol:0,terpineol:0,humulene:0,valencene:0,geraniol:0}},
  { id:287, name:"Hashtab Sativa 10pk",   brand:"Level Blends",           tier:2, format:"edible",      strainType:"sativa",      soilType:"any",                 thcEquiv:25, cbd:0,    cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.1,caryophyllene:0.2,linalool:0.1,limonene:0.4,pinene:0.1,terpinolene:0.2,ocimene:0,nerolidol:0,farnesene:0,bisabolol:0,terpineol:0,humulene:0,valencene:0,geraniol:0}},
  { id:288, name:"Protab+ Lights Out CBN",brand:"Level Blends",           tier:2, format:"edible",      strainType:"indica",      soilType:"any",                 thcEquiv:22, cbd:0,    cbn:0.4, thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.6,caryophyllene:0.3,linalool:0.5,limonene:0.1,pinene:0,terpinolene:0,ocimene:0,nerolidol:0,farnesene:0,bisabolol:0,terpineol:0,humulene:0,valencene:0,geraniol:0}},
  { id:289, name:"Rosintab Indica 10pk",  brand:"Level Blends",           tier:3, format:"edible",      strainType:"indica",      soilType:"any",                 thcEquiv:25, cbd:0,    cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.5,caryophyllene:0.3,linalool:0.3,limonene:0.1,pinene:0,terpinolene:0,ocimene:0,nerolidol:0,farnesene:0,bisabolol:0,terpineol:0,humulene:0,valencene:0,geraniol:0}},
  { id:290, name:"Rosintab Sativa 10pk",  brand:"Level Blends",           tier:3, format:"edible",      strainType:"sativa",      soilType:"any",                 thcEquiv:26, cbd:0,    cbn:0,   thcv:0.1,   cbg:0,   cbc:0,   terpenes:{myrcene:0.1,caryophyllene:0.2,linalool:0.1,limonene:0.5,pinene:0.1,terpinolene:0.2,ocimene:0,nerolidol:0,farnesene:0,bisabolol:0,terpineol:0,humulene:0,valencene:0,geraniol:0}},

  // ── PAPA & BARKLEY — actual Nectar balm SKUs ──
  { id:291, name:"THC Rich Balm 1:3",    brand:"Papa & Barkley",          tier:2, format:"topical",      strainType:"indica",     soilType:"greenhouse",          thcEquiv:5,  cbd:1.6,  cbn:0,   thcv:0,   cbg:0.15,   cbc:0.1,   terpenes:{myrcene:0.8,caryophyllene:1.4,linalool:0.4,limonene:0.3,pinene:0.1,terpinolene:0,ocimene:0,nerolidol:0.1,farnesene:0,bisabolol:0.2,terpineol:0.1,humulene:0.3,valencene:0,geraniol:0}},
  { id:292, name:"CBD Rich Balm 3:1",    brand:"Papa & Barkley",          tier:2, format:"topical",      strainType:"hybrid",     soilType:"greenhouse",          thcEquiv:2,  cbd:6,    cbn:0,   thcv:0,   cbg:0.2,   cbc:0.1,   terpenes:{myrcene:0.6,caryophyllene:0.8,linalool:0.4,limonene:0.3,pinene:0.1,terpinolene:0,ocimene:0,nerolidol:0.1,farnesene:0,bisabolol:0.2,terpineol:0.1,humulene:0.2,valencene:0,geraniol:0}},

  // ── RAW GARDEN — actual Nectar vape SKU ──
  { id:293, name:"Grape Jelly RLR Cart",  brand:"Raw Garden",             tier:3, format:"live_resin",      strainType:"indica",  soilType:"outdoor_living_soil",  thcEquiv:19, cbd:0.21, cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:3.8,caryophyllene:1.6,linalool:1.0,limonene:0.6,pinene:0.2,terpinolene:0.1,ocimene:0.05,nerolidol:0.2,farnesene:0,bisabolol:0.2,terpineol:0.3,humulene:0.4,valencene:0,geraniol:0}},

  // ── STIIIZY — actual Nectar SKUs ──
  { id:294, name:"Strawberry Shortcake", brand:"Stiiizy",                 tier:2, format:"live_resin",      strainType:"hybrid",  soilType:"indoor",              thcEquiv:19, cbd:0.05, cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.6,caryophyllene:0.4,linalool:0.2,limonene:0.8,pinene:0.08,terpinolene:0.2,ocimene:0.1,nerolidol:0,farnesene:0,bisabolol:0.04,terpineol:0.04,humulene:0.1,valencene:0.05,geraniol:0}},
  { id:295, name:"Banana Mac LR",        brand:"Stiiizy",                 tier:3, format:"live_resin",      strainType:"indica",  soilType:"indoor",              thcEquiv:19, cbd:0.12, cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:4.2,caryophyllene:2.2,linalool:1.2,limonene:0.6,pinene:0.2,terpinolene:0.1,ocimene:0.05,nerolidol:0.2,farnesene:0,bisabolol:0.2,terpineol:0.3,humulene:0.5,valencene:0,geraniol:0}},
  { id:296, name:"Diamond OG LR Diamonds",brand:"Stiiizy",               tier:3, format:"live_resin",      strainType:"indica",  soilType:"indoor",              thcEquiv:20, cbd:0.05, cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:4.8,caryophyllene:3.0,linalool:0.8,limonene:0.8,pinene:0.4,terpinolene:0.1,ocimene:0.05,nerolidol:0,farnesene:0,bisabolol:0.1,terpineol:0.3,humulene:0.8,valencene:0,geraniol:0}},

  // ── HEAVY HITTERS — actual Nectar vape SKUs ──
  { id:297, name:"Orange Push Pop CR",   brand:"Heavy Hitters",           tier:2, format:"co2_extract",      strainType:"hybrid", soilType:"any",                 thcEquiv:21, cbd:0.05, cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.3,caryophyllene:0.2,linalool:0.1,limonene:0.6,pinene:0.05,terpinolene:0.2,ocimene:0.08,nerolidol:0,farnesene:0,bisabolol:0,terpineol:0,humulene:0,valencene:0,geraniol:0}},
  { id:298, name:"Cloudberry Dist",      brand:"Heavy Hitters",           tier:1, format:"co2_extract",      strainType:"hybrid", soilType:"any",                 thcEquiv:21, cbd:0.27, cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.5,caryophyllene:0.2,linalool:0.3,limonene:0.2,pinene:0,terpinolene:0,ocimene:0,nerolidol:0,farnesene:0,bisabolol:0,terpineol:0,humulene:0,valencene:0,geraniol:0}},

  // ── JETTY EXTRACTS — actual cart SKUs on Nectar menu ──
  { id:299, name:"Cheetah Piss LR Cart", brand:"Jetty Extracts",          tier:3, format:"live_resin",      strainType:"sativa",  soilType:"indoor",              thcEquiv:19, cbd:0.23, cbn:0,   thcv:0.1,   cbg:0,   cbc:0,   terpenes:{myrcene:0.2,caryophyllene:0.3,linalool:0.1,limonene:0.8,pinene:0.3,terpinolene:1.2,ocimene:0.6,nerolidol:0,farnesene:0.1,bisabolol:0,terpineol:0,humulene:0.1,valencene:0.08,geraniol:0.03}},
  { id:300, name:"Legend OG LR Cart",    brand:"Jetty Extracts",          tier:3, format:"live_resin",      strainType:"indica",  soilType:"indoor",              thcEquiv:20, cbd:0.02, cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:5.0,caryophyllene:2.8,linalool:0.8,limonene:1.0,pinene:0.4,terpinolene:0.1,ocimene:0.05,nerolidol:0,farnesene:0,bisabolol:0.2,terpineol:0.4,humulene:0.8,valencene:0,geraniol:0}},
  { id:301, name:"Vanilla Grove LR Cart",brand:"Jetty Extracts",          tier:3, format:"live_resin",      strainType:"sativa",  soilType:"indoor",              thcEquiv:19, cbd:0.16, cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.4,caryophyllene:0.3,linalool:0.2,limonene:0.6,pinene:0.2,terpinolene:0.6,ocimene:0.3,nerolidol:0,farnesene:0.08,bisabolol:0,terpineol:0.04,humulene:0.08,valencene:0.06,geraniol:0.03}},
  { id:302, name:"Brazilian Limeade Rosin",brand:"Jetty Extracts",        tier:4, format:"solventless",      strainType:"sativa", soilType:"indoor",              thcEquiv:19, cbd:0.18, cbn:0,   thcv:0.1,   cbg:0,   cbc:0,   terpenes:{myrcene:0.2,caryophyllene:0.3,linalool:0.1,limonene:2.8,pinene:0.5,terpinolene:1.6,ocimene:0.8,nerolidol:0,farnesene:0.1,bisabolol:0,terpineol:0,humulene:0.08,valencene:0.1,geraniol:0.04}},
  { id:303, name:"Northern Lights 5 Dist",brand:"Jetty Extracts",         tier:1, format:"co2_extract",      strainType:"indica", soilType:"any",                 thcEquiv:19, cbd:0.67, cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.6,caryophyllene:0.3,linalool:0.3,limonene:0.2,pinene:0.08,terpinolene:0.04,ocimene:0.02,nerolidol:0.08,farnesene:0,bisabolol:0.04,terpineol:0.08,humulene:0.08,valencene:0,geraniol:0}},


  // ══════════════════════════════════════════════
  // SAN JOAQUIN VALLEY — REGIONAL ADDITIONS
  // ══════════════════════════════════════════════

  // ── COOKIES (dominant SJ brand) ──
  { id:304, name:"Gary Payton",          brand:"Cookies",   tier:4, format:"flower",      strainType:"hybrid",      soilType:"indoor",  thcEquiv:28, cbd:0.05, cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.28,caryophyllene:0.52,linalool:0.12,limonene:0.38,pinene:0.10,terpinolene:0.08,ocimene:0.04,nerolidol:0,farnesene:0,bisabolol:0.03,terpineol:0.05,humulene:0.18,valencene:0.04,geraniol:0}},
  { id:305, name:"Lemonnade OG",         brand:"Cookies",   tier:4, format:"flower",      strainType:"sativa",      soilType:"indoor",  thcEquiv:26, cbd:0.05, cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.18,caryophyllene:0.22,linalool:0.08,limonene:0.72,pinene:0.14,terpinolene:0.32,ocimene:0.14,nerolidol:0,farnesene:0.06,bisabolol:0,terpineol:0.04,humulene:0.06,valencene:0.06,geraniol:0.04}},
  { id:306, name:"Cereal Milk",          brand:"Cookies",   tier:4, format:"flower",      strainType:"hybrid",      soilType:"indoor",  thcEquiv:24, cbd:0.05, cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.22,caryophyllene:0.28,linalool:0.18,limonene:0.52,pinene:0.10,terpinolene:0.22,ocimene:0.10,nerolidol:0,farnesene:0.04,bisabolol:0.04,terpineol:0.04,humulene:0.08,valencene:0.05,geraniol:0.03}},
  { id:307, name:"Runtz",                brand:"Cookies",   tier:4, format:"preroll",      strainType:"hybrid",     soilType:"indoor",  thcEquiv:25, cbd:0.05, cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.38,caryophyllene:0.28,linalool:0.22,limonene:0.48,pinene:0.08,terpinolene:0.14,ocimene:0.08,nerolidol:0,farnesene:0.04,bisabolol:0.04,terpineol:0.04,humulene:0.08,valencene:0.04,geraniol:0.02}},

  // ── STATE FLOWER ──
  { id:308, name:"GSC",                  brand:"State Flower", tier:4, format:"flower",      strainType:"indica",   soilType:"indoor",  thcEquiv:27, cbd:0.05, cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.32,caryophyllene:0.44,linalool:0.28,limonene:0.36,pinene:0.08,terpinolene:0.10,ocimene:0.05,nerolidol:0,farnesene:0,bisabolol:0.05,terpineol:0.06,humulene:0.12,valencene:0.02,geraniol:0}},
  { id:309, name:"Blue Dream",           brand:"State Flower", tier:4, format:"flower",      strainType:"sativa",   soilType:"indoor",  thcEquiv:22, cbd:0.18, cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.44,caryophyllene:0.18,linalool:0.10,limonene:0.42,pinene:0.18,terpinolene:0.38,ocimene:0.18,nerolidol:0,farnesene:0.06,bisabolol:0,terpineol:0.04,humulene:0.04,valencene:0.05,geraniol:0.02}},

  // ── BLOOM FARMS ──
  { id:310, name:"Blue Dream Cart",      brand:"Bloom Farms", tier:2, format:"co2_extract",      strainType:"sativa", soilType:"any",   thcEquiv:20, cbd:0.14, cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.44,caryophyllene:0.18,linalool:0.10,limonene:0.42,pinene:0.18,terpinolene:0.38,ocimene:0.18,nerolidol:0,farnesene:0.06,bisabolol:0,terpineol:0.04,humulene:0.04,valencene:0.05,geraniol:0.02}},
  { id:311, name:"OG Kush Cart",         brand:"Bloom Farms", tier:2, format:"co2_extract",      strainType:"hybrid", soilType:"any",   thcEquiv:21, cbd:0.08, cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.52,caryophyllene:0.38,linalool:0.20,limonene:0.28,pinene:0.12,terpinolene:0.08,ocimene:0.04,nerolidol:0,farnesene:0,bisabolol:0.04,terpineol:0.06,humulene:0.14,valencene:0,geraniol:0}},

  // ── OLD PAL (budget, very common in valley) ──
  { id:312, name:"Indica Blend",         brand:"Old Pal",   tier:1, format:"flower",      strainType:"indica",      soilType:"outdoor_living_soil", thcEquiv:18, cbd:0.08, cbn:0, thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.44,caryophyllene:0.30,linalool:0.14,limonene:0.18,pinene:0.08,terpinolene:0.06,ocimene:0.03,nerolidol:0,farnesene:0,bisabolol:0.02,terpineol:0.04,humulene:0.10,valencene:0,geraniol:0}},
  { id:313, name:"Sativa Blend",         brand:"Old Pal",   tier:1, format:"flower",      strainType:"sativa",      soilType:"outdoor_living_soil", thcEquiv:17, cbd:0.10, cbn:0, thcv:0.08,   cbg:0,   cbc:0,   terpenes:{myrcene:0.14,caryophyllene:0.16,linalool:0.06,limonene:0.52,pinene:0.20,terpinolene:0.42,ocimene:0.20,nerolidol:0,farnesene:0.06,bisabolol:0,terpineol:0.04,humulene:0.04,valencene:0.06,geraniol:0.02}},
  { id:314, name:"Ready Roll 5pk",       brand:"Old Pal",   tier:1, format:"preroll",      strainType:"hybrid",     soilType:"outdoor_living_soil", thcEquiv:18, cbd:0.08, cbn:0, thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.40,caryophyllene:0.26,linalool:0.12,limonene:0.20,pinene:0.08,terpinolene:0.06,ocimene:0.03,nerolidol:0,farnesene:0,bisabolol:0.02,terpineol:0.04,humulene:0.08,valencene:0,geraniol:0}},

  // ── KUSHY PUNCH (edibles, major SJ presence) ──
  { id:315, name:"Recover CBD Gummy",    brand:"Kushy Punch", tier:1, format:"edible",      strainType:"hybrid",    soilType:"any",     thcEquiv:5,  cbd:20,   cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.4,caryophyllene:0.3,linalool:0.2,limonene:0.2,pinene:0.1,terpinolene:0,ocimene:0,nerolidol:0,farnesene:0,bisabolol:0,terpineol:0,humulene:0,valencene:0,geraniol:0}},
  { id:316, name:"Sleep Indica Gummy",   brand:"Kushy Punch", tier:1, format:"edible",      strainType:"indica",    soilType:"any",     thcEquiv:10, cbd:0,    cbn:0.2, thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.5,caryophyllene:0.2,linalool:0.4,limonene:0.1,pinene:0,terpinolene:0,ocimene:0,nerolidol:0,farnesene:0,bisabolol:0,terpineol:0,humulene:0,valencene:0,geraniol:0}},
  { id:317, name:"Knockout Indica 100mg",brand:"Kushy Punch", tier:1, format:"edible",      strainType:"indica",    soilType:"any",     thcEquiv:10, cbd:0,    cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.5,caryophyllene:0.2,linalool:0.3,limonene:0.1,pinene:0,terpinolene:0,ocimene:0,nerolidol:0,farnesene:0,bisabolol:0,terpineol:0,humulene:0,valencene:0,geraniol:0}},

  // ── KOROVA (SJ Valley staple) ──
  { id:318, name:"Black Bar 1000mg",     brand:"Korova",    tier:1, format:"edible",      strainType:"indica",      soilType:"any",     thcEquiv:10, cbd:0,    cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.3,caryophyllene:0.2,linalool:0.2,limonene:0.2,pinene:0,terpinolene:0,ocimene:0,nerolidol:0,farnesene:0,bisabolol:0,terpineol:0,humulene:0,valencene:0,geraniol:0}},
  { id:319, name:"CBD Bar 1:1",          brand:"Korova",    tier:1, format:"edible",      strainType:"sativa",      soilType:"any",     thcEquiv:5,  cbd:5,    cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.3,caryophyllene:0.2,linalool:0.2,limonene:0.2,pinene:0,terpinolene:0,ocimene:0,nerolidol:0,farnesene:0,bisabolol:0,terpineol:0,humulene:0,valencene:0,geraniol:0}},

  // ── GLASS HOUSE (expanded — major Greenhouse SJ brand) ──
  { id:320, name:"Sherblato",            brand:"Glass House Brands", tier:2, format:"flower",      strainType:"hybrid", soilType:"greenhouse", thcEquiv:24, cbd:0.06, cbn:0, thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.46,caryophyllene:0.38,linalool:0.24,limonene:0.36,pinene:0.06,terpinolene:0.08,ocimene:0.04,nerolidol:0,farnesene:0,bisabolol:0.04,terpineol:0.05,humulene:0.10,valencene:0.02,geraniol:0}},
  { id:321, name:"Forbidden Fruit",      brand:"Glass House Brands", tier:2, format:"flower",      strainType:"hybrid", soilType:"greenhouse", thcEquiv:22, cbd:0.06, cbn:0, thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.52,caryophyllene:0.28,linalool:0.32,limonene:0.22,pinene:0.06,terpinolene:0.06,ocimene:0.03,nerolidol:0.05,farnesene:0,bisabolol:0.05,terpineol:0.06,humulene:0.08,valencene:0,geraniol:0}},
  { id:322, name:"Baller Jar OG",        brand:"Glass House Brands", tier:2, format:"flower",      strainType:"indica", soilType:"greenhouse", thcEquiv:23, cbd:0.07, cbn:0, thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.54,caryophyllene:0.42,linalool:0.18,limonene:0.24,pinene:0.10,terpinolene:0.06,ocimene:0.03,nerolidol:0,farnesene:0,bisabolol:0.03,terpineol:0.05,humulene:0.14,valencene:0,geraniol:0}},

  // ── VARDA ──
  { id:323, name:"Chem 91",              brand:"Varda",     tier:5, format:"flower",      strainType:"sativa",      soilType:"indoor",  thcEquiv:27, cbd:0.04, cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.24,caryophyllene:0.44,linalool:0.10,limonene:0.32,pinene:0.12,terpinolene:0.18,ocimene:0.08,nerolidol:0,farnesene:0.04,bisabolol:0,terpineol:0.04,humulene:0.14,valencene:0.04,geraniol:0}},
  { id:324, name:"Sugar Black Rose",     brand:"Varda",     tier:5, format:"flower",      strainType:"indica",      soilType:"indoor",  thcEquiv:25, cbd:0.05, cbn:0,   thcv:0,   cbg:0,   cbc:0,   terpenes:{myrcene:0.46,caryophyllene:0.28,linalool:0.44,limonene:0.22,pinene:0.06,terpinolene:0.06,ocimene:0.03,nerolidol:0.06,farnesene:0,bisabolol:0.06,terpineol:0.08,humulene:0.08,valencene:0,geraniol:0}},

];


// ─────────────────────────────────────────────
// SCORING ENGINE
// ─────────────────────────────────────────────

const TIER_MULTIPLIER = { 1: 0.55, 2: 0.72, 3: 0.88, 4: 0.97, 5: 1.0 };
function getTierMultiplier(p) {
  if (p.format === "rso")     return 0.85;
  if (p.format === "topical") return 0.82;
  if (p.format === "edible" || p.format === "preroll") return 0.65;
  return TIER_MULTIPLIER[p.tier] || 0.55;
}
const FLOWER_THRESHOLD_FORMATS = new Set(["flower","edible","preroll","co2_extract","rso","topical"]);
const isFlower = (f) => FLOWER_THRESHOLD_FORMATS.has(f);
const dominantTerpene = (t) => Object.entries(t).reduce((b,[k,v]) => v>b.val ? {key:k,val:v} : b, {key:null,val:-1}).key;

function scoreProduct(product, issue, severity, selectedSoil) {
  const g = GOLD[issue];
  const flower = isFlower(product.format);
  const t = product.terpenes;
  let terpScore = 0, bonusTerpFound = null, primaryDriven = false;

  const pT = flower ? g.primaryThreshold.flower : g.primaryThreshold.concentrate;
  const pV = t[g.primary] || 0;
  if (pV >= pT) { terpScore += 40; primaryDriven = true; if (dominantTerpene(t) === g.primary) terpScore += 10; }
  else if (pV > 0) terpScore += 20;

  const sT = flower ? g.secondaryThreshold.flower : g.secondaryThreshold.concentrate;
  const sV = t[g.secondary] || 0;
  if (sV >= sT) terpScore += 25; else if (sV > 0) terpScore += 10;

  const bT = flower ? g.bonusThreshold.flower : g.bonusThreshold.concentrate;
  for (const b of g.bonus) { if ((t[b]||0) >= bT) { terpScore += 8; if (!bonusTerpFound) bonusTerpFound = b; } }
  terpScore = Math.min(terpScore, 100);
  if (g.negative && dominantTerpene(t) === g.negative) terpScore -= 15;
  if (product.tier === 1) terpScore -= 10;
  terpScore = Math.max(0, terpScore);

  let cannScore = 0;
  const w = g.thcWindow[severity];
  if (product.thcEquiv >= w[0] && product.thcEquiv <= w[1]) cannScore += 50;
  else if (product.thcEquiv < w[0]) cannScore += Math.max(0, 50 - (w[0]-product.thcEquiv)*2);
  else cannScore += Math.max(0, 50 - (product.thcEquiv-g.thcCeiling)*5);

  if (g.cbdRole === "essential" && product.cbd >= 0.5) { cannScore += 20; if (product.cbd >= product.thcEquiv*0.7) cannScore += 10; }
  else if (g.cbdRole === "helpful" && product.cbd >= 0.5) cannScore += 10;
  cannScore = Math.min(cannScore, 80);
  if (g.minorBonus === "cbn"  && product.cbn  >= 0.1)  cannScore = Math.min(80, cannScore + 10);
  if (g.minorBonus === "thcv" && product.thcv >= 0.15) cannScore = Math.min(80, cannScore + 10);
  if (issue === "appetite" && product.thcv >= 0.2) cannScore = Math.max(0, cannScore - 12);
  if (g.cbgBonus && product.cbg >= g.cbgBonus) cannScore = Math.min(80, cannScore + 8);
  if (g.cbcBonus && product.cbc >= g.cbcBonus) cannScore = Math.min(80, cannScore + 8);

  const subtotal = terpScore * 0.40 + cannScore * 0.30;
  let modifier = 0;
  if (severity === "mild")  modifier += 5;
  if (severity === "heavy" && product.tier >= 4) modifier += 8;
  if (issue === "nausea") { if (product.format === "edible") modifier -= 30; else modifier += 10; }
  if ((issue === "chronic_pain" || issue === "arousal") && product.format === "topical") modifier += 10;
  if (selectedSoil !== "any") {
    if ((issue === "focus" || issue === "creativity") && product.soilType === "outdoor_living_soil" && selectedSoil === "outdoor_living_soil") modifier += 12;
    if (["sleep","pain","anxiety","chronic_pain"].includes(issue) && product.soilType === "indoor" && selectedSoil === "indoor") modifier += 5;
  }
  const score = Math.max(0, Math.min(100, Math.round(subtotal * getTierMultiplier(product) + modifier)));
  const cbdDriven = g.cbdRole === "essential" && product.cbd >= 0.5;
  const cbgResult = g.cbgBonus && product.cbg >= g.cbgBonus;
  const cbcResult = g.cbcBonus && product.cbc >= g.cbcBonus;
  const minorDriven = (g.minorBonus === "cbn" && product.cbn >= 0.1) ? "cbn" : (g.minorBonus === "thcv" && product.thcv >= 0.15) ? "thcv" : null;
  const soilBonus = selectedSoil !== "any" && product.soilType === selectedSoil;
  return { product, score, primaryDriven, bonusTerpFound, cbdDriven, minorDriven, soilBonus, cbgDriven: cbgResult, cbcDriven: cbcResult };
}

function getResults(issue, severity, soilType, productType) {
  const allowed = PRODUCT_TYPES.find(p => p.id === productType)?.formats || [];
  return PRODUCTS
    .filter(p => allowed.includes(p.format))
    .map(p => scoreProduct(p, issue, severity, soilType))
    .sort((a,b) => b.score - a.score)
    .filter(r => r.score >= 18)
    .slice(0, 5);
}

function generateOneLiner(result, issue) {
  const { product, cbdDriven, minorDriven, bonusTerpFound, soilBonus, primaryDriven, cbgDriven, cbcDriven } = result;
  const profile = GOLD[issue];
  const issueLabel = ISSUES.find(i => i.id === issue)?.label || issue;
  if (cbgDriven && issue === "focus") return "CBG boosts focus through α2-adrenergic pathways — cleaner than THC alone. Rare on shelf.";
  if (cbgDriven && issue === "appetite") return "CBG is a direct appetite stimulant via CB1. Stacks with THC for a more reliable hunger response.";
  if (cbgDriven && issue === "mood") return "CBG adds an antidepressant signal that THC alone doesn't carry. Full-spectrum uplift.";
  if (cbgDriven) return "CBG content adds a minor cannabinoid layer that strengthens this profile.";
  if (cbcDriven && issue === "mood") return "CBC binds TRPV1 — distinct antidepressant mechanism separate from THC. Underrated on the shelf.";
  if (cbcDriven && issue === "creativity") return "CBC promotes neurogenesis via TRPA1. Hard to find in flower — this product earns the creativity rec.";
  if (cbcDriven) return "CBC adds analgesic and anti-inflammatory depth beyond what the THC alone provides.";
  if (cbdDriven && product.format === "rso") return "1:1 whole-plant extract — CBD + caryophyllene together. Best long-term " + issueLabel.toLowerCase() + " protocol on shelf.";
  if (cbdDriven) return "CBD ratio moderates the THC effect — reduces tolerance buildup over time. Right call for chronic use.";
  if (minorDriven === "cbn") return "CBN extends sleep duration, not just onset. Most sleep products knock you out — this one keeps you under.";
  if (minorDriven === "thcv") return "THCV adds a clear-headed lift that regular THC cannot match. Best " + issueLabel.toLowerCase() + " signal on the shelf.";
  if (soilBonus && product.soilType === "outdoor_living_soil" && (issue === "focus" || issue === "creativity")) return "Living soil — UV stress elevated the terpinolene beyond what the same genetics produce indoors.";
  if (bonusTerpFound) return profile.primary.charAt(0).toUpperCase() + profile.primary.slice(1) + "-forward with " + bonusTerpFound + " — rare combination. Full-spectrum " + issueLabel.toLowerCase() + " profile.";
  if (primaryDriven && product.tier >= 4) return profile.primary.charAt(0).toUpperCase() + profile.primary.slice(1) + "-dominant, full-spectrum expression. Right terpene profile, no shortcuts.";
  if (primaryDriven) return "Real " + profile.primary + " expression from flash-frozen plant material. Solid " + issueLabel.toLowerCase() + " match.";
  return "Best available " + issueLabel.toLowerCase() + " match on today's menu.";
}

const STRAIN_COLORS = {
  indica:  { bg:"#1C2E0E", text:"#A8D46A" },
  sativa:  { bg:"#0E1C2C", text:"#5AAED4" },
  hybrid:  { bg:"#2C1E2C", text:"#C47BD4" },
};

const FORMAT_LABEL = { flower:"Flower", live_resin:"Live Resin", solventless:"Live Rosin", rso:"RSO", co2_extract:"CO₂", edible:"Edible", preroll:"Pre-Roll", topical:"Topical" };

const FORMAT_ISSUE_REDIRECT = {
  edible:  { focus:"Edibles don't carry the terpinolene or pinene needed for focus. Try live resin or flower.", creativity:"No edible on the CA shelf delivers meaningful terpinolene. Recommend sativa live resin or Durban Poison flower.", arousal:"The terpene profile for arousal does not survive edible processing. Try sativa flower or a live resin cart." },
  preroll: { focus:"An infused pre-roll won't carry the focus profile. Try whole flower — Durban Poison or Jack Herer.", creativity:"Pre-rolls don't hit the terpinolene concentration needed for creativity. Recommend living soil sativa flower." },
};
const getRedirectMessage = (pt, issue) => FORMAT_ISSUE_REDIRECT[pt]?.[issue] || null;

// ─────────────────────────────────────────────
// DESIGN TOKENS
// ─────────────────────────────────────────────

const C = {
  bg:      "#0D1410",
  panel:   "#141C18",
  card:    "#1A2420",
  border:  "#253530",
  border2: "#2E4038",
  gold:    "#C9A84C",
  goldLo:  "#6B5520",
  green:   "#4E9E6E",
  greenLo: "#1E3828",
  text:    "#DDE8E0",
  dim:     "#7A9888",
  mute:    "#3A5045",
};

// ─────────────────────────────────────────────
// STEP DOTS
// ─────────────────────────────────────────────

function StepDots({ screen }) {
  const steps = ["issue", "severity", "producttype", "results"];
  const active = screen === "soil" ? "producttype" : screen;
  const idx = steps.indexOf(active);
  return (
    <div style={{ display:"flex", gap:5, alignItems:"center" }}>
      {steps.map((s,i) => {
        const on  = s === active;
        const past = idx > i;
        return <div key={s} style={{ width:on?20:6, height:6, borderRadius:3, background:on?C.gold:past?C.goldLo:C.border2, transition:"all 0.3s" }} />;
      })}
    </div>
  );
}

// ─────────────────────────────────────────────
// SHARED BACK BUTTON
// ─────────────────────────────────────────────

function Back({ onClick, crumb }) {
  return (
    <div style={{ marginBottom:20 }}>
      <button onClick={onClick} style={{ background:"none", border:"none", color:C.green, fontSize:13, cursor:"pointer", padding:0, fontFamily:"inherit", display:"flex", alignItems:"center", gap:4, marginBottom:6 }}>
        ← back
      </button>
      {crumb && <div style={{ fontSize:11, color:C.mute, letterSpacing:"0.08em", textTransform:"uppercase" }}>{crumb}</div>}
    </div>
  );
}

// ─────────────────────────────────────────────
// ISSUE SCREEN
// ─────────────────────────────────────────────

function IssueScreen({ onSelect }) {
  const [hov, setHov] = useState(null);
  return (
    <div style={{ padding:"24px 22px 0" }}>
      <div style={{ fontSize:26, fontWeight:800, color:C.text, letterSpacing:"-0.02em", marginBottom:4 }}>What's the goal?</div>
      <div style={{ fontSize:13, color:C.dim, marginBottom:22 }}>Select the primary concern</div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, paddingBottom:24 }}>
        {ISSUES.map(issue => (
          <button key={issue.id} onClick={() => onSelect(issue.id)}
            onMouseEnter={() => setHov(issue.id)} onMouseLeave={() => setHov(null)}
            style={{ display:"flex", alignItems:"center", gap:10, padding:"13px 14px",
              background: hov===issue.id ? C.card : "transparent",
              border:`1px solid ${hov===issue.id ? issue.accent+"44" : C.border}`,
              borderRadius:12, cursor:"pointer", textAlign:"left", transition:"all 0.15s",
              boxShadow: hov===issue.id ? `0 0 18px ${issue.accent}12` : "none" }}>
            <span style={{ width:32, height:32, borderRadius:8, background:issue.accent+"1A", display:"flex", alignItems:"center", justifyContent:"center", fontSize:15, flexShrink:0 }}>
              {issue.emoji}
            </span>
            <span style={{ fontSize:13, fontWeight:600, color:hov===issue.id?C.text:C.dim, transition:"color 0.15s" }}>
              {issue.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// SEVERITY SCREEN
// ─────────────────────────────────────────────

function SeverityScreen({ issue, onSelect, onBack }) {
  const io = ISSUES.find(i => i.id === issue);
  const [hov, setHov] = useState(null);
  const dots = [C.green, C.gold, "#C45C5C"];
  return (
    <div style={{ padding:"24px 22px 0" }}>
      <Back onClick={onBack} crumb={`${io?.emoji}  ${io?.label}`} />
      <div style={{ fontSize:26, fontWeight:800, color:C.text, letterSpacing:"-0.02em", marginBottom:4 }}>How severe?</div>
      <div style={{ fontSize:13, color:C.dim, marginBottom:22 }}>Sets the THC window and scoring threshold</div>
      <div style={{ display:"flex", flexDirection:"column", gap:8, paddingBottom:24 }}>
        {SEVERITIES.map((s,i) => (
          <button key={s.id} onClick={() => onSelect(s.id)}
            onMouseEnter={() => setHov(s.id)} onMouseLeave={() => setHov(null)}
            style={{ padding:"18px 20px", background:hov===s.id?C.card:"transparent",
              border:`1px solid ${hov===s.id?C.border2:C.border}`, borderRadius:12,
              cursor:"pointer", textAlign:"left", display:"flex", justifyContent:"space-between",
              alignItems:"center", transition:"all 0.15s", fontFamily:"inherit" }}>
            <div>
              <div style={{ fontSize:16, fontWeight:700, color:C.text }}>{s.label}</div>
              <div style={{ fontSize:12, color:C.mute, marginTop:3 }}>{s.sub}</div>
            </div>
            <div style={{ width:8, height:8, borderRadius:"50%", background:dots[i], opacity:0.7 }} />
          </button>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// PRODUCT TYPE SCREEN
// ─────────────────────────────────────────────

function ProductTypeScreen({ issue, severity, onSelect, onBack }) {
  const io = ISSUES.find(i => i.id === issue);
  const [hov, setHov] = useState(null);
  return (
    <div style={{ padding:"24px 22px 0" }}>
      <Back onClick={onBack} crumb={`${io?.emoji}  ${io?.label}  ·  ${severity}`} />
      <div style={{ fontSize:26, fontWeight:800, color:C.text, letterSpacing:"-0.02em", marginBottom:4 }}>What format?</div>
      <div style={{ fontSize:13, color:C.dim, marginBottom:22 }}>Flower also asks about soil type</div>
      <div style={{ display:"flex", flexDirection:"column", gap:8, paddingBottom:24 }}>
        {PRODUCT_TYPES.map(pt => (
          <button key={pt.id} onClick={() => onSelect(pt.id)}
            onMouseEnter={() => setHov(pt.id)} onMouseLeave={() => setHov(null)}
            style={{ display:"flex", alignItems:"center", gap:16, padding:"16px 18px",
              background:hov===pt.id?C.card:"transparent",
              border:`1px solid ${hov===pt.id?C.border2:C.border}`,
              borderRadius:12, cursor:"pointer", textAlign:"left", transition:"all 0.15s", fontFamily:"inherit" }}>
            <span style={{ width:42, height:42, borderRadius:10, background:C.card, border:`1px solid ${C.border2}`,
              display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>
              {pt.emoji}
            </span>
            <div>
              <div style={{ fontSize:15, fontWeight:700, color:C.text }}>{pt.label}</div>
              <div style={{ fontSize:12, color:C.mute, marginTop:3 }}>{pt.sub}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// SOIL SCREEN
// ─────────────────────────────────────────────

function SoilScreen({ issue, severity, onSelect, onBack }) {
  const io = ISSUES.find(i => i.id === issue);
  const [hov, setHov] = useState(null);
  return (
    <div style={{ padding:"24px 22px 0" }}>
      <Back onClick={onBack} crumb={`${io?.emoji}  ${io?.label}  ·  ${severity}  ·  Flower`} />
      <div style={{ fontSize:26, fontWeight:800, color:C.text, letterSpacing:"-0.02em", marginBottom:4 }}>Grow type?</div>
      <div style={{ fontSize:13, color:C.dim, marginBottom:22 }}>Affects terpene expression — especially for focus and creativity</div>
      <div style={{ display:"flex", flexDirection:"column", gap:8, paddingBottom:24 }}>
        {SOIL_TYPES.map(soil => (
          <button key={soil.id} onClick={() => onSelect(soil.id)}
            onMouseEnter={() => setHov(soil.id)} onMouseLeave={() => setHov(null)}
            style={{ padding:"16px 18px", background:hov===soil.id?C.card:"transparent",
              border:`1px solid ${hov===soil.id?C.border2:C.border}`, borderRadius:12,
              cursor:"pointer", textAlign:"left", display:"flex", justifyContent:"space-between",
              alignItems:"center", transition:"all 0.15s", fontFamily:"inherit" }}>
            <div>
              <div style={{ fontSize:15, fontWeight:700, color:C.text }}>{soil.label}</div>
              <div style={{ fontSize:12, color:C.mute, marginTop:3 }}>{soil.sub}</div>
            </div>
            {soil.id === "outdoor_living_soil" && (
              <span style={{ fontSize:10, color:C.gold, letterSpacing:"0.08em", textTransform:"uppercase", fontWeight:700 }}>+TERPS</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// SCORE BAR
// ─────────────────────────────────────────────

function ScoreBar({ score }) {
  const color = score >= 60 ? C.green : score >= 38 ? C.gold : C.dim;
  const pct = Math.min(100, Math.round((score/85)*100));
  return (
    <div style={{ display:"flex", alignItems:"center", gap:10, marginTop:10 }}>
      <div style={{ flex:1, height:2, background:C.border, borderRadius:1, overflow:"hidden" }}>
        <div style={{ width:`${pct}%`, height:"100%", background:color, borderRadius:1, transition:"width 0.5s ease" }} />
      </div>
      <span style={{ fontSize:11, fontWeight:700, color, minWidth:22, textAlign:"right", letterSpacing:"0.04em" }}>{score}</span>
    </div>
  );
}

// ─────────────────────────────────────────────
// TIER BADGE
// ─────────────────────────────────────────────

const TIER_COLORS = {
  flower:      { bg:"#1C2E0E", text:"#A8D46A" },
  solventless: { bg:"#0E2420", text:"#5BD4A0" },
  live_resin:  { bg:"#0E1C2C", text:"#5AAED4" },
  rso:         { bg:"#2C1E0E", text:"#D4A44A" },
  co2_extract: { bg:"#1C1C2C", text:"#9A8AD4" },
  topical:     { bg:"#2C1E1E", text:"#D48A8A" },
  edible:      { bg:"#2C200E", text:"#D4B44A" },
  preroll:     { bg:"#1A1A18", text:"#8A9888" },
};

function StrainBadge({ strainType }) {
  if (!strainType) return null;
  const col = STRAIN_COLORS[strainType] || { bg:"#1A1A18", text:"#8A9888" };
  return (
    <span style={{ fontSize:10, fontWeight:700, padding:"3px 7px", borderRadius:6,
      background:col.bg, color:col.text, letterSpacing:"0.06em", textTransform:"uppercase", whiteSpace:"nowrap" }}>
      {strainType}
    </span>
  );
}

function TierBadge({ format }) {
  const col = TIER_COLORS[format] || { bg:C.card, text:C.dim };
  return (
    <span style={{ fontSize:10, fontWeight:700, padding:"3px 8px", borderRadius:6,
      background:col.bg, color:col.text, letterSpacing:"0.06em", textTransform:"uppercase", whiteSpace:"nowrap" }}>
      {FORMAT_LABEL[format] || format}
    </span>
  );
}

// ─────────────────────────────────────────────
// RESULT CARD
// ─────────────────────────────────────────────

function ResultCard({ result, rank, issue, onDismiss }) {
  const { product, score } = result;
  const oneLiner = generateOneLiner(result, issue);
  const isTop = rank === 0;
  return (
    <div style={{ background:isTop?C.card:"transparent", border:`1px solid ${isTop?C.border2:C.border}`,
      borderRadius:14, padding:"16px 18px", marginBottom:10, position:"relative", overflow:"hidden" }}>
      {isTop && <div style={{ position:"absolute", top:0, left:0, right:0, height:2,
        background:`linear-gradient(90deg, ${C.gold}, transparent)` }} />}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:8 }}>
        <div style={{ flex:1, minWidth:0 }}>
          {isTop && <div style={{ fontSize:10, color:C.gold, letterSpacing:"0.1em", fontWeight:700, marginBottom:4 }}>TOP MATCH</div>}
          <div style={{ fontSize:16, fontWeight:700, color:C.text, letterSpacing:"-0.01em" }}>{product.name}</div>
          <div style={{ fontSize:12, color:C.mute, marginTop:2 }}>{product.brand}</div>
        </div>
        <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:4 }}>
          <TierBadge format={product.format} />
          <StrainBadge strainType={product.strainType} />
        </div>
      </div>
      <ScoreBar score={score} />
      <div style={{ marginTop:12, padding:"10px 12px", background:C.bg, borderRadius:8,
        border:`1px solid ${C.border}`, fontSize:13, color:C.dim, lineHeight:1.65, fontStyle:"italic" }}>
        {oneLiner}
      </div>
      <button onClick={() => onDismiss(product.id)}
        style={{ marginTop:10, width:"100%", padding:"7px", background:"transparent",
          border:`1px solid ${C.border}`, borderRadius:8, fontSize:11, color:C.mute,
          cursor:"pointer", letterSpacing:"0.04em", fontFamily:"inherit", transition:"all 0.15s" }}
        onMouseEnter={e => { e.currentTarget.style.borderColor=C.border2; e.currentTarget.style.color=C.dim; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor=C.border; e.currentTarget.style.color=C.mute; }}>
        Not on menu — show next
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────
// RESULTS SCREEN
// ─────────────────────────────────────────────

function ResultsScreen({ issue, severity, soilType, productType, onBack, onReset }) {
  const [dismissed, setDismissed] = useState([]);
  const io  = ISSUES.find(i => i.id === issue);
  const pt  = PRODUCT_TYPES.find(p => p.id === productType);
  const sl  = SOIL_TYPES.find(s => s.id === soilType);
  const all = getResults(issue, severity, soilType, productType);
  const vis = all.filter(r => !dismissed.includes(r.product.id));
  const redir = getRedirectMessage(productType, issue);

  const Pill = ({ label }) => (
    <span style={{ fontSize:11, padding:"3px 9px", borderRadius:20,
      background:C.card, border:`1px solid ${C.border2}`, color:C.dim, letterSpacing:"0.02em" }}>
      {label}
    </span>
  );

  return (
    <>
      <div style={{ padding:"24px 22px 0" }}>
        <Back onClick={onBack} />
        <div style={{ background:C.card, border:`1px solid ${C.border2}`, borderRadius:12,
          padding:"14px 16px", marginBottom:20, display:"flex", justifyContent:"space-between",
          alignItems:"center", flexWrap:"wrap", gap:8 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <span style={{ fontSize:20 }}>{io?.emoji}</span>
            <span style={{ fontSize:16, fontWeight:700, color:C.text }}>{io?.label}</span>
          </div>
          <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
            <Pill label={`${pt?.emoji} ${pt?.label}`} />
            <Pill label={severity} />
            {soilType !== "any" && <Pill label={sl?.label} />}
          </div>
        </div>

        {all.length === 0 || redir ? (
          <div style={{ background:C.card, border:`1px solid ${C.border2}`, borderRadius:12, padding:20 }}>
            <div style={{ fontSize:14, fontWeight:700, color:C.text, marginBottom:8 }}>No match for this combination</div>
            <div style={{ fontSize:13, lineHeight:1.7, color:C.dim }}>
              {redir || "No products matched this profile. Try a different format or adjust severity."}
            </div>
          </div>
        ) : vis.length === 0 && dismissed.length > 0 ? (
          <div style={{ background:C.card, border:`1px solid ${C.border2}`, borderRadius:12, padding:20, textAlign:"center" }}>
            <div style={{ fontSize:15, fontWeight:700, color:C.text, marginBottom:6 }}>All options dismissed</div>
            <div style={{ fontSize:13, color:C.dim }}>Nothing else scores above threshold. Try a different product type or ask about incoming stock.</div>
          </div>
        ) : (
          <>
            <div style={{ fontSize:11, color:C.mute, marginBottom:14, letterSpacing:"0.04em", textTransform:"uppercase" }}>
              {vis.length} of {all.length} — tap "not on menu" to reveal more
            </div>
            {vis.map((r,i) => (
              <ResultCard key={r.product.id} result={r} rank={i} issue={issue}
                onDismiss={id => setDismissed(p => [...p, id])} />
            ))}
          </>
        )}
      </div>

      <button onClick={onReset}
        style={{ display:"block", margin:"20px 22px 28px", padding:"14px", width:"calc(100% - 44px)",
          background:`linear-gradient(135deg, ${C.greenLo}, ${C.green})`,
          color:"#FFF", border:"none", borderRadius:12, fontSize:15, fontWeight:700,
          cursor:"pointer", letterSpacing:"0.01em", fontFamily:"inherit",
          boxShadow:`0 4px 24px ${C.green}30` }}>
        New Lookup
      </button>
    </>
  );
}

// ─────────────────────────────────────────────
// APP
// ─────────────────────────────────────────────

function AgeGate({ onVerified }) {
  const [month, setMonth] = useState("");
  const [day, setDay]     = useState("");
  const [year, setYear]   = useState("");
  const [error, setError] = useState(false);

  function verify() {
    const m = parseInt(month), d = parseInt(day), y = parseInt(year);
    if (!m || !d || !y || year.length !== 4) { setError(true); return; }
    const dob = new Date(y, m - 1, d);
    const age = (new Date() - dob) / (1000 * 60 * 60 * 24 * 365.25);
    if (age >= 21) { onVerified(); }
    else { setError(true); }
  }

  const inputStyle = {
    background: C.card, border: `1px solid ${error ? "#C45C5C" : C.border2}`,
    borderRadius: 8, color: C.text, fontSize: 18, fontWeight: 700,
    textAlign: "center", padding: "12px 0", fontFamily: "inherit",
    outline: "none", width: "100%",
  };

  return (
    <div style={{ minHeight:"100vh", background:C.bg, display:"flex", justifyContent:"center", fontFamily:"'DM Sans', system-ui, sans-serif" }}>
      <div style={{ width:"100%", maxWidth:480, background:C.panel, minHeight:"100vh", display:"flex", flexDirection:"column", justifyContent:"center", padding:"0 32px" }}>
        <div style={{ textAlign:"center", marginBottom:40 }}>
          <div style={{ width:56, height:56, background:`linear-gradient(135deg, ${C.greenLo}, ${C.green})`, borderRadius:14, display:"flex", alignItems:"center", justifyContent:"center", fontSize:28, margin:"0 auto 16px", boxShadow:`0 4px 20px ${C.green}30` }}>🌿</div>
          <div style={{ fontSize:22, fontWeight:800, color:C.text, letterSpacing:"-0.02em" }}>GreenForge</div>
          <div style={{ fontSize:11, color:C.mute, letterSpacing:"0.14em", textTransform:"uppercase", marginTop:4 }}>Pharmacognosy Engine · San Joaquin Valley</div>
        </div>

        <div style={{ background:C.card, border:`1px solid ${C.border2}`, borderRadius:16, padding:"28px 24px" }}>
          <div style={{ fontSize:18, fontWeight:700, color:C.text, marginBottom:6, letterSpacing:"-0.01em" }}>Age Verification Required</div>
          <div style={{ fontSize:13, color:C.dim, marginBottom:24, lineHeight:1.6 }}>
            You must be <strong style={{color:C.text}}>21 or older</strong> to access this application. Enter your date of birth to continue.
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1.4fr", gap:8, marginBottom:16 }}>
            <div>
              <div style={{ fontSize:10, color:C.mute, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:6 }}>Month</div>
              <input type="number" placeholder="MM" min="1" max="12" value={month}
                onChange={e => { setMonth(e.target.value); setError(false); }} style={inputStyle} />
            </div>
            <div>
              <div style={{ fontSize:10, color:C.mute, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:6 }}>Day</div>
              <input type="number" placeholder="DD" min="1" max="31" value={day}
                onChange={e => { setDay(e.target.value); setError(false); }} style={inputStyle} />
            </div>
            <div>
              <div style={{ fontSize:10, color:C.mute, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:6 }}>Year</div>
              <input type="number" placeholder="YYYY" min="1900" max="2099" value={year}
                onChange={e => { setYear(e.target.value); setError(false); }} style={inputStyle} />
            </div>
          </div>

          {error && (
            <div style={{ fontSize:12, color:"#C45C5C", marginBottom:14, textAlign:"center", letterSpacing:"0.02em" }}>
              You must be 21 or older to use this application.
            </div>
          )}

          <button onClick={verify} style={{ width:"100%", padding:"14px", background:`linear-gradient(135deg, ${C.greenLo}, ${C.green})`, color:"#FFF", border:"none", borderRadius:12, fontSize:15, fontWeight:700, cursor:"pointer", fontFamily:"inherit", boxShadow:`0 4px 20px ${C.green}25`, letterSpacing:"0.01em" }}>
            Confirm Age &amp; Enter
          </button>
        </div>

        <div style={{ marginTop:20, fontSize:11, color:C.mute, textAlign:"center", lineHeight:1.7, padding:"0 8px" }}>
          For use by persons 21+ only. Must be 18+ with valid California medical recommendation.
          Keep out of reach of children. Do not use while pregnant or breastfeeding.
        </div>

        <div style={{ marginTop:16, background:C.card, border:`1px solid ${C.border}`, borderRadius:10, padding:"12px 14px" }}>
          <div style={{ fontSize:10, fontWeight:700, color:"#C45C5C", letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:4 }}>Government Warning</div>
          <div style={{ fontSize:11, color:C.mute, lineHeight:1.6 }}>
            This product contains cannabis, a Schedule I controlled substance under federal law. Cannabis use may impair concentration, coordination, and judgment. Do not operate a vehicle or machinery under the influence.
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [verified, setVerified]         = useState(false);
  const [screen, setScreen]             = useState("issue");
  const [issue, setIssue]               = useState(null);
  const [severity, setSeverity]         = useState(null);
  const [soilType, setSoilType]         = useState(null);
  const [productType, setProductType]   = useState(null);

  const handleIssueSelect       = id => { setIssue(id);       setScreen("severity"); };
  const handleSeveritySelect    = id => { setSeverity(id);    setScreen("producttype"); };
  const handleProductTypeSelect = id => { setProductType(id); id === "flower" ? setScreen("soil") : (setSoilType("any"), setScreen("results")); };
  const handleSoilSelect        = id => { setSoilType(id);    setScreen("results"); };
  const handleReset = () => { setIssue(null); setSeverity(null); setSoilType(null); setProductType(null); setScreen("issue"); };

  if (!verified) return <AgeGate onVerified={() => setVerified(true)} />;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { background: #0D1410; min-height: 100vh; }
        button { font-family: 'DM Sans', system-ui, sans-serif; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #2E4038; border-radius: 2px; }
      `}</style>

      <div style={{ minHeight:"100vh", background:C.bg, display:"flex", justifyContent:"center",
        fontFamily:"'DM Sans', system-ui, sans-serif" }}>
        <div style={{ width:"100%", maxWidth:480, background:C.panel, minHeight:"100vh", display:"flex", flexDirection:"column" }}>

          {/* Header */}
          <div style={{ padding:"18px 22px 16px", borderBottom:`1px solid ${C.border}`,
            display:"flex", alignItems:"center", gap:12, position:"sticky", top:0, zIndex:10, background:C.panel }}>
            <div style={{ width:36, height:36, background:`linear-gradient(135deg, ${C.greenLo}, ${C.green})`,
              borderRadius:9, display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:18, boxShadow:`0 2px 12px ${C.green}30`, flexShrink:0 }}>
              🌿
            </div>
            <div>
              <div style={{ fontSize:16, fontWeight:800, color:C.text, letterSpacing:"-0.01em" }}>GreenForge</div>
              <div style={{ fontSize:9, color:C.mute, letterSpacing:"0.14em", textTransform:"uppercase", marginTop:1 }}>
                Pharmacognosy Engine
              </div>
            </div>
            <div style={{ marginLeft:"auto" }}>
              <StepDots screen={screen} />
            </div>
          </div>

          {/* Screens */}
          {screen === "issue"       && <IssueScreen onSelect={handleIssueSelect} />}
          {screen === "severity"    && <SeverityScreen issue={issue} onSelect={handleSeveritySelect} onBack={() => setScreen("issue")} />}
          {screen === "producttype" && <ProductTypeScreen issue={issue} severity={severity} onSelect={handleProductTypeSelect} onBack={() => setScreen("severity")} />}
          {screen === "soil"        && <SoilScreen issue={issue} severity={severity} onSelect={handleSoilSelect} onBack={() => setScreen("producttype")} />}
          {screen === "results"     && <ResultsScreen issue={issue} severity={severity} soilType={soilType} productType={productType}
            onBack={() => productType === "flower" ? setScreen("soil") : setScreen("producttype")} onReset={handleReset} />}
        </div>
      </div>
    </>
  );
}