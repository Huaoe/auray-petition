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
      console.error('LinkedIn OAuth error:', error);
      return NextResponse.redirect(new URL('/connected-accounts?error=linkedin_auth_failed', request.url));
    }

    if (!code || !state) {
      return NextResponse.redirect(new URL('/connected-accounts?error=missing_parameters', request.url));
    }

    // Verify state parameter
    const cookieStore = await cookies();
    const storedState = cookieStore.get('linkedin_oauth_state')?.value;
    
    if (!storedState || storedState !== state) {
      return NextResponse.redirect(new URL('/connected-accounts?error=invalid_state', request.url));
    }

    // Exchange authorization code for access token
    const tokenResponse = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: `${process.env.NEXT_PUBLIC_SITE_URL}/api/connect/linkedin/callback`,
        client_id: process.env.LINKEDIN_CLIENT_ID!,
        client_secret: process.env.LINKEDIN_CLIENT_SECRET!,
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      console.error('LinkedIn token exchange failed:', errorData);
      return NextResponse.redirect(new URL('/connected-accounts?error=token_exchange_failed', request.url));
    }

    const tokenData = await tokenResponse.json();
    const { access_token, expires_in } = tokenData;

    if (!access_token) {
      console.error('No access token received from LinkedIn');
      return NextResponse.redirect(new URL('/connected-accounts?error=no_access_token', request.url));
    }

    // Get user information from LinkedIn
    const userResponse = await fetch('https://api.linkedin.com/v2/people/~:(id,firstName,lastName,emailAddress)', {
      headers: {
        'Authorization': `Bearer ${access_token}`,
      },
    });
    
    if (!userResponse.ok) {
      console.error('Failed to fetch LinkedIn user info');
      return NextResponse.redirect(new URL('/connected-accounts?error=user_info_failed', request.url));
    }

    const userData = await userResponse.json();
    const displayName = `${userData.firstName?.localized?.en_US || ''} ${userData.lastName?.localized?.en_US || ''}`.trim();

    // Store the credentials securely
    await storeSocialMediaCredential({
      userId: 'current_user', // This should be replaced with actual user ID from session
      platform: 'linkedin',
      accessToken: access_token,
      refreshToken: undefined, // LinkedIn doesn't provide refresh tokens in this flow
      tokenExpiry: expires_in ? new Date(Date.now() + expires_in * 1000).toISOString() : undefined,
      username: displayName,
      userId_platform: userData.id,
      connectedAt: new Date().toISOString(),
    });

    // Clean up cookies
    cookieStore.delete('linkedin_oauth_state');

    return NextResponse.redirect(new URL('/settings/social-media?success=linkedin_connected&platform=linkedin', request.url));
  } catch (error) {
    console.error('LinkedIn OAuth callback error:', error);
    return NextResponse.redirect(new URL('/connected-accounts?error=callback_failed', request.url));
  }
}
