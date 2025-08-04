"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Image as ImageIcon,
  Send,
  CheckCircle,
  AlertCircle,
  Loader2,
  Heart,
  MessageCircle,
  Share2,
  Settings,
  Link2,
  Share,
} from "lucide-react";
import Link from "next/link";
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
  transformationId
}: SharePostModalProps) {
  const router = useRouter();
  console.log("imageUrl : ",imageUrl)
  // Initialize all state hooks first
  const [postText, setPostText] = useState("");
  const [selectedPromptIndex, setSelectedPromptIndex] = useState<number | null>(
    null
  );
  const [selectedPlatforms, setSelectedPlatforms] = useState<
    Set<SocialMediaPlatform>
  >(new Set());
  const [connectedAccounts, setConnectedAccounts] = useState<
    SocialMediaAccount[]
  >([]);
  const [loadingAccounts, setLoadingAccounts] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [publishResults, setPublishResults] = useState<
    SocialMediaPublishResult[]
  >([]);
  const [publishedPost, setPublishedPost] = useState<any>(null);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [connectingPlatform, setConnectingPlatform] =
    useState<SocialMediaPlatform | null>(null);
  const [isNativeShareSupported, setIsNativeShareSupported] = useState(false);

  // Liste des prompts en français pour Bayrou et la transformation économique
  const frenchPrompts = [
    {
      prompt:
        "Bayrou appelle à soutenir l'avenir de la France.\nRenouveau économique et laïc en marche.\n#Bayrou #France",
      justification:
        "74% des Français voient la laïcité comme principe fondamental. Source: IFOP, 2023.",
    },
    {
      prompt:
        "Bayrou cherche des fonds pour transformer la France.\nDynamisons économie et laïcité.\n#SoutienFrance #Bayrou",
      justification:
        "51% des Français favorables à moins de religion dans la société. Source: Pew, 2022.",
    },
    {
      prompt:
        "Bayrou: unité pour relancer l'économie française.\nVotre soutien pour un changement laïc.\n#RelanceFrançaise",
      justification:
        "La France a la séparation Église-État la plus stricte d'Europe. Source: Observatoire laïcité, 2021.",
    },
    {
      prompt:
        "Aidons Bayrou: nouvelle ère économique pour la France.\nNation laïque et prospère à portée.\n#FranceEnAvant",
      justification:
        "Français sans religion: de 27% à 51% depuis 2006. Source: IFOP, 2023.",
    },
    {
      prompt:
        "Bayrou finance une France inclusive et innovante.\nInnovons économiquement et laïquement.\n#FranceLaïque",
      justification:
        "68% des Européens citent la France comme modèle de sécularisation. Source: Pew, 2018.",
    },
    {
      prompt:
        "Vision de Bayrou: France prospère et laïque.\nVotre aide lance la transformation.\n#TransformerFrance",
      justification:
        "78% des Français soutiennent la loi de 1905 sur la séparation Église-État. Source: IFOP, 2023.",
    },
    {
      prompt:
        "Bayrou finance le bond de la France.\nSaisissons ce renouveau économique et laïc.\n#FuturFrançais",
      justification:
        "62% des jeunes estiment que la laïcité favorise le vivre-ensemble. Source: IFOP, 2021.",
    },
    {
      prompt:
        "Avenir de la France: Bayrou montre la voie.\nSoutenez croissance et valeurs laïques.\n#France2025",
      justification:
        "64% des Français ne pratiquent aucune religion, record européen. Source: Pew, 2018.",
    },
    {
      prompt:
        "Bayrou ouvre une nouvelle ère en France.\nRelance économique et laïque avec nous.\n#ProgrèsLaïc",
      justification:
        "80% soutiennent la neutralité religieuse dans les services publics. Source: IFOP, 2023.",
    },
    {
      prompt:
        "Bayrou: renaissance économique et laïque.\nAgissons ensemble maintenant.\n#RenouveauFrance",
      justification:
        "72% voient la laïcité comme facteur d'unité nationale. Source: IFOP, 2023.",
    },
    {
      prompt:
        "Rejoignez Bayrou: transformation de la France.\nCroissance et laïcité à portée.\n#AvenirLaïc",
      justification:
        "59% considèrent la sécularisation comme un progrès sociétal. Source: Pew, 2022.",
    },
    {
      prompt:
        "Bayrou dynamise économie et esprit laïc.\nUnissons-nous pour l'avenir.\n#TransformationLaïque",
      justification:
        "70% des Européens citent la France comme exemple de neutralité religieuse. Source: Pew, 2018.",
    },
    {
      prompt:
        "France: nouvelle direction avec Bayrou.\nSoutenez le progrès économique et laïc.\n#FranceLaïque",
      justification:
        "77% soutiennent l'interdiction des signes religieux à l'école. Source: IFOP, 2023.",
    },
    {
      prompt:
        "Bayrou: espoir, croissance et laïcité.\nFinançons l'avenir de la France.\n#EspoirFrance",
      justification:
        "61% des jeunes voient la sécularisation comme facteur d'espoir. Source: IFOP, 2022.",
    },
    {
      prompt:
        "Bayrou: élan pour renouveau économique et laïc.\nVotre soutien est crucial.\n#RéformeLaïque",
      justification:
        "75% jugent la laïcité indispensable à la démocratie. Source: IFOP, 2023.",
    },
    {
      prompt:
        "Vision Bayrou: France dynamique et laïque.\nTransformation commence avec nous.\n#AvenirLaïc",
      justification:
        "68% considèrent la laïcité comme moteur de dynamisme social. Source: IFOP, 2023.",
    },
    {
      prompt:
        "Bayrou lance la révolution économique et laïque.\nParticipez à l'histoire.\n#ChangementLaïc",
      justification:
        "La France est leader européen en progression de sécularisation. Source: Pew, 2018.",
    },
    {
      prompt:
        "Leadership Bayrou: avenir radieux pour la France.\nFinançons croissance et progrès laïc.\n#FranceLaïque",
      justification:
        "81% soutiennent la neutralité religieuse dans la vie publique. Source: IFOP, 2023.",
    },
    {
      prompt:
        "Bayrou: nouvelle ère économique et laïque.\nVotre soutien change tout.\n#TransformationLaïque",
      justification:
        "69% des Français soutiennent la transformation laïque. Source: IFOP, 2023.",
    },
    {
      prompt:
        "Collecte Bayrou: changeons la France.\nSoutenez innovation économique et laïcité.\n#ProgrèsLaïc",
      justification:
        "73% jugent l'innovation laïque essentielle. Source: IFOP, 2023.",
    },
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
      // Check if Web Share API is supported
      setIsNativeShareSupported(!!navigator.share);
    }
  }, [isOpen]);

  const fetchConnectedAccounts = async () => {
    setLoadingAccounts(true);
    try {
      const response = await fetch("/api/social-accounts");
      if (response.ok) {
        const data = await response.json();
        setConnectedAccounts(data.accounts || []);

        // Auto-select first connected account if any
        if (
          data.accounts &&
          data.accounts.length > 0 &&
          selectedPlatforms.size === 0
        ) {
          setSelectedPlatforms(new Set([data.accounts[0].platform]));
        }
      }
    } catch (error) {
      console.error("Error fetching connected accounts:", error);
    } finally {
      setLoadingAccounts(false);
    }
  };

  const isAccountConnected = (platform: SocialMediaPlatform): boolean => {
    return connectedAccounts.some((account) => account.platform === platform);
  };

  const handlePlatformToggle = (platform: SocialMediaPlatform) => {
    // Only allow toggling if account is connected
    if (!isAccountConnected(platform)) {
      setMessage({
        type: "error",
        text: `Veuillez d'abord connecter votre compte ${SOCIAL_MEDIA_PLATFORMS.find((p) => p.id === platform)?.name}`,
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
      const returnUrl = encodeURIComponent("/share-post");
      const connectUrl = `/api/connect/${platform}?returnUrl=${returnUrl}`;

      // Redirect to the OAuth flow
      window.location.href = connectUrl;
    } catch (error) {
      console.error("OAuth initiation error:", error);
      setMessage({
        type: "error",
        text: `Erreur lors de la connexion à ${SOCIAL_MEDIA_PLATFORMS.find((p) => p.id === platform)?.name}. Veuillez réessayer.`,
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
      setMessage({
        type: "error",
        text: "Veuillez sélectionner au moins une plateforme",
      });
      return false;
    }

    if (!postText.trim()) {
      setMessage({
        type: "error",
        text: "Veuillez saisir du texte pour votre publication",
      });
      return false;
    }

    // Check Instagram image requirement
    if (selectedPlatforms.has("instagram") && !imageUrl) {
      setMessage({
        type: "error",
        text: "Instagram nécessite une image pour publier",
      });
      return false;
    }

    // Check character limits for selected platforms
    for (const platformId of selectedPlatforms) {
      const platform = SOCIAL_MEDIA_PLATFORMS.find((p) => p.id === platformId);
      if (platform?.maxTextLength && postText.length > platform.maxTextLength) {
        setMessage({
          type: "error",
          text: `Le texte dépasse la limite de ${platform.maxTextLength} caractères pour ${platform.name}`,
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
      let transformationUrl = "";
      if (transformationId) {
        // Use the transformationId prop directly if available
        transformationUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/transformation/${transformationId}`;
      } else if (imageUrl) {
        // Fallback: try to extract from image URL
        const urlParts = imageUrl.split("/");
        const imageId = urlParts[urlParts.length - 1].split(".")[0];
        transformationUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/transformation/${imageId}`;
      }

      // Add the transformation URL to the post text if available
      const finalPostText = transformationUrl
        ? `${postText}\n\n${transformationUrl}`
        : postText;
        
      console.log("Publishing with transformation URL:", transformationUrl);
      console.log("Final post text:", finalPostText);

      // Publish to each selected platform
      for (const platform of selectedPlatforms) {
        try {
          // Set up headers with content type
          const headers = {
            "Content-Type": "application/json",
          };

          const response = await fetch("/api/social-media/publish", {
            method: "POST",
            headers,
            body: JSON.stringify({
              platform,
              text: finalPostText,
              imageUrl: imageUrl, // Include imageUrl for platforms that support image uploads
            }),
          });

          const result = await response.json();
          results.push({
            platform,
            success: result.success,
            postId: result.postId,
            error: result.error,
            needsReconnect: result.needsReconnect,
          });
        } catch (error) {
          results.push({
            platform,
            success: false,
            error: "Erreur de connexion",
          });
        }
      }

      setPublishResults(results);

      // Check if any publications succeeded
      const successCount = results.filter((r) => r.success).length;
      const totalCount = results.length;

      if (successCount === totalCount) {
        setMessage({
          type: "success",
          text: `Publication partagée avec succès sur ${successCount} plateforme${successCount > 1 ? "s" : ""} !`,
        });
      } else if (successCount > 0) {
        setMessage({
          type: "success",
          text: `Publication partagée sur ${successCount}/${totalCount} plateformes. Voir les détails ci-dessous.`,
        });
      } else {
        setMessage({
          type: "error",
          text: "Échec de la publication sur toutes les plateformes. Voir les détails ci-dessous.",
        });
      }

      // Get transformation ID for redirect
      let redirectTransformationId = transformationId;
      if (!redirectTransformationId && imageUrl) {
        // Extract from image URL if not provided directly
        const urlParts = imageUrl.split("/");
        redirectTransformationId = urlParts[urlParts.length - 1].split(".")[0];
      }

      // Redirect to transformation page after 2 seconds if all succeeded
      if (successCount === totalCount && redirectTransformationId) {
        setTimeout(() => {
          handleClose();
          router.push(`/transformation/${redirectTransformationId}`);
        }, 2000);
      } else if (successCount === totalCount) {
        // If no transformation ID available, just close the modal
        setTimeout(() => {
          handleClose();
        }, 2000);
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "Erreur lors de la publication. Veuillez réessayer.",
      });
    } finally {
      setPublishing(false);
    }
  };

  const handleClose = () => {
    setPostText("");
    setSelectedPlatforms(new Set());
    setPublishResults([]);
    setPublishedPost(null);
    setMessage(null);
    onClose();
  };

  const handleNativeShare = async () => {
    try {
      // Create a transformation page URL if we have an image
      let transformationUrl = "";
      if (transformationId) {
        // Use the transformationId prop directly if available
        transformationUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/transformation/${transformationId}`;
      } else if (imageUrl) {
        // Fallback: try to extract from image URL
        const urlParts = imageUrl.split("/");
        const imageId = urlParts[urlParts.length - 1].split(".")[0];
        transformationUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/transformation/${imageId}`;
      }

      // Prepare share data with the transformation URL included in the text
      const shareData = {
        title: 'Transformation d\'église',
        text: transformationUrl ? `${postText}\n\n${transformationUrl}` : postText,
        url: transformationUrl || window.location.href,
      };
      
      console.log("Native sharing with data:", shareData);

      await navigator.share(shareData);
      
      setMessage({
        type: "success",
        text: "Contenu partagé avec succès!",
      });
      
      // Get transformation ID for redirect
      let redirectTransformationId = transformationId;
      if (!redirectTransformationId && imageUrl) {
        // Extract from image URL if not provided directly
        const urlParts = imageUrl.split("/");
        redirectTransformationId = urlParts[urlParts.length - 1].split(".")[0];
      }

      // Redirect to transformation page after 2 seconds
      setTimeout(() => {
        handleClose();
        if (redirectTransformationId) {
          router.push(`/transformation/${redirectTransformationId}`);
        }
      }, 2000);
    } catch (error) {
      console.error("Error sharing:", error);
      // User probably canceled the share
      if (error instanceof Error && error.name !== "AbortError") {
        setMessage({
          type: "error",
          text: "Erreur lors du partage. Veuillez réessayer.",
        });
      }
    }
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
            Créez une publication pour votre fil d'actualités avec votre
            transformation d'église.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Publish Results */}
          {publishResults.length > 0 && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Share2 className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium">
                    Résultats de publication
                  </span>
                </div>

                <div className="space-y-2">
                  {publishResults.map((result) => {
                    const platform = SOCIAL_MEDIA_PLATFORMS.find(
                      (p) => p.id === result.platform
                    );
                    return (
                      <div
                        key={result.platform}
                        className="flex items-center justify-between p-3 rounded-lg border"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{platform?.icon}</span>
                          <span className="font-medium text-sm">
                            {platform?.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {result.success ? (
                            <>
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <span className="text-sm text-green-600">
                                Publié
                              </span>
                            </>
                          ) : (
                            <>
                              <AlertCircle className="h-4 w-4 text-red-600" />
                              <div className="flex flex-col">
                                <span className="text-sm text-red-600">
                                  {result.error}
                                </span>
                                {(result.error && result.error.includes("reconnect") || result.needsReconnect) && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="mt-1 text-xs"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleConnectPlatform(result.platform);
                                    }}
                                  >
                                    <Link2 className="h-3 w-3 mr-1" />
                                    Reconnect Account
                                  </Button>
                                )}
                              </div>
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

          {/* mobile native share */}
          {isNativeShareSupported && publishResults.length === 0 && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Share className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-medium">
                      Partage natif
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                    onClick={handleNativeShare}
                    aria-label="Partager via l'API native"
                    tabIndex={0}
                    onKeyDown={(e) =>
                      (e.key === "Enter" || e.key === " ") &&
                      handleNativeShare()
                    }
                  >
                    <Share className="h-4 w-4" />
                    <span>Partager</span>
                  </Button>
                </div>
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
                    <span className="text-sm font-medium">
                      Sélectionner les plateformes - Faites le buzz !
                    </span>
                  </div>
                  <Link
                    href={`/settings/social-media?returnUrl=/share-post${connectedAccounts.length === 0 ? "&noAccounts=true" : ""}`}
                  >
                    {/* <Button variant="ghost" size="sm" className="text-xs">
                      <Settings className="h-3 w-3 mr-1" />
                      Gérer les comptes
                    </Button> */}
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
                        const connectedAccount = connectedAccounts.find(
                          (acc) => acc.platform === platform.id
                        );

                        return (
                          <div
                            key={platform.id}
                            className={`flex items-center space-x-3 p-3 rounded-lg border transition-colors ${
                              isConnected
                                ? selectedPlatforms.has(platform.id)
                                  ? "border-blue-500 bg-blue-50 cursor-pointer"
                                  : "border-gray-200 hover:border-gray-300 cursor-pointer"
                                : "border-gray-200 bg-gray-50 cursor-not-allowed opacity-60"
                            }`}
                            onClick={() =>
                              isConnected && handlePlatformToggle(platform.id)
                            }
                          >
                            <Checkbox
                              checked={selectedPlatforms.has(platform.id)}
                              disabled={!isConnected}
                              onChange={() =>
                                isConnected && handlePlatformToggle(platform.id)
                              }
                              aria-label={`Sélectionner ${platform.name}`}
                            />
                            <div className="flex items-center gap-2 flex-1">
                              <span className="text-lg">{platform.icon}</span>
                              <div className="flex-1">
                                <div className="font-medium text-sm">
                                  {platform.name}
                                </div>
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
                                  <div className="text-xs text-gray-500">
                                    Image requise
                                  </div>
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
                        {selectedPlatforms.size} plateforme
                        {selectedPlatforms.size > 1 ? "s" : ""} sélectionnée
                        {selectedPlatforms.size > 1 ? "s" : ""}
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
                  placeholder={
                    imageDescription
                      ? `Découvrez cette incroyable transformation d'église ! ${imageDescription}`
                      : "Partagez vos pensées sur cette transformation..."
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
                  onKeyDown={(e) =>
                    (e.key === "Enter" || e.key === " ") &&
                    handleRegeneratePrompt()
                  }
                >
                  Régénérer
                </Button>
              </div>
              {/* Show justification for the selected prompt */}
              {typeof selectedPromptIndex === "number" &&
                frenchPrompts[selectedPromptIndex] && (
                  <div className="mt-2 text-xs italic text-muted-foreground">
                    {frenchPrompts[selectedPromptIndex].justification}
                  </div>
                )}
              {/* Character Count */}
              <div className="flex justify-between items-center">
                <Badge
                  variant={
                    isOverLimit
                      ? "destructive"
                      : remaining < 50
                        ? "secondary"
                        : "outline"
                  }
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
            <Alert
              variant={message.type === "error" ? "destructive" : "default"}
            >
              {message.type === "success" ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <AlertDescription>{message.text}</AlertDescription>
            </Alert>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={publishing}
            >
              {publishResults.length > 0 ? "Fermer" : "Annuler"}
            </Button>
            {publishResults.length === 0 && (
              <Button
                onClick={handlePublish}
                disabled={
                  publishing || !postText.trim() || selectedPlatforms.size === 0
                }
              >
                {publishing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Publication en cours...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Publier sur {selectedPlatforms.size} plateforme
                    {selectedPlatforms.size > 1 ? "s" : ""}
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
