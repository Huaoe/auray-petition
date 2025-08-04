import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { storeSocialMediaCredential, initializeSocialMediaSheet } from "@/lib/socialMediaStorage";
import { getOrCreateUserIdServer } from "@/lib/user-session";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");

    console.log("LinkedIn callback received:", {
      code: !!code,
      state: !!state,
      error,
    });

    if (error) {
      console.error("LinkedIn OAuth error:", error);
      return NextResponse.redirect(
        new URL(
          "/settings/social-media?error=linkedin_auth_failed",
          request.url
        )
      );
    }

    if (!code || !state) {
      console.error("LinkedIn callback missing parameters");
      return NextResponse.redirect(
        new URL("/settings/social-media?error=missing_parameters", request.url)
      );
    }

    // Verify state parameter
    const cookieStore = await cookies();
    const storedState = cookieStore.get("linkedin_oauth_state")?.value;

    if (!storedState || storedState !== state) {
      console.error("LinkedIn state mismatch");
      return NextResponse.redirect(
        new URL("/settings/social-media?error=invalid_state", request.url)
      );
    }

    // Exchange authorization code for access token
    const tokenResponse = await fetch(
      "https://www.linkedin.com/oauth/v2/accessToken",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          code: code,
          redirect_uri: `${process.env.NEXT_PUBLIC_SITE_URL}/api/connect/linkedin/callback`,
          client_id: process.env.LINKEDIN_CLIENT_ID!,
          client_secret: process.env.LINKEDIN_CLIENT_SECRET!,
        }),
      }
    );

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      console.error("LinkedIn token exchange failed:", errorData);
      return NextResponse.redirect(
        new URL(
          "/settings/social-media?error=token_exchange_failed",
          request.url
        )
      );
    }

    const tokenData = await tokenResponse.json();
    const { access_token, expires_in } = tokenData;
    console.log("access otken :", access_token);
    if (!access_token) {
      console.error("No access token received from LinkedIn");
      return NextResponse.redirect(
        new URL("/settings/social-media?error=no_access_token", request.url)
      );
    }

    // Get user information from LinkedIn using v2/userinfo endpoint (requires openid scope)
    const userResponse = await fetch(
      "https://api.linkedin.com/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    if (!userResponse.ok) {
      const errorText = await userResponse.text();
      console.error("Failed to fetch LinkedIn user info:", {
        status: userResponse.status,
        statusText: userResponse.statusText,
        error: errorText
      });
      return NextResponse.redirect(
        new URL("/settings/social-media?error=user_info_failed", request.url)
      );
    }

    const userData = await userResponse.json();
    console.log("LinkedIn userinfo data received:", userData);
    
    // Extract user info from userinfo endpoint response
    // The userinfo endpoint returns data in OpenID Connect format
    let userName = userData.name || "LinkedIn User";
    let linkedinUserId = userData.sub; // OpenID Connect uses 'sub' for the user ID
    
    console.log("LinkedIn user info extracted:", {
      name: userName,
      id: linkedinUserId,
    });

    // Store the credentials securely
    const userId = await getOrCreateUserIdServer(); // Get or create user ID on the server side
    await storeSocialMediaCredential({
      userId,
      platform: "linkedin",
      accessToken: access_token,
      refreshToken: undefined, // LinkedIn doesn't provide refresh tokens in this flow
      tokenExpiry: expires_in
        ? new Date(Date.now() + expires_in * 1000).toISOString()
        : undefined,
      username: userName,
      userId_platform: linkedinUserId, // Using 'sub' from OpenID Connect response
      connectedAt: new Date().toISOString(),
    });

    // Initialize social media sheet if needed
    await initializeSocialMediaSheet();

    // Clean up cookies
    cookieStore.delete("linkedin_oauth_state");

    console.log("✅ LinkedIn credentials stored successfully");
    
    // Get returnUrl from cookie
    const returnUrlCookie = cookieStore.get("linkedin_return_url");
    const returnUrl = returnUrlCookie?.value || "/share-post";
    
    // Clean up returnUrl cookie
    cookieStore.delete("linkedin_return_url");
    
    return NextResponse.redirect(
      new URL(
        `${returnUrl}?success=linkedin_connected&platform=linkedin`,
        request.url
      )
    );
  } catch (error) {
    console.error("LinkedIn OAuth callback error:", error);
    return NextResponse.redirect(
      new URL("/settings/social-media?error=callback_failed", request.url)
    );
  }
}
