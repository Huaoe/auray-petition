import { NextRequest, NextResponse } from "next/server";
import { getTransformationById } from "../../../../lib/transformation-utils";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { error: "Transformation ID is required" },
        { status: 400 }
      );
    }

    const transformation = await getTransformationById(id);
    
    if (!transformation) {
      return NextResponse.json(
        { error: "Transformation not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(transformation);
  } catch (error) {
    console.error("Error fetching transformation:", error);
    return NextResponse.json(
      { error: "Failed to fetch transformation" },
      { status: 500 }
    );
  }
}