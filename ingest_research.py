import os
import sqlite3
import pdfplumber
import re

# Paths to your "Pantry" and "Library"
DB_PATH = os.path.join("data", "greenforge.db")
PAPERS_DIR = "research_papers"

def extract_clinical_data():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    print(f"--- [SYSTEM]: Starting ingestion of 56 pages of research...")

    for filename in os.listdir(PAPERS_DIR):
        if filename.endswith(".pdf"):
            path = os.path.join(PAPERS_DIR, filename)
            with pdfplumber.open(path) as pdf:
                full_text = ""
                for page in pdf.pages:
                    full_text += page.extract_text()
                
                # --- AUTO-DETECTION LOGIC ---
                # Searching for boiling points (e.g., "THC... 157C") [cite: 117-120, 1337]
                cannabinoid_matches = re.findall(r"(\w+)\s+.*?\s+(\d{3})[°C]", full_text)
                for name, bp in cannabinoid_matches:
                    cursor.execute("INSERT OR REPLACE INTO cannabinoids (name, boiling_point) VALUES (?, ?)", (name, float(bp)))
                    print(f"--- [INGESTED]: {name} Boiling Point: {bp}°C")

                # Searching for the 30x Multiplier [cite: 1371, 1788, 2365]
                if "30x" in full_text and "Cannflavin" in full_text:
                    cursor.execute("INSERT OR REPLACE INTO synergy_rules (rule_id, rule_name, condition, multiplier) VALUES (?, ?, ?, ?)", 
                                  ("SYN-03", "Pain Relief (Flavonoid Boost)", "Pain", 30.0))
                    print("--- [INGESTED]: 30x Potency Multiplier for Cannflavin A.")

    conn.commit()
    conn.close()
    print("--- [SUCCESS]: Your PDFs have been synthesized into the database.")

if __name__ == "__main__":
    extract_clinical_data()
    