import fs from "fs";
import path from "path";
import { unsplashService } from "../src/lib/unsplash-service";
import { FAMOUS_LOCATIONS } from "../src/lib/famous-locations";
import { FamousLocation } from "../src/lib/church-transformation-types";

/**
 * Updates the famous-locations.ts file with actual image URLs from the Unsplash API
 * @param startIndex Optional index to start from (for resuming after rate limit)
 */
async function updateLocationImages(startIndex: number = 0) {
  // Make sure we have an API key
  if (!process.env.UNSPLASH_ACCESS_KEY) {
    console.error("Error: UNSPLASH_ACCESS_KEY environment variable is not set");
    process.exit(1);
  }

  console.log(`Starting to update location images from index ${startIndex}...`);

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

  console.log(`Found ${totalLocations} locations to update`);

  if (startIndex > 0) {
    console.log(`Skipping first ${startIndex} locations...`);
  }

  // Process each category and location
  for (const [category, locations] of Object.entries(updatedLocations)) {
    console.log(
      `Processing category: ${category} (${locations.length} locations)`
    );
    try {
      for (let i = 0; i < locations.length; i++) {
        const location = locations[i];

        // Skip locations before the starting index
        if (globalIndex < startIndex) {
          globalIndex++;
          continue;
        }

        processedCount++;

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
          break;
        }

        // Add a longer delay to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Increment global index regardless of success/failure
        globalIndex++;
      }
    } catch (err) {
      if (err instanceof Error && err.message.includes("Rate")) {
        break;
      } else console.error(`  ✗ Error updating`, err);
    }
  }

  console.log(`\nUpdated ${updatedCount} out of ${totalLocations} locations`);
  console.log(`Processed ${processedCount} locations in this run`);
  console.log(`Current index: ${globalIndex} (use this to resume next time)`);

  // Generate the updated file content
  const fileContent = `import { FamousLocation } from "./church-transformation-types";

export const FAMOUS_LOCATIONS: Record<string, FamousLocation[]> = ${JSON.stringify(updatedLocations, null, 2)};
`;

  // Write the updated content back to the file
  const filePath = path.resolve(__dirname, "../src/lib/famous-locations.ts");
  fs.writeFileSync(filePath, fileContent, "utf8");

  console.log(`\nSuccessfully wrote updated locations to ${filePath}`);
}

// Parse command line arguments
const args = process.argv.slice(2);
let startIndex = 0;

// Check if a starting index was provided
if (args.length > 0) {
  const parsedIndex = parseInt(args[0]);
  if (!isNaN(parsedIndex) && parsedIndex >= 0) {
    startIndex = parsedIndex;
  } else {
    console.error("Invalid start index. Using 0 as default.");
  }
}

// Run the script with the provided or default start index
updateLocationImages(startIndex).catch((error) => {
  console.error("Error running script:", error);
  process.exit(1);
});
