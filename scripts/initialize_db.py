import sqlite3
import os

"""
Complete GreenForge Database Population
Includes ALL cannabinoids, terpenes, flavonoids, and VSCs from research
"""

db_path = os.path.join("data", "greenforge.db")
os.makedirs("data", exist_ok=True)
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

print("=" * 70)
print("GREENFORGE DATABASE INITIALIZATION")
print("=" * 70)

# ============================================================================
# TABLE CREATION
# ============================================================================

# Cannabinoids table
cursor.execute("""
CREATE TABLE IF NOT EXISTS cannabinoids (
    name TEXT PRIMARY KEY,
    boiling_point REAL,
    primary_benefit TEXT,
    receptor_target TEXT,
    psychoactive INTEGER DEFAULT 0
)
""")

# Terpenes table
cursor.execute("""
CREATE TABLE IF NOT EXISTS terpenes (
    name TEXT PRIMARY KEY,
    boiling_point REAL,
    primary_benefit TEXT,
    terpene_class TEXT
)
""")

# Flavonoids table
cursor.execute("""
CREATE TABLE IF NOT EXISTS flavonoids (
    name TEXT PRIMARY KEY,
    boiling_point REAL,
    synergy_multiplier REAL DEFAULT 1.0,
    primary_benefit TEXT
)
""")

# Minor cannabinoids table
cursor.execute("""
CREATE TABLE IF NOT EXISTS minor_cannabinoids (
    name TEXT PRIMARY KEY,
    boiling_point REAL,
    efficacy_weight REAL DEFAULT 1.0,
    primary_benefit TEXT
)
""")

# VSCs and Dark Matter table
cursor.execute("""
CREATE TABLE IF NOT EXISTS volatile_compounds (
    name TEXT PRIMARY KEY,
    compound_class TEXT,
    aroma_profile TEXT,
    notes TEXT
)
""")

print("\n✓ Tables created")

# ============================================================================
# CANNABINOIDS - THE ENGINE
# ============================================================================

print("\n[1/5] Populating Cannabinoids...")

# Major cannabinoids
cannabinoids = [
    # (name, boiling_point_celsius, benefit, receptor, psychoactive)
    ('THC', 157, 'Analgesia, Euphoria, Antiemetic', 'CB1, CB2', 1),
    ('CBD', 180, 'Anti-Seizure, Anxiolytic, Anti-inflammatory', 'CB1 (antagonist), CB2', 0),
    ('CBG', 52, 'Gut Health (IBD), Neuroprotection, Antibacterial', 'CB1, CB2', 0),
    ('CBC', 220, 'Antidepressant, Acne Reduction, Neurogenesis', 'TRPA1, TRPV1', 0),
    ('CBN', 185, 'Sedation (Sleep Aid), Muscle Relaxation', 'CB1 (weak), CB2', 0),
    ('THCV', 220, 'Appetite Suppression, Energy, Glycemic Control', 'CB1 (antagonist/agonist)', 0),
]

for name, bp, benefit, receptor, psycho in cannabinoids:
    cursor.execute("""
        INSERT OR REPLACE INTO cannabinoids 
        VALUES (?, ?, ?, ?, ?)
    """, (name, bp, benefit, receptor, psycho))

# Acid forms (raw & live)
acid_cannabinoids = [
    ('THCA', 105, 'Non-psychoactive anti-inflammatory (raw)', 'CB1, CB2', 0),
    ('CBDA', 120, 'Superior bioavailability to CBD', 'CB1, CB2', 0),
    ('CBGA', 52, 'The Mother - precursor to all cannabinoids', 'CB1, CB2', 0),
    ('CBCA', 220, 'Precursor to CBC', 'TRPA1', 0),
    ('THCVA', 220, 'Precursor to THCV', 'CB1', 0),
    ('CBDVA', 180, 'Precursor to CBDV', 'CB1', 0),
]

for name, bp, benefit, receptor, psycho in acid_cannabinoids:
    cursor.execute("""
        INSERT OR REPLACE INTO cannabinoids 
        VALUES (?, ?, ?, ?, ?)
    """, (name, bp, benefit, receptor, psycho))

# Varins (3-carbon chain)
varins = [
    ('CBDV', 180, 'Anti-seizure, Autism spectrum potential', 'TRPV1', 0),
    ('CBGV', 52, 'Minor precursor variant', 'CB1, CB2', 0),
    ('CBCV', 220, 'Minor variant', 'TRPA1', 0),
    ('CBNV', 185, 'Minor degradation product', 'CB2', 0),
]

