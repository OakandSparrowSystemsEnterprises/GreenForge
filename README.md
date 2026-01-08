# GreenForge: Computational Pharmacognosy Engine

![GreenForge Dashboard](image_b8cae1.png)

**GreenForge** is a research-based medical cannabis analysis engine designed to bridge the gap between chemical composition and clinical efficacy. Unlike standard recommendation tools, GreenForge utilizes a **proprietary thermal modeling engine** to predict compound degradation and bioavailability at specific device temperatures (e.g., Zone B - Medical/Entourage).

## 🚀 Key Features

* **Computational Pharmacognosy:** Analyzes chemical synergy beyond just THC/CBD, factoring in minor cannabinoids, terpenes, and flavonoids (like Cannflavin A).
* **Thermal Activation Modeling:** Calculates the "Thermal Activation Status" of compounds based on their boiling points vs. device temperature (e.g., 360°F).
* **Clinical Audit System:** Assigns a "Match Score" and "Safety Risk" profile to specific formulations based on patient conditions (e.g., Neuropathic Pain).
* **Safety Zone Analysis:** Visualizes optimal temperature ranges to maximize therapeutic output while minimizing combustion byproducts.

## 🛠️ Tech Stack

* **Logic Engine:** Python (FastAPI)
* **Interface:** Streamlit
* **Database:** SQLite
* **Modeling:** Custom Pharmacognosy Algorithms

## 📦 Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/JoshuaJohosky/GreenForge.git](https://github.com/JoshuaJohosky/GreenForge.git)
    cd GreenForge
    ```

2.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

## ⚡ Usage

GreenForge operates using a split-architecture (Brain + Face). You must run two terminals simultaneously.

**Terminal 1: Start the API Engine (The Brain)**
```bash
uvicorn main:app --reload
