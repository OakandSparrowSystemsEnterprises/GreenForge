import sqlite3

def populate_phase_1_library():
    """
    GreenForge Phase 1 Library Population Script
    
    Builds 30 distinct chemical vectors from 10 Tier 1 strains, accounting for:
    - Living soil cultivation (upregulates Cannflavins, sesquiterpenes via SAR)
    - Hydroponic systems (maximizes THC/monoterpenes, reduces complexity)
    - Drought stress (concentrates metabolites per gram dry weight)
    
    Research Integration:
    - THCV as CB1 antagonist (Durban Poison metabolic logic)
    - Alpha-Pinene as acetylcholinesterase inhibitor (Jack Herer nootropic)
    - Cannflavin A/B anti-inflammatory markers (30x aspirin efficacy)
    - VSC "Dark Matter" multipliers for gas/fuel aromatics
    
    Cultivation Variance Model:
    - Living soil: +diversity, +cannflavins, +sesquiterpenes
    - Hydroponic: +THC yield, +monoterpenes, -medicinal complexity
    - Drought stress: +concentration, +THCV, +terpene density
    """
    conn = sqlite3.connect('greenforge.db')
    cursor = conn.cursor()
    
    # Schema: Multi-dimensional chemotype vectors
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS product_catalog (
            strain_name TEXT,
            grow_style TEXT,
            archetype TEXT,
            thc REAL,
            cbd REAL,
            thcv REAL,
            cbg REAL,
            cbn REAL,
            terpene_1 TEXT,
            terpene_1_val REAL,
            terpene_2 TEXT,
            terpene_2_val REAL,
            terpene_3 TEXT,
            terpene_3_val REAL,
            cannflavin_a REAL,
            vsc_present INTEGER,
            PRIMARY KEY (strain_name, grow_style)
        )
    """)

    # Phase 1 Data: 10 strains × 3 grow contexts = 30 chemotype vectors
    data = [
        # ═══════════════════════════════════════════════════════════════
        # DURBAN POISON: Metabolic Stimulant Logic
        # THCV as CB1 antagonist → appetite suppression, metabolic acceleration
        # Terpinolene-dominant → cerebral stimulation, low sedation risk
        # ═══════════════════════════════════════════════════════════════
        ('Durban Poison', 'living_soil', 'Espresso Energy', 
         18.0, 0.0, 1.8, 0.0, 0.0,
         'Terpinolene', 1.1, 'Pinene', 0.5, 'Ocimene', 0.3,
         0.05, 0),  # Moderate Cannflavin A, no VSC
        
        ('Durban Poison', 'hydroponic', 'Espresso Energy',
         24.0, 0.0, 1.2, 0.0, 0.0,
         'Terpinolene', 0.8, 'Myrcene', 0.4, 'Limonene', 0.2,
         0.0, 0),   # No Cannflavin (hydro limitation)
        
        ('Durban Poison', 'drought_stress', 'Espresso Energy',
         22.0, 0.0, 2.5, 0.0, 0.0,
         'Terpinolene', 1.5, 'Pinene', 0.7, 'Ocimene', 0.4,
         0.02, 0),  # Concentrated THCV (stress response)

        # ═══════════════════════════════════════════════════════════════
        # JACK HERER: Nootropic Memory Logic
        # Alpha-Pinene as acetylcholinesterase inhibitor → preserves acetylcholine
        # Prevents THC-induced memory impairment via cholinergic modulation
        # ═══════════════════════════════════════════════════════════════
        ('Jack Herer', 'living_soil', 'Nootropic Focus',
         18.0, 0.0, 0.0, 0.0, 0.0,
         'Pinene', 1.2, 'Terpinolene', 0.8, 'Caryophyllene', 0.4,
         0.04, 0),  # Modest Cannflavin (nootropic support)
        
        ('Jack Herer', 'hydroponic', 'Nootropic Focus',
         23.0, 0.0, 0.0, 0.0, 0.0,
         'Terpinolene', 0.9, 'Pinene', 0.5, 'Myrcene', 0.3,
         0.0, 0),   # Terpene shift in hydro (less Pinene complexity)
        
        ('Jack Herer', 'drought_stress', 'Nootropic Focus',
         21.0, 0.0, 0.0, 0.0, 0.0,
         'Pinene', 1.8, 'Terpinolene', 1.1, 'Caryophyllene', 0.6,
         0.02, 0),  # High Pinene concentration (stress amplification)

        # ═══════════════════════════════════════════════════════════════
        # SUPER LEMON HAZE: Citrus Kinetic Logic
        # Terpinolene + Limonene → uplifting, anti-anxiety
        # CBG presence → neuroprotective, anti-inflammatory
        # VSC markers → citrus-fuel aroma complexity
        # ═══════════════════════════════════════════════════════════════
        ('Super Lemon Haze', 'living_soil', 'Citrus Kinetic',
         19.0, 0.0, 0.0, 1.5, 0.0,
         'Terpinolene', 1.2, 'Caryophyllene', 0.9, 'Limonene', 0.6,
         0.08, 1),  # High Cannflavin + VSC "gas" notes
        
        ('Super Lemon Haze', 'hydroponic', 'Citrus Kinetic',
         25.0, 0.0, 0.0, 0.5, 0.0,
         'Limonene', 1.4, 'Caryophyllene', 0.6, 'Myrcene', 0.3,
         0.0, 1),   # THC maximized, CBG reduced, VSC persists
        
        ('Super Lemon Haze', 'drought_stress', 'Citrus Kinetic',
         22.0, 0.0, 0.0, 1.0, 0.0,
         'Terpinolene', 1.8, 'Limonene', 1.2, 'Caryophyllene', 1.1,
         0.04, 1),  # Stress-enhanced terpene density

        # ═══════════════════════════════════════════════════════════════
        # BLUE DREAM: Paradox Equilibrium Logic
        # Myrcene (sedation) + Pinene (alertness) = balanced effect
        # CBD trace → modulates THC psychoactivity
        # Linalool → anxiolytic, anti-convulsant
        # ═══════════════════════════════════════════════════════════════
        ('Blue Dream', 'living_soil', 'Paradox Balance',
         18.0, 2.0, 0.0, 0.5, 0.0,
         'Pinene', 1.1, 'Myrcene', 0.9, 'Linalool', 0.4,
         0.12, 0),  # Highest Cannflavin A in balanced hybrid
        
        ('Blue Dream', 'hydroponic', 'Paradox Balance',
         22.0, 0.5, 0.0, 0.2, 0.0,
         'Myrcene', 1.5, 'Pinene', 0.4, 'Limonene', 0.2,
         0.0, 0),   # Myrcene-dominant shift (more sedative)
        
        ('Blue Dream', 'drought_stress', 'Paradox Balance',
         20.0, 1.5, 0.0, 0.8, 0.0,
         'Pinene', 1.6, 'Myrcene', 1.3, 'Linalool', 0.6,
         0.06, 0),  # Enhanced CBD + terpene preservation

        # ═══════════════════════════════════════════════════════════════
        # SOUR DIESEL: Fuel Aroma VSC Logic
        # Volatile Sulfur Compounds → "gas" aroma signature
        # Limonene + Caryophyllene → energizing, analgesic
        # VSC thermal instability → requires temp precision (157-180°C)
        # ═══════════════════════════════════════════════════════════════
        ('Sour Diesel', 'living_soil', 'Gas Fuel',
         20.0, 0.0, 0.0, 0.0, 0.0,
         'Limonene', 0.8, 'Caryophyllene', 0.7, 'Myrcene', 0.4,
         0.05, 1),  # VSC present, moderate Cannflavin
        
        ('Sour Diesel', 'hydroponic', 'Gas Fuel',
         26.0, 0.0, 0.0, 0.0, 0.0,
         'Limonene', 1.2, 'Caryophyllene', 0.5, 'Myrcene', 0.2,
         0.0, 1),   # High THC, reduced terpene diversity
        
        ('Sour Diesel', 'drought_stress', 'Gas Fuel',
         24.0, 0.0, 0.0, 0.0, 0.0,
         'Limonene', 1.5, 'Caryophyllene', 1.1, 'Myrcene', 0.6,
         0.02, 1),  # VSC + terpene concentration

        # ═══════════════════════════════════════════════════════════════
        # GIRL SCOUT COOKIES (GSC): Anthocyanin Antioxidant Logic
        # Caryophyllene-dominant → CB2 agonist, anti-inflammatory
        # THCV presence → appetite modulation, neuroprotection
        # Anthocyanin markers → antioxidant, UV stress response
        # ═══════════════════════════════════════════════════════════════
        ('Girl Scout Cookies', 'living_soil', 'Euphoric Dessert',
         20.0, 0.0, 1.0, 0.0, 0.0,
         'Caryophyllene', 0.9, 'Limonene', 0.7, 'Humulene', 0.5,
         0.15, 1),  # High Cannflavin (anti-inflammatory synergy)
        
        ('Girl Scout Cookies', 'hydroponic', 'Euphoric Dessert',
         28.0, 0.0, 0.2, 0.0, 0.0,
         'Caryophyllene', 1.2, 'Limonene', 0.4, 'Myrcene', 0.2,
         0.0, 1),   # THC maximized, THCV reduced
        
        ('Girl Scout Cookies', 'drought_stress', 'Euphoric Dessert',
         25.0, 0.0, 1.5, 0.0, 0.0,
         'Caryophyllene', 1.6, 'Limonene', 1.1, 'Humulene', 0.8,
         0.08, 1),  # THCV amplification via stress

        # ═══════════════════════════════════════════════════════════════
        # GRANDDADDY PURPLE: Coma Sedation Logic
        # Myrcene (>2.0%) → heavy sedation, muscle relaxation
        # Linalool → anxiolytic, sleep-inducing
        # CBN presence → degraded THC, enhanced sedation
        # Anthocyanins → purple pigmentation, antioxidant
        # ═══════════════════════════════════════════════════════════════
        ('Granddaddy Purple', 'living_soil', 'Coma Sedation',
         17.0, 0.0, 0.0, 0.0, 2.0,
         'Myrcene', 1.8, 'Linalool', 0.9, 'Caryophyllene', 0.6,
         0.25, 1),  # Highest Cannflavin A (pain relief synergy)
        
        ('Granddaddy Purple', 'hydroponic', 'Coma Sedation',
         23.0, 0.0, 0.0, 0.0, 0.5,
         'Myrcene', 2.5, 'Linalool', 0.4, 'Limonene', 0.2,
         0.0, 1),   # Myrcene spike, CBN reduced (fresh harvest)
        
        ('Granddaddy Purple', 'drought_stress', 'Coma Sedation',
         20.0, 0.0, 0.0, 0.0, 3.5,
         'Myrcene', 3.2, 'Linalool', 1.2, 'Caryophyllene', 1.1,
         0.12, 1),  # CBN amplification (stress-induced aging)

        # ═══════════════════════════════════════════════════════════════
        # NORTHERN LIGHTS: Lucid Sedation Paradox
        # Myrcene (sedation) + Pinene (alertness) = lucid relaxation
        # CBN trace → mild sedation without stupor
        # Classic Afghani genetics → resin density, terpene stability
        # ═══════════════════════════════════════════════════════════════
        ('Northern Lights', 'living_soil', 'Lucid Sedation',
         16.0, 0.1, 0.0, 0.0, 1.5,
         'Myrcene', 1.5, 'Pinene', 0.9, 'Caryophyllene', 0.7,
         0.08, 1),  # Moderate Cannflavin, VSC "earthy" notes
        
        ('Northern Lights', 'hydroponic', 'Lucid Sedation',
         21.0, 0.0, 0.0, 0.0, 0.5,
         'Myrcene', 2.2, 'Pinene', 0.4, 'Limonene', 0.2,
         0.0, 1),   # Myrcene-heavy (less cognitive clarity)
        
        ('Northern Lights', 'drought_stress', 'Lucid Sedation',
         18.0, 0.2, 0.0, 0.0, 2.5,
         'Myrcene', 2.8, 'Pinene', 1.2, 'Caryophyllene', 1.1,
         0.04, 1),  # CBN elevation, Pinene preservation

        # ═══════════════════════════════════════════════════════════════
        # ACDC: Clinical Anti-Inflammatory Logic
        # CBD-dominant (20:1 ratio) → non-psychoactive therapeutic
        # Cannflavin A/B → 30x aspirin anti-inflammatory efficacy
        # Myrcene + Pinene + Caryophyllene → entourage analgesia
        # Living soil maximizes Cannflavin expression (SAR pathway)
        # ═══════════════════════════════════════════════════════════════
        ('ACDC', 'living_soil', 'Anti-Inflammatory',
         0.8, 20.0, 0.0, 0.0, 0.0,
         'Myrcene', 1.2, 'Pinene', 0.9, 'Caryophyllene', 0.6,
         0.35, 0),  # HIGHEST Cannflavin A (clinical target)
        
        ('ACDC', 'hydroponic', 'Anti-Inflammatory',
         1.2, 15.0, 0.0, 0.0, 0.0,
         'Myrcene', 1.8, 'Limonene', 0.4, 'Pinene', 0.3,
         0.05, 0),  # CBD reduced, Cannflavin loss (hydro penalty)
        
        ('ACDC', 'drought_stress', 'Anti-Inflammatory',
         1.0, 25.0, 0.0, 0.0, 0.0,
         'Myrcene', 2.2, 'Pinene', 1.5, 'Caryophyllene', 1.1,
         0.15, 0),  # CBD amplification (stress concentration)

        # ═══════════════════════════════════════════════════════════════
        # GMO (Garlic Cookies): Savory Narcotic VSC Logic
        # Caryophyllene-dominant → CB2 anti-inflammatory
        # VSC "garlic/fuel" aroma → sulfur-containing terpenes
        # High THC potency → requires thermal precision
        # Myrcene + Caryophyllene → heavy sedation + pain relief
        # ═══════════════════════════════════════════════════════════════
        ('GMO', 'living_soil', 'Savory Narcotic',
         25.0, 0.0, 0.0, 0.0, 0.0,
         'Caryophyllene', 1.1, 'Limonene', 0.9, 'Myrcene', 0.6,
         0.10, 1),  # VSC + Cannflavin (pain management profile)
        
        ('GMO', 'hydroponic', 'Savory Narcotic',
         32.0, 0.0, 0.0, 0.0, 0.0,
         'Caryophyllene', 1.5, 'Limonene', 0.4, 'Myrcene', 0.2,
         0.0, 1),   # Maximum THC potency (recreational target)
        
        ('GMO', 'drought_stress', 'Savory Narcotic',
         28.0, 0.0, 0.0, 0.0, 0.0,
         'Caryophyllene', 2.1, 'Limonene', 1.2, 'Myrcene', 1.1,
         0.05, 1),  # Terpene concentration, VSC amplification
    ]

    cursor.executemany("""
        INSERT OR REPLACE INTO product_catalog 
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    """, data)
    
    conn.commit()
    conn.close()
    
    print("✅ Phase 1 Library: 30 Context-Aware Chemotype Vectors Loaded")
    print("📊 Cultivation Contexts: Living Soil, Hydroponic, Drought Stress")
    print("🔬 Research Integration: THCV, Cannflavins A/B, VSC Markers, Pinene AChE")
    print("🎯 Ready for Thermal Gate predictions and clinical audit protocols")

if __name__ == "__main__":
    populate_phase_1_library()