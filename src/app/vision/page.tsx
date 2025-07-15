import { type Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Notre Vision - Pétition Laïque',
  description: 'Découvrez les fondements et la vision de notre démarche pour une laïcité pleine et entière.',
}

const VisionPage = () => {
  return (
    <div className="bg-gradient-to-b from-orange-100 via-white to-blue-50 dark:from-gray-900 dark:to-gray-800 min-h-screen font-sans">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none z-0">
          {/* Parallax/Shapes */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-64 bg-gradient-to-r from-indigo-300/30 via-purple-200/40 to-orange-200/40 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-56 h-56 bg-gradient-to-br from-blue-200/30 to-green-200/40 rounded-full blur-2xl"></div>
        </div>
        <div className="relative z-10 container mx-auto px-4 max-w-4xl pt-16 pb-12 sm:pt-24 sm:pb-20 text-center">
          <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-700 via-orange-600 to-green-600 bg-clip-text text-transparent drop-shadow-lg">
            Notre Vision
          </h1>
          <p className="mt-6 text-xl sm:text-2xl text-gray-700 dark:text-gray-200 font-medium max-w-2xl mx-auto">
            Pour une République laïque, joyeuse, et résolument tournée vers l’avenir.
          </p>
        </div>
      </section>

      {/* Key Concepts Section */}
      <section className="container mx-auto px-4 max-w-5xl py-8 sm:py-12 grid md:grid-cols-3 gap-8">
        <Link href="/vision/liberte-conscience" className="group">
          <div className="bg-white/80 dark:bg-gray-900/70 rounded-2xl shadow-lg p-6 flex flex-col items-center text-center border-t-4 border-indigo-400 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
            <span className="mb-3 inline-flex items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-700/40 w-14 h-14 group-hover:bg-indigo-200 dark:group-hover:bg-indigo-600/50 transition-colors">
              <svg className="w-8 h-8 text-indigo-600 dark:text-indigo-300" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M12 20V8M5 12l7-7 7 7"/></svg>
            </span>
            <h3 className="font-bold text-lg mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors">Liberté de conscience</h3>
            <p className="text-gray-600 dark:text-gray-300">L'émancipation individuelle est le socle d'une société moderne, où chacun peut croire ou ne pas croire sans pression ni privilège.</p>
          </div>
        </Link>
        <Link href="/vision/equalite-republicaine" className="group">
          <div className="bg-white/80 dark:bg-gray-900/70 rounded-2xl shadow-lg p-6 flex flex-col items-center text-center border-t-4 border-orange-400 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
            <span className="mb-3 inline-flex items-center justify-center rounded-full bg-orange-100 dark:bg-orange-700/40 w-14 h-14 group-hover:bg-orange-200 dark:group-hover:bg-orange-600/50 transition-colors">
              <svg className="w-8 h-8 text-orange-600 dark:text-orange-300" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><path stroke="currentColor" strokeWidth="2" d="M8 12l2 2 4-4"/></svg>
            </span>
            <h3 className="font-bold text-lg mb-2 group-hover:text-orange-600 dark:group-hover:text-orange-300 transition-colors">Égalité républicaine</h3>
            <p className="text-gray-600 dark:text-gray-300">Aucune communauté ne doit bénéficier de privilèges hérités du passé, tous les citoyens contribuent équitablement à la vie publique.</p>
          </div>
        </Link>
        <Link href="/vision/patrimoine-vivant" className="group">
          <div className="bg-white/80 dark:bg-gray-900/70 rounded-2xl shadow-lg p-6 flex flex-col items-center text-center border-t-4 border-green-400 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
            <span className="mb-3 inline-flex items-center justify-center rounded-full bg-green-100 dark:bg-green-700/40 w-14 h-14 group-hover:bg-green-200 dark:group-hover:bg-green-600/50 transition-colors">
              <svg className="w-8 h-8 text-green-600 dark:text-green-300" fill="none" viewBox="0 0 24 24"><rect x="4" y="8" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="2"/><path stroke="currentColor" strokeWidth="2" d="M2 8V6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v2"/></svg>
            </span>
            <h3 className="font-bold text-lg mb-2 group-hover:text-green-600 dark:group-hover:text-green-300 transition-colors">Patrimoine vivant</h3>
            <p className="text-gray-600 dark:text-gray-300">Réinventer nos églises : de simples reliques à des espaces de création, de culture et de partage ouverts à tous.</p>
          </div>
        </Link>
      </section>

      {/* Arguments & Vision */}
      <section className="container mx-auto px-4 max-w-4xl py-12 sm:py-16">
        <article className="prose prose-lg dark:prose-invert mx-auto space-y-12">
          <section>
            <h2 className="text-3xl font-semibold">
              Une aberration juridique et démocratique
            </h2>
            <p>
              La <strong>loi de 1905</strong> a créé une distinction artificielle :
            </p>
            <ul>
              <li>
                <strong>Édifices antérieurs à 1905 :</strong> propriété publique (communes/État) → <strong>entretien public obligatoire</strong>
              </li>
              <li>
                <strong>Édifices postérieurs à 1905 :</strong> propriété diocésaine → entretien privé
              </li>
            </ul>
            <blockquote className="border-l-4 border-yellow-500 pl-4 italic">
              Ceci est en <strong>contradiction flagrante</strong> avec l'Article 2 de la loi de 1905 : <em>"La République ne reconnaît, ne salarie ni ne subventionne aucun culte"</em>.
            </blockquote>
          </section>

          <section>
            <h2 className="text-3xl font-semibold">
              Pourquoi cette Situation doit être Dénoncée
            </h2>
            <ol>
              <li>
                <strong>Violation du principe démocratique :</strong> Une majorité laïque (56%) finance une minorité religieuse (1,5% pratiquants).
              </li>
              <li>
                <strong>Contradiction avec l'évolution sociétale :</strong> Maintien d'un privilège historique catholique dans une France devenue majoritairement non-croyante.
              </li>
              <li>
                <strong>Inégalité entre cultes :</strong> Seul le catholicisme bénéficie de ce financement public massif, les autres religions finançant entièrement leurs lieux de culte.
              </li>
              <li>
                <strong>Anachronisme juridique :</strong> Une loi de 1905 maintient artificiellement des privilèges dans une société qui a radicalement évolué.
              </li>
            </ol>
            <p className="mt-4 font-semibold">
              Cette anomalie constitue l'une des dernières survivances du pouvoir clérical dans la République laïque et doit être questionnée au nom de l'égalité républicaine.
            </p>
          </section>

          <section>
            <h2 className="text-3xl font-semibold">
              Une Majorité Non-Croyante qui Refuse l'Oppression Cléricale
            </h2>
            <p>
              La France de 2025 a <strong>radicalement changé</strong> : <strong>56% de non-croyants</strong> constituent désormais la <strong>majorité culturelle</strong> face à <strong>1,5% de catholiques pratiquants</strong>. Cette révolution silencieuse marque la fin définitive de quinze siècles de domination chrétienne.
            </p>
            <ul>
              <li>
                <strong>L'oppression sonore</strong> des cloches imposées par une minorité religieuse.
              </li>
              <li>
                <strong>Le financement forcé</strong> de 40 307 églises par leurs impôts.
              </li>
              <li>
                <strong>Les privilèges anachroniques</strong> d'une religion qu'ils ont librement rejetée.
              </li>
              <li>
                <strong>L'imposition de rythmes religieux</strong> dans l'espace public laïque.
              </li>
            </ul>
            <p className="mt-4 font-medium">
              La laïcité n'est plus une tolérance accordée aux religions, mais l'expression légitime d'une société émancipée qui a choisi la <strong>raison</strong> contre le <strong>dogme</strong>, la <strong>liberté de conscience</strong> contre l'<strong>autoritarisme clérical</strong>, et l'<strong>égalité républicaine</strong> contre les <strong>privilèges confessionnels</strong>.
            </p>
          </section>
        </article>
      </section>

      {/* Call to Action */}
      <div className="container mx-auto max-w-3xl px-4 pb-24">
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-center">
          <Link
            href="/#petition-form"
            className="inline-flex items-center justify-center px-8 py-4 rounded-full text-lg font-bold text-white bg-gradient-to-r from-indigo-600 via-blue-500 to-green-500 shadow-lg hover:scale-105 transition-all"
          >
            Signer la Pétition
          </Link>
          <Link
            href="/utopie"
            className="inline-flex items-center justify-center px-8 py-4 rounded-full text-lg font-bold text-white bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 shadow-lg hover:scale-105 transition-all"
          >
            Oser l'utopie !
          </Link>
        </div>
      </div>
    </div>
  )
}

export default VisionPage
