import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    // Tester différents endpoints possibles
    const endpoints = [
      'https://api.stability.ai/v1/pricing',
      'https://api.stability.ai/v1/models/pricing',
      'https://api.stability.ai/v1/user/usage'
    ];
    
    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint, {
          headers: {
            'Authorization': `Bearer ${process.env.STABILITY_API_KEY}`,
            'Accept': 'application/json'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          return NextResponse.json({ endpoint, data });
        }
      } catch (e) {
        // Continue to next endpoint
      }
    }
    
    return NextResponse.json({ error: 'No pricing endpoint found' });
  } catch (error) {
    return NextResponse.json({ error: error.message });
  }
}
