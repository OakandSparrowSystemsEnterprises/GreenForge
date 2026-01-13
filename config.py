"""
GreenForge Configuration
Centralized configuration for database paths, thermal zones, and weights.
"""
import os

# ==================== DATABASE CONFIGURATION ====================
DATA_DIR = "data"
DB_FILENAME = "greenforge.db"
DB_PATH = os.path.join(DATA_DIR, DB_FILENAME)

# Alternative database path for cloud/Streamlit deployments
CLOUD_DB_FILENAME = "greenforge_cloud.db"

# ==================== THERMAL ZONES (°F) ====================
class ThermalZones:
    """Temperature zone boundaries and safety information."""

    # Zone boundaries
    ZONE_A_MAX = 311  # Flavor/Cerebral - Preservation of volatiles
    ZONE_B_MAX = 365  # Medical/Entourage - Optimal Therapeutic Window
    ZONE_C_MAX = 401  # High Extraction - Sedative effects increase
    ZONE_D_MAX = 482  # High Risk - Benzene formation begins
    # Above 482°F = Zone E - Combustion/Carcinogenic byproducts

    # Default operating temperature
    DEFAULT_TEMP = 365

    # Thermal calculations
    OPTIMAL_WINDOW_OFFSET = 40  # °F above boiling point
    PARTIAL_VOLATILIZATION_THRESHOLD = 15  # °F below boiling point
    DEGRADATION_RATE = 0.02  # Factor per °F of excess heat

    @staticmethod
    def get_zone_info(temp: float) -> dict:
        """Get safety zone information for a given temperature."""
        if temp < ThermalZones.ZONE_A_MAX:
            return {
                "zone": "Zone A",
                "risk": "LOW",
                "description": "Flavor/Cerebral - Preservation of volatiles"
            }
        elif temp < ThermalZones.ZONE_B_MAX:
            return {
                "zone": "Zone B",
                "risk": "LOW",
                "description": "Medical/Entourage - Optimal Therapeutic Window"
            }
        elif temp < ThermalZones.ZONE_C_MAX:
            return {
                "zone": "Zone C",
                "risk": "MEDIUM",
                "description": "High Extraction - Sedative effects increase"
            }
        elif temp < ThermalZones.ZONE_D_MAX:
            return {
                "zone": "Zone D",
                "risk": "HIGH",
                "description": "High Risk - Benzene formation begins"
            }
        else:
            return {
                "zone": "Zone E",
                "risk": "CRITICAL",
                "description": "Combustion - Carcinogenic byproducts"
            }


# ==================== COMPOUND WEIGHTS ====================
class CompoundWeights:
    """Weight adjustments prioritizing Flavor (Terpenes) over Noise (THC)."""

    TERPENE = 0.6
    CANNABINOID = 0.2
    FLAVONOID = 0.2

    # Penalty for low entourage effect
    LOW_ENTOURAGE_PENALTY = 0.5
    MIN_TERPENE_COUNT = 2

    # Special compound modifiers
    CANNFLAVIN_A_TEMP_THRESHOLD = 182  # °F
    CANNFLAVIN_A_POTENCY_MULTIPLIER = 30.0


# ==================== BOILING POINTS (°F) ====================
class BoilingPoints:
    """Common compound boiling points for reference."""

    # Major Cannabinoids
    THC = 314.6
    CBD = 320.0
    CBN = 365.0
    CBC = 428.0
    CBG = 126.0
    THCV = 428.0

    # Major Terpenes
    BETA_MYRCENE = 334.4
    LIMONENE = 349.4
    BETA_CARYOPHYLLENE = 246.2
    ALPHA_PINENE = 311.0
    LINALOOL = 388.4
    HUMULENE = 222.8


# ==================== SCORING CONSTANTS ====================
class ScoringConfig:
    """Configuration for product scoring and matching."""

    MAX_SCORE = 100
    ACTIVE_COMPOUND_THRESHOLD = 0.5  # Availability threshold
    LOCKED_AVAILABILITY = 0.05
    PARTIAL_VOLATILIZATION_MIN = 0.1
    PARTIAL_VOLATILIZATION_RANGE = 0.9


# ==================== API CONFIGURATION ====================
class APIConfig:
    """FastAPI server configuration."""

    HOST = "0.0.0.0"
    PORT = 8000
    RELOAD = True
    LOG_LEVEL = "info"

    # CORS settings
    ALLOW_ORIGINS = ["*"]  # Restrict in production
    ALLOW_CREDENTIALS = True
    ALLOW_METHODS = ["*"]
    ALLOW_HEADERS = ["*"]

    # API metadata
    TITLE = "GreenForge Engine"
    DESCRIPTION = "Cannabis product recommendation API with thermal interface modeling"
    VERSION = "1.0.0"


# ==================== DATABASE TABLES ====================
class DatabaseTables:
    """Database table names."""

    CANNABINOIDS = "cannabinoids"
    TERPENES = "terpenes"
    FLAVONOIDS = "flavonoids"
    PRODUCTS = "products"
    PRODUCT_COMPOUNDS = "product_compounds"

    # Valid compound types
    VALID_COMPOUND_TYPES = {CANNABINOIDS, TERPENES, FLAVONOIDS}


# ==================== LOGGING CONFIGURATION ====================
class LoggingConfig:
    """Logging configuration."""

    LOG_FORMAT = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    DATE_FORMAT = "%Y-%m-%d %H:%M:%S"
    DEFAULT_LEVEL = "INFO"
