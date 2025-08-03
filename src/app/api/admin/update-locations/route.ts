import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { unsplashService } from "@/lib/unsplash-service";
import { FAMOUS_LOCATIONS } from "@/lib/famous-locations";
import { FamousLocation } from "@/lib/church-transformation-types";
import { requireDevelopmentEnv } from "@/lib/env-utils";

// This is a server-side only API route
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  // Check if we're in development environment
  const devEnvCheck = requireDevelopmentEnv();
  if (devEnvCheck) {
    return devEnvCheck;
  }

  try {
    // Parse request body to get startIndex if provided
    const requestData = await request.json().catch(() => ({}));
    const startIndex = requestData.startIndex || 0;

    // Make sure we have an API key
    if (!process.env.UNSPLASH_ACCESS_KEY) {
      return NextResponse.json(
        {
          success: false,
          error: "UNSPLASH_ACCESS_KEY environment variable is not set",
        },
        { status: 500 }
      );
    }

    // Create a deep copy of the locations to modify
    const updatedLocations: Record<string, FamousLocation[]> = JSON.parse(
      JSON.stringify(FAMOUS_LOCATIONS)
    );

    // Keep track of progress
    let totalLocations = 0;
    let updatedCount = 0;
    let processedCount = 0;
    let globalIndex = 0;

    // Count total locations
    Object.values(FAMOUS_LOCATIONS).forEach((locations) => {
      totalLocations += locations.length;
    });

    console.log(`Starting from index ${startIndex}/${totalLocations}`);

    // Process each category and location
    for (const [category, locations] of Object.entries(updatedLocations)) {
      console.log(
        `Processing category: ${category} (${locations.length} locations)`
      );

      for (let i = 0; i < locations.length; i++) {
        const location = locations[i];

        // Skip locations before the starting index
        if (globalIndex < startIndex) {
          globalIndex++;
          continue;
        }

        processedCount++;

        try {
          console.log(
            `[${globalIndex + 1}/${totalLocations}] Updating ${location.name}...`
          );

          // Create a search query based on location name and key features
          const searchQuery = `${location.name} ${location.architecturalStyle} ${location.keyFeatures.slice(0, 2).join(" ")}`;

          // Get image URL from Unsplash API
          const images = await unsplashService.searchImages(searchQuery);

          if (images && images.length > 0) {
            // Update the image URL with the regular sized image
            location.imageUrl = images[0].urls.regular;
            console.log(`  ✓ Updated with image: ${images[0].urls.regular}`);
            updatedCount++;
          } else {
            console.log(`  ✗ No images found for ${location.name}`);
          }

          // Add a longer delay to avoid rate limiting (Unsplash has strict limits)
          await new Promise((resolve) => setTimeout(resolve, 1000));
        } catch (error) {
          console.error(`  ✗ Error updating ${location.name}:`, error);
        } finally {
          // Increment global index regardless of success/failure
          globalIndex++;
        }
      }
    }

    // Generate the updated file content
    const fileContent = `import { FamousLocation } from "./church-transformation-types";

export const FAMOUS_LOCATIONS: Record<string, FamousLocation[]> = ${JSON.stringify(updatedLocations, null, 2)};
`;

    // Write the updated content back to the file
    const filePath = path.resolve(process.cwd(), "src/lib/famous-locations.ts");
    fs.writeFileSync(filePath, fileContent, "utf8");

    console.log(`\nSuccessfully wrote updated locations to ${filePath}`);

    return NextResponse.json({
      success: true,
      updatedCount,
      totalCount: totalLocations,
      processedCount,
      currentIndex: globalIndex,
      message: `Successfully updated ${updatedCount} out of ${totalLocations} locations. Processed ${processedCount} locations. Resume from index ${globalIndex} next time.`,
    });
  } catch (error) {
    console.error("Error updating locations:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
