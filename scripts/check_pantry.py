import sqlite3
import os

DB_PATH = os.path.join("data", "greenforge.db")

def audit_pantry():
    if not os.path.exists(DB_PATH):
        print(f"ERROR: Pantry not found at {DB_PATH}")
        return

    print(f"--- [GREENFORGE PANTRY AUDIT]: {DB_PATH} ---")
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    rooms = ["cannabinoids", "terpenes", "flavonoids"]
    
    for room in rooms:
        print(f"\n--- Scanning Room: {room.upper()} ---")
        cursor.execute(f"SELECT name, boiling_point FROM {room} ORDER BY name")
        rows = cursor.fetchall()
        
        for row in rows:
            name = row[0]
            bp_c = row[1]
            
            # THE SAFETY CHECK: Handle NoneType (N/A) boiling points
            if bp_c is not None:
                bp_f = round(bp_c * 1.8 + 32, 1)
                print(f"   -> {name:<20} | {bp_f:>6}°F ({bp_c:>5}°C)")
            else:
                print(f"   -> {name:<20} |    N/A  (Research Pending)")

    conn.close()
    print("\n--- [AUDIT COMPLETE]: All circuits verified. ---")

if __name__ == "__main__":
    audit_pantry()