import sqlite3
import os
DB_PATH = os.path.join("Data", "greenforge.db")
conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()
focus_data = [
    ('THCV', 220.0, 'Energy/Appetite Suppression'),
    ('Alpha-Pinene', 155.0, 'Focus/Memory Retention')
]
print("--- [HANDYMAN FIX]: Adding Focus & Energy Compounds ---")
for name, bp, note in focus_data:
    # Adding to both rooms for redundancy during this test
    cursor.execute("INSERT OR REPLACE INTO cannabinoids VALUES (?, ?, ?)", (name, bp, note))
    cursor.execute("INSERT OR REPLACE INTO terpenes VALUES (?, ?, ?)", (name, bp, note))
    print(f"-> Added {name} at {bp}°C")
conn.commit()
conn.close()
