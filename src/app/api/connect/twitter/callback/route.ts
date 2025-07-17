import { NextRequest, NextResponse } from 'next/server';
import { URLSearchParams } from 'url';
import { cookies } from 'next/headers';
import { storeSocialMediaCredential, initializeSocialMediaSheet } from '@/lib/socialMediaStorage';

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code');
  const state = req.nextUrl.searchParams.get('state');

  const cookieStore = await cookies();
  const storedState = cookieStore.get('twitter_oauth_state')?.value;
  const storedCodeVerifier = cookieStore.get('twitter_code_verifier')?.value;

  if (!code || !state || !storedState || state !== storedState) {
    return new NextResponse('Invalid state or code', { status: 400 });
  }

  if (!storedCodeVerifier) {
    return new NextResponse('Code verifier not found', { status: 400 });
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

    // Store the credentials securely
    // For now, using a placeholder user ID - in a real app, this would come from user session
    const userId = 'demo-user@example.com'; // TODO: Replace with actual user session
    
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
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/connected-accounts?error=storage_failed`);
    }

    console.log(`✅ Twitter credentials stored successfully for user: ${userId}`);

    // Clear the cookies after use
    const cookieStore = await cookies();
    cookieStore.delete('twitter_oauth_state');
    cookieStore.delete('twitter_code_verifier');

    // Redirect the user to the connected accounts page with success
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/connected-accounts?success=twitter_connected&username=${encodeURIComponent(username)}`);

  } catch (error) {
    console.error(error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}