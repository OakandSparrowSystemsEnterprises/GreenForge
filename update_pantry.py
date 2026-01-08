import sqlite3
import os

# Connect to the database file
db_path = os.path.join("data", "greenforge.db")
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Adding the 'Nerve Relief' terpenes from your clinical papers [cite: 1308-1312, 1988-1997]
cursor.execute("INSERT OR REPLACE INTO terpenes VALUES ('Myrcene', 168.0, 'Nerve/Muscle Relaxation')")
cursor.execute("INSERT OR REPLACE INTO terpenes VALUES ('Caryophyllene', 263.0, 'Neuropathic Pain Relief')")

conn.commit()
conn.close()
print("--- [SUCCESS]: Nerve relief terpenes added. Pantry is now premium-ready.")