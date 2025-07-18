"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Image as ImageIcon, Send, CheckCircle, AlertCircle, Loader2, Heart, MessageCircle, Share2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  SOCIAL_MEDIA_PLATFORMS,
  SocialMediaPlatform,
  SocialMediaPublishResult,
  SocialMediaPlatformInfo
} from "@/lib/types";

interface SharePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl?: string;
  imageDescription?: string;
}

interface FeedPost {
  id: string;
  text: string;
  imageUrl?: string;
  timestamp: Date;
  likes: number;
  comments: number;
  shares: number;
}

export function SharePostModal({ isOpen, onClose, imageUrl, imageDescription }: SharePostModalProps) {
  const [postText, setPostText] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<Set<SocialMediaPlatform>>(new Set(['twitter']));
  const [publishing, setPublishing] = useState(false);
  const [publishResults, setPublishResults] = useState<SocialMediaPublishResult[]>([]);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [publishedPost, setPublishedPost] = useState<FeedPost | null>(null);

  const CHARACTER_LIMIT = 500;

  const handlePlatformToggle = (platform: SocialMediaPlatform) => {
    const newSelected = new Set(selectedPlatforms);
    if (newSelected.has(platform)) {
      newSelected.delete(platform);
    } else {
      newSelected.add(platform);
    }
    setSelectedPlatforms(newSelected);
  };

  const getCharacterCount = () => {
    const remaining = CHARACTER_LIMIT - postText.length;
    return {
      used: postText.length,
      remaining,
      isOverLimit: remaining < 0,
    };
  };

  const validatePost = () => {
    if (selectedPlatforms.size === 0) {
      setMessage({ type: 'error', text: 'Veuillez sélectionner au moins une plateforme' });
      return false;
    }

    if (!postText.trim()) {
      setMessage({ type: 'error', text: 'Veuillez saisir du texte pour votre publication' });
      return false;
    }

    // Check Instagram image requirement
    if (selectedPlatforms.has('instagram') && !imageUrl) {
      setMessage({ type: 'error', text: 'Instagram nécessite une image pour publier' });
      return false;
    }

    // Check character limits for selected platforms
    for (const platformId of selectedPlatforms) {
      const platform = SOCIAL_MEDIA_PLATFORMS.find(p => p.id === platformId);
      if (platform?.maxTextLength && postText.length > platform.maxTextLength) {
        setMessage({
          type: 'error',
          text: `Le texte dépasse la limite de ${platform.maxTextLength} caractères pour ${platform.name}`
        });
        return false;
      }
    }

    return true;
  };

  const handlePublish = async () => {
    if (!validatePost()) return;

    setPublishing(true);
    setMessage(null);
    setPublishResults([]);

    try {
      const results: SocialMediaPublishResult[] = [];
      
      // Publish to each selected platform
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

          const result = await response.json();
          results.push({
            platform,
            success: result.success,
            postId: result.postId,
            error: result.error,
          });
        } catch (error) {
          results.push({
            platform,
            success: false,
            error: 'Erreur de connexion',
          });
        }
      }

      setPublishResults(results);

      // Check if any publications succeeded
      const successCount = results.filter(r => r.success).length;
      const totalCount = results.length;

      if (successCount === totalCount) {
        setMessage({
          type: 'success',
          text: `Publication partagée avec succès sur ${successCount} plateforme${successCount > 1 ? 's' : ''} !`
        });
      } else if (successCount > 0) {
        setMessage({
          type: 'success',
          text: `Publication partagée sur ${successCount}/${totalCount} plateformes. Voir les détails ci-dessous.`
        });
      } else {
        setMessage({
          type: 'error',
          text: 'Échec de la publication sur toutes les plateformes. Voir les détails ci-dessous.'
        });
      }

      // Auto-close after 3 seconds if all succeeded
      if (successCount === totalCount) {
        setTimeout(() => {
          handleClose();
        }, 3000);
      }

    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Erreur lors de la publication. Veuillez réessayer.'
      });
    } finally {
      setPublishing(false);
    }
  };

  const handleClose = () => {
    setPostText('');
    setSelectedPlatforms(new Set(['twitter']));
    setPublishResults([]);
    setPublishedPost(null);
    setMessage(null);
    onClose();
  };

  const { used, remaining, isOverLimit } = getCharacterCount();

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Partager sur le Fil
          </DialogTitle>
          <DialogDescription>
            Créez une publication pour votre fil d'actualités avec votre transformation d'église.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Publish Results */}
          {publishResults.length > 0 && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Share2 className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium">Résultats de publication</span>
                </div>
                
                <div className="space-y-2">
                  {publishResults.map((result) => {
                    const platform = SOCIAL_MEDIA_PLATFORMS.find(p => p.id === result.platform);
                    return (
                      <div key={result.platform} className="flex items-center justify-between p-3 rounded-lg border">
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{platform?.icon}</span>
                          <span className="font-medium text-sm">{platform?.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {result.success ? (
                            <>
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <span className="text-sm text-green-600">Publié</span>
                            </>
                          ) : (
                            <>
                              <AlertCircle className="h-4 w-4 text-red-600" />
                              <span className="text-sm text-red-600">{result.error}</span>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Image Preview */}
          {imageUrl && publishResults.length === 0 && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <ImageIcon className="h-5 w-5 text-gray-500" />
                  <span className="text-sm font-medium">Image à partager</span>
                </div>
                <img
                  src={imageUrl}
                  alt="Transformation d'église générée"
                  className="w-full max-w-md rounded-lg border"
                />
              </CardContent>
            </Card>
          )}

          {/* Platform Selection */}
          {publishResults.length === 0 && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-4">
                  <Share2 className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium">Sélectionner les plateformes</span>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  {SOCIAL_MEDIA_PLATFORMS.map((platform) => (
                    <div
                      key={platform.id}
                      className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedPlatforms.has(platform.id)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handlePlatformToggle(platform.id)}
                    >
                      <Checkbox
                        checked={selectedPlatforms.has(platform.id)}
                        onChange={() => handlePlatformToggle(platform.id)}
                        aria-label={`Sélectionner ${platform.name}`}
                      />
                      <div className="flex items-center gap-2 flex-1">
                        <span className="text-lg">{platform.icon}</span>
                        <div className="flex-1">
                          <div className="font-medium text-sm">{platform.name}</div>
                          {platform.requiresImage && (
                            <div className="text-xs text-gray-500">Image requise</div>
                          )}
                          {platform.maxTextLength && (
                            <div className="text-xs text-gray-500">
                              Max {platform.maxTextLength} caractères
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {selectedPlatforms.size > 0 && (
                  <div className="mt-3 text-xs text-gray-600">
                    {selectedPlatforms.size} plateforme{selectedPlatforms.size > 1 ? 's' : ''} sélectionnée{selectedPlatforms.size > 1 ? 's' : ''}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Post Composition */}
          {publishResults.length === 0 && (
            <div className="space-y-3">
              <label className="text-sm font-medium">Votre Publication</label>
              <Textarea
                value={postText}
                onChange={(e) => setPostText(e.target.value)}
                placeholder={imageDescription ? 
                  `Découvrez cette incroyable transformation d'église ! ${imageDescription}` : 
                  "Partagez vos pensées sur cette transformation..."
                }
                className="min-h-[120px] resize-none"
              />
              
              {/* Character Count */}
              <div className="flex justify-between items-center">
                <Badge 
                  variant={isOverLimit ? "destructive" : remaining < 50 ? "secondary" : "outline"}
                  className="text-xs"
                >
                  {used}/{CHARACTER_LIMIT}
                  {isOverLimit && ` (${Math.abs(remaining)} en trop)`}
                </Badge>
                
                {remaining < 50 && !isOverLimit && (
                  <span className="text-xs text-amber-600">
                    {remaining} caractères restants
                  </span>
                )}
              </div>
            </div>
          )}

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

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={handleClose} disabled={publishing}>
              {publishResults.length > 0 ? 'Fermer' : 'Annuler'}
            </Button>
            {publishResults.length === 0 && (
              <Button
                onClick={handlePublish}
                disabled={publishing || !postText.trim() || selectedPlatforms.size === 0}
              >
                {publishing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Publication en cours...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Publier sur {selectedPlatforms.size} plateforme{selectedPlatforms.size > 1 ? 's' : ''}
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}