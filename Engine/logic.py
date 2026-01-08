import sqlite3
import math

class IntegratedPharmacognosyEngine:
    def __init__(self, pharma_db_path, kb_db_path):
        self.pharma_db_path = pharma_db_path
        # WEIGHT ADJUSTMENT: Prioritizing "Flavor" (Terpenes) over "Noise" (THC)
        self.BASE_WEIGHTS = {'terpene': 0.6, 'cannabinoid': 0.2, 'flavonoid': 0.2} 

    def _get_boiling_point(self, name, c_type):
        conn = sqlite3.connect(self.pharma_db_path)
        cursor = conn.cursor()
        table = "terpenes" if c_type == "terpene" else "cannabinoids" if c_type == "cannabinoid" else "flavonoids"
        cursor.execute(f"SELECT boiling_point FROM {table} WHERE name = ?", (name,))
        res = cursor.fetchone()
        conn.close()
        return res[0] if res else None

    def _calculate_thermal_status(self, boiling_point, temp):
        """
        Returns a dictionary with status details for the dashboard.
        """
        if not boiling_point:
            return {"status": "Unknown", "avail": 0.0}

        # PHASE 1: Sub-Critical (Aromatics)
        if temp < boiling_point:
            delta = boiling_point - temp
            if delta <= 15:
                avail = 0.1 + (0.9 * (1 - (delta / 15)))
                return {"status": "Partial Volatilization ⚡", "avail": avail}
            return {"status": "Locked 🔒", "avail": 0.05}

        # PHASE 2: Optimal Window
        if boiling_point <= temp <= (boiling_point + 40):
            return {"status": "Fully Active ✅", "avail": 1.0}

        # PHASE 3: Thermal Degradation
        if temp > (boiling_point + 40):
            excess_heat = temp - (boiling_point + 40)
            degradation_factor = max(0.0, 1.0 - (excess_heat * 0.02))
            return {"status": "Degrading ⚠️", "avail": degradation_factor}
            
        return {"status": "Error", "avail": 0.0}

    def _get_safety_zone(self, temp):
        if temp < 311: return {"zone": "Zone A", "risk": "LOW", "description": "Flavor/Cerebral - Preservation of volatiles"}
        if temp < 365: return {"zone": "Zone B", "risk": "LOW", "description": "Medical/Entourage - Optimal Therapeutic Window"}
        if temp < 401: return {"zone": "Zone C", "risk": "MEDIUM", "description": "High Extraction - Sedative effects increase"}
        if temp < 482: return {"zone": "Zone D", "risk": "HIGH", "description": "High Risk - Benzene formation begins"}
        return {"zone": "Zone E", "risk": "CRITICAL", "description": "Combustion - Carcinogenic byproducts"}

    def rank_products_integrated(self, user, products):
        results = []
        temp = user.get('interface_temp', 365)
        
        for p in products:
            score = 0
            thermal_details = {}
            active_compounds = 0
            warnings = []
            
            # Check for Terpene "Emptiness"
            terpene_count = sum(1 for c in p.get('compounds', []) if c['type'] == 'terpene')
            
            for c in p.get('compounds', []):
                # 1. Get Physics Data
                bp = self._get_boiling_point(c['name'], c['type'])
                
                # 2. Calculate Thermal Status
                t_stat = self._calculate_thermal_status(bp, temp)
                avail = t_stat['avail']
                
                # Store details for Dashboard
                thermal_details[c['name']] = {
                    "status": t_stat['status'],
                    "boiling_point_f": bp,
                    "available": avail
                }
                
                if avail > 0.5:
                    active_compounds += 1

                # 3. Apply Modifiers & Weights
                potency = 30.0 if c['name'] == "Cannflavin A" and temp >= 182 else 1.0
                if potency > 1: warnings.append(f"🔥 Cannflavin A Super-Activated (30x Potency)")

                weight = self.BASE_WEIGHTS.get(c['type'], 0.1)
                
                # Penalty logic
                if c['type'] == 'cannabinoid' and terpene_count < 2:
                    weight = weight * 0.5
                    if "⚠️ Empty High Detected" not in warnings:
                        warnings.append("⚠️ Empty High Detected (Low Entourage)")

                score += (c['val'] * potency * avail * weight)
            
            # Final Result Package
            results.append({
                "name": p['name'],
                "matchScore": min(score, 100),
                "compounds_available": active_compounds,
                "compounds_total": len(p.get('compounds', [])),
                "safety_zone": self._get_safety_zone(temp),
                "thermal_details": thermal_details,
                "warnings": warnings,
                "analysis": {} # Placeholder for future clinical text
            })
        
        return sorted(results, key=lambda x: x['matchScore'], reverse=True)