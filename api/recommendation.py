import sqlite3
import os
from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Dict, Any

router = APIRouter(prefix="/api/v1")
DB_PATH = os.path.join("data", "greenforge.db")


class Compound(BaseModel):
    name: str
    val: float


class Condition(BaseModel):
    name: str
    severity: int


class Product(BaseModel):
    name: str
    growStyle: str
    compounds: List[Compound]


class RecommendationRequest(BaseModel):
    user_profile: Dict[str, Any]
    product_list: List[Product]


def fahrenheit_to_celsius(fahrenheit: float) -> float:
    """Convert Fahrenheit to Celsius."""
    return round((fahrenheit - 32) / 1.8, 1)


def celsius_to_fahrenheit(celsius: float) -> float:
    """Convert Celsius to Fahrenheit."""
    return round(celsius * 1.8 + 32, 1)


def get_compound_data(compound_name: str) -> Dict[str, Any] | None:
    """Retrieve full compound data including boiling point and multipliers."""
    if not os.path.exists(DB_PATH):
        return None
    
    conn = None
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        # Check cannabinoids
        try:
            cursor.execute(
                "SELECT name, boiling_point FROM cannabinoids WHERE name = ? COLLATE NOCASE", 
                (compound_name,)
            )
            row = cursor.fetchone()
            if row:
                return {
                    "name": row[0], 
                    "boiling_point_c": float(row[1]),
                    "boiling_point_f": celsius_to_fahrenheit(float(row[1])),
                    "type": "cannabinoid"
                }
        except sqlite3.Error:
            pass
        
        # Check terpenes
        try:
            cursor.execute(
                "SELECT name, boiling_point FROM terpenes WHERE name = ? COLLATE NOCASE", 
                (compound_name,)
            )
            row = cursor.fetchone()
            if row:
                return {
                    "name": row[0], 
                    "boiling_point_c": float(row[1]),
                    "boiling_point_f": celsius_to_fahrenheit(float(row[1])),
                    "type": "terpene"
                }
        except sqlite3.Error:
            pass
        
        # Check flavonoids with synergy multiplier
        try:
            cursor.execute(
                "SELECT name, boiling_point, synergy_multiplier FROM flavonoids WHERE name = ? COLLATE NOCASE", 
                (compound_name,)
            )
            row = cursor.fetchone()
            if row:
                return {
                    "name": row[0], 
                    "boiling_point_c": float(row[1]),
                    "boiling_point_f": celsius_to_fahrenheit(float(row[1])),
                    "synergy_multiplier": float(row[2]) if row[2] else 1.0,
                    "type": "flavonoid"
                }
        except sqlite3.Error:
            pass
        
        # Check minor cannabinoids
        try:
            cursor.execute(
                "SELECT name, boiling_point, efficacy_weight FROM minor_cannabinoids WHERE name = ? COLLATE NOCASE", 
                (compound_name,)
            )
            row = cursor.fetchone()
            if row:
                return {
                    "name": row[0], 
                    "boiling_point_c": float(row[1]),
                    "boiling_point_f": celsius_to_fahrenheit(float(row[1])),
                    "efficacy_weight": float(row[2]) if row[2] else 1.0,
                    "type": "minor_cannabinoid"
                }
        except sqlite3.Error:
            pass
        
        return None
    finally:
        if conn:
            conn.close()


