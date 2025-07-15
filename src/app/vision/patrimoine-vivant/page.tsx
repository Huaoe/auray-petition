import Link from 'next/link';
import { ArrowLeft, Sparkles, Camera, Users, Palette, Coffee, Book } from 'lucide-react';

export default function PatrimoineVivantPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-green-950 dark:via-gray-900 dark:to-emerald-950">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-32 w-96 h-96 bg-green-300 dark:bg-green-700 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-emerald-300 dark:bg-emerald-700 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      </div>

      {/* Navigation */}
      <section className="relative z-10 container mx-auto px-4 pt-8">
        <Link href="/vision" className="inline-flex items-center text-green-600 dark:text-green-300 hover:text-green-800 dark:hover:text-green-100 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour à Notre Vision
        </Link>
      </section>

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-4 max-w-4xl pt-8 pb-12 text-center">
        <div className="mb-8 inline-flex items-center justify-center rounded-full bg-green-100 dark:bg-green-700/40 w-20 h-20">
          <Sparkles className="w-10 h-10 text-green-600 dark:text-green-300" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-6">
          Patrimoine Vivant
        </h1>
        <p className="text-xl sm:text-2xl text-gray-700 dark:text-gray-200 font-medium max-w-3xl mx-auto">
          Transformer nos églises en espaces de création, de culture et de partage ouverts à tous
        </p>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 max-w-4xl py-12">
        <article className="prose prose-lg dark:prose-invert mx-auto space-y-12">
          
          {/* Definition */}
          <section className="bg-white/80 dark:bg-gray-900/70 rounded-2xl p-8 shadow-lg border-l-4 border-green-500">
            <h2 className="text-2xl font-bold text-green-600 dark:text-green-300 mb-4 flex items-center">
              <Sparkles className="mr-3 h-6 w-6" />
              Un Patrimoine qui Vit et Respire
            </h2>
            <p className="text-lg leading-relaxed">
              Le patrimoine vivant, c'est <strong>donner une seconde vie</strong> à nos édifices historiques en les transformant en lieux d'échange, de création et de culture accessibles à tous, sans distinction de croyance.
            </p>
            <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-4 mt-6 border border-emerald-200 dark:border-emerald-700">
              <p className="text-emerald-800 dark:text-emerald-200 font-medium">
                ✨ <strong>L'idée</strong> : Préserver la beauté architecturale tout en créant des espaces utiles à toute la communauté.
              </p>
            </div>
          </section>

          {/* Current State */}
          <section>
            <h2 className="text-2xl font-bold text-green-600 dark:text-green-300 mb-6 flex items-center">
              <Camera className="mr-3 h-6 w-6" />
              État Actuel : Un Gâchis Monumental
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-6 border border-red-200 dark:border-red-700">
                <h3 className="text-lg font-semibold text-red-700 dark:text-red-300 mb-3">😔 Situation Actuelle</h3>
                <ul className="space-y-2 text-sm">
                  <li>• <strong>40 307 églises</strong> majoritairement vides</li>
                  <li>• <strong>Ouverture limitée</strong> : quelques heures par semaine</li>
                  <li>• <strong>Usage restreint</strong> : 24% de pratiquants seulement</li>
                  <li>• <strong>Entretien coûteux</strong> : 2 milliards d'euros annuels</li>
                  <li>• <strong>Patrimoine "figé"</strong> dans une fonction unique</li>
                </ul>
              </div>
              
              <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 border border-green-200 dark:border-green-700">
                <h3 className="text-lg font-semibold text-green-700 dark:text-green-300 mb-3">🌟 Potentiel Inexploité</h3>
                <ul className="space-y-2 text-sm">
                  <li>• <strong>Architecture exceptionnelle</strong> à valoriser</li>
                  <li>• <strong>Volumes impressionnants</strong> pour événements</li>
                  <li>• <strong>Acoustique naturelle</strong> parfaite</li>
                  <li>• <strong>Localisation centrale</strong> dans chaque commune</li>
                  <li>• <strong>Patrimoine commun</strong> appartenant à tous</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Success Stories */}
          <section>
            <h2 className="text-2xl font-bold text-green-600 dark:text-green-300 mb-6 flex items-center">
              <Users className="mr-3 h-6 w-6" />
              Succès Internationaux
            </h2>
            
            <div className="space-y-8">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-700">
                <div className="flex items-start gap-4">
                  <Book className="w-8 h-8 text-blue-600 dark:text-blue-300 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold text-blue-700 dark:text-blue-300 mb-2">🇳🇱 Librairie Dominicains - Maastricht</h3>
                    <p className="text-blue-800 dark:text-blue-200 mb-3">
                      Cette église gothique du XIIIe siècle a été magnifiquement transformée en <strong>librairie moderne</strong>. Les étagères montent jusqu'aux voûtes, créant un spectacle époustouflant qui attire des visiteurs du monde entier.
                    </p>
                    <div className="bg-blue-100 dark:bg-blue-800/30 rounded-lg p-3">
                      <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                        ✅ <strong>Résultat</strong> : Destination touristique internationale • Patrimoine préservé • Économie locale dynamisée
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-700">
                <div className="flex items-start gap-4">
                  <Palette className="w-8 h-8 text-purple-600 dark:text-purple-300 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold text-purple-700 dark:text-purple-300 mb-2">🇧🇪 The Jane - Anvers</h3>
                    <p className="text-purple-800 dark:text-purple-200 mb-3">
                      Cette ancienne chapelle militaire abrite aujourd'hui un <strong>restaurant 2 étoiles Michelin</strong>. L'architecte a préservé les voûtes gothiques tout en créant un espace gastronomique d'exception.
                    </p>
                    <div className="bg-purple-100 dark:bg-purple-800/30 rounded-lg p-3">
                      <p className="text-sm font-medium text-purple-700 dark:text-purple-300">
                        ✅ <strong>Résultat</strong> : Destination culinaire mondiale • Emplois créés • Patrimoine sublimé
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-6 border border-amber-200 dark:border-amber-700">
                <div className="flex items-start gap-4">
                  <Coffee className="w-8 h-8 text-amber-600 dark:text-amber-300 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold text-amber-700 dark:text-amber-300 mb-2">🇫🇷 Chapelle Mondésir - Nantes</h3>
                    <p className="text-amber-800 dark:text-amber-200 mb-3">
                      Reconvertie en <strong>espace de coworking</strong>, cette chapelle accueille 60 postes de travail dans un cadre inspirant. Les bancs ont été remplacés par de grandes tables, l'autel par un coin détente.
                    </p>
                    <div className="bg-amber-100 dark:bg-amber-800/30 rounded-lg p-3">
                      <p className="text-sm font-medium text-amber-700 dark:text-amber-300">
                        ✅ <strong>Résultat</strong> : "C'est très inspirant, un lieu apaisant et serein" - Témoignage utilisatrice
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Transformation Ideas */}
          <section>
            <h2 className="text-2xl font-bold text-green-600 dark:text-green-300 mb-6">
              10 Idées de Transformation
            </h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { icon: "🏋️", title: "Salle de Sport", desc: "Escalade, fitness, sports collectifs" },
                { icon: "🎭", title: "Centre Culturel", desc: "Théâtre, concerts, expositions" },
                { icon: "📚", title: "Bibliothèque", desc: "Espace lecture et étude" },
                { icon: "🍽️", title: "Restaurant", desc: "Gastronomie dans un cadre unique" },
                { icon: "🎨", title: "Atelier d'Artistes", desc: "Résidences et espaces créatifs" },
                { icon: "🌱", title: "Jardin Botanique", desc: "Serre et espaces verts intérieurs" },
                { icon: "🏛️", title: "Mairie Annexe", desc: "Services publics de proximité" },
                { icon: "💼", title: "Centre de Formation", desc: "Apprentissage et développement" },
                { icon: "🎉", title: "Salle des Fêtes", desc: "Mariages, événements communautaires" },
                { icon: "🏠", title: "Logements", desc: "Lofts et espaces de vie atypiques" }
              ].map((idea, index) => (
                <div key={index} className="bg-white/80 dark:bg-gray-900/70 rounded-xl p-4 shadow-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{idea.icon}</span>
                    <div>
                      <h3 className="font-semibold text-gray-800 dark:text-gray-200">{idea.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{idea.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Benefits */}
          <section>
            <h2 className="text-2xl font-bold text-green-600 dark:text-green-300 mb-6">
              Les Bénéfices du Patrimoine Vivant
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-xl p-6 text-center">
                <div className="text-4xl mb-3">🏛️</div>
                <h3 className="font-bold text-green-700 dark:text-green-300 mb-2">Préservation</h3>
                <p className="text-sm text-green-600 dark:text-green-400">
                  Sauvegarde du patrimoine architectural par un usage régulier et un entretien justifié
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-xl p-6 text-center">
                <div className="text-4xl mb-3">👥</div>
                <h3 className="font-bold text-blue-700 dark:text-blue-300 mb-2">Inclusion</h3>
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  Accès pour tous les citoyens, sans distinction de croyance ou d'origine
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-xl p-6 text-center">
                <div className="text-4xl mb-3">💡</div>
                <h3 className="font-bold text-purple-700 dark:text-purple-300 mb-2">Innovation</h3>
                <p className="text-sm text-purple-600 dark:text-purple-400">
                  Création d'espaces uniques stimulant la créativité et l'économie locale
                </p>
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <section className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-4">Donnons Vie à Notre Patrimoine</h2>
            <p className="text-lg mb-6">
              Nos églises peuvent devenir des lieux de rencontre, de création et de culture pour tous les citoyens. Ensemble, créons un patrimoine vivant !
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/#petition" className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Signer la Pétition
              </Link>
              <Link href="/utopie" className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors">
                Explorer les Transformations
              </Link>
            </div>
          </section>

        </article>
      </section>
    </main>
  );
}
