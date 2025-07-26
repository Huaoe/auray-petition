import { NextRequest, NextResponse } from 'next/server';
import { getSocialMediaCredential, updateSocialMediaCredential } from '@/lib/socialMediaStorage';
import { refreshAccessToken } from '@/lib/social-media-oauth';
import { SocialMediaPlatform } from '@/lib/types';
import { getOrCreateUserIdServer } from '@/lib/user-session';

// Platform-specific publishing functions with modern APIs
async function publishToTwitter(accessToken: string, text: string, imageUrl?: string) {
  try {
    let mediaId: string | undefined;
    
    // Upload image if provided using v2 API
    if (imageUrl) {
      // First, download the image
      const imageResponse = await fetch(imageUrl);
      if (!imageResponse.ok) {
        throw new Error('Failed to fetch image');
      }
      
      const imageBuffer = await imageResponse.arrayBuffer();
      const imageBlob = new Blob([imageBuffer]);
      
      // Initialize upload
      const initResponse = await fetch('https://upload.twitter.com/1.1/media/upload.json', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        body: new URLSearchParams({
          command: 'INIT',
          total_bytes: imageBlob.size.toString(),
          media_type: 'image/jpeg',
          media_category: 'tweet_image'
        })
      });

      if (!initResponse.ok) {
        console.error('Twitter media init failed:', await initResponse.text());
        throw new Error('Failed to initialize media upload');
      }

      const initData = await initResponse.json();
      mediaId = initData.media_id_string;

      // Upload the image
      const formData = new FormData();
      formData.append('command', 'APPEND');
      formData.append('media_id', mediaId);
      formData.append('segment_index', '0');
      formData.append('media', imageBlob);

      const appendResponse = await fetch('https://upload.twitter.com/1.1/media/upload.json', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        body: formData
      });

      if (!appendResponse.ok) {
        console.error('Twitter media append failed:', await appendResponse.text());
        throw new Error('Failed to upload media');
      }

      // Finalize upload
      const finalizeResponse = await fetch('https://upload.twitter.com/1.1/media/upload.json', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        body: new URLSearchParams({
          command: 'FINALIZE',
          media_id: mediaId
        })
      });

      if (!finalizeResponse.ok) {
        console.error('Twitter media finalize failed:', await finalizeResponse.text());
        throw new Error('Failed to finalize media upload');
      }
    }

    // Create tweet using v2 API
    const tweetData: any = { text };
    if (mediaId) {
      tweetData.media = { media_ids: [mediaId] };
    }

    const response = await fetch('https://api.twitter.com/2/tweets', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tweetData),
    });

    const responseData = await response.json();

    if (response.ok) {
      return { success: true, postId: responseData.data.id };
    } else {
      console.error('Twitter post failed:', responseData);
      return { 
        success: false, 
        error: responseData.detail || responseData.errors?.[0]?.message || 'Failed to post to Twitter' 
      };
    }
  } catch (error) {
    console.error('Twitter API error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Twitter API error' 
    };
  }
}

async function publishToFacebook(accessToken: string, text: string, imageUrl?: string) {
  try {
    const params = new URLSearchParams({
      message: text,
      access_token: accessToken
    });
    
    if (imageUrl) {
      params.append('url', imageUrl);
    }

    const response = await fetch(`https://graph.facebook.com/v18.0/me/feed`, {
      method: 'POST',
      body: params,
    });

    const responseData = await response.json();

    if (response.ok) {
      return { success: true, postId: responseData.id };
    } else {
      console.error('Facebook post failed:', responseData);
      return { 
        success: false, 
        error: responseData.error?.message || 'Failed to post to Facebook' 
      };
    }
  } catch (error) {
    console.error('Facebook API error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Facebook API error' 
    };
  }
}

async function publishToInstagram(accessToken: string, instagramAccountId: string, text: string, imageUrl?: string) {
  try {
    if (!imageUrl) {
      return { success: false, error: 'Instagram requires an image' };
    }

    // Validate image URL is accessible
    const imageCheck = await fetch(imageUrl, { method: 'HEAD' });
    if (!imageCheck.ok) {
      return { success: false, error: 'Image URL is not accessible' };
    }

    // Create media container
    const containerParams = new URLSearchParams({
      image_url: imageUrl,
      caption: text,
      access_token: accessToken
    });

    const containerResponse = await fetch(
      `https://graph.facebook.com/v18.0/${instagramAccountId}/media`,
      {
        method: 'POST',
        body: containerParams,
      }
    );

    const containerData = await containerResponse.json();

    if (!containerResponse.ok) {
      console.error('Instagram container creation failed:', containerData);
      return { 
        success: false, 
        error: containerData.error?.message || 'Failed to create Instagram media container' 
      };
    }

    const creationId = containerData.id;

    // Wait a moment for processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Publish the media
    const publishParams = new URLSearchParams({
      creation_id: creationId,
      access_token: accessToken
    });

    const publishResponse = await fetch(
      `https://graph.facebook.com/v18.0/${instagramAccountId}/media_publish`,
      {
        method: 'POST',
        body: publishParams,
      }
    );

    const publishData = await publishResponse.json();

    if (publishResponse.ok) {
      return { success: true, postId: publishData.id };
    } else {
      console.error('Instagram publish failed:', publishData);
      return { 
        success: false, 
        error: publishData.error?.message || 'Failed to publish to Instagram' 
      };
    }
  } catch (error) {
    console.error('Instagram API error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Instagram API error' 
    };
  }
}

