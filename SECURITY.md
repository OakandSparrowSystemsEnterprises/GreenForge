# Security Policy

## Proprietary Notice

**GreenForge** is a proprietary computational pharmacognosy engine for medical cannabis analysis. The core algorithms, thermal modeling logic, and recommendation systems are proprietary intellectual property.

### Protected Components

The following components contain proprietary logic and are protected under intellectual property law:

- **Thermal Interface Modeling** - Temperature-based compound activation calculations
- **Pharmacognosy Engine** - Entourage effect analysis and compound interaction models
- **Scoring Algorithms** - Product recommendation and ranking systems
- **Safety Zone Classifications** - Temperature risk assessment framework
- **Compound Weight Adjustments** - "Flavor over Noise" optimization logic

## Supported Versions

We are currently in active development. Security updates will be applied to the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take the security of GreenForge seriously. If you discover a security vulnerability, please report it responsibly.

### What to Report

Please report security vulnerabilities related to:

- **SQL Injection** or database security issues
- **Authentication/Authorization** bypass
- **API Security** vulnerabilities (injection, overflow, etc.)
- **Data Privacy** concerns with patient/user data
- **Denial of Service** (DoS) vulnerabilities
- **Cross-Site Scripting (XSS)** in web interfaces
- **Dependency vulnerabilities** in third-party packages
- **Infrastructure security** issues

### How to Report

**DO NOT** open a public GitHub issue for security vulnerabilities.

Instead, please email security reports to:

📧 **[Insert Your Security Contact Email]**

Include in your report:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if available)
- Your contact information for follow-up

### Response Timeline

- **Initial Response**: Within 48 hours of report submission
- **Status Update**: Within 7 days with severity assessment
- **Resolution Target**:
  - Critical: 7 days
  - High: 30 days
  - Medium: 60 days
  - Low: 90 days

### Responsible Disclosure

We request that security researchers:

1. **Allow time** for us to address the vulnerability before public disclosure
2. **Do not access** user data beyond what's necessary to demonstrate the vulnerability
3. **Do not exploit** the vulnerability for malicious purposes
4. **Do not perform** denial of service testing on production systems
5. **Respect** the proprietary nature of the pharmacognosy algorithms

### Recognition

We appreciate responsible security research and will:

- Acknowledge your contribution (if desired) in our security advisories
- Work with you to understand and address the issue
- Keep you informed of our progress

## Security Best Practices for Deployment

If you are deploying GreenForge, please follow these security guidelines:

### Database Security
- Use strong database credentials
- Enable database encryption at rest
- Restrict database access to localhost or trusted networks
- Regularly backup database with secure storage

### API Security
- **Change default CORS settings** in production (`config.py`)
- Use HTTPS/TLS for all API communications
- Implement rate limiting on API endpoints
- Use API keys or OAuth for authentication
- Validate all user inputs

### Infrastructure
- Keep Python and all dependencies up to date
- Use environment variables for sensitive configuration
- Enable logging and monitoring
- Implement proper access controls
- Regular security audits

### Streamlit/Web Interface
- Do not expose Streamlit directly to the internet without authentication
- Use reverse proxy (nginx/Apache) with SSL
- Implement session management
- Sanitize all user inputs

## Known Security Considerations

### Current Status

✅ **Addressed:**
- SQL injection prevention with parameterized queries
- Input validation using Pydantic models
- Proper error handling without information leakage
- Table name whitelisting in database queries

⚠️ **In Progress:**
- Authentication/authorization system (planned)
- API rate limiting (planned)
- Audit logging system (planned)

### Dependencies

We monitor dependencies for known vulnerabilities using:
- GitHub Dependabot (when configured)
- Regular manual audits of `requirements.txt`

To check for vulnerable dependencies:
```bash
pip install safety
safety check -r requirements.txt
```

## Intellectual Property Protection

### Proprietary Logic

The following files contain proprietary algorithms and are NOT licensed for modification, redistribution, or commercial use without explicit permission:

- `Engine/logic.py` - Integrated Pharmacognosy Engine
- `api/recommendation.py` - Core recommendation algorithms
- `config.py` - Proprietary weight and scoring parameters

### Permitted Security Research

Security researchers MAY:
- Analyze code for security vulnerabilities
- Test deployed instances with permission
- Report vulnerabilities through responsible disclosure

Security researchers MAY NOT:
- Extract or reverse engineer proprietary algorithms for competing products
- Redistribute or publish proprietary scoring methodologies
- Use the pharmacognosy models in commercial applications

## Medical Device Disclaimer

⚠️ **IMPORTANT**: GreenForge is a research tool and is NOT approved as a medical device.

- Do not use for direct patient care without appropriate regulatory approval
- All recommendations should be reviewed by qualified medical professionals
- The system is provided "AS IS" without warranty of any kind

## Contact

For security-related questions or concerns:

- **Security Issues**: [Insert Security Email]
- **General Support**: [Insert Support Email]
- **Project Lead**: Joshua Johosky

## Compliance

GreenForge aims to comply with:
- OWASP Top 10 security guidelines
- PCI DSS (if handling payment data)
- HIPAA considerations (when handling patient data)
- State and federal cannabis regulations (where applicable)

---

**Last Updated**: January 2026
**Version**: 1.0.0
