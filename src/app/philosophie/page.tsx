import Header from '@/components/Header'
import { type Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Perspective Philosophique - Pétition Laïque',
  description: 'Une réflexion sur notre démarche, inspirée par une perspective cosmique et humaniste.',
}

const PhilosophiePage = () => {
  return (<><Header/>
    <div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 py-16 sm:py-24">
      <div className="container mx-auto px-4 max-w-4xl">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-5xl md:text-6xl">
            Une Perspective Cosmique
          </h1>
          <p className="mt-4 text-lg leading-8 text-gray-600 dark:text-gray-400">
            Sur une querelle terrestre et la nécessité du changement systémique.
          </p>
        </header>

        <article className="prose prose-lg dark:prose-invert mx-auto space-y-6">
          <p>
            Regardez ce point. C'est ici. C'est notre foyer. C'est nous. Sur lui, tous ceux que vous aimez, tous ceux que vous connaissez, tous ceux dont vous avez entendu parler, tous les êtres humains qui aient jamais existé, ont vécu leur vie. L'ensemble de nos joies et de nos souffrances, des milliers de religions, d'idéologies et de doctrines économiques confiantes, chaque chasseur et chaque cueilleur, chaque héros et chaque lâche, chaque créateur et chaque destructeur de civilisation, chaque roi et chaque paysan... tous ont vécu ici, sur un grain de poussière suspendu dans un rayon de soleil.
          </p>
          
          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-6 border border-amber-200 dark:border-amber-700">
            <h3 className="text-xl font-semibold mb-4 text-amber-800 dark:text-amber-200">L'Illusion des Solutions Individuelles</h3>
            <p className="text-amber-900 dark:text-amber-100">
              Comme l'écrivain et activiste <strong>Derrick Jensen</strong> nous le rappelle : nous vivons dans l'illusion que les problèmes systémiques peuvent être résolus par des actions individuelles. Recycler, changer nos ampoules, ou même signer des pétitions ne suffisent pas face à des <strong>structures de pouvoir institutionnalisées</strong>. Le financement public des églises n'est pas un problème de conscience individuelle, mais un <strong>système organisé de privilège religieux</strong> qui nécessite une action collective directe.
            </p>
          </div>

          <p>
            Dans cette immensité, nos divisions, nos certitudes et l'importance que nous nous accordons semblent bien dérisoires. Sur cette petite scène, au cours des millénaires, nous avons inventé d'innombrables histoires pour nous rassurer face à l'obscurité, d'innombrables dieux pour peupler les cieux que nous commencions à peine à comprendre. Ces croyances, nées de notre enfance en tant qu'espèce, ont façonné nos cultures et nos lois.
          </p>
          
          <p>
            Mais nous avons grandi. Grâce à un outil remarquable – la méthode scientifique – nous avons commencé à déchiffrer le grand livre du Cosmos. Nous avons appris que les étoiles ne sont pas des feux de camp divins, mais d'autres soleils, peut-être entourés d'autres mondes. Nous avons compris que les lois de la nature sont universelles et ne répondent pas à nos prières.
          </p>

          <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-6 border border-red-200 dark:border-red-700">
            <h3 className="text-xl font-semibold mb-4 text-red-800 dark:text-red-200">La Nécessité de Démanteler les Systèmes Oppressifs</h3>
            <p className="text-red-900 dark:text-red-100">
              Jensen nous enseigne que <strong>les systèmes oppressifs ne se réforment pas d'eux-mêmes</strong>. Ils doivent être activement démantelés. Le système qui force 56% de non-croyants à financer les monuments d'une religion qu'ils rejettent n'évoluera pas par la simple bonne volonté. Il faut une <strong>résistance organisée</strong>, une <strong>désobéissance civile</strong>, et une <strong>action directe non-violente</strong> pour briser ces chaînes institutionnelles.
            </p>
          </div>

          <blockquote className="border-l-4 border-indigo-500 pl-4 italic">
            Alors, que signifie, aujourd'hui, sur ce petit monde, utiliser les ressources collectives de tous ses habitants pour entretenir les monuments d'une seule de ces anciennes mythologies ? Que signifie imposer le son des rituels d'un groupe à l'ensemble de la communauté, comme un rappel sonore d'une époque où nous en savions moins ?
          </blockquote>

          <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 border border-green-200 dark:border-green-700">
            <h3 className="text-xl font-semibold mb-4 text-green-800 dark:text-green-200">Au-delà de la Tolérance : L'Action Transformatrice</h3>
            <p className="text-green-900 dark:text-green-100">
              Jensen rejette la notion de "coexistence pacifique" avec l'injustice. <strong>La tolérance envers l'oppression est complice de l'oppression</strong>. Notre démarche ne vise pas à "respecter" un système qui nous exploite, mais à le <strong>transformer radicalement</strong>. Les 40 307 églises financées par l'argent public doivent devenir des <strong>espaces de liberté collective</strong> : bibliothèques, centres communautaires, laboratoires scientifiques, jardins partagés.
            </p>
          </div>

          <p>
            Ce n'est pas une question d'irrespect envers nos ancêtres. C'est une question de respect pour notre avenir. Les ressources publiques, fruit du travail de personnes de toutes croyances et de non-croyance, sont précieuses. Ne devraient-elles pas être consacrées à des objectifs qui nous unissent plutôt qu'à des dogmes qui nous divisent ? À l'éducation de nos enfants, à l'exploration de l'univers, à la protection de notre fragile biosphère ?
          </p>

          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-700">
            <h3 className="text-xl font-semibold mb-4 text-purple-800 dark:text-purple-200">La Culture de Résistance</h3>
            <p className="text-purple-900 dark:text-purple-100">
              Jensen nous appelle à créer une <strong>"culture de résistance"</strong> qui refuse les compromis avec l'injustice. Cette pétition n'est pas une demande polie, mais un <strong>acte de résistance culturelle</strong>. Nous ne demandons pas la permission de vivre libres du bruit religieux imposé. Nous <strong>déclarons notre droit</strong> à un espace public véritablement laïque et nous organisons pour le faire respecter.
            </p>
          </div>

          <p>
            Une société qui a le courage de regarder le Cosmos en face est une société qui doit aussi avoir le courage d'appliquer la raison à ses propres affaires. La laïcité, dans ce contexte, n'est pas un acte d'agression. C'est un acte de maturité. C'est la reconnaissance que l'espace public, comme le ciel étoilé, appartient à tout le monde et à personne en particulier. C'est la décision de laisser les mythes à la sphère privée et de construire notre avenir commun sur ce que nous pouvons connaître et vérifier ensemble.
          </p>

          <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-6 border border-indigo-200 dark:border-indigo-700">
            <h3 className="text-xl font-semibold mb-4 text-indigo-800 dark:text-indigo-200">L'Urgence de l'Action Directe</h3>
            <p className="text-indigo-900 dark:text-indigo-100">
              <strong>"L'espoir, c'est une action"</strong>, nous dit Jensen. Chaque signature de cette pétition, chaque partage, chaque conversation difficile avec nos voisins est un acte de résistance contre un système qui nous vole notre temps, notre argent et notre paix. Nous ne pouvons plus attendre que les institutions se réforment. <strong>Nous devons devenir le changement</strong> que nous voulons voir dans le monde.
            </p>
          </div>

          <p className="font-semibold">
            Sur ce grain de poussière, notre seule maison, la coopération et la raison ne sont pas des options, elles sont les conditions de notre survie. Il est peut-être temps de laisser les fantômes de notre passé reposer en paix et de tourner nos visages, ensemble, vers les étoiles. Mais d'abord, nous devons avoir le courage de démanteler les systèmes qui nous empêchent de lever les yeux.
          </p>
        </article>

        <div className="text-center mt-16">
          <Link href="/vision" className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 transition-colors">
            Lire notre vision détaillée
          </Link>
        </div>
        <div className="text-center mt-8">
          <a
            href="https://www.buymeacoffee.com/huaoe"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-6 py-3 border border-yellow-400 text-base font-medium rounded-md text-yellow-900 bg-yellow-200 hover:bg-yellow-300 transition-colors shadow"
            aria-label="Écris-moi un poème (soutien via Buy Me a Coffee)"
          >
            ✍️ Écris-moi un poème
          </a>
        </div>

      </div>
    </div>
    </>
  )
}

export default PhilosophiePage
