import Link from 'next/link';
import { ArrowLeft, Heart, Brain, Users, BookOpen } from 'lucide-react';

export default function LiberteConsciencePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-indigo-950 dark:via-gray-900 dark:to-purple-950">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-32 w-96 h-96 bg-indigo-300 dark:bg-indigo-700 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-purple-300 dark:bg-purple-700 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      </div>

      {/* Navigation */}
      <section className="relative z-10 container mx-auto px-4 pt-8">
        <Link href="/vision" className="inline-flex items-center text-indigo-600 dark:text-indigo-300 hover:text-indigo-800 dark:hover:text-indigo-100 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour à Notre Vision
        </Link>
      </section>

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-4 max-w-4xl pt-8 pb-12 text-center">
        <div className="mb-8 inline-flex items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-700/40 w-20 h-20">
          <Brain className="w-10 h-10 text-indigo-600 dark:text-indigo-300" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
          Liberté de Conscience
        </h1>
        <p className="text-xl sm:text-2xl text-gray-700 dark:text-gray-200 font-medium max-w-3xl mx-auto">
          Le droit fondamental de croire ou de ne pas croire, sans contrainte ni privilège
        </p>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 max-w-4xl py-12">
        <article className="prose prose-lg dark:prose-invert mx-auto space-y-12">
          
          {/* Definition */}
          <section className="bg-white/80 dark:bg-gray-900/70 rounded-2xl p-8 shadow-lg border-l-4 border-indigo-500">
            <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-300 mb-4 flex items-center">
              <Heart className="mr-3 h-6 w-6" />
              Qu'est-ce que la Liberté de Conscience ?
            </h2>
            <p className="text-lg leading-relaxed">
              La liberté de conscience est <strong>le droit inaliénable</strong> de chaque individu à former ses propres convictions religieuses, philosophiques ou morales, et à les exprimer librement ou à s'abstenir de toute expression.
            </p>
            <p className="text-lg leading-relaxed mt-4">
              Elle implique <strong>l'absence de coercition</strong> : nul ne peut être contraint d'adopter une croyance, ni d'en abandonner une, ni de financer des pratiques auxquelles il n'adhère pas.
            </p>
          </section>

          {/* Historical Context */}
          <section>
            <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-300 mb-6 flex items-center">
              <BookOpen className="mr-3 h-6 w-6" />
              Contexte Historique Français
            </h2>
            
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-6 border border-amber-200 dark:border-amber-700">
              <h3 className="text-xl font-semibold mb-4">La Loi de 1905 : Un Idéal Trahi</h3>
              <p>
                La loi de séparation de 1905 avait pour ambition de <strong>garantir la liberté de conscience</strong> en établissant la neutralité de l'État. Mais cette noble intention a été détournée :
              </p>
              <ul className="mt-4 space-y-2">
                <li><strong>40 307 édifices religieux</strong> restent financés par l'argent public</li>
                <li><strong>2 milliards d'euros annuels</strong> d'entretien financés par tous les citoyens</li>
                <li><strong>76% de non-pratiquants</strong> contraints de financer le culte catholique</li>
              </ul>
            </div>
          </section>

          {/* Modern Challenges */}
          <section>
            <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-300 mb-6">
              Les Défis Contemporains
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/80 dark:bg-gray-900/70 rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-3">❌ Situation Actuelle</h3>
                <ul className="space-y-2 text-sm">
                  <li>• Financement public obligatoire des édifices religieux</li>
                  <li>• Pas de choix pour les contribuables non-croyants</li>
                  <li>• Privilège historique maintenu artificiellement</li>
                  <li>• Inégalité de traitement entre citoyens</li>
                </ul>
              </div>
              
              <div className="bg-white/80 dark:bg-gray-900/70 rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-green-600 dark:text-green-400 mb-3">✅ Vision d'Avenir</h3>
                <ul className="space-y-2 text-sm">
                  <li>• Liberté totale de conscience pour tous</li>
                  <li>• Fin du financement public du culte</li>
                  <li>• Transformation des églises en espaces publics</li>
                  <li>• Égalité républicaine effective</li>
                </ul>
              </div>
            </div>
          </section>

          {/* International Examples */}
          <section>
            <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-300 mb-6 flex items-center">
              <Users className="mr-3 h-6 w-6" />
              Exemples Internationaux
            </h2>
            
            <div className="space-y-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-700">
                <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-300 mb-2">🇺🇸 États-Unis</h3>
                <p>Le Premier Amendement établit que <em>"Le Congrès ne fera aucune loi... concernant l'établissement d'une religion"</em>. Principe de séparation constitutionnelle depuis 1791.</p>
              </div>
              
              <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 border border-green-200 dark:border-green-700">
                <h3 className="text-lg font-semibold text-green-700 dark:text-green-300 mb-2">🇳🇱 Pays-Bas</h3>
                <p>De nombreuses églises ont été reconverties en <strong>espaces culturels, logements et lieux communautaires</strong>, illustrant une approche pragmatique du patrimoine religieux.</p>
              </div>
              
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-700">
                <h3 className="text-lg font-semibold text-purple-700 dark:text-purple-300 mb-2">🇩🇪 Allemagne</h3>
                <p>L'évolution démographique a conduit à repenser l'usage d'anciens édifices religieux, avec des <strong>reconversions en centres culturels et espaces communautaires</strong>.</p>
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <section className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-4">Agissons pour une Vraie Liberté de Conscience</h2>
            <p className="text-lg mb-6">
              La liberté de conscience ne peut être complète tant que l'État finance des édifices religieux avec l'argent de tous les citoyens.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/#petition" className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Signer la Pétition
              </Link>
              <Link href="/utopie" className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-indigo-600 transition-colors">
                Découvrir les Transformations
              </Link>
            </div>
          </section>

        </article>
      </section>
    </main>
  );
}
