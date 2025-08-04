"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { use } from "react";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Skeleton } from "../../../components/ui/skeleton";
import { Heart, MessageCircle, Share2, ExternalLink } from "lucide-react";
import Header from "@/components/Header";

export default function TransformationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [isLoading, setIsLoading] = useState(true);
  const [transformation, setTransformation] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransformation = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/transformation/${id}`);

        if (!response.ok) {
          throw new Error("Failed to fetch transformation");
        }

        const data = await response.json();
        setTransformation(data);
      } catch (err) {
        console.error("Error fetching transformation:", err);
        setError("Failed to load transformation. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransformation();
  }, [id]);

  if (error) {
    return (
      <div className="container max-w-4xl mx-auto sm:px-2 md:px-2 py-8 px-4">
        <Card className="w-full">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-red-500 mb-4">{error}</p>
              <Button asChild>
                <Link href="/">Return to Home</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <Card className="w-full">
          {isLoading ? (
            <>
              <CardHeader>
                <Skeleton className="h-8 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-[400px] w-full" />
                <div className="mt-4">
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </CardContent>
            </>
          ) : (
            <>
              <CardHeader>
                <CardTitle className="text-xl md:text-2xl">
                  Transformation d'église
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {transformation?.imageUrl && (
                  <div className="relative w-full aspect-[4/3] overflow-hidden rounded-md">
                    <img
                      src={transformation.imageUrl}
                      alt={
                        transformation.description || "Transformation d'église"
                      }
                      className="object-cover w-full h-full"
                    />
                  </div>
                )}

                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Heart className="h-5 w-5 text-gray-500" />
                      <span className="text-sm text-gray-500">
                        {transformation?.likes || 0}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-5 w-5 text-gray-500" />
                      <span className="text-sm text-gray-500">
                        {transformation?.comments?.length || 0}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Share2 className="h-5 w-5 text-gray-500" />
                      <span className="text-sm text-gray-500">
                        {transformation?.shares || 0}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="prose max-w-none">
                  <h3 className="text-lg font-medium">Description</h3>
                  <p>
                    {transformation?.description ||
                      "Aucune description disponible."}
                  </p>
                </div>

                {transformation?.comments &&
                  transformation.comments.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-lg font-medium mb-4">Commentaires</h3>
                      <div className="space-y-4">
                        {transformation.comments.map(
                          (comment: any, index: number) => (
                            <div
                              key={index}
                              className="p-3 bg-gray-50 rounded-md"
                            >
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium">
                                  {comment.author}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {new Date(comment.date).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-sm">{comment.text}</p>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row gap-4">
                <Button asChild className="w-full sm:w-auto" size="lg">
                  <Link href="/signature">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Signer la pétition
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="w-full sm:w-auto"
                  size="lg"
                >
                  <Link href="/transformations">
                    Voir plus de transformations
                  </Link>
                </Button>
              </CardFooter>
            </>
          )}
        </Card>
      </div>
    </>
  );
}
