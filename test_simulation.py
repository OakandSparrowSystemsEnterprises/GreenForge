import sqlite3
import os
# IMPORTS: Note the Capital 'E' in Engine to match your folder
from Engine.logic import IntegratedPharmacognosyEngine

# --- SETUP: Create a temporary database for the test ---
TEST_DB = "test_pharma.db"
if os.path.exists(TEST_DB):
    os.remove(TEST_DB)

conn = sqlite3.connect(TEST_DB)
cursor = conn.cursor()

# 1. Create Tables
cursor.execute("CREATE TABLE terpenes (name TEXT, boiling_point REAL)")
cursor.execute("CREATE TABLE cannabinoids (name TEXT, boiling_point REAL)")
cursor.execute("CREATE TABLE flavonoids (name TEXT, boiling_point REAL)")

# 2. Insert Boiling Points (Physics Data)
# THC boils at 315 F, Myrcene at 334 F
cursor.execute("INSERT INTO cannabinoids VALUES ('THC', 315)")
cursor.execute("INSERT INTO terpenes VALUES ('Myrcene', 334)") 
cursor.execute("INSERT INTO terpenes VALUES ('Linalool', 388)")
conn.commit()
conn.close()

# --- THE TEST DATA ---
# Product A: The "Inflated" Street Strain (High THC, No Soul)
product_hype = {
    "name": "Hype Beast OG (32% THC)",
    "growStyle": "indoor",
    "compounds": [
        {"name": "THC", "type": "cannabinoid", "val": 32.0}, # Inflated number
        {"name": "Myrcene", "type": "terpene", "val": 0.1}   # Tiny terpene content
    ]
}

# Product B: The "Medical" Strain (Moderate THC, High Entourage)
product_med = {
    "name": "Entourage Kush (18% THC)",
    "growStyle": "sun_grown",
    "compounds": [
        {"name": "THC", "type": "cannabinoid", "val": 18.0},
        {"name": "Myrcene", "type": "terpene", "val": 1.5},
        {"name": "Linalool", "type": "terpene", "val": 0.8}
    ]
}

products = [product_hype, product_med]

# --- RUN THE ENGINE ---
print("--- 🧪 STARTING GREENFORGE SIMULATION 🧪 ---")

# THIS IS THE LINE THAT WAS MISSING OR BROKEN:
engine = IntegratedPharmacognosyEngine(TEST_DB, "dummy_kb.db")

# TEST 1: Standard Vape Temp (365°F)
print("\n[TEST 1] Temperature: 365°F (Standard)")
user_profile = {'interface_temp': 365}
results = engine.rank_products_integrated(user_profile, products)

for rank, item in enumerate(results, 1):
    print(f"#{rank}: {item['name']} - Score: {item['matchScore']:.2f}")

# TEST 2: High Heat (400°F) - Watch the penalties!
print("\n[TEST 2] Temperature: 400°F (High Heat)")
user_profile = {'interface_temp': 400}
results = engine.rank_products_integrated(user_profile, products)

for rank, item in enumerate(results, 1):
    print(f"#{rank}: {item['name']} - Score: {item['matchScore']:.2f}")

# Cleanup
if os.path.exists(TEST_DB):
    os.remove(TEST_DB)
print("\n--- SIMULATION COMPLETE ---")