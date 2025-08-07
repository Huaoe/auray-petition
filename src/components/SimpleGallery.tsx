"use client";

import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

// List of image IDs from Google Cloud Storage
const IMAGES = [
"c72f4dd84801",
"e552a471a41a",
"e49cbc37330c",
"dee9688e3052",
"6f0bbec05bee",
"7e5e2924dffc",
"b67c82cc81bc",
"3c8606ac9c96",
"84a1f1906b87",
"dc7c553dfbd3",
"d3d4fe0b2823",
"1eaae5c54fb7",
"6ff114f52d2c",
"4db964115210",
"1b34c16b44df",
"593c6fc2a536",
"86f2de57bf18",
"447b4beb992e",
"c438a44f071a",
"907f45a39ff8",
"87eeca324fc0",
"b2946c7e6a60",
"67f4b5b53113",
"47b98451f8c7",
"2c891eedf04f",
"eee867cd99f4",
"f13844ffda1d",
"b76ac3c65eac",
"863df91613c9",
"33a753a01b11",
"cad551df3a28",
"1a9c2cf500b0",
"eeab46ed07e7",
"c1fb04b11e60",
"c3ef14416aad",
"3631930c30f6",
"5a73e8987e71",
"ec4cc88de09b",
"bb764dea4db1",
"f0e6ec2903c7",
"946f331a052c",
"4b100370aed5",
"268715d55a36",
"1d749be4ca3d",
"465ec869fd19",
"cbce7cac4214",
"7cd13d612b3a",
"0c1d1dfd9ddb",
"09a0ba2d3c65",
"ebf0ce45d2be"
];

// Map transformation types based on position in the array
// Since we don't have type information in the IDs, we'll assign types based on index
const getTransformationType = (index: number): { name: string; category: string } => {
  const types = [
    { name: "Bibliothèque Moderne", category: "culture" },
    { name: "Restaurant Gastronomique", category: "business" },
    { name: "Espace de Coworking", category: "business" },
    { name: "Salle de Concert", category: "culture" },
    { name: "Galerie d'Art", category: "culture" },
    { name: "Centre Communautaire", category: "community" },
    { name: "Centre de Bien-être", category: "community" },
    { name: "Laboratoire d'Innovation", category: "innovation" },
    { name: "Marché Couvert", category: "community" },
    { name: "Arène Gaming", category: "innovation" }
  ];
  
  // Cycle through the types based on the index
  return types[index % types.length];
};

interface SimpleGalleryProps {
  initialLimit?: number;
}

const SimpleGallery: React.FC<SimpleGalleryProps> = ({
  initialLimit = 12,
}) => {
  const [loading, setLoading] = useState(true);
  const [visibleImages, setVisibleImages] = useState<string[]>([]);
  const [limit, setLimit] = useState(initialLimit);

  useEffect(() => {
    // Simulate loading
    setLoading(true);
    setTimeout(() => {
      setVisibleImages(IMAGES.slice(0, limit));
      setLoading(false);
    }, 1000);
  }, [limit]);

  const handleLoadMore = () => {
    setLimit(prevLimit => Math.min(prevLimit + 12, IMAGES.length));
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "culture":
        return "bg-blue-100 text-blue-800";
      case "business":
        return "bg-green-100 text-green-800";
      case "community":
        return "bg-purple-100 text-purple-800";
      case "innovation":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleImages.map((id, index) => {
          const transformationType = getTransformationType(index);
          
          return (
            <div
              key={id}
              className="group relative overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl"
            >
              <Link href={`/transformation/${id}`}>
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={`https://storage.googleapis.com/auray-church-transformations/transformations/${id}`}
                    alt={transformationType.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                
             
              </Link>
            </div>
          );
        })}
        
        {/* Loading skeletons */}
        {loading && Array.from({ length: initialLimit }).map((_, index) => (
          <div key={`skeleton-${index}`} className="overflow-hidden rounded-xl shadow-lg">
            <Skeleton className="aspect-[4/3] w-full" />
            <div className="p-4 space-y-2">
              <Skeleton className="h-6 w-3/4" />
              <div className="flex justify-between pt-2">
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {!loading && visibleImages.length < IMAGES.length && (
        <div className="text-center mt-8">
          <button
            onClick={handleLoadMore}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Charger plus d'images
          </button>
        </div>
      )}
      
      {!loading && visibleImages.length === IMAGES.length && (
        <div className="text-center mt-8 p-4">
          <p className="text-gray-500">Vous avez vu toutes les transformations</p>
        </div>
      )}
    </div>
  );
};

export default SimpleGallery;