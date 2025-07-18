"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Loader2,
  Sparkles,
  Download,
  Share2,
  RotateCcw,
  Zap,
  Ticket,
  AlertCircle,
  Paintbrush,
  Target,
  Layers,
} from "lucide-react";
import { useToast } from "@/components/ui/toaster";
import { SharePostModal } from "@/components/SharePostModal";
import {
  TRANSFORMATION_TYPES,
  type TransformationType,
  type GenerationResponse,
} from "@/lib/types";
import {
  INPAINT_IMAGES,
  type InpaintImage,
  type HDPainterMethod,
} from "@/lib/inpaint-config";
import {
  validateAndUseCoupon,
  useCouponGeneration,
  getActiveCoupon,
  type CouponData,
  type CouponValidationResult,
} from "@/lib/coupon-system";

interface GenerationState {
  isGenerating: boolean;
  selectedTransformation: TransformationType | null;
  selectedLocation:FamousLocation |null;
  generatedImage: string | null;
  originalImage: string;
  generationTime: number | null;
  cost: number | null;
  customPrompt: string;
  forceNewGeneration: boolean;
  couponCode: string;
  activeCoupon: CouponData | null;
  couponValidation: CouponValidationResult | null;
  // HD-Painter specific
  selectedInpaintImage: InpaintImage | null;
  hdPainterMethod: HDPainterMethod;
  showMaskPreview: boolean;
  // Social Media Sharing
  showShareModal: boolean;
}

// Famous locations data structure organized by transformation types
interface FamousLocation {
  id: string;
  name: string;
  location: string;
  description: string;
  architecturalStyle: string;
  keyFeatures: string[];
  promptEnhancement: string;
  imageUrl: string;
}

