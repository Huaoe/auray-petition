import { Metadata } from "next";
import { getTransformationMetadata } from "../../../lib/transformation-utils";
import { CONSTANTS } from "../../../lib/utils";

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = params;
  const metadata = await getTransformationMetadata(id);

  return {
    title: metadata.title,
    description: metadata.description,
    openGraph: {
      title: metadata.title,
      description: metadata.description,
      images: [
        {
          url: metadata.imageUrl,
          width: 1200,
          height: 630,
          alt: `Transformation de ${CONSTANTS.CHURCH_NAME}`,
        },
      ],
      locale: "fr_FR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: metadata.title,
      description: metadata.description,
      images: [metadata.imageUrl],
    },
  };
}