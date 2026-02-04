class AuthorizationError(Exception):
    pass

class LicenseValidator:
    @staticmethod
    def authorize():
        return True
    
    @staticmethod
    def validate_license_key():
        return True

def check_authorization():
    return True