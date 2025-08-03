import { NextRequest, NextResponse } from 'next/server';
import { unsplashService } from '@/lib/unsplash-service';
import { requireDevelopmentEnv } from '@/lib/env-utils';

export async function GET(request: NextRequest) {
  // Check if we're in development environment
  const devEnvCheck = requireDevelopmentEnv();
  if (devEnvCheck) {
    return devEnvCheck;
  }

  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('query');
  
  if (!query) {
    return NextResponse.json(
      { error: 'Query parameter is required' },
      { status: 400 }
    );
  }
  
  try {
    const images = await unsplashService.searchImages(query);
    return NextResponse.json({ images });
  } catch (error) {
    console.error('Error in Unsplash search API:', error);
    return NextResponse.json(
      { error: 'Failed to search for images' },
      { status: 500 }
    );
  }
}