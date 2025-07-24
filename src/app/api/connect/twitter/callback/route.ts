import { NextRequest, NextResponse } from 'next/server';
import { URLSearchParams } from 'url';
import { cookies } from 'next/headers';
import { storeSocialMediaCredential, initializeSocialMediaSheet } from '@/lib/socialMediaStorage';
import { decodeState } from '@/lib/auth-utils';

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code');
  const state = req.nextUrl.searchParams.get('state');

  console.log('Twitter callback received:', { code: !!code, state: !!state });

  const cookieStore = await cookies();
  const storedState = cookieStore.get('twitter_oauth_state')?.value;
  const storedCodeVerifier = cookieStore.get('twitter_code_verifier')?.value;
  const storedUserId = cookieStore.get('twitter_user_id')?.value;

  console.log('Stored values:', {
    storedState: !!storedState,
    storedCodeVerifier: !!storedCodeVerifier,
    storedUserId: !!storedUserId,
    stateMatch: state === storedState
  });

  if (!code || !state || !storedState || state !== storedState) {
    console.error('State validation failed:', { code: !!code, state, storedState });
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/settings/social-media?error=invalid_state`);
  }

  if (!storedCodeVerifier) {
    console.error('Code verifier not found');
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/settings/social-media?error=missing_code_verifier`);
  }

  // Default redirect URL if we can't extract it from state
  let returnUrl = '/settings/social-media';
  
  // Try to decode the state to extract the return URL
  if (state) {
    try {
      const decodedState = decodeState(state);
      if (decodedState && decodedState.returnUrl) {
        returnUrl = decodedState.returnUrl;
        console.log('Extracted return URL from state:', returnUrl);
      }
    } catch (error) {
      console.warn('Failed to decode state parameter:', error);
    }
  }

  try {
    const twitterClientId = process.env.TWITTER_CLIENT_ID;
    const twitterClientSecret = process.env.TWITTER_CLIENT_SECRET;

    if (!twitterClientId || !twitterClientSecret) {
      return new NextResponse('Twitter credentials not configured', { status: 500 });
    }

    const body = new URLSearchParams({
      code,
      grant_type: 'authorization_code',
      client_id: twitterClientId,
      redirect_uri: `${process.env.NEXT_PUBLIC_SITE_URL}/api/connect/twitter/callback`,
      code_verifier: storedCodeVerifier,
    });

    const response = await fetch('https://api.twitter.com/2/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${twitterClientId}:${twitterClientSecret}`).toString('base64')}`,
      },
      body: body.toString(),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error_description || 'Failed to fetch access token');
    }

    // Get user information from Twitter API
    let username = '';
    let twitterUserId = '';
    
    try {
      const userResponse = await fetch('https://api.twitter.com/2/users/me', {
        headers: {
          'Authorization': `Bearer ${data.access_token}`,
        },
      });
      
      if (userResponse.ok) {
        const userData = await userResponse.json();
        username = userData.data?.username || '';
        twitterUserId = userData.data?.id || '';
      }
    } catch (error) {
      console.warn('Failed to fetch Twitter user info:', error);
    }

    // Initialize social media sheet if needed
    await initializeSocialMediaSheet();

    // Use the user ID from the cookie, or fall back to a default if not available
    const userId = storedUserId || 'anonymous-user';
    
    const credential = {
      userId,
      platform: 'twitter' as const,
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      tokenExpiry: data.expires_in ? new Date(Date.now() + data.expires_in * 1000).toISOString() : undefined,
      username,
      userId_platform: twitterUserId,
      connectedAt: new Date().toISOString(),
    };

    const storeResult = await storeSocialMediaCredential(credential);
    
    if (!storeResult.success) {
      console.error('Failed to store Twitter credentials:', storeResult.message);
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}${returnUrl}?error=storage_failed`);
    }

    console.log(`✅ Twitter credentials stored successfully for user: ${userId}`);

    // Clear the cookies after use
    cookieStore.delete('twitter_oauth_state');
    cookieStore.delete('twitter_code_verifier');
    cookieStore.delete('twitter_user_id');

    // Redirect the user to the return URL with success
    const redirectUrl = `${process.env.NEXT_PUBLIC_SITE_URL}${returnUrl}?success=twitter_connected&platform=twitter&username=${encodeURIComponent(username)}`;
    console.log('Redirecting to:', redirectUrl);
    return NextResponse.redirect(redirectUrl);

  } catch (error) {
    console.error(error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
