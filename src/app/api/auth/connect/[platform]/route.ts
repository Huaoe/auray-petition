import { NextRequest, NextResponse } from 'next/server';
import { generateOAuthUrl } from '@/lib/social-media-oauth';
import { SocialMediaPlatform } from '@/lib/types';
import { randomBytes } from 'crypto';

export async function GET(
  request: NextRequest,
  { params }: { params: { platform: string } }
) {
  try {
    const platform = params.platform as SocialMediaPlatform;
    
    // Validate platform
    if (!['twitter', 'facebook', 'instagram', 'linkedin'].includes(platform)) {
      return NextResponse.json(
        { error: 'Invalid platform' },
        { status: 400 }
      );
    }

    // Generate state parameter for CSRF protection
    // In production, store this in a session or database
    const state = randomBytes(32).toString('hex');
    
    // For Instagram, use Facebook OAuth
    const oauthPlatform = platform === 'instagram' ? 'facebook' : platform;
    
    // Generate OAuth URL
    const authUrl = generateOAuthUrl(oauthPlatform, state);
    
    // Return the authorization URL
    return NextResponse.json({
      authUrl,
      platform,
      state
    });
    
  } catch (error) {
    console.error('OAuth connect error:', error);
    return NextResponse.json(
      { error: 'Failed to generate authorization URL' },
      { status: 500 }
    );
  }
}