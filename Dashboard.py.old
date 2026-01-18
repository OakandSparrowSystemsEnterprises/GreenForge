import streamlit as st
import requests
import pandas as pd

# Page Config
st.set_page_config(page_title="GreenForge Engine", page_icon="🧬", layout="wide")

# --- CSS CONFIGURATION ---
css_style = '''
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

/* FIX: Force pointer cursor on dropdowns */
div[data-baseweb="select"] > div, 
div[data-baseweb="select"] input {
    cursor: pointer !important;
}
</style>
'''

st.markdown(css_style, unsafe_allow_html=True)

# --- MAIN APP START ---
st.title("🧬 GreenForge: Computational Pharmacognosy Engine")
st.subheader("Research-Based Medical Cannabis Analysis with Thermal Modeling")

# --- SIDEBAR: PATIENT DATA ---
with st.sidebar:
    st.header("👤 Patient Profile")
    
    condition = st.selectbox("Primary Condition", 
        ["Neuropathic Pain", "Migraine", "ADHD/Focus", "Insomnia", "Anxiety", 
         "Chronic Inflammation", "Depression", "Get High"],
        help="Select the primary medical condition")
    
    severity = st.slider("Severity Level", 1, 10, 8,
                         help="1 = Mild, 10 = Severe")
    
    st.divider()
    st.header("🌡️ Thermal Interface")
    
    temp_f = st.slider("Device Temperature (°F)", 300, 500, 350, step=5,
                       help="Vaporizer temperature setting")
    
    # Temperature zone indicator
    if temp_f < 311:
        zone_color = "🟢"
        zone_name = "Zone A - Flavor/Cerebral"
    elif temp_f < 365:
        zone_color = "🟢"
        zone_name = "Zone B - Medical/Entourage"
    elif temp_f < 401:
        zone_color = "🟡"
        zone_name = "Zone C - High Extraction"
    elif temp_f < 482:
        zone_color = "🟠"
        zone_name = "Zone D - High Risk (Benzene)"
    else:
        zone_color = "🔴"
        zone_name = "Zone E - Combustion (Avoid!)"
    
    st.info(f"{zone_color} **{zone_name}**\n\n{temp_f}°F = {round((temp_f - 32) / 1.8, 1)}°C")
    
    st.divider()
    st.header("🌱 Cultivation Data")
    
    grow_style = st.selectbox("Grow Style", 
        ["living_soil", "sun_grown", "hydroponic", "drought_stress"],
        help="Cultivation method affects compound expression")
    
    # Show cultivation bonuses
    grow_bonuses = {
        "living_soil": "🌿 +25% terpene diversity",
        "sun_grown": "☀️ +40% flavonoid boost (UV)",
        "hydroponic": "💧 +10% THC/CBD potency",
        "drought_stress": "💪 +15% concentration"
    }
    st.caption(grow_bonuses.get(grow_style, ""))
    
    st.divider()
    st.header("🎯 Product Type")
    
    product_type = st.selectbox("Delivery Method", 
        ["flower", "concentrate", "vape_cart", "edible"],
        help="How will this product be consumed?")
    
    # Show method-specific info
    delivery_notes = {
        "flower": "🌿 Thermal activation required | THC: 15-30% typical",
        "concentrate": "💎 Thermal activation required | THC: 60-95% typical",
        "vape_cart": "💨 Pre-heated delivery | May contain additives",
        "edible": "🍫 Oral ingestion | First-pass metabolism | No thermal needed"
    }
    st.caption(delivery_notes.get(product_type, ""))

# --- MAIN: PRODUCT INPUT ---
col1, col2 = st.columns([1, 1])

