"""
GreenForge - Integrated Pharmacognosy Engine

PROPRIETARY SOFTWARE - ALL RIGHTS RESERVED
Copyright (c) 2025-2026 Joshua Johosky

This file contains proprietary algorithms and trade secrets.
Unauthorized use, copying, modification, or distribution is PROHIBITED.
See LICENSE file for terms.
"""
import logging
from typing import Optional, Dict, List, Any
from config import CompoundWeights, ThermalZones, ScoringConfig
from db_utils import get_boiling_point
from auth import require_authorization, AuthorizationError

logger = logging.getLogger(__name__)

class IntegratedPharmacognosyEngine:
    def __init__(self, pharma_db_path: str, kb_db_path: str):
        """
        Initialize the Pharmacognosy Engine.

        PROPRIETARY: This engine contains trade secret algorithms.

        Raises:
            AuthorizationError: If license validation fails
        """
        # AUTHORIZATION CHECK - Required for proprietary algorithm access
        from auth import check_authorization
        try:
            check_authorization()
        except AuthorizationError as e:
            logger.critical("UNAUTHORIZED ACCESS ATTEMPT")
            raise

        self.pharma_db_path = pharma_db_path
        # WEIGHT ADJUSTMENT: Prioritizing "Flavor" (Terpenes) over "Noise" (THC)
        # PROPRIETARY FORMULA
        self.BASE_WEIGHTS = {
            'terpene': CompoundWeights.TERPENE,
            'cannabinoid': CompoundWeights.CANNABINOID,
            'flavonoid': CompoundWeights.FLAVONOID
        }
        logger.info("Pharmacognosy Engine initialized (authorized)")

    def _get_boiling_point(self, name: str, c_type: str) -> Optional[float]:
        """Get boiling point for a compound from the database."""
        return get_boiling_point(name, c_type, self.pharma_db_path)

    def _calculate_thermal_status(self, boiling_point: Optional[float], temp: float) -> Dict[str, Any]:
        """
        Returns a dictionary with status details for the dashboard.

        Args:
            boiling_point: Compound boiling point in Fahrenheit
            temp: Interface temperature in Fahrenheit

        Returns:
            Dictionary with status and availability information
        """
        if not boiling_point:
            return {"status": "Unknown", "avail": 0.0}

        # PHASE 1: Sub-Critical (Aromatics)
        if temp < boiling_point:
            delta = boiling_point - temp
            if delta <= ThermalZones.PARTIAL_VOLATILIZATION_THRESHOLD:
                avail = ScoringConfig.PARTIAL_VOLATILIZATION_MIN + (
                    ScoringConfig.PARTIAL_VOLATILIZATION_RANGE *
                    (1 - (delta / ThermalZones.PARTIAL_VOLATILIZATION_THRESHOLD))
                )
                return {"status": "Partial Volatilization ⚡", "avail": avail}
            return {"status": "Locked 🔒", "avail": ScoringConfig.LOCKED_AVAILABILITY}

        # PHASE 2: Optimal Window
        if boiling_point <= temp <= (boiling_point + ThermalZones.OPTIMAL_WINDOW_OFFSET):
            return {"status": "Fully Active ✅", "avail": 1.0}

        # PHASE 3: Thermal Degradation
        if temp > (boiling_point + ThermalZones.OPTIMAL_WINDOW_OFFSET):
            excess_heat = temp - (boiling_point + ThermalZones.OPTIMAL_WINDOW_OFFSET)
            degradation_factor = max(0.0, 1.0 - (excess_heat * ThermalZones.DEGRADATION_RATE))
            return {"status": "Degrading ⚠️", "avail": degradation_factor}

        return {"status": "Error", "avail": 0.0}

    def _get_safety_zone(self, temp: float) -> Dict[str, str]:
        """Get safety zone information for a given temperature."""
        return ThermalZones.get_zone_info(temp)

    @require_authorization
    def rank_products_integrated(self, user: Dict[str, Any], products: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Rank products using proprietary pharmacognosy algorithms.

        PROPRIETARY: This method contains trade secret scoring algorithms.

        Args:
            user: User profile with conditions and preferences
            products: List of products to rank

        Returns:
            Sorted list of products with match scores

        Raises:
            AuthorizationError: If license validation fails
        """
        results = []
        temp = user.get('interface_temp', ThermalZones.DEFAULT_TEMP)
        
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
                
                if avail > ScoringConfig.ACTIVE_COMPOUND_THRESHOLD:
                    active_compounds += 1

                # 3. Apply Modifiers & Weights
                potency = (CompoundWeights.CANNFLAVIN_A_POTENCY_MULTIPLIER
                          if c['name'] == "Cannflavin A" and temp >= CompoundWeights.CANNFLAVIN_A_TEMP_THRESHOLD
                          else 1.0)
                if potency > 1:
                    warnings.append(f"🔥 Cannflavin A Super-Activated ({int(potency)}x Potency)")

                weight = self.BASE_WEIGHTS.get(c['type'], 0.1)

                # Penalty logic
                if c['type'] == 'cannabinoid' and terpene_count < CompoundWeights.MIN_TERPENE_COUNT:
                    weight = weight * CompoundWeights.LOW_ENTOURAGE_PENALTY
                    if "⚠️ Empty High Detected" not in warnings:
                        warnings.append("⚠️ Empty High Detected (Low Entourage)")

                score += (c['val'] * potency * avail * weight)
            
            # Final Result Package
            results.append({
                "name": p['name'],
                "matchScore": min(score, ScoringConfig.MAX_SCORE),
                "compounds_available": active_compounds,
                "compounds_total": len(p.get('compounds', [])),
                "safety_zone": self._get_safety_zone(temp),
                "thermal_details": thermal_details,
                "warnings": warnings,
                "analysis": {} # Placeholder for future clinical text
            })
        
        return sorted(results, key=lambda x: x['matchScore'], reverse=True)