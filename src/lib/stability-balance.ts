export async function getStabilityBalance(): Promise<number> {
  try {
    const apiKey = process.env.STABILITY_API_KEY;
    if (!apiKey) {
      throw new Error('Stability API key not configured');
    }

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
      throw new Error(`Stability API error: ${response.status}`);
    }

    const data = await response.json();
    return data.credits || 0;
  } catch (error) {
    console.error('❌ Error fetching Stability balance:', error);
    return 0;
  }
}