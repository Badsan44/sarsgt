# Quick Deployment Steps for Hostinger

## 🚨 IMPORTANT: You need to do MORE than just upload build files!

### Step 1: Database Setup (REQUIRED)
1. **Create MySQL Database in Hostinger cPanel**
   - Go to "MySQL Databases"
   - Create database (e.g., `username_sarza`)
   - Create user with full privileges
   - **Write down**: database name, username, password

2. **Import Database Schema**
   - Go to phpMyAdmin
   - Select your database
   - Import → Upload `database_setup.sql`

### Step 2: Update Configuration (BEFORE BUILDING)
1. **Update API Config**: Edit `src/config/api.js`
   ```javascript
   BASE_URL: 'https://YOURDOMAIN.com/api'  // Your actual domain
   ```

2. **Update Database Credentials**: Edit `api/referral.php`
   ```php
   $host = 'localhost';
   $dbname = 'your_actual_database_name';    // From Step 1
   $username = 'your_actual_db_username';    // From Step 1  
   $password = 'your_actual_db_password';    // From Step 1
   ```

### Step 3: Build and Upload
1. **Build**: `npm run build`
2. **Upload to Hostinger**:
   - Upload ALL contents of `dist/` folder → `public_html/`
   - Upload `api/referral.php` → `public_html/api/`

### Step 4: Test
1. **Test API**: Visit `yourdomain.com/api/referral.php?action=health`
   - Should return: `{"status":"ok","message":"API is working"}`
2. **Test App**: Visit your domain and test referral generation

---

## ⚠️ Why This is Different from Regular Deployment

**Regular React App**: Just upload build files
**Your App**: Needs database + PHP API + proper configuration

**Without the database and API setup, the referral system won't work!**

The app will fall back to localStorage (temporary) until you set up the proper API.

---

## Files You Need to Upload

### To `public_html/`:
- `index.html` (from dist)
- `assets/` folder (from dist)
- All other files from `dist/`

### To `public_html/api/`:
- `referral.php` (with YOUR database credentials)

### To Database:
- Import `database_setup.sql` via phpMyAdmin

---

## Quick Test Commands

**Test API Health:**
```
https://yourdomain.com/api/referral.php?action=health
```

**Expected Response:**
```json
{"status":"ok","message":"API is working"}
```

If this doesn't work, your database credentials are wrong or the API file isn't uploaded correctly.