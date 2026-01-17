# GreenForge - Streamlit Cloud Setup Guide

## Quick Fix for Authorization Error

Your Streamlit app is failing because the authorization system needs to be configured.

### Option 1: Development Mode (Recommended for Public Demos)

**For Streamlit Cloud:**

1. Go to your app: https://share.streamlit.io/
2. Click on your app → **"⚙️ Settings"** → **"Secrets"**
3. Add this single line:
   ```toml
   GREENFORGE_DEV_MODE = "true"
   ```
4. Click **"Save"**
5. Your app will restart automatically

**What this does:** Bypasses authorization completely. Use this for public demos.

---

### Option 2: License Key (For Production/Private Use)

**For Streamlit Cloud:**

1. Go to your app settings → **"Secrets"**
2. Add your license credentials:
   ```toml
   GREENFORGE_LICENSE_KEY = "your_actual_license_key"
   GREENFORGE_LICENSE_HASH = "your_actual_sha256_hash"
   ```
3. To generate the hash:
   ```bash
   python -c "import hashlib; print(hashlib.sha256(b'your_license_key').hexdigest())"
   ```
4. Click **"Save"**

---

### Option 3: Trial Mode (14 Days)

**For Streamlit Cloud:**

1. Go to app settings → **"Secrets"**
2. Add:
   ```toml
   GREENFORGE_ALLOW_TRIAL = "true"
   ```
3. Click **"Save"**

---

## Local Development

For local testing with `streamlit run app.py`:

1. Copy the example secrets file:
   ```bash
   cp .streamlit/secrets.toml.example .streamlit/secrets.toml
   ```

2. Edit `.streamlit/secrets.toml` and add:
   ```toml
   GREENFORGE_DEV_MODE = "true"
   ```

3. Run your app:
   ```bash
   streamlit run app.py
   ```

---

## Security Notes

- **Development Mode** (`GREENFORGE_DEV_MODE = "true"`):
  - ✅ Use for public demos and development
  - ❌ Do NOT use with proprietary data
  - ⚠️ Bypasses ALL authorization

- **License Mode**:
  - ✅ Use for production/private deployments
  - 🔒 Protects proprietary algorithms
  - ✅ Enforces proper authorization

- **Trial Mode**:
  - ⏱️ 14-day evaluation period
  - 📊 Full features enabled
  - 🔄 Tracks usage via `.greenforge_trial` file

---

## Troubleshooting

**Error: "AuthorizationError: AUTHORIZATION REQUIRED"**
- Solution: Add `GREENFORGE_DEV_MODE = "true"` to Streamlit secrets

**Error: "Invalid license key"**
- Check that your hash matches your key
- Verify no extra spaces in secrets.toml

**Error: "Trial period expired"**
- Delete `.greenforge_trial` file or get a license

---

## Quick Checklist

- [ ] Go to Streamlit Cloud app settings
- [ ] Open "Secrets" section
- [ ] Add `GREENFORGE_DEV_MODE = "true"`
- [ ] Save and wait for restart
- [ ] ✅ App should now work!

---

**Need help?** Contact Joshua Johosky for licensing or support.