def apply_cultivation_modifiers(compound_name: str, compound_type: str, 
                                grow_style: str, base_value: float) -> float:
    """
    Apply grow-style dependent multipliers based on research.
    Research: UV-B increases flavonoids 1.4x, Living Soil increases terpene diversity 1.25x
    """
    modified_value = base_value
    grow_lower = grow_style.lower()
    
    # UV-B Response (Sun-grown, Outdoor)
    if grow_lower in ['sun_grown', 'sunlight', 'outdoor', 'sun-grown']:
        if compound_type == "flavonoid" and compound_name.lower() in ['quercetin', 'cannflavin a', 'cannflavin b']:
            # Research: UV-B upregulates flavonoid biosynthesis 1.3-1.5x
            modified_value *= 1.4
            
    # Rhizosphere Ecology (Living Soil, Organic)
    elif grow_lower in ['living_soil', 'living-soil', 'organic', 'soil']:
        if compound_type == "terpene" and compound_name.lower() in ['caryophyllene', 'β-caryophyllene', 'humulene']:
            # Research: Soil microbiome increases sesquiterpenes 1.25x
            modified_value *= 1.25
        elif compound_type == "flavonoid":
            # Research: Systemic Acquired Resistance increases flavonoid diversity
            modified_value *= 1.25
            
    # Crop Steering / Drought Stress
    elif grow_lower in ['drought_stress', 'crop_steering', 'generative']:
        # Research: Water deficit concentrates secondary metabolites 1.15x
        modified_value *= 1.15
        
    # Hydroponic (High potency, low diversity)
    elif grow_lower in ['hydroponic', 'hydro', 'rockwool', 'coco']:
        if compound_type == "cannabinoid" and compound_name.upper() in ['THC', 'CBD']:
            # Research: Hydro increases major cannabinoid mass 1.10x
            modified_value *= 1.10
        elif compound_type == "flavonoid":
            # Research: Sterile systems reduce flavonoid diversity 0.80x
            modified_value *= 0.80
    
    return modified_value


def calculate_thermal_availability(compounds: List[Compound], temp_f: float) -> Dict[str, Any]:
    """
    Calculate thermal release efficiency based on interface temperature.
    Research: Gradual vaporization begins 36°F (20°C) below boiling point
    DEGRADATION: Cannabinoids degrade >90°F above boiling point
    """
    availability = {}
    details = {}
    
    for compound in compounds:
        data = get_compound_data(compound.name)
        if data and data.get("boiling_point_f"):
            bp_f = data["boiling_point_f"]
            temp_margin = temp_f - bp_f
            
            degradation_start_offset = 40  # Degrees F above boiling point where degradation begins
            degradation_rate = 0.02       # Rate of availability loss per degree F above the offset
            
            compound_type = data.get("type")

            # Handle degradation for volatile compounds (cannabinoids and terpenes)
            if compound_type in ['cannabinoid', 'terpene'] and temp_f > bp_f + degradation_start_offset:
                excess_heat = temp_f - (bp_f + degradation_start_offset)
                degradation_factor = max(0.0, 1.0 - (excess_heat * degradation_rate))
                
                availability[compound.name] = degradation_factor
                details[compound.name] = {
                    "available": round(degradation_factor, 2),
                    "boiling_point_f": bp_f,
                    "status": "degrading",
                    "temp_margin": round(temp_f - bp_f, 1),
                    "warning": f"⚠️ Degrading at {round(temp_f - bp_f, 1)}°F above boiling point"
                }
            # If not degrading or compound type doesn't degrade this way, check other statuses
            elif temp_f >= bp_f:
                # Full availability above boiling point (but not overheated)
                availability[compound.name] = 1.0
                details[compound.name] = {
                    "available": 1.0,
                    "boiling_point_f": bp_f,
                    "status": "fully_active",
                    "temp_margin": round(temp_f - bp_f, 1)
                }
            elif temp_f >= (bp_f - 36):  # 36°F = 20°C gradient
                # Partial availability within 36°F of boiling point
                availability[compound.name] = (temp_f - (bp_f - 36)) / 36
                details[compound.name] = {
                    "available": round(availability[compound.name], 2),
                    "boiling_point_f": bp_f,
                    "status": "partially_active",
                    "needed_temp_f": round(bp_f, 1)
                }
            else:
                # Locked below threshold
                availability[compound.name] = 0.0
                details[compound.name] = {
                    "available": 0.0,
                    "boiling_point_f": bp_f,
                    "status": "locked",
                    "needed_temp_f": round(bp_f, 1),
                    "deficit": round(bp_f - temp_f, 1)
                }
        
        else:
            # No boiling point data - assume available (conservative approach)
            availability[compound.name] = 1.0
            details[compound.name] = {
                "available": 1.0,
                "boiling_point_f": None,
                "status": "assumed_active"
            }
    
    return {"availability": availability, "details": details}


