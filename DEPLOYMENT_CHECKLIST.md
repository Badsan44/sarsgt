# Deployment Checklist

## Before Deployment

### ✅ Configuration Updates
- [ ] Update `src/config/api.js` with your actual Hostinger domain
- [ ] Update database credentials in `api/referral.php`
- [ ] Test API endpoint locally if possible

### ✅ Build Process
- [ ] Run `npm run build` to create production build
- [ ] Verify `dist` folder contains all necessary files
- [ ] Check that `index.html` is present in `dist`

### ✅ Database Preparation
- [ ] Create MySQL database on Hostinger
- [ ] Create database user with full privileges
- [ ] Import `database_setup.sql` via phpMyAdmin
- [ ] Test database connection

## During Deployment

### ✅ File Upload
- [ ] Upload `api/referral.php` to `public_html/api/` folder
- [ ] Upload all contents of `dist` folder to `public_html`
- [ ] Verify file permissions (644 for PHP files)
- [ ] Check that directory structure is correct

### ✅ Configuration
- [ ] Update database credentials in uploaded `referral.php`
- [ ] Test API health endpoint: `yourdomain.com/api/referral.php?action=health`
- [ ] Enable SSL certificate
- [ ] Force HTTPS redirect

## After Deployment

### ✅ Testing
- [ ] Visit your domain - app should load
- [ ] Connect wallet - should work without errors
- [ ] Generate referral link - should create proper link
- [ ] Test referral link in new browser/incognito
- [ ] Check database - referral codes should be stored
- [ ] Test on mobile devices
- [ ] Test different browsers

### ✅ Monitoring
- [ ] Check browser console for errors
- [ ] Monitor database for proper data storage
- [ ] Test performance and loading times
- [ ] Verify all images and assets load correctly

## Quick Commands

### Build for Production:
```bash
# Update API config first, then:
npm run build
```

### Test API Health:
```
https://yourdomain.com/api/referral.php?action=health
```

### Expected Response:
```json
{"status":"ok","message":"API is working"}
```

## Files to Upload

### To `public_html/`:
- All contents of `dist/` folder

### To `public_html/api/`:
- `referral.php` (with updated database credentials)

## Critical Settings

### Database Credentials in `referral.php`:
```php
$host = 'localhost';
$dbname = 'your_actual_database_name';
$username = 'your_actual_db_username';  
$password = 'your_actual_db_password';
```

### API URL in `src/config/api.js`:
```javascript
BASE_URL: 'https://yourdomain.com/api'
```

---

**Remember**: The app will use localStorage fallback until the API is properly configured, so make sure to test the API endpoint after deployment!