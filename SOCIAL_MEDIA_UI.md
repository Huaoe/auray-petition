# 🎨 Social Media Integration - UI/UX Design

This document outlines the user interface and experience for the social media integration features.

## 1. Connecting Social Media Accounts

### 1.1. User Flow

1.  **Navigation:** The user navigates to a new "Connected Accounts" page, accessible from their user profile or a settings menu.
2.  **Account List:** The page displays a list of supported social media platforms (Instagram, Twitter/X, Facebook, LinkedIn).
3.  **Connection Action:** Each platform is listed with a "Connect" button. The user clicks the button for the desired platform.
4.  **OAuth Redirect:** The user is redirected to the social media platform's authorization screen in a new tab or popup.
5.  **Authorization:** The user logs in (if necessary) and authorizes the application.
6.  **Callback:** Upon successful authorization, the user is redirected back to the "Connected Accounts" page.
7.  **State Update:** The UI updates to show the account as "Connected," displaying the user's profile name or handle. A "Disconnect" button replaces the "Connect" button.

### 1.2. Component Design

-   **`ConnectedAccountsPage`:**
    -   **Title:** "Connected Accounts"
    -   **Description:** "Link your social media accounts to easily share your generated content."
    -   **Layout:** A list or grid of `SocialAccountCard` components.

-   **`SocialAccountCard` (Component):**
    -   **Props:** `platformName`, `icon`, `isConnected`, `username`, `onConnect`, `onDisconnect`.
    -   **States:**
        -   **Disconnected:**
            -   Displays the platform logo and name.
            -   Shows a "Connect" button (e.g., `<Button>Connect</Button>`).
        -   **Connecting:**
            -   The "Connect" button shows a loading spinner.
        -   **Connected:**
            -   Displays the platform logo and name.
            -   Shows the user's profile name/handle (e.g., "@username").
            -   Displays a "Disconnect" button with a destructive variant (e.g., `<Button variant="destructive">Disconnect</Button>`).

## 2. Composing and Publishing Posts

### 2.1. User Flow

1.  **Trigger:** After a user successfully generates an image, a "Share" button appears alongside the "Download" and "Edit" buttons.
2.  **Open Modal:** Clicking "Share" opens the `SharePostModal`.
3.  **Platform Selection:** The modal displays a list of the user's connected social media accounts, each with a checkbox. The user selects the platforms they want to post to.
4.  **Compose Post:** The user writes a caption in a central `Textarea` component. A character counter provides feedback.
5.  **Image Preview:** A thumbnail of the generated image is displayed within the modal.
6.  **Publish Action:** The user clicks the "Publish" button.
7.  **Feedback:** The "Publish" button enters a loading state. Upon completion, a success or error toast notification is displayed. The modal can then be closed.

### 2.2. Component Design

-   **`SharePostModal` (Component):**
    -   **Title:** "Share your creation"
    -   **Layout:**
        -   A horizontal list of `PlatformSelector` checkboxes.
        -   A `Textarea` for the post caption, with a character counter.
        -   An `Image` preview thumbnail.
        -   A "Publish" button.
    -   **Props:** `imageUrl`, `connectedAccounts`, `onSubmit`.

-   **`PlatformSelector` (Component):**
    -   **Props:** `platformName`, `icon`, `isConnected`, `isSelected`, `onSelect`.
    -   **Functionality:** A checkbox-style component that allows users to toggle which platforms to post to. Disabled if the account is not connected.