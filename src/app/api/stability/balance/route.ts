import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const apiKey = process.env.STABILITY_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Stability API key not configured' },
        { status: 500 }
      );
    }

    const response = await fetch('https://api.stability.ai/v1/user/account', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Stability API error: ${response.status}`);
    }

    const data = await response.json();
    
    return NextResponse.json({
      success: true,
      balance: data.credits,
      email: data.email,
      id: data.id,
      profile_picture: data.profile_picture,
      payment_due: data.payment_due
    });

  } catch (error) {
    console.error('Error fetching Stability balance:', error);
    return NextResponse.json(
      { error: 'Failed to fetch balance' },
      { status: 500 }
    );
  }
}