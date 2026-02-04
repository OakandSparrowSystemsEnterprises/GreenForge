import math
import logging
from enum import Enum, auto
from decimal import Decimal, Context, ROUND_HALF_UP

# =============================================================================
# GREENFORGE AUTHORITY SPEC: IMMUTABLE MANIFEST
# =============================================================================
CANONICAL_UNIT = "°C"
GF_QUANT = Decimal("0.0001")
GF_CONTEXT = Context(prec=12, rounding=ROUND_HALF_UP)

class ThermalState(Enum):
    LOCKED = auto()
    UNLOCKED = auto()

def state_label(state: ThermalState) -> str:
    """I/O Boundary: Maps Enums to display strings for UI feedback."""
    return {
        ThermalState.LOCKED: "Locked",
        ThermalState.UNLOCKED: "Unlocked"
    }.get(state, "Unknown State")

def _force_valid_numeric(val: float, label: str):
    """Internal Guard: Rejects non-finite or non-numeric data."""
    if not isinstance(val, (int, float)) or not math.isfinite(val):
        raise ValueError(f"GreenForge Data Integrity Error: Invalid {label} ({val})")

def f_to_c(temp_f: float) -> float:
    """I/O Boundary: F-to-C conversion with enforced 4-decimal precision."""
    _force_valid_numeric(temp_f, "Fahrenheit Input")
    f_dec = Decimal(str(temp_f))
    c_dec = GF_CONTEXT.divide((f_dec - Decimal("32.0")) * Decimal("5.0"), Decimal("9.0"))
    return float(c_dec.quantize(GF_QUANT))

# =============================================================================
# ATOMIC GOVERNOR: THE QUANTIZED DECISION CORE
# =============================================================================

def evaluate_gate_state(temp_c: float, compound_threshold_c: float) -> ThermalState:
    """Pure Function: Performs quantization-aware comparison."""
    _force_valid_numeric(temp_c, "Celsius Temperature")
    _force_valid_numeric(compound_threshold_c, "Compound Threshold")
    
    t_a = Decimal(str(temp_c)).quantize(GF_QUANT, context=GF_CONTEXT)
    t_b = Decimal(str(compound_threshold_c)).quantize(GF_QUANT, context=GF_CONTEXT)
    
    return ThermalState.UNLOCKED if t_a >= t_b else ThermalState.LOCKED

# =============================================================================
# LOGIC GASKET: THE IMPORT-TIME DIAGNOSTIC
# =============================================================================

# --- change this ---
GF_CONTEXT = Context(prec=12, rounding=ROUND_HALF_UP)  # was prec=6

def _run_production_audit():
    """Mandatory logic gasket. Failure prevents engine initialization."""
    thc_threshold_c = 315.0

    # Unit Boundary Lock (Decimal-to-Decimal, quantized)
    expected = GF_CONTEXT.divide(
        (Decimal("470.0") - Decimal("32.0")) * Decimal("5.0"),
        Decimal("9.0")
    ).quantize(GF_QUANT, context=GF_CONTEXT)

    actual = Decimal(str(f_to_c(470.0))).quantize(GF_QUANT, context=GF_CONTEXT)

    if actual != expected:
        raise RuntimeError(f"CRITICAL: F-to-C Conversion Drift. Expected {expected}, got {actual}")

    # Gate Logic Lock
    if evaluate_gate_state(float(actual), thc_threshold_c) != ThermalState.LOCKED:
        raise RuntimeError("Gate Drift: expected LOCKED below threshold")

    if evaluate_gate_state(343.3333, thc_threshold_c) != ThermalState.UNLOCKED:
        raise RuntimeError("Gate Drift: expected UNLOCKED above threshold")

    # Poison Handling Validation
    for bad_val in [float('nan'), float('inf')]:
        try:
            f_to_c(bad_val)
            raise RuntimeError("Poison Leak: f_to_c failed to raise on NaN/Inf")
        except ValueError:
            pass

        try:
            evaluate_gate_state(bad_val, thc_threshold_c)
            raise RuntimeError("Poison Leak: evaluate_gate_state failed to raise on NaN/Inf")
        except ValueError:
            pass


# ENGAGE LOCK
try:
    _run_production_audit()
except Exception as e:
    logging.critical(f"GreenForge Governance Integrity Compromised - {e}")
    raise