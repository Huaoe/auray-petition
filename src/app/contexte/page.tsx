import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Scale, Users, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function ContextePage() {
  return (
    <div className="bg-white dark:bg-gray-900">
      <main className="container mx-auto px-4 py-16 sm:py-24">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-5xl">
            Le Contexte : Pourquoi cette Pétition ?
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-400">
            Comprendre les enjeux juridiques, sociologiques et financiers qui rendent cette démarche nécessaire pour une République laïque et équitable.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="h-6 w-6 text-blue-500" />
                <span>Cadre Juridique</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                La loi de 1905 est claire : la République ne subventionne aucun culte. Pourtant, une exception historique force les communes à entretenir les églises construites avant cette date.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart className="h-6 w-6 text-green-500" />
                <span>Réalité Sociologique</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-3">
                Avec <strong>56% de non-croyants</strong> (sondage IFOP-Fiducial 2023 pour Sud Radio), la France est majoritairement laïque. Le financement public d'un culte minoritaire est un anachronisme démocratique.
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                <em>Source : Sondage IFOP-Fiducial, avril 2023 - "Religion : 56% des Français ne sont pas croyants"</em>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-6 w-6 text-yellow-500" />
                <span>Conséquences</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Maintenir ce système, c'est ignorer l'évolution de la société et imposer les charges d'un culte à tous, au détriment de services publics essentiels.
              </p>
            </CardContent>
          </Card>

          <Link href="/philosophie" className="block hover:scale-105 transition-transform duration-300">
            <Card className="h-full bg-gray-50 dark:bg-gray-800/50 border-dashed hover:border-purple-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-6 w-6 text-purple-500" />
                  <span>Notre Philosophie</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Une perspective cosmique sur nos querelles terrestres, inspirée par Carl Sagan. Une invitation à la raison et à l'unité.
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>

        <div className="mt-16 flex items-center justify-center gap-x-6">
          <Link
            href="/vision"
            className="rounded-md bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors"
          >
            Notre vision détaillée
          </Link>
          <Link href="/#petition-form" className="text-sm font-semibold leading-6 text-gray-900 dark:text-gray-100">
            Signer la pétition <span aria-hidden="true">→</span>
          </Link>
        </div>
      </main>
    </div>
  );
}
