# Referral System Setup Instructions

## Overview
This guide will help you set up the PHP/MySQL referral system on your Hostinger hosting account.

## Step 1: Database Setup

1. **Log into your Hostinger cPanel**
2. **Go to "MySQL Databases" or "phpMyAdmin"**
3. **Create a new database** (or use existing one)
4. **Run the SQL from `database_setup.sql`:**

```sql
CREATE TABLE referral_codes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    address VARCHAR(42) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_code (code),
    INDEX idx_address (address)
);
```

## Step 2: Upload PHP API

1. **Upload `api/referral.php` to your hosting account**
   - Create folder: `public_html/api/`
   - Upload the file to: `public_html/api/referral.php`

2. **Update database credentials in `referral.php`:**
   ```php
   $host = 'localhost';
   $dbname = 'your_database_name';  // Replace with your actual database name
   $username = 'your_db_username';  // Replace with your actual database username
   $password = 'your_db_password';  // Replace with your actual database password
   ```

## Step 3: Update React App Configuration

1. **Update `src/config/api.js`:**
   ```javascript
   export const API_CONFIG = {
     BASE_URL: 'https://yourdomain.com/api', // Replace with your actual domain
     ENDPOINTS: {
       REFERRAL: '/referral.php'
     }
   };
   ```

2. **Replace `yourdomain.com` with your actual domain**

## Step 4: Test the Setup

1. **Test the API directly:**
   - Visit: `https://yourdomain.com/api/referral.php?action=health`
   - Should return: `{"success":true,"message":"API is working","timestamp":"..."}`

2. **Test adding a referral code:**
   ```bash
   curl -X POST https://yourdomain.com/api/referral.php \
     -H "Content-Type: application/json" \
     -d '{"action":"add_referral","code":"TEST123","address":"0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b9"}'
   ```

3. **Test getting a referral code:**
   - Visit: `https://yourdomain.com/api/referral.php?action=get_referrer&code=TEST123`
   - Should return the address

## Step 5: Deploy Updated React App

1. **Build the React app:**
   ```bash
   npm run build
   ```

2. **Upload the `dist/` folder contents to your `public_html/` directory**

## Step 6: Test Referral System

1. **Connect wallet and generate a referral link**
2. **Copy the referral link**
3. **Open the link in a different browser/incognito mode**
4. **The referral should now work across different browsers!**

## Troubleshooting

### Common Issues:

1. **"Database connection failed"**
   - Check database credentials in `referral.php`
   - Ensure database exists and user has permissions

2. **CORS errors**
   - The PHP file includes CORS headers, but if you still get errors, contact Hostinger support

3. **API not found (404)**
   - Ensure the file is uploaded to the correct path: `public_html/api/referral.php`
   - Check file permissions (should be 644)

4. **"Invalid referral code format"**
   - Referral codes must be 6-20 characters, uppercase letters and numbers only

### Testing Commands:

```bash
# Test API health
curl https://yourdomain.com/api/referral.php?action=health

# Add referral code
curl -X POST https://yourdomain.com/api/referral.php \
  -H "Content-Type: application/json" \
  -d '{"action":"add_referral","code":"TESTREF","address":"0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b9"}'

# Get referrer address
curl "https://yourdomain.com/api/referral.php?action=get_referrer&code=TESTREF"

# Get code by address
curl "https://yourdomain.com/api/referral.php?action=get_code_by_address&address=0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b9"
```

## Security Notes

- The current setup uses basic validation
- For production, consider adding rate limiting
- Monitor database size and add cleanup for old codes if needed
- Consider adding admin authentication for sensitive operations

## Support

If you encounter issues:
1. Check browser console for error messages
2. Check Hostinger error logs in cPanel
3. Test API endpoints directly using the curl commands above
4. Ensure all file paths and URLs are correct