"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { X, Image as ImageIcon, Send, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ConnectedAccount {
  platform: 'twitter' | 'facebook' | 'instagram' | 'linkedin';
  isConnected: boolean;
  username?: string;
}

interface SharePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl?: string;
  imageDescription?: string;
}

const PLATFORM_LIMITS = {
  twitter: 280,
  facebook: 63206,
  instagram: 2200,
  linkedin: 3000,
};

const PLATFORM_NAMES = {
  twitter: 'Twitter / X',
  facebook: 'Facebook',
  instagram: 'Instagram',
  linkedin: 'LinkedIn',
};

export function SharePostModal({ isOpen, onClose, imageUrl, imageDescription }: SharePostModalProps) {
  const [postText, setPostText] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [connectedAccounts, setConnectedAccounts] = useState<ConnectedAccount[]>([]);
  const [loading, setLoading] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [publishResults, setPublishResults] = useState<{ platform: string; success: boolean; error?: string }[]>([]);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchConnectedAccounts();
      // Set default post text if image description is available
      if (imageDescription) {
        setPostText(`Check out this amazing church transformation! ${imageDescription}`);
      }
    }
  }, [isOpen, imageDescription]);

  const fetchConnectedAccounts = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/social-accounts');
      const data = await response.json();
      
      if (data.success) {
        const accounts = data.accounts.map((account: any) => ({
          platform: account.platform,
          isConnected: account.isConnected,
          username: account.username,
        }));
        setConnectedAccounts(accounts);
        
        // Auto-select connected accounts
        const connectedPlatforms = accounts
          .filter((account: ConnectedAccount) => account.isConnected)
          .map((account: ConnectedAccount) => account.platform);
        setSelectedPlatforms(connectedPlatforms);
      }
    } catch (error) {
      console.error('Error fetching connected accounts:', error);
      setMessage({ type: 'error', text: 'Failed to load connected accounts' });
    } finally {
      setLoading(false);
    }
  };

  const handlePlatformToggle = (platform: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platform) 
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  const getCharacterLimit = (platform: string) => {
    return PLATFORM_LIMITS[platform as keyof typeof PLATFORM_LIMITS] || 280;
  };

  const getCharacterCount = (platform: string) => {
    const limit = getCharacterLimit(platform);
    const remaining = limit - postText.length;
    return {
      used: postText.length,
      remaining,
      isOverLimit: remaining < 0,
    };
  };

  const validatePost = () => {
    if (!postText.trim()) {
      setMessage({ type: 'error', text: 'Please enter some text for your post' });
      return false;
    }

    if (selectedPlatforms.length === 0) {
      setMessage({ type: 'error', text: 'Please select at least one platform to share to' });
      return false;
    }

    // Check character limits for selected platforms
    for (const platform of selectedPlatforms) {
      const { isOverLimit } = getCharacterCount(platform);
      if (isOverLimit) {
        setMessage({ 
          type: 'error', 
          text: `Post exceeds character limit for ${PLATFORM_NAMES[platform as keyof typeof PLATFORM_NAMES]}` 
        });
        return false;
      }
    }

    return true;
  };

  const handlePublish = async () => {
    if (!validatePost()) return;

    setPublishing(true);
    setPublishResults([]);
    setMessage(null);

    const results: { platform: string; success: boolean; error?: string }[] = [];

    for (const platform of selectedPlatforms) {
      try {
        const response = await fetch('/api/social-media/publish', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            platform,
            text: postText,
            imageUrl,
          }),
        });

        const data = await response.json();
        
        results.push({
          platform,
          success: data.success,
          error: data.error,
        });
      } catch (error) {
        results.push({
          platform,
          success: false,
          error: 'Network error occurred',
        });
      }
    }

    setPublishResults(results);
    
    const successCount = results.filter(r => r.success).length;
    const totalCount = results.length;
    
    if (successCount === totalCount) {
      setMessage({ 
        type: 'success', 
        text: `Successfully published to all ${totalCount} platform${totalCount > 1 ? 's' : ''}!` 
      });
    } else if (successCount > 0) {
      setMessage({ 
        type: 'error', 
        text: `Published to ${successCount} of ${totalCount} platforms. Check results below.` 
      });
    } else {
      setMessage({ 
        type: 'error', 
        text: 'Failed to publish to any platforms. Please try again.' 
      });
    }

    setPublishing(false);
  };

  const handleClose = () => {
    setPostText('');
    setSelectedPlatforms([]);
    setPublishResults([]);
    setMessage(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Share to Social Media
          </DialogTitle>
          <DialogDescription>
            Compose and publish your post to your connected social media accounts.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Image Preview */}
          {imageUrl && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <ImageIcon className="h-5 w-5 text-gray-500" />
                  <span className="text-sm font-medium">Attached Image</span>
                </div>
                <div className="mt-3">
                  <img 
                    src={imageUrl} 
                    alt="Generated church transformation" 
                    className="w-full max-w-md rounded-lg border"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Post Composition */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Post Text</label>
            <Textarea
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              placeholder="Write your post here..."
              className="min-h-[120px] resize-none"
            />
            
            {/* Character Count for Selected Platforms */}
            {selectedPlatforms.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedPlatforms.map(platform => {
                  const { used, remaining, isOverLimit } = getCharacterCount(platform);
                  return (
                    <Badge 
                      key={platform} 
                      variant={isOverLimit ? "destructive" : "secondary"}
                      className="text-xs"
                    >
                      {PLATFORM_NAMES[platform as keyof typeof PLATFORM_NAMES]}: {used}/{getCharacterLimit(platform)}
                      {isOverLimit && ` (${Math.abs(remaining)} over)`}
                    </Badge>
                  );
                })}
              </div>
            )}
          </div>

          {/* Platform Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Select Platforms</label>
            {loading ? (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading connected accounts...
              </div>
            ) : (
              <div className="space-y-2">
                {connectedAccounts.map(account => (
                  <div key={account.platform} className="flex items-center space-x-3">
                    <Checkbox
                      id={account.platform}
                      checked={selectedPlatforms.includes(account.platform)}
                      onCheckedChange={() => handlePlatformToggle(account.platform)}
                      disabled={!account.isConnected || publishing}
                    />
                    <label 
                      htmlFor={account.platform}
                      className={`text-sm ${!account.isConnected ? 'text-gray-400' : 'cursor-pointer'}`}
                    >
                      {PLATFORM_NAMES[account.platform]}
                      {account.isConnected ? (
                        <span className="text-green-600 ml-2">
                          ({account.username || 'Connected'})
                        </span>
                      ) : (
                        <span className="text-gray-400 ml-2">(Not connected)</span>
                      )}
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Messages */}
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

          {/* Publish Results */}
          {publishResults.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Publish Results</label>
              {publishResults.map(result => (
                <div 
                  key={result.platform}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {result.success ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-600" />
                    )}
                    <span className="text-sm font-medium">
                      {PLATFORM_NAMES[result.platform as keyof typeof PLATFORM_NAMES]}
                    </span>
                  </div>
                  <span className={`text-xs ${result.success ? 'text-green-600' : 'text-red-600'}`}>
                    {result.success ? 'Published' : result.error || 'Failed'}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={handleClose} disabled={publishing}>
              Cancel
            </Button>
            <Button 
              onClick={handlePublish} 
              disabled={publishing || selectedPlatforms.length === 0 || !postText.trim()}
            >
              {publishing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Publishing...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Publish to {selectedPlatforms.length} Platform{selectedPlatforms.length !== 1 ? 's' : ''}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}