# 📱 Social Media Integration Plan

This document outlines the technical requirements and implementation plan for integrating social media sharing features into the application.

## 1. Platforms to Integrate

- **Instagram:** For sharing generated images.
- **Twitter / X:** For sharing text updates and images.
- **Facebook:** For sharing links, text, and images.
- **LinkedIn:** For professional-oriented sharing.

## 2. Research & API Requirements

This section will be populated with the findings for each platform's API.

### 2.1. Instagram

- **API Type:** Instagram Content Publishing API (part of the Graph API)
- **Authentication:** OAuth 2.0
- **Endpoints:**
  - `POST /{ig-user-id}/media`: To upload a photo or video.
  - `POST /{ig-user-id}/media_publish`: To publish the uploaded media.
- **Permissions/Scopes:**
  - `instagram_basic`
  - `instagram_content_publish`
  - `pages_show_list`
  - `pages_read_engagement`
- **Rate Limits:** 25 API calls per user per 24-hour period for content publishing.
- **Key Considerations:**
  - Only available for Instagram Business accounts.
  - The user's Instagram account must be connected to a Facebook Page.
  - The API has a two-step process: first upload the media, then publish it.
  - App must undergo Facebook's App Review process to use these permissions.

### 2.2. Twitter / X

- **API Type:** Twitter API v2
- **Authentication:** OAuth 2.0 Authorization Code Flow with PKCE for user-centric permissions.
- **Endpoints:**
  - `POST /2/tweets`: To create a new tweet.
- **Permissions/Scopes:**
  - `tweet.read`
  - `tweet.write`
  - `users.read`
  - `offline.access` (to obtain a refresh token)
- **Rate Limits:** App-based and user-based limits. For `POST /2/tweets`, it's typically 200 tweets per 15-minute window per user.
- **Key Considerations:**
  - Requires a developer account with "Elevated" access for API v2.
  - Media uploads (images) must be done separately via the media endpoint before being attached to a tweet.
  - The app must have a privacy policy and terms of service URL for the OAuth consent screen.

### 2.3. Facebook

- **API Type:** Facebook Graph API
- **Authentication:** OAuth 2.0
- **Endpoints:**
  - `POST /{user-id}/feed`: To publish a post on a user's timeline.
  - `POST /{user-id}/photos`: To upload a photo.
- **Permissions/Scopes:**
  - `public_profile`
  - `publish_actions` (Note: This permission is heavily restricted and requires App Review by Facebook).
- **Rate Limits:** Based on a sliding window of API calls per user. Varies by endpoint.
- **Key Considerations:**
  - The `publish_actions` permission is difficult to obtain and is intended for apps that provide a significant value to users.
  - An alternative is to use Facebook's Share Dialog, which does not require special permissions but requires the user to manually confirm the post.
  - The app must be in "Live" mode to be used by the public.

### 2.4. LinkedIn

- **API Type:** LinkedIn API v2
- **Authentication:** OAuth 2.0
- **Endpoints:**
  - `POST /ugcPosts`: To create a User Generated Content post (text, links, images).
- **Permissions/Scopes:**
  - `r_liteprofile`
  - `w_member_social`
- **Rate Limits:** Varies by endpoint and access tier.
- **Key Considerations:**
  - Requires a LinkedIn developer application.
  - The `w_member_social` permission is required for posting content and requires an application review.
  - All API requests must be made on behalf of a user.

## 3. Secure Credential Storage

- **Strategy:**
  - **Database Storage:** OAuth access and refresh tokens will be stored in a dedicated database table associated with the user's account.
  - **Encryption at Rest:** All sensitive tokens will be encrypted before being stored in the database. We will not store them in plaintext.
  - **Encryption Key Management:** The encryption key will be managed as a high-entropy secret stored in a secure environment variable (e.g., Vercel Environment Variables). It will **not** be hardcoded in the application.
  - **Token Exchange:** The frontend will receive an authorization code from the social media provider and send it to our backend. The backend will then exchange the code for an access token and refresh token, storing them securely without exposing them to the client-side.
- **Technology:**
  - **Database:** A serverless database like Vercel Postgres is recommended for easy integration with the existing Next.js and Vercel infrastructure.
  - **Encryption:** Use a standard, strong encryption library like `crypto` (built-in to Node.js) to perform AES-256-GCM encryption.

## 4. UI/UX Design

- **Connection Flow:**
- **Posting Flow:**

## 5. Backend Implementation

- **OAuth Library:**
- **API Wrapper/SDK:**
- **Database Schema:**

## 6. Frontend Implementation

- **Component Library:**
- **State Management:**