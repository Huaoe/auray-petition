"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SharePostModal } from "../../components/SharePostModal";

function SharePostContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isModalOpen, setIsModalOpen] = useState(true);

  // Get URL parameters
  const imageUrl = searchParams.get("imageUrl") || "";
  const imageDescription = searchParams.get("description") || "";
  const transformationId = searchParams.get("transformationId") || "";

  const handleCloseModal = () => {
    setIsModalOpen(false);
    
    // Redirect to the transformation detail page if ID exists, otherwise go home
    if (transformationId) {
      router.push(`/transformation/${transformationId}`);
    } else {
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <SharePostModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        imageUrl={imageUrl}
        imageDescription={imageDescription}
        transformationId={transformationId}
      />
      
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

function SharePostLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p>Loading sharing options...</p>
      </div>
    </div>
  );
}

export default function SharePostPage() {
  return (
    <Suspense fallback={<SharePostLoading />}>
      <SharePostContent />
    </Suspense>
  );
}
