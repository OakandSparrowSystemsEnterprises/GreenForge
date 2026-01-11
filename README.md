# GreenForge™

**Computational Pharmacognosy Engine for Medical Cannabis Analysis**

[![License: Proprietary](https://img.shields.io/badge/License-Proprietary-red.svg)](LICENSE)
[![Python 3.10+](https://img.shields.io/badge/python-3.10+-blue.svg)](https://www.python.org/downloads/)
[![Status: Private](https://img.shields.io/badge/Status-Private-critical.svg)]()

---

## ⚠️ PROPRIETARY SOFTWARE - AUTHORIZATION REQUIRED

**Copyright © 2025-2026 Joshua Johosky. All Rights Reserved.**

This repository contains **proprietary software with trade secret algorithms**.

### 🔒 License Status

- **NOT OPEN SOURCE**
- **NOT FREE TO USE**
- **AUTHORIZATION REQUIRED**

Unauthorized use, copying, modification, or distribution is **STRICTLY PROHIBITED** and constitutes theft of intellectual property.

See [`LICENSE`](LICENSE) file for complete terms.

---

## 📋 About GreenForge

GreenForge is a sophisticated computational pharmacognosy engine designed for medical cannabis product analysis and recommendation. The system uses proprietary thermal modeling and entourage effect algorithms to provide evidence-based product matching.

### Key Features

- **Thermal Interface Modeling** - Temperature-based compound activation analysis
- **Pharmacognosy Engine** - Entourage effect and compound interaction models
- **Safety Zone Classification** - Temperature risk assessment framework
- **Product Scoring System** - Proprietary ranking algorithms
- **"Flavor over Noise"** - Optimized terpene-focused recommendations

### Technology Stack

- **Backend**: FastAPI (Python 3.10+)
- **Database**: SQLite with compound library
- **Frontend**: Streamlit (optional UI)
- **Architecture**: REST API + Computational Engine

---

## 🔐 Authorization & Setup

### Step 1: Obtain License

**GreenForge requires authorization to use.**

Contact for licensing:
- **Email**: [Your Email]
- **Subject**: GreenForge Authorization Request

### Step 2: Configure License Key

Once authorized, set up your environment:

```bash
# Copy environment template
cp .env.example .env

# Edit .env and add your license key
GREENFORGE_LICENSE_KEY=your_license_key_here
GREENFORGE_LICENSE_HASH=your_license_hash_here
```

**Generate your license hash:**
```bash
python -c "import hashlib; print(hashlib.sha256(b'your_license_key').hexdigest())"
```

### Step 3: Install Dependencies

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install requirements
pip install -r requirements.txt
```

### Step 4: Initialize Database

```bash
# Initialize the compound database
python scripts/initialize_db.py

# Populate with sample data (optional)
python scripts/populate_phase_1_library.py
```

---

## 🚀 Usage

### Starting the API Server

```bash
python main.py
```

The API will be available at: `http://localhost:8000`
- Interactive docs: `http://localhost:8000/docs`
- Health check: `http://localhost:8000/health`

### Starting the Streamlit UI

```bash
streamlit run app.py
```

Access the UI at: `http://localhost:8501`

---

## 📚 API Endpoints

### Authentication Required

All endpoints require valid authorization (checked on startup).

### Main Endpoints

```
POST /api/v1/recommend
  - Get product recommendations based on user profile

GET /api/v1/compounds
  - List all available compounds (cannabinoids, terpenes, flavonoids)

GET /api/v1/thermal-zones
  - Get thermal zone information and safety guidelines

GET /health
  - Health check and database status
```

See `/docs` for interactive API documentation.

---

## 🗂️ Project Structure

```
GreenForge/
├── LICENSE                 # Proprietary license (READ THIS)
├── SECURITY.md            # Security policy and vulnerability reporting
├── README.md              # This file
├── requirements.txt       # Python dependencies
├── .env.example          # Environment template
├── config.py             # Centralized configuration
├── auth.py               # Authorization system
├── db_utils.py           # Database utilities
├── main.py               # FastAPI server
├── app.py                # Streamlit UI
├── Engine/
│   └── logic.py          # Proprietary pharmacognosy engine
├── api/
│   └── recommendation.py # Proprietary recommendation algorithms
├── Data/
│   └── db_setup.py       # Database schema
├── scripts/              # Utility scripts
│   ├── initialize_db.py
│   ├── populate_phase_1_library.py
│   └── ...
└── .github/
    └── workflows/        # CI/CD configuration
```

---

## 🔒 Security

### Reporting Vulnerabilities

See [`SECURITY.md`](SECURITY.md) for security policy and vulnerability reporting procedures.

**DO NOT** open public issues for security vulnerabilities.

### Protected Components

The following contain **trade secret algorithms**:
- `Engine/logic.py` - Pharmacognosy engine
- `api/recommendation.py` - Recommendation algorithms
- `config.py` - Proprietary weight formulas

### Security Best Practices

- **NEVER commit** `.env` files with license keys
- **NEVER share** your license key
- Use HTTPS in production
- Restrict API access with authentication
- Keep dependencies updated

---

## ⚖️ Legal

### Intellectual Property

GreenForge™ and all associated algorithms are proprietary intellectual property:

- **Copyright** © 2025-2026 Joshua Johosky
- **Trade Secrets**: Thermal modeling, pharmacognosy algorithms
- **Patents**: Patent pending
- **Trademark**: GreenForge™

### Terms of Use

1. **Authorization Required** - Valid license key mandatory
2. **No Redistribution** - Cannot share, copy, or distribute
3. **No Reverse Engineering** - Cannot extract or replicate algorithms
4. **No Commercial Use** - Without explicit permission
5. **Confidentiality** - Proprietary methodologies are confidential

### Medical Disclaimer

⚠️ **NOT A MEDICAL DEVICE**

GreenForge is a research tool and has NOT been approved as a medical device.

- Do not use for direct patient care without regulatory approval
- All recommendations should be reviewed by qualified professionals
- Provided "AS IS" without warranty

---

## 📞 Contact

**Joshua Johosky**
GreenForge™ Computational Pharmacognosy Engine

- **Licensing**: [Your Email]
- **Security**: [Security Email]
- **Support**: [Support Email]

---

## 📄 License

**PROPRIETARY LICENSE - ALL RIGHTS RESERVED**

This software is proprietary. No license is granted without express written authorization.

See [`LICENSE`](LICENSE) file for complete terms.

Unauthorized use is prohibited and will be prosecuted to the fullest extent of the law.

---

**© 2025-2026 Joshua Johosky. All Rights Reserved.**
**GreenForge™ is a trademark of Joshua Johosky.**
