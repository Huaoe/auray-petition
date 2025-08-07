import { NextRequest, NextResponse } from "next/server";
import { getTransformations } from "@/lib/transformation-utils";

export async function GET(request: NextRequest) {
  try {
    // Get pagination parameters from query string
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    // Validate pagination parameters
    if (isNaN(page) || page < 1) {
      return NextResponse.json(
        { error: "Invalid page parameter" },
        { status: 400 }
      );
    }

    if (isNaN(limit) || limit < 1 || limit > 50) {
      return NextResponse.json(
        { error: "Invalid limit parameter. Must be between 1 and 50" },
        { status: 400 }
      );
    }

    // Get transformations with pagination
    const result = await getTransformations(page, limit);

    // Return the result
    return NextResponse.json({
      transformations: result.transformations,
      pagination: {
        page,
        limit,
        totalCount: result.totalCount,
        hasMore: result.hasMore,
        totalPages: Math.ceil(result.totalCount / limit)
      }
    });
  } catch (error) {
    console.error("Error fetching transformations:", error);
    return NextResponse.json(
      { error: "Failed to fetch transformations" },
      { status: 500 }
    );
  }
}