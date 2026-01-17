import streamlit as st
import pandas as pd
import sqlite3
import os

# --- IMPORT YOUR ENGINE DIRECTLY ---
# This allows us to run without a separate API server
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
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.2);
}
.stSlider > div > div > div > div { 
    background: linear-gradient(to right, #667eea, #764ba2);
}
.success-box {
    background: rgba(74, 222, 128, 0.1);
    border-left: 4px solid #4ade80;
    padding: 15px;
    border-radius: 8px;
    margin: 10px 0;
}
.warning-box {
    background: rgba(251, 191, 36, 0.1);
    border-left: 4px solid #fbbf24;
    padding: 15px;
    border-radius: 8px;
    margin: 10px 0;
}
.error-box {
    background: rgba(239, 68, 68, 0.1);
    border-left: 4px solid #ef4444;
    padding: 15px;
    border-radius: 8px;
    margin: 10px 0;
}
/* Fix cursor */
div[data-baseweb="select"] > div, 
div[data-baseweb="select"] input {
    cursor: pointer !important;
}
</style>
'''
st.markdown(custom_css, unsafe_allow_html=True)

# --- CLOUD DATABASE SETUP ---
# We use @st.cache_resource so this only runs once when the app boots up
@st.cache_resource
def get_engine():
    # Define a local path for the database
    db_path = "greenforge_cloud.db"
    
    # Force a fresh build of the database to ensure it has data
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # 1. Clear old data
    cursor.execute("DROP TABLE IF EXISTS terpenes")
    cursor.execute("DROP TABLE IF EXISTS cannabinoids")
    cursor.execute("DROP TABLE IF EXISTS flavonoids")

    # 2. Create Tables
    cursor.execute("CREATE TABLE terpenes (name TEXT PRIMARY KEY, boiling_point REAL)")
    cursor.execute("CREATE TABLE cannabinoids (name TEXT PRIMARY KEY, boiling_point REAL)")
    cursor.execute("CREATE TABLE flavonoids (name TEXT PRIMARY KEY, boiling_point REAL)")

    # 3. Insert Data
    cannabinoids = [("THC", 315), ("CBD", 356), ("CBG", 126), ("CBN", 365), 
                    ("THCV", 428), ("THCP", 315), ("CBC", 428)]
    terpenes = [("Myrcene", 334), ("Limonene", 349), ("Alpha-Pinene", 311), 
                ("Linalool", 388), ("Caryophyllene", 266), ("Humulene", 225), 
                ("Terpinolene", 365), ("Borneol", 410)]
    flavonoids = [("Cannflavin A", 360), ("Cannflavin B", 360), 
                  ("Quercetin", 482), ("Apigenin", 352)]
                  
    cursor.executemany("INSERT INTO cannabinoids VALUES (?, ?)", cannabinoids)
    cursor.executemany("INSERT INTO terpenes VALUES (?, ?)", terpenes)
    cursor.executemany("INSERT INTO flavonoids VALUES (?, ?)", flavonoids)
    conn.commit()
    conn.close()
    
    # Initialize the Engine with this new database
    return IntegratedPharmacognosyEngine(db_path, "dummy_kb.db")

# Initialize the engine
engine = get_engine()

# --- APP UI START ---
st.title("🧬 GreenForge: Computational Pharmacognosy Engine")
st.subheader("Research-Based Medical Cannabis Analysis with Thermal Modeling")

# --- CONDITION PRESETS (100% Match Score Formulations) ---
CONDITION_PRESETS = {
    "Neuropathic Pain": {
        "temp": 370,
        "compounds": [
            {"name": "THC", "val": 25.0},
            {"name": "Myrcene", "val": 2.0},
            {"name": "Caryophyllene", "val": 1.0},
            {"name": "Cannflavin A", "val": 0.2}
        ]
    },
    "Chronic Inflammation": {
        "temp": 370,
        "compounds": [
            {"name": "THC", "val": 20.0},
            {"name": "Myrcene", "val": 2.5},
            {"name": "Caryophyllene", "val": 1.5},
            {"name": "Cannflavin A", "val": 0.2}
        ]
    },
    "ADHD/Focus": {
        "temp": 350,
        "compounds": [
            {"name": "THC", "val": 30.0},
            {"name": "Alpha-Pinene", "val": 2.0},
            {"name": "Limonene", "val": 1.5}
        ]
    },
    "Depression": {
        "temp": 350,
        "compounds": [
            {"name": "THC", "val": 24.0},
            {"name": "Limonene", "val": 2.0},
            {"name": "Alpha-Pinene", "val": 1.8}
        ]
    },
    "Migraine": {
        "temp": 350,
        "compounds": [
            {"name": "THC", "val": 24.0},
            {"name": "Limonene", "val": 2.0},
            {"name": "Caryophyllene", "val": 1.8},
            {"name": "CBG", "val": 1.0}
        ]
    },
    "Insomnia": {
        "temp": 390,
        "compounds": [
            {"name": "THC", "val": 28.0},
            {"name": "Myrcene", "val": 2.5},
            {"name": "Linalool", "val": 1.2},
            {"name": "CBN", "val": 2.0}
        ]
    },
    "Anxiety": {
        "temp": 390,
        "compounds": [
            {"name": "THC", "val": 20.0},
            {"name": "Linalool", "val": 2.0},
            {"name": "Limonene", "val": 1.5}
        ]
    },
    "Get High": {
        "temp": 365,
        "compounds": [
            {"name": "THC", "val": 35.0},
            {"name": "Myrcene", "val": 1.8},
            {"name": "Limonene", "val": 1.2}
        ]
    }
}

# --- SIDEBAR ---
with st.sidebar:
    st.header("👤 Patient Profile")
    condition = st.selectbox("Primary Condition",
        ["Neuropathic Pain", "Migraine", "ADHD/Focus", "Insomnia", "Anxiety",
         "Chronic Inflammation", "Depression", "Get High"])
    severity = st.slider("Severity Level", 1, 10, 8)

    # Auto-load preset button
    if st.button("🎯 Load Optimal Formulation", use_container_width=True):
        st.session_state.load_preset = condition

    st.caption("💡 Click to auto-populate a 100% match formulation")

    st.divider()
    st.header("🌡️ Thermal Interface")

    # Set recommended temp based on condition
    recommended_temp = CONDITION_PRESETS.get(condition, {}).get("temp", 350)
    temp_f = st.slider("Device Temperature (°F)", 300, 500, recommended_temp, step=5)
    
    if temp_f < 311: zone_color, zone_name = "🟢", "Zone A - Flavor/Cerebral"
    elif temp_f < 365: zone_color, zone_name = "🟢", "Zone B - Medical/Entourage"
    elif temp_f < 401: zone_color, zone_name = "🟡", "Zone C - High Extraction"
    elif temp_f < 482: zone_color, zone_name = "🟠", "Zone D - High Risk (Benzene)"
    else: zone_color, zone_name = "🔴", "Zone E - Combustion (Avoid!)"
    
    st.info(f"{zone_color} **{zone_name}**\n\n{temp_f}°F = {round((temp_f - 32) / 1.8, 1)}°C")
    
    st.divider()
    st.header("🌱 Cultivation Data")
    grow_style = st.selectbox("Grow Style", ["living_soil", "sun_grown", "hydroponic", "drought_stress"])

# --- MAIN INPUT ---
col1, col2 = st.columns([1, 1])

with col1:
    st.markdown("### 📦 Product Formulation")
    p_name = st.text_input("Product Name", f"{condition} - Optimal Profile")

    st.markdown("#### Compound Profile")

    # Auto-load preset if button was clicked
    preset_data = None
    if 'load_preset' in st.session_state:
        preset_data = CONDITION_PRESETS.get(st.session_state.load_preset)
        if preset_data:
            st.success(f"✅ Loaded optimal formulation for {st.session_state.load_preset}")

    # Determine number of compounds
    if preset_data:
        default_num = len(preset_data["compounds"])
    else:
        default_num = 3

    num_compounds = st.number_input("Number of compounds", 1, 10, default_num)
    compounds = []

    for i in range(num_compounds):
        c_a, c_b = st.columns([2, 1])

        # Get preset values if available
        if preset_data and i < len(preset_data["compounds"]):
            preset_compound = preset_data["compounds"][i]
            default_name = preset_compound["name"]
            default_val = preset_compound["val"]
        else:
            default_name = "THC" if i == 0 else "Myrcene"
            default_val = 18.0 if i == 0 else 0.8

        with c_a:
            compound_list = ["THC", "CBD", "CBG", "CBN", "THCV", "THCP", "CBC",
                             "Myrcene", "Limonene", "Alpha-Pinene", "Linalool",
                             "Caryophyllene", "Humulene", "Terpinolene",
                             "Cannflavin A", "Cannflavin B", "Quercetin", "Apigenin", "Borneol"]

            # Find index of default name
            default_index = compound_list.index(default_name) if default_name in compound_list else 0

            c_name = st.selectbox(f"Compound {i+1}",
                compound_list,
                key=f"c_{i}", index=default_index)
        with c_b:
            c_val = st.number_input("% / ppm", 0.0, 100.0,
                default_val,
                step=0.1, key=f"v_{i}")
        
        # Determine type for the engine
        c_type = "cannabinoid" if c_name in ["THC","CBD","CBG","CBN","THCV","THCP","CBC"] else \
                 "terpene" if c_name in ["Myrcene","Limonene","Alpha-Pinene","Linalool","Caryophyllene","Humulene","Terpinolene","Borneol"] else \
                 "flavonoid"
        
        compounds.append({"name": c_name, "val": c_val, "type": c_type})

# --- EXECUTION ---
if st.button("🚀 EXECUTE CLINICAL AUDIT", use_container_width=True):
    with st.spinner("Analyzing bioavailability..."):
        # Construct the User Profile for the engine
        user_profile = {'interface_temp': temp_f}
        
        # Construct the Product List
        product_data = [{
            "name": p_name,
            "growStyle": grow_style,
            "compounds": compounds
        }]
        
        # --- DIRECT ENGINE CALL (No API needed!) ---
        results = engine.rank_products_integrated(user_profile, product_data)
        
        if results:
            data = results[0]
            with col2:
                st.markdown("### 📊 Audit Results")
                score = data['matchScore']
                
                s1, s2, s3 = st.columns(3)
                s1.metric("Match Score", f"{score:.1f}%")
                s2.metric("Active Compounds", f"{data['compounds_available']}/{data['compounds_total']}")
                s3.metric("Safety Risk", data['safety_zone']['risk'])
                st.divider()
                
                if score >= 80: st.markdown('<div class="success-box">✅ <strong>HIGH-FIDELITY SIGNAL</strong></div>', unsafe_allow_html=True)
                elif score >= 50: st.markdown('<div class="warning-box">⚠️ <strong>MARGINAL RELIEF</strong></div>', unsafe_allow_html=True)
                else: st.markdown('<div class="error-box">❌ <strong>SYSTEM FAILURE</strong></div>', unsafe_allow_html=True)
                
                # Thermal Details Table
                if data.get('thermal_details'):
                    st.markdown("#### 🌡️ Thermal Activation Status")
                    t_data = []
                    for name, det in data['thermal_details'].items():
                        icon = "✅" if "Fully" in det['status'] else "⚡" if "Partial" in det['status'] else "🔒"
                        t_data.append({
                            "Compound": name,
                            "Status": f"{icon} {det['status']}", 
                            "Boiling Point": f"{det['boiling_point_f']}°F"
                        })
                    st.dataframe(pd.DataFrame(t_data), use_container_width=True, hide_index=True)

# --- FOOTER (This is now OUTSIDE the button logic) ---
st.divider()

footer_col1, footer_col2, footer_col3 = st.columns(3)

with footer_col1:
    st.caption("🧬 GreenForge v2.0")
    st.caption("Computational Pharmacognosy")

with footer_col2:
    st.caption("📚 Research-Based")
    st.caption("500+ Strains, thermal modeling")

with footer_col3:
    st.caption("📍 Manteca, California")
    st.caption("Proprietary Logic Engine")
