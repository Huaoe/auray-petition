// Types for the Unsplash API responses
interface UnsplashImage {
  id: string;
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  alt_description: string;
  description: string;
  user: {
    name: string;
    username: string;
    links?: {
      html?: string;
    };
  };
  links?: {
    html?: string;
    download?: string;
  };
}

interface UnsplashSearchResponse {
  results: UnsplashImage[];
  total: number;
  total_pages: number;
}

/**
 * Service for interacting with the Unsplash API
 */
export class UnsplashPhotoService {
  private accessKey: string;
  private baseUrl = 'https://api.unsplash.com';

  constructor(accessKey: string) {
    this.accessKey = accessKey;
  }

  /**
   * Search for images based on a query
   * @param query Search query
   * @param limit Maximum number of results to return
   * @param retryCount Number of retries attempted (for internal use)
   * @returns Array of image results
   */
  async searchImages(query: string, limit: number = 1, retryCount: number = 0): Promise<UnsplashImage[]> {
    try {
      // Build URL with query parameters
      const url = new URL(`${this.baseUrl}/search/photos`);
      url.searchParams.append('query', query);
      url.searchParams.append('per_page', limit.toString());
      url.searchParams.append('orientation', 'landscape');
      
      // Add a random parameter to avoid caching issues
      url.searchParams.append('_', Date.now().toString());
      
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Authorization': `Client-ID ${this.accessKey}`,
          'Accept-Version': 'v1', // Specify API version
        },
      });
      
      // Handle rate limiting specifically
      if (response.status === 403 || response.status === 429) {
        if (retryCount < 3) {
          console.log(`Rate limited (${response.status}). Retrying in ${(retryCount + 1) * 2} seconds...`);
          // Exponential backoff: wait longer with each retry
          await new Promise(resolve => setTimeout(resolve, (retryCount + 1) * 2000));
          return this.searchImages(query, limit, retryCount + 1);
        } else {
          console.error(`Rate limiting persists after ${retryCount} retries. Aborting.`);
          // Return empty array instead of throwing to allow processing to continue
          return [];
        }
      }
      
      if (!response.ok) {
        throw new Error(`Unsplash API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json() as UnsplashSearchResponse;
      return data.results;
    } catch (error) {
      console.error('Error searching Unsplash images:', error);
      // Return empty array instead of throwing to allow processing to continue
      return [];
    }
  }

  /**
   * Get a single image URL for a location
   * @param locationName Name of the location
   * @param description Description of the location
   * @returns URL of the best matching image
   */
  async getImageForLocation(locationName: string, description: string): Promise<string | null> {
    try {
      // Create a search query based on location name and key features
      const searchQuery = `${locationName} ${description.split(' ').slice(0, 5).join(' ')}`;
      
      const images = await this.searchImages(searchQuery);
      
      if (images && images.length > 0) {
        // Return the regular sized image
        return images[0].urls.regular;
      }
      
      return null;
    } catch (error) {
      console.error(`Error getting image for location ${locationName}:`, error);
      return null;
    }
  }
}

// Create a singleton instance with the API key from environment variables
export const unsplashService = new UnsplashPhotoService(process.env.UNSPLASH_ACCESS_KEY || '');