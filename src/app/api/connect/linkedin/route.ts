import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { generateState } from '@/lib/auth-utils';

export async function GET(request: NextRequest) {
  try {
    const linkedinClientId = process.env.LINKEDIN_CLIENT_ID;
    const { searchParams } = new URL(request.url);
    const returnUrl = searchParams.get('returnUrl') || '/share-post';

    if (!linkedinClientId) {
      console.error('LinkedIn Client ID not configured');
      return new NextResponse('LinkedIn Client ID not configured', { status: 500 });
    }

    console.log('LinkedIn OAuth initiation - Client ID configured:', !!linkedinClientId);

    // Generate state parameter for CSRF protection
    const state = generateState();
    
    // Store state in cookie for verification
    const cookieStore = await cookies();
    cookieStore.set('linkedin_oauth_state', state, {
      path: '/',
      maxAge: 60 * 15, // 15 minutes
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });
    
    // Store returnUrl in the state or as a separate cookie
    cookieStore.set('linkedin_return_url', returnUrl, {
      path: '/',
      maxAge: 60 * 15, // 15 minutes
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });

    // LinkedIn OAuth parameters - Updated scopes for v2 API
    // Removed 'openid' scope as it's not authorized for the application
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: linkedinClientId,
      redirect_uri: `${process.env.NEXT_PUBLIC_SITE_URL}/api/connect/linkedin/callback`,
      scope: 'profile w_member_social openid email',
      state: state,
    });

    const authUrl = `https://www.linkedin.com/oauth/v2/authorization?${params.toString()}`;
    
    console.log('LinkedIn OAuth URL generated:', authUrl);
    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error('LinkedIn OAuth initiation error:', error);
    return NextResponse.redirect(new URL('/settings/social-media?error=linkedin_auth_failed', request.url));
  }
}
