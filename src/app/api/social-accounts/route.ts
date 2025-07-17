import { NextRequest, NextResponse } from 'next/server';
import { getUserSocialMediaCredentials } from '@/lib/socialMediaStorage';

export async function GET(request: NextRequest) {
  try {
    // TODO: Get actual user ID from session/authentication
    // For now, using the same placeholder as in the callback
    const userId = 'demo-user@example.com';
    
    // Get all social media credentials for the user
    const credentials = await getUserSocialMediaCredentials(userId);
    
    // Transform credentials to a format suitable for the frontend
    const connectedAccounts = credentials.map(credential => ({
      platform: credential.platform,
      isConnected: true,
      username: credential.username,
      connectedAt: credential.connectedAt,
      lastUsed: credential.lastUsed,
    }));
    
    // Create a complete list including non-connected platforms
    const allPlatforms = ['twitter', 'facebook', 'instagram', 'linkedin'];
    const accountsStatus = allPlatforms.map(platform => {
      const connected = connectedAccounts.find(acc => acc.platform === platform);
      return connected || {
        platform,
        isConnected: false,
      };
    });
    
    return NextResponse.json({
      success: true,
      accounts: accountsStatus,
    });
  } catch (error) {
    console.error('Error fetching social accounts:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch social accounts' 
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { platform } = await request.json();
    
    if (!platform) {
      return NextResponse.json(
        { success: false, error: 'Platform is required' },
        { status: 400 }
      );
    }
    
    // TODO: Get actual user ID from session/authentication
    const userId = 'demo-user@example.com';
    
    // Import the delete function
    const { deleteSocialMediaCredential } = await import('@/lib/socialMediaStorage');
    
    const result = await deleteSocialMediaCredential(userId, platform);
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: `${platform} account disconnected successfully`,
    });
  } catch (error) {
    console.error('Error disconnecting social account:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to disconnect account' 
      },
      { status: 500 }
    );
  }
}