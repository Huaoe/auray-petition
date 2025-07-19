# Stability API Authorization Error - Troubleshooting Guide

## Error Message
```
Erreur de génération: Error: Stability API error: 401 - {"errors":["authorization: invalid or missing header value"],"id":"e2343353455637f4b7ea0aae7a5444b5","name":"unauthorized"}
```

## Quick Diagnosis

Visit `/api/test-stability` in your browser to run automated diagnostics.

## Common Causes & Solutions

### 1. Missing API Key in Production

**Symptom**: Works locally but not in production  
**Solution**: 
- Go to your Vercel/hosting dashboard
- Add environment variable: `STABILITY_API_KEY=your_actual_key_here`
- Redeploy the application

### 2. API Key Format Issues

**Common mistakes**:
- ❌ `STABILITY_API_KEY="sk-xxxxx"` (remove quotes)
- ❌ `STABILITY_API_KEY=Bearer sk-xxxxx` (remove "Bearer")
- ❌ `STABILITY_API_KEY= sk-xxxxx ` (remove spaces)
- ✅ `STABILITY_API_KEY=sk-xxxxx`

### 3. Invalid or Expired API Key

**Check your key**:
1. Go to https://platform.stability.ai/account/keys
2. Verify your key is active
3. Check your account has credits
4. Generate a new key if needed

### 4. Environment Variable Not Loading

**Local development**:
```bash
# Check .env.local file exists
# Restart Next.js server after adding the key
npm run dev
# or
yarn dev
```

**Production (Vercel)**:
1. Go to Project Settings → Environment Variables
2. Add `STABILITY_API_KEY`
3. Ensure it's available for Production environment
4. Redeploy

## Testing Your Fix

### 1. Test Endpoint
```bash
# Visit in browser
http://localhost:3000/api/test-stability

# Or use curl
curl http://localhost:3000/api/test-stability
```

### 2. Manual Test
```javascript
// Quick test in browser console
fetch('/api/test-stability')
  .then(r => r.json())
  .then(console.log)
```

## API Configuration Issues

### Headers Issue (Already Fixed)
The `getStabilityHeaders()` function in `ai-config.ts` incorrectly sets `Content-Type` for FormData. The API routes correctly bypass this function.

### Correct Header Format
```javascript
// ✅ Correct
headers: {
  "Authorization": `Bearer ${process.env.STABILITY_API_KEY}`,
  "Accept": "image/*"
  // Don't set Content-Type for FormData
}

// ❌ Incorrect
headers: {
  "Authorization": process.env.STABILITY_API_KEY, // Missing "Bearer"
  "Content-Type": "multipart/form-data" // Browser should set this
}
```

## Emergency Fixes

### 1. Temporary Bypass (Development Only)
```javascript
// In your API route, add logging
console.log('API Key exists:', !!process.env.STABILITY_API_KEY);
console.log('API Key length:', process.env.STABILITY_API_KEY?.length);
```

### 2. Fallback Error Handling
```javascript
if (!process.env.STABILITY_API_KEY) {
  return NextResponse.json({
    error: "Stability AI API key not configured",
    message: "Please contact support or check server configuration"
  }, { status: 503 });
}
```

## Verification Steps

1. **Check environment variable**:
   ```bash
   echo $STABILITY_API_KEY  # Linux/Mac
   echo %STABILITY_API_KEY% # Windows
   ```

2. **Verify in Next.js**:
   ```javascript
   // pages/api/check-env.js
   export default function handler(req, res) {
     res.json({
       hasKey: !!process.env.STABILITY_API_KEY,
       keyLength: process.env.STABILITY_API_KEY?.length || 0
     });
   }
   ```

3. **Test API directly**:
   ```bash
   curl -H "Authorization: Bearer YOUR_KEY" \
        -H "Accept: application/json" \
        https://api.stability.ai/v1/user/account
   ```

## Contact Support

If none of the above solutions work:
1. Check Stability AI status: https://status.stability.ai/
2. Contact Stability AI support with the error ID
3. Verify your account is in good standing

## Prevention

1. Use environment variable validation on startup
2. Add health check endpoint
3. Monitor API usage and errors
4. Set up alerts for 401 errors
5. Rotate API keys periodically