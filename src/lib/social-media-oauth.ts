import { SocialMediaPlatform } from './types';

// OAuth Configuration for each platform
export interface OAuthConfig {
  clientId: string;
  clientSecret?: string;
  redirectUri: string;
  authorizationUrl: string;
  tokenUrl: string;
  scopes: string[];
  responseType: 'code' | 'token';
  grantType: 'authorization_code' | 'client_credentials';
}

// Log environment information
console.log('[DEBUG] social-media-oauth: Environment variables:', {
  NODE_ENV: process.env.NODE_ENV,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  TWITTER_CLIENT_ID_EXISTS: !!process.env.NEXT_PUBLIC_TWITTER_CLIENT_ID,
  TWITTER_CLIENT_SECRET_EXISTS: !!process.env.TWITTER_CLIENT_SECRET
});

// OAuth URLs and configurations for each platform
export const OAUTH_CONFIGS: Record<SocialMediaPlatform, OAuthConfig> = {
  twitter: {
    clientId: process.env.NEXT_PUBLIC_TWITTER_CLIENT_ID || '',
    clientSecret: process.env.TWITTER_CLIENT_SECRET || '',
    redirectUri: `${process.env.NEXT_PUBLIC_SITE_URL}/api/connect/twitter/callback`,
    authorizationUrl: 'https://twitter.com/i/oauth2/authorize',
    tokenUrl: 'https://api.twitter.com/2/oauth2/token',
    scopes: ['tweet.read', 'tweet.write', 'users.read', 'offline.access'],
    responseType: 'code',
    grantType: 'authorization_code'
  },
  facebook: {
    clientId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || '',
    clientSecret: process.env.FACEBOOK_APP_SECRET || '',
    redirectUri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback/facebook`,
    authorizationUrl: 'https://www.facebook.com/v18.0/dialog/oauth',
    tokenUrl: 'https://graph.facebook.com/v18.0/oauth/access_token',
    scopes: ['pages_show_list', 'pages_read_engagement', 'pages_manage_posts', 'instagram_basic', 'instagram_content_publish'],
    responseType: 'code',
    grantType: 'authorization_code'
  },
  instagram: {
    // Instagram uses Facebook OAuth
    clientId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || '',
    clientSecret: process.env.FACEBOOK_APP_SECRET || '',
    redirectUri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback/facebook`,
    authorizationUrl: 'https://www.facebook.com/v18.0/dialog/oauth',
    tokenUrl: 'https://graph.facebook.com/v18.0/oauth/access_token',
    scopes: ['instagram_basic', 'instagram_content_publish', 'pages_show_list', 'pages_read_engagement'],
    responseType: 'code',
    grantType: 'authorization_code'
  },
  linkedin: {
    clientId: process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID || '',
    clientSecret: process.env.LINKEDIN_CLIENT_SECRET || '',
    redirectUri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback/linkedin`,
    authorizationUrl: 'https://www.linkedin.com/oauth/v2/authorization',
    tokenUrl: 'https://www.linkedin.com/oauth/v2/accessToken',
    scopes: ['openid', 'profile', 'w_member_social'],
    responseType: 'code',
    grantType: 'authorization_code'
  }
};

// Generate OAuth authorization URL
export const generateOAuthUrl = (platform: SocialMediaPlatform, state: string): string => {
  const config = OAUTH_CONFIGS[platform];
  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    response_type: config.responseType,
    scope: config.scopes.join(' '),
    state
  });

  // Platform-specific parameters
  if (platform === 'twitter') {
    params.append('code_challenge', 'challenge'); // In production, generate proper PKCE
    params.append('code_challenge_method', 'plain');
  }

  return `${config.authorizationUrl}?${params.toString()}`;
};

// Token refresh configuration
export interface TokenRefreshConfig {
  platform: SocialMediaPlatform;
  refreshToken: string;
  clientId: string;
  clientSecret?: string;
}

// Refresh access token
export const refreshAccessToken = async (config: TokenRefreshConfig): Promise<{
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
}> => {
  const oauthConfig = OAUTH_CONFIGS[config.platform];
  
  const params = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: config.refreshToken,
    client_id: config.clientId
  });

  if (config.clientSecret) {
    params.append('client_secret', config.clientSecret);
  }

  const response = await fetch(oauthConfig.tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString()
  });

  if (!response.ok) {
    throw new Error(`Failed to refresh token: ${response.statusText}`);
  }

  const data = await response.json();
  
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresIn: data.expires_in
  };
};