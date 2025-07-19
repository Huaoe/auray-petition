import { NextRequest, NextResponse } from "next/server";
import { validateAIConfig } from "@/lib/ai-config";

export async function GET(request: NextRequest) {
  try {
    // Check if API key exists
    const apiKeyExists = !!process.env.STABILITY_API_KEY;
    const apiKeyLength = process.env.STABILITY_API_KEY?.length || 0;
    
    // Check for common formatting issues
    const apiKey = process.env.STABILITY_API_KEY || "";
    const hasQuotes = apiKey.includes('"') || apiKey.includes("'");
    const hasSpaces = apiKey.trim() !== apiKey;
    const startsWithBearer = apiKey.toLowerCase().startsWith("bearer");
    
    // Validate configuration
    let configValid = false;
    let configError = "";
    try {
      validateAIConfig();
      configValid = true;
    } catch (error) {
      configError = error instanceof Error ? error.message : "Unknown error";
    }
    
    // Test API connection (without making actual request)
    const apiKeyPreview = apiKeyExists 
      ? `${apiKey.substring(0, 8)}...${apiKey.substring(apiKey.length - 4)}`
      : "NOT_SET";
    
    return NextResponse.json({
      status: "debug",
      checks: {
        apiKeyExists,
        apiKeyLength,
        apiKeyPreview,
        hasQuotes,
        hasSpaces,
        startsWithBearer,
        configValid,
        configError,
      },
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
      recommendations: [
        !apiKeyExists && "Set STABILITY_API_KEY environment variable",
        hasQuotes && "Remove quotes from API key",
        hasSpaces && "Remove leading/trailing spaces from API key",
        startsWithBearer && "Remove 'Bearer' prefix from API key (it's added automatically)",
        apiKeyLength < 20 && apiKeyExists && "API key seems too short",
        apiKeyLength > 200 && "API key seems too long",
      ].filter(Boolean),
    });
  } catch (error) {
    return NextResponse.json(
      { 
        error: "Debug endpoint error",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}