import { NextResponse } from 'next/server';
import { initializeSocialMediaSheet } from '@/lib/socialMediaStorage';

export async function POST() {
  try {
    const result = await initializeSocialMediaSheet();
    
    if (result.success) {
      return NextResponse.json({ 
        success: true, 
        message: 'Social media sheet initialized successfully' 
      });
    } else {
      return NextResponse.json({ 
        success: false, 
        error: result.message 
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Manual initialization error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}