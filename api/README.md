# Secure Referral API Documentation

This document provides information about the security measures implemented in the Referral API and how to use it securely.

## Security Features Implemented

1. **API Key Authentication**
   - All sensitive endpoints require an API key for access
   - API keys must be sent in the `X-Api-Key` header

2. **CSRF Protection**
   - All POST requests require a valid CSRF token
   - Tokens can be obtained from the `/api/referral.php?action=health` endpoint
   - Tokens must be included in the request body as `csrf_token`

3. **Rate Limiting**
   - Requests are limited per IP address to prevent abuse
   - Current limit: 60 requests per minute

4. **Input Validation and Sanitization**
   - All inputs are validated and sanitized
   - Ethereum addresses must match the format: `0x` followed by 40 hex characters
   - Referral codes must be 6-20 alphanumeric characters (uppercase)

5. **Restricted CORS**
   - Cross-Origin Resource Sharing is restricted to specific domains
   - Configure allowed domains in `config.php`

6. **Secure Headers**
   - Content-Security-Policy
   - X-Content-Type-Options
   - X-Frame-Options
   - X-XSS-Protection
   - Strict-Transport-Security

7. **Comprehensive Logging**
   - All API access is logged
   - Logs include timestamp, IP, method, endpoint, action, success/failure

8. **Parameterized Queries**
   - All database queries use prepared statements to prevent SQL injection

9. **Error Handling**
   - Detailed errors are logged but not exposed to clients
   - Generic error messages are returned to users

10. **Output Sanitization**
    - All data returned to clients is sanitized to prevent XSS attacks

## API Endpoints

### Health Check
- **URL**: `/api/referral.php?action=health`
- **Method**: GET
- **Authentication**: None
- **Description**: Checks if the API is working and returns a CSRF token
- **Response**: 
  ```json
  {
    "success": true,
    "message": "API is working",
    "timestamp": "2025-07-17 12:34:56",
    "csrf_token": "random_token_here"
  }
  ```

### Add Referral Code
- **URL**: `/api/referral.php`
- **Method**: POST
- **Authentication**: API Key required
- **Headers**: 
  - `Content-Type: application/json`
  - `X-Api-Key: your_api_key`
- **Body**:
  ```json
  {
    "action": "add_referral",
    "code": "REFERRAL123",
    "address": "0x1234567890abcdef1234567890abcdef12345678",
    "csrf_token": "token_from_health_endpoint"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "message": "Referral code added successfully",
    "code": "REFERRAL123",
    "address": "0x1234567890abcdef1234567890abcdef12345678"
  }
  ```

### Get Referrer by Code
- **URL**: `/api/referral.php?action=get_referrer&code=REFERRAL123`
- **Method**: GET
- **Authentication**: API Key required
- **Headers**: 
  - `X-Api-Key: your_api_key`
- **Response**:
  ```json
  {
    "success": true,
    "address": "0x1234567890abcdef1234567890abcdef12345678",
    "created_at": "2025-07-17 12:34:56"
  }
  ```

### Get Code by Address
- **URL**: `/api/referral.php?action=get_code_by_address&address=0x1234567890abcdef1234567890abcdef12345678`
- **Method**: GET
- **Authentication**: API Key required
- **Headers**: 
  - `X-Api-Key: your_api_key`
- **Response**:
  ```json
  {
    "success": true,
    "code": "REFERRAL123",
    "created_at": "2025-07-17 12:34:56"
  }
  ```

## Configuration

All configuration is stored in `config.php`:

1. **Database Configuration**
   - Update database credentials with your actual values
   - Move this file outside the web root in production

2. **Security Configuration**
   - `allowed_origins`: List of domains allowed to access the API
   - `rate_limit`: Number of requests allowed per minute per IP
   - `api_key`: Your secure API key
   - `debug_mode`: Enable/disable detailed error messages

## Client-Side Integration

See `example-client.html` for a complete example of how to securely interact with the API.

## Security Best Practices

1. **API Key Management**
   - Generate a strong, random API key
   - Rotate keys periodically
   - Never expose keys in client-side code

2. **HTTPS**
   - Always use HTTPS in production
   - Configure proper SSL/TLS settings

3. **Regular Updates**
   - Keep all dependencies updated
   - Apply security patches promptly

4. **Monitoring**
   - Monitor API logs for suspicious activity
   - Set up alerts for unusual patterns

5. **Backups**
   - Regularly backup the database
   - Test restoration procedures

## Error Codes

- `400`: Bad Request - Invalid input
- `401`: Unauthorized - Invalid or missing API key
- `403`: Forbidden - CSRF validation failed
- `405`: Method Not Allowed - Unsupported HTTP method
- `429`: Too Many Requests - Rate limit exceeded
- `500`: Internal Server Error - Database or server error