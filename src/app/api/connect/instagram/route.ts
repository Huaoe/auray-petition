import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { generateState } from '@/lib/auth-utils';

export async function GET(request: NextRequest) {
  try {
    const facebookAppId = process.env.FACEBOOK_CLIENT_ID;

    if (!facebookAppId) {
      return new NextResponse('Facebook App ID not configured', { status: 500 });
    }

    // Generate state parameter for CSRF protection
    const state = generateState();
    
    // Store state in cookie for verification
    const cookieStore = await cookies();
    cookieStore.set('instagram_oauth_state', state, {
      path: '/',
      maxAge: 60 * 15, // 15 minutes
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });

    // Instagram OAuth parameters (uses Facebook OAuth with Instagram-specific scopes)
    const params = new URLSearchParams({
      client_id: facebookAppId,
      redirect_uri: `${process.env.NEXT_PUBLIC_SITE_URL}/api/connect/instagram/callback`,
      scope: 'instagram_basic,instagram_content_publish',
      response_type: 'code',
      state: state,
    });

    const authUrl = `https://www.facebook.com/v18.0/dialog/oauth?${params.toString()}`;
    
    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error('Instagram OAuth initiation error:', error);
    return NextResponse.redirect(new URL('/connected-accounts?error=instagram_auth_failed', request.url));
  }
}