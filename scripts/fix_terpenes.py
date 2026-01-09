import sqlite3
import os

DB_PATH = os.path.join("Data", "greenforge.db")
conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

# Adding the missing anxiety-relief terpenes
terpene_data = [
    ('Linalool', 198.0, 'Sedative/Anti-Anxiety'),
    ('Limonene', 176.0, 'Mood Elevation/Stress Relief')
]

print("--- [HANDYMAN UPDATE]: Restocking the Terpene Room ---")
for name, bp, efficacy in terpene_data:
    cursor.execute("INSERT OR REPLACE INTO terpenes VALUES (?, ?, ?)", (name, bp, efficacy))
    print(f"-> Added {name} at {bp}°C")

conn.commit()
conn.close()
print("--- [SUCCESS]: Pantry updated. Linalool and Limonene are now LIVE. ---")