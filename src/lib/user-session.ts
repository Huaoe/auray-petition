import { v4 as uuidv4 } from 'uuid';
import { cookies } from 'next/headers';
import { getCookie, setCookie } from 'cookies-next';

const USER_ID_COOKIE = 'church_transformation_user_id';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year in seconds

/**
 * Generate a new unique user ID
 */
export const generateUserId = (): string => {
  return uuidv4();
};

/**
 * Get the user ID from cookies on the client side
 * If no user ID exists, create one and store it in a cookie
 */
export const getUserId = (): string => {
  if (typeof window === 'undefined') {
    throw new Error('getUserId() should only be called on the client side');
  }

  let userId = getCookie(USER_ID_COOKIE) as string | undefined;

  if (!userId) {
    userId = generateUserId();
    setCookie(USER_ID_COOKIE, userId, {
      maxAge: COOKIE_MAX_AGE,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
  }

  return userId;
};

/**
 * Get the user ID from cookies on the server side
 * Returns null if no user ID exists
 */
export const getUserIdServer = (): string | null => {
  const cookieStore = cookies();
  const userId = cookieStore.get(USER_ID_COOKIE)?.value;
  return userId || null;
};

/**
 * Set the user ID in cookies on the server side
 */
export const setUserIdServer = (userId: string): void => {
  const cookieStore = cookies();
  cookieStore.set(USER_ID_COOKIE, userId, {
    maxAge: COOKIE_MAX_AGE,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
  });
};

/**
 * Get or create a user ID on the server side
 * If no user ID exists, create one and store it in a cookie
 */
export const getOrCreateUserIdServer = (): string => {
  const userId = getUserIdServer();
  if (userId) {
    return userId;
  }

  const newUserId = generateUserId();
  setUserIdServer(newUserId);
  return newUserId;
};