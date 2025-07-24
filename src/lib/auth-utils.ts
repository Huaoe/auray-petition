import { randomBytes, createHash } from 'crypto';

/**
 * Represents the structure of the decoded state parameter
 */
export interface StateData {
  /** The original random state value for CSRF protection */
  state: string;
  /** The URL to return to after authentication */
  returnUrl?: string;
}

/**
 * Generates a secure, random string suitable for a PKCE code verifier.
 */
export function generateCodeVerifier() {
  return randomBytes(32).toString('hex');
}

/**
 * Creates a PKCE code challenge from a code verifier.
 * @param verifier The code verifier string.
 * @returns The Base64-URL-encoded SHA-256 hash of the verifier.
 */
export function generateCodeChallenge(verifier: string) {
  return createHash('sha256')
    .update(verifier)
    .digest('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

/**
 * Generates a secure, random string for the OAuth state parameter.
 * Optionally encodes a return URL into the state parameter.
 *
 * @param returnUrl Optional URL to return to after authentication
 * @returns A state string that can be used for OAuth
 */
export function generateState(returnUrl?: string) {
  const randomState = randomBytes(16).toString('hex');
  
  if (!returnUrl) {
    return randomState;
  }
  
  return encodeState({
    state: randomState,
    returnUrl
  });
}

/**
 * Encodes state data into a single string that can be used as an OAuth state parameter.
 *
 * @param stateData The state data to encode
 * @returns Base64 encoded state string
 */
export function encodeState(stateData: StateData): string {
  const jsonString = JSON.stringify(stateData);
  return Buffer.from(jsonString).toString('base64');
}

/**
 * Decodes a state parameter back into its components.
 *
 * @param encodedState The encoded state string from OAuth callback
 * @returns The decoded state data or null if invalid
 */
export function decodeState(encodedState: string): StateData | null {
  try {
    const jsonString = Buffer.from(encodedState, 'base64').toString();
    return JSON.parse(jsonString) as StateData;
  } catch (error) {
    // If the state is not in the expected format, return null
    return null;
  }
}