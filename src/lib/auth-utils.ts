import { randomBytes, createHash } from 'crypto';

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
 */
export function generateState() {
  return randomBytes(16).toString('hex');
}