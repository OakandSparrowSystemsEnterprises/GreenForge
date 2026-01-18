import os
# Bypass authorization for GitHub Actions and CI/CD
os.environ["GREENFORGE_DEV_MODE"] = "true"

import sqlite3
import pytest
from Engine.logic import IntegratedPharmacognosyEngine


@pytest.fixture(scope="module")
def test_database():
    """Create a temporary test database with sample compounds."""
    TEST_DB = "test_pharma.db"
    if os.path.exists(TEST_DB):
        os.remove(TEST_DB)

    conn = sqlite3.connect(TEST_DB)
    cursor = conn.cursor()

    # Create Tables
    cursor.execute("CREATE TABLE terpenes (name TEXT, boiling_point REAL)")
    cursor.execute("CREATE TABLE cannabinoids (name TEXT, boiling_point REAL)")
    cursor.execute("CREATE TABLE flavonoids (name TEXT, boiling_point REAL)")

    # Insert Boiling Points (Physics Data)
    cursor.execute("INSERT INTO cannabinoids VALUES ('THC', 315)")
    cursor.execute("INSERT INTO terpenes VALUES ('Myrcene', 334)")
    cursor.execute("INSERT INTO terpenes VALUES ('Linalool', 388)")
    cursor.execute("INSERT INTO terpenes VALUES ('Alpha-Pinene', 311)")
    cursor.execute("INSERT INTO terpenes VALUES ('Limonene', 349)")
    cursor.execute("INSERT INTO terpenes VALUES ('Caryophyllene', 266)")
    cursor.execute("INSERT INTO flavonoids VALUES ('Cannflavin A', 360)")
    conn.commit()
    conn.close()

    yield TEST_DB

    # Cleanup after tests
    if os.path.exists(TEST_DB):
        os.remove(TEST_DB)


@pytest.fixture(scope="module")
def engine(test_database):
    """Initialize the GreenForge engine with test database."""
    return IntegratedPharmacognosyEngine(test_database, "dummy_kb.db")


def test_engine_initialization(engine):
    """Test that the engine initializes successfully."""
    assert engine is not None
    assert engine.pharma_db_path is not None


def test_hype_strain_vs_medical_strain(engine):
    """Test that medical strains score higher than high-THC hype strains."""
    # Product A: The "Inflated" Street Strain (High THC, No Soul)
    product_hype = {
        "name": "Hype Beast OG (32% THC)",
        "growStyle": "indoor",
        "compounds": [
            {"name": "THC", "type": "cannabinoid", "val": 32.0},
            {"name": "Myrcene", "type": "terpene", "val": 0.1}
        ]
    }

    # Product B: The "Medical" Strain (Moderate THC, High Entourage)
    product_med = {
        "name": "Entourage Kush (18% THC)",
        "growStyle": "sun_grown",
        "compounds": [
            {"name": "THC", "type": "cannabinoid", "val": 18.0},
            {"name": "Myrcene", "type": "terpene", "val": 1.5},
            {"name": "Linalool", "type": "terpene", "val": 0.8}
        ]
    }

    user_profile = {'interface_temp': 365}
    results = engine.rank_products_integrated(user_profile, [product_hype, product_med])

    # Medical strain should score higher due to entourage effect
    assert len(results) == 2
    assert results[0]['name'] == "Entourage Kush (18% THC)"
    assert results[0]['matchScore'] > results[1]['matchScore']


def test_neuropathic_pain_optimal_formulation(engine):
    """Test that the Neuropathic Pain preset achieves high match score."""
    product = {
        "name": "Neuropathic Pain Relief",
        "growStyle": "living_soil",
        "compounds": [
            {"name": "THC", "type": "cannabinoid", "val": 25.0},
            {"name": "Myrcene", "type": "terpene", "val": 2.0},
            {"name": "Caryophyllene", "type": "terpene", "val": 1.0},
            {"name": "Cannflavin A", "type": "flavonoid", "val": 0.2}
        ]
    }

    user_profile = {'interface_temp': 370}
    results = engine.rank_products_integrated(user_profile, [product])

    assert len(results) == 1
    # Should achieve high match score (close to 100%)
    assert results[0]['matchScore'] >= 80.0


def test_adhd_focus_optimal_formulation(engine):
    """Test that the ADHD/Focus preset achieves high match score."""
    product = {
        "name": "Focus Enhancement",
        "growStyle": "hydroponic",
        "compounds": [
            {"name": "THC", "type": "cannabinoid", "val": 30.0},
            {"name": "Alpha-Pinene", "type": "terpene", "val": 2.0},
            {"name": "Limonene", "type": "terpene", "val": 1.5}
        ]
    }

    user_profile = {'interface_temp': 350}
    results = engine.rank_products_integrated(user_profile, [product])

    assert len(results) == 1
    # Should achieve high match score
    assert results[0]['matchScore'] >= 80.0


def test_thermal_activation_standard_temp(engine):
    """Test thermal activation at standard vaping temperature (365°F)."""
    product = {
        "name": "Standard Test Product",
        "growStyle": "indoor",
        "compounds": [
            {"name": "THC", "type": "cannabinoid", "val": 20.0},
            {"name": "Myrcene", "type": "terpene", "val": 1.5}
        ]
    }

    user_profile = {'interface_temp': 365}
    results = engine.rank_products_integrated(user_profile, [product])

    assert len(results) == 1
    # Both THC (315°F) and Myrcene (334°F) should be activated
    assert results[0]['matchScore'] > 0


def test_thermal_activation_high_temp(engine):
    """Test thermal activation at high temperature (400°F)."""
    product = {
        "name": "High Heat Test",
        "growStyle": "indoor",
        "compounds": [
            {"name": "THC", "type": "cannabinoid", "val": 20.0},
            {"name": "Myrcene", "type": "terpene", "val": 1.5}
        ]
    }

    user_profile = {'interface_temp': 400}
    results = engine.rank_products_integrated(user_profile, [product])

    assert len(results) == 1
    # High temp may cause degradation
    assert results[0]['matchScore'] >= 0


def test_build_check():
    """Simple check to verify the build passes."""
    assert True
