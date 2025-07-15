import Link from 'next/link';
import { ArrowLeft, Scale, Users, Euro, Building2, TrendingUp } from 'lucide-react';

export default function EgaliteRepublicainePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 dark:from-orange-950 dark:via-gray-900 dark:to-red-950">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-32 w-96 h-96 bg-orange-300 dark:bg-orange-700 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-red-300 dark:bg-red-700 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      </div>

      {/* Navigation */}
      <section className="relative z-10 container mx-auto px-4 pt-8">
        <Link href="/vision" className="inline-flex items-center text-orange-600 dark:text-orange-300 hover:text-orange-800 dark:hover:text-orange-100 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour à Notre Vision
        </Link>
      </section>

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-4 max-w-4xl pt-8 pb-12 text-center">
        <div className="mb-8 inline-flex items-center justify-center rounded-full bg-orange-100 dark:bg-orange-700/40 w-20 h-20">
          <Scale className="w-10 h-10 text-orange-600 dark:text-orange-300" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-6">
          Égalité Républicaine
        </h1>
        <p className="text-xl sm:text-2xl text-gray-700 dark:text-gray-200 font-medium max-w-3xl mx-auto">
          Tous les citoyens égaux devant la loi, sans privilège ni discrimination
        </p>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 max-w-4xl py-12">
        <article className="prose prose-lg dark:prose-invert mx-auto space-y-12">
          
          {/* Definition */}
          <section className="bg-white/80 dark:bg-gray-900/70 rounded-2xl p-8 shadow-lg border-l-4 border-orange-500">
            <h2 className="text-2xl font-bold text-orange-600 dark:text-orange-300 mb-4 flex items-center">
              <Scale className="mr-3 h-6 w-6" />
              L'Égalité Républicaine en Question
            </h2>
            <p className="text-lg leading-relaxed">
              L'égalité républicaine signifie que <strong>tous les citoyens sont égaux devant la loi</strong>, sans distinction d'origine, de race ou de religion. Chacun contribue équitablement aux charges publiques selon ses facultés.
            </p>
            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 mt-6 border border-red-200 dark:border-red-700">
              <p className="text-red-800 dark:text-red-200 font-medium">
                ⚖️ <strong>Pourtant aujourd'hui</strong> : 76% des Français non-pratiquants financent l'entretien d'édifices religieux qu'ils n'utilisent pas.
              </p>
            </div>
          </section>

          {/* Financial Impact */}
          <section>
            <h2 className="text-2xl font-bold text-orange-600 dark:text-orange-300 mb-6 flex items-center">
              <Euro className="mr-3 h-6 w-6" />
              L'Impact Financier Inégalitaire
            </h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/40 dark:to-red-800/40 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-red-700 dark:text-red-300">2 Mds €</div>
                <div className="text-sm text-red-600 dark:text-red-400 mt-1">Coût annuel d'entretien</div>
              </div>
              <div className="bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/40 dark:to-orange-800/40 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-orange-700 dark:text-orange-300">40 307</div>
                <div className="text-sm text-orange-600 dark:text-orange-400 mt-1">Édifices financés publiquement</div>
              </div>
              <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-900/40 dark:to-yellow-800/40 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-yellow-700 dark:text-yellow-300">76%</div>
                <div className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">Français non-pratiquants</div>
              </div>
            </div>

            <div className="mt-8 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-6 border border-amber-200 dark:border-amber-700">
              <h3 className="text-xl font-semibold mb-4">Répartition Inégale des Charges</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Athées/Agnostiques/Non-pratiquants</span>
                  <span className="font-bold text-red-600 dark:text-red-400">Payent 100% • Utilisent 0%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Pratiquants réguliers (24%)</span>
                  <span className="font-bold text-green-600 dark:text-green-400">Payent 24% • Utilisent 100%</span>
                </div>
              </div>
            </div>
          </section>

          {/* Comparative Analysis */}
          <section>
            <h2 className="text-2xl font-bold text-orange-600 dark:text-orange-300 mb-6 flex items-center">
              <Building2 className="mr-3 h-6 w-6" />
              Comparaison avec les Services Publics
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 border border-green-200 dark:border-green-700">
                <h3 className="text-lg font-semibold text-green-700 dark:text-green-300 mb-3">✅ Services Publics Légitimes</h3>
                <ul className="space-y-2 text-sm">
                  <li>• <strong>Écoles</strong> : utilisées par tous les enfants</li>
                  <li>• <strong>Hôpitaux</strong> : soignent tous les citoyens</li>
                  <li>• <strong>Routes</strong> : empruntées par tous</li>
                  <li>• <strong>Bibliothèques</strong> : ouvertes à tous</li>
                </ul>
                <p className="text-green-700 dark:text-green-300 mt-4 font-medium">
                  → Financement justifié par l'usage universel
                </p>
              </div>
              
              <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-6 border border-red-200 dark:border-red-700">
                <h3 className="text-lg font-semibold text-red-700 dark:text-red-300 mb-3">❌ Édifices Religieux</h3>
                <ul className="space-y-2 text-sm">
                  <li>• <strong>Usage exclusif</strong> : 24% de pratiquants</li>
                  <li>• <strong>Finalité privée</strong> : culte catholique</li>
                  <li>• <strong>Accès limité</strong> : horaires restreints</li>
                  <li>• <strong>Communauté fermée</strong> : excluant par nature</li>
                </ul>
                <p className="text-red-700 dark:text-red-300 mt-4 font-medium">
                  → Financement injustifié par l'inégalité d'usage
                </p>
              </div>
            </div>
          </section>

          {/* Republican Principles */}
          <section>
            <h2 className="text-2xl font-bold text-orange-600 dark:text-orange-300 mb-6 flex items-center">
              <Users className="mr-3 h-6 w-6" />
              Les Principes Républicains Bafoués
            </h2>
            
            <div className="space-y-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-700">
                <h3 className="text-lg font-semibold text-blue-700 dark:text-blue-300 mb-2">Article 1 de la Constitution</h3>
                <blockquote className="italic text-blue-800 dark:text-blue-200 border-l-4 border-blue-400 pl-4">
                  "La France assure l'égalité devant la loi de tous les citoyens sans distinction d'origine, de race ou de religion"
                </blockquote>
                <p className="mt-3 text-sm">
                  <strong>Contradiction</strong> : Le financement public des églises crée une distinction de fait entre croyants et non-croyants.
                </p>
              </div>
              
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-700">
                <h3 className="text-lg font-semibold text-purple-700 dark:text-purple-300 mb-2">Article 13 DDHC 1789</h3>
                <blockquote className="italic text-purple-800 dark:text-purple-200 border-l-4 border-purple-400 pl-4">
                  "Pour l'entretien de la force publique, et pour les dépenses d'administration, une contribution commune est indispensable : elle doit être également répartie entre tous les citoyens, en raison de leurs facultés"
                </blockquote>
                <p className="mt-3 text-sm">
                  <strong>Violation</strong> : Les non-croyants paient pour des services qu'ils ne peuvent pas utiliser selon leurs convictions.
                </p>
              </div>
            </div>
          </section>

          {/* Solutions */}
          <section>
            <h2 className="text-2xl font-bold text-orange-600 dark:text-orange-300 mb-6 flex items-center">
              <TrendingUp className="mr-3 h-6 w-6" />
              Vers une Vraie Égalité Républicaine
            </h2>
            
            <div className="bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 border border-green-200 dark:border-green-700">
              <h3 className="text-xl font-semibold text-green-700 dark:text-green-300 mb-4">🎯 Notre Proposition</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">💰 Fin du Financement Public</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• Transfert aux communautés religieuses</li>
                    <li>• Économies de 2 milliards d'euros annuels</li>
                    <li>• Respect de la loi de 1905</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">🏛️ Transformation des Espaces</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• Rachat par les communes</li>
                    <li>• Conversion en équipements publics</li>
                    <li>• Bénéfice pour tous les citoyens</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <section className="bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-4">Rétablissons l'Égalité Républicaine</h2>
            <p className="text-lg mb-6">
              Une République juste ne peut tolérer que 76% de ses citoyens financent des services qu'ils ne peuvent utiliser selon leurs convictions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/#petition" className="bg-white text-orange-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Signer la Pétition
              </Link>
              <Link href="/utopie" className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-orange-600 transition-colors">
                Voir les Alternatives
              </Link>
            </div>
          </section>

        </article>
      </section>
    </main>
  );
}
