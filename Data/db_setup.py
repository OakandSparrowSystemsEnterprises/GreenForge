import sqlite3
import os

# Path to the "Pudding"
db_path = os.path.join("data", "greenforge.db")
if not os.path.exists("data"): os.makedirs("data")

conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# 1. CREATE THE RESEARCH SHELVES
print("--- [SYSTEM]: Building clinical database tables...")

# Compound Tables [cite: 1202, 1212, 1227]
cursor.execute("CREATE TABLE IF NOT EXISTS cannabinoids (name TEXT PRIMARY KEY, boiling_point REAL, benefit TEXT)")
cursor.execute("CREATE TABLE IF NOT EXISTS terpenes (name TEXT PRIMARY KEY, boiling_point REAL, benefit TEXT)")
cursor.execute("CREATE TABLE IF NOT EXISTS flavonoids (name TEXT PRIMARY KEY, boiling_point REAL, benefit TEXT, potency_multiplier REAL)")

# Logic & Rule Tables [cite: 78, 92, 1250]
cursor.execute("CREATE TABLE IF NOT EXISTS efficacy (compound_name TEXT, condition_name TEXT, score REAL)")
cursor.execute("CREATE TABLE IF NOT EXISTS synergy_rules (rule_id TEXT PRIMARY KEY, rule_name TEXT, condition TEXT, multiplier REAL)")
cursor.execute("CREATE TABLE IF NOT EXISTS safety_warnings (warning_id TEXT PRIMARY KEY, trigger_condition TEXT, message TEXT)")

# 2. SEED THE INITIAL RESEARCH DATA [cite: 1118-1123, 1370-1375]
print("--- [SYSTEM]: Seeding baseline clinical data from PDFs...")

# Cannflavin A: 182°C with 30x potency for Pain [cite: 1370, 1442, 2170, 2383]
cursor.execute("INSERT OR REPLACE INTO flavonoids VALUES ('Cannflavin A', 182.0, 'Pain Relief', 30.0)")
cursor.execute("INSERT OR REPLACE INTO synergy_rules VALUES ('SYN-03', 'Pain Relief (Flavonoid Boost)', 'Pain', 30.0)")

# THC & CBD: Thermodynamic Gates [cite: 1139-1140, 1337, 1341, 2483-2484]
cursor.execute("INSERT OR REPLACE INTO cannabinoids VALUES ('THC', 157.0, 'Analgesia')")
cursor.execute("INSERT OR REPLACE INTO cannabinoids VALUES ('CBD', 180.0, 'Anxiolytic')")

conn.commit()
conn.close()
print("--- [SUCCESS]: Database ready for paper ingestion.")