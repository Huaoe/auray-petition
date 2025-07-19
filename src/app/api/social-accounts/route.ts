import { NextRequest, NextResponse } from 'next/server';
import { getUserSocialMediaCredentials } from '@/lib/socialMediaStorage';
import { SocialMediaAccount } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId') || 'current_user';
    
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