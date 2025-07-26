"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SharePostModal } from "@/components/SharePostModal";

export default function SharePostPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  const [imageDescription, setImageDescription] = useState<string | undefined>(undefined);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Handle parameters from the URL
  useEffect(() => {
    // Check if we're coming from a social media OAuth callback
    const success = searchParams.get("success");
    const platform = searchParams.get("platform");
    const username = searchParams.get("username");
    
    // Check if we have an image URL in the query params
    const imgUrl = searchParams.get("imageUrl");
    if (imgUrl) {
      setImageUrl(imgUrl);
    }
    
    // Check if we have an image description in the query params
    const imgDesc = searchParams.get("description");
    if (imgDesc) {
      setImageDescription(imgDesc);
    }
    
    // Open the modal automatically
    setIsModalOpen(true);
  }, [searchParams]);
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
    
    // Redirect to the home page or transformation page after closing
    // You can customize this based on where users should go after sharing
    router.push("/");
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      {/* This page is just a container for the modal */}
      <SharePostModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        imageUrl={imageUrl}
        imageDescription={imageDescription}
      />
      
      {/* Fallback content if modal is closed */}
      {!isModalOpen && (
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold mb-4">Share Your Transformation</h1>
          <p className="mb-4">This page is used for sharing transformations to social media.</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            Open Sharing Modal
          </button>
        </div>
      )}
    </div>
  );
}