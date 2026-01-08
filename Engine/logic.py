import sqlite3

class IntegratedPharmacognosyEngine:
    def __init__(self, pharma_db_path, kb_db_path):
        self.pharma_db_path = pharma_db_path
        self.BASE_WEIGHTS = {'terpene': 0.5, 'cannabinoid': 0.3, 'flavonoid': 0.2} # [cite: 27-31]

    def _apply_cultivation_modifiers(self, name, c_type, grow_style, base_val):
        # Logic Block A: Grow Style Modifiers (Source: p. 3)
        if grow_style == "sun_grown" and c_type == "flavonoid":
            return base_val * 1.40 # 40% boost [cite: 85-87]
        return base_val

    def _calculate_thermal_availability(self, name, c_type, temp):
        # Logic Block B: Thermal Filter (Source: p. 4)
        conn = sqlite3.connect(self.pharma_db_path)
        cursor = conn.cursor()
        table = "terpenes" if c_type == "terpene" else "cannabinoids" if c_type == "cannabinoid" else "flavonoids"
        cursor.execute(f"SELECT boiling_point FROM {table} WHERE name = ?", (name,))
        res = cursor.fetchone()
        conn.close()
        if res and res[0] <= temp: return 1.0 # Full release [cite: 131-137]
        return 0.0 # No release [cite: 131-132]

    def rank_products_integrated(self, user, products):
        results = []
        temp = user.get('interface_temp', 185) # [cite: 44]
        for p in products:
            score = 0
            for c in p.get('compounds', []):
                avail = self._calculate_thermal_availability(c['name'], c['type'], temp)
                mod_val = self._apply_cultivation_modifiers(c['name'], c['type'], p.get('growStyle'), c['val'])
                
                # 30x Potency Multiplier for Cannflavin A (Source: p. 7)
                potency = 30.0 if c['name'] == "Cannflavin A" and temp >= 182 else 1.0 # [cite: 236-243]
                score += (mod_val * potency * avail)
            
            results.append({"name": p['name'], "matchScore": min(score, 100)})
        return sorted(results, key=lambda x: x['matchScore'], reverse=True)