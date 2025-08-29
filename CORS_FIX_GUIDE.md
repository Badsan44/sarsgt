# CORS Fix Guide for Hostinger Deployment

This guide provides step-by-step instructions for fixing CORS issues with your API on Hostinger.

## Step 1: Access Your Hostinger File Manager

1. Log in to your Hostinger account
2. Navigate to the "Hosting" section
3. Click on "Manage" for your hosting account
4. Click on "File Manager" or use FTP access if you prefer

## Step 2: Navigate to Your API Directory

1. In the File Manager, navigate to your website's root directory (usually `public_html`)
2. Go to the `api` folder where your API files are located

## Step 3: Create .htaccess File

1. Inside the `api` directory, click "New File"
2. Name it `.htaccess` (make sure to include the dot at the beginning)
3. Paste the following content:

```apache
# Enable CORS for all domains
<IfModule mod_headers.c>
    Header always set Access-Control-Allow-Origin "*"
    Header always set Access-Control-Allow-Methods "GET, POST, OPTIONS"
    Header always set Access-Control-Allow-Headers "Content-Type, Authorization"
    Header always set Access-Control-Max-Age "1728000"
    
    # Respond to preflight OPTIONS requests
    RewriteEngine On
    RewriteCond %{REQUEST_METHOD} OPTIONS
    RewriteRule ^(.*)$ $1 [R=200,L]
</IfModule>

# Disable caching for API responses
<IfModule mod_expires.c>
    ExpiresActive Off
</IfModule>

<IfModule mod_headers.c>
    Header set Cache-Control "no-cache, no-store, must-revalidate"
    Header set Pragma "no-cache"
    Header set Expires 0
</IfModule>

# PHP settings
<IfModule mod_php7.c>
    php_flag display_errors Off
    php_value max_execution_time 30
    php_value memory_limit 128M
    php_value post_max_size 8M
    php_value upload_max_filesize 2M
</IfModule>
```

4. Click "Save" or "Create File"

## Step 4: Update Your referral.php File

1. In the `api` directory, locate your existing `referral.php` file
2. Click "Edit" or right-click and select "Edit"
3. Replace the CORS headers section at the top with this improved version:

```php
// CORS Headers - More robust implementation
// Send CORS headers first, before any output
if (isset($_SERVER['HTTP_ORIGIN'])) {
    // Allow from any origin
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');    // cache for 1 day
}

// Access-Control headers are received during OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD'])) {
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    }
    
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS'])) {
        header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
    }
    
    // Just exit with 200 OK for preflight
    exit(0);
}

// Set content type after handling OPTIONS
header('Content-Type: application/json');
```

4. Make sure to replace only the CORS headers section, keeping the rest of your file intact
5. Click "Save" or "Save Changes"

## Step 5: Upload CORS Test Files

1. Upload the `cors_test.php` file to your `api` directory:
   - Click "Upload Files" in the `api` directory
   - Select the `cors_test.php` file from your local machine
   - Click "Upload"

2. Upload the `cors_test.html` file to your website's root directory:
   - Navigate back to your root directory (`public_html`)
   - Click "Upload Files"
   - Select the `cors_test.html` file from your local machine
   - Click "Upload"

## Step 6: Test CORS Functionality

1. Access the CORS test tool through your browser:
   `https://your-domain.com/cors_test.html`

2. Update the API URL in the input field to point to your actual API endpoint:
   `https://your-domain.com/api/cors_test.php`

3. Click "Test CORS" to verify that CORS is working correctly

4. If the test is successful, you should see a JSON response without any CORS errors

## Step 7: Test Your Referral API

1. In the CORS test tool, update the API URL to point to your referral API:
   `https://your-domain.com/api/referral.php`

2. Try the "Get Code by Address" and "Get Referrer by Code" functions

3. Enter a valid Ethereum address or referral code

4. Verify that the API returns the expected results without CORS errors

## Troubleshooting CORS Issues

If you're still experiencing CORS issues after following these steps:

1. **Check Server Logs**: In Hostinger, go to "Advanced" > "Error Logs" to check for any PHP errors

2. **Verify .htaccess is Working**: Some hosting plans might have restrictions on .htaccess files. Contact Hostinger support if you suspect this is the case.

3. **Test with a Simpler Endpoint**: Try accessing the `cors_test.php` endpoint directly to isolate the issue.

4. **Check for SSL Mismatches**: Ensure both your frontend and API are using the same protocol (both HTTPS or both HTTP).

5. **Try Specific Origin**: If using `*` for Access-Control-Allow-Origin doesn't work, try specifying your exact frontend domain:
   ```php
   header("Access-Control-Allow-Origin: https://your-frontend-domain.com");
   ```

6. **Contact Hostinger Support**: If all else fails, contact Hostinger support and explain that you're having CORS issues with your API.

## Common CORS Error Messages and Solutions

1. **"Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource"**
   - Make sure your API is sending the correct CORS headers
   - Check if the server is actually processing the OPTIONS preflight request

2. **"No 'Access-Control-Allow-Origin' header is present on the requested resource"**
   - Verify that the .htaccess file is being processed
   - Try adding the headers directly in PHP as shown above

3. **"Request header field Content-Type is not allowed by Access-Control-Allow-Headers"**
   - Make sure your Access-Control-Allow-Headers includes all the headers your frontend is sending

4. **"Preflight response is not successful"**
   - Ensure your server is correctly handling OPTIONS requests
   - Check server logs for any errors during the preflight request

## Additional Resources

- [MDN Web Docs: CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [Hostinger Knowledge Base: .htaccess Files](https://support.hostinger.com/en/articles/1583296-what-is-htaccess-file-and-how-to-use-it)
- [PHP Manual: HTTP Headers](https://www.php.net/manual/en/function.header.php)