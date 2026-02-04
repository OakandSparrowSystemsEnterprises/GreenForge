import streamlit as st
import pandas as pd
import sqlite3

# --- IMPORT GOVERNANCE LAYER ---
# Rule: If governance.py fails its internal audit, this import will crash the app.
from governance import ThermalState, f_to_c, evaluate_gate_state, state_label, CANONICAL_UNIT

# --- IMPORT ENGINE ---
from Engine.logic import IntegratedPharmacognosyEngine

# --- PAGE CONFIG ---
st.set_page_config(page_title="GreenForge Engine", page_icon="🧬", layout="wide")

# --- CSS STYLING ---
custom_css = '''
<style>
.main { background-color: #0e1117; }
.stMetric { 
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
    border: 1px solid rgba(102, 126, 234, 0.3);
    padding: 20px;
    border-radius: 12px;
}
.success-box { background: rgba(74, 222, 128, 0.1); border-left: 4px solid #4ade80; padding: 15px; border-radius: 8px; margin: 10px 0; }
.warning-box { background: rgba(251, 191, 36, 0.1); border-left: 4px solid #fbbf24; padding: 15px; border-radius: 8px; margin: 10px 0; }
.error-box { background: rgba(239, 68, 68, 0.1); border-left: 4px solid #ef4444; padding: 15px; border-radius: 8px; margin: 10px 0; }
</style>
'''
st.markdown(custom_css, unsafe_allow_html=True)

# --- CLOUD DATABASE SETUP ---
@st.cache_resource
def get_engine():
    db_path = "greenforge_cloud.db"
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # 1. Clear and Rebuild (Ensures schema matches logic)
    cursor.execute("DROP TABLE IF EXISTS terpenes")
    cursor.execute("DROP TABLE IF EXISTS cannabinoids")
    cursor.execute("DROP TABLE IF EXISTS flavonoids")

    cursor.execute("CREATE TABLE terpenes (name TEXT PRIMARY KEY, boiling_point REAL)")
    cursor.execute("CREATE TABLE cannabinoids (name TEXT PRIMARY KEY, boiling_point REAL)")
    cursor.execute("CREATE TABLE flavonoids (name TEXT PRIMARY KEY, boiling_point REAL)")

    # Data includes Celsius boiling points
    cannabinoids = [("THC", 315), ("CBD", 356), ("CBG", 126), ("CBN", 365), ("THCV", 428), ("THCP", 315), ("CBC", 428)]
    terpenes = [("Myrcene", 334), ("Limonene", 349), ("Alpha-Pinene", 311), ("Linalool", 388), ("Caryophyllene", 266), ("Humulene", 225), ("Terpinolene", 365), ("Borneol", 410)]
    flavonoids = [("Cannflavin A", 360), ("Cannflavin B", 360), ("Quercetin", 482), ("Apigenin", 352)]

    cursor.executemany("INSERT INTO cannabinoids VALUES (?, ?)", cannabinoids)
    cursor.executemany("INSERT INTO terpenes VALUES (?, ?)", terpenes)
    cursor.executemany("INSERT INTO flavonoids VALUES (?, ?)", flavonoids)
    conn.commit()
    conn.close()

    return IntegratedPharmacognosyEngine(db_path, "dummy_kb.db")

engine = get_engine()

# --- APP UI START ---
st.title("🧬 GreenForge: Computational Pharmacognosy Engine")
st.subheader("Research-Based Medical Cannabis Analysis with Thermal Modeling")

# --- SIDEBAR: THERMAL GOVERNANCE ---
with st.sidebar:
    st.header("👤 Patient Profile")
    condition = st.selectbox(
        "Primary Condition",
        ["Neuropathic Pain", "Migraine", "ADHD/Focus", "Insomnia", "Anxiety", "Chronic Inflammation", "Depression"],
    )
    severity = st.slider("Severity Level", 1, 10, 8)

    st.divider()
    st.header("🌡️ Thermal Interface")

    # Capture Fahrenheit input
    temp_f = st.slider("Device Temperature (°F)", 300, 500, 350, step=5)

    # MANDATORY CONVERSION: f_to_c creates the canonical value used by the UI governor
    try:
        temp_c = f_to_c(temp_f)
        data_error = False
    except ValueError as e:
        st.error(f"Input Error: {e}")
        temp_c = 0.0
        data_error = True

    # Thermal Zone UI Logic (still based on F bands for the slider)
    if temp_f < 311:
        zone_color, zone_name = "🟢", "Zone A - Flavor/Cerebral"
    elif temp_f < 365:
        zone_color, zone_name = "🟢", "Zone B - Medical/Entourage"
    elif temp_f < 401:
        zone_color, zone_name = "🟡", "Zone C - High Extraction"
    elif temp_f < 482:
        zone_color, zone_name = "🟠", "Zone D - High Risk (Benzene)"
    else:
        zone_color, zone_name = "🔴", "Zone E - Combustion (Avoid!)"

    st.info(f"{zone_color} **{zone_name}**\n\n{temp_f}°F = {temp_c}{CANONICAL_UNIT}")

    st.divider()
    st.header("🌱 Cultivation Data")
    grow_style = st.selectbox("Grow Style", ["living_soil", "sun_grown", "hydroponic", "drought_stress"])

