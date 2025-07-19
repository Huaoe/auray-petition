import { NextRequest, NextResponse } from 'next/server';
import { deleteSocialMediaCredential } from '@/lib/socialMediaStorage';
import { SocialMediaPlatform } from '@/lib/types';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { platform: string } }
) {
  try {
    const platform = params.platform as SocialMediaPlatform;
    const { userId } = await request.json();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }
    
    // Validate platform
    if (!['twitter', 'facebook', 'instagram', 'linkedin'].includes(platform)) {
      return NextResponse.json(
        { error: 'Invalid platform' },
        { status: 400 }
      );
    }
    
    // Delete the credential
    const result = await deleteSocialMediaCredential(userId, platform);
    
    if (result.success) {
      return NextResponse.json({ 
        success: true,
        message: `${platform} account disconnected successfully`
      });
    } else {
      return NextResponse.json(
        { error: result.message || 'Failed to disconnect account' },
        { status: 400 }
      );
    }
    
  } catch (error) {
    console.error('Error disconnecting social account:', error);
    return NextResponse.json(
      { error: 'Failed to disconnect social account' },
      { status: 500 }
    );
  }
}