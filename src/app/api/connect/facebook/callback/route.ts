import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { storeSocialMediaCredential } from '@/lib/socialMediaStorage';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    if (error) {
      console.error('Facebook OAuth error:', error);
      return NextResponse.redirect(new URL('/connected-accounts?error=facebook_auth_failed', request.url));
    }

    if (!code || !state) {
      return NextResponse.redirect(new URL('/connected-accounts?error=missing_parameters', request.url));
    }

    // Verify state parameter
    const cookieStore = await cookies();
    const storedState = cookieStore.get('facebook_oauth_state')?.value;
    
    if (!storedState || storedState !== state) {
      return NextResponse.redirect(new URL('/connected-accounts?error=invalid_state', request.url));
    }

    // Exchange authorization code for access token
    const tokenResponse = await fetch('https://graph.facebook.com/v18.0/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.FACEBOOK_CLIENT_ID!,
        client_secret: process.env.FACEBOOK_CLIENT_SECRET!,
        redirect_uri: `${process.env.NEXT_PUBLIC_SITE_URL}/api/connect/facebook/callback`,
        code: code,
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      console.error('Facebook token exchange failed:', errorData);
      return NextResponse.redirect(new URL('/connected-accounts?error=token_exchange_failed', request.url));
    }

    const tokenData = await tokenResponse.json();
    const { access_token, expires_in } = tokenData;

    if (!access_token) {
      console.error('No access token received from Facebook');
      return NextResponse.redirect(new URL('/connected-accounts?error=no_access_token', request.url));
    }

    // Get user information from Facebook
    const userResponse = await fetch(`https://graph.facebook.com/v18.0/me?fields=id,name,email&access_token=${access_token}`);
    
    if (!userResponse.ok) {
      console.error('Failed to fetch Facebook user info');
      return NextResponse.redirect(new URL('/connected-accounts?error=user_info_failed', request.url));
    }

    const userData = await userResponse.json();

    // Store the credentials securely
    await storeSocialMediaCredential({
      userId: 'current_user', // This should be replaced with actual user ID from session
      platform: 'facebook',
      accessToken: access_token,
      refreshToken: undefined, // Facebook doesn't provide refresh tokens for this flow
      tokenExpiry: expires_in ? new Date(Date.now() + expires_in * 1000).toISOString() : undefined,
      username: userData.name,
      userId_platform: userData.id,
      connectedAt: new Date().toISOString(),
    });

    // Clean up cookies
    cookieStore.delete('facebook_oauth_state');

    return NextResponse.redirect(new URL('/connected-accounts?success=facebook_connected', request.url));
  } catch (error) {
    console.error('Facebook OAuth callback error:', error);
    return NextResponse.redirect(new URL('/connected-accounts?error=callback_failed', request.url));
  }
}