# --- MAIN INPUT ---
col1, col2 = st.columns([1, 1])

with col1:
    st.markdown("### 📦 Product Formulation")
    p_name = st.text_input("Product Name", "Clinical Sample 001")

    st.markdown("#### Compound Profile")
    num_compounds = st.number_input("Number of compounds", 1, 10, 3)
    compounds = []

    # ✅ correct name → type mapping (outside the loop)
    compound_types = {
        "THC": "cannabinoid",
        "CBD": "cannabinoid",
        "CBG": "cannabinoid",
        "CBN": "cannabinoid",
        "THCV": "cannabinoid",
        "THCP": "cannabinoid",
        "CBC": "cannabinoid",
        "Myrcene": "terpene",
        "Limonene": "terpene",
        "Alpha-Pinene": "terpene",
        "Linalool": "terpene",
        "Caryophyllene": "terpene",
        "Humulene": "terpene",
        "Terpinolene": "terpene",
        "Borneol": "terpene",
        "Cannflavin A": "flavonoid",
        "Cannflavin B": "flavonoid",
        "Quercetin": "flavonoid",
        "Apigenin": "flavonoid",
    }

    for i in range(num_compounds):
        c_a, c_b = st.columns([2, 1])
        with c_a:
            c_name = st.selectbox(
                f"Compound {i+1}",
                [
                    "THC", "CBD", "CBG", "CBN", "THCV", "THCP", "CBC",
                    "Myrcene", "Limonene", "Alpha-Pinene", "Linalool",
                    "Caryophyllene", "Humulene", "Terpinolene",
                    "Cannflavin A", "Cannflavin B", "Quercetin",
                    "Apigenin", "Borneol",
                ],
                key=f"c_{i}",
                index=0 if i == 0 else (10 if i == 1 else 5),
            )
        with c_b:
            c_val = st.number_input(
                "% / ppm",
                0.0,
                100.0,
                18.0 if c_name == "THC" else 0.8,
                step=0.1,
                key=f"v_{i}",
            )

        c_type = compound_types.get(c_name, "terpene")
        compounds.append({"name": c_name, "val": c_val, "type": c_type})

# --- EXECUTION ---
if st.button("🚀 EXECUTE CLINICAL AUDIT", use_container_width=True, disabled=data_error):
    with st.spinner("Analyzing bioavailability..."):
        # ✅ Engine consumes interface_temp as Fahrenheit
        user_profile = {
            "interface_temp": temp_f,
            "interface_temp_c": temp_c,
            "interface_temp_f": temp_f,
            "condition": condition,
            "severity": severity,
        }

        product_data = [{
            "name": p_name,
            "growStyle": grow_style,
            "compounds": compounds,
        }]

        results = engine.rank_products_integrated(user_profile, product_data)

        if results:
            data = results[0]
            with col2:
                st.markdown("### 📊 Audit Results")
                score = data["matchScore"]

                s1, s2, s3 = st.columns(3)
                s1.metric("Match Score", f"{score:.1f}%")
                s2.metric("Active Compounds", f"{data['compounds_available']}/{data['compounds_total']}")
                s3.metric("Safety Risk", data["safety_zone"]["risk"])
                st.divider()

                if score >= 80:
                    st.markdown('<div class="success-box">✅ <strong>HIGH-FIDELITY SIGNAL</strong></div>', unsafe_allow_html=True)
                elif score >= 50:
                    st.markdown('<div class="warning-box">⚠️ <strong>MARGINAL RELIEF</strong></div>', unsafe_allow_html=True)
                else:
                    st.markdown('<div class="error-box">❌ <strong>SYSTEM FAILURE</strong></div>', unsafe_allow_html=True)

                # Thermal Details Table (✅ crash-proof)
                if data.get("thermal_details"):
                    st.markdown("#### 🌡️ Thermal Activation Status")
                    t_rows = []

                    for name, det in data["thermal_details"].items():
                        bp_c = det.get("boiling_point_c")

                        if bp_c is None:
                            bp_f = det.get("boiling_point_f")
                            bp_c = (bp_f - 32) / 1.8 if bp_f is not None else None

                        if bp_c is None:
                            status_enum = ThermalState.LOCKED
                            label = "Unknown"
                            icon = "❓"
                            threshold_display = "Unknown"
                        else:
                            status_enum = evaluate_gate_state(temp_c, bp_c)
                            label = state_label(status_enum)
                            icon = "✅" if status_enum == ThermalState.UNLOCKED else "🔒"
                            threshold_display = f"{bp_c}{CANONICAL_UNIT}"

                        t_rows.append({
                            "Compound": name,
                            "Status": f"{icon} {label}",
                            "Threshold": threshold_display,
                        })

                    st.dataframe(pd.DataFrame(t_rows), use_container_width=True, hide_index=True)

# --- FOOTER ---
st.divider()
f1, f2, f3 = st.columns(3)
with f1:
    st.caption("🧬 GreenForge v3.0 | Manteca, CA")
with f2:
    st.caption("📚 Research-Based Thermal Modeling")
with f3:
    st.caption("Proprietary Oak & Sparrow Logic")
