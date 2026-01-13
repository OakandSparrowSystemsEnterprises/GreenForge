import sqlite3
import os

# Path to the REAL database used by the API
DB_PATH = os.path.join("data", "greenforge.db")

# Ensure the data directory exists
if not os.path.exists("data"):
    os.makedirs("data")

def seed_database():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    print(f"🌱 Seeding database at: {DB_PATH}")

    # 1. Clear old data (fresh start)
    cursor.execute("DROP TABLE IF EXISTS terpenes")
    cursor.execute("DROP TABLE IF EXISTS cannabinoids")
    cursor.execute("DROP TABLE IF EXISTS flavonoids")

    # 2. Create Tables
    cursor.execute("CREATE TABLE terpenes (name TEXT PRIMARY KEY, boiling_point REAL)")
    cursor.execute("CREATE TABLE cannabinoids (name TEXT PRIMARY KEY, boiling_point REAL)")
    cursor.execute("CREATE TABLE flavonoids (name TEXT PRIMARY KEY, boiling_point REAL)")

    # 3. Insert Cannabinoids (Boiling Points in F)
    cannabinoids = [
        ("THC", 315),
        ("CBD", 356),
        ("CBG", 126), # Low BP
        ("CBN", 365),
        ("THCV", 428),
        ("THCP", 315), # Assumed similar to THC structure
        ("CBC", 428)
    ]
    cursor.executemany("INSERT INTO cannabinoids VALUES (?, ?)", cannabinoids)
    print(f"✅ Added {len(cannabinoids)} Cannabinoids")

    # 4. Insert Terpenes
    terpenes = [
        ("Myrcene", 334),
        ("Limonene", 349),
        ("Alpha-Pinene", 311),
        ("Linalool", 388),
        ("Caryophyllene", 266),
        ("Humulene", 225),
        ("Terpinolene", 365),
        ("Borneol", 410)
    ]
    cursor.executemany("INSERT INTO terpenes VALUES (?, ?)", terpenes)
    print(f"✅ Added {len(terpenes)} Terpenes")

    # 5. Insert Flavonoids
    flavonoids = [
        ("Cannflavin A", 360), # Approx activation
        ("Cannflavin B", 360),
        ("Quercetin", 482), # Very high
        ("Apigenin", 352)
    ]
    cursor.executemany("INSERT INTO flavonoids VALUES (?, ?)", flavonoids)
    print(f"✅ Added {len(flavonoids)} Flavonoids")

    conn.commit()
    conn.close()
    print("🚀 Database successfully populated!")

if __name__ == "__main__":
    seed_database()