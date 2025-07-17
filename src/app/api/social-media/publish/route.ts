import { NextRequest, NextResponse } from 'next/server';
import { getSocialMediaCredential } from '@/lib/socialMediaStorage';

export async function POST(request: NextRequest) {
  try {
    const { platform, text, imageUrl } = await request.json();

    if (!platform || !text) {
      return NextResponse.json({ 
        success: false, 
        error: 'Platform and text are required' 
      }, { status: 400 });
    }

    // Get user credentials for the platform
    const credential = await getSocialMediaCredential('current_user', platform);
    
    if (!credential) {
      return NextResponse.json({ 
        success: false, 
        error: `No ${platform} account connected` 
      }, { status: 400 });
    }

    // Check if token is expired
    if (credential.tokenExpiry && new Date(credential.tokenExpiry) < new Date()) {
      return NextResponse.json({ 
        success: false, 
        error: `${platform} token has expired. Please reconnect your account.` 
      }, { status: 401 });
    }

    let result;
    switch (platform) {
      case 'twitter':
        result = await publishToTwitter(credential.accessToken, text, imageUrl);
        break;
      case 'facebook':
        result = await publishToFacebook(credential.accessToken, text, imageUrl);
        break;
      case 'instagram':
        result = await publishToInstagram(credential.accessToken, credential.userId_platform!, text, imageUrl);
        break;
      case 'linkedin':
        result = await publishToLinkedIn(credential.accessToken, text, imageUrl);
        break;
      default:
        return NextResponse.json({ 
          success: false, 
          error: 'Unsupported platform' 
        }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Social media publish error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

// Twitter/X publishing
async function publishToTwitter(accessToken: string, text: string, imageUrl?: string) {
  try {
    let mediaId;
    
    // Upload image if provided
    if (imageUrl) {
      const imageResponse = await fetch(imageUrl);
      const imageBuffer = await imageResponse.arrayBuffer();
      
      const uploadResponse = await fetch('https://upload.twitter.com/1.1/media/upload.json', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/octet-stream',
        },
        body: imageBuffer,
      });
      
      if (uploadResponse.ok) {
        const uploadData = await uploadResponse.json();
        mediaId = uploadData.media_id_string;
      }
    }

    // Create tweet
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

    if (response.ok) {
      const data = await response.json();
      return { success: true, postId: data.data.id };
    } else {
      const errorData = await response.json();
      return { success: false, error: errorData.detail || 'Failed to post to Twitter' };
    }
  } catch (error) {
    return { success: false, error: 'Twitter API error' };
  }
}

// Facebook publishing
async function publishToFacebook(accessToken: string, text: string, imageUrl?: string) {
  try {
    const postData: any = { message: text };
    
    if (imageUrl) {
      postData.url = imageUrl;
    }

    const response = await fetch(`https://graph.facebook.com/v18.0/me/feed`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: new URLSearchParams({
        ...postData,
        access_token: accessToken,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      return { success: true, postId: data.id };
    } else {
      const errorData = await response.json();
      return { success: false, error: errorData.error?.message || 'Failed to post to Facebook' };
    }
  } catch (error) {
    return { success: false, error: 'Facebook API error' };
  }
}

// Instagram publishing
async function publishToInstagram(accessToken: string, instagramAccountId: string, text: string, imageUrl?: string) {
  try {
    if (!imageUrl) {
      return { success: false, error: 'Instagram posts require an image' };
    }

    // Create media container
    const containerResponse = await fetch(`https://graph.facebook.com/v18.0/${instagramAccountId}/media`, {
      method: 'POST',
      body: new URLSearchParams({
        image_url: imageUrl,
        caption: text,
        access_token: accessToken,
      }),
    });

    if (!containerResponse.ok) {
      const errorData = await containerResponse.json();
      return { success: false, error: errorData.error?.message || 'Failed to create Instagram media container' };
    }

    const containerData = await containerResponse.json();
    const creationId = containerData.id;

    // Publish the media
    const publishResponse = await fetch(`https://graph.facebook.com/v18.0/${instagramAccountId}/media_publish`, {
      method: 'POST',
      body: new URLSearchParams({
        creation_id: creationId,
        access_token: accessToken,
      }),
    });

    if (publishResponse.ok) {
      const publishData = await publishResponse.json();
      return { success: true, postId: publishData.id };
    } else {
      const errorData = await publishResponse.json();
      return { success: false, error: errorData.error?.message || 'Failed to publish to Instagram' };
    }
  } catch (error) {
    return { success: false, error: 'Instagram API error' };
  }
}

// LinkedIn publishing
async function publishToLinkedIn(accessToken: string, text: string, imageUrl?: string) {
  try {
    const postData: any = {
      author: 'urn:li:person:PERSON_ID', // This would need to be dynamically set
      lifecycleState: 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: {
            text: text,
          },
          shareMediaCategory: imageUrl ? 'IMAGE' : 'NONE',
        },
      },
      visibility: {
        'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
      },
    };

    if (imageUrl) {
      // LinkedIn image upload is more complex and requires multiple steps
      // For now, we'll post text-only
      postData.specificContent['com.linkedin.ugc.ShareContent'].shareMediaCategory = 'NONE';
    }

    const response = await fetch('https://api.linkedin.com/v2/ugcPosts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'X-Restli-Protocol-Version': '2.0.0',
      },
      body: JSON.stringify(postData),
    });

    if (response.ok) {
      const data = await response.json();
      return { success: true, postId: data.id };
    } else {
      const errorData = await response.json();
      return { success: false, error: errorData.message || 'Failed to post to LinkedIn' };
    }
  } catch (error) {
    return { success: false, error: 'LinkedIn API error' };
  }
}