for name, bp, benefit, receptor, psycho in varins:
    cursor.execute("""
        INSERT OR REPLACE INTO cannabinoids 
        VALUES (?, ?, ?, ?, ?)
    """, (name, bp, benefit, receptor, psycho))

# Phorols & Butols (super-potency)
super_potency = [
    ('THCP', 157, '33x stronger CB1 binding than THC', 'CB1, CB2', 1),
    ('CBDP', 180, 'Ultra-potent CBD analog', 'CB1, CB2', 0),
    ('THCB', 157, 'Butyl analog of THC', 'CB1, CB2', 1),
    ('CBDB', 180, 'Butyl analog of CBD', 'CB1, CB2', 0),
]

for name, bp, benefit, receptor, psycho in super_potency:
    cursor.execute("""
        INSERT OR REPLACE INTO cannabinoids 
        VALUES (?, ?, ?, ?, ?)
    """, (name, bp, benefit, receptor, psycho))

# Deep cuts (rare)
rare_cannabinoids = [
    ('CBL', 190, 'Light-degraded CBC', 'Unknown', 0),
    ('CBLA', 190, 'Acid form of CBL', 'Unknown', 0),
    ('CBE', 180, 'CBD metabolic byproduct', 'Unknown', 0),
    ('CBT', 157, 'Rare THC analog', 'CB1', 1),
    ('CBND', 185, 'CBN derivative', 'CB2', 0),
    ('DCBF', 200, 'Dehydrocannabifuran', 'Unknown', 0),
]

for name, bp, benefit, receptor, psycho in rare_cannabinoids:
    cursor.execute("""
        INSERT OR REPLACE INTO cannabinoids 
        VALUES (?, ?, ?, ?, ?)
    """, (name, bp, benefit, receptor, psycho))

print(f"  ✓ Added {len(cannabinoids) + len(acid_cannabinoids) + len(varins) + len(super_potency) + len(rare_cannabinoids)} cannabinoids")

# ============================================================================
# TERPENES - THE STEERING WHEEL
# ============================================================================

print("\n[2/5] Populating Terpenes...")

# Monoterpenes (volatile & loud)
monoterpenes = [
    # (name, boiling_point_celsius, benefit, class)
    ('Myrcene', 168, 'Sedation, Muscle Relaxation, Couch-lock', 'monoterpene'),
    ('Limonene', 176, 'Anti-anxiety, Mood Elevation, Stress Relief', 'monoterpene'),
    ('Alpha-Pinene', 155, 'Memory Retention, Focus, Bronchodilation', 'monoterpene'),
    ('Beta-Pinene', 166, 'Memory Retention, Anti-inflammatory', 'monoterpene'),
    ('Linalool', 198, 'Sedation, Anti-anxiety, Calm (GABA modulation)', 'monoterpene'),
    ('Terpinolene', 185, 'Hazy, Trippy, Energetic (paradoxical)', 'monoterpene'),
    ('Ocimene', 100, 'Decongestant, Antiviral (causes coughing)', 'monoterpene'),
    ('Camphene', 159, 'Antibiotic, Antifungal', 'monoterpene'),
    ('Delta-3-Carene', 171, 'Drying effect (cottonmouth), Anti-inflammatory', 'monoterpene'),
    ('Phellandrene', 175, 'Digestive Aid, Peppery/Minty', 'monoterpene'),
    ('Sabinene', 163, 'Anti-inflammatory, Spicy/Oak aroma', 'monoterpene'),
    ('Geraniol', 230, 'Neuroprotection, Rose aroma', 'monoterpene'),
    ('Eucalyptol', 176, 'Alertness, Cooling mint, Decongestant', 'monoterpene'),
]

for name, bp, benefit, tclass in monoterpenes:
    cursor.execute("""
        INSERT OR REPLACE INTO terpenes 
        VALUES (?, ?, ?, ?)
    """, (name, bp, benefit, tclass))

