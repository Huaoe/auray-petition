import { NextRequest, NextResponse } from 'next/server';
import { OAUTH_CONFIGS } from '@/lib/social-media-oauth';
import { storeSocialMediaCredential } from '@/lib/socialMediaStorage';
import { SocialMediaPlatform } from '@/lib/types';

export async function GET(
  request: NextRequest,
  { params }: { params: { platform: string } }
) {
  try {
    const platform = params.platform as SocialMediaPlatform;
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    // Handle OAuth errors
    if (error) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/settings/social?error=${encodeURIComponent(error)}`
      );
    }

    if (!code || !state) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/settings/social?error=missing_parameters`
      );
    }

    // Validate platform
    if (!['twitter', 'facebook', 'instagram', 'linkedin'].includes(platform)) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/settings/social?error=invalid_platform`
      );
    }

    const config = OAUTH_CONFIGS[platform];

    // Exchange code for access token
    const tokenParams = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: config.redirectUri,
      client_id: config.clientId,
    });

    if (config.clientSecret) {
      tokenParams.append('client_secret', config.clientSecret);
    }

    // Platform-specific parameters
    if (platform === 'twitter') {
      tokenParams.append('code_verifier', 'challenge'); // In production, use proper PKCE
    }

    const tokenResponse = await fetch(config.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: tokenParams.toString(),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      console.error('Token exchange failed:', errorData);
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/settings/social?error=token_exchange_failed`
      );
    }

    const tokenData = await tokenResponse.json();

    // Get user info based on platform
    let userInfo: any = {};
    
    switch (platform) {
      case 'twitter':
        const twitterUserResponse = await fetch('https://api.twitter.com/2/users/me', {
          headers: {
            'Authorization': `Bearer ${tokenData.access_token}`,
          },
        });
        if (twitterUserResponse.ok) {
          const twitterData = await twitterUserResponse.json();
          userInfo = {
            username: twitterData.data.username,
            userId_platform: twitterData.data.id,
          };
        }
        break;

      case 'facebook':
      case 'instagram':
        const fbUserResponse = await fetch('https://graph.facebook.com/v18.0/me?fields=id,name,accounts', {
          headers: {
            'Authorization': `Bearer ${tokenData.access_token}`,
          },
        });
        if (fbUserResponse.ok) {
          const fbData = await fbUserResponse.json();
          userInfo = {
            username: fbData.name,
            userId_platform: fbData.id,
          };
          
          // For Instagram, get Instagram Business Account ID
          if (platform === 'instagram' && fbData.accounts?.data?.length > 0) {
            const pageId = fbData.accounts.data[0].id;
            const igResponse = await fetch(
              `https://graph.facebook.com/v18.0/${pageId}?fields=instagram_business_account`,
              {
                headers: {
                  'Authorization': `Bearer ${tokenData.access_token}`,
                },
              }
            );
            if (igResponse.ok) {
              const igData = await igResponse.json();
              if (igData.instagram_business_account) {
                userInfo.userId_platform = igData.instagram_business_account.id;
              }
            }
          }
        }
        break;

      case 'linkedin':
        const linkedinUserResponse = await fetch('https://api.linkedin.com/v2/userinfo', {
          headers: {
            'Authorization': `Bearer ${tokenData.access_token}`,
          },
        });
        if (linkedinUserResponse.ok) {
          const linkedinData = await linkedinUserResponse.json();
          userInfo = {
            username: linkedinData.name,
            userId_platform: linkedinData.sub,
          };
        }
        break;
    }

    // Store credentials
    const credential = {
      userId: state, // In production, decode state to get actual user ID
      platform,
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      tokenExpiry: tokenData.expires_in 
        ? new Date(Date.now() + tokenData.expires_in * 1000).toISOString()
        : undefined,
      username: userInfo.username,
      userId_platform: userInfo.userId_platform,
      connectedAt: new Date().toISOString(),
    };

    const result = await storeSocialMediaCredential(credential);

    if (result.success) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/settings/social?success=connected&platform=${platform}`
      );
    } else {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/settings/social?error=storage_failed`
      );
    }

  } catch (error) {
    console.error('OAuth callback error:', error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/settings/social?error=callback_error`
    );
  }
}
