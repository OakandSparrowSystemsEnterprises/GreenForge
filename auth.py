"""
GreenForge Authorization System
Enforces proprietary license requirements.

Copyright (c) 2025-2026 Joshua Johosky. All Rights Reserved.
UNAUTHORIZED USE IS PROHIBITED.
"""
import os
import hashlib
import logging
from datetime import datetime, timedelta
from typing import Optional

logger = logging.getLogger(__name__)

# Check if running in Streamlit
try:
    import streamlit as st
    RUNNING_IN_STREAMLIT = True
except ImportError:
    RUNNING_IN_STREAMLIT = False


class AuthorizationError(Exception):
    """Raised when authorization fails."""
    pass


class LicenseValidator:
    """
    Validates license keys for GreenForge usage.

    PROPRIETARY: This authorization system protects trade secrets and
    proprietary algorithms from unauthorized use.
    """

    # Master key hash (SHA-256 of your actual license key)
    # To generate: hashlib.sha256(b"YOUR_SECRET_KEY").hexdigest()
    @staticmethod
    def _get_master_key_hash():
        """Get master key hash from environment or Streamlit secrets."""
        # Try Streamlit secrets first
        if RUNNING_IN_STREAMLIT:
            try:
                if hasattr(st, 'secrets') and 'GREENFORGE_LICENSE_HASH' in st.secrets:
                    return st.secrets['GREENFORGE_LICENSE_HASH']
            except Exception:
                pass

        # Fall back to environment
        return os.getenv("GREENFORGE_LICENSE_HASH", "UNAUTHORIZED")

    # Trial/Demo mode (disabled by default)
    ALLOW_TRIAL = os.getenv("GREENFORGE_ALLOW_TRIAL", "false").lower() == "true"
    TRIAL_DAYS = 14

    @staticmethod
    def validate_license_key(license_key: Optional[str] = None) -> bool:
        """
        Validate the license key.

        Args:
            license_key: License key string (if None, reads from environment)

        Returns:
            True if license is valid, False otherwise

        Raises:
            AuthorizationError: If license validation fails
        """
        # Read from environment if not provided
        if license_key is None:
            # Try Streamlit secrets first (for Streamlit Cloud deployments)
            if RUNNING_IN_STREAMLIT:
                try:
                    if hasattr(st, 'secrets') and 'GREENFORGE_LICENSE_KEY' in st.secrets:
                        license_key = st.secrets['GREENFORGE_LICENSE_KEY']
                        logger.info("License key loaded from Streamlit secrets")
                except Exception as e:
                    logger.debug(f"Could not read Streamlit secrets: {e}")

            # Fall back to environment variable
            if not license_key:
                license_key = os.getenv("GREENFORGE_LICENSE_KEY")

        if not license_key:
            logger.error("No license key provided")
            raise AuthorizationError(
                "AUTHORIZATION REQUIRED: No license key found.\n"
                "GreenForge is proprietary software.\n"
                "Contact Joshua Johosky for licensing: [Your Email]\n"
                "See LICENSE file for terms."
            )

        # Hash the provided key
        key_hash = hashlib.sha256(license_key.encode()).hexdigest()

        # Validate against master hash
        master_hash = LicenseValidator._get_master_key_hash()
        if key_hash != master_hash:
            logger.error("Invalid license key provided")
            raise AuthorizationError(
                "AUTHORIZATION FAILED: Invalid license key.\n"
                "This software is proprietary and protected by law.\n"
                "Unauthorized use constitutes theft of intellectual property.\n"
                "Contact Joshua Johosky for valid authorization."
            )

        logger.info("License validated successfully")
        return True

    @staticmethod
    def check_trial_mode() -> bool:
        """
        Check if trial mode is available and valid.

        Returns:
            True if trial is active and valid

        Raises:
            AuthorizationError: If trial is expired or not allowed
        """
        if not LicenseValidator.ALLOW_TRIAL:
            raise AuthorizationError(
                "Trial mode is not enabled.\n"
                "A valid license key is required.\n"
                "Contact Joshua Johosky for licensing."
            )

        # Check trial expiration
        trial_start_file = ".greenforge_trial"

        if os.path.exists(trial_start_file):
            with open(trial_start_file, 'r') as f:
                start_date_str = f.read().strip()
                start_date = datetime.fromisoformat(start_date_str)

                if datetime.now() > start_date + timedelta(days=LicenseValidator.TRIAL_DAYS):
                    raise AuthorizationError(
                        f"Trial period expired ({LicenseValidator.TRIAL_DAYS} days).\n"
                        "Purchase a license to continue using GreenForge.\n"
                        "Contact Joshua Johosky for licensing."
                    )
        else:
            # First trial run - create trial file
            with open(trial_start_file, 'w') as f:
                f.write(datetime.now().isoformat())
            logger.info(f"Trial mode activated for {LicenseValidator.TRIAL_DAYS} days")

        return True

    @staticmethod
    def authorize() -> bool:
        """
        Main authorization check.

        Call this before using any GreenForge functionality.

        Returns:
            True if authorized

        Raises:
            AuthorizationError: If authorization fails
        """
        # Check for development/bypass mode
        dev_mode = False

        # Try Streamlit secrets first (for Streamlit Cloud)
        if RUNNING_IN_STREAMLIT:
            try:
                if hasattr(st, 'secrets') and 'GREENFORGE_DEV_MODE' in st.secrets:
                    dev_mode = str(st.secrets['GREENFORGE_DEV_MODE']).lower() == "true"
                    if dev_mode:
                        logger.warning("⚠️ DEVELOPMENT MODE - Authorization bypassed (from Streamlit secrets)")
            except Exception as e:
                logger.debug(f"Could not read Streamlit secrets: {e}")

        # Fall back to environment variable
        if not dev_mode:
            dev_mode = os.getenv("GREENFORGE_DEV_MODE", "false").lower() == "true"
            if dev_mode:
                logger.warning("⚠️ DEVELOPMENT MODE - Authorization bypassed (from environment)")

        if dev_mode:
            return True

        # Try license key validation first
        try:
            return LicenseValidator.validate_license_key()
        except AuthorizationError:
            # Fall back to trial mode if allowed
            if LicenseValidator.ALLOW_TRIAL:
                logger.warning("License validation failed, checking trial mode")
                return LicenseValidator.check_trial_mode()
            else:
                raise


def require_authorization(func):
    """
    Decorator to require authorization for function access.

    Usage:
        @require_authorization
        def protected_function():
            # Your proprietary code here
            pass
    """
    def wrapper(*args, **kwargs):
        LicenseValidator.authorize()
        return func(*args, **kwargs)
    return wrapper


def check_authorization() -> None:
    """
    Convenience function to check authorization.

    Raises:
        AuthorizationError: If not authorized
    """
    LicenseValidator.authorize()


# Automatic authorization check on import (optional, can be disabled)
# Disabled by default for Streamlit to prevent blocking the app
if RUNNING_IN_STREAMLIT:
    AUTO_CHECK_ON_IMPORT = os.getenv("GREENFORGE_AUTO_CHECK", "false").lower() == "true"
else:
    AUTO_CHECK_ON_IMPORT = os.getenv("GREENFORGE_AUTO_CHECK", "true").lower() == "true"

if AUTO_CHECK_ON_IMPORT:
    try:
        check_authorization()
    except AuthorizationError as e:
        logger.critical(str(e))
        # Don't raise on import to allow help/info commands
        # Actual usage will fail when functions are called
