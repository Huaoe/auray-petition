"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toaster";
import { Loader2, CheckCircle, AlertCircle, Link2, Unlink } from "lucide-react";
import {
  SOCIAL_MEDIA_PLATFORMS,
  SocialMediaPlatform,
  SocialMediaAccount,
  ConnectAccountResponse,
} from "@/lib/types";

interface SocialMediaSettingsProps {
  userId?: string;
}

export function SocialMediaSettings({
  userId = "current_user",
}: SocialMediaSettingsProps) {
  const [connectedAccounts, setConnectedAccounts] = useState<
    SocialMediaAccount[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState<SocialMediaPlatform | null>(
    null
  );
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const { toast } = useToast();

  // Load connected accounts on mount
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.log("[SocialMediaSettings] Component mounted");
    }
    loadConnectedAccounts();

    // Check for OAuth callback parameters
    const params = new URLSearchParams(window.location.search);
    const success = params.get("success");
    const error = params.get("error");
    const platform = params.get("platform");
    const username = params.get("username");

    if (process.env.NODE_ENV === "development") {
      if (success || error) {
        console.log("[SocialMediaSettings] OAuth callback detected:", {
          success,
          error,
          platform,
          username,
        });
      }
    }

    if (success && platform) {
      const platformName = platform === 'twitter' ? 'Twitter' : 
                          platform === 'facebook' ? 'Facebook' :
                          platform === 'instagram' ? 'Instagram' :
                          platform === 'linkedin' ? 'LinkedIn' : platform;
      
      toast({
        title: "Connection Successful",
        description: `${platformName} account ${username ? `(@${username})` : ''} connected successfully!`,
        variant: "default",
      });
      
      // Force reload accounts multiple times to ensure sync
      setTimeout(() => {
        loadConnectedAccounts();
      }, 500);
      
      setTimeout(() => {
        loadConnectedAccounts();
      }, 2000);
      
      setTimeout(() => {
        loadConnectedAccounts();
      }, 5000);
    } else if (error) {
      toast({
        title: "Connection Failed",
        description: getErrorMessage(error),
        variant: "error",
      });
    }

    // Clean up URL parameters
    if (success || error) {
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, [toast]);

  const getErrorMessage = (error: string): string => {
    if (process.env.NODE_ENV === "development") {
      console.log(`[SocialMediaSettings] Getting error message for:`, error);
    }
    switch (error) {
      case "missing_parameters":
        return "Authentication callback is missing required parameters. Please try connecting again.";
      case "invalid_platform":
        return "The selected social media platform is not supported.";
      case "token_exchange_failed":
        return "Could not verify your identity with the social media platform. Please try again.";
      case "storage_failed":
        return "Failed to securely store your account connection. Please try again.";
      case "callback_error":
        return "An unexpected error occurred during the authentication process. Please try again.";
      case "invalid_state":
        return "Invalid authentication session. Please try connecting again for your security.";
      default:
        return `An unexpected error occurred. If the problem persists, please contact support. (Error: ${error})`;
    }
  };

  const loadConnectedAccounts = useCallback(async () => {
    if (loading) return; // Prevent multiple simultaneous calls
    
    setLoading(true);
    try {
      // Use the real userId or "current_user" (do not force demo-user)
      const response = await fetch(`/api/social-accounts?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        if (process.env.NODE_ENV === "development") {
          console.log("[SocialMediaSettings] Loaded accounts:", data.accounts);
        }
        setConnectedAccounts(data.accounts || []);
      } else {
        if (process.env.NODE_ENV === "development") {
          console.error(
            "[SocialMediaSettings] Failed to load accounts, status:",
            response.status
          );
        }
      }
    } catch (error) {
      console.error("Failed to load connected accounts:", error);
    } finally {
      setLoading(false);
    }
  }, [userId, loading]); // Add loading to dependencies

  const handleConnect = async (platform: SocialMediaPlatform) => {
    if (process.env.NODE_ENV === "development") {
      console.log(
        `[SocialMediaSettings] Initiating connection for ${platform}`
      );
    }
    setConnecting(platform);
    setMessage(null);

    try {
      // Use the platform-specific connect endpoints
      const connectUrl = `/api/connect/${platform}`;
      window.location.href = connectUrl;
    } catch (error) {
      console.error("OAuth initiation error:", error);
      toast({
        title: "Connection Error",
        description: `Failed to connect ${platform} account. Please try again.`,
        variant: "error",
      });
      setConnecting(null);
    }
  };

  const handleDisconnect = async (platform: SocialMediaPlatform) => {
    if (
      !confirm(`Are you sure you want to disconnect your ${platform} account?`)
    ) {
      return;
    }

    if (process.env.NODE_ENV === "development") {
      console.log(
        `[SocialMediaSettings] Disconnecting ${platform} for userId:`,
        userId
      );
    }

    try {
      // Use the same userId that's used in the callback
      const apiUserId = userId === "current_user" ? "demo-user@example.com" : userId;
      const response = await fetch(`/api/social-accounts/${platform}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: apiUserId }),
      });

      if (response.ok) {
        toast({
          title: "Disconnect Successful",
          description: `${platform} account disconnected successfully.`,
          variant: "default",
        });
        loadConnectedAccounts();
      } else {
        if (process.env.NODE_ENV === "development") {
          console.error(
            `[SocialMediaSettings] Failed to disconnect ${platform}, status:`,
            response.status
          );
        }
        throw new Error("Failed to disconnect account");
      }
    } catch (error) {
      console.error("Disconnect error:", error);
      toast({
        title: "Disconnect Error",
        description: `Failed to disconnect ${platform} account. Please try again.`,
        variant: "error",
      });
    }
  };

  const isConnected = (platform: SocialMediaPlatform): boolean => {
    return connectedAccounts.some((account) => account.platform === platform);
  };

  const getAccount = (
    platform: SocialMediaPlatform
  ): SocialMediaAccount | undefined => {
    return connectedAccounts.find((account) => account.platform === platform);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading Connected Accounts</CardTitle>
          <CardDescription>
            Please wait while we fetch your social media connections...
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Connected Social Media Accounts</CardTitle>
          <CardDescription>
            Connect your social media accounts to share your church
            transformations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            {SOCIAL_MEDIA_PLATFORMS.map((platform) => {
              const account = getAccount(platform.id);
              const connected = isConnected(platform.id);

              return (
                <div
                  key={platform.id}
                  className="flex items-center justify-between p-4 rounded-lg border"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">{platform.icon}</span>
                    <div>
                      <div className="font-medium">{platform.name}</div>
                      {connected && account ? (
                        <>
                          <div className="text-sm text-gray-600">
                            {account.username
                              ? `@${account.username}`
                              : "Account connected"}
                          </div>
                          <div className="text-xs text-gray-500">
                            Connected on{" "}
                            {new Date(account.connectedAt).toLocaleDateString()}
                          </div>
                        </>
                      ) : (
                        <div className="text-sm text-gray-500">
                          Not connected
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {connected && (
                      <Badge variant="secondary" className="gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Connected
                      </Badge>
                    )}

                    {connected ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDisconnect(platform.id)}
                        className="gap-2"
                      >
                        <Unlink className="h-4 w-4" />
                        Disconnect
                      </Button>
                    ) : (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleConnect(platform.id)}
                        disabled={connecting === platform.id}
                        className="gap-2"
                      >
                        {connecting === platform.id ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Connecting...
                          </>
                        ) : (
                          <>
                            <Link2 className="h-4 w-4" />
                            Connect
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium mb-2">Privacy & Security</h4>
            <p className="text-xs text-gray-600">
              Your social media credentials are encrypted and stored securely.
              We only request the minimum permissions needed to publish posts on
              your behalf. You can disconnect your accounts at any time.
            </p>
          </div>
          <div className="mt-6 flex justify-end">
            <Button variant="secondary" onClick={() => window.location.href = '/'}>
              Retour à la publication
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
