import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { unsplashService } from "@/lib/unsplash-service";
import { utopieIdeas } from "@/lib/utopie-data";
import { UtopieIdea } from "@/lib/utopie-data";
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

    // Create a deep copy of the utopie ideas to modify
    const updatedUtopieIdeas: UtopieIdea[] = JSON.parse(
      JSON.stringify(utopieIdeas)
    );

    // Keep track of progress
    let totalExamples = 0;
    let updatedCount = 0;
    let processedCount = 0;
    let globalIndex = 0;

    // Count total examples
    updatedUtopieIdeas.forEach((idea) => {
      idea.content.sections.forEach((section) => {
        if (section.examples) {
          totalExamples += section.examples.length;
        }
      });
    });

    console.log(`Starting from index ${startIndex}/${totalExamples}`);

    // Process each idea, section, and example
    for (const idea of updatedUtopieIdeas) {
      console.log(`Processing idea: ${idea.title}`);

      for (const section of idea.content.sections) {
        if (!section.examples || section.examples.length === 0) {
          continue;
        }

        console.log(`Processing section: ${section.title} (${section.examples.length} examples)`);

        for (let i = 0; i < section.examples.length; i++) {
          const example = section.examples[i];

          // Skip examples before the starting index
          if (globalIndex < startIndex) {
            globalIndex++;
            continue;
          }

          processedCount++;

          try {
            console.log(
              `[${globalIndex + 1}/${totalExamples}] Updating ${example.name}...`
            );

            // Skip if already has an image URL
            if (example.imageUrl) {
              console.log(`  ✓ Already has image: ${example.imageUrl}`);
              globalIndex++;
              continue;
            }

            // Create a search query based on example name and location
            const searchQuery = `${example.name} ${example.location} ${example.description.split(' ').slice(0, 5).join(' ')}`;

            // Get image URL from Unsplash API
            const images = await unsplashService.searchImages(searchQuery);

            if (images && images.length > 0) {
              // Update the image URL with the regular sized image
              example.imageUrl = images[0].urls.regular;
              console.log(`  ✓ Updated with image: ${images[0].urls.regular}`);
              updatedCount++;
            } else {
              console.log(`  ✗ No images found for ${example.name}`);
            }

            // Add a longer delay to avoid rate limiting (Unsplash has strict limits)
            await new Promise((resolve) => setTimeout(resolve, 1000));
          } catch (error) {
            console.error(`  ✗ Error updating ${example.name}:`, error);
          } finally {
            // Increment global index regardless of success/failure
            globalIndex++;
          }
        }
      }
    }

    // Generate the updated file content
    const fileContent = `import {
  Heart,
  Home,
  Briefcase,
  BookOpen,
  Utensils,
  Film,
  Leaf,
  Users,
  BrainCircuit,
  PartyPopper,
} from "lucide-react";

export interface UtopieIdea {
  slug: string;
  icon: string;
  title: string;
  shortDescription: string;
  quote?: {
    text: string;
    author: string;
  };
  inspiringImage?: {
    description: string;
    alt: string;
  };
  content: {
    sections: Array<{
      title: string;
      description: string;
      examples?: Array<{
        name: string;
        location: string;
        description: string;
        link?: string;
        imageUrl?: string;
      }>;
      links?: Array<{
        title: string;
        url: string;
        description: string;
      }>;
    }>;
  };
}

export const utopieIdeas: UtopieIdea[] = ${JSON.stringify(updatedUtopieIdeas, null, 2)};
`;

    // Write the updated content back to the file
    const filePath = path.resolve(process.cwd(), "src/lib/utopie-data.ts");
    fs.writeFileSync(filePath, fileContent, "utf8");

    console.log(`\nSuccessfully wrote updated utopie ideas to ${filePath}`);

    return NextResponse.json({
      success: true,
      updatedCount,
      totalCount: totalExamples,
      processedCount,
      currentIndex: globalIndex,
      message: `Successfully updated ${updatedCount} out of ${totalExamples} examples. Processed ${processedCount} examples. Resume from index ${globalIndex} next time.`,
    });
  } catch (error) {
    console.error("Error updating utopie examples:", error);
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