# Sesquiterpenes (heavy & sequestered)
sesquiterpenes = [
    ('Caryophyllene', 263, 'Pain/Inflammation (CB2 agonist), only terpene hitting cannabinoid receptors', 'sesquiterpene'),
    ('Beta-Caryophyllene', 263, 'Pain/Inflammation (CB2 agonist)', 'sesquiterpene'),
    ('Humulene', 276, 'Appetite Suppression, Anti-inflammatory', 'sesquiterpene'),
    ('Nerolidol', 257, 'Deep Sedative, Bark/Jasmine aroma', 'sesquiterpene'),
    ('Bisabolol', 315, 'Skin Repair, Anti-irritant, Chamomile', 'sesquiterpene'),
    ('Guaiol', 288, 'Antimicrobial, "Reefer" smell', 'sesquiterpene'),
    ('Farnesene', 257, 'Calming, Antispasmodic, Green Apple', 'sesquiterpene'),
    ('Valencene', 269, 'Anti-inflammatory, Orange aroma', 'sesquiterpene'),
    ('Elemene', 275, 'Possible anti-tumor, Ginger/Turmeric', 'sesquiterpene'),
    ('Bergamotene', 273, 'Nutmeg/Carrot aroma', 'sesquiterpene'),
]

for name, bp, benefit, tclass in sesquiterpenes:
    cursor.execute("""
        INSERT OR REPLACE INTO terpenes 
        VALUES (?, ?, ?, ?)
    """, (name, bp, benefit, tclass))

# Hidden terpenoids (alcohols & oxides)
terpenoids = [
    ('Caryophyllene Oxide', 240, 'Drug dog detection compound', 'terpenoid'),
    ('Borneol', 210, 'Blood-brain barrier permeability, Menthol/Camphor', 'terpenoid'),
    ('Fenchol', 201, 'Basil/Earthy, Relaxation', 'terpenoid'),
    ('Phytol', 203, 'Breaks down chlorophyll, Grassy tea aroma', 'terpenoid'),
    ('Isoborneol', 212, 'Viral Inhibitor', 'terpenoid'),
    ('Cedrene', 262, 'Cedar wood aroma', 'terpenoid'),
]

for name, bp, benefit, tclass in terpenoids:
    cursor.execute("""
        INSERT OR REPLACE INTO terpenes 
        VALUES (?, ?, ?, ?)
    """, (name, bp, benefit, tclass))

print(f"  ✓ Added {len(monoterpenes) + len(sesquiterpenes) + len(terpenoids)} terpenes")

# ============================================================================
# FLAVONOIDS - THE PAINT & PROTECTION
# ============================================================================

print("\n[3/5] Populating Flavonoids...")

flavonoids_data = [
    # (name, boiling_point_celsius, synergy_multiplier, benefit)
    # Cannflavins (unique to cannabis)
    ('Cannflavin A', 182, 30.0, '30x stronger than Aspirin for inflammation'),
    ('Cannflavin B', 182, 15.0, 'Potent anti-inflammatory (5-LOX inhibitor)'),
    ('Cannflavin C', 182, 10.0, 'Rare anti-inflammatory cousin'),
    
    # Anthocyanins (purple makers)
    ('Cyanidin', None, 1.0, 'Red/Purple pigment, Antioxidant'),
    ('Delphinidin', None, 1.0, 'Blue pigment, Neuroprotection'),
    
    # Universal protectors
    ('Quercetin', 250, 5.0, 'Sunscreen/Antioxidant/Antiviral (needs >250°C)'),
    ('Apigenin', 178, 3.0, 'Binds Valium receptors (calming/GABA)'),
    ('Kaempferol', None, 4.0, 'Anti-cancer, Bone Health'),
    ('Luteolin', None, 3.0, 'Neuroprotective, Anti-inflammatory'),
    ('Orientin', None, 2.0, 'Radioprotector (rare)'),
    ('Vitexin', None, 2.0, 'Anti-tumor (Goji berry compound)'),
    ('Isovitexin', None, 2.0, 'Anti-tumor (Passion flower compound)'),
    ('Rutin', None, 2.0, 'Vascular health (Buckwheat)'),
    ('Catechin', None, 2.0, 'Metabolic boost (Green tea)'),
    ('Silymarin', None, 3.0, 'Liver protection (Milk thistle)'),
    ('Beta-Sitosterol', 134, 2.0, 'Cholesterol reduction (phytosterol)'),
]

for name, bp, mult, benefit in flavonoids_data:
    cursor.execute("""
        INSERT OR REPLACE INTO flavonoids 
        VALUES (?, ?, ?, ?)
    """, (name, bp, mult, benefit))

