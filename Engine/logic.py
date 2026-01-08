import sqlite3
import math

class IntegratedPharmacognosyEngine:
    def __init__(self, pharma_db_path, kb_db_path):
        self.pharma_db_path = pharma_db_path
        # WEIGHT ADJUSTMENT: Prioritizing "Flavor" (Terpenes) over "Noise" (THC)
        self.BASE_WEIGHTS = {'terpene': 0.6, 'cannabinoid': 0.2, 'flavonoid': 0.2} 

    def _apply_cultivation_modifiers(self, name, c_type, grow_style, base_val):
        # Logic Block A: Grow Style Modifiers
        # Sun-grown creates complex flavonoids that indoor lights often miss.
        if grow_style == "sun_grown" and c_type == "flavonoid":
            return base_val * 1.50 # 50% boost to reflect full-spectrum complexity
        return base_val

    def _calculate_receptor_saturation(self, val, c_type):
        """
        FILTERS THE 'THC NOISE'
        Real-world efficacy plateaus. A 35% THC strain is not 2x better than 17%.
        This function applies a logarithmic curve to high percentages.
        """
        if c_type == 'cannabinoid':
            # Cap the 'useful' THC at 25%. Anything higher gets heavily diminished returns.
            if val > 25.0:
                excess = val - 25.0
                return 25.0 + (excess * 0.1) # Only credit 10% of the inflated number
            return val
        return val

    def _calculate_thermal_availability(self, name, c_type, temp):
        """
        Logic Block B: Thermal Volatilization & Degradation
        Calculates availability based on Boiling Points.
        """
        conn = sqlite3.connect(self.pharma_db_path)
        cursor = conn.cursor()
        table = "terpenes" if c_type == "terpene" else "cannabinoids" if c_type == "cannabinoid" else "flavonoids"
        cursor.execute(f"SELECT boiling_point FROM {table} WHERE name = ?", (name,))
        res = cursor.fetchone()
        conn.close()

        if not res:
            return 0.0 # Unknown compound
            
        boiling_point = res[0]

        # PHASE 1: Sub-Critical (Aromatics)
        # 15-degree window BEFORE boiling where you get flavor but less density
        if temp < boiling_point:
            delta = boiling_point - temp
            if delta <= 15:
                return 0.1 + (0.9 * (1 - (delta / 15))) # Linear ramp up from 10% to 100%
            return 0.05 # Trace amounts only

        # PHASE 2: Optimal Window (Full Bioavailability)
        # From boiling point up to +40 degrees (Safe Zone)
        if boiling_point <= temp <= (boiling_point + 40):
            return 1.0 

        # PHASE 3: Thermal Degradation (The "Burn" Penalty)
        # Lose 2% efficacy for every degree over the safety buffer
        if temp > (boiling_point + 40):
            excess_heat = temp - (boiling_point + 40)
            degradation_factor = max(0.0, 1.0 - (excess_heat * 0.02))
            return degradation_factor
            
        return 0.0

    def rank_products_integrated(self, user, products):
        results = []
        temp = user.get('interface_temp', 365) # Default to 365F (standard vape temp)
        
        for p in products:
            score = 0
            # Check for Terpene "Emptiness" (High THC, No Terpenes = Low Score)
            terpene_count = sum(1 for c in p.get('compounds', []) if c['type'] == 'terpene')
            
            for c in p.get('compounds', []):
                # Step 1: Filter the "Noise" (Inflation)
                real_val = self._calculate_receptor_saturation(c['val'], c['type'])
                
                # Step 2: Apply Thermal Physics
                avail = self._calculate_thermal_availability(c['name'], c['type'], temp)
                
                # Step 3: Apply Cultivation Bonus
                mod_val = self._apply_cultivation_modifiers(c['name'], c['type'], p.get('growStyle'), real_val)
                
                # SPECIAL: Cannflavin A Potency Multiplier
                potency = 30.0 if c['name'] == "Cannflavin A" and temp >= 182 else 1.0
                
                # Final Weight Calculation
                weight = self.BASE_WEIGHTS.get(c['type'], 0.1)
                
                # Penalty: If product has < 2 terpenes, slash the THC score by half (Empty High)
                if c['type'] == 'cannabinoid' and terpene_count < 2:
                    weight = weight * 0.5
                
                score += (mod_val * potency * avail * weight)
            
            results.append({"name": p['name'], "matchScore": min(score, 100)})
        
        return sorted(results, key=lambda x: x['matchScore'], reverse=True)