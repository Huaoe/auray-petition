import { NextRequest, NextResponse } from 'next/server';
import { OAUTH_CONFIGS } from '@/lib/social-media-oauth';
import { storeSocialMediaCredential, initializeSocialMediaSheet } from '@/lib/socialMediaStorage';
import { SocialMediaPlatform } from '@/lib/types';
import { cookies } from 'next/headers';

interface RouteContext {
  params: {
    platform: string;
  };
}

export async function GET(
  request: NextRequest,
  context: any // Using 'any' as a diagnostic step to bypass the type error
) {
  try {
    const { params } = context;
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
        // Use v2/userinfo endpoint (requires openid scope)
        const linkedinUserResponse = await fetch(
          'https://api.linkedin.com/v2/userinfo',
          {
            headers: {
              'Authorization': `Bearer ${tokenData.access_token}`,
            },
          }
        );
        
        if (!linkedinUserResponse.ok) {
          const errorText = await linkedinUserResponse.text();
          console.error("Failed to fetch LinkedIn user info:", {
            status: linkedinUserResponse.status,
            statusText: linkedinUserResponse.statusText,
            error: errorText
          });
        } else {
          const linkedinData = await linkedinUserResponse.json();
          console.log("LinkedIn userinfo data received:", linkedinData);
          
          // Extract user info from userinfo endpoint response
          // The userinfo endpoint returns data in OpenID Connect format
          let userName = linkedinData.name || "LinkedIn User";
          
          userInfo = {
            username: userName,
            userId_platform: linkedinData.sub, // OpenID Connect uses 'sub' for the user ID
          };
          
          console.log("LinkedIn user info extracted:", {
            name: userName,
            id: linkedinData.sub,
          });
        }
        break;
    }

    // Initialize social media sheet if needed
    await initializeSocialMediaSheet();

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

    // For LinkedIn, check if there's a return URL in the cookies
    if (platform === 'linkedin') {
      const cookieStore = await cookies();
      const returnUrlCookie = cookieStore.get("linkedin_return_url");
      
      if (returnUrlCookie?.value) {
        const returnUrl = returnUrlCookie.value;
        cookieStore.delete("linkedin_return_url");
        
        if (result.success) {
          return NextResponse.redirect(
            `${process.env.NEXT_PUBLIC_APP_URL}${returnUrl}?success=connected&platform=${platform}`
          );
        } else {
          return NextResponse.redirect(
            `${process.env.NEXT_PUBLIC_APP_URL}${returnUrl}?error=storage_failed`
          );
        }
      }
    }

    // Default redirect for other platforms
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