def calculate_entourage_effect(compounds: List[Compound], availability: Dict[str, float]) -> Dict[str, Any]:
    """
    Calculate synergy bonus from multiple active compounds.
    Research: Multi-compound profiles enhance efficacy via entourage effect
    """
    active_compounds = sum(1 for c in compounds if availability.get(c.name, 0) > 0.5)
    
    # Base synergy: 2 compounds = 1.1x, 3 = 1.2x, 4 = 1.3x, etc.
    if active_compounds >= 2:
        multiplier = 1.0 + (active_compounds - 1) * 0.1
        return {
            "multiplier": round(multiplier, 2),
            "active_count": active_compounds,
            "message": f"{active_compounds} compounds creating entourage synergy"
        }
    return {
        "multiplier": 1.0,
        "active_count": active_compounds,
        "message": "Insufficient compound diversity for entourage effect"
    }


def get_thermal_safety_zone(temp_f: float) -> Dict[str, Any]:
    """
    Determine safety zone and risks based on temperature.
    Research: Benzene formation >401°F (205°C), pyrolysis >500°F
    """
    if temp_f < 311:  # <155°C
        return {
            "zone": "A - Flavor/Cerebral",
            "risk": "LOW",
            "description": "Volatile terpenes only, minimal cannabinoid activation",
            "warnings": ["Many therapeutic compounds unavailable"]
        }
    elif temp_f < 365:  # 155-185°C
        return {
            "zone": "B - Medical/Entourage",
            "risk": "LOW",
            "description": "Optimal cannabinoid + cannflavin activation",
            "warnings": []
        }
    elif temp_f < 401:  # 185-205°C
        return {
            "zone": "C - High Extraction",
            "risk": "MEDIUM",
            "description": "Maximum cannabinoid extraction approaching benzene threshold",
            "warnings": ["Nearing benzene formation risk"]
        }
    elif temp_f < 482:  # 205-250°C
        return {
            "zone": "D - High Risk",
            "risk": "HIGH",
            "description": "⚠️ BENZENE FORMATION: Significant toxin risk",
            "warnings": ["Benzene and methacrolein formation", "Terpene degradation"]
        }
    else:  # >250°C
        return {
            "zone": "E - Combustion/Destructive",
            "risk": "CRITICAL",
            "description": "🔥 PYROLYSIS: Full combustion with carcinogens",
            "warnings": ["Tar formation", "PAH carcinogens", "Compound destruction"]
        }


