# CORS Fix Instructions

This document provides instructions for fixing CORS (Cross-Origin Resource Sharing) issues with the referral system API.

## What is CORS?

CORS is a security feature implemented by browsers that restricts web pages from making requests to a different domain than the one that served the original page. This is a security measure to prevent malicious websites from accessing sensitive data from other websites.

## The Problem

You're seeing errors like:

```
Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource at https://your_hostinger_domain.com/api/referral.php. (Reason: CORS request did not succeed). Status code: (null).

API request error: TypeError: NetworkError when attempting to fetch resource.
```

This happens because your frontend application is making requests to an API on a different domain, but the API server doesn't have the proper CORS headers configured.

## The Solution

We've implemented several fixes to address CORS issues:

1. **Updated referral.php**: The API now includes proper CORS headers at the beginning of the file
2. **Updated .htaccess**: Server-level CORS configuration has been added
3. **Created test tools**: HTML and PHP files to test CORS functionality

## How to Apply the Fix on Your Hostinger Server

### Step 1: Upload the Updated Files

1. Upload the following files to your Hostinger server:
   - `api/referral.php` (replace the existing file)
   - `api/.htaccess` (replace the existing file)
   - `api/cors_test.php` (new file)
   - `cors_test.html` (new file, place in your website's root directory)

### Step 2: Test CORS Functionality

1. Access the CORS test tool through your browser:
   `https://your-domain.com/cors_test.html`

2. Update the API URL in the input field to point to your actual API endpoint:
   `https://your-domain.com/api/cors_test.php`

3. Click "Test CORS" to verify that CORS is working correctly

4. If the test is successful, you should see a JSON response without any CORS errors

### Step 3: Test Your Referral API

1. In the CORS test tool, update the API URL to point to your referral API:
   `https://your-domain.com/api/referral.php`

2. Try the "Get Code by Address" and "Get Referrer by Code" functions

3. Enter a valid Ethereum address or referral code

4. Verify that the API returns the expected results without CORS errors

## Troubleshooting

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

## For Production Use

For production environments, it's recommended to restrict CORS to specific domains rather than allowing all domains (`*`). You can do this by modifying the `referral.php` file:

```php
// Instead of allowing all origins
header("Access-Control-Allow-Origin: *");

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