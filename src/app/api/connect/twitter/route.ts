import { NextResponse } from 'next/server';
import { URLSearchParams } from 'url';
import { cookies } from 'next/headers';
import {
  generateCodeChallenge,
  generateCodeVerifier,
  generateState,
} from '@/lib/auth-utils';

export async function GET() {
  const twitterClientId = process.env.TWITTER_CLIENT_ID;

  if (!twitterClientId) {
    return new NextResponse('Twitter client ID not configured', { status: 500 });
  }

  const state = generateState();
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = generateCodeChallenge(codeVerifier);

  const cookieStore = await cookies();
  cookieStore.set('twitter_oauth_state', state, {
    path: '/',
    maxAge: 60 * 15, // 15 minutes
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  });

  cookieStore.set('twitter_code_verifier', codeVerifier, {
    path: '/',
    maxAge: 60 * 15, // 15 minutes
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  });

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: twitterClientId,
    redirect_uri: `${process.env.NEXT_PUBLIC_SITE_URL}/api/connect/twitter/callback`,
    scope: 'tweet.read tweet.write users.read offline.access',
    state: state,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
  });

  const twitterAuthUrl = `https://twitter.com/i/oauth2/authorize?${params.toString()}`;

  return NextResponse.redirect(twitterAuthUrl);
}