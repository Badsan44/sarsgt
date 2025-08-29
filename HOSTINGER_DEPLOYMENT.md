# Deploying the Secure Referral API to Hostinger

This guide provides step-by-step instructions for deploying the secure referral API to your Hostinger hosting account.

## Step 1: Prepare Your Local Files

1. Make sure all the files are ready:
   - `api/referral.php` (main API file)
   - `api/config.php` (configuration file)
   - `api/security.php` (security helper functions)
   - `api/database.php` (database helper functions)
   - `api/README.md` (documentation)
   - `api/example-client.html` (optional example client)

## Step 2: Configure Your Database on Hostinger

1. Log in to your Hostinger control panel
2. Navigate to "Databases" or "MySQL Databases"
3. Create a new database or use an existing one
4. Create or note your database username and password
5. Create the required table using the SQL from `database_setup.sql`:

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

## Step 3: Update Configuration Settings

1. Open `api/config.php` and update the database settings:

```php
$db_config = [
    'host' => 'localhost', // Usually 'localhost' on Hostinger
    'dbname' => 'your_hostinger_db_name', // Your Hostinger database name
    'username' => 'your_hostinger_db_username', // Your Hostinger database username
    'password' => 'your_hostinger_db_password', // Your Hostinger database password
];
```

2. Configure security settings:

```php
$security_config = [
    // List of allowed origins for CORS (your website domains)
    'allowed_origins' => ['https://yourdomain.com', 'https://www.yourdomain.com'],
    
    // Rate limiting: requests per minute per IP
    'rate_limit' => 60,
    
    // API key for authentication (generate a strong random key)
    'api_key' => 'GENERATE_A_STRONG_RANDOM_KEY_HERE',
    
    // Enable detailed error logging (set to false in production)
    'debug_mode' => false,
];
```

3. Generate a strong API key:
   - You can use an online generator or run this PHP command:
   ```php
   echo bin2hex(random_bytes(32));
   ```
   - Save this key securely as you'll need it for API requests

## Step 4: Upload Files to Hostinger

### Option 1: Using FTP

1. Connect to your Hostinger account using an FTP client (like FileZilla)
   - Host: Your FTP hostname (from Hostinger)
   - Username: Your FTP username
   - Password: Your FTP password
   - Port: 21 (default)

2. Navigate to your website's root directory or a subdirectory where you want to place the API

3. Create an `api` folder if it doesn't exist

4. Upload the following files to the `api` folder:
   - `referral.php`
   - `security.php`
   - `database.php`
   - `example-client.html` (optional)
   - `README.md` (optional)

5. For better security, upload `config.php` to a directory outside your public web root if possible
   - If your Hostinger plan doesn't allow this, upload it to the `api` folder but add extra protection (see Step 5)

### Option 2: Using Hostinger File Manager

1. Log in to your Hostinger control panel
2. Navigate to "File Manager"
3. Browse to your website's root directory
4. Create an `api` folder if it doesn't exist
5. Upload all the files mentioned above to the `api` folder

## Step 5: Secure Your Configuration (Optional but Recommended)

If you couldn't place `config.php` outside the web root, add extra protection:

1. Create a `.htaccess` file in your `api` directory with the following content:

```
# Prevent direct access to config.php
<Files "config.php">
    Order Allow,Deny
    Deny from all
</Files>

# Protect log files
<Files "*.log">
    Order Allow,Deny
    Deny from all
</Files>
```

2. Upload this `.htaccess` file to your `api` directory

## Step 6: Test Your API

1. Test the health endpoint:
   - Open a browser and navigate to: `https://yourdomain.com/api/referral.php?action=health`
   - You should see a JSON response with `"success": true` and a CSRF token

2. Test with the example client:
   - Open `https://yourdomain.com/api/example-client.html` in your browser
   - Follow the steps in the example client to test all API functions
   - Make sure to use your API key when testing

3. Check for any errors:
   - If you encounter issues, check your Hostinger error logs
   - You can also check the API access log at `api/api_access.log`

## Step 7: Integrate with Your Application

1. Update your application to use the new secure API:
   - Store your API key securely in your application
   - Implement CSRF token handling for POST requests
   - Add proper error handling for API responses

2. Example API call from JavaScript:

```javascript
// Get a CSRF token first
fetch('https://yourdomain.com/api/referral.php?action=health')
  .then(response => response.json())
  .then(data => {
    if (data.success && data.csrf_token) {
      // Store the CSRF token
      const csrfToken = data.csrf_token;
      
      // Now make a POST request with the token
      fetch('https://yourdomain.com/api/referral.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Api-Key': 'YOUR_API_KEY_HERE'
        },
        body: JSON.stringify({
          action: 'add_referral',
          code: 'REFERRAL123',
          address: '0x1234567890abcdef1234567890abcdef12345678',
          csrf_token: csrfToken
        })
      })
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error('Error:', error));
    }
  })
  .catch(error => console.error('Error:', error));
```

## Step 8: Ongoing Maintenance

1. Regularly check your API logs for suspicious activity

2. Update your API key periodically:
   - Generate a new key
   - Update it in `config.php`
   - Update it in your application

3. Keep PHP and all dependencies updated

4. Consider implementing additional security measures:
   - IP allowlisting for admin functions
   - Two-factor authentication for sensitive operations
   - Regular security audits

## Troubleshooting Common Issues

### API Returns 500 Error
- Check database connection details in `config.php`
- Verify the database table exists and has the correct structure
- Check Hostinger error logs for specific PHP errors

### CORS Issues
- Ensure your domain is correctly listed in the `allowed_origins` array
- Check for any typos in domain names
- Make sure to include both www and non-www versions if needed

### Rate Limiting Problems
- If legitimate users are being rate-limited, increase the `rate_limit` value in `config.php`
- Ensure the temporary directory is writable for rate limit storage

### File Permissions
- Make sure all PHP files have the correct permissions (typically 644)
- Ensure log directories are writable (typically 755)
- Check that Hostinger's PHP version is compatible (PHP 7.4+ recommended)