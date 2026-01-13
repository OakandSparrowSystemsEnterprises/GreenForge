import sqlite3
import os

db_path = os.path.join("data", "greenforge.db")
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# 1. Create Flavonoids Table (The Modulators)
cursor.execute("""
CREATE TABLE IF NOT EXISTS flavonoids (
    name TEXT PRIMARY KEY,
    boiling_point REAL,
    synergy_multiplier REAL,
    primary_benefit TEXT
)
""")

# 2. Create Minor Cannabinoids Table (The Support)
cursor.execute("""
CREATE TABLE IF NOT EXISTS minor_cannabinoids (
    name TEXT PRIMARY KEY,
    boiling_point REAL,
    efficacy_weight REAL,
    primary_benefit TEXT
)
""")

# 3. Populate with 'Nerve Pain' and 'Anxiety' Dark Matter
# Cannflavin A: 182°C (360°F) - 30x more powerful than Aspirin
cursor.execute("INSERT OR REPLACE INTO flavonoids VALUES ('Cannflavin A', 182.0, 1.4, 'Anti-Inflammatory')")
# CBN: 185°C (365°F) - The 'Sedative' for Anxiety/Sleep
cursor.execute("INSERT OR REPLACE INTO minor_cannabinoids VALUES ('CBN', 185.0, 1.2, 'Sedation')")
# CBG: 52°C (126°F) - The 'Neuro-Protective' agent
cursor.execute("INSERT OR REPLACE INTO minor_cannabinoids VALUES ('CBG', 52.0, 1.15, 'Neuroprotection')")

conn.commit()
conn.close()
print("--- [SUCCESS]: Dark Matter Tables Initialized. The Pantry has expanded.")