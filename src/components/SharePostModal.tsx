"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Image as ImageIcon, Send, CheckCircle, AlertCircle, Loader2, Heart, MessageCircle, Share2, Settings, Link2 } from "lucide-react";
import Link from 'next/link';
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
  SocialMediaPlatformInfo,
  SocialMediaAccount,
} from "@/lib/types";

interface SharePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl?: string;
  imageDescription?: string;
  transformationId?: string;
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

export function SharePostModal({ 
  isOpen, 
  onClose, 
  imageUrl, 
  imageDescription, 
  transformationId = '1' 
}: SharePostModalProps) {
  // Initialize all state hooks first
  const [postText, setPostText] = useState('');
  const [selectedPromptIndex, setSelectedPromptIndex] = useState<number | null>(null);
  const [selectedPlatforms, setSelectedPlatforms] = useState<Set<SocialMediaPlatform>>(new Set());
  const [connectedAccounts, setConnectedAccounts] = useState<SocialMediaAccount[]>([]);
  const [loadingAccounts, setLoadingAccounts] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [publishResults, setPublishResults] = useState<SocialMediaPublishResult[]>([]);
  const [publishedPost, setPublishedPost] = useState<any>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [connectingPlatform, setConnectingPlatform] = useState<SocialMediaPlatform | null>(null);

  // Liste des prompts en français pour Bayrou et la transformation économique
  const frenchPrompts = [
    {
      prompt: "Bayrou, ancien Premier ministre, appelle à soutenir l'avenir de la France.\nSaisissons cette chance pour un renouveau économique et laïc.\n#Bayrou #France #ChangementÉconomique",
      justification: "Selon l'IFOP, 74% des Français considèrent la laïcité comme un principe fondamental de la République. Source : IFOP, 2023."
    },
    {
      prompt: "La France a besoin de nous ! Bayrou cherche des fonds pour une transformation nationale.\nEnsemble, dynamisons l'économie et la laïcité.\n#SoutienFrance #Bayrou #AvenirLaïc",
      justification: "En 2022, 51% des Français se disent favorables à une société où la religion occupe moins de place. Source : Pew Research Center, 2022."
    },
    {
      prompt: "Bayrou appelle à l'unité pour relancer l'économie française. Les milliards sont là!\nVotre soutien peut déclencher le grand changement laïc.\n#Bayrou #RelanceFrançaise #ActeursDuChangement",
      justification: "La France est le pays d'Europe où la séparation Église-État est la plus stricte selon l'Observatoire de la laïcité. Source : Observatoire de la laïcité, 2021."
    },
    {
      prompt: "Aidons Bayrou à conduire la France vers une nouvelle ère économique.\nUne nation laïque et prospère est à portée de main !\n#Bayrou #ChangementLaïc #FranceEnAvant",
      justification: "Depuis 2006, la part des Français se déclarant sans religion est passée de 27% à 51%. Source : IFOP, 2023."
    },
    {
      prompt: "Bayrou collecte des fonds pour une France plus inclusive et innovante.\nC'est le moment d'innover économiquement et laïquement.\n#Bayrou #Innovation #FranceLaïque",
      justification: "La France est citée comme modèle de sécularisation par 68% des Européens interrogés. Source : Pew Research Center, 2018."
    },
    {
      prompt: "Soutenez la vision de Bayrou pour une France prospère et laïque.\nVotre contribution peut lancer la transformation attendue.\n#Bayrou #TransformerFrance #Laïcité",
      justification: "La loi de 1905 sur la séparation des Églises et de l'État reste soutenue par 78% des Français. Source : IFOP, 2023."
    },
    {
      prompt: "Bayrou veut financer le prochain grand bond de la France.\nSaisissons cette opportunité de renouveau économique et laïc.\n#Bayrou #FuturFrançais #RelanceÉco",
      justification: "En 2021, 62% des jeunes Français estiment que la laïcité favorise le vivre-ensemble. Source : IFOP, 2021."
    },
    {
      prompt: "L'avenir de la France est entre nos mains, Bayrou montre la voie.\nSoutenez la croissance économique et les valeurs laïques en sécularisant !.\n#Bayrou #France2025 #ChangementLaïc",
      justification: "La France est le pays d'Europe où la pratique religieuse est la plus faible : 64% ne pratiquent aucune religion. Source : Pew Research Center, 2018."
    },
    {
      prompt: "Bayrou sollicite votre aide pour ouvrir une nouvelle ère en France.\nLa relance économique et la transformation laïque commencent avec nous.\n#Bayrou #RelanceFrance #ProgrèsLaïc",
      justification: "En 2023, 80% des Français soutiennent la neutralité religieuse dans les services publics. Source : IFOP, 2023."
    },
    {
      prompt: "Bayrou rassemble pour la renaissance économique et laïque de la France.\nC'est le moment d'agir ensemble.\n#Bayrou #RenouveauFrance #ChangerMaintenant",
      justification: "La laïcité est perçue comme un facteur d'unité nationale par 72% des Français. Source : IFOP, 2023."
    },
    {
      prompt: "Rejoignez Bayrou pour financer la transformation audacieuse de la France.\nLa croissance et la laïcité sont à portée de main.\n#Bayrou #ChangementFrançais #AvenirLaïc",
      justification: "En 2022, 59% des Français considèrent que la sécularisation est un progrès pour la société. Source : Pew Research Center, 2022."
    },
    {
      prompt: "Bayrou lève des fonds pour dynamiser l'économie et l'esprit laïc français.\nUnissons-nous pour un avenir meilleur.\n#Bayrou #France #TransformationLaïque",
      justification: "La France est citée comme exemple de neutralité religieuse par 70% des Européens. Source : Pew Research Center, 2018."
    },
    {
      prompt: "La France a besoin d'une nouvelle direction, Bayrou mène la charge.\nSoutenez le progrès économique et laïc pour tous.\n#Bayrou #Progrès #FranceLaïque",
      justification: "En 2023, 77% des Français soutiennent l'interdiction des signes religieux à l'école. Source : IFOP, 2023."
    },
    {
      prompt: "La campagne de Bayrou porte l'espoir, la croissance et la laïcité.\nAidez à financer l'avenir de la France.\n#Bayrou #EspoirFrance #ChangementLaïc",
      justification: "La sécularisation est vue comme un facteur d'espoir pour 61% des jeunes Français. Source : IFOP, 2022."
    },
    {
      prompt: "Bayrou appelle à un élan collectif pour le renouveau économique et laïc.\nVotre soutien compte plus que jamais.\n#Bayrou #France #RéformeLaïque",
      justification: "En 2023, 75% des Français jugent la laïcité indispensable à la démocratie. Source : IFOP, 2023."
    },
    {
      prompt: "Soutenez la vision de Bayrou pour une France dynamique et laïque.\nLa transformation commence avec nous.\n#Bayrou #Transformer #AvenirLaïc",
      justification: "La laïcité est considérée comme un moteur de dynamisme social par 68% des Français. Source : IFOP, 2023."
    },
    {
      prompt: "Bayrou cherche des fonds pour lancer la révolution économique et laïque.\nParticipez à ce moment historique.\n#Bayrou #RévolutionFrance #ChangementLaïc",
      justification: "La France est le pays d'Europe où la sécularisation progresse le plus rapidement. Source : Pew Research Center, 2018."
    },
    {
      prompt: "L'avenir de la France s'illumine avec le leadership de Bayrou.\nFinançons ensemble la croissance et le progrès laïc.\n#Bayrou #AvenirRadieux #FranceLaïque",
      justification: "En 2023, 81% des Français soutiennent la neutralité religieuse dans la vie publique. Source : IFOP, 2023."
    },
    {
      prompt: "Bayrou défend une nouvelle ère pour la France, économique et laïque.\nVotre soutien peut tout changer.\n#Bayrou #NouvelleÈre #TransformationLaïque",
      justification: "La transformation laïque est soutenue par 69% des Français. Source : IFOP, 2023."
    },
    {
      prompt: "La collecte de Bayrou est une chance de changer la France.\nSoutenez l'innovation économique et les valeurs laïques.\n#Bayrou #InnoverFrance #ProgrèsLaïc",
      justification: "L'innovation laïque est jugée essentielle pour 73% des Français. Source : IFOP, 2023."
    }
  ];

  const CHARACTER_LIMIT = 500;

  // Ajout d'un bouton pour régénérer le prompt
  const handleRegeneratePrompt = () => {
    const randomIndex = Math.floor(Math.random() * frenchPrompts.length);
    setSelectedPromptIndex(randomIndex);
    const selectedPrompt = frenchPrompts[randomIndex];
    setPostText(selectedPrompt.prompt + "\n" + selectedPrompt.justification);
  };

  // Initialize with a random prompt when modal opens
  useEffect(() => {
    if (isOpen && !postText && selectedPromptIndex === null) {
      handleRegeneratePrompt();
    }
  }, [isOpen, postText, selectedPromptIndex]);

  // Fetch connected accounts when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchConnectedAccounts();
    }
  }, [isOpen]);

  const fetchConnectedAccounts = async () => {
    setLoadingAccounts(true);
    try {
      const response = await fetch('/api/social-accounts');
      if (response.ok) {
        const data = await response.json();
        setConnectedAccounts(data.accounts || []);
        
        // Auto-select first connected account if any
        if (data.accounts && data.accounts.length > 0 && selectedPlatforms.size === 0) {
          setSelectedPlatforms(new Set([data.accounts[0].platform]));
        }
      }
    } catch (error) {
      console.error('Error fetching connected accounts:', error);
    } finally {
      setLoadingAccounts(false);
    }
  };

  const isAccountConnected = (platform: SocialMediaPlatform): boolean => {
    return connectedAccounts.some(account => account.platform === platform);
  };

  const handlePlatformToggle = (platform: SocialMediaPlatform) => {
    // Only allow toggling if account is connected
    if (!isAccountConnected(platform)) {
      setMessage({
        type: 'error',
        text: `Veuillez d'abord connecter votre compte ${SOCIAL_MEDIA_PLATFORMS.find(p => p.id === platform)?.name}`
      });
      return;
    }

    const newSelected = new Set(selectedPlatforms);
    if (newSelected.has(platform)) {
      newSelected.delete(platform);
    } else {
      newSelected.add(platform);
    }
    setSelectedPlatforms(newSelected);
  };

  // Handle direct connection to a social media platform
  const handleConnectPlatform = (platform: SocialMediaPlatform) => {
    setConnectingPlatform(platform);
    setMessage(null);
    
    try {
      // Build the return URL to come back to this modal
      const returnUrl = encodeURIComponent('/share-post');
      const connectUrl = `/api/connect/${platform}?returnUrl=${returnUrl}`;
      
      // Redirect to the OAuth flow
      window.location.href = connectUrl;
    } catch (error) {
      console.error('OAuth initiation error:', error);
      setMessage({
        type: 'error',
        text: `Erreur lors de la connexion à ${SOCIAL_MEDIA_PLATFORMS.find(p => p.id === platform)?.name}. Veuillez réessayer.`
      });
      setConnectingPlatform(null);
    }
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
      
      // Create a transformation page URL if we have an image
      let transformationUrl = '';
      if (imageUrl) {
        // Extract the transformation ID from the image URL if possible
        const urlParts = imageUrl.split('/');
        const transformationId = urlParts[urlParts.length - 1].split('.')[0];
        transformationUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/transformation/${transformationId}`;
      }
      
      // Add the transformation URL to the post text if available
      const finalPostText = transformationUrl
        ? `${postText}\n\nVoir la transformation: ${transformationUrl}`
        : postText;
      
      // Publish to each selected platform
      for (const platform of selectedPlatforms) {
        try {
          // Set up headers with content type
          const headers = {
            'Content-Type': 'application/json',
          };
          
          const response = await fetch('/api/social-media/publish', {
            method: 'POST',
            headers,
            body: JSON.stringify({
              platform,
              text: finalPostText,
              // Don't include imageUrl - we're using a link instead
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
    setSelectedPlatforms(new Set());
    setPublishResults([]);
    setPublishedPost(null);
    setMessage(null);
    onClose();
  };

  const { used, remaining, isOverLimit } = getCharacterCount();

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto sm:mx-0 sm:p-0">
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
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Share2 className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-medium">Sélectionner les plateformes</span>
                  </div>
                  <Link href={`/settings/social-media?returnUrl=/share-post${connectedAccounts.length === 0 ? '&noAccounts=true' : ''}`}>
                    <Button variant="ghost" size="sm" className="text-xs">
                      <Settings className="h-3 w-3 mr-1" />
                      Gérer les comptes
                    </Button>
                  </Link>
                </div>
                
                {loadingAccounts ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                  </div>
                ) : connectedAccounts.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-sm text-gray-600 mb-4">
                      Aucun compte social connecté
                    </p>
                    
                    {/* Direct connection buttons for each platform */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      {SOCIAL_MEDIA_PLATFORMS.map((platform) => (
                        <Button 
                          key={platform.id}
                          variant="outline" 
                          size="sm"
                          className="flex items-center gap-2 justify-center"
                          onClick={() => handleConnectPlatform(platform.id)}
                          disabled={connectingPlatform === platform.id}
                        >
                          {connectingPlatform === platform.id ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              <span>Connexion...</span>
                            </>
                          ) : (
                            <>
                              <span className="text-lg">{platform.icon}</span>
                              <span>Connecter {platform.name}</span>
                            </>
                          )}
                        </Button>
                      ))}
                    </div>
                    
                   
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      {SOCIAL_MEDIA_PLATFORMS.map((platform) => {
                        const isConnected = isAccountConnected(platform.id);
                        const connectedAccount = connectedAccounts.find(acc => acc.platform === platform.id);
                        
                        return (
                          <div
                            key={platform.id}
                            className={`flex items-center space-x-3 p-3 rounded-lg border transition-colors ${
                              isConnected
                                ? selectedPlatforms.has(platform.id)
                                  ? 'border-blue-500 bg-blue-50 cursor-pointer'
                                  : 'border-gray-200 hover:border-gray-300 cursor-pointer'
                                : 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-60'
                            }`}
                            onClick={() => isConnected && handlePlatformToggle(platform.id)}
                          >
                            <Checkbox
                              checked={selectedPlatforms.has(platform.id)}
                              disabled={!isConnected}
                              onChange={() => isConnected && handlePlatformToggle(platform.id)}
                              aria-label={`Sélectionner ${platform.name}`}
                            />
                            <div className="flex items-center gap-2 flex-1">
                              <span className="text-lg">{platform.icon}</span>
                              <div className="flex-1">
                                <div className="font-medium text-sm">{platform.name}</div>
                                {isConnected && connectedAccount ? (
                                  <div className="text-xs text-green-600">
                                    @{connectedAccount.username}
                                  </div>
                                ) : (
                                  <div className="flex items-center mt-1">
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="h-6 px-2 py-0 text-xs text-blue-600"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleConnectPlatform(platform.id);
                                      }}
                                    >
                                      <Link2 className="h-3 w-3 mr-1" />
                                      Connecter
                                    </Button>
                                  </div>
                                )}
                                {platform.requiresImage && (
                                  <div className="text-xs text-gray-500">Image requise</div>
                                )}
                                {platform.requiresElevatedAccess && (
                                  <div className="text-xs text-amber-600">
                                    Images peuvent nécessiter un accès API élevé
                                  </div>
                                )}
                                {platform.maxTextLength && (
                                  <div className="text-xs text-gray-500">
                                    Max {platform.maxTextLength} caractères
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    
                    {selectedPlatforms.size > 0 && (
                      <div className="mt-3 text-xs text-gray-600">
                        {selectedPlatforms.size} plateforme{selectedPlatforms.size > 1 ? 's' : ''} sélectionnée{selectedPlatforms.size > 1 ? 's' : ''}
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          )}

          {/* Post Composition */}
          {publishResults.length === 0 && (
            <div className="space-y-3">
              <label className="text-sm font-medium">Votre Publication</label>
              <div className="flex gap-2 items-center">
                <Textarea
                  value={postText}
                  onChange={(e) => {
                    setPostText(e.target.value);
                    setSelectedPromptIndex(null);
                  }}
                  placeholder={imageDescription ?
                    `Découvrez cette incroyable transformation d'église ! ${imageDescription}` :
                    "Partagez vos pensées sur cette transformation..."
                  }
                  className="min-h-[120px] resize-none flex-1"
                />
                <Button
                  type="button"
                  variant="secondary"
                  className="h-fit"
                  aria-label="Régénérer le texte"
                  onClick={handleRegeneratePrompt}
                  tabIndex={0}
                  onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleRegeneratePrompt()}
                >
                  Régénérer
                </Button>
              </div>
              {/* Show justification for the selected prompt */}
              {typeof selectedPromptIndex === "number" && frenchPrompts[selectedPromptIndex] && (
                <div className="mt-2 text-xs italic text-muted-foreground">
                  {frenchPrompts[selectedPromptIndex].justification}
                </div>
              )}
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
