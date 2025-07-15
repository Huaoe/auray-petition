import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { utopieIdeas } from '@/lib/utopie-data';
import { 
  Heart, 
  Home, 
  Wifi, 
  BookOpen, 
  Users, 
  Palette, 
  Leaf, 
  MapPin, 
  GraduationCap, 
  Music,
  ArrowLeft,
  ExternalLink,
  MapPin as LocationIcon,
  LucideIcon 
} from 'lucide-react';

// Mapping des icônes pour l'affichage dynamique
const iconMap: Record<string, LucideIcon> = {
  Heart,
  Home,
  Wifi,
  BookOpen,
  Users,
  Palette,
  Leaf,
  MapPin,
  GraduationCap,
  Music,
};

interface PageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  return utopieIdeas.map((idea) => ({
    slug: idea.slug,
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const idea = utopieIdeas.find((idea) => idea.slug === params.slug);
  
  if (!idea) {
    return {
      title: 'Idée non trouvée',
    };
  }

  return {
    title: `${idea.title} - Utopie | Pétition Auray`,
    description: idea.shortDescription,
  };
}

export default function UtopieDetailPage({ params }: PageProps) {
  const idea = utopieIdeas.find((idea) => idea.slug === params.slug);

  if (!idea) {
    notFound();
  }

  const IconComponent = iconMap[idea.icon];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-12">
        {/* Navigation */}
        <div className="mb-8">
          <Link 
            href="/utopie" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour aux projets utopiques
          </Link>
        </div>

        {/* En-tête de la page */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
            {IconComponent && (
              <IconComponent className="w-10 h-10 text-blue-600" />
            )}
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {idea.title}
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            {idea.shortDescription}
          </p>

          {/* Citation d'inspiration */}
          {idea.quote && (
            <div className="bg-gradient-to-r from-blue-100 to-purple-100 border-l-4 border-blue-500 p-6 max-w-4xl mx-auto rounded-lg">
              <blockquote className="text-lg italic text-gray-700 mb-3">
                "{idea.quote.text}"
              </blockquote>
              <cite className="text-blue-600 font-semibold">
                — {idea.quote.author}
              </cite>
            </div>
          )}

          {/* Image inspirante (description) */}
          {idea.inspiringImage && (
            <div className="mt-8 bg-gray-100 rounded-lg p-6 max-w-4xl mx-auto">
              <div className="text-gray-600 italic">
                💡 Vision inspirante : {idea.inspiringImage.description}
              </div>
            </div>
          )}
        </div>

        {/* Contenu principal */}
        <div className="max-w-6xl mx-auto">
          <div className="grid gap-8">
            {idea.content.sections.map((section, index) => (
              <Card key={index} className="border-2 border-gray-100 hover:border-blue-200 transition-colors">
                <CardHeader>
                  <CardTitle className="text-2xl text-gray-900 border-b border-gray-200 pb-3">
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <p className="text-gray-700 leading-relaxed mb-6">
                    {section.description}
                  </p>

                  {/* Exemples concrets */}
                  {section.examples && section.examples.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <LocationIcon className="w-5 h-5 mr-2 text-green-600" />
                        Exemples Inspirants
                      </h4>
                      <div className="grid gap-4 md:grid-cols-2">
                        {section.examples.map((example, exampleIndex) => (
                          <div 
                            key={exampleIndex}
                            className="bg-green-50 border border-green-200 rounded-lg p-4"
                          >
                            <h5 className="font-semibold text-green-800 mb-1">
                              {example.name}
                            </h5>
                            <p className="text-sm text-green-600 mb-2">
                              📍 {example.location}
                            </p>
                            <p className="text-sm text-gray-700">
                              {example.description}
                            </p>
                            {example.link && (
                              <a 
                                href={example.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center text-xs text-green-600 hover:text-green-800 mt-2"
                              >
                                Visiter le site
                                <ExternalLink className="w-3 h-3 ml-1" />
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Liens utiles */}
                  {section.links && section.links.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <ExternalLink className="w-5 h-5 mr-2 text-blue-600" />
                        Resources & Liens Utiles
                      </h4>
                      <div className="space-y-3">
                        {section.links.map((link, linkIndex) => (
                          <a
                            key={linkIndex}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block bg-blue-50 border border-blue-200 rounded-lg p-4 hover:bg-blue-100 transition-colors group"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <h5 className="font-semibold text-blue-800 group-hover:text-blue-900">
                                  {link.title}
                                </h5>
                                <p className="text-sm text-blue-600 mt-1">
                                  {link.description}
                                </p>
                              </div>
                              <ExternalLink className="w-5 h-5 text-blue-500 group-hover:text-blue-700" />
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Call to action */}
          <div className="mt-12 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">
              Ce Projet Vous Inspire ?
            </h2>
            <p className="text-lg mb-6 opacity-90">
              Rejoignez le mouvement pour transformer les églises d'Auray en espaces vivants au service de tous.
            </p>
            <div className="space-x-4">
              <Link 
                href="/vision" 
                className="inline-block bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors"
              >
                Voir Notre Vision
              </Link>
              <Link 
                href="/utopie" 
                className="inline-block border-2 border-white text-white font-semibold px-6 py-3 rounded-lg hover:bg-white hover:text-blue-600 transition-colors"
              >
                Tous les Projets
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
