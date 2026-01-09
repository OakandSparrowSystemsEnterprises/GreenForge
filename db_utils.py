"""
Database utilities for GreenForge
Centralized database connection and query management.
"""
import sqlite3
import logging
from contextlib import contextmanager
from typing import Optional, List, Tuple, Any
from config import DB_PATH

logger = logging.getLogger(__name__)


@contextmanager
def get_db_connection(db_path: str = DB_PATH):
    """
    Context manager for database connections.

    Usage:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM table")
            results = cursor.fetchall()

    Args:
        db_path: Path to the SQLite database file

    Yields:
        sqlite3.Connection: Database connection object

    Raises:
        sqlite3.Error: If database connection fails
    """
    conn = None
    try:
        conn = sqlite3.connect(db_path)
        conn.row_factory = sqlite3.Row  # Enable column access by name
        yield conn
    except sqlite3.Error as e:
        logger.error(f"Database connection error: {e}")
        raise
    finally:
        if conn:
            conn.close()


def execute_query(
    query: str,
    params: Optional[Tuple] = None,
    db_path: str = DB_PATH,
    fetch_one: bool = False,
    fetch_all: bool = True
) -> Optional[List[Any]]:
    """
    Execute a SQL query with proper error handling.

    Args:
        query: SQL query string
        params: Query parameters (optional)
        db_path: Path to database file
        fetch_one: Return only the first result
        fetch_all: Return all results (default)

    Returns:
        Query results or None on error

    Example:
        results = execute_query(
            "SELECT * FROM cannabinoids WHERE name = ?",
            ("THC",)
        )
    """
    try:
        with get_db_connection(db_path) as conn:
            cursor = conn.cursor()
            if params:
                cursor.execute(query, params)
            else:
                cursor.execute(query)

            if fetch_one:
                return cursor.fetchone()
            elif fetch_all:
                return cursor.fetchall()
            else:
                conn.commit()
                return None
    except sqlite3.Error as e:
        logger.error(f"Query execution error: {e}")
        logger.debug(f"Query: {query}, Params: {params}")
        return None


def get_boiling_point(compound_name: str, compound_type: str, db_path: str = DB_PATH) -> Optional[float]:
    """
    Get the boiling point for a specific compound.

    Args:
        compound_name: Name of the compound
        compound_type: Type of compound (cannabinoid, terpene, flavonoid)
        db_path: Path to database file

    Returns:
        Boiling point in Celsius or None if not found
    """
    table_map = {
        "cannabinoid": "cannabinoids",
        "terpene": "terpenes",
        "flavonoid": "flavonoids"
    }

    table = table_map.get(compound_type)
    if not table:
        logger.warning(f"Unknown compound type: {compound_type}")
        return None

    result = execute_query(
        f"SELECT boiling_point FROM {table} WHERE name = ? COLLATE NOCASE",
        (compound_name,),
        db_path=db_path,
        fetch_one=True
    )

    return float(result[0]) if result else None


def check_database_exists(db_path: str = DB_PATH) -> bool:
    """
    Check if the database file exists and is accessible.

    Args:
        db_path: Path to database file

    Returns:
        True if database exists and is accessible, False otherwise
    """
    import os

    if not os.path.exists(db_path):
        logger.error(f"Database not found at {db_path}")
        return False

    try:
        with get_db_connection(db_path) as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT name FROM sqlite_master WHERE type='table' LIMIT 1")
            return cursor.fetchone() is not None
    except sqlite3.Error as e:
        logger.error(f"Database accessibility check failed: {e}")
        return False


def get_all_compounds(db_path: str = DB_PATH) -> dict:
    """
    Retrieve all compounds from all tables.

    Args:
        db_path: Path to database file

    Returns:
        Dictionary with compound types as keys and lists of compounds as values
    """
    compounds = {
        "cannabinoids": [],
        "terpenes": [],
        "flavonoids": []
    }

    for compound_type in compounds.keys():
        try:
            results = execute_query(
                f"SELECT name, boiling_point FROM {compound_type} ORDER BY name",
                db_path=db_path
            )
            if results:
                compounds[compound_type] = [
                    {"name": row[0], "boiling_point": row[1]}
                    for row in results
                ]
        except Exception as e:
            logger.error(f"Error fetching {compound_type}: {e}")

    return compounds