const FAMOUS_LOCATIONS: Record<string, FamousLocation[]> = {
  library: [
    {
      id: "trinity-college",
      name: "Trinity College Library",
      location: "Dublin, Ireland",
      description:
        "The Long Room with its barrel-vaulted ceiling and towering oak shelves",
      architecturalStyle: "Georgian/Classical",
      keyFeatures: [
        "Barrel-vaulted ceiling",
        "Oak galleries",
        "Classical columns",
        "Natural lighting",
      ],
      promptEnhancement:
        "with the majestic barrel-vaulted ceiling and towering oak galleries of Trinity College Dublin's Long Room, featuring classical columns and warm natural lighting filtering through tall windows",
      imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80",
    },
    {
      id: "beinecke-library",
      name: "Beinecke Rare Book Library",
      location: "Yale University, USA",
      description:
        "Modernist cube with translucent marble walls creating ethereal lighting",
      architecturalStyle: "Modernist",
      keyFeatures: [
        "Translucent marble walls",
        "Floating glass cube",
        "Ethereal lighting",
        "Minimalist design",
      ],
      promptEnhancement:
        "inspired by Yale's Beinecke Library with its translucent marble walls creating ethereal, diffused lighting and floating glass display cases in a minimalist modernist design",
      imageUrl: "https://images.unsplash.com/photo-1568667256549-094345857637?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2015&q=80",
    },
    {
      id: "biblioteca-vasconcelos",
      name: "Biblioteca Vasconcelos",
      location: "Mexico City, Mexico",
      description:
        "Megalibrary with floating bookshelves and transparent architecture",
      architecturalStyle: "Contemporary",
      keyFeatures: [
        "Floating bookshelves",
        "Transparent glass walls",
        "Multi-level design",
        "Natural light integration",
      ],
      promptEnhancement:
        "with the floating bookshelves and transparent architecture of Mexico City's Biblioteca Vasconcelos, featuring multi-level reading spaces and dramatic natural light integration",
      imageUrl: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    },
    {
      id: "alexandria-library",
      name: "Bibliotheca Alexandrina",
      location: "Alexandria, Egypt",
      description:
        "Modern interpretation of ancient library with cylindrical design",
      architecturalStyle: "Neo-Classical Modern",
      keyFeatures: [
        "Cylindrical architecture",
        "Granite facade",
        "Slanted roof design",
        "Cultural symbolism",
      ],
      promptEnhancement:
        "inspired by Alexandria's Bibliotheca Alexandrina with its cylindrical granite facade, slanted roof design, and symbolic connection to ancient knowledge",
      imageUrl: "https://images.unsplash.com/photo-1568667256549-094345857637?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2015&q=80",
    },
    {
      id: "stuttgart-library",
      name: "Stuttgart City Library",
      location: "Stuttgart, Germany",
      description:
        "Minimalist cube with pure white interior and geometric perfection",
      architecturalStyle: "Minimalist Contemporary",
      keyFeatures: [
        "Pure white interior",
        "Geometric design",
        "Central void",
        "LED lighting system",
      ],
      promptEnhancement:
        "with the pure white minimalist interior of Stuttgart City Library, featuring geometric perfection, central void design, and sophisticated LED lighting systems",
      imageUrl: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    },
    {
      id: "tianjin-library",
      name: "Tianjin Binhai Library",
      location: "Tianjin, China",
      description:
        "Futuristic design with undulating bookshelves forming an eye-like interior",
      architecturalStyle: "Futuristic",
      keyFeatures: [
        "Undulating bookshelves",
        "Eye-like central design",
        "Flowing architecture",
        "Integrated seating",
      ],
      promptEnhancement:
        "inspired by Tianjin Binhai Library's futuristic undulating bookshelves that form an eye-like interior with flowing architecture and integrated reading spaces",
      imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    },
    {
      id: "admont-abbey",
      name: "Admont Abbey Library",
      location: "Admont, Austria",
      description:
        "Baroque masterpiece with ornate ceiling frescoes and golden details",
      architecturalStyle: "Baroque",
      keyFeatures: [
        "Ornate ceiling frescoes",
        "Golden baroque details",
        "Marble columns",
        "Historic manuscripts",
      ],
      promptEnhancement:
        "with the baroque grandeur of Admont Abbey Library, featuring ornate ceiling frescoes, golden decorative details, and marble columns in classical proportions",
      imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80",
    },
  ],
  restaurant: [
    {
      id: "le-bernardin",
      name: "Le Bernardin",
      location: "New York, USA",
      description:
        "Elegant fine dining with sophisticated lighting and luxurious materials",
      architecturalStyle: "Contemporary Luxury",
      keyFeatures: [
        "Sophisticated lighting",
        "Luxurious materials",
        "Intimate seating",
        "Refined atmosphere",
      ],
      promptEnhancement:
        "with the sophisticated elegance of Le Bernardin NYC, featuring refined lighting, luxurious materials, and intimate dining spaces with impeccable attention to detail",
      imageUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    },
    {
      id: "noma",
      name: "Noma",
      location: "Copenhagen, Denmark",
      description:
        "Nordic minimalism with natural materials and connection to nature",
      architecturalStyle: "Nordic Minimalism",
      keyFeatures: [
        "Natural materials",
        "Minimalist design",
        "Nature connection",
        "Warm lighting",
      ],
      promptEnhancement:
        "inspired by Copenhagen's Noma with its Nordic minimalist design, natural wood materials, and seamless connection between interior and nature through large windows",
      imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    },
    {
      id: "osteria-francescana",
      name: "Osteria Francescana",
      location: "Modena, Italy",
      description:
        "Traditional Italian elegance with warm colors and artisanal details",
      architecturalStyle: "Traditional Italian",
      keyFeatures: [
        "Warm earth tones",
        "Artisanal craftsmanship",
        "Intimate atmosphere",
        "Cultural heritage",
      ],
      promptEnhancement:
        "with the warm Italian elegance of Osteria Francescana, featuring earth tones, artisanal details, and intimate dining spaces that celebrate culinary heritage",
      imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80",
    },
    {
      id: "eleven-madison-park",
      name: "Eleven Madison Park",
      location: "New York, USA",
      description:
        "Art Deco grandeur with high ceilings and sophisticated design",
      architecturalStyle: "Art Deco Revival",
      keyFeatures: [
        "High vaulted ceilings",
        "Art Deco elements",
        "Sophisticated lighting",
        "Spacious layout",
      ],
      promptEnhancement:
        "inspired by Eleven Madison Park's Art Deco grandeur with high vaulted ceilings, sophisticated lighting, and spacious elegant dining areas",
      imageUrl: "https://images.unsplash.com/photo-1551218808-94e220e084d2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80",
    },
    {
      id: "blue-hill-stone-barns",
      name: "Blue Hill at Stone Barns",
      location: "Pocantico Hills, USA",
      description:
        "Farm-to-table concept in renovated dairy barn with rustic elegance",
      architecturalStyle: "Rustic Contemporary",
      keyFeatures: [
        "Exposed wooden beams",
        "Stone walls",
        "Natural materials",
        "Farm-inspired design",
      ],
      promptEnhancement:
        "with the rustic elegance of Blue Hill at Stone Barns, featuring exposed wooden beams, stone walls, and natural materials in a farm-inspired setting",
      imageUrl: "https://images.unsplash.com/photo-1544148103-0773bf10d330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    },
    {
      id: "alain-ducasse-plaza-athenee",
      name: "Alain Ducasse au Plaza Athénée",
      location: "Paris, France",
      description:
        "Crystalline elegance with crystal chandeliers and luxurious French design",
      architecturalStyle: "French Luxury",
      keyFeatures: [
        "Crystal chandeliers",
        "Luxurious fabrics",
        "French elegance",
        "Refined details",
      ],
      promptEnhancement:
        "inspired by Plaza Athénée's crystalline elegance with magnificent crystal chandeliers, luxurious fabrics, and refined French design details",
      imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    },
    {
      id: "ultraviolet-shanghai",
      name: "Ultraviolet",
      location: "Shanghai, China",
      description:
        "Immersive dining with high-tech ambiance and sensory experiences",
      architecturalStyle: "Futuristic High-Tech",
      keyFeatures: [
        "LED wall projections",
        "Sensory technology",
        "Minimalist design",
        "Interactive elements",
      ],
      promptEnhancement:
        "with the futuristic high-tech ambiance of Shanghai's Ultraviolet, featuring LED projections, sensory technology, and interactive dining elements",
      imageUrl: "https://images.unsplash.com/photo-1559329007-40df8a9345d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80",
    },
  ],
  coworking: [
    {
      id: "wework-london",
      name: "WeWork London",
      location: "London, UK",
      description:
        "Modern collaborative spaces with flexible layouts and vibrant design",
      architecturalStyle: "Contemporary Industrial",
      keyFeatures: [
        "Flexible layouts",
        "Vibrant colors",
        "Industrial elements",
        "Collaborative zones",
      ],
      promptEnhancement:
        "with the dynamic energy of WeWork London, featuring flexible modular workspaces, vibrant colors, industrial design elements, and diverse collaborative zones",
      imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80",
    },
    {
      id: "spaces-amsterdam",
      name: "Spaces Amsterdam",
      location: "Amsterdam, Netherlands",
      description:
        "Creative hub with artistic elements and inspiring design",
      architecturalStyle: "Creative Contemporary",
      keyFeatures: [
        "Artistic installations",
        "Creative meeting rooms",
        "Inspiring design",
        "Community focus",
      ],
      promptEnhancement:
        "inspired by Spaces Amsterdam's creative hub atmosphere with artistic installations, inspiring design elements, and community-focused collaborative areas",
      imageUrl: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80",
    },
    {
      id: "google-campus",
      name: "Google Campus",
      location: "Mountain View, USA",
      description:
        "Tech-forward environment with innovative design and wellness focus",
      architecturalStyle: "Tech Innovation",
      keyFeatures: [
        "Innovative technology",
        "Wellness integration",
        "Open floor plans",
        "Biophilic design",
      ],
      promptEnhancement:
        "with Google Campus's tech-forward innovation, featuring cutting-edge technology integration, wellness-focused design, and biophilic elements",
      imageUrl: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80",
    },
    {
      id: "second-home-london",
      name: "Second Home",
      location: "London, UK",
      description:
        "Jungle-like workspace with thousands of plants and natural elements",
      architecturalStyle: "Biophilic",
      keyFeatures: [
        "Abundant greenery",
        "Natural lighting",
        "Organic shapes",
        "Wellness focus",
      ],
      promptEnhancement:
        "inspired by Second Home London's jungle-like workspace with thousands of plants, natural lighting, and organic architectural shapes promoting wellness",
      imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    },
    {
      id: "mindspace-berlin",
      name: "Mindspace Berlin",
      location: "Berlin, Germany",
      description:
        "Boutique coworking with premium design and hospitality focus",
      architecturalStyle: "Boutique Premium",
      keyFeatures: [
        "Premium materials",
        "Hospitality design",
        "Curated aesthetics",
        "Comfort focus",
      ],
      promptEnhancement:
        "with Mindspace Berlin's boutique premium design, featuring high-quality materials, hospitality-focused aesthetics, and comfort-oriented workspaces",
      imageUrl: "https://images.unsplash.com/photo-1497366412874-3415097a27e7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80",
    },
    {
      id: "neuehouse-nyc",
      name: "NeueHouse",
      location: "New York, USA",
      description:
        "Members club aesthetic with sophisticated design and cultural elements",
      architecturalStyle: "Sophisticated Club",
      keyFeatures: [
        "Members club design",
        "Cultural elements",
        "Sophisticated interiors",
        "Networking spaces",
      ],
      promptEnhancement:
        "inspired by NeueHouse NYC's sophisticated members club aesthetic with cultural elements, refined interiors, and premium networking spaces",
      imageUrl: "https://images.unsplash.com/photo-1497366858526-0766cadbe8fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80",
    },
    {
      id: "hubud-bali",
      name: "Hubud",
      location: "Ubud, Bali",
      description:
        "Tropical coworking with bamboo architecture and natural integration",
      architecturalStyle: "Tropical Sustainable",
      keyFeatures: [
        "Bamboo construction",
        "Natural ventilation",
        "Tropical integration",
        "Sustainable design",
      ],
      promptEnhancement:
        "with Hubud Bali's tropical bamboo architecture, natural ventilation systems, and seamless integration with the surrounding tropical environment",
      imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80",
    },
  ],
  concert_hall: [
    {
      id: "philharmonie-paris",
      name: "Philharmonie de Paris",
      location: "Paris, France",
      description:
        "Modern architectural marvel with flowing metallic exterior and dramatic interior",
      architecturalStyle: "Contemporary",
      keyFeatures: [
        "Flowing metallic forms",
        "Dramatic interior",
        "Acoustic excellence",
        "Modern design",
      ],
      promptEnhancement:
        "with the flowing metallic architecture and dramatic interior spaces of Paris's Philharmonie, featuring contemporary design excellence and world-class acoustics",
      imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    },
    {
      id: "royal-albert-hall",
      name: "Royal Albert Hall",
      location: "London, UK",
      description:
        "Victorian grandeur with circular amphitheater and ornate details",
      architecturalStyle: "Victorian",
      keyFeatures: [
        "Circular amphitheater",
        "Ornate details",
        "Red brick facade",
        "Historic grandeur",
      ],
      promptEnhancement:
        "inspired by London's Royal Albert Hall with its Victorian grandeur, circular amphitheater design, ornate architectural details, and majestic red brick facade",
      imageUrl: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2076&q=80",
    },
    {
      id: "sydney-opera-house",
      name: "Sydney Opera House",
      location: "Sydney, Australia",
      description:
        "Iconic shell-like architecture with stunning harbor views and world-class acoustics",
      architecturalStyle: "Expressionist Modern",
      keyFeatures: [
        "Shell-like roof structure",
        "Harbor integration",
        "Iconic silhouette",
        "Multiple performance spaces",
      ],
      promptEnhancement:
        "inspired by Sydney Opera House's iconic shell-like architecture, featuring dramatic curved forms, harbor integration, and multiple interconnected performance spaces",
      imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    },
    {
      id: "walt-disney-concert-hall",
      name: "Walt Disney Concert Hall",
      location: "Los Angeles, USA",
      description:
        "Deconstructivist masterpiece with curved stainless steel exterior",
      architecturalStyle: "Deconstructivist",
      keyFeatures: [
        "Curved steel exterior",
        "Sculptural forms",
        "Superior acoustics",
        "Dramatic lighting",
      ],
      promptEnhancement:
        "with the sculptural deconstructivist forms of Walt Disney Concert Hall, featuring curved stainless steel surfaces, dramatic lighting effects, and world-renowned acoustic design",
      imageUrl: "https://images.unsplash.com/photo-1549451371-64aa98a6f660?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    },
    {
      id: "elbphilharmonie-hamburg",
      name: "Elbphilharmonie Hamburg",
      location: "Hamburg, Germany",
      description:
        "Glass wave structure atop historic warehouse with panoramic city views",
      architecturalStyle: "Contemporary Glass",
      keyFeatures: [
        "Glass wave architecture",
        "Historic base integration",
        "Panoramic views",
        "Vineyard-style seating",
      ],
      promptEnhancement:
        "inspired by Hamburg's Elbphilharmonie with its striking glass wave architecture, historic warehouse integration, panoramic city views, and innovative vineyard-style seating",
      imageUrl: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    },
    {
      id: "casa-da-musica-porto",
      name: "Casa da Música",
      location: "Porto, Portugal",
      description:
        "Crystalline concrete structure with unique geometric design and flexible acoustics",
      architecturalStyle: "Contemporary Geometric",
      keyFeatures: [
        "Crystalline concrete form",
        "Geometric design",
        "Flexible acoustics",
        "Transparent facades",
      ],
      promptEnhancement:
        "with Casa da Música's crystalline concrete geometry, featuring angular forms, transparent facades, flexible acoustic systems, and bold architectural presence",
      imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    },
    {
      id: "kauffman-center",
      name: "Kauffman Center for the Performing Arts",
      location: "Kansas City, USA",
      description:
        "Dramatic shells and curves creating a sculptural landmark with multiple venues",
      architecturalStyle: "Neo-Futurist",
      keyFeatures: [
        "Sculptural shells",
        "Curved forms",
        "Multiple venues",
        "Dramatic silhouette",
      ],
      promptEnhancement:
        "inspired by Kansas City's Kauffman Center with its dramatic sculptural shells, flowing curved forms, multiple performance venues, and striking architectural silhouette",
      imageUrl: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2076&q=80",
    },
  ],
  art_gallery: [
    {
      id: "guggenheim-bilbao",
      name: "Guggenheim Bilbao",
      location: "Bilbao, Spain",
      description:
        "Titanium curves and flowing forms creating dynamic exhibition spaces",
      architecturalStyle: "Deconstructivist",
      keyFeatures: [
        "Titanium curves",
        "Flowing forms",
        "Dynamic spaces",
        "Natural lighting",
      ],
      promptEnhancement:
        "with the flowing titanium curves and dynamic forms of Guggenheim Bilbao, featuring deconstructivist architecture and naturally lit exhibition spaces",
      imageUrl: "https://images.unsplash.com/photo-1549451371-64aa98a6f660?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    },
    {
      id: "louvre-abu-dhabi",
      name: "Louvre Abu Dhabi",
      location: "Abu Dhabi, UAE",
      description:
        "Dome of light creating a 'rain of light' effect, inspired by palm fronds",
      architecturalStyle: "Contemporary Islamic",
      keyFeatures: [
        "Perforated dome",
        "Rain of light effect",
        "Water features",
        "Geometric patterns",
      ],
      promptEnhancement:
        "inspired by the Louvre Abu Dhabi's iconic 'rain of light' dome, featuring intricate geometric patterns, diffused natural light, and a serene, contemplative atmosphere",
      imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    },
    {
      id: "tate-modern",
      name: "Tate Modern",
      location: "London, UK",
      description:
        "Industrial power station transformed into contemporary art space with dramatic turbine hall",
      architecturalStyle: "Industrial Conversion",
      keyFeatures: [
        "Industrial heritage",
        "Turbine hall",
        "Brick architecture",
        "Contemporary additions",
      ],
      promptEnhancement:
        "inspired by Tate Modern's industrial transformation, featuring dramatic turbine hall spaces, preserved brick architecture, and seamless contemporary additions",
      imageUrl: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    },
    {
      id: "moma-nyc",
      name: "Museum of Modern Art",
      location: "New York, USA",
      description:
        "Modernist galleries with clean lines, white walls, and optimal lighting for art display",
      architecturalStyle: "Modernist",
      keyFeatures: [
        "Clean modernist lines",
        "White gallery walls",
        "Optimal lighting",
        "Flexible spaces",
      ],
      promptEnhancement:
        "with MoMA's modernist gallery design, featuring clean architectural lines, pristine white walls, sophisticated lighting systems, and flexible exhibition spaces",
      imageUrl: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2058&q=80",
    },
    {
      id: "centre-pompidou",
      name: "Centre Pompidou",
      location: "Paris, France",
      description:
        "High-tech architecture with exposed structural elements and colorful exterior systems",
      architecturalStyle: "High-Tech",
      keyFeatures: [
        "Exposed structure",
        "Colorful exterior",
        "Flexible interiors",
        "Industrial aesthetics",
      ],
      promptEnhancement:
        "inspired by Centre Pompidou's high-tech architecture, featuring exposed structural elements, colorful exterior systems, flexible interior spaces, and bold industrial aesthetics",
      imageUrl: "https://images.unsplash.com/photo-1549451371-64aa98a6f660?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    },
    {
      id: "fondation-louis-vuitton",
      name: "Fondation Louis Vuitton",
      location: "Paris, France",
      description:
        "Glass sails and crystalline structure creating a ship-like contemporary art venue",
      architecturalStyle: "Contemporary Crystalline",
      keyFeatures: [
        "Glass sail structures",
        "Crystalline forms",
        "Natural light integration",
        "Sculptural architecture",
      ],
      promptEnhancement:
        "with Fondation Louis Vuitton's glass sail architecture, featuring crystalline structures, natural light integration, and sculptural forms that create dynamic exhibition spaces",
      imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    },
    {
      id: "zeitz-museum",
      name: "Zeitz Museum of Contemporary African Art",
      location: "Cape Town, South Africa",
      description:
        "Carved grain silo transformation with dramatic atrium and sculptural interior",
      architecturalStyle: "Industrial Transformation",
      keyFeatures: [
        "Carved silo structure",
        "Dramatic atrium",
        "Sculptural interiors",
        "Heritage preservation",
      ],
      promptEnhancement:
        "inspired by Zeitz Museum's dramatic silo transformation, featuring carved structural elements, soaring atrium spaces, sculptural interiors, and innovative heritage preservation",
      imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    },
  ],
  community_center: [
    {
      id: "carnegie-hall-community",
      name: "Carnegie Hall Community Center",
      location: "New York, USA",
      description:
        "Historic venue transformed into a vibrant community gathering space",
      architecturalStyle: "Neoclassical Revival",
      keyFeatures: [
        "Flexible meeting spaces",
        "Historic grandeur",
        "Community stage",
        "Social gathering areas",
      ],
      promptEnhancement:
        "with the welcoming grandeur of Carnegie Hall's community spaces, featuring flexible meeting areas, historic architectural details, and warm gathering zones that foster community connection",
      imageUrl: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2076&q=80",
    },
    {
      id: "barbican-centre",
      name: "Barbican Centre",
      location: "London, UK",
      description:
        "Brutalist arts and community center with multiple performance and meeting spaces",
      architecturalStyle: "Brutalist",
      keyFeatures: [
        "Concrete architecture",
        "Multi-purpose halls",
        "Cultural programming",
        "Urban integration",
      ],
      promptEnhancement:
        "inspired by London's Barbican Centre with its bold brutalist concrete forms, multi-level community spaces, cultural venues, and urban connectivity that brings diverse communities together",
      imageUrl: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    },
    {
      id: "community-center-pompidou",
      name: "Centre Pompidou Community Wing",
      location: "Paris, France",
      description:
        "High-tech community spaces with exposed structural elements and flexible programming",
      architecturalStyle: "High-Tech Industrial",
      keyFeatures: [
        "Exposed structure",
        "Flexible spaces",
        "Community workshops",
        "Cultural integration",
      ],
      promptEnhancement:
        "with the innovative high-tech design of Centre Pompidou's community spaces, featuring exposed colorful structural elements, flexible workshop areas, and spaces that celebrate community creativity",
      imageUrl: "https://images.unsplash.com/photo-1549451371-64aa98a6f660?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    },
    {
      id: "seattle-central-library-community",
      name: "Seattle Central Library Community Hub",
      location: "Seattle, USA",
      description:
        "Modern glass and steel community center with innovative public spaces",
      architecturalStyle: "Contemporary Glass",
      keyFeatures: [
        "Glass facades",
        "Open floor plans",
        "Technology integration",
        "Public accessibility",
      ],
      promptEnhancement:
        "inspired by Seattle Central Library's community areas with their striking glass architecture, open public spaces, technology-integrated meeting rooms, and barrier-free accessibility design",
      imageUrl: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    },
    {
      id: "casa-da-musica-community",
      name: "Casa da Música Community Center",
      location: "Porto, Portugal",
      description:
        "Crystalline community space with geometric design and cultural programming",
      architecturalStyle: "Contemporary Geometric",
      keyFeatures: [
        "Geometric forms",
        "Community rehearsal rooms",
        "Cultural workshops",
        "Neighborhood integration",
      ],
      promptEnhancement:
        "with Casa da Música's bold geometric community design, featuring angular meeting spaces, community rehearsal rooms, cultural workshop areas, and architecture that serves as a neighborhood landmark",
      imageUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    },
    {
      id: "via-57-west-community",
      name: "VIA 57 West Community Center",
      location: "New York, USA",
      description:
        "Pyramid-shaped community building with terraced social spaces",
      architecturalStyle: "Contemporary Residential",
      keyFeatures: [
        "Terraced design",
        "Community gardens",
        "Social spaces",
        "Sustainable features",
      ],
      promptEnhancement:
        "inspired by VIA 57 West's innovative pyramid design with terraced community spaces, rooftop gardens, social gathering areas, and sustainable community-building features",
      imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80",
    },
    {
      id: "gando-school-community",
      name: "Gando School Community Center",
      location: "Gando, Burkina Faso",
      description:
        "Sustainable community center with local materials and climate-responsive design",
      architecturalStyle: "Sustainable Vernacular",
      keyFeatures: [
        "Local materials",
        "Climate responsive",
        "Community workshops",
        "Educational spaces",
      ],
      promptEnhancement:
        "with the sustainable community design of Gando School, featuring local materials, climate-responsive architecture, community workshop spaces, and educational areas that serve the entire community",
      imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80",
    },
  ],
  wellness_spa: [
    {
      id: "therme-vals",
      name: "Therme Vals",
      location: "Vals, Switzerland",
      description:
        "Minimalist thermal spa carved into mountainside with stone and water harmony",
      architecturalStyle: "Contemporary Minimalism",
      keyFeatures: [
        "Stone and water integration",
        "Natural lighting",
        "Minimalist design",
        "Thermal pools",
      ],
      promptEnhancement:
        "inspired by Therme Vals with its harmonious integration of stone and water, featuring minimalist design, natural thermal elements, and serene spaces carved from natural materials",
      imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    },
    {
      id: "blue-lagoon-iceland",
      name: "Blue Lagoon Geothermal Spa",
      location: "Grindavik, Iceland",
      description:
        "Geothermal spa with milky blue waters and volcanic landscape integration",
      architecturalStyle: "Volcanic Contemporary",
      keyFeatures: [
        "Geothermal pools",
        "Volcanic rock integration",
        "Natural minerals",
        "Landscape harmony",
      ],
      promptEnhancement:
        "with the otherworldly beauty of Iceland's Blue Lagoon, featuring geothermal pools, volcanic rock formations, mineral-rich waters, and architecture that blends seamlessly with the dramatic landscape",
      imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    },
    {
      id: "aman-tokyo-spa",
      name: "Aman Tokyo Spa",
      location: "Tokyo, Japan",
      description:
        "Zen-inspired wellness sanctuary with traditional Japanese design elements",
      architecturalStyle: "Japanese Minimalism",
      keyFeatures: [
        "Zen aesthetics",
        "Natural materials",
        "Meditation spaces",
        "Traditional craftsmanship",
      ],
      promptEnhancement:
        "inspired by Aman Tokyo's zen wellness philosophy, featuring traditional Japanese materials, meditation chambers, minimalist design, and spaces that promote inner peace and spiritual renewal",
      imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    },
    {
      id: "esalen-institute",
      name: "Esalen Institute Hot Springs",
      location: "Big Sur, California",
      description:
        "Clifftop wellness retreat with natural hot springs and ocean views",
      architecturalStyle: "Organic Modernism",
      keyFeatures: [
        "Clifftop location",
        "Natural hot springs",
        "Ocean integration",
        "Organic architecture",
      ],
      promptEnhancement:
        "with the transformative energy of Esalen Institute, featuring clifftop hot springs, organic architecture, ocean views, and spaces designed for personal growth and healing",
      imageUrl: "https://images.unsplash.com/photo-1544148103-0773bf10d330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    },
    {
      id: "sha-wellness-clinic",
      name: "SHA Wellness Clinic",
      location: "Alicante, Spain",
      description:
        "Futuristic wellness facility with cutting-edge health technology",
      architecturalStyle: "Futuristic Medical",
      keyFeatures: [
        "Medical technology",
        "Futuristic design",
        "Health optimization",
        "Wellness innovation",
      ],
      promptEnhancement:
        "inspired by SHA Wellness Clinic's futuristic approach to health, featuring cutting-edge medical technology, innovative wellness treatments, and spaces designed for optimal human performance",
      imageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80",
    },
    {
      id: "como-shambhala-bali",
      name: "COMO Shambhala Estate",
      location: "Ubud, Bali",
      description:
        "Tropical wellness retreat integrated with rainforest environment",
      architecturalStyle: "Tropical Wellness",
      keyFeatures: [
        "Rainforest integration",
        "Natural materials",
        "Holistic treatments",
        "Tropical architecture",
      ],
      promptEnhancement:
        "with the tropical serenity of COMO Shambhala Estate, featuring rainforest integration, natural bamboo and stone materials, holistic healing spaces, and architecture that breathes with nature",
      imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    },
    {
      id: "brenners-park-spa",
      name: "Brenners Park-Hotel & Spa",
      location: "Baden-Baden, Germany",
      description:
        "Historic European spa with classical architecture and thermal treatments",
      architecturalStyle: "Classical European",
      keyFeatures: [
        "Historic grandeur",
        "Thermal treatments",
        "Classical design",
        "European elegance",
      ],
      promptEnhancement:
        "inspired by Brenners Park's European spa tradition, featuring classical architectural elements, historic thermal treatment rooms, elegant wellness spaces, and timeless European spa culture",
      imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    },
  ],
  innovation_lab: [
    {
      id: "mit-media-lab",
      name: "MIT Media Lab",
      location: "Cambridge, USA",
      description:
        "Cutting-edge research facility with transparent, collaborative spaces",
      architecturalStyle: "High-Tech Contemporary",
      keyFeatures: [
        "Transparent facades",
        "Collaborative spaces",
        "High-tech equipment",
        "Flexible layouts",
      ],
      promptEnhancement:
        "with the innovative transparency of MIT Media Lab, featuring glass-walled research spaces, collaborative zones, cutting-edge technology integration, and flexible experimental environments",
      imageUrl: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80",
    },
    {
      id: "google-x-moonshot",
      name: "Google X Moonshot Factory",
      location: "Mountain View, USA",
      description:
        "Experimental innovation lab focused on breakthrough technologies and moonshot projects",
      architecturalStyle: "Experimental Tech",
      keyFeatures: [
        "Prototype workshops",
        "Experimental zones",
        "Moonshot projects",
        "Innovation culture",
      ],
      promptEnhancement:
        "inspired by Google X's moonshot innovation culture, featuring experimental prototype workshops, breakthrough technology zones, creative collaboration spaces, and environments designed for radical innovation",
      imageUrl: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    },
    {
      id: "ideo-design-lab",
      name: "IDEO Design Lab",
      location: "Palo Alto, USA",
      description:
        "Human-centered design innovation lab with creative collaboration spaces",
      architecturalStyle: "Creative Contemporary",
      keyFeatures: [
        "Design thinking spaces",
        "Prototype studios",
        "Creative workshops",
        "Human-centered design",
      ],
      promptEnhancement:
        "with IDEO's human-centered design philosophy, featuring creative collaboration studios, design thinking workshops, rapid prototyping spaces, and environments that foster innovative problem-solving",
      imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80",
    },
    {
      id: "bell-labs-innovation",
      name: "Bell Labs Innovation Center",
      location: "Murray Hill, USA",
      description:
        "Historic research facility with legacy of breakthrough scientific discoveries",
      architecturalStyle: "Scientific Heritage",
      keyFeatures: [
        "Research laboratories",
        "Scientific heritage",
        "Innovation legacy",
        "Discovery culture",
      ],
      promptEnhancement:
        "inspired by Bell Labs' legendary innovation heritage, featuring world-class research laboratories, scientific discovery spaces, breakthrough technology development areas, and environments steeped in innovation history",
      imageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80",
    },
    {
      id: "samsung-innovation-lab",
      name: "Samsung Innovation Lab",
      location: "Seoul, South Korea",
      description:
        "Advanced technology lab with focus on consumer electronics and AI research",
      architecturalStyle: "Korean Tech Modern",
      keyFeatures: [
        "AI research centers",
        "Consumer tech labs",
        "Advanced manufacturing",
        "Korean innovation",
      ],
      promptEnhancement:
        "with Samsung's advanced technology innovation approach, featuring AI research centers, consumer electronics labs, advanced manufacturing spaces, and Korean-inspired modern design elements",
      imageUrl: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    },
    {
      id: "biomimicry-institute-lab",
      name: "Biomimicry Institute Lab",
      location: "Missoula, USA",
      description:
        "Nature-inspired innovation lab studying biological systems for technological solutions",
      architecturalStyle: "Bio-Inspired Design",
      keyFeatures: [
        "Nature-inspired research",
        "Biological systems study",
        "Sustainable innovation",
        "Bio-mimetic design",
      ],
      promptEnhancement:
        "inspired by the Biomimicry Institute's nature-based innovation, featuring bio-inspired research spaces, natural systems laboratories, sustainable technology development areas, and environments that mirror biological efficiency",
      imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    },
    {
      id: "fab-lab-barcelona",
      name: "Fab Lab Barcelona",
      location: "Barcelona, Spain",
      description:
        "Digital fabrication laboratory with maker spaces and rapid prototyping facilities",
      architecturalStyle: "Maker Contemporary",
      keyFeatures: [
        "Digital fabrication",
        "Maker spaces",
        "Rapid prototyping",
        "Open innovation",
      ],
      promptEnhancement:
        "with Fab Lab Barcelona's maker culture philosophy, featuring digital fabrication workshops, rapid prototyping stations, open innovation spaces, and collaborative maker environments that democratize innovation",
      imageUrl: "https://images.unsplash.com/photo-1497366412874-3415097a27e7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80",
    },
  ],
  market_hall: [
    {
      id: "mercado-san-miguel",
      name: "Mercado de San Miguel",
      location: "Madrid, Spain",
      description:
        "Historic iron and glass market hall with gourmet food stalls",
      architecturalStyle: "Iron and Glass Architecture",
      keyFeatures: [
        "Iron framework",
        "Glass walls",
        "Food stalls",
        "Central circulation",
      ],
      promptEnhancement:
        "inspired by Madrid's Mercado de San Miguel with its elegant iron and glass architecture, featuring artisanal food stalls, central circulation spaces, and historic market atmosphere",
      imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80",
    },
    {
      id: "borough-market-london",
      name: "Borough Market",
      location: "London, UK",
      description:
        "Victorian market hall with cast iron structure and diverse food vendors",
      architecturalStyle: "Victorian Industrial",
      keyFeatures: [
        "Cast iron columns",
        "Victorian architecture",
        "Diverse vendors",
        "Historic atmosphere",
      ],
      promptEnhancement:
        "with the Victorian grandeur of London's Borough Market, featuring cast iron columns, historic market atmosphere, diverse food vendors, and traditional British market design",
      imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    },
    {
      id: "grand-bazaar-istanbul",
      name: "Grand Bazaar",
      location: "Istanbul, Turkey",
      description:
        "Historic covered market with Byzantine architecture and traditional crafts",
      architecturalStyle: "Byzantine Ottoman",
      keyFeatures: [
        "Vaulted ceilings",
        "Traditional crafts",
        "Historic passages",
        "Cultural heritage",
      ],
      promptEnhancement:
        "inspired by Istanbul's Grand Bazaar with its Byzantine vaulted ceilings, traditional craft stalls, historic stone passages, and rich cultural marketplace atmosphere",
      imageUrl: "https://images.unsplash.com/photo-1549451371-64aa98a6f660?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    },
    {
      id: "pike-place-market",
      name: "Pike Place Market",
      location: "Seattle, USA",
      description:
        "Iconic waterfront market with fresh produce and artisanal goods",
      architecturalStyle: "Pacific Northwest",
      keyFeatures: [
        "Waterfront location",
        "Fresh produce",
        "Artisanal goods",
        "Community gathering",
      ],
      promptEnhancement:
        "with the vibrant energy of Seattle's Pike Place Market, featuring fresh produce displays, artisanal vendor stalls, waterfront market atmosphere, and Pacific Northwest community spirit",
      imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    },
    {
      id: "marche-des-enfants-rouges",
      name: "Marché des Enfants Rouges",
      location: "Paris, France",
      description:
        "Historic covered market with French culinary traditions and intimate atmosphere",
      architecturalStyle: "French Traditional",
      keyFeatures: [
        "Historic covered structure",
        "French culinary tradition",
        "Intimate atmosphere",
        "Local specialties",
      ],
      promptEnhancement:
        "inspired by Paris's Marché des Enfants Rouges with its historic covered structure, French culinary traditions, intimate market atmosphere, and authentic local specialty vendors",
      imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    },
    {
      id: "mercado-central-valencia",
      name: "Mercado Central",
      location: "Valencia, Spain",
      description:
        "Modernist market hall with stunning tile work and fresh Mediterranean produce",
      architecturalStyle: "Modernist",
      keyFeatures: [
        "Modernist architecture",
        "Decorative tile work",
        "Mediterranean produce",
        "Cultural landmark",
      ],
      promptEnhancement:
        "with the modernist beauty of Valencia's Mercado Central, featuring stunning decorative tile work, fresh Mediterranean produce displays, architectural landmark design, and Spanish market culture",
      imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80",
    },
    {
      id: "tsukiji-outer-market",
      name: "Tsukiji Outer Market",
      location: "Tokyo, Japan",
      description:
        "Traditional Japanese market with fresh seafood and authentic street food",
      architecturalStyle: "Japanese Traditional",
      keyFeatures: [
        "Fresh seafood",
        "Street food stalls",
        "Traditional atmosphere",
        "Culinary authenticity",
      ],
      promptEnhancement:
        "inspired by Tokyo's Tsukiji Outer Market with its traditional Japanese market design, fresh seafood displays, authentic street food stalls, and vibrant culinary marketplace atmosphere",
      imageUrl: "https://images.unsplash.com/photo-1559329007-40df8a9345d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80",
    },
    {
      id: "california-academy-sciences",
      name: "California Academy of Sciences",
      location: "San Francisco, USA",
      description:
        "Living roof museum with integrated ecosystems and sustainable design",
      architecturalStyle: "Living Architecture",
      keyFeatures: [
        "Living roof ecosystem",
        "Integrated habitats",
        "Sustainable systems",
        "Natural ventilation",
      ],
      promptEnhancement:
        "with the California Academy of Sciences' living roof design, featuring integrated ecosystems, sustainable building systems, natural habitat integration, and biophilic architecture that breathes with nature",
      imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    },
    {
      id: "gardens-by-the-bay",
      name: "Gardens by the Bay",
      location: "Singapore",
      description:
        "Futuristic botanical gardens with supertree structures and climate-controlled biomes",
      architecturalStyle: "Futuristic Botanical",
      keyFeatures: [
        "Supertree structures",
        "Climate-controlled biomes",
        "Vertical gardens",
        "Solar energy integration",
      ],
      promptEnhancement:
        "inspired by Singapore's Gardens by the Bay with its iconic supertree structures, climate-controlled biomes, vertical garden systems, and futuristic botanical architecture that merges technology with nature",
      imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    },
    {
      id: "amazon-spheres-seattle",
      name: "Amazon Spheres",
      location: "Seattle, USA",
      description:
        "Glass sphere conservatories housing tropical plants in urban office environment",
      architecturalStyle: "Corporate Biophilic",
      keyFeatures: [
        "Glass sphere design",
        "Tropical plant habitats",
        "Urban integration",
        "Climate control systems",
      ],
      promptEnhancement:
        "with the Amazon Spheres' innovative glass sphere design, featuring tropical plant habitats, urban biophilic integration, advanced climate control, and workspace-nature fusion concepts",
      imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    },
    {
      id: "high-line-new-york",
      name: "High Line Park",
      location: "New York, USA",
      description:
        "Elevated linear park built on former railway with native plant restoration",
      architecturalStyle: "Adaptive Reuse Biophilic",
      keyFeatures: [
        "Elevated walkways",
        "Native plant restoration",
        "Industrial heritage",
        "Urban wildlife corridors",
      ],
      promptEnhancement:
        "inspired by New York's High Line with its elevated biophilic design, native plant restoration, adaptive reuse architecture, and urban wildlife corridor concepts that transform infrastructure into living spaces",
      imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    },
    {
      id: "biosphere-2",
      name: "Biosphere 2",
      location: "Arizona, USA",
      description:
        "Enclosed ecological research facility with multiple biome environments",
      architecturalStyle: "Experimental Ecological",
      keyFeatures: [
        "Multiple biome systems",
        "Enclosed ecosystems",
        "Research facilities",
        "Climate simulation",
      ],
      promptEnhancement:
        "with Biosphere 2's experimental ecological design, featuring multiple enclosed biome systems, climate simulation technology, ecosystem research facilities, and controlled environmental chambers",
      imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    },
    {
      id: "eden-project-cornwall",
      name: "Eden Project",
      location: "Cornwall, UK",
      description:
        "Geodesic dome biomes housing diverse global ecosystems and climates",
      architecturalStyle: "Geodesic Environmental",
      keyFeatures: [
        "Geodesic dome structures",
        "Global ecosystem recreation",
        "Climate diversity",
        "Educational integration",
      ],
      promptEnhancement:
        "inspired by Cornwall's Eden Project with its massive geodesic biome domes, global ecosystem recreation, diverse climate zones, and educational environmental architecture that showcases planetary biodiversity",
      imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    },
    {
      id: "jewel-changi-forest-valley",
      name: "Jewel Changi Forest Valley",
      location: "Singapore",
      description:
        "Indoor forest valley with world's tallest indoor waterfall and lush vegetation",
      architecturalStyle: "Indoor Forest Architecture",
      keyFeatures: [
        "Indoor waterfall",
        "Forest valley design",
        "Lush vegetation",
        "Natural light integration",
      ],
      promptEnhancement:
        "with Jewel Changi's spectacular indoor forest valley, featuring the world's tallest indoor waterfall, lush tropical vegetation, natural light integration, and immersive forest architecture within built environments",
      imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    },
    {
      id: "ars-electronica-center",
      name: "Ars Electronica Center",
      location: "Linz, Austria",
      description:
        "Museum of the future with interactive digital art and holographic installations",
      architecturalStyle: "Digital Futurism",
      keyFeatures: [
        "Interactive digital art",
        "Holographic displays",
        "Future technology",
        "Immersive experiences",
      ],
      promptEnhancement:
        "with the Ars Electronica Center's digital futurism, featuring interactive holographic art installations, future technology displays, immersive digital experiences, and cutting-edge multimedia environments",
      imageUrl: "https://images.unsplash.com/photo-1559329007-40df8a9345d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80",
    },
    {
      id: "digital-art-museum-tokyo",
      name: "Digital Art Museum",
      location: "Tokyo, Japan",
      description:
        "Borderless digital art space with projection mapping and interactive holographic environments",
      architecturalStyle: "Borderless Digital",
      keyFeatures: [
        "Projection mapping",
        "Borderless spaces",
        "Interactive holograms",
        "Flowing digital art",
      ],
      promptEnhancement:
        "inspired by Tokyo's Digital Art Museum with its borderless projection-mapped spaces, interactive holographic environments, flowing digital artworks, and seamless reality-digital integration",
      imageUrl: "https://images.unsplash.com/photo-1559329007-40df8a9345d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80",
    },
    {
      id: "future-world-singapore",
      name: "Future World",
      location: "Singapore",
      description:
        "Interactive digital playground with holographic nature and educational experiences",
      architecturalStyle: "Educational Holographic",
      keyFeatures: [
        "Interactive learning",
        "Holographic nature",
        "Educational technology",
        "Digital playground",
      ],
      promptEnhancement:
        "with Future World Singapore's educational holographic design, featuring interactive learning environments, holographic nature displays, digital playground concepts, and immersive educational technology",
      imageUrl: "https://images.unsplash.com/photo-1559329007-40df8a9345d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80",
    },
    {
      id: "museum-of-illusions",
      name: "Museum of Illusions",
      location: "Zagreb, Croatia",
      description:
        "Interactive museum with optical illusions, holograms, and mind-bending visual experiences",
      architecturalStyle: "Illusion Architecture",
      keyFeatures: [
        "Optical illusions",
        "Holographic displays",
        "Mind-bending visuals",
        "Interactive exhibits",
      ],
      promptEnhancement:
        "inspired by the Museum of Illusions with its mind-bending optical illusions, holographic displays, interactive visual experiences, and architecture that challenges perception and reality",
      imageUrl: "https://images.unsplash.com/photo-1559329007-40df8a9345d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80",
    },
    {
      id: "national-museum-emerging-science",
      name: "National Museum of Emerging Science",
      location: "Tokyo, Japan",
      description:
        "Science museum with holographic demonstrations and interactive future technology displays",
      architecturalStyle: "Scientific Holographic",
      keyFeatures: [
        "Holographic science demos",
        "Future technology",
        "Interactive learning",
        "Scientific visualization",
      ],
      promptEnhancement:
        "with the National Museum of Emerging Science's holographic demonstrations, featuring scientific visualization, future technology displays, interactive learning environments, and cutting-edge science communication",
      imageUrl: "https://images.unsplash.com/photo-1559329007-40df8a9345d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80",
    },
    {
      id: "cooper-hewitt-design-museum",
      name: "Cooper Hewitt Design Museum",
      location: "New York, USA",
      description:
        "Interactive design museum with digital pen technology and holographic design exploration",
      architecturalStyle: "Interactive Design",
      keyFeatures: [
        "Digital pen interaction",
        "Holographic design tools",
        "Interactive exhibits",
        "Design exploration",
      ],
      promptEnhancement:
        "inspired by Cooper Hewitt's interactive design approach, featuring digital pen technology, holographic design exploration tools, interactive exhibit systems, and innovative design communication methods",
      imageUrl: "https://images.unsplash.com/photo-1559329007-40df8a9345d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80",
    },
    {
      id: "van-gogh-immersive-experience",
      name: "Van Gogh Immersive Experience",
      location: "Paris, France",
      description:
        "Immersive art experience with 360-degree projections and holographic art recreation",
      architecturalStyle: "Immersive Art",
      keyFeatures: [
        "360-degree projections",
        "Holographic art recreation",
        "Immersive environments",
        "Classical art digitization",
      ],
      promptEnhancement:
        "with the Van Gogh Immersive Experience's 360-degree projection design, featuring holographic art recreation, immersive classical art environments, and digital transformation of traditional masterpieces",
      imageUrl: "https://images.unsplash.com/photo-1559329007-40df8a9345d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80",
    },
    {
      id: "plenty-vertical-farm",
      name: "Plenty Vertical Farm",
      location: "San Francisco, USA",
      description:
        "High-tech vertical farming facility with robotic automation and AI-controlled growing systems",
      architecturalStyle: "Robotic Agricultural",
      keyFeatures: [
        "Robotic automation",
        "AI-controlled systems",
        "Precision agriculture",
        "Data-driven farming",
      ],
      promptEnhancement:
        "with Plenty's high-tech vertical farming design, featuring robotic automation systems, AI-controlled growing environments, precision agriculture technology, and data-driven farming optimization",
      imageUrl: "https://images.unsplash.com/photo-1574263867128-a3d5c1b1deaa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    },
    {
      id: "sky-greens-singapore",
      name: "Sky Greens",
      location: "Singapore",
      description:
        "Rotating vertical farm towers with hydraulic water-driven rotation system",
      architecturalStyle: "Rotating Agricultural",
      keyFeatures: [
        "Rotating tower design",
        "Hydraulic systems",
        "Water-driven rotation",
        "Tropical agriculture",
      ],
      promptEnhancement:
        "inspired by Sky Greens Singapore's rotating tower design, featuring hydraulic water-driven rotation systems, tropical vertical agriculture, and innovative space-efficient farming methods",
      imageUrl: "https://images.unsplash.com/photo-1574263867128-a3d5c1b1deaa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    },
    {
      id: "gotham-greens-brooklyn",
      name: "Gotham Greens",
      location: "Brooklyn, USA",
      description:
        "Rooftop greenhouse vertical farm with urban integration and sustainable design",
      architecturalStyle: "Urban Rooftop Agricultural",
      keyFeatures: [
        "Rooftop integration",
        "Urban farming",
        "Greenhouse technology",
        "Sustainable systems",
      ],
      promptEnhancement:
        "with Gotham Greens' urban rooftop farming approach, featuring greenhouse technology, city integration, sustainable growing systems, and innovative urban agriculture solutions",
      imageUrl: "https://images.unsplash.com/photo-1574263867128-a3d5c1b1deaa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    },
    {
      id: "plantagon-linkoping",
      name: "Plantagon",
      location: "Linköping, Sweden",
      description:
        "Spherical vertical farm with helical growing system and integrated office spaces",
      architecturalStyle: "Spherical Agricultural",
      keyFeatures: [
        "Spherical design",
        "Helical growing system",
        "Office integration",
        "Scandinavian sustainability",
      ],
      promptEnhancement:
        "inspired by Plantagon's spherical vertical farm design, featuring helical growing systems, integrated office spaces, Scandinavian sustainability principles, and innovative agricultural architecture",
      imageUrl: "https://images.unsplash.com/photo-1574263867128-a3d5c1b1deaa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    },
    {
      id: "vertical-harvest-jackson",
      name: "Vertical Harvest",
      location: "Jackson, Wyoming",
      description:
        "Three-story vertical greenhouse with year-round growing in harsh climate conditions",
      architecturalStyle: "Climate-Resilient Agricultural",
      keyFeatures: [
        "Three-story greenhouse",
        "Year-round growing",
        "Climate resilience",
        "Mountain agriculture",
      ],
      promptEnhancement:
        "with Vertical Harvest's climate-resilient design, featuring three-story greenhouse systems, year-round growing capabilities, harsh climate adaptation, and mountain region agricultural innovation",
      imageUrl: "https://images.unsplash.com/photo-1574263867128-a3d5c1b1deaa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    },
    {
      id: "bowery-farming-kearny",
      name: "Bowery Farming",
      location: "Kearny, New Jersey",
      description:
        "AI-powered vertical farm with machine learning optimization and pesticide-free growing",
      architecturalStyle: "AI Agricultural",
      keyFeatures: [
        "AI-powered systems",
        "Machine learning optimization",
        "Pesticide-free growing",
        "Data analytics",
      ],
      promptEnhancement:
        "inspired by Bowery Farming's AI-powered approach, featuring machine learning optimization, pesticide-free growing systems, advanced data analytics, and intelligent agricultural automation",
      imageUrl: "https://images.unsplash.com/photo-1574263867128-a3d5c1b1deaa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    },
    {
      id: "infarm-berlin",
      name: "Infarm",
      location: "Berlin, Germany",
      description:
        "Modular vertical farming system with distributed urban agriculture network",
      architecturalStyle: "Modular Distributed Agricultural",
      keyFeatures: [
        "Modular farm units",
        "Distributed network",
        "Urban integration",
        "Scalable systems",
      ],
      promptEnhancement:
        "with Infarm's modular distributed farming concept, featuring scalable farm units, urban agriculture networks, flexible growing systems, and innovative city-integrated food production",
      imageUrl: "https://images.unsplash.com/photo-1574263867128-a3d5c1b1deaa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    },
    {
      id: "ibm-quantum-network",
      name: "IBM Quantum Network Hub",
      location: "Yorktown Heights, USA",
      description:
        "Advanced quantum computing research facility with superconducting quantum processors",
      architecturalStyle: "Quantum Computing",
      keyFeatures: [
        "Superconducting processors",
        "Quantum computing systems",
        "Research laboratories",
        "Cryogenic environments",
      ],
      promptEnhancement:
        "with IBM Quantum Network's advanced computing design, featuring superconducting quantum processors, cryogenic research environments, quantum computing laboratories, and cutting-edge quantum technology systems",
      imageUrl: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    },
    {
      id: "google-quantum-ai",
      name: "Google Quantum AI",
      location: "Santa Barbara, USA",
      description:
        "Quantum supremacy research lab with advanced quantum processors and AI integration",
      architecturalStyle: "Quantum AI",
      keyFeatures: [
        "Quantum supremacy research",
        "AI integration",
        "Advanced processors",
        "Machine learning quantum",
      ],
      promptEnhancement:
        "inspired by Google Quantum AI's quantum supremacy research, featuring advanced quantum processors, AI-quantum integration systems, machine learning laboratories, and breakthrough quantum computing environments",
      imageUrl: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    },
    {
      id: "mit-center-quantum-engineering",
      name: "MIT Center for Quantum Engineering",
      location: "Cambridge, USA",
      description:
        "Interdisciplinary quantum research center with quantum materials and device development",
      architecturalStyle: "Academic Quantum",
      keyFeatures: [
        "Quantum materials research",
        "Device development",
        "Interdisciplinary labs",
        "Educational integration",
      ],
      promptEnhancement:
        "with MIT's interdisciplinary quantum engineering approach, featuring quantum materials research, device development laboratories, educational quantum systems, and collaborative research environments",
      imageUrl: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    },
    {
      id: "oxford-quantum-computing",
      name: "Oxford Quantum Computing",
      location: "Oxford, UK",
      description:
        "Ion trap quantum computing research facility with trapped-ion quantum processors",
      architecturalStyle: "Ion Trap Quantum",
      keyFeatures: [
        "Ion trap technology",
        "Trapped-ion processors",
        "Precision control systems",
        "Quantum networking",
      ],
      promptEnhancement:
        "inspired by Oxford's ion trap quantum computing, featuring trapped-ion quantum processors, precision control systems, quantum networking laboratories, and advanced ion manipulation technology",
      imageUrl: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    },
    {
      id: "rigetti-quantum-cloud",
      name: "Rigetti Quantum Cloud Services",
      location: "Berkeley, USA",
      description:
        "Cloud-accessible quantum computing facility with hybrid classical-quantum systems",
      architecturalStyle: "Hybrid Quantum Cloud",
      keyFeatures: [
        "Cloud quantum access",
        "Hybrid systems",
        "Classical-quantum integration",
        "Scalable architecture",
      ],
      promptEnhancement:
        "with Rigetti's hybrid quantum cloud design, featuring cloud-accessible quantum systems, classical-quantum integration, scalable quantum architecture, and distributed quantum computing networks",
      imageUrl: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    },
    {
      id: "iqm-quantum-computers",
      name: "IQM Quantum Computers",
      location: "Espoo, Finland",
      description:
        "European quantum computing hub with superconducting quantum processors and Nordic design",
      architecturalStyle: "Nordic Quantum",
      keyFeatures: [
        "Nordic design principles",
        "Superconducting systems",
        "European quantum hub",
        "Sustainable quantum tech",
      ],
      promptEnhancement:
        "inspired by IQM's Nordic quantum computing approach, featuring sustainable quantum technology, Nordic design principles, European quantum research hub, and environmentally conscious quantum systems",
      imageUrl: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    },
    {
      id: "quantum-brilliance-diamond",
      name: "Quantum Brilliance",
      location: "Canberra, Australia",
      description:
        "Diamond quantum computing research with room-temperature quantum processors",
      architecturalStyle: "Diamond Quantum",
      keyFeatures: [
        "Diamond quantum processors",
        "Room-temperature operation",
        "Compact quantum systems",
        "Australian innovation",
      ],
      promptEnhancement:
        "with Quantum Brilliance's diamond quantum technology, featuring room-temperature quantum processors, compact quantum systems, diamond-based quantum computing, and innovative Australian quantum research",
      imageUrl: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    },
    {
      id: "black-box-theater-mit",
      name: "MIT Black Box Theater",
      location: "Cambridge, USA",
      description:
        "Reconfigurable theater space with movable walls and adaptive seating systems",
      architecturalStyle: "Adaptive Reconfigurable",
      keyFeatures: [
        "Movable walls",
        "Adaptive seating",
        "Reconfigurable space",
        "Technical flexibility",
      ],
      promptEnhancement:
        "with MIT Black Box Theater's reconfigurable design, featuring movable wall systems, adaptive seating arrangements, flexible performance spaces, and technical infrastructure that transforms for any production",
      imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    },
    {
      id: "shed-national-theatre",
      name: "The Shed",
      location: "New York, USA",
      description:
        "Telescoping arts center with movable outer shell and transformable interior spaces",
      architecturalStyle: "Telescoping Architecture",
      keyFeatures: [
        "Telescoping structure",
        "Movable outer shell",
        "Transformable interiors",
        "Multi-arts venue",
      ],
      promptEnhancement:
        "inspired by The Shed's telescoping architecture, featuring movable outer shell systems, transformable interior spaces, multi-arts venue capabilities, and innovative expandable performance environments",
      imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    },
    {
      id: "wyly-theatre-dallas",
      name: "Wyly Theatre",
      location: "Dallas, USA",
      description:
        "Vertical theater with transformable performance configurations and audience mobility",
      architecturalStyle: "Vertical Transformable",
      keyFeatures: [
        "Vertical theater design",
        "Transformable configurations",
        "Audience mobility",
        "Multi-level performance",
      ],
      promptEnhancement:
        "with the Wyly Theatre's vertical transformable design, featuring multi-level performance spaces, audience mobility systems, transformable stage configurations, and innovative vertical theater architecture",
      imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    },
    {
      id: "spherical-theater-riga",
      name: "Spherical Theater",
      location: "Riga, Latvia",
      description:
        "Dome theater with 360-degree projection and immersive audience experience",
      architecturalStyle: "Spherical Immersive",
      keyFeatures: [
        "360-degree projection",
        "Dome architecture",
        "Immersive experience",
        "Spherical performance",
      ],
      promptEnhancement:
        "inspired by Riga's Spherical Theater with its dome architecture, featuring 360-degree projection systems, immersive audience experiences, spherical performance spaces, and revolutionary theater design",
      imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    },
    {
      id: "kinetic-theater-amsterdam",
      name: "Kinetic Theater Amsterdam",
      location: "Amsterdam, Netherlands",
      description:
        "Moving theater with kinetic architecture and dynamic performance environments",
      architecturalStyle: "Kinetic Architecture",
      keyFeatures: [
        "Kinetic movement",
        "Dynamic environments",
        "Moving architecture",
        "Performance mobility",
      ],
      promptEnhancement:
        "with Kinetic Theater Amsterdam's moving architecture, featuring kinetic structural elements, dynamic performance environments, mobile theater systems, and architecture that moves with the performance",
      imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    },
    {
      id: "morphing-theater-tokyo",
      name: "Morphing Theater Tokyo",
      location: "Tokyo, Japan",
      description:
        "Shape-shifting theater with AI-controlled morphing spaces and responsive environments",
      architecturalStyle: "AI Morphing",
      keyFeatures: [
        "AI-controlled morphing",
        "Shape-shifting spaces",
        "Responsive environments",
        "Intelligent architecture",
      ],
      promptEnhancement:
        "inspired by Tokyo's Morphing Theater with its AI-controlled shape-shifting design, featuring intelligent morphing spaces, responsive environmental systems, and architecture that adapts in real-time to performances",
      imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    },
    {
      id: "liquid-theater-barcelona",
      name: "Liquid Theater Barcelona",
      location: "Barcelona, Spain",
      description:
        "Fluid theater design with flowing architectural elements and water-inspired transformations",
      architecturalStyle: "Fluid Architecture",
      keyFeatures: [
        "Flowing elements",
        "Water-inspired design",
        "Fluid transformations",
        "Organic movement",
      ],
      promptEnhancement:
        "with Liquid Theater Barcelona's fluid architecture, featuring flowing architectural elements, water-inspired transformations, organic movement systems, and liquid-like performance spaces that flow and adapt",
      imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    },
  ],
  gaming_arena: [
    {
      id: "esports-stadium-arlington",
      name: "Esports Stadium Arlington",
      location: "Arlington, USA",
      description:
        "Purpose-built esports venue with stadium seating and broadcast facilities",
      architecturalStyle: "Modern Sports Architecture",
      keyFeatures: [
        "Stadium seating",
        "LED displays",
        "Broadcast facilities",
        "Gaming stations",
      ],
      promptEnhancement:
        "with the high-energy atmosphere of Esports Stadium Arlington, featuring tiered gaming stations, massive LED displays, broadcast-quality lighting, and spectator seating designed for competitive gaming",
      imageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    },
    {
      id: "alienware-training-facility",
      name: "Alienware Training Facility",
      location: "Las Vegas, USA",
      description:
        "High-tech esports training center with alien-inspired futuristic design",
      architecturalStyle: "Futuristic Gaming",
      keyFeatures: [
        "Alien-inspired design",
        "High-tech training pods",
        "Immersive environments",
        "Professional coaching areas",
      ],
      promptEnhancement:
        "with the futuristic alien-inspired design of Alienware Training Facility, featuring high-tech gaming pods, immersive training environments, professional coaching stations, and otherworldly gaming aesthetics",
      imageUrl: "https://images.unsplash.com/photo-1559329007-40df8a9345d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80",
    },
    {
      id: "hyperx-esports-arena",
      name: "HyperX Esports Arena",
      location: "Las Vegas, USA",
      description:
        "Premier esports venue with professional tournament facilities and streaming capabilities",
      architecturalStyle: "Professional Esports",
      keyFeatures: [
        "Tournament stage",
        "Streaming studios",
        "Professional lighting",
        "Audience seating",
      ],
      promptEnhancement:
        "inspired by HyperX Esports Arena's professional tournament design, featuring championship-level gaming stages, broadcast streaming studios, professional lighting systems, and spectator viewing areas",
      imageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    },
    {
      id: "lol-park-seoul",
      name: "LoL Park",
      location: "Seoul, South Korea",
      description:
        "League of Legends themed gaming arena with immersive game-world environments",
      architecturalStyle: "Game-Themed Architecture",
      keyFeatures: [
        "Game-world immersion",
        "Themed environments",
        "Interactive displays",
        "Champion showcases",
      ],
      promptEnhancement:
        "with LoL Park's immersive game-world design, featuring League of Legends themed environments, interactive champion displays, game-inspired architecture, and fantasy gaming atmospheres",
      imageUrl: "https://images.unsplash.com/photo-1559329007-40df8a9345d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80",
    },
    {
      id: "fnatic-gear-arena",
      name: "Fnatic Gear Arena",
      location: "London, UK",
      description:
        "European esports hub with cutting-edge gaming technology and team training facilities",
      architecturalStyle: "European Gaming Tech",
      keyFeatures: [
        "Team training rooms",
        "Cutting-edge hardware",
        "European design",
        "Performance analytics",
      ],
      promptEnhancement:
        "inspired by Fnatic Gear Arena's European esports excellence, featuring team training facilities, cutting-edge gaming hardware, performance analytics centers, and sleek European gaming design",
      imageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    },
    {
      id: "red-bull-gaming-sphere",
      name: "Red Bull Gaming Sphere",
      location: "Tokyo, Japan",
      description:
        "Spherical gaming arena with 360-degree immersive gaming experiences",
      architecturalStyle: "Spherical Immersive",
      keyFeatures: [
        "360-degree screens",
        "Spherical architecture",
        "Immersive audio",
        "Zero-gravity gaming",
      ],
      promptEnhancement:
        "with Red Bull Gaming Sphere's revolutionary spherical design, featuring 360-degree immersive screens, spherical gaming architecture, surround audio systems, and gravity-defying gaming experiences",
      imageUrl: "https://images.unsplash.com/photo-1559329007-40df8a9345d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80",
    },
    {
      id: "cloud9-training-facility",
      name: "Cloud9 Training Facility",
      location: "Los Angeles, USA",
      description:
        "Professional esports training center with wellness integration and performance optimization",
      architecturalStyle: "Wellness Gaming",
      keyFeatures: [
        "Performance optimization",
        "Wellness integration",
        "Training analytics",
        "Recovery spaces",
      ],
      promptEnhancement:
        "inspired by Cloud9's holistic training approach, featuring performance optimization centers, wellness-integrated gaming spaces, training analytics systems, and player recovery areas that balance competition with health",
      imageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    },
  ],
  biophilic_sanctuary: [
    {
      id: "singapore-changi-jewel",
      name: "Changi Airport Jewel",
      location: "Singapore",
      description:
        "Indoor forest with waterfall and nature integration in modern architecture",
      architecturalStyle: "Biophilic Contemporary",
      keyFeatures: [
        "Indoor waterfall",
        "Living walls",
        "Natural lighting",
        "Organic forms",
      ],
      promptEnhancement:
        "inspired by Singapore's Changi Jewel with its spectacular indoor forest, featuring cascading water features, living walls, natural light integration, and seamless nature-architecture fusion",
      imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    },
  ],
  holographic_museum: [
    {
      id: "teamlab-borderless",
      name: "teamLab Borderless",
      location: "Tokyo, Japan",
      description:
        "Digital art museum with immersive projections and interactive spaces",
      architecturalStyle: "Digital Immersive",
      keyFeatures: [
        "Projection mapping",
        "Interactive displays",
        "Flowing spaces",
        "Digital art",
      ],
      promptEnhancement:
        "with the immersive digital artistry of teamLab Borderless Tokyo, featuring flowing projection-mapped spaces, interactive holographic displays, and seamless digital-physical integration",
      imageUrl: "https://images.unsplash.com/photo-1559329007-40df8a9345d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80",
    },
  ],
  vertical_farm: [
    {
      id: "aerofarms-newark",
      name: "AeroFarms Newark",
      location: "Newark, USA",
      description:
        "World's largest vertical farm with LED growing systems and automation",
      architecturalStyle: "Industrial Agricultural",
      keyFeatures: [
        "Vertical growing towers",
        "LED grow lights",
        "Automated systems",
        "Climate control",
      ],
      promptEnhancement:
        "inspired by AeroFarms Newark with its revolutionary vertical growing systems, featuring multi-story cultivation towers, precision LED lighting, automated harvesting systems, and sustainable agricultural technology",
      imageUrl: "https://images.unsplash.com/photo-1574263867128-a3d5c1b1deaa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    },
  ],
  quantum_research: [
    {
      id: "cern-facility",
      name: "CERN Research Facility",
      location: "Geneva, Switzerland",
      description:
        "World-renowned particle physics laboratory with cutting-edge equipment",
      architecturalStyle: "High-Tech Scientific",
      keyFeatures: [
        "Clean room environments",
        "Scientific equipment",
        "Precision engineering",
        "Research facilities",
      ],
      promptEnhancement:
        "with the precision and innovation of CERN's research facilities, featuring ultra-modern clean rooms, cutting-edge scientific equipment, electromagnetic isolation chambers, and world-class research infrastructure",
      imageUrl: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    },
  ],
  metamorphic_theater: [
    {
      id: "guthrie-theater",
      name: "Guthrie Theater",
      location: "Minneapolis, USA",
      description:
        "Innovative theater with flexible staging and architectural adaptability",
      architecturalStyle: "Contemporary Theatrical",
      keyFeatures: [
        "Flexible staging",
        "Adaptable seating",
        "Dynamic lighting",
        "Modular design",
      ],
      promptEnhancement:
        "inspired by the Guthrie Theater's innovative design with its flexible staging configurations, adaptable seating arrangements, dynamic lighting systems, and modular performance spaces",
      imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    },
  ],
  neural_interface_lab: [
    {
      id: "neuralink-facility",
      name: "Neuralink Research Facility",
      location: "Fremont, USA",
      description:
        "Brain-computer interface research lab with meditation and technology integration",
      architecturalStyle: "Neuro-Tech Contemporary",
      keyFeatures: [
        "Research stations",
        "Meditation chambers",
        "Clean environments",
        "Advanced monitoring",
      ],
      promptEnhancement:
        "with the cutting-edge serenity of Neuralink's research environment, featuring brain-computer interface stations, contemplative meditation chambers, advanced neural monitoring systems, and spaces that bridge technology and consciousness",
      imageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80",
    },
  ],
  crystalline_conservatory: [
    {
      id: "harpa-reykjavik",
      name: "Harpa Concert Hall",
      location: "Reykjavik, Iceland",
      description:
        "Crystalline facade concert hall with geometric glass architecture",
      architecturalStyle: "Crystalline Contemporary",
      keyFeatures: [
        "Geometric glass facade",
        "Prismatic lighting",
        "Acoustic excellence",
        "Crystal-inspired design",
      ],
      promptEnhancement:
        "inspired by Reykjavik's Harpa Concert Hall with its stunning crystalline facade, featuring geometric glass patterns, prismatic light effects, superior acoustics, and mineral-inspired architectural elements",
      imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    },
  ],
  atmospheric_processor: [
    {
      id: "eden-project",
      name: "Eden Project",
      location: "Cornwall, UK",
      description:
        "Massive biomes with climate control and atmospheric management systems",
      architecturalStyle: "Geodesic Environmental",
      keyFeatures: [
        "Geodesic domes",
        "Climate control",
        "Atmospheric systems",
        "Environmental technology",
      ],
      promptEnhancement:
        "with the environmental innovation of Cornwall's Eden Project, featuring massive geodesic structures, advanced climate control systems, atmospheric processing technology, and sustainable environmental management",
      imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    },
  ],
  temporal_archive: [
    {
      id: "svalbard-seed-vault",
      name: "Svalbard Global Seed Vault",
      location: "Svalbard, Norway",
      description:
        "Underground preservation facility designed for long-term storage",
      architecturalStyle: "Preservation Architecture",
      keyFeatures: [
        "Underground chambers",
        "Climate control",
        "Long-term storage",
        "Preservation technology",
      ],
      promptEnhancement:
        "inspired by the Svalbard Seed Vault's preservation architecture, featuring underground storage chambers, advanced climate control, quantum storage systems, and technology designed for eternal preservation",
      imageUrl: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    },
  ],
  symbiotic_habitat: [
    {
      id: "bosco-verticale",
      name: "Bosco Verticale",
      location: "Milan, Italy",
      description:
        "Vertical forest towers with integrated living ecosystems",
      architecturalStyle: "Living Architecture",
      keyFeatures: [
        "Vertical gardens",
        "Living ecosystems",
        "Bio-integration",
        "Sustainable design",
      ],
      promptEnhancement:
        "with the living architecture of Milan's Bosco Verticale, featuring vertical forest integration, symbiotic ecosystems, bio-responsive materials, and spaces where nature and architecture coexist harmoniously",
      imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    },
  ],
};

const ChurchTransformation = () => {
  const { toast } = useToast();

  const [state, setState] = useState<GenerationState>({
    isGenerating: false,
    selectedTransformation: null,
    selectedLocation: null,
    generatedImage: null,
    originalImage: INPAINT_IMAGES[0].path, // Première image par défaut
    generationTime: null,
    cost: null,
    customPrompt: "",
    forceNewGeneration: false,
    couponCode: "",
    activeCoupon: null,
    couponValidation: null,
    // HD-Painter defaults
    selectedInpaintImage: INPAINT_IMAGES[0],
    hdPainterMethod: "painta+rasg", // Méthode par défaut
    showMaskPreview: false,
    // Social Media Sharing
    showShareModal: false,
  });

  // État pour suivre l'image de base sélectionnée
  const [selectedBaseImage, setSelectedBaseImage] = useState(INPAINT_IMAGES[0]);
  // Ref synchrone pour toujours disposer de l'image sélectionnée courante
  const selectedBaseImageRef = useRef<InpaintImage>(INPAINT_IMAGES[0]);

  // 🎫 Charger le coupon actif au montage du composant
  useEffect(() => {
    const activeCoupon = getActiveCoupon();
    if (activeCoupon) {
      setState((prev) => ({
        ...prev,
        activeCoupon,
        couponCode: activeCoupon.id,
        couponValidation: {
          valid: true,
          coupon: activeCoupon,
          message: `Coupon actif: ${activeCoupon.generationsRemaining} générations restantes`,
        },
      }));
    }
  }, []);

  // 🎫 Fonction pour valider un coupon manuellement
  const handleCouponValidation = useCallback(
    (code: string) => {
      const validation = validateAndUseCoupon(code);
      setState((prev) => ({
        ...prev,
        couponCode: code,
        couponValidation: validation,
        activeCoupon: validation.coupon || null,
      }));

      if (validation.valid) {
        toast({
          title: "✅ Coupon validé",
          description: validation.message,
          variant: "default",
        });
      } else {
        toast({
          title: "❌ Coupon invalide",
          description: validation.message,
          variant: "error",
        });
      }
    },
    [toast]
  );

  const handleReset = useCallback(() => {
    setState((prev) => ({
      ...prev,
      generatedImage: null,
      generationTime: null,
      cost: null,
    }));
  }, []);

  // 🎨 Fonction pour sélectionner une image d'inpainting
  const handleInpaintImageSelect = useCallback(
    (imageIndex: number) => {
      const selectedImage = INPAINT_IMAGES[imageIndex];
      setSelectedBaseImage(selectedImage);
      selectedBaseImageRef.current = selectedImage;

      setState((prev) => ({
        ...prev,
        selectedInpaintImage: selectedImage,
        originalImage: selectedImage.path,
        hdPainterMethod: selectedImage.hdPainterMethod, // Méthode recommandée
        generatedImage: null, // Reset l'image générée
        showMaskPreview: false, // Reset mask preview when changing image
      }));

      toast({
        title: "🎯 Image sélectionnée",
        description: `${selectedImage.name} - Méthode HD-Painter: ${selectedImage.hdPainterMethod}`,
        variant: "default",
      });
    },
    [toast]
  );

  // 🎨 Fonction pour changer la méthode HD-Painter
  const handleHDPainterMethodChange = useCallback((method: HDPainterMethod) => {
    setState((prev) => ({
      ...prev,
      hdPainterMethod: method,
    }));
  }, []);

  // 🔍 Toggle mask preview
  const handleToggleMaskPreview = useCallback(() => {
    setState((prev) => ({
      ...prev,
      showMaskPreview: !prev.showMaskPreview,
    }));
  }, []);

  const handleTransform = useCallback(async () => {
    // Détection du mode développement
    const isDevelopment =
      process.env.NODE_ENV === "development" ||
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1";

    // Vérification coupon obligatoire (sauf en mode développement)
    if (!isDevelopment && !state.couponValidation?.valid) {
      toast({
        title: "🎫 Coupon requis",
        description:
          "Vous devez avoir un coupon valide pour générer des transformations.",
        variant: "error",
      });
      return;
    }

    // Vérification générations restantes (sauf en mode développement)
    if (
      !isDevelopment &&
      state.activeCoupon &&
      state.activeCoupon.generationsRemaining <= 0
    ) {
      toast({
        title: "❌ Plus de générations",
        description: "Votre coupon n'a plus de générations disponibles.",
        variant: "error",
      });
      return;
    }

    // Vérifications de base
    if (!state.selectedTransformation || !state.selectedInpaintImage) {
      toast({
        title: "⚠️ Sélection incomplète",
        description:
          "Veuillez sélectionner une transformation et une image de base.",
        variant: "error",
      });
      return;
    }

    setState((prev) => ({ ...prev, isGenerating: true }));
    const startTime = Date.now();

    try {
      // Construction du prompt avec exigence obligatoire
      const mandatoryPeopleRequirement =
        "MANDATORY: 140 happy diverse people actively using the space (sitting, working, socializing). Include appropriate furniture. Space must look lived-in with people as the focal point.";
      const fullPrompt = mandatoryPeopleRequirement + " " + state.customPrompt;

      const response = await fetch("/api/inpaint", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          baseImage: state.selectedInpaintImage.path,
          maskImage: state.selectedInpaintImage.maskPath,
          prompt: fullPrompt,
          method: state.hdPainterMethod,
          resolution: state.selectedInpaintImage.resolution,
          noCache: state.forceNewGeneration,
          couponCode: isDevelopment
            ? "DEV_MODE"
            : state.activeCoupon?.id || state.couponCode,
          isDevelopment,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Erreur HTTP: ${response.status}`);
      }

      const data: GenerationResponse = await response.json();
      const endTime = Date.now();
      const generationTime = endTime - startTime;

      setState((prev) => ({
        ...prev,
        generatedImage: data.imageUrl,
        generationTime,
        cost: data.metadata?.cost ?? 0.04, // Coût Stability AI
        isGenerating: false,
      }));

      // Décrémentation du coupon après succès (sauf en mode développement)
      if (!isDevelopment && state.activeCoupon) {
        const updatedCoupon = useCouponGeneration(state.activeCoupon.id);
        setState((prev) => ({
          ...prev,
          activeCoupon: updatedCoupon || null,
          couponValidation: updatedCoupon
            ? {
                valid: true,
                coupon: updatedCoupon,
                message: `${updatedCoupon.generationsRemaining} générations restantes`,
              }
            : null,
        }));
      }

      toast({
        title: "🎉 Transformation réussie !",
        description: `Image générée avec HD-Painter (${state.hdPainterMethod}) en ${(generationTime / 1000).toFixed(1)}s`,
        variant: "default",
      });
    } catch (error) {
      console.error("Erreur de génération:", error);
      setState((prev) => ({ ...prev, isGenerating: false }));

      toast({
        title: "❌ Erreur de génération",
        description:
          error instanceof Error
            ? error.message
            : "Une erreur inattendue s'est produite",
        variant: "error",
      });
    }
  }, [
    state.selectedTransformation,
    state.selectedInpaintImage,
    state.customPrompt,
    state.forceNewGeneration,
    state.couponCode,
    state.couponValidation,
    state.activeCoupon,
    state.hdPainterMethod,
    toast,
  ]);

  const handleDownload = useCallback(async () => {
    if (!state.generatedImage) return;

    try {
      const response = await fetch(state.generatedImage);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `eglise-auray-${state.selectedTransformation?.id}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast({
        title: "📥 Image téléchargée !",
        variant: "success",
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: "❌ Erreur de téléchargement",
        variant: "error",
        duration: 2000,
      });
    }
  }, [state.generatedImage, state.selectedTransformation, toast]);

  const handleShare = useCallback(async () => {
    if (!state.generatedImage || !state.selectedTransformation) return;

    const shareData = {
      title: `Église d'Auray transformée : ${state.selectedTransformation.name}`,
      text: `Découvrez cette transformation révolutionnaire de l'église Saint-Gildas d'Auray ! ${state.selectedTransformation.description}`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        toast({
          title: "🚀 Partagé avec succès !",
          variant: "success",
          duration: 2000,
        });
      } catch (error) {
        // Fallback to clipboard
        navigator.clipboard.writeText(
          `${shareData.title}\n${shareData.text}\n${shareData.url}`
        );
        toast({
          title: "📋 Lien copié dans le presse-papiers !",
          variant: "success",
          duration: 2000,
        });
      }
    } else {
      navigator.clipboard.writeText(
        `${shareData.title}\n${shareData.text}\n${shareData.url}`
      );
      toast({
        title: "📋 Lien copié dans le presse-papiers !",
        variant: "success",
        duration: 2000,
      });
    }
  }, [state.generatedImage, state.selectedTransformation, toast]);

  const handleCustomPromptChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = event.target.value;
      // Limiter à 1800 caractères
      if (value.length <= 1800) {
        setState((prev) => ({ ...prev, customPrompt: value }));
      }
    },
    []
  );
  // Function to generate enhanced prompt (moved from API to client-side for preview)
  const generateEnhancedPrompt = useCallback(
    (
      transformationType: string,
      basePrompt: string,
      baseImageName: string = "Saint-Gildas-Auray-768x576.webp"
    ): string => {
      // Analyze base image to understand perspective and architectural features
      const isInterior =
        baseImageName.toLowerCase().includes("interieur") ||
        baseImageName.toLowerCase().includes("inside");

      const transformationNames: Record<string, string> = {
        library: "modern library",
        restaurant: "fine dining restaurant",
        coworking: "modern coworking space",
        concert_hall: "concert hall",
        art_gallery: "art gallery",
        community_center: "community center",
        wellness_spa: "wellness spa",
        innovation_lab: "innovation laboratory",
        market_hall: "market hall",
        gaming_arena: "gaming arena",
        biophilic_sanctuary: "biophilic sanctuary",
        holographic_museum: "holographic museum",
        vertical_farm: "vertical farm",
        quantum_research: "quantum research facility",
        metamorphic_theater: "metamorphic theater",
        neural_interface_lab: "neural interface laboratory",
        crystalline_conservatory: "crystalline conservatory",
        atmospheric_processor: "atmospheric processor",
        temporal_archive: "temporal archive",
        symbiotic_habitat: "symbiotic habitat",
      };

      // Base prompt with mandatory requirements
      let prompt = `
  Transform this church into ${transformationNames[transformationType] || "a transformed space"} .
  
  ARCHITECTURE: Preserve stone arches, vaulted ceilings.
  
  DESIGN: `;

      // Add transformation-specific design elements
      const designElements: Record<string, string> = {
        library:
          "Glass-walled study areas with smart glass technology, floating bookshelves suspended by invisible cables, holographic reading interfaces, and AI-powered knowledge discovery pods that seamlessly blend with Gothic arches.",
        restaurant:
          "Levitating dining platforms, molecular gastronomy stations, interactive table surfaces with embedded displays, and atmospheric lighting that responds to the flavors being served, all within preserved stone walls.",
        coworking:
          "Modular workspace pods that reconfigure automatically, wireless power transmission zones, holographic collaboration spaces, and biometric-responsive environments that adapt to user productivity patterns.",
        concert_hall:
          "Metamorphic acoustic shells that reshape for optimal sound, levitating stage platforms, 360-degree immersive audio systems, and audience seating that moves in harmony with the music's rhythm.",
        art_gallery:
          "Gravity-defying display systems, programmable matter sculptures, neural-responsive lighting that adapts to viewer emotions, and augmented reality layers that reveal hidden artistic dimensions.",
        community_center:
          "Shape-shifting multipurpose spaces, community memory walls with interactive historical displays, empathy-enhancing communication pods, and social harmony algorithms that optimize group interactions.",
        wellness_spa:
          "Levitating meditation chambers, chromotherapy pools with programmable water molecules, bio-resonance healing pods, and atmospheric processors that generate personalized healing environments.",
        innovation_lab:
          "Quantum computing clusters housed in crystal formations, matter manipulation chambers, time-dilated research pods, and consciousness-expansion interfaces integrated within sacred geometry.",
        market_hall:
          "Floating vendor stalls with gravity-defying product displays, flavor-transmission technology, cultural exchange pods, and community abundance algorithms that ensure equitable resource distribution.",
        gaming_arena:
          "Neural-interface gaming pods, holographic battle arenas, consciousness-merging multiplayer systems, and spectator empathy chambers that allow audiences to experience gameplay emotions.",
        biophilic_sanctuary:
          "Living architectural elements that grow and adapt, symbiotic human-plant interfaces, atmospheric oxygen generation systems, and bio-luminescent pathways that respond to natural circadian rhythms.",
        holographic_museum:
          "Temporal exhibition chambers displaying past and future simultaneously, consciousness-recording devices for experiential history, quantum artifact preservation fields, and visitor memory integration systems.",
        vertical_farm:
          "Multi-dimensional growing matrices defying traditional space constraints, plant-consciousness communication networks, automated nutrient optimization systems, and harvest-to-table teleportation pods.",
        quantum_research:
          "Reality manipulation chambers, parallel universe observation decks, quantum entanglement communication arrays, and consciousness-quantum field interface laboratories within sacred stone walls.",
        metamorphic_theater:
          "Reality-bending performance spaces, audience-actor consciousness merging systems, temporal narrative loops, and emotional resonance amplification chambers that transform spectators into participants.",
        neural_interface_lab:
          "Consciousness expansion chambers, thought-to-reality manifestation pods, collective intelligence networks, and spiritual-technological synthesis laboratories honoring the sacred space's heritage.",
        crystalline_conservatory:
          "Resonant crystal formations that generate music from architectural vibrations, harmonic healing chambers, sound-to-light conversion systems, and acoustic levitation performance spaces.",
        atmospheric_processor:
          "Planetary-scale air purification systems, weather generation chambers, atmospheric composition laboratories, and climate harmony restoration pods integrated into Gothic structural elements.",
        temporal_archive:
          "Time-locked preservation chambers, quantum memory storage crystals, historical consciousness recording systems, and eternal knowledge preservation pods that transcend temporal limitations.",
        symbiotic_habitat:
          "Human-nature consciousness merger zones, bio-architectural growth systems, interspecies communication networks, and evolutionary acceleration chambers where beings and environment co-evolve harmoniously.",
      };

      prompt +=
        designElements[transformationType] ||
        "Contemporary design elements that respect and enhance the historical architecture.";

      // Add lighting and atmosphere
      prompt += `
  
  LIGHTING: Natural light through stained glass with warm artificial lighting highlighting both old and new elements.
  
  QUALITY: Photorealistic, 8K, professional lighting, detailed textures, vibrant colors, sharp focus.`;

      return prompt;
    },
    []
  );

  const handleTransformationSelect = useCallback(
    (transformation: TransformationType) => {
      // Generate the enhanced prompt immediately for preview
      const baseImageName =
        selectedBaseImageRef.current.path.split("/").pop() ||
        "Saint-Gildas-Auray-768x576.webp";
      const enhancedPrompt = generateEnhancedPrompt(
        transformation.id,
        transformation.prompt,
        baseImageName
      );

      setState((prev) => ({
        ...prev,
        selectedTransformation: transformation,
        selectedLocation: null, // Reset location when changing transformation
        generatedImage: null,
        generationTime: null,
        cost: null,
        customPrompt: enhancedPrompt,
      }));
    },
    []
  );

  const handleLocationSelect = useCallback(
    (location: FamousLocation) => {
      if (!state.selectedTransformation) return;

      // Generate enhanced prompt with location inspiration
      const baseImageName =
        selectedBaseImageRef.current.path.split("/").pop() ||
        "Saint-Gildas-Auray-768x576.webp";

      let enhancedPrompt = generateEnhancedPrompt(
        state.selectedTransformation.id,
        state.selectedTransformation.prompt,
        baseImageName
      );

      // Add location-specific enhancement to the prompt
      enhancedPrompt += `\n\nINSPIRATION: ${location.promptEnhancement}`;

      setState((prev) => ({
        ...prev,
        selectedLocation: location,
        customPrompt: enhancedPrompt,
      }));

      toast({
        title: "🌟 Inspiration ajoutée",
        description: `${location.name} (${location.location}) intégré au prompt`,
        variant: "default",
      });
    },
    [state.selectedTransformation, toast, generateEnhancedPrompt]
  );

  const handleCustomPromptReset = useCallback(() => {
    if (!state.selectedTransformation) return;

    // Get the base image name for prompt generation
    const baseImageName =
      selectedBaseImageRef.current.path.split("/").pop() ||
      "Saint-Gildas-Auray-768x576.webp";

    // Regenerate the default prompt for the current transformation
    const defaultPrompt = generateEnhancedPrompt(
      state.selectedTransformation.id,
      state.selectedTransformation.prompt,
      baseImageName
    );

    // Update the state with the default prompt
    setState((prev) => ({
      ...prev,
      customPrompt: defaultPrompt,
    }));

    // Show a toast notification
    toast({
      title: "Prompt réinitialisé",
      description: "Le prompt a été réinitialisé à sa valeur par défaut.",
      variant: "success",
      duration: 2000,
    });
  }, [state.selectedTransformation, toast, generateEnhancedPrompt]);

  const handleForceNewGenerationChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setState((prev) => ({
        ...prev,
        forceNewGeneration: event.target.checked,
      }));
    },
    []
  );

  // Social Media Sharing handlers
  const handleOpenShareModal = useCallback(() => {
    setState((prev) => ({ ...prev, showShareModal: true }));
  }, []);

  const handleCloseShareModal = useCallback(() => {
    setState((prev) => ({ ...prev, showShareModal: false }));
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-8">
      {/* 🎫 Section Coupon */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ticket className="h-5 w-5 text-green-600" />
            Code coupon de génération
          </CardTitle>
          <CardDescription>
            Entrez votre code de coupon pour accéder aux générations d'images
            IA. Vous obtenez 5 générations gratuites en signant la pétition.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="coupon-input" className="text-sm font-medium">
              Code coupon (format: XXXX-XXXX-XXXX)
            </Label>
            <Input
              id="coupon-input"
              type="text"
              value={state.couponCode}
              onChange={(e) => {
                const upperCode = e.target.value.toUpperCase();
                setState((prev) => ({ ...prev, couponCode: upperCode }));
                if (upperCode.length === 14) {
                  // XXXX-XXXX-XXXX = 14 chars
                  handleCouponValidation(upperCode);
                }
              }}
              placeholder="Entrez votre code coupon..."
              className="w-full"
              maxLength={14}
            />
          </div>

          {/* Statut du coupon */}
          {state.couponValidation && (
            <div
              className={`p-3 rounded-lg border ${
                state.couponValidation.valid
                  ? "bg-green-50 border-green-200 text-green-800"
                  : "bg-red-50 border-red-200 text-red-800"
              }`}
            >
              <div className="flex items-center gap-2">
                {state.couponValidation.valid ? (
                  <Ticket className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-600" />
                )}
                <span className="text-sm font-medium">
                  {state.couponValidation.message}
                </span>
              </div>
              {state.couponValidation.valid && state.activeCoupon && (
                <div className="mt-2 text-xs">
                  <div className="flex justify-between">
                    <span>Générations restantes:</span>
                    <span className="font-bold">
                      {state.activeCoupon.generationsRemaining}/5
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Expire le:</span>
                    <span>
                      {new Date(
                        state.activeCoupon.expiresAt
                      ).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Lien vers la pétition si pas de coupon */}
          {!state.couponValidation?.valid && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800 mb-2">
                🎫 Pas encore de coupon ?
              </p>
              <p className="text-xs text-blue-600 mb-3">
                Signez la pétition pour recevoir 5 générations gratuites
                d'images IA !
              </p>
              <Button
                onClick={() => window.open("/", "_blank")}
                size="sm"
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                📝 Signer la pétition
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      {/* Image Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Choisissez une image de base</CardTitle>
          <CardDescription>
            Sélectionnez l'image de l'église que vous souhaitez transformer
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {INPAINT_IMAGES.map((image, index) => (
              <div
                key={index}
                className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                  state.selectedInpaintImage === image
                    ? "border-blue-500 shadow-lg scale-105"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => handleInpaintImageSelect(index)}
              >
                <div className="aspect-square">
                  <img
                    src={
                      state.showMaskPreview && state.selectedInpaintImage === image
                        ? image.maskPath
                        : image.path
                    }
                    alt={state.showMaskPreview && state.selectedInpaintImage === image
                      ? `Masque de ${image.name}`
                      : image.name
                    }
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity flex items-end">
                  <div className="p-3 bg-gradient-to-t from-black to-transparent w-full">
                    <h3 className="text-white font-semibold text-sm">
                      {image.name}
                    </h3>
                    <p className="text-gray-200 text-xs">{image.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {image.type}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="text-xs text-white border-white"
                      >
                        {image.hdPainterMethod}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="text-xs text-white border-white"
                      >
                        {image.resolution}
                      </Badge>
                    </div>
                  </div>
                </div>
                {state.selectedInpaintImage === image && (
                  <div className="absolute top-2 right-2">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  </div>
                )}
                {state.showMaskPreview && state.selectedInpaintImage === image && (
                  <div className="absolute top-2 left-2">
                    <Badge variant="secondary" className="text-xs bg-orange-500 text-white">
                      Masque
                    </Badge>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Contrôles HD-Painter */}
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Paintbrush className="w-4 h-4" />
                <Label>Méthode HD-Painter</Label>
              </div>
              <Button
                variant={state.showMaskPreview ? "default" : "outline"}
                size="sm"
                onClick={handleToggleMaskPreview}
                className="flex items-center gap-2"
                disabled={!state.selectedInpaintImage}
              >
                <Layers className="w-4 h-4" />
                {state.showMaskPreview ? "Voir Image" : "Voir Masque"}
              </Button>
            </div>

            <Select
              value={state.hdPainterMethod}
              onValueChange={handleHDPainterMethodChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choisir méthode HD-Painter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="baseline">
                  <div className="flex flex-col">
                    <span>Baseline</span>
                    <span className="text-xs text-gray-500">
                      Transformation standard
                    </span>
                  </div>
                </SelectItem>
                <SelectItem value="painta">
                  <div className="flex flex-col">
                    <span>PAIntA</span>
                    <span className="text-xs text-gray-500">
                      Amélioration cohérence prompt
                    </span>
                  </div>
                </SelectItem>
                <SelectItem value="rasg">
                  <div className="flex flex-col">
                    <span>RASG</span>
                    <span className="text-xs text-gray-500">
                      Guidance attention score
                    </span>
                  </div>
                </SelectItem>
                <SelectItem value="painta+rasg">
                  <div className="flex flex-col">
                    <span>PAIntA + RASG</span>
                    <span className="text-xs text-gray-500">
                      Qualité maximale (recommandé)
                    </span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>

            {state.selectedInpaintImage && (
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-sm mb-2">
                  🎯 Configuration actuelle:
                </h4>
                <div className="text-sm space-y-1">
                  <p>
                    <strong>Image:</strong> {state.selectedInpaintImage.name}
                  </p>
                  <p>
                    <strong>Type:</strong> {state.selectedInpaintImage.type}
                  </p>
                  <p>
                    <strong>Méthode:</strong> {state.hdPainterMethod}
                  </p>
                  <p>
                    <strong>Résolution:</strong>{" "}
                    {state.selectedInpaintImage.resolution}
                  </p>
                  <p>
                    <strong>Masque:</strong>{" "}
                    {state.selectedInpaintImage.maskPath}
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Header Section */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Sparkles className="h-8 w-8 text-purple-600" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Transformez VOTRE Église d'Auray
          </h1>
          <Zap className="h-8 w-8 text-yellow-500" />
        </div>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Découvrez des millions de visions révolutionnaires de l'église Saint-Gildas
          d'Auray, générées par l'intelligence artificielle en temps réel
        </p>
        <Badge variant="secondary" className="text-sm">
          ⚡ Génération instantanée • 🎨 HD Qualité • 🔄 Illimité
        </Badge>
      </div>

      {/* Transformation Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {TRANSFORMATION_TYPES.map((transformation) => (
          <Card
            key={transformation.id}
            className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 ${
              state.selectedTransformation?.id === transformation.id
                ? "ring-2 ring-purple-500 bg-purple-50"
                : "hover:bg-gray-50"
            }`}
            onClick={() => handleTransformationSelect(transformation)}
          >
            <CardContent className="p-4 text-center space-y-2">
              <div className="text-3xl mb-2">{transformation.icon}</div>
              <h3 className="font-semibold text-sm">{transformation.name}</h3>
              <p className="text-xs text-gray-600 line-clamp-2">
                {transformation.description}
              </p>
              <Badge variant="outline" className="text-xs">
                {transformation.category}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Famous Location Selection */}
      {state.selectedTransformation && FAMOUS_LOCATIONS[state.selectedTransformation.id] && (
        <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">🌟</span>
              Inspiration architecturale
            </CardTitle>
            <CardDescription>
              Choisissez un lieu célèbre pour inspirer votre transformation de {state.selectedTransformation.name.toLowerCase()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {FAMOUS_LOCATIONS[state.selectedTransformation.id].map((location) => (
                <Card
                  key={location.id}
                  className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 overflow-hidden ${
                    state.selectedLocation?.id === location.id
                      ? "ring-2 ring-amber-500"
                      : ""
                  }`}
                  onClick={() => handleLocationSelect(location)}
                >
                  <div className="relative h-48 bg-cover bg-center" style={{ backgroundImage: `url(${location.imageUrl})` }}>
                    <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                    <div className="absolute top-2 right-2">
                      {state.selectedLocation?.id === location.id && (
                        <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      )}
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
                      <h3 className="font-semibold text-lg text-white">{location.name}</h3>
                      <p className="text-sm text-gray-200">{location.location}</p>
                    </div>
                  </div>
                  <CardContent className="p-4 space-y-3">
                    <p className="text-sm text-gray-700">{location.description}</p>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {location.architecturalStyle}
                        </Badge>
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        {location.keyFeatures.map((feature, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {state.selectedLocation && (
              <div className="mt-4 p-4 bg-amber-100 rounded-lg">
                <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                  <span>✨</span>
                  Inspiration sélectionnée: {state.selectedLocation.name}
                </h4>
                <p className="text-sm text-amber-800">
                  Cette inspiration sera intégrée dans votre prompt pour créer une transformation unique inspirée de ce lieu emblématique.
                </p>
              </div>
            )}
            
            {!state.selectedLocation && (
              <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                <p className="text-sm text-gray-600 text-center">
                  💡 Sélectionnez une inspiration architecturale pour enrichir votre transformation, ou continuez sans inspiration spécifique.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Custom Prompt */}
      <Card>
        <CardHeader>
          <CardTitle>Personnalisez votre prompt</CardTitle>
          <CardDescription>
            Modifiez le prompt pour obtenir des résultats plus précis.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <textarea
            value={state.customPrompt}
            onChange={handleCustomPromptChange}
            placeholder="Sélectionnez d'abord une transformation pour voir le prompt par défaut..."
            className="w-full min-h-[80px] max-h-[320px] p-4 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none overflow-hidden"
            disabled={!state.selectedTransformation}
            maxLength={1800}
            rows={1}
            style={{
              height: "auto",
            }}
            ref={(el) => {
              if (el) {
                el.style.height = "auto";
                el.style.height = el.scrollHeight + "px";
              }
            }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = "auto";
              target.style.height = target.scrollHeight + "px";
            }}
          />
          {/* Compteur de caractères */}
          {state.selectedTransformation && (
            <div className="flex justify-between items-center mt-2">
              <span
                className={`text-xs ${
                  state.customPrompt.length > 1600
                    ? "text-orange-600"
                    : state.customPrompt.length > 1700
                      ? "text-red-600"
                      : "text-gray-500"
                }`}
              >
                {state.customPrompt.length}/1800 caractères
              </span>
              <div className="flex justify-end">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleCustomPromptReset}
                  disabled={!state.selectedTransformation}
                >
                  Réinitialiser le prompt
                </Button>
              </div>
            </div>
          )}

          {state.selectedTransformation && (
            <div className="mt-4 flex flex-col items-center space-y-3">
              <Button
                onClick={handleTransform}
                disabled={state.isGenerating}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 rounded-lg font-semibold shadow-lg transform transition-all duration-200 hover:scale-105"
              >
                {state.isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Génération en cours...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Générer la transformation
                  </>
                )}
              </Button>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="force-new-generation"
                  checked={state.forceNewGeneration}
                  onChange={handleForceNewGenerationChange}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <label
                  htmlFor="force-new-generation"
                  className="text-sm text-gray-600 cursor-pointer"
                >
                  🔄 Forcer une nouvelle génération (ignorer le cache)
                </label>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Loading State */}
      {state.isGenerating && state.selectedTransformation && (
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="p-8 text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-purple-600 mx-auto" />
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">
                🎨 Création de votre {state.selectedTransformation.name}
              </h3>
              <p className="text-gray-600">
                L'IA génère votre vision personnalisée... ⏱️ 3-8 secondes
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-purple-600">
                <Sparkles className="h-4 w-4 animate-pulse" />
                <span>HD-Painter Qualité HD • Style vivant</span>
                <Sparkles className="h-4 w-4 animate-pulse" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      {/* Image Comparison Section */}
      {state.generatedImage && (
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <span className="text-2xl">
                {state.selectedTransformation?.icon}
              </span>
              {state.selectedTransformation?.name}
            </CardTitle>
            <CardDescription>
              {state.selectedTransformation?.description}
            </CardDescription>
            {state.generationTime && (
              <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
                <span>
                  ⏱️ Généré en {(state.generationTime / 1000).toFixed(1)}s
                </span>
                {state.cost && <span>💰 {state.cost.toFixed(3)}&nbsp;</span>}
                <span>
                  <span className="mx-1">→</span>
                  <span className="font-bold">{state.cost.toFixed(3)}€</span>
                </span>
                <span className="mx-1">🙏</span>
                <span>
                  <a
                    href="https://www.buymeacoffee.com/huaoe"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-4 py-2 rounded-md shadow transition-colors text-sm ml-4"
                  >
                    ☕ Offrez-moi un café
                  </a>
                </span>
                <span className="mx-1">→</span>
                <span className="mx-1">🦄💓🖖</span>
                <span className="mx-1">→</span>
                <span className="mx-1">🏄‍♀️</span>
              </div>
            )}
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Image Originale */}
              <div className="space-y-2">
                <h3 className="font-semibold text-center">
                  🏛️ Église Actuelle: {selectedBaseImage.name}
                </h3>
                <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden shadow-lg">
                  {state.originalImage ? (
                    <img
                      src={state.originalImage}
                      alt="Église Saint-Gildas d'Auray - Vue actuelle"
                      className="w-full h-full object-cover"
                    />
                  ) : null}
                </div>
              </div>

              {/* Image Transformée */}
              <div className="space-y-2">
                <h3 className="font-semibold text-center">
                  ✨ Transformation IA: {state.selectedTransformation?.name}
                </h3>
                <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden shadow-lg">
                  {state.generatedImage ? (
                    <img
                      src={state.generatedImage}
                      alt={`Église transformée en ${state.selectedTransformation?.name}`}
                      className="w-full h-full object-cover"
                    />
                  ) : null}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap justify-center gap-4 mt-6">
              <Button onClick={handleDownload} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Télécharger
              </Button>
              <Button
                onClick={handleOpenShareModal}
                variant="outline"
                size="sm"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Partager sur les réseaux
              </Button>
              <Button onClick={handleReset} variant="outline" size="sm">
                <RotateCcw className="w-4 h-4 mr-2" />
                Nouvelle Transformation
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Info Footer */}
      <div className="text-center text-sm text-gray-500 space-y-2">
        <p>
          🤖 Propulsé par HD-Painter (ICLR 2025) • 🎯 Inpainting haute précision
          • ✨ 100% Gratuit
        </p>
        <p>
          💡 HD-Painter préserve l'architecture originale avec masques de
          précision pour des résultats cohérents
        </p>
      </div>

      {/* Social Media Share Modal */}
      {state.showShareModal &&
        state.generatedImage &&
        state.selectedTransformation && (
          <SharePostModal
            isOpen={state.showShareModal}
            onClose={handleCloseShareModal}
            imageUrl={state.generatedImage}
            imageDescription={`Découvrez cette transformation révolutionnaire de l'église Saint-Gildas d'Auray en ${state.selectedTransformation.name} ! ${state.selectedTransformation.description}`}
          />
        )}
    </div>
  );
};

export default ChurchTransformation;
