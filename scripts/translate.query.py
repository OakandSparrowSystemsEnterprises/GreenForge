import json
import os

def create_medical_audit(condition_input, temp_f):
    # Mapping layman terms to the GreenForge Logic
    condition_map = {
        "focus": {"name": "ADHD/Focus", "severity": 10, "target": "Alpha-Pinene"},
        "energy": {"name": "Low Energy", "severity": 8, "target": "THCV"},
        "nerve": {"name": "Neuropathic Pain", "severity": 9, "target": "Cannflavin A"},
        "anxiety": {"name": "Anxiety", "severity": 7, "target": "CBD"}
    }

    # Convert Fahrenheit to Celsius for the Engine
    temp_c = round((temp_f - 32) / 1.8, 1)

    # Build the Audit Profile
    user_profile = {
        "interface_temp": temp_c,
        "conditions": [condition_map[c.strip().lower()] for c in condition_input.split(",") if c.strip().lower() in condition_map]
    }

    # Create a Sample Medical Product (This mimics a pharmacy's inventory)
    product_list = [{
        "name": "Clinical Sample 001",
        "growStyle": "living_soil",
        "compounds": [
            {"name": "THC", "val": 5.0},
            {"name": "THCV", "val": 3.0},
            {"name": "Alpha-Pinene", "val": 1.5},
            {"name": "CBD", "val": 2.0},
            {"name": "Cannflavin A", "val": 1.0}
        ]
    }]

    audit_data = {"user_profile": user_profile, "product_list": product_list}

    with open("physician_audit.json", "w") as f:
        json.dump(audit_data, f, indent=2)

    print(f"\n--- [TRANSLATION COMPLETE] ---")
    print(f"Targeting: {condition_input}")
    print(f"Thermal Gate: {temp_f}°F ({temp_c}°C)")
    print(f"File saved as: physician_audit.json")
    print(f"\nCopy and paste this into PowerShell to run the audit:")
    print(f"Invoke-RestMethod -Uri 'http://127.0.0.1:8000/api/v1/recommend' -Method Post -InFile 'physician_audit.json' -ContentType 'application/json'")

# --- RUN THE TRANSLATOR ---
query = input("Enter patient needs (e.g., focus, anxiety): ")
temp = float(input("Enter patient interface temperature (F): "))
create_medical_audit(query, temp)