with col1:
    st.markdown("### 📦 Product Formulation")
    
    p_name = st.text_input("Product Name", "Clinical Sample 001")
    
    # Compound mapping based on condition
    compound_map = {
        "Neuropathic Pain": ["Cannflavin A", "Caryophyllene", "CBD"],
        "Migraine": ["Cannflavin A", "CBD", "Linalool"],
        "ADHD/Focus": ["Alpha-Pinene", "THCV", "Limonene"],
        "Insomnia": ["Myrcene", "Linalool", "CBN"],
        "Anxiety": ["Limonene", "CBD", "Linalool"],
        "Chronic Inflammation": ["Cannflavin A", "Caryophyllene", "CBD"],
        "Depression": ["Limonene", "CBC", "THC"],
        "Get High": ["THC", "Myrcene", "Limonene"]
    }
    
    suggested = compound_map.get(condition, ["THC", "CBD"])
    
    st.markdown(f"**Suggested for {condition}:** {', '.join(suggested)}")
    
    # Dynamic compound inputs
    st.markdown("#### Compound Profile")
    
    num_compounds = st.number_input("Number of compounds", 1, 10, 3, 
                                     help="How many compounds in this product?")
    
    compounds = []
    
    for i in range(num_compounds):
        col_a, col_b = st.columns([2, 1])
        
        with col_a:
            compound_name = st.selectbox(
                f"Compound {i+1}",
                ["THC", "CBD", "CBG", "CBN", "THCV", "THCP", "CBC",
                 "Myrcene", "Limonene", "Alpha-Pinene", "Linalool", 
                 "Caryophyllene", "Humulene", "Terpinolene",
                 "Cannflavin A", "Cannflavin B", "Quercetin", "Apigenin", "Borneol"],
                key=f"compound_{i}",
                index=0 if i == 0 else (10 if i == 1 else 5)
            )
        
        with col_b:
            compound_val = st.number_input(
                "% / ppm",
                0.0, 100.0,
                1.2 if "Cannflavin" in compound_name else (18.0 if compound_name == "THC" else 0.8),
                step=0.1,
                key=f"val_{i}",
                help="Percentage for cannabinoids, ppm for minor compounds"
            )
        
        compounds.append({"name": compound_name, "val": compound_val})

