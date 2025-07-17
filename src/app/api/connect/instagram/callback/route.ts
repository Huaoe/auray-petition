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
      console.error('Instagram OAuth error:', error);
      return NextResponse.redirect(new URL('/connected-accounts?error=instagram_auth_failed', request.url));
    }

    if (!code || !state) {
      return NextResponse.redirect(new URL('/connected-accounts?error=missing_parameters', request.url));
    }

    // Verify state parameter
    const cookieStore = await cookies();
    const storedState = cookieStore.get('instagram_oauth_state')?.value;
    
    if (!storedState || storedState !== state) {
      return NextResponse.redirect(new URL('/connected-accounts?error=invalid_state', request.url));
    }

    // Exchange authorization code for access token (using Facebook's token endpoint)
    const tokenResponse = await fetch('https://graph.facebook.com/v18.0/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.FACEBOOK_CLIENT_ID!,
        client_secret: process.env.FACEBOOK_CLIENT_SECRET!,
        redirect_uri: `${process.env.NEXT_PUBLIC_SITE_URL}/api/connect/instagram/callback`,
        code: code,
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      console.error('Instagram token exchange failed:', errorData);
      return NextResponse.redirect(new URL('/connected-accounts?error=token_exchange_failed', request.url));
    }

    const tokenData = await tokenResponse.json();
    const { access_token, expires_in } = tokenData;

    if (!access_token) {
      console.error('No access token received from Instagram');
      return NextResponse.redirect(new URL('/connected-accounts?error=no_access_token', request.url));
    }

    // Get Instagram Business Account ID
    const accountsResponse = await fetch(`https://graph.facebook.com/v18.0/me/accounts?access_token=${access_token}`);
    
    if (!accountsResponse.ok) {
      console.error('Failed to fetch Instagram accounts');
      return NextResponse.redirect(new URL('/connected-accounts?error=accounts_fetch_failed', request.url));
    }

    const accountsData = await accountsResponse.json();
    const pages = accountsData.data || [];
    
    // Find a page with Instagram business account
    let instagramAccount = null;
    for (const page of pages) {
      const igResponse = await fetch(`https://graph.facebook.com/v18.0/${page.id}?fields=instagram_business_account&access_token=${access_token}`);
      if (igResponse.ok) {
        const igData = await igResponse.json();
        if (igData.instagram_business_account) {
          instagramAccount = {
            id: igData.instagram_business_account.id,
            pageName: page.name,
            pageId: page.id,
          };
          break;
        }
      }
    }

    if (!instagramAccount) {
      return NextResponse.redirect(new URL('/connected-accounts?error=no_instagram_business_account', request.url));
    }

    // Get Instagram account details
    const igUserResponse = await fetch(`https://graph.facebook.com/v18.0/${instagramAccount.id}?fields=id,username&access_token=${access_token}`);
    
    if (!igUserResponse.ok) {
      console.error('Failed to fetch Instagram user info');
      return NextResponse.redirect(new URL('/connected-accounts?error=instagram_user_info_failed', request.url));
    }

    const igUserData = await igUserResponse.json();

    // Store the credentials securely
    await storeSocialMediaCredential({
      userId: 'current_user', // This should be replaced with actual user ID from session
      platform: 'instagram',
      accessToken: access_token,
      refreshToken: undefined, // Instagram doesn't provide refresh tokens in this flow
      tokenExpiry: expires_in ? new Date(Date.now() + expires_in * 1000).toISOString() : undefined,
      username: igUserData.username,
      userId_platform: instagramAccount.id,
      connectedAt: new Date().toISOString(),
    });

    // Clean up cookies
    cookieStore.delete('instagram_oauth_state');

    return NextResponse.redirect(new URL('/connected-accounts?success=instagram_connected', request.url));
  } catch (error) {
    console.error('Instagram OAuth callback error:', error);
    return NextResponse.redirect(new URL('/connected-accounts?error=callback_failed', request.url));
  }
}