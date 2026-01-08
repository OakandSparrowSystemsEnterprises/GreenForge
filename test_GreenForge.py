import json
import requests

def run_live_test():
    print("--- [GREENFORGE MEDICAL TEST SUITE: REAL-WORLD AUDIT] ---")
    print("1. Nerve Relief (Market Reality: 35% THC, 0.2% Terpenes)")
    print("2. Quantum Clarity (Market Reality: 28% THC, 0.3% Terpenes)")
    print("3. Custom Molecular Engineering (Full Ratio Control)")
    
    choice = input("\nSelect a test scenario (1-3): ")
    if choice not in ["1", "2", "3"]: return

    temp_f = float(input("Enter Device Temperature (F): "))
    temp_c = round((temp_f - 32) / 1.8, 1)
    
    if choice == "3":
        cond_name = input("Enter Patient Condition: ")
        severity = int(input("Enter Severity (1-10): "))
        comp_name = input("Enter Primary Medicine: ")
        comp_val = float(input(f"Enter {comp_name} %: "))
        thc_val = float(input("Enter THC %: "))
    elif choice == "1":
        # REAL WORLD NERVE: High THC, Tiny Terpene signal
        cond_name, comp_name, comp_val, thc_val, severity = "Neuropathic Pain", "Caryophyllene", 0.2, 35.0, 9
    elif choice == "2":
        # REAL WORLD FOCUS: High THC will drown out the 0.3% Pinene
        cond_name, comp_name, comp_val, thc_val, severity = "ADHD Focus", "Alpha-Pinene", 0.3, 28.0, 7

    payload = {
        "user_profile": {"interface_temp": temp_c, "conditions": [{"name": cond_name, "severity": severity}]},
        "product_list": [{"name": f"Market Profile: {cond_name}", "growStyle": "distillate", 
                          "compounds": [{"name": comp_name, "val": comp_val}, {"name": "THC", "val": thc_val}]}]
    }

    try:
        response = requests.post("http://127.0.0.1:8000/api/v1/recommend", json=payload)
        response.raise_for_status() 
        score = response.json()['results'][0]['matchScore']
        
        print(f"\n--- [BRAIN CHECK RESULTS] ---")
        print(f"Interface: {temp_f}F | Match Score: {score}%")
        
        if score < 20:
            print("DIAGNOSTIC: FAILURE. High THC 'Noise' has overwhelmed the medicinal signal.")
        elif score < 50:
            print("DIAGNOSTIC: WEAK. Intoxication will be high, but medicinal efficacy is low.")
        else:
            print("DIAGNOSTIC: SUCCESS. Signal-to-Noise ratio is balanced.")

    except Exception as e:
        print(f"\nERROR: Connection Failed. Technical Detail: {e}")

if __name__ == "__main__":
    run_live_test()