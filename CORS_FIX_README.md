# CORS Fix Branch

This branch contains fixes for CORS (Cross-Origin Resource Sharing) issues in the API.

## What's Included

1. **Improved CORS Headers**: Enhanced PHP headers for better cross-origin support
2. **`.htaccess` Configuration**: Server-level CORS configuration
3. **Testing Tools**: HTML and PHP files to test CORS functionality
4. **Documentation**: Step-by-step guide for implementing CORS fixes on Hostinger

## Files Added

- `api/.htaccess` - Apache configuration for CORS
- `api/improved_referral.php` - Enhanced version of referral.php with better CORS handling
- `api/cors_test.php` - Simple endpoint to test CORS functionality
- `cors_test.html` - Browser-based tool to test CORS
- `CORS_FIX_GUIDE.md` - Detailed implementation guide

## How to Test

1. Upload the files to your server
2. Access `cors_test.html` in your browser
3. Follow the instructions to test CORS functionality

## Implementation

See `CORS_FIX_GUIDE.md` for detailed implementation instructions.

## Notes

- These changes should be applied to your Hostinger server
- No changes to the frontend code are required
- The mock attestation service for local testing has been removed from this branch