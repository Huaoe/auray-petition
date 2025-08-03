/**
 * Utility functions for environment-related checks
 */

/**
 * Checks if the current environment is development
 * @returns boolean indicating if the current environment is development
 */
export const isDevelopment = (): boolean => {
  return process.env.NODE_ENV === 'development';
};

/**
 * Middleware function to restrict access to development environment only
 * @returns Response with 403 status if not in development environment
 */
export const requireDevelopmentEnv = () => {
  if (!isDevelopment()) {
    return new Response('Access denied. This route is only available in development environment.', {
      status: 403,
    });
  }
  return null;
};