async function publishToLinkedIn(accessToken: string, personUrn: string, text: string, imageUrl?: string) {
  try {
    const postData: any = {
      author: personUrn,
      lifecycleState: 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: {
            text: text,
          },
          shareMediaCategory: 'NONE',
        },
      },
      visibility: {
        'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
      },
    };

    // LinkedIn image upload is complex, for now we'll post text only
    // In production, implement the multi-step image upload process

    const response = await fetch('https://api.linkedin.com/v2/ugcPosts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'X-Restli-Protocol-Version': '2.0.0',
      },
      body: JSON.stringify(postData),
    });

    const responseData = await response.json();

    if (response.ok) {
      return { success: true, postId: responseData.id };
    } else {
      console.error('LinkedIn post failed:', responseData);
      return { 
        success: false, 
        error: responseData.message || 'Failed to post to LinkedIn' 
      };
    }
  } catch (error) {
    console.error('LinkedIn API error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'LinkedIn API error' 
    };
  }
}

// Helper function to refresh token if needed
async function ensureValidToken(credential: any, platform: SocialMediaPlatform) {
  // Check if token is expired
  if (credential.tokenExpiry && new Date(credential.tokenExpiry) < new Date()) {
    if (!credential.refreshToken) {
      throw new Error('Token expired and no refresh token available');
    }

    try {
      const newTokenData = await refreshAccessToken({
        platform,
        refreshToken: credential.refreshToken,
        clientId: process.env[`NEXT_PUBLIC_${platform.toUpperCase()}_CLIENT_ID`] || '',
        clientSecret: process.env[`${platform.toUpperCase()}_CLIENT_SECRET`],
      });

      // Update stored credentials
      credential.accessToken = newTokenData.accessToken;
      if (newTokenData.refreshToken) {
        credential.refreshToken = newTokenData.refreshToken;
      }
      if (newTokenData.expiresIn) {
        credential.tokenExpiry = new Date(Date.now() + newTokenData.expiresIn * 1000).toISOString();
      }

      await updateSocialMediaCredential(credential);
      
      return credential;
    } catch (error) {
      throw new Error('Failed to refresh token');
    }
  }

  return credential;
}

export async function POST(request: NextRequest) {
  try {
    const { platform, text, imageUrl } = await request.json();

    if (!platform || !text) {
      return NextResponse.json({ 
        success: false, 
        error: 'Platform and text are required' 
      }, { status: 400 });
    }

    // Validate platform
    if (!['twitter', 'facebook', 'instagram', 'linkedin'].includes(platform)) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid platform' 
      }, { status: 400 });
    }

    // Get user credentials for the platform
    const userId = await getOrCreateUserIdServer();
    let credential = await getSocialMediaCredential(userId, platform);
    
    if (!credential) {
      return NextResponse.json({ 
        success: false, 
        error: `No ${platform} account connected. Please connect your account first.` 
      }, { status: 400 });
    }

    // Ensure token is valid
    try {
      credential = await ensureValidToken(credential, platform as SocialMediaPlatform);
    } catch (error) {
      return NextResponse.json({ 
        success: false, 
        error: `Authentication failed. Please reconnect your ${platform} account.` 
      }, { status: 401 });
    }

    // Publish to the platform
    let result;
    switch (platform) {
      case 'twitter':
        result = await publishToTwitter(credential.accessToken, text, imageUrl);
        break;
      case 'facebook':
        result = await publishToFacebook(credential.accessToken, text, imageUrl);
        break;
      case 'instagram':
        if (!credential.userId_platform) {
          return NextResponse.json({ 
            success: false, 
            error: 'Instagram Business Account ID not found. Please reconnect your account.' 
          }, { status: 400 });
        }
        result = await publishToInstagram(credential.accessToken, credential.userId_platform, text, imageUrl);
        break;
      case 'linkedin':
        if (!credential.userId_platform) {
          return NextResponse.json({ 
            success: false, 
            error: 'LinkedIn user URN not found. Please reconnect your account.' 
          }, { status: 400 });
        }
        result = await publishToLinkedIn(
          credential.accessToken, 
          `urn:li:person:${credential.userId_platform}`, 
          text, 
          imageUrl
        );
        break;
      default:
        return NextResponse.json({ 
          success: false, 
          error: 'Unsupported platform' 
        }, { status: 400 });
    }

    // Update last used timestamp
    if (result.success) {
      credential.lastUsed = new Date().toISOString();
      await updateSocialMediaCredential(credential);
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Social media publish error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Internal server error' 
    }, { status: 500 });
  }
}