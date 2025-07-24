import { NextRequest, NextResponse } from 'next/server';
import { getUserSocialMediaCredentials } from '@/lib/socialMediaStorage';
import { SocialMediaAccount } from '@/lib/types';
import { getUserId } from '@/lib/user-session';

export async function GET(request: NextRequest) {
  try {
    // Get user ID from session
    const sessionUserId = await getUserId();
    
    // Allow override via query parameter for admin or testing purposes
    const searchParams = request.nextUrl.searchParams;
    const queryUserId = searchParams.get('userId');
    
    // Use query parameter if provided, otherwise use session user ID
    const userId = queryUserId || sessionUserId;
    
    console.log('Fetching social accounts for user:', userId);
    
    // Get all social media credentials for the user
    const credentials = await getUserSocialMediaCredentials(userId);
    
    // Transform credentials to account info (without sensitive data)
    const accounts: SocialMediaAccount[] = credentials.map(cred => ({
      platform: cred.platform,
      username: cred.username,
      userId: cred.userId_platform,
      connectedAt: cred.connectedAt,
      lastUsed: cred.lastUsed,
      isExpired: cred.tokenExpiry ? new Date(cred.tokenExpiry) < new Date() : false
    }));
    
    return NextResponse.json({ accounts });
  } catch (error) {
    console.error('Error fetching social accounts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch social accounts' },
      { status: 500 }
    );
  }
}