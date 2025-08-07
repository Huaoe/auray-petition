# Testing the Infinite Scrolling Gallery

This document provides instructions for testing the infinite scrolling functionality in the dedicated gallery page.

## Prerequisites

1. Make sure the development server is running:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

2. Navigate to the gallery page in your browser:
   ```
   http://localhost:3000/gallery
   ```

## Test Cases

### Test Case 1: Initial Load

1. When you first load the page, you should see the gallery section with 12 transformation cards.
2. Each card should display:
   - An image
   - The transformation type name
   - A description
   - Category badge
   - Creation date
   - Like, comment, and share counts

### Test Case 2: Infinite Scrolling

1. Scroll down to the bottom of the page until you see the last transformation card.
2. As you approach the bottom, you should see loading skeletons appear.
3. After a brief moment, 12 more transformation cards should load automatically.
4. Continue scrolling to verify that more transformations load as you reach the bottom.

### Test Case 3: End of Content

1. Continue scrolling until you've loaded all available transformations.
2. Once all transformations are loaded, you should see a message: "Vous avez vu toutes les transformations".
3. No more loading skeletons should appear.

### Test Case 4: Error Handling

To test error handling, you can temporarily modify the API endpoint to return an error:

1. Open `src/app/api/transformations/route.ts`
2. Add a line to throw an error in the GET function:
   ```typescript
   export async function GET(request: NextRequest) {
     try {
       // Uncomment the next line to test error handling
       // throw new Error("Test error");
       
       // Rest of the function...
     }
   }
   ```
3. Refresh the page and verify that an error message is displayed with a "Réessayer" button.
4. Click the "Réessayer" button to verify that it attempts to load the transformations again.
5. Remember to remove the test error line when you're done testing.

### Test Case 5: Navigation to Transformation Details

1. Click on any transformation card in the gallery.
2. You should be navigated to the transformation detail page for that specific transformation.
3. Verify that the URL matches the pattern: `/transformation/[id]` where `[id]` is the ID of the transformation.

### Test Case 6: Navigation Back to Transformations Page

1. Click on the "Retour aux Transformations" link at the top of the page.
2. You should be navigated back to the main transformations page.
3. Verify that the URL is `/transformations`.

## Browser Compatibility

Test the infinite scrolling functionality in different browsers to ensure cross-browser compatibility:
- Chrome
- Firefox
- Safari
- Edge

## Mobile Testing

Test the infinite scrolling functionality on mobile devices or using browser developer tools to simulate mobile devices:
1. Open developer tools (F12 or right-click > Inspect)
2. Toggle device toolbar (mobile icon)
3. Select different device sizes
4. Verify that the gallery layout adjusts responsively
5. Test scrolling behavior on touch devices

## Performance Considerations

- Monitor network requests in the browser's developer tools to ensure that transformations are loaded efficiently
- Check for any memory leaks by observing memory usage in the browser's performance tab while scrolling through many transformations
- Verify that the UI remains responsive even after loading many transformations

## Conclusion

If all test cases pass, the infinite scrolling functionality is working as expected. If any issues are found, check the browser console for errors and review the implementation of the TransformationGallery component.