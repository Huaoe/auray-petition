import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const imageUrl = searchParams.get('url');
    const filename = searchParams.get('filename') || 'download.jpg';

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'Image URL is required' },
        { status: 400 }
      );
    }

    console.log('🔍 [API] Download request:', { imageUrl, filename });

    // Fetch the image from the URL
    const imageResponse = await fetch(imageUrl);
    
    if (!imageResponse.ok) {
      console.error('❌ [API] Failed to fetch image:', imageResponse.status);
      return NextResponse.json(
        { error: `Failed to fetch image: ${imageResponse.status}` },
        { status: imageResponse.status }
      );
    }

    // Get the image data as a buffer
    const imageBuffer = await imageResponse.arrayBuffer();
    
    console.log('✅ [API] Image fetched successfully, size:', imageBuffer.byteLength);

    // Create response with appropriate headers for download
    const response = new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': imageResponse.headers.get('content-type') || 'image/jpeg',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': imageBuffer.byteLength.toString(),
        // Cache for 1 hour
        'Cache-Control': 'public, max-age=3600',
      },
    });

    return response;
  } catch (error) {
    console.error('❌ [API] Download error:', error);
    return NextResponse.json(
      { error: 'Failed to download image', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}