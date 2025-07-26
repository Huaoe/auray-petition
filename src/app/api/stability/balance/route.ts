import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const apiKey = process.env.STABILITY_API_KEY;
    
    if (!apiKey) {
      console.error('❌ Stability API key not configured');
      return NextResponse.json(
        { 
          success: false,
          error: 'Stability API key not configured',
          balance: 0 
        },
        { status: 500 }
      );
    }

    // console.log('🔍 Fetching Stability balance...');
    const response = await fetch('https://api.stability.ai/v1/user/balance', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/json',
        'Stability-Client-ID': 'church-transformation-app',
        'Stability-Client-Version': '1.0.0',
      },
    });

    if (!response.ok) {
      console.error('❌ Stability API HTTP error:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('❌ Stability API error response:', errorText);
      
      return NextResponse.json(
        { 
          success: false,
          error: `Stability API error: ${response.status} - ${errorText}`,
          balance: 0 
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    // console.log('✅ Stability API success:', data);
    
    // L'endpoint /v1/user/balance retourne directement le solde en crédits
    return NextResponse.json({
      success: true,
      balance: data.credits || 0,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Error fetching Stability balance:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        balance: 0 
      },
      { status: 500 }
    );
  }
}

