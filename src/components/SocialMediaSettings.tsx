"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle, AlertCircle, Link2, Unlink } from "lucide-react";
import {
  SOCIAL_MEDIA_PLATFORMS,
  SocialMediaPlatform,
  SocialMediaAccount,
  ConnectAccountResponse
} from "@/lib/types";

interface SocialMediaSettingsProps {
  userId?: string;
}

export function SocialMediaSettings({ userId = 'current_user' }: SocialMediaSettingsProps) {
  const [connectedAccounts, setConnectedAccounts] = useState<SocialMediaAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState<SocialMediaPlatform | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Load connected accounts on mount
  useEffect(() => {
    loadConnectedAccounts();
    
    // Check for OAuth callback parameters
    const params = new URLSearchParams(window.location.search);
    const success = params.get('success');
    const error = params.get('error');
    const platform = params.get('platform');
    
    if (success && platform) {
      setMessage({
        type: 'success',
        text: `${platform} account connected successfully!`
      });
      loadConnectedAccounts();
    } else if (error) {
      setMessage({
        type: 'error',
        text: getErrorMessage(error)
      });
    }
    
    // Clean up URL parameters
    if (success || error) {
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  const getErrorMessage = (error: string): string => {
    switch (error) {
      case 'missing_parameters':
        return 'Missing required parameters. Please try again.';
      case 'invalid_platform':
        return 'Invalid platform selected.';
      case 'token_exchange_failed':
        return 'Failed to authenticate with the platform. Please try again.';
      case 'storage_failed':
        return 'Failed to save your credentials. Please try again.';
      case 'callback_error':
        return 'An error occurred during authentication. Please try again.';
      default:
        return `Authentication error: ${error}`;
    }
  };

  const loadConnectedAccounts = async () => {
    try {
      const response = await fetch(`/api/social-accounts?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setConnectedAccounts(data.accounts || []);
      }
    } catch (error) {
      console.error('Failed to load connected accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (platform: SocialMediaPlatform) => {
    setConnecting(platform);
    setMessage(null);
    
    try {
      const response = await fetch(`/api/auth/connect/${platform}`);
      if (!response.ok) {
        throw new Error('Failed to initiate OAuth');
      }
      
      const data: ConnectAccountResponse = await response.json();
      
      // Store state in session storage for CSRF protection
      sessionStorage.setItem(`oauth_state_${platform}`, data.state);
      
      // Redirect to OAuth provider
      window.location.href = data.authUrl;
      
    } catch (error) {
      console.error('OAuth initiation error:', error);
      setMessage({
        type: 'error',
        text: `Failed to connect ${platform} account. Please try again.`
      });
      setConnecting(null);
    }
  };

  const handleDisconnect = async (platform: SocialMediaPlatform) => {
    if (!confirm(`Are you sure you want to disconnect your ${platform} account?`)) {
      return;
    }
    
    try {
      const response = await fetch(`/api/social-accounts/${platform}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId })
      });
      
      if (response.ok) {
        setMessage({
          type: 'success',
          text: `${platform} account disconnected successfully.`
        });
        loadConnectedAccounts();
      } else {
        throw new Error('Failed to disconnect account');
      }
    } catch (error) {
      console.error('Disconnect error:', error);
      setMessage({
        type: 'error',
        text: `Failed to disconnect ${platform} account. Please try again.`
      });
    }
  };

  const isConnected = (platform: SocialMediaPlatform): boolean => {
    return connectedAccounts.some(account => account.platform === platform);
  };

  const getAccount = (platform: SocialMediaPlatform): SocialMediaAccount | undefined => {
    return connectedAccounts.find(account => account.platform === platform);
  };

  if (loading) {
    return (
      <Card>
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
            Connect your social media accounts to share your church transformations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {message && (
            <Alert variant={message.type === 'error' ? 'destructive' : 'default'}>
              {message.type === 'success' ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <AlertDescription>{message.text}</AlertDescription>
            </Alert>
          )}
          
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
                      {connected && account?.username && (
                        <div className="text-sm text-gray-600">
                          @{account.username}
                        </div>
                      )}
                      {connected && account?.connectedAt && (
                        <div className="text-xs text-gray-500">
                          Connected {new Date(account.connectedAt).toLocaleDateString()}
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
              We only request the minimum permissions needed to publish posts on your behalf. 
              You can disconnect your accounts at any time.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}