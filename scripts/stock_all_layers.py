import sqlite3
import os

db_path = os.path.join("data", "greenforge.db")
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# 1. Update Terpenes (Adding the missing Anxiety Killers)
cursor.execute("INSERT OR REPLACE INTO terpenes VALUES ('Linalool', 198.0, 'Sedative/Anti-Anxiety')")
cursor.execute("INSERT OR REPLACE INTO terpenes VALUES ('Limonene', 176.0, 'Mood Elevation/Stress Relief')")

# 2. Update Flavonoids (The Soil-Grown Powerhouse)
cursor.execute("INSERT OR REPLACE INTO flavonoids VALUES ('Cannflavin A', 182.0, 1.4, 'Nerve Anti-Inflammatory')")

# 3. Update Minor Cannabinoids (The Grounding Agents)
cursor.execute("INSERT OR REPLACE INTO minor_cannabinoids VALUES ('CBN', 185.0, 1.2, 'Deep Sedation')")
cursor.execute("INSERT OR REPLACE INTO minor_cannabinoids VALUES ('CBG', 52.0, 1.15, 'Neuroprotection')")

conn.commit()
conn.close()
print("--- [SUCCESS]: All layers stocked. Linalool, Limonene, and Dark Matter are LIVE.")