# Social Media OAuth Environment Variables

This document lists all the required environment variables for the social media OAuth integration.

## Required Environment Variables

Add these to your `.env.local` file:

### Twitter (X)
```env
TWITTER_CLIENT_ID=your_twitter_client_id
TWITTER_CLIENT_SECRET=your_twitter_client_secret
```

### Facebook
```env
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
```

### Instagram
```env
# Instagram uses the same Facebook App
INSTAGRAM_APP_ID=your_facebook_app_id
INSTAGRAM_APP_SECRET=your_facebook_app_secret
```

### LinkedIn
```env
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
```

### OAuth Redirect URLs
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000  # Change to your production URL
```

### Encryption Key
```env
ENCRYPTION_KEY=your_32_character_encryption_key_here
```

## OAuth Redirect URIs

Configure these redirect URIs in each platform's developer console:

### Twitter
- Redirect URI: `http://localhost:3000/api/auth/callback/twitter`
- Production: `https://yourdomain.com/api/auth/callback/twitter`

### Facebook/Instagram
- Redirect URI: `http://localhost:3000/api/auth/callback/facebook`
- Production: `https://yourdomain.com/api/auth/callback/facebook`

### LinkedIn
- Redirect URI: `http://localhost:3000/api/auth/callback/linkedin`
- Production: `https://yourdomain.com/api/auth/callback/linkedin`

## Platform-Specific Setup

### Twitter (X)
1. Go to [Twitter Developer Portal](https://developer.twitter.com/)
2. Create a new app or use existing one
3. Enable OAuth 2.0
4. Add redirect URIs
5. Copy Client ID and Client Secret

### Facebook/Instagram
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app or use existing one
3. Add Facebook Login product
4. Add Instagram Basic Display product
5. Configure OAuth redirect URIs
6. Copy App ID and App Secret

### LinkedIn
1. Go to [LinkedIn Developers](https://www.linkedin.com/developers/)
2. Create a new app
3. Add OAuth 2.0 settings
4. Configure redirect URLs
5. Copy Client ID and Client Secret

## Generating Encryption Key

Generate a secure 32-character encryption key:

```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex').slice(0, 32))"

# Using OpenSSL
openssl rand -hex 16
```

## Security Notes

1. **Never commit** `.env.local` to version control
2. **Use different credentials** for development and production
3. **Rotate keys regularly** in production
4. **Limit OAuth scopes** to only what's needed
5. **Use HTTPS** in production for all OAuth callbacks

## Troubleshooting

### Common Issues

1. **Invalid redirect URI**: Ensure the redirect URI in your app matches exactly with the one configured in the platform
2. **Missing scopes**: Check that you've requested the necessary permissions
3. **Expired tokens**: The app automatically handles token refresh, but check logs for refresh failures
4. **CORS errors**: Ensure your domain is whitelisted in the platform settings

### Debug Mode

Enable debug logging by adding:
```env
SOCIAL_MEDIA_DEBUG=true
```

This will log detailed OAuth flow information to help troubleshoot issues.