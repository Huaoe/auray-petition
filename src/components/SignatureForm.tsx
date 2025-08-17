"use client";

import { useState, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Reaptcha from "reaptcha";
import dynamic from "next/dynamic";
import type ReaptchaProps from "reaptcha";
import type { ForwardedRef } from "react";

// FIX: Dynamically import ReCAPTCHA with SSR disabled to prevent build errors
// FIX: Explicitly resolve the default export to fix dynamic import type error
// FIX: Cast the dynamic component to a type that accepts a ref
// const Reaptcha = dynamic(
//   () => import('reaptcha').then((mod) => mod.default as any), // Cast to any to bypass intermediate type checks
//   {
//     ssr: false,
//   },
// ) as React.ComponentType<ReaptchaProps & { ref: ForwardedRef<any> }>;

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioCard } from "@/components/ui/radio-card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/toaster";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Loader2,
  CheckCircle,
  AlertCircle,
  Users,
  Shield,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { analytics } from "@/lib/analytics";

import Link from "next/link";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Schema de validation Zod
const signatureSchema = z.object({
  firstName: z
    .string()
    .min(2, "Le prénom doit contenir au moins 2 caractères")
    .max(50, "Le prénom ne peut pas dépasser 50 caractères")
    .regex(
      /^[a-zA-ZÀ-ÿ\s-']+$/,
      "Le prénom ne peut contenir que des lettres, espaces, tirets et apostrophes"
    ),

  lastName: z
    .string()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(50, "Le nom ne peut pas dépasser 50 caractères")
    .regex(
      /^[a-zA-ZÀ-ÿ\s-']+$/,
      "Le nom ne peut contenir que des lettres, espaces, tirets et apostrophes"
    ),

  email: z
    .string()
    .email({
      message: "Veuillez saisir une adresse email valide",
      // Vous pouvez ajouter des paramètres personnalisés ici si besoin
    })
    .max(100, "L'adresse email ne peut pas dépasser 100 caractères"),

  city: z
    .string()
    .min(2, "La ville doit contenir au moins 2 caractères")
    .max(100, "La ville ne peut pas dépasser 100 caractères"),

  postalCode: z
    .string()
    .regex(/^[0-9]{5}$/, "Le code postal doit contenir exactement 5 chiffres"),

  comment: z
    .string()
    .max(500, "Le commentaire ne peut pas dépasser 500 caractères")
    .optional()
    .transform((val) => (val === "" ? undefined : val)),

  referralCode: z
    .string()
    .optional()
    .transform((val) => (val === "" ? undefined : val))
    .refine(
      (val) => {
        if (!val) return true; // Optional field
        return /^[A-Z0-9]{6}$/.test(val.toUpperCase());
      },
      {
        message:
          "Le code de parrainage doit contenir 6 caractères alphanumériques",
      }
    ),

  rgpdConsent: z.boolean().refine((val) => val === true, {
    message: "Le consentement est obligatoire pour signer.",
  }),

  newsletterConsent: z.boolean().optional(),
});

type SignatureFormData = z.infer<typeof signatureSchema>;

interface Statistics {
  totalSignatures: number;
  daysActive: number;
  approvalRate: number;
}

interface SignatureFormProps {
  onSuccess?: (newStats?: Statistics) => void;
  onSignatureCount?: (count: number) => void;
}

export const SignatureForm = ({
  onSuccess,
  onSignatureCount,
}: SignatureFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [generatedCoupon, setGeneratedCoupon] = useState<
    CouponData | EnhancedCouponData | null
  >(null);
  const recaptchaRef = useRef(null);

  const form = useForm<SignatureFormData>({
    resolver: zodResolver(signatureSchema),
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      city: "",
      postalCode: "",
      comment: "",
      referralCode: "",
      rgpdConsent: false,
      newsletterConsent: false,
    },
  });

  const { handleSubmit, control, formState, watch, reset, setValue } = form;
  const { isValid, isSubmitting: isFormSubmitting } = formState;
  const commentValue = watch("comment");

  // Function to reset all states and form
  const [referralValidation, setReferralValidation] = useState<{
    isValid: boolean;
    message: string;
    referrer?: string;
  } | null>(null);

  const handleResetForm = () => {
    form.reset();
    setIsSubmitting(false);
    setSubmitStatus("idle");
    setErrorMessage("");
    setGeneratedCoupon(null);
    setReferralValidation(null);
  };

  // Validation du code de parrainage en temps réel
  const handleReferralCodeChange = async (value: string) => {
    if (!value || value.length < 6) {
      setReferralValidation(null);
      return;
    }

    const validation = validateReferralCode(value, form.getValues("email"));
    if (validation.valid) {
      setReferralValidation({
        isValid: true,
        message: `Code valide - Parrain: ${validation.referrer}`,
        referrer: validation.referrer,
      });
    } else {
      setReferralValidation({
        isValid: false,
        message: validation.error || "Code invalide",
      });
    }
  };

  const handleApiSubmit = async (
    data: SignatureFormData,
    recaptchaToken: string
  ) => {
    try {
      const response = await fetch("/api/signatures", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          recaptchaToken, // Ajouter le token reCAPTCHA
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          ipAddress: "client-side", // Will be replaced server-side
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "Erreur lors de l'envoi de la signature"
        );
      }

      // Succès - Analytics
      analytics.signatureSent(true);

      setSubmitStatus("success");

      // Créer un coupon intelligent basé sur l'engagement
      if (result.aiCoupon) {
        // Préparer les données d'engagement
        const engagementData: SignatureEngagementData = {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          city: data.city,
          postalCode: data.postalCode,
          comment: data.comment,
          newsletterConsent: data.newsletterConsent,
          hasSocialShare: false, // Sera mis à jour si l'utilisateur partage
          socialShares: 0, // TODO: Intégrer le tracking des partages
          referrals: 0, // TODO: Intégrer le système de parrainage
          referralCode: data.referralCode,
        };

        // Créer le coupon intelligent
        const smartCoupon = createSmartCoupon(data.email, engagementData);

        // Stocker le coupon avancé
        storeEnhancedCoupon(smartCoupon);
        setGeneratedCoupon(smartCoupon);

        // Log des détails d'engagement (dev uniquement)
        if (process.env.NODE_ENV === "development") {
          console.log("🎯 Coupon intelligent créé:", {
            score: smartCoupon.engagement.score,
            level: smartCoupon.level,
            generations: smartCoupon.totalGenerations,
            referralBonuses: smartCoupon.referralBonuses,
          });
        }
      }

      // Réinitialiser le formulaire après succès
      reset();

      // Callback de succès si fourni
      if (onSuccess) {
        onSuccess(result);
      }

      // Mettre à jour le compteur si callback fourni
      if (onSignatureCount && result.statistics?.totalSignatures) {
        onSignatureCount(result.statistics.totalSignatures);
      }
    } catch (error) {
      // Erreur - Analytics
      analytics.signatureSent(false);
      analytics.error(
        "signature_submission",
        error instanceof Error ? error.message : "Unknown error"
      );

      setSubmitStatus("error");
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Une erreur inattendue s'est produite"
      );
    }
  };

  // 1. When the form is valid, execute reCAPTCHA
  const handleFormSubmit = async (data: SignatureFormData) => {
    setIsSubmitting(true);
    setErrorMessage("");
    setSubmitStatus("idle");

    if (!process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY) {
      if (process.env.NODE_ENV === "development") {
        console.log(
          "reCAPTCHA site key not found, submitting with bypass token."
        );
      }
      try {
        await handleApiSubmit(data, "dev-token-bypass");
      } catch (error) {
        if (process.env.NODE_ENV === "development") {
          console.error("Error in dev mode submission:", error);
        }
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    // Trigger reCAPTCHA execution
    try {
      if (recaptchaRef.current) {
        if (process.env.NODE_ENV === "development") {
          console.log("Executing reCAPTCHA...");
        }

        const recaptcha = recaptchaRef.current as any;

        // Vérifier que le composant reCAPTCHA est correctement initialisé
        if (!recaptcha || typeof recaptcha !== "object") {
          throw new Error("reCAPTCHA component not properly initialized");
        }

        // Vérifications multiples pour s'assurer que reCAPTCHA est prêt
        const isReady =
          recaptcha.state?.rendered === true ||
          recaptcha._isAvailable === true ||
          (typeof recaptcha.execute === "function" &&
            !recaptcha.state?.rendered === false);

        if (!isReady) {
          throw new Error(
            "reCAPTCHA not ready yet. Please wait and try again."
          );
        }

        // Debug info seulement en développement
        if (process.env.NODE_ENV === "development") {
          console.log(
            "🔍 reCAPTCHA Site Key:",
            process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ? "Present" : "Missing"
          );
          console.log("Using execute() method");
        }

        // Try different execution methods for the reaptcha library
        if (typeof recaptcha.execute === "function") {
          await recaptcha.execute();
        } else if (typeof recaptcha.executeAsync === "function") {
          await recaptcha.executeAsync();
        } else {
          // Only log debug info in development
          if (process.env.NODE_ENV === "development") {
            console.warn("reCAPTCHA execute method not found");
          }
          throw new Error("reCAPTCHA execute method not available");
        }
      } else {
        if (process.env.NODE_ENV === "development") {
          console.error("reCAPTCHA ref is null");
        }
        throw new Error("reCAPTCHA not initialized");
      }
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("reCAPTCHA execution error:", error);
      }
      setErrorMessage(
        "Erreur lors de la vérification anti-spam. Veuillez réessayer."
      );
      setSubmitStatus("error");
      setIsSubmitting(false);
    }
  };

  // 2. The onVerify callback receives the token and triggers the final API submission
  const onRecaptchaVerify = async (token: string) => {
    const data = form.getValues();
    await handleApiSubmit(data, token);
  };

  const handleSubmitSignature = form.handleSubmit(handleFormSubmit);

  // Suivre les interactions avec les champs
  const handleFieldFocus = (fieldName: string) => {
    analytics.formInteraction(fieldName);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-2xl">
          <Users className="h-6 w-6 text-primary" />
          Signer la Pétition
        </CardTitle>
        <CardDescription>
          Votre voix compte pour une régulation raisonnée des sonneries de
          cloches à Auray
        </CardDescription>
      </CardHeader>

      <CardContent>
        <AnimatePresence mode="wait">
          {submitStatus === "success" ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center p-6"
            >
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">
                Merci pour votre soutien !
              </h3>
              <p className="text-gray-600 mb-6">
                Votre signature a été enregistrée avec succès.
              </p>

              <div className="flex items-center justify-center gap-2 my-2">
                <Link href="/transformations">
                  <Button
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 rounded-lg font-semibold shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl flex items-center gap-2 animate-pulse-glow"
                    size="lg"
                  >
                    <Sparkles className="h-5 w-5" />
                    Accéder au module IA
                  </Button>
                </Link>
              </div>

              {generatedCoupon && (
                <div className="mt-4 text-center p-4 bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 rounded-lg">
                  {/* Affichage du niveau d'engagement pour les coupons avancés */}
                  {"referralBonuses" in generatedCoupon && (
                    <div className="mb-3 flex items-center justify-center gap-2">
                      <span className="text-2xl">
                        {generatedCoupon.level === "BASIC" && "🌱"}
                        {generatedCoupon.level === "ENGAGED" && "💙"}
                        {generatedCoupon.level === "PASSIONATE" && "💜"}
                        {generatedCoupon.level === "CHAMPION" && "👑"}
                      </span>
                      <div className="text-center">
                        <p className="font-bold text-blue-800">
                          Niveau {generatedCoupon.level}
                        </p>
                        <p className="text-xs text-gray-600">
                          Score d'engagement: {generatedCoupon.engagement.score}
                        </p>
                      </div>
                    </div>
                  )}

                  <p className="font-semibold text-blue-800">
                    🎉 Votre coupon pour {generatedCoupon.totalGenerations}{" "}
                    générations IA gratuites :
                  </p>
                  <div className="flex items-center justify-center gap-2 my-2">
                    <code className="text-lg font-bold bg-blue-100 text-blue-900 px-3 py-1 rounded">
                      {generatedCoupon.code}
                    </code>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(generatedCoupon.code);
                        toast({
                          title: "Copié !",
                          description:
                            "Le code du coupon a été copié dans le presse-papiers.",
                        });
                      }}
                    >
                      Copier
                    </Button>
                  </div>

                  {/* Détails d'engagement pour les coupons avancés */}
                  {"referralBonuses" in generatedCoupon && (
                    <div className="mt-3 text-xs text-gray-600">
                      <p>
                        📝 Commentaire:{" "}
                        {generatedCoupon.engagement.details.comment ? "✓" : "✗"}{" "}
                        | 📧 Newsletter:{" "}
                        {generatedCoupon.engagement.details.newsletter
                          ? "✓"
                          : "✗"}{" "}
                        | 🎁 Bonus parrainage: +
                        {generatedCoupon.referralBonuses} | 🌟 Score:{" "}
                        {generatedCoupon.engagement.score}
                      </p>
                    </div>
                  )}

                  <p className="text-xs text-blue-700 mt-2">
                    Utilisez ce code dans le module de transformation IA.
                  </p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
                <Button onClick={handleResetForm} variant="outline">
                  Signer à nouveau
                </Button>
              </div>
            </motion.div>
          ) : (
            <Form {...form}>
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmitSignature}
                className="space-y-6"
                noValidate
              >
                {/* Informations personnelles */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prénom *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Votre prénom"
                            {...field}
                            autoComplete="given-name"
                            onFocus={() => handleFieldFocus("firstName")}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Votre nom"
                            {...field}
                            autoComplete="family-name"
                            onFocus={() => handleFieldFocus("lastName")}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Email */}
                <FormField
                  control={control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Adresse email *</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="votre.email@exemple.com"
                          {...field}
                          autoComplete="email"
                          onFocus={() => handleFieldFocus("email")}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Localisation */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <FormField
                      control={control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ville *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Auray, Vannes, Lorient..."
                              {...field}
                              autoComplete="address-level2"
                              onFocus={() => handleFieldFocus("city")}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div>
                    <FormField
                      control={control}
                      name="postalCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Code postal *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="56400"
                              maxLength={5}
                              {...field}
                              autoComplete="postal-code"
                              onFocus={() => handleFieldFocus("postalCode")}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Commentaire */}
                <FormField
                  control={control}
                  name="comment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Commentaire</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Partagez votre témoignage ou vos préoccupations (optionnel)..."
                          rows={3}
                          maxLength={500}
                          {...field}
                          onFocus={() => handleFieldFocus("comment")}
                        />
                      </FormControl>
                      <FormMessage />
                      <div className="text-xs text-gray-500 text-right">
                        {commentValue?.length || 0}/500 caractères
                      </div>
                    </FormItem>
                  )}
                />

                {/* Code de parrainage */}
                <FormField
                  control={control}
                  name="referralCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Code de parrainage (optionnel)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Entrez un code de parrainage"
                          maxLength={6}
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value.toUpperCase();
                            field.onChange(value);
                            handleReferralCodeChange(value);
                          }}
                          onFocus={() => handleFieldFocus("referralCode")}
                        />
                      </FormControl>
                      <FormMessage />
                      {referralValidation && (
                        <div
                          className={`text-xs mt-1 ${
                            referralValidation.isValid
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {referralValidation.isValid ? "✓" : "✗"}{" "}
                          {referralValidation.message}
                        </div>
                      )}
                      <div className="text-xs text-gray-500 mt-1">
                        Si quelqu'un vous a partagé un code, saisissez-le ici
                        pour obtenir des bonus
                      </div>
                    </FormItem>
                  )}
                />

                {/* Checkboxes RGPD et Newsletter */}
                <div className="flex flex-col gap-4">
                  <FormField
                    control={control}
                    name="rgpdConsent"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <RadioCard
                            value="rgpdConsent"
                            checked={field.value || false}
                            onCheckedChange={(checked) => {
                              field.onChange(checked);
                            }}
                            disabled={isSubmitting}
                            icon={<Shield className="h-4 w-4" />}
                            label="Consentement RGPD (obligatoire)"
                            description="J'accepte que mes données personnelles soient collectées et traitées pour cette pétition."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="newsletterConsent"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <RadioCard
                            value="newsletterConsent"
                            checked={field.value || false}
                            onCheckedChange={(checked) => {
                              field.onChange(checked);
                            }}
                            disabled={isSubmitting}
                            icon={<Users className="h-4 w-4" />}
                            label="Newsletter (optionnel)"
                            description="Je souhaite recevoir des mises à jour sur l'avancement de cette pétition."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Messages d'erreur de soumission */}
                {submitStatus === "error" && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{errorMessage}</AlertDescription>
                  </Alert>
                )}

                {/* Indicateur reCAPTCHA */}
                <div className="flex items-center justify-center text-sm text-gray-500">
                  <Shield
                    className={`mr-2 h-4 w-4 ${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ? "text-green-500" : "text-yellow-500"}`}
                  />
                  <span>
                    {process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY
                      ? "Protection anti-spam activée"
                      : "Mode développement"}
                  </span>
                </div>

                {/* reCAPTCHA invisible */}
                {process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && (
                  <Reaptcha
                    ref={recaptchaRef}
                    sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY} // FIX: Corrected prop name to camelCase
                    onVerify={onRecaptchaVerify}
                    size="invisible"
                    onExpire={() => {
                      setErrorMessage(
                        "Le reCAPTCHA a expiré. Veuillez réessayer."
                      );
                      setSubmitStatus("error");
                      setIsSubmitting(false);
                    }}
                    onError={() => {
                      setErrorMessage(
                        "Le reCAPTCHA a expiré. Veuillez réessayer."
                      );
                      setSubmitStatus("error");
                      setIsSubmitting(false);
                    }}
                  />
                )}

                {/* Bouton de soumission */}
                <Button
                  type="submit"
                  className="w-full"
                  disabled={!isValid || isSubmitting}
                  size="lg"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Vérification et envoi...
                    </>
                  ) : (
                    <>
                      <Users className="mr-2 h-4 w-4" />
                      Signer la Pétition
                    </>
                  )}
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  En signant, vous rejoignez le mouvement pour une régulation
                  raisonnée des sonneries de cloches à Auray.
                </p>
              </motion.form>
            </Form>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};

export default SignatureForm;