# --- THE ENGINE TRIGGER ---
if st.button("🚀 EXECUTE CLINICAL AUDIT", use_container_width=True):
    
    with st.spinner("Analyzing compound bioavailability and thermal activation..."):
        payload = {
            "user_profile": {
                "interface_temp": temp_f,
                "conditions": [{"name": condition, "severity": severity}],
                "product_type": product_type
            },
            "product_list": [{
                "name": p_name,
                "growStyle": grow_style,
                "compounds": compounds
            }]
        }
        
        try:
            response = requests.post("http://127.0.0.1:8000/api/v1/recommend", json=payload)
            
            if response.status_code == 200:
                data = response.json()['results'][0]
                
                with col2:
                    st.markdown("### 📊 Audit Results")
                    
                    score = data['matchScore']
                    
                    # Score with custom styling
                    score_col1, score_col2, score_col3 = st.columns(3)
                    
                    with score_col1:
                        st.metric(label="Match Score", value=f"{score:.1f}%")
                    
                    with score_col2:
                        active = data.get('compounds_available', 0)
                        total = data.get('compounds_total', 0)
                        st.metric(label="Active Compounds", value=f"{active}/{total}")
                    
                    with score_col3:
                        zone_risk = data.get('safety_zone', {}).get('risk', 'UNKNOWN')
                        st.metric(label="Safety Risk", value=zone_risk)
                    
                    st.divider()
                    
                    # Diagnostic interpretation
                    if score >= 80:
                        st.markdown('<div class="success-box">✅ <strong>DIAGNOSTIC: HIGH-FIDELITY SIGNAL DETECTED</strong><br>Optimal therapeutic efficacy predicted</div>', unsafe_allow_html=True)
                    elif score >= 50:
                        st.markdown('<div class="warning-box">⚠️ <strong>DIAGNOSTIC: MARGINAL RELIEF</strong><br>Therapeutic effect present but suboptimal</div>', unsafe_allow_html=True)
                    else:
                        st.markdown('<div class="error-box">❌ <strong>DIAGNOSTIC: SYSTEM FAILURE</strong><br>Thermal gate locked or signal overwhelmed by noise</div>', unsafe_allow_html=True)
                    
                    # Analysis breakdown
                    if 'analysis' in data:
                        st.markdown("#### 🔬 Condition Analysis")
                        
                        for cond_name, cond_data in data['analysis'].items():
                            with st.expander(f"**{cond_name}** - Mode: {cond_data.get('mode', 'unknown')}"):
                                
                                if 'signal' in cond_data:
                                    st.write(f"**Signal Strength:** {cond_data['signal']:.2f}")
                                
                                if 'thc_penalty' in cond_data:
                                    st.write(f"**THC Noise Penalty:** -{cond_data['thc_penalty']:.1f}")
                                
                                if 'cannflavin_multiplier' in cond_data and cond_data['cannflavin_multiplier'] > 1:
                                    st.success(f"🔥 **Cannflavin Active:** {cond_data['cannflavin_multiplier']}x aspirin potency!")
                                
                                if 'entourage' in cond_data:
                                    ent = cond_data['entourage']
                                    st.info(f"🌿 **Entourage Effect:** {ent['multiplier']}x ({ent['message']})")
                    
                    # Warnings section
                    if data.get('warnings'):
                        st.markdown("#### ⚠️ Clinical Warnings & Insights")
                        
                        for warning in data['warnings']:
                            if '✓' in warning or '✅' in warning:
                                st.success(warning)
                            elif '🔒' in warning or 'locked' in warning.lower():
                                st.error(warning)
                            else:
                                st.warning(warning)
                    
                    # Method notes (NEW - shows delivery method insights)
                    if data.get('method_notes'):
                        st.markdown("#### 📋 Delivery Method Notes")
                        for note in data['method_notes']:
                            st.info(note)
                    
                    # Thermal activation details
                    if data.get('thermal_details'):
                        st.markdown("#### 🌡️ Thermal Activation Status")
                        
                        thermal_df = []
                        for comp_name, details in data['thermal_details'].items():
                            status = details.get('status', 'unknown')
                            bp = details.get('boiling_point_f', 'N/A')
                            avail = details.get('available', 0)
                            
                            if 'fully' in status:
                                status_icon = "✅"
                            elif 'partial' in status:
                                status_icon = "⚡"
                            elif 'locked' in status:
                                status_icon = "🔒"
                            else:
                                status_icon = "❓"
                            
                            thermal_df.append({
                                "Compound": comp_name,
                                "Status": f"{status_icon} {status}",
                                "Boiling Point": f"{bp}°F" if bp != 'N/A' else 'N/A',
                                "Availability": f"{int(avail * 100)}%"
                            })
                        
                        if thermal_df:
                            st.dataframe(
                                pd.DataFrame(thermal_df),
                                use_container_width=True,
                                hide_index=True
                            )
                    
                    # Safety zone info
                    if data.get('safety_zone'):
                        zone_info = data['safety_zone']
                        
                        st.markdown("#### 🛡️ Safety Zone Analysis")
                        
                        zone_risk = zone_info.get('risk', 'UNKNOWN')
                        
                        if zone_risk == 'LOW':
                            st.success(f"**{zone_info['zone']}**\n\n{zone_info['description']}")
                        elif zone_risk == 'MEDIUM':
                            st.warning(f"**{zone_info['zone']}**\n\n{zone_info['description']}")
                        elif zone_risk == 'HIGH' or zone_risk == 'CRITICAL':
                            st.error(f"**{zone_info['zone']}**\n\n{zone_info['description']}")
                        else:
                            st.info(f"**{zone_info['zone']}**\n\n{zone_info['description']}")
            else:
                st.error(f"API Error: {response.status_code} - {response.text}")
                
        except requests.exceptions.ConnectionError:
            st.error("🔌 **Engine Offline**\n\nEnsure the API is running:\n```\npython main.py\n```")
        except Exception as e:
            st.error(f"**Error:** {str(e)}")

st.divider()

# Footer with system info
footer_col1, footer_col2, footer_col3 = st.columns(3)

with footer_col1:
    st.caption("🧬 GreenForge v2.1")
    st.caption("Universal Delivery System")

with footer_col2:
    st.caption("📚 Research-Based")
    st.caption("500+ Strains, 30+ compounds, thermal modeling")

with footer_col3:
    st.caption("📍 Manteca, California")
    st.caption("Proprietary Logic Engine")