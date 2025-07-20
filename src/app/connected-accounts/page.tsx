"use client";
import { useState, useEffect } from 'react';
import { SocialAccountCard } from '@/components/ui/SocialAccountCard';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface ConnectedAccount {
  platform: string;
  isConnected: boolean;
  username?: string;
  connectedAt?: string;
}

export default function ConnectedAccountsPage() {
  const [accounts, setAccounts] = useState<ConnectedAccount[]>([
    { platform: 'Twitter / X', isConnected: false },
    { platform: 'Facebook', isConnected: false },
    { platform: 'Instagram', isConnected: false },
    { platform: 'LinkedIn', isConnected: false },
  ]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    // Check URL parameters for success/error messages
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    const error = urlParams.get('error');
    const username = urlParams.get('username');

    if (success) {
      const platformMessages = {
        'twitter_connected': 'Twitter',
        'facebook_connected': 'Facebook',
        'instagram_connected': 'Instagram',
        'linkedin_connected': 'LinkedIn',
      };
      
      const platformName = platformMessages[success as keyof typeof platformMessages];
      if (platformName) {
        setMessage({
          type: 'success',
          text: `${platformName} account ${username ? `(@${username})` : ''} connected successfully!`
        });
      }
    } else if (error) {
      const errorMessages = {
        'twitter_auth_failed': 'Failed to connect Twitter account',
        'facebook_auth_failed': 'Failed to connect Facebook account',
        'instagram_auth_failed': 'Failed to connect Instagram account',
        'linkedin_auth_failed': 'Failed to connect LinkedIn account',
        'missing_parameters': 'Missing required parameters',
        'invalid_state': 'Invalid security state',
        'token_exchange_failed': 'Failed to exchange authorization code',
        'no_access_token': 'No access token received',
        'user_info_failed': 'Failed to fetch user information',
        'callback_failed': 'OAuth callback failed',
        'no_instagram_business_account': 'No Instagram Business account found',
      };
      
      const errorMessage = errorMessages[error as keyof typeof errorMessages] || 'Failed to connect account';
      setMessage({
        type: 'error',
        text: `${errorMessage}. Please try again.`
      });
    }

    // Fetch actual connection status from API
    checkConnectionStatus();
  }, []);

  const checkConnectionStatus = async () => {
    try {
      const response = await fetch('/api/social-accounts');
      const data = await response.json();
      
      if (data.success) {
        const formattedAccounts = data.accounts.map((account: any) => ({
          platform: account.platform === 'twitter' ? 'Twitter / X' :
                   account.platform === 'facebook' ? 'Facebook' :
                   account.platform === 'instagram' ? 'Instagram' :
                   account.platform === 'linkedin' ? 'LinkedIn' : account.platform,
          isConnected: account.isConnected,
          username: account.username,
          connectedAt: account.connectedAt,
        }));
        setAccounts(formattedAccounts);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error checking connection status:', error);
      setLoading(false);
    }
  };

  const handleConnect = (platform: string) => {
    switch (platform) {
      case 'Twitter / X':
        window.location.href = '/api/connect/twitter';
        break;
      case 'Facebook':
        window.location.href = '/api/connect/facebook';
        break;
      case 'Instagram':
        window.location.href = '/api/connect/instagram';
        break;
      case 'LinkedIn':
        window.location.href = '/api/connect/linkedin';
        break;
    }
  };

  const handleDisconnect = async (platform: string) => {
    try {
      const platformKey = platform === 'Twitter / X' ? 'twitter' :
                         platform === 'Facebook' ? 'facebook' :
                         platform === 'Instagram' ? 'instagram' :
                         platform === 'LinkedIn' ? 'linkedin' : platform.toLowerCase();
      
      const response = await fetch('/api/social-accounts', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ platform: platformKey }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setMessage({ type: 'success', text: `${platform} disconnected successfully!` });
        setAccounts(prev => prev.map(account =>
          account.platform === platform
            ? { ...account, isConnected: false, username: undefined }
            : account
        ));
      } else {
        setMessage({ type: 'error', text: data.error || `Failed to disconnect ${platform}` });
      }
    } catch (error) {
      setMessage({ type: 'error', text: `Failed to disconnect ${platform}. Please try again.` });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="mb-6">
        <Link 
          href="/settings/social-media" 
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour aux paramètres
        </Link>
      </div>
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Connected Accounts</CardTitle>
          <CardDescription>
            Link your social media accounts to easily share your generated content.
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
          
          {accounts.map((account) => (
            <SocialAccountCard
              key={account.platform}
              platformName={account.platform}
              isConnected={account.isConnected}
              username={account.username}
              onConnect={() => handleConnect(account.platform)}
              onDisconnect={() => handleDisconnect(account.platform)}
            />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
