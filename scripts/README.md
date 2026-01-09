# GreenForge Utility Scripts

This directory contains utility scripts for managing the GreenForge database and system.

## Database Management

- **initialize_db.py** - Creates the database schema and populates boiling points
- **populate_phase_1_library.py** - Seeds 30 strain variants with compound profiles
- **populate_phase_1_library_api.py** - API version of the population script
- **seed_db.py** - Database seeding utilities

## Data Correction & Maintenance

- **check_pantry.py** - Database validation and auditing
- **expand_pantry.py** - Adds new compounds to the database
- **fix_focus.py** - Data correction for focus-related compounds
- **fix_terpenes.py** - Data correction for terpene profiles
- **update_pantry.py** - Updates existing compound data
- **stock_all_layers.py** - Database population helper

## Research Integration

- **ingest_research.py** - Research paper integration utilities
- **translate.query.py** - Query translation utilities

## Usage

Run scripts from the project root directory:

```bash
# Initialize the database
python scripts/initialize_db.py

# Populate with sample data
python scripts/populate_phase_1_library.py

# Check database integrity
python scripts/check_pantry.py
```
