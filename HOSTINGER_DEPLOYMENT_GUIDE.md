# Hostinger Deployment Guide

## Prerequisites
- Hostinger hosting account with PHP and MySQL support
- Access to cPanel or File Manager
- Access to phpMyAdmin or MySQL database management

## Step 1: Database Setup

### 1.1 Create MySQL Database
1. Log into your Hostinger cPanel
2. Go to "MySQL Databases"
3. Create a new database (e.g., `your_username_sarza`)
4. Create a database user with full privileges
5. Note down: database name, username, password, and host

### 1.2 Import Database Schema
1. Go to phpMyAdmin
2. Select your database
3. Go to "Import" tab
4. Upload the `database_setup.sql` file from this project
5. Execute the import

## Step 2: PHP API Setup

### 2.1 Create API Directory
1. In your hosting file manager, create an `api` folder in your public_html directory
2. Upload the `api/referral.php` file to this folder

### 2.2 Update Database Credentials
Edit `api/referral.php` and update the database configuration:

```php
// Database configuration - UPDATE THESE VALUES
$host = 'localhost'; // Usually localhost for Hostinger
$dbname = 'your_actual_database_name';
$username = 'your_actual_db_username';
$password = 'your_actual_db_password';
```

### 2.3 Test API Endpoint
Visit: `https://yourdomain.com/api/referral.php?action=health`
You should see: `{"status":"ok","message":"API is working"}`

## Step 3: Frontend Deployment

### 3.1 Update API Configuration
Before building, update `src/config/api.js`:
```javascript
export const API_CONFIG = {
  BASE_URL: 'https://yourdomain.com/api', // Your actual domain
  ENDPOINTS: {
    REFERRAL: '/referral.php'
  }
};
```

### 3.2 Build the Application
Run: `npm run build`

### 3.3 Upload Build Files
1. Upload all contents of the `dist` folder to your `public_html` directory
2. Make sure `index.html` is in the root of `public_html`

## Step 4: File Structure on Hostinger

Your `public_html` should look like:
```
public_html/
├── index.html (from dist folder)
├── assets/ (from dist folder)
├── api/
│   └── referral.php
└── [other files from dist folder]
```

## Step 5: Testing

### 5.1 Test Website
Visit your domain - the app should load

### 5.2 Test Referral System
1. Connect a wallet
2. Click "Generate Link" - should create a referral link
3. Open the referral link in a new browser/incognito
4. Check if referral code is detected

### 5.3 Test Database
Check phpMyAdmin to see if referral codes are being stored in the `referral_codes` table

## Step 6: SSL Certificate (Important)

1. In Hostinger cPanel, go to "SSL/TLS"
2. Enable SSL for your domain
3. Force HTTPS redirect

## Troubleshooting

### Common Issues:

1. **API not working**: Check database credentials in `referral.php`
2. **CORS errors**: The PHP API includes CORS headers, but check browser console
3. **Database connection failed**: Verify database name, username, password
4. **404 on API calls**: Ensure `api/referral.php` is in the correct location
5. **Referral codes not saving**: Check database permissions and table structure

### Debug Steps:

1. Check browser console for JavaScript errors
2. Test API endpoint directly: `yourdomain.com/api/referral.php?action=health`
3. Check database logs in cPanel
4. Verify file permissions (should be 644 for PHP files)

## Security Notes

1. Never commit database credentials to version control
2. Use strong database passwords
3. Keep PHP and MySQL updated
4. Consider rate limiting for API endpoints
5. Monitor database for unusual activity

## Performance Optimization

1. Enable gzip compression in cPanel
2. Use Hostinger's CDN if available
3. Optimize images before deployment
4. Consider caching for API responses

## Backup Strategy

1. Regular database backups via cPanel
2. Keep a copy of your `api/referral.php` with credentials
3. Backup the entire `public_html` directory

---

**Important**: Replace `YOUR_HOSTINGER_DOMAIN.com` with your actual domain throughout the configuration files before deployment.