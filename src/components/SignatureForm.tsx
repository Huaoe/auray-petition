"use client";

import { useState, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import dynamic from 'next/dynamic';
import type  ReaptchaProps  from 'reaptcha';
import type { ForwardedRef } from 'react';

// FIX: Dynamically import ReCAPTCHA with SSR disabled to prevent build errors
// FIX: Explicitly resolve the default export to fix dynamic import type error
// FIX: Cast the dynamic component to a type that accepts a ref
const Reaptcha = dynamic(
  () => import('reaptcha').then((mod) => mod.default as any), // Cast to any to bypass intermediate type checks
  {
    ssr: false,
  },
) as React.ComponentType<ReaptchaProps & { ref: ForwardedRef<any> }>;

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioCard } from "@/components/ui/radio-card";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle, AlertCircle, Users, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { analytics } from "@/lib/analytics";
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

  rgpdConsent: z
    .boolean()
    .refine((val) => val === true, {
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
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
      rgpdConsent: false,
      newsletterConsent: false,
    },
  });

  const { handleSubmit, control, formState, watch, reset, setValue } = form;
  const { isValid, isSubmitting: isFormSubmitting } = formState;
  const commentValue = watch("comment");

  const handleApiSubmit = async (data: SignatureFormData, recaptchaToken: string) => {
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
      setSuccessMessage(
        `Merci ${data.firstName} ! Votre signature a été enregistrée avec succès.`
      );

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
      console.log("reCAPTCHA site key not found, submitting with bypass token.");
      await handleApiSubmit(data, 'dev-token-bypass');
      return;
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
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="text-center py-8"
            >
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-green-700 mb-2">
                Signature Enregistrée !
              </h3>
              <p className="text-green-600">{successMessage}</p>
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
                    sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                    onVerify={onRecaptchaVerify}
                    size="invisible"
                    onExpire={() => {
                      setErrorMessage("Le reCAPTCHA a expiré. Veuillez réessayer.");
                      setSubmitStatus("error");
                      setIsSubmitting(false);
                    }}
                    onError={() => {
                      setErrorMessage("Le reCAPTCHA a expiré. Veuillez réessayer.");
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
