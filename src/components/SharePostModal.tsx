"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Image as ImageIcon, Send, CheckCircle, AlertCircle, Loader2, Heart, MessageCircle, Share2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
  const [publishing, setPublishing] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [publishedPost, setPublishedPost] = useState<FeedPost | null>(null);

  const CHARACTER_LIMIT = 500;

  const getCharacterCount = () => {
    const remaining = CHARACTER_LIMIT - postText.length;
    return {
      used: postText.length,
      remaining,
      isOverLimit: remaining < 0,
    };
  };

  const validatePost = () => {
    if (!postText.trim()) {
      setMessage({ type: 'error', text: 'Veuillez saisir du texte pour votre publication' });
      return false;
    }

    const { isOverLimit } = getCharacterCount();
    if (isOverLimit) {
      setMessage({ 
        type: 'error', 
        text: `La publication dépasse la limite de ${CHARACTER_LIMIT} caractères` 
      });
      return false;
    }

    return true;
  };

  const handlePublish = async () => {
    if (!validatePost()) return;

    setPublishing(true);
    setMessage(null);

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Create a mock published post
      const newPost: FeedPost = {
        id: Date.now().toString(),
        text: postText,
        imageUrl,
        timestamp: new Date(),
        likes: 0,
        comments: 0,
        shares: 0,
      };

      setPublishedPost(newPost);
      setMessage({ 
        type: 'success', 
        text: 'Publication partagée avec succès sur votre fil !' 
      });

      // Auto-close after 2 seconds
      setTimeout(() => {
        handleClose();
      }, 2000);

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
          {/* Published Post Preview */}
          {publishedPost && (
            <Card className="border-green-200 bg-green-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium text-green-800">Publication partagée</span>
                </div>
                
                {/* Mock Feed Post */}
                <div className="bg-white rounded-lg border p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                      U
                    </div>
                    <div>
                      <div className="font-semibold text-sm">Utilisateur</div>
                      <div className="text-xs text-gray-500">À l'instant</div>
                    </div>
                  </div>
                  
                  <p className="text-sm mb-3">{publishedPost.text}</p>
                  
                  {publishedPost.imageUrl && (
                    <img 
                      src={publishedPost.imageUrl} 
                      alt="Transformation d'église" 
                      className="w-full rounded-lg border mb-3"
                    />
                  )}
                  
                  <div className="flex items-center gap-6 text-gray-500 text-sm">
                    <button className="flex items-center gap-1 hover:text-red-500 transition-colors">
                      <Heart className="h-4 w-4" />
                      <span>{publishedPost.likes}</span>
                    </button>
                    <button className="flex items-center gap-1 hover:text-blue-500 transition-colors">
                      <MessageCircle className="h-4 w-4" />
                      <span>{publishedPost.comments}</span>
                    </button>
                    <button className="flex items-center gap-1 hover:text-green-500 transition-colors">
                      <Share2 className="h-4 w-4" />
                      <span>{publishedPost.shares}</span>
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Image Preview */}
          {imageUrl && !publishedPost && (
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

          {/* Post Composition */}
          {!publishedPost && (
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
              {publishedPost ? 'Fermer' : 'Annuler'}
            </Button>
            {!publishedPost && (
              <Button 
                onClick={handlePublish} 
                disabled={publishing || !postText.trim() || isOverLimit}
              >
                {publishing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Publication...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Publier sur le Fil
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