def calculate_quantum_match(
    conditions: List[Condition], 
    compounds: List[Compound], 
    temp_f: float,
    grow_style: str
) -> Dict[str, Any]:
    """
    Integrated pharmacognosy engine with all research-based logic blocks.
    """
    
    if not compounds:
        return {
            "score": 0.0,
            "breakdown": {"error": "No compounds provided"},
            "warnings": ["Empty product"],
            "thermal_details": {}
        }
    
    if not conditions:
        return {
            "score": 0.0,
            "breakdown": {"error": "No conditions provided"},
            "warnings": ["No conditions specified"],
            "thermal_details": {}
        }
    
    # Extract key compounds (case-insensitive)
    compound_dict = {c.name.upper(): c.val for c in compounds}
    thc = compound_dict.get('THC', 0.0)
    cbd = compound_dict.get('CBD', 0.0)
    
    # Calculate thermal availability
    thermal_data = calculate_thermal_availability(compounds, temp_f)
    availability = thermal_data["availability"]
    
    # Process all conditions (weighted by severity)
    total_score = 0.0
    total_weight = 0.0
    warnings = []
    breakdown = {}
    
    # Check thermal safety zone
    safety = get_thermal_safety_zone(temp_f)
    if safety["warnings"]:
        warnings.extend(safety["warnings"])
    
    for condition in conditions:
        cond_name = condition.name.lower()
        severity = condition.severity
        base_score = 0.0
        
        # Check for recreational intent
        rec_goals = ["blitzed", "high", "stoned", "faded", "blasted", "get high"]
        if any(goal in cond_name for goal in rec_goals):
            total_score += 100.0 * severity
            total_weight += severity
            breakdown[condition.name] = {"score": 100.0, "mode": "recreational"}
            continue
        
        # Categorize condition
        cognitive_needs = ["adhd", "focus", "clarity", "studying", "concentration", "memory"]
        somatic_needs = ["sleep", "insomnia", "pain", "inflammation", "nerve", "neuropathic", "migraine"]
        anxiety_needs = ["anxiety", "stress", "panic", "worry"]
        
        is_cognitive = any(need in cond_name for need in cognitive_needs)
        is_somatic = any(need in cond_name for need in somatic_needs)
        is_anxiety = any(need in cond_name for need in anxiety_needs)
        
        # Calculate base effectiveness with cultivation modifiers
        if is_cognitive:
            # Cognitive needs: penalize high THC, reward focus compounds
            signal = 0.0
            for c in compounds:
                if c.name.upper() in ['THCV', 'ALPHA-PINENE', 'PINENE', 'LIMONENE']:
                    # Apply cultivation modifiers
                    modified_val = apply_cultivation_modifiers(c.name, "cannabinoid", grow_style, c.val)
                    # Apply thermal availability
                    signal += modified_val * availability.get(c.name, 1.0)
            
            noise_penalty = max(0, (thc - 10) * 3.0)
            base_score = (signal * 40) - noise_penalty
            
            if thc > 20:
                warnings.append(f"⚠️ High THC ({thc}%) may impair cognitive function")
            if signal < 1.0:
                warnings.append("Low focus compound levels")
            
            breakdown[condition.name] = {
                "score": round(base_score, 1),
                "mode": "cognitive",
                "signal": round(signal, 2),
                "thc_penalty": round(noise_penalty, 1)
            }
        
        elif is_somatic:
            # Somatic needs: synergy between THC and therapeutic compounds
            therapeutic_signal = 0.0
            cannflavin_boost = 1.0
            
            for c in compounds:
                if c.name.upper() in ['CBD', 'CBN', 'CBG', 'MYRCENE', 'CARYOPHYLLENE', 'Β-CARYOPHYLLENE']:
                    modified_val = apply_cultivation_modifiers(c.name, "terpene", grow_style, c.val)
                    therapeutic_signal += modified_val * availability.get(c.name, 1.0)
                
                # RESEARCH: Cannflavin A = 30x aspirin potency for pain/inflammation
                # FIX: Corrected OR precedence to ensure this only applies to Cannflavin when pain/inflammation is present.
                if ('cannflavin' in c.name.lower() and ('pain' in cond_name or 'inflammation' in cond_name)):
                    modified_val = apply_cultivation_modifiers(c.name, "flavonoid", grow_style, c.val)
                    avail = availability.get(c.name, 0.0)
                    if avail > 0:
                        cannflavin_boost = 30.0
                        therapeutic_signal += modified_val * avail * 5.0
                        warnings.append(f"✓ Cannflavin A active: 30x aspirin anti-inflammatory potency @ {temp_f}°F")
                    else:
                        bp = thermal_data["details"].get(c.name, {}).get("boiling_point_f", 0)
                        warnings.append(f"🔒 Cannflavin A locked (needs {bp}°F, currently {temp_f}°F)")
            
            # Apply soil-grown flavonoid bonus
            flavonoid_bonus = 1.0
            if grow_style.lower() in ['soil', 'living_soil', 'organic', 'living-soil']:
                if cannflavin_boost > 1.0:
                    flavonoid_bonus = 1.3
                    warnings.append("✓ Living soil cultivation: Enhanced flavonoid bioavailability")
            
            base_score = ((therapeutic_signal * 8) + (thc * 1.2)) * flavonoid_bonus * cannflavin_boost
            
            breakdown[condition.name] = {
                "score": round(base_score, 1),
                "mode": "somatic",
                "signal": round(therapeutic_signal, 2),
                "thc_contribution": round(thc * 1.2, 1),
                "flavonoid_bonus": flavonoid_bonus,
                "cannflavin_multiplier": cannflavin_boost
            }
        
        elif is_anxiety:
            # Anxiety needs: CBD, calming terpenes, minimal THC
            calming_signal = 0.0
            
            for c in compounds:
                if c.name.upper() in ['CBD', 'LINALOOL', 'LIMONENE', 'MYRCENE', 'CBN', 'APIGENIN']:
                    modified_val = apply_cultivation_modifiers(c.name, "terpene", grow_style, c.val)
                    calming_signal += modified_val * availability.get(c.name, 1.0)
            
            thc_anxiety_penalty = max(0, (thc - 5) * 2.0)
            base_score = (calming_signal * 15) - thc_anxiety_penalty
            
            if thc > 15:
                warnings.append(f"⚠️ High THC ({thc}%) may exacerbate anxiety")
            
            breakdown[condition.name] = {
                "score": round(base_score, 1),
                "mode": "anxiety",
                "signal": round(calming_signal, 2),
                "thc_penalty": round(thc_anxiety_penalty, 1)
            }
        
        else:
            # General wellness
            base_score = sum(
                apply_cultivation_modifiers(c.name, "cannabinoid", grow_style, c.val) * 
                availability.get(c.name, 1.0) 
                for c in compounds
            ) * 3
            breakdown[condition.name] = {
                "score": round(base_score, 1),
                "mode": "general"
            }
        
        # Apply thermal gate penalties
        thermal_penalty = 1.0
        locked_compounds = [
            f"{c.name} (needs {thermal_data['details'][c.name]['needed_temp_f']}°F)"
            for c in compounds 
            if availability.get(c.name, 1.0) < 0.5 and c.val > 0.5 
            and 'needed_temp_f' in thermal_data['details'].get(c.name, {})
        ]
        if locked_compounds:
            thermal_penalty = 0.8  # Reduced penalty for locked compounds
            warnings.append(f"🔒 Thermal gate locked: {', '.join(locked_compounds)}")
        
        base_score *= thermal_penalty
        
        # Apply entourage effect
        entourage = calculate_entourage_effect(compounds, availability)
        if entourage["multiplier"] > 1.0:
            breakdown[condition.name]["entourage"] = entourage
            base_score *= entourage["multiplier"]
        
        # Weight by severity
        total_score += base_score * severity
        total_weight += severity
    
    # Calculate final weighted score
    final_score = (total_score / total_weight) if total_weight > 0 else 0.0
    final_score = round(min(100.0, max(0.0, final_score)), 1)
    
    # Market reality check
    if thc > 25 and sum(c.val for c in compounds if c.name.upper() != 'THC') < 2.0:
        warnings.append("⚠️ MARKET REALITY: High THC, low therapeutic compound profile")
    
    return {
        "score": final_score,
        "breakdown": breakdown,
        "warnings": warnings,
        "thermal_details": thermal_data["details"],
        "safety_zone": safety,
        "cultivation_modifiers_applied": True
    }


