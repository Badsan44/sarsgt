# Referral System API CORS Fix Guide

This guide provides step-by-step instructions for fixing CORS (Cross-Origin Resource Sharing) issues with the referral system API.

## The Problem

You're seeing errors like:

```
Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource at https://your_hostinger_domain.com/api/referral.php. (Reason: CORS request did not succeed). Status code: (null).

API request error: TypeError: NetworkError when attempting to fetch resource. referralManager.js:89:13

Failed to add referral code: TypeError: NetworkError when attempting to fetch resource. referralManager.js:144:13

Error generating referral link: TypeError: NetworkError when attempting to fetch resource. InlineReferralGenerator.jsx:176:15
```

These errors occur because your frontend application is making requests to an API on a different domain, but the API server doesn't have the proper CORS headers configured.

## The Solution

To fix this issue, you need to make changes to both the frontend and backend:

### Backend Changes (Hostinger Server)

1. **Update referral.php**:
   - Add proper CORS headers at the beginning of the file
   - Handle OPTIONS requests correctly

2. **Add .htaccess file**:
   - Configure Apache to send CORS headers for all API requests

### Frontend Changes

1. **Update api.js**:
   - Set the correct API domain in the configuration

2. **Update referralManager.js**:
   - Ensure the development mode detection works correctly

## Step-by-Step Instructions

### Backend Changes (On Your Hostinger Server)

#### 1. Update referral.php

Add the following code at the very beginning of your `referral.php` file (before any other code):

```php
<?php
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

// Continue with the rest of your code...
```

#### 2. Create or Update .htaccess

Create a file named `.htaccess` in your `/api` directory with the following content:

```apache
# Enable CORS for all domains
<IfModule mod_headers.c>
    Header always set Access-Control-Allow-Origin "*"
    Header always set Access-Control-Allow-Methods "GET, POST, OPTIONS"
    Header always set Access-Control-Allow-Headers "Content-Type, Authorization, X-Api-Key"
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
```

### Frontend Changes

#### 1. Update api.js

Open `src/config/api.js` and update the BASE_URL to your actual Hostinger domain:

```javascript
export const API_CONFIG = {
  BASE_URL: 'https://your-actual-domain.com/api', // Replace with your actual Hostinger domain
  ENDPOINTS: {
    REFERRAL: '/referral.php'
  }
};
```

#### 2. Update referralManager.js

Modify the `isDevelopmentMode` function in `src/utils/referralManager.js`:

```javascript
// Check if we're in development mode (API not available)
const isDevelopmentMode = () => {
  // Only use localStorage fallback if we're in a true development environment
  return REFERRAL_API_URL.includes('localhost') || 
         REFERRAL_API_URL.includes('127.0.0.1') || 
         REFERRAL_API_URL.includes('YOUR_HOSTINGER_DOMAIN');
};
```

## Testing the Fix

1. After making these changes, deploy your updated backend files to your Hostinger server
2. Update your frontend code with the changes to api.js and referralManager.js
3. Build and deploy your frontend application
4. Test the referral system functionality:
   - Generate a referral link
   - Copy and use the referral link
   - Check the referral dashboard

## Troubleshooting

If you're still experiencing CORS issues:

1. **Check Browser Console**: Look for specific error messages that might provide more details
2. **Verify Headers**: Use browser developer tools to check the Network tab and verify that the correct CORS headers are being sent
3. **Test with CORS Test Tool**: Use the included `cors_test.html` file to test your API's CORS configuration
4. **Check Server Logs**: Look at your Hostinger server logs for any PHP errors
5. **Contact Hostinger Support**: If all else fails, contact Hostinger support for assistance with CORS configuration

## Security Considerations

For production environments, it's recommended to restrict CORS to specific domains rather than allowing all domains (`*`). You can do this by modifying the `referral.php` file:

```php
// Instead of allowing all origins with "*"
// Specify allowed origins
$allowed_origins = [
    'https://your-main-domain.com',
    'https://app.your-domain.com'
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowed_origins)) {
    header("Access-Control-Allow-Origin: $origin");
}
```

This will enhance security by only allowing requests from your trusted domains.