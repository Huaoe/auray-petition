"use client";

import React from "react";
import { SocialMediaSettings } from "@/components/SocialMediaSettings";

const SocialMediaSettingsPage = () => {
  return (
    <div className="container mx-auto max-w-2xl py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        Social Media Settings
      </h1>
      <p className="text-gray-600 mb-6">
        Connect your social media accounts to share your creations with the world.
      </p>
      <SocialMediaSettings />
    </div>
  );
};

export default SocialMediaSettingsPage;