print(f"  ✓ Added {len(flavonoids_data)} flavonoids")

# ============================================================================
# VOLATILE SULFUR COMPOUNDS - THE DARK MATTER
# ============================================================================

print("\n[4/5] Populating Volatile Compounds (VSCs, Esters, Aldehydes)...")

volatile_compounds = [
    # VSCs - "The Gas"
    ('3-MBT', 'VSC', 'Skunk spray', 'Primary skunk molecule - same as actual skunk spray'),
    ('Prenylated Thiols', 'VSC', 'Garlic/Gas/Dank', 'GMO Cookies, gassy strains'),
    
    # Esters & Aldehydes - "The Fruit"
    ('Ethyl Butyrate', 'Ester', 'Pineapple/Tropical', 'Fruity tropical aroma'),
    ('Ethyl Hexanoate', 'Ester', 'Apple/Banana', 'Sweet fruit notes'),
    ('Benzyl Acetate', 'Ester', 'Jasmine/Strawberry', 'Floral/berry notes'),
    ('Hexanal', 'Aldehyde', 'Fresh cut grass', 'Green, grassy aroma'),
    ('Benzaldehyde', 'Aldehyde', 'Almond/Cherry', 'Sweet nutty/cherry notes'),
]

for name, comp_class, aroma, notes in volatile_compounds:
    cursor.execute("""
        INSERT OR REPLACE INTO volatile_compounds 
        VALUES (?, ?, ?, ?)
    """, (name, comp_class, aroma, notes))

print(f"  ✓ Added {len(volatile_compounds)} volatile compounds (Dark Matter)")

# ============================================================================
# COMMIT & VERIFY
# ============================================================================

conn.commit()

print("\n[5/5] Verifying database...")

# Count all compounds
cursor.execute("SELECT COUNT(*) FROM cannabinoids")
canna_count = cursor.fetchone()[0]

cursor.execute("SELECT COUNT(*) FROM terpenes")
terp_count = cursor.fetchone()[0]

cursor.execute("SELECT COUNT(*) FROM flavonoids")
flav_count = cursor.fetchone()[0]

cursor.execute("SELECT COUNT(*) FROM volatile_compounds")
vsc_count = cursor.fetchone()[0]

print("\n" + "=" * 70)
print("DATABASE POPULATION COMPLETE")
print("=" * 70)
print(f"Cannabinoids:         {canna_count:>3} compounds")
print(f"Terpenes:             {terp_count:>3} compounds")
print(f"Flavonoids:           {flav_count:>3} compounds")
print(f"Volatile Compounds:   {vsc_count:>3} compounds")
print(f"{'─' * 70}")
print(f"TOTAL:                {canna_count + terp_count + flav_count + vsc_count:>3} compounds")
print("=" * 70)

# Display sample compounds from each category
print("\n📋 SAMPLE COMPOUNDS:")

print("\n🧬 Top 5 Cannabinoids:")
cursor.execute("SELECT name, boiling_point FROM cannabinoids ORDER BY name LIMIT 5")
for row in cursor.fetchall():
    bp_f = round(row[1] * 1.8 + 32, 1) if row[1] else 'N/A'
    print(f"  • {row[0]:<15} BP: {bp_f}°F")

print("\n🌲 Top 5 Terpenes:")
cursor.execute("SELECT name, boiling_point FROM terpenes ORDER BY boiling_point LIMIT 5")
for row in cursor.fetchall():
    bp_f = round(row[1] * 1.8 + 32, 1) if row[1] else 'N/A'
    print(f"  • {row[0]:<15} BP: {bp_f}°F")

print("\n🎨 Cannflavins (Cannabis-Unique):")
cursor.execute("SELECT name, synergy_multiplier FROM flavonoids WHERE name LIKE 'Cannflavin%'")
for row in cursor.fetchall():
    print(f"  • {row[0]:<15} Potency: {row[1]}x aspirin")

print("\n🦨 VSCs (The Gas):")
cursor.execute("SELECT name, aroma_profile FROM volatile_compounds WHERE compound_class = 'VSC'")
for row in cursor.fetchall():
    print(f"  • {row[0]:<20} Aroma: {row[1]}")

conn.close()

print("\n✓ Database ready at:", db_path)
print("\nNext steps:")
print("  1. Run: python check_pantry.py")
print("  2. Start API: python Main.py")
print("  3. Test: python test_GreenForge.py")