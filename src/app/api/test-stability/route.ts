import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Test 1: Check if API key exists
    const apiKeyExists = !!process.env.STABILITY_API_KEY;
    const apiKey = process.env.STABILITY_API_KEY || "";
    
    // Test 2: Check for common formatting issues
    const hasQuotes = apiKey.includes('"') || apiKey.includes("'");
    const hasSpaces = apiKey.trim() !== apiKey;
    const startsWithBearer = apiKey.toLowerCase().startsWith("bearer");
    const apiKeyLength = apiKey.length;
    
    // Test 3: Make a simple API call to verify the key works
    let apiTestResult = "Not tested";
    let apiTestError = "";
    
    if (apiKeyExists && !hasQuotes && !hasSpaces && !startsWithBearer) {
      try {
        // Test with a simple GET request to check API key validity
        const testResponse = await fetch("https://api.stability.ai/v1/user/account", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Accept": "application/json"
          }
        });
        
        if (testResponse.ok) {
          apiTestResult = "API key is valid ✅";
        } else {
          const errorText = await testResponse.text();
          apiTestResult = `API key test failed: ${testResponse.status}`;
          apiTestError = errorText;
        }
      } catch (error) {
        apiTestResult = "Network error during API test";
        apiTestError = error instanceof Error ? error.message : "Unknown error";
      }
    }
    
    // Generate recommendations
    const issues = [];
    if (!apiKeyExists) issues.push("❌ STABILITY_API_KEY environment variable is not set");
    if (hasQuotes) issues.push("❌ API key contains quotes - remove them");
    if (hasSpaces) issues.push("❌ API key has leading/trailing spaces - trim them");
    if (startsWithBearer) issues.push("❌ API key starts with 'Bearer' - remove this prefix");
    if (apiKeyLength < 20 && apiKeyExists) issues.push("⚠️ API key seems too short");
    if (apiKeyLength > 200) issues.push("⚠️ API key seems too long");
    
    // Provide setup instructions if needed
    const setupInstructions = !apiKeyExists ? [
      "1. Go to https://platform.stability.ai/account/keys",
      "2. Create a new API key",
      "3. Add to your .env.local file: STABILITY_API_KEY=your_key_here",
      "4. Restart your Next.js server",
      "5. In production (Vercel), add the environment variable in project settings"
    ] : [];
    
    return NextResponse.json({
      status: "Stability AI Configuration Test",
      environment: process.env.NODE_ENV,
      checks: {
        apiKeyExists,
        apiKeyLength,
        hasQuotes,
        hasSpaces,
        startsWithBearer,
        apiKeyPreview: apiKeyExists 
          ? `${apiKey.substring(0, 8)}...${apiKey.substring(Math.max(0, apiKey.length - 4))}`
          : "NOT_SET"
      },
      apiTest: {
        result: apiTestResult,
        error: apiTestError
      },
      issues,
      setupInstructions,
      timestamp: new Date().toISOString()
    }, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store'
      }
    });
    
  } catch (error) {
    return NextResponse.json(
      { 
        error: "Test endpoint error",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}