# Unsplash API Integration

This document explains how to use the Unsplash API integration in the project.

## Overview

The system allows you to:

1. Search for images using the Unsplash API
2. Update the famous-locations.ts file with actual image URLs from Unsplash
3. Test the API integration through a simple admin interface

## Setup

### 1. Get an Unsplash API Key

1. Go to the [Unsplash Developer Portal](https://unsplash.com/developers)
2. Create an account and register a new application
3. Obtain your access key
4. Add the access key to your `.env.local` file:

```
UNSPLASH_ACCESS_KEY=your_unsplash_access_key_here
```

### 2. Access the Admin Interface

The admin interface is available at:

- `/admin` - Main admin dashboard
- `/admin/unsplash-test` - Test the Unsplash API by searching for images
- `/admin/update-locations` - Update all location images in the famous-locations.ts file

## Components

### API Service

The `unsplash-service.ts` file contains the service for interacting with the Unsplash API. It provides methods for:

- Searching for images based on a query
- Getting a single image URL for a location

### API Routes

- `/api/unsplash/search` - Search for images using the Unsplash API
- `/api/admin/update-locations` - Update all location images in the famous-locations.ts file

### Update Script

The `scripts/update-location-images.ts` file contains a script that can be run to update all location images in the famous-locations.ts file. This script can be run from the command line:

```bash
# Start from the beginning
npx ts-node scripts/update-location-images.ts

# Resume from index 49
npx ts-node scripts/update-location-images.ts 49
```

Or through the admin interface at `/admin/update-locations`.

## Usage Examples

### Searching for Images

```typescript
import { unsplashService } from '@/lib/unsplash-service';

// Search for images
const images = await unsplashService.searchImages('Trinity College Library Dublin');

// Get a single image URL for a location
const imageUrl = await unsplashService.getImageForLocation(
  'Trinity College Library',
  'The Long Room with its barrel-vaulted ceiling and towering oak shelves'
);
```

### Updating a Single Location

```typescript
import { unsplashService } from '@/lib/unsplash-service';
import { FAMOUS_LOCATIONS } from '@/lib/famous-locations';

// Get a location
const location = FAMOUS_LOCATIONS.library[0];

// Create a search query based on location name and key features
const searchQuery = `${location.name} ${location.architecturalStyle} ${location.keyFeatures.slice(0, 2).join(' ')}`;

// Get image URL from Unsplash API
const images = await unsplashService.searchImages(searchQuery);

if (images && images.length > 0) {
  // Update the image URL with the regular sized image
  location.imageUrl = images[0].urls.regular;
  console.log(`Updated with image: ${images[0].urls.regular}`);
}
```

## Troubleshooting

### API Key Issues

If you're getting authentication errors, make sure:

1. Your access key is correctly set in the `.env.local` file
2. Your access key is active and has the correct permissions
3. You're not exceeding the API rate limits

### Image Quality

The Unsplash API provides different image sizes. The system is configured to use the 'regular' size, which is suitable for most use cases. If you need higher quality images, you can use the 'full' or 'raw' sizes instead.

### Rate Limiting

The Unsplash API has rate limits. If you're making many requests in a short period, you may hit these limits. The update script includes a small delay between requests to avoid this.

## Resources

- [Unsplash API Documentation](https://unsplash.com/documentation)
- [Unsplash Developer Portal](https://unsplash.com/developers)