@router.post("/recommend")
async def get_recommendations(data: RecommendationRequest):
    """Generate product recommendations with full pharmacognosy analysis."""
    
    # Validate input
    if 'interface_temp' not in data.user_profile:
        return {"error": "Missing interface_temp in user_profile", "results": []}
    
    if 'conditions' not in data.user_profile or not data.user_profile['conditions']:
        return {"error": "Missing conditions in user_profile", "results": []}
    
    # Temperature is in Fahrenheit
    temp_f = float(data.user_profile['interface_temp'])
    conditions = [Condition(**c) for c in data.user_profile['conditions']]
    
    # Generate recommendations
    results = []
    for product in data.product_list:
        analysis = calculate_quantum_match(
            conditions, 
            product.compounds, 
            temp_f,
            product.growStyle
        )
        
        # Count available compounds
        thermal_details = analysis.get("thermal_details", {})
        compounds_available = sum(
            1 for detail in thermal_details.values() 
            if detail.get("available", 0) > 0.5
        )
        
        results.append({
            "product": product.name,
            "matchScore": analysis["score"],
            "growStyle": product.growStyle,
            "analysis": analysis["breakdown"],
            "warnings": analysis["warnings"],
            "thermal_details": thermal_details,
            "safety_zone": analysis["safety_zone"],
            "compounds_available": compounds_available,
            "compounds_total": len(product.compounds)
        })
    
    # Sort by match score
    results.sort(key=lambda x: x['matchScore'], reverse=True)
    
    return {
        "results": results,
        "interface_temp_f": temp_f,
        "interface_temp_c": fahrenheit_to_celsius(temp_f),
        "conditions_analyzed": [c.name for c in conditions],
        "research_version": "v2.0-pharmacognosy"
    }


@router.get("/compounds")
async def list_compounds():
    """List all available compounds in the database."""
    if not os.path.exists(DB_PATH):
        return {"error": "Database not found"}
    
    conn = None
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        compounds = {
            "cannabinoids": [],
            "terpenes": [],
            "flavonoids": [],
            "minor_cannabinoids": []
        }
        
        for table in compounds.keys():
            try:
                cursor.execute(f"SELECT name, boiling_point FROM {table} ORDER BY name")
                rows = cursor.fetchall()
                compounds[table] = [
                    {
                        "name": row[0], 
                        "boiling_point_f": celsius_to_fahrenheit(row[1]),
                        "boiling_point_c": row[1]
                    }
                    for row in rows
                ]
            except sqlite3.Error:
                pass
        
        return compounds
    finally:
        if conn:
            conn.close()


@router.get("/thermal-zones")
async def get_thermal_zones():
    """Return all thermal activation zones with safety information."""
    zones = [
        {
            "name": "A - Flavor/Cerebral",
            "temp_range_f": "< 311°F (< 155°C)",
            "risk": "LOW",
            "active_compounds": "Pinene, light terpenes",
            "recommended_for": "Microdosing, flavor appreciation"
        },
        {
            "name": "B - Medical/Entourage",
            "temp_range_f": "311-365°F (155-185°C)",
            "risk": "LOW",
            "active_compounds": "THC, CBD, Cannflavin A, most terpenes",
            "recommended_for": "Pain, anxiety, inflammation (optimal zone)"
        },
        {
            "name": "C - High Extraction",
            "temp_range_f": "365-401°F (185-205°C)",
            "risk": "MEDIUM",
            "active_compounds": "THCV, CBN, high-boiling cannabinoids",
            "recommended_for": "Maximum cannabinoid extraction"
        },
        {
            "name": "D - High Risk",
            "temp_range_f": "401-482°F (205-250°C)",
            "risk": "HIGH",
            "active_compounds": "Quercetin (antiviral), BUT benzene formation",
            "recommended_for": "NOT RECOMMENDED - toxin risk"
        },
        {
            "name": "E - Combustion",
            "temp_range_f": "> 482°F (> 250°C)",
            "risk": "CRITICAL",
            "active_compounds": "All compounds + tar, PAHs, carcinogens",
            "recommended_for": "AVOID - use vaporization instead"
        }
    ]
    return {"zones": zones, "research_citation": "Cannabis Biosynthesis PDF"}


@router.get("/strains/{strain_name}")
async def get_strain_variants(strain_name: str):
    """Get all grow context variants for a strain from Phase 1 library."""
    if not os.path.exists(DB_PATH):
        return {"error": "Database not found"}
    
    conn = None
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT strain_name, grow_style, archetype, thc, cbd, thcv, cbg, cbn,
                   terpene_1, terpene_1_val, terpene_2, terpene_2_val, 
                   terpene_3, terpene_3_val, cannflavin_a, vsc_present
            FROM product_catalog 
            WHERE strain_name = ? COLLATE NOCASE
        """, (strain_name,))
        
        rows = cursor.fetchall()
        
        if not rows:
            return {"error": f"Strain '{strain_name}' not found in Phase 1 library"}
        
        variants = []
        for row in rows:
            # Build compound list from row data
            compounds = []
            
            # Add cannabinoids
            if row[3] > 0: compounds.append({"name": "THC", "val": row[3]})
            if row[4] > 0: compounds.append({"name": "CBD", "val": row[4]})
            if row[5] > 0: compounds.append({"name": "THCV", "val": row[5]})
            if row[6] > 0: compounds.append({"name": "CBG", "val": row[6]})
            if row[7] > 0: compounds.append({"name": "CBN", "val": row[7]})
            
            # Add terpenes
            if row[9] > 0: compounds.append({"name": row[8], "val": row[9]})
            if row[11] > 0: compounds.append({"name": row[10], "val": row[11]})
            if row[13] > 0: compounds.append({"name": row[12], "val": row[13]})
            
            # Add cannflavin if present
            if row[14] > 0: compounds.append({"name": "Cannflavin A", "val": row[14]})
            
            variants.append({
                "strain_name": row[0],
                "grow_style": row[1],
                "archetype": row[2],
                "compounds": compounds,
                "vsc_present": bool(row[15])
            })
        
        return {
            "strain": strain_name,
            "variants": variants,
            "count": len(variants)
        }
        
    finally:
        if conn:
            conn.close()


@router.get("/strains")
async def list_all_strains():
    """List all strain names in Phase 1 library."""
    if not os.path.exists(DB_PATH):
        return {"error": "Database not found"}
    
    conn = None
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        
        cursor.execute("SELECT DISTINCT strain_name FROM product_catalog ORDER BY strain_name")
        rows = cursor.fetchall()
        
        return {
            "strains": [row[0] for row in rows],
            "count": len(rows)
        }
        
    finally:
        if conn:
            conn.close()