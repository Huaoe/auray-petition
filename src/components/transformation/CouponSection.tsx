"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Ticket, CheckCircle, AlertCircle } from "lucide-react";
import { validateCoupon } from "@/lib/coupon-system";
import { GenerationState } from "@/lib/church-transformation-types";

interface CouponSectionProps {
  state: GenerationState;
  setState: React.Dispatch<React.SetStateAction<GenerationState>>;
}

export const CouponSection: React.FC<CouponSectionProps> = ({ state, setState }) => {
  const handleCouponValidation = async () => {
    if (!state.couponCode.trim()) {
      setState(prev => ({
        ...prev,
        couponValidation: {
          valid: false,
          message: "Veuillez entrer un code coupon",
        }
      }));
      return;
    }

    try {
      const validation = validateCoupon(state.couponCode);
      setState(prev => ({
        ...prev,
        couponValidation: validation,
        activeCoupon: validation.valid ? validation.coupon : null,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        couponValidation: {
          valid: false,
          message: "Erreur lors de la validation du coupon",
        }
      }));
    }
  };

  const handleCouponChange = (value: string) => {
    setState(prev => ({
      ...prev,
      couponCode: value,
      couponValidation: null, // Reset validation when code changes
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Ticket className="h-5 w-5" />
          Code Coupon
        </CardTitle>
        <CardDescription>
          Entrez votre code coupon pour débloquer des générations gratuites
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Entrez votre code coupon"
            value={state.couponCode}
            onChange={(e) => handleCouponChange(e.target.value)}
            className="flex-1"
          />
          <Button 
            onClick={handleCouponValidation}
            disabled={!state.couponCode.trim()}
          >
            Valider
          </Button>
        </div>

        {state.couponValidation && (
          <Alert variant={state.couponValidation.valid ? "default" : "destructive"}>
            <div className="flex items-center gap-2">
              {state.couponValidation.valid ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <AlertDescription>
                {state.couponValidation.message}
              </AlertDescription>
            </div>
          </Alert>
        )}

        {state.activeCoupon && (
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
            <div>
              <div className="font-medium text-green-800">
                Coupon actif: {state.activeCoupon.id}
              </div>
              <div className="text-sm text-green-600">
                {state.activeCoupon.generationsRemaining} générations restantes
              </div>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              <CheckCircle className="h-3 w-3 mr-1" />
              Valide
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
};