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

export const metadata = {
  title: 'Utopie - 10 Idées pour Transformer nos Églises | Pétition Auray',
  description: 'Découvrez 10 propositions concrètes et documentées pour transformer les églises d\'Auray en lieux de vie, de culture et de partage au service de tous les citoyens.',
};

export default function UtopiePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-12">
        {/* En-tête */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Osons l'Utopie !
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            10 propositions concrètes et documentées pour transformer les églises d'Auray 
            en espaces vivants au service de la communauté. Chaque projet s'inspire d'exemples 
            réussis en Europe et s'appuie sur la vision de grands penseurs de l'architecture et de l'urbanisme.
          </p>
          <div className="bg-blue-100 border-l-4 border-blue-500 p-4 max-w-4xl mx-auto">
            <p className="text-blue-800 font-medium italic">
              "L'architecture est le grand livre de l'humanité, l'expression principale de l'homme à ses divers états de développement"
            </p>
            <p className="text-blue-600 text-sm mt-2">— Victor Hugo</p>
          </div>
        </div>

        {/* Grille des idées */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {utopieIdeas.map((idea) => {
            const IconComponent = iconMap[idea.icon];
            return (
              <Link 
                key={idea.slug} 
                href={`/utopie/${idea.slug}`}
                className="group block transition-transform hover:scale-105"
              >
                <Card className="h-full border-2 hover:border-blue-300 hover:shadow-lg transition-all duration-200">
                  <CardHeader className="text-center pb-4">
                    <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                      {IconComponent && (
                        <IconComponent className="w-8 h-8 text-blue-600" />
                      )}
                    </div>
                    <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                      {idea.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {idea.shortDescription}
                    </p>
                    {idea.quote && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <blockquote className="text-xs italic text-gray-500">
                          "{idea.quote.text.substring(0, 80)}..."
                        </blockquote>
                        <cite className="text-xs text-blue-600 font-medium">
                          — {idea.quote.author}
                        </cite>
                      </div>
                    )}
                    <div className="mt-4 text-right">
                      <span className="text-blue-600 text-sm font-medium group-hover:underline">
                        Découvrir le projet →
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Call to action */}
        <div className="text-center mt-12 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-4">
            Ensemble, Construisons l'Avenir d'Auray
          </h2>
          <p className="text-lg mb-6 opacity-90">
            Ces projets ne sont pas des rêves, mais des réalités possibles. 
            Rejoignez le mouvement pour transformer notre patrimoine en espaces de vie.
          </p>
          <Link 
            href="/vision" 
            className="inline-block bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors"
          >
            Retour à la Vision
          </Link>
        </div>
      </div>
    </div>
  );
}
