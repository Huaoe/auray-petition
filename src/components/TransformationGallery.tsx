"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { TransformationData } from "@/lib/transformation-utils";
import Link from "next/link";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface TransformationGalleryProps {
  initialPage?: number;
  initialLimit?: number;
}

const TransformationGallery: React.FC<TransformationGalleryProps> = ({
  initialPage = 1,
  initialLimit = 12,
}) => {
  const [transformations, setTransformations] = useState<TransformationData[]>([]);
  const [page, setPage] = useState(initialPage);
  const [limit] = useState(initialLimit);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);
  const lastTransformationElementRef = useRef<HTMLDivElement | null>(null);

  // Function to fetch transformations
  const fetchTransformations = useCallback(async (pageToFetch: number) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/transformations?page=${pageToFetch}&limit=${limit}`);
      
      if (!response.ok) {
        throw new Error(`Error fetching transformations: ${response.status}`);
      }

      const data = await response.json();
      
      if (pageToFetch === 1) {
        setTransformations(data.transformations);
      } else {
        setTransformations(prev => [...prev, ...data.transformations]);
      }
      
      setHasMore(data.pagination.hasMore);
    } catch (err) {
      console.error("Error fetching transformations:", err);
      setError(err instanceof Error ? err.message : "An error occurred while fetching transformations");
    } finally {
      setLoading(false);
    }
  }, [limit]);

  // Initial fetch
  useEffect(() => {
    fetchTransformations(initialPage);
  }, [fetchTransformations, initialPage]);

  // Setup intersection observer for infinite scrolling
  useEffect(() => {
    if (loading) return;

    // Disconnect previous observer if it exists
    if (observer.current) {
      observer.current.disconnect();
    }

    // Create a new observer
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    }, {
      root: null,
      rootMargin: "0px",
      threshold: 0.1
    });

    // Observe the last transformation element
    if (lastTransformationElementRef.current) {
      observer.current.observe(lastTransformationElementRef.current);
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [loading, hasMore, transformations]);

  // Fetch more transformations when page changes
  useEffect(() => {
    if (page > initialPage) {
      fetchTransformations(page);
    }
  }, [page, fetchTransformations, initialPage]);

  // Function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric"
    }).format(date);
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={() => fetchTransformations(1)}>Réessayer</Button>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {transformations.map((transformation, index) => {
          const isLastElement = index === transformations.length - 1;
          
          return (
            <div
              key={transformation.id}
              ref={isLastElement ? lastTransformationElementRef : null}
              className="group relative overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl"
            >
              <Link href={`/transformation/${transformation.id}`}>
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={transformation.imageUrl}
                    alt={transformation.description}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-4 transition-transform duration-300 group-hover:translate-y-0">
                  <h3 className="text-lg font-bold line-clamp-1">
                    {transformation.transformationType.name}
                  </h3>
                  <p className="text-sm line-clamp-2 opacity-90">
                    {transformation.description}
                  </p>
                  
                  <div className="mt-2 flex items-center justify-between">
                    <Badge variant="secondary" className="bg-white/20 text-white">
                      {transformation.transformationType.category}
                    </Badge>
                    <span className="text-xs opacity-75">
                      {formatDate(transformation.createdAt)}
                    </span>
                  </div>
                </div>
              </Link>
              
              <div className="absolute top-4 right-4 flex gap-2">
                <Badge className="flex items-center gap-1 bg-white/20 backdrop-blur-sm">
                  <Heart className="h-3 w-3" />
                  <span>{transformation.likes}</span>
                </Badge>
                <Badge className="flex items-center gap-1 bg-white/20 backdrop-blur-sm">
                  <MessageCircle className="h-3 w-3" />
                  <span>{transformation.comments.length}</span>
                </Badge>
                <Badge className="flex items-center gap-1 bg-white/20 backdrop-blur-sm">
                  <Share2 className="h-3 w-3" />
                  <span>{transformation.shares}</span>
                </Badge>
              </div>
            </div>
          );
        })}
        
        {/* Loading skeletons */}
        {loading && Array.from({ length: limit }).map((_, index) => (
          <div key={`skeleton-${index}`} className="overflow-hidden rounded-xl shadow-lg">
            <Skeleton className="aspect-[4/3] w-full" />
            <div className="p-4 space-y-2">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <div className="flex justify-between pt-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {!loading && !hasMore && transformations.length > 0 && (
        <div className="text-center mt-8 p-4">
          <p className="text-gray-500">Vous avez vu toutes les transformations</p>
        </div>
      )}
      
      {!loading && transformations.length === 0 && (
        <div className="text-center mt-8 p-4">
          <p className="text-gray-500">Aucune transformation trouvée</p>
        </div>
      )}
    </div>
  );
};

export default TransformationGallery;