import {
  Heart,
  Home,
  Briefcase,
  BookOpen,
  Utensils,
  Film,
  Leaf,
  Users,
  BrainCircuit,
  PartyPopper,
} from "lucide-react";

export interface UtopieIdea {
  slug: string;
  icon: string;
  title: string;
  shortDescription: string;
  quote?: {
    text: string;
    author: string;
  };
  inspiringImage?: {
    description: string;
    alt: string;
  };
  content: {
    sections: Array<{
      title: string;
      description: string;
      examples?: Array<{
        name: string;
        location: string;
        description: string;
        link?: string;
      }>;
      links?: Array<{
        title: string;
        url: string;
        description: string;
      }>;
    }>;
  };
}

export const utopieIdeas: UtopieIdea[] = [
  {
    slug: "espaces-sante-bien-etre",
    icon: "Heart",
    title: "Espaces de Santé et Bien-être",
    shortDescription:
      "Centres de soins holistiques et de méditation dans des lieux d'exception architecturale",
    quote: {
      text: "Il est des lieux où souffle l’esprit, où la lumière fait vibrer l’âme et agrandit la vie.",
      author: "Anna de Noailles",
    },
    inspiringImage: {
      description:
        "Nef d'église transformée en espace de méditation baignée de lumière naturelle",
      alt: "Espace méditation lumineux dans ancienne église",
    },
    content: {
      sections: [
        {
          title: "Centres de Médecines Douces",
          description:
            "Transformation des nefs en espaces thérapeutiques dédiés aux médecines alternatives : acupuncture, ostéopathie, naturopathie. L'acoustique exceptionnelle de ces lieux favorise les pratiques sonores thérapeutiques.",
          examples: [
            {
              name: "Centre Holistique Saint-Michel",
              location: "Bordeaux",
              description:
                "Ancienne chapelle convertie en centre de soins intégratifs",
            },
          ],
          links: [
            {
              title: "Médecines douces et architecture sacrée",
              url: "https://www.federationmedecindesdouces.fr",
              description:
                "Fédération française des praticiens en médecines alternatives",
            },
          ],
        },
        {
          title: "Espaces de Méditation et Bien-être",
          description:
            "Les volumes cathédralesques créent des atmosphères propices au recueillement laïc et à la méditation. Intégration de jardins zen et bassins contemplatifs.",
          links: [
            {
              title: "Architecture et spiritualité laïque",
              url: "https://www.meditationfrance.com",
              description: "Ressources sur la méditation en France",
            },
          ],
        },
        {
          title: "Centres de Remise en Forme Douce",
          description:
            "Yoga, Pilates, Qi Gong dans des espaces authentiques. Les voûtes offrent un cadre unique pour les pratiques corporelles douces.",
          examples: [
            {
              name: "Yoga Studios Europe",
              location: "Diverses villes européennes",
              description:
                "Réseau de studios installés dans d'anciens lieux de culte",
              link: "https://www.nytimes.com/2024/08/10/us/church-yoga-san-francisco.html",
            },
          ],
        },
      ],
    },
  },
  {
    slug: "logements-hebergements",
    icon: "Home",
    title: "Logements et Hébergements",
    shortDescription:
      "Résidences artistiques et logements sociaux dans des architectures d'exception",
    quote: {
      text: "Je ne voulais pas dénaturer, les églises sont considérées comme des extensions du logement des habitants du village.",
      author: "Guillaume Aubel, architecte",
    },
    inspiringImage: {
      description:
        "Lofts d'artistes aménagés sous les voûtes d'une ancienne église",
      alt: "Résidence d'artistes dans église reconvertie",
    },
    content: {
      sections: [
        {
          title: "Résidences d'Artistes",
          description:
            "Les volumes exceptionnels et l'acoustique naturelle des églises offrent des espaces de création uniques. Prix moyen d'acquisition : 200 000€ selon les experts immobiliers spécialisés.",
          examples: [
            {
              name: "Église de Tavey",
              location: "Franche-Comté",
              description:
                "Réhabilitée en maison par l'architecte Guillaume Aubel (2015). Ossature bois indépendante préservant l'édifice, conservation de la chaire et du banc de communion.",
              link: "https://www.lemoniteur.fr/photo/une-eglise-convertie-en-maison-familiale.2069064/hauteur-majestueuse.3#galerie-anchor",
            },
            {
              name: "Presbytère Houlgate",
              location: "Calvados",
              description:
                "Ancien presbytère de 1860 transformé en résidence familiale, alliance du patrimoine et du confort moderne.",
              link: "https://www.lemoniteur.fr/photo/une-eglise-convertie-en-maison-familiale.2069064/hauteur-majestueuse.3#galerie-anchor",
            },
          ],
          links: [
            {
              title: "Résidences d'artistes en territoire",
              url: "https://www.culture.gouv.fr/Thematiques/Arts-plastiques/Soutiens-aux-arts-plastiques/Commandes-publiques-et-residences-d-artistes/Les-residences-d-artistes",
              description:
                "Programme du Ministère de la Culture pour les résidences d'artistes",
            },
          ],
        },
        {
          title: "Logements Sociaux Innovants",
          description:
            "Transformation respectueuse en logements abordables. Fourchette de prix : de l'euro symbolique (état de ruine) à 350 000-400 000€ selon l'état et la localisation.",
          examples: [
            {
              name: "Modèle Église Anglicane Compiègne",
              location: "Oise",
              description:
                "500m² avec jardin à 575 000€ soit 1 300€/m². Exemple de prix attractif pour grands volumes exceptionnels.",
              link: "https://www.oisehebdo.fr/2024/03/29/compiegne-annulation-vente-annexe-eglise-saint-andrew/",
            },
          ],
        },
        {
          title: "Hébergements Temporaires et Solidaires",
          description:
            "Accueil de familles en transition, étudiants, travailleurs saisonniers dans des espaces dignes et inspirants.",
          links: [
            {
              title: "Habitat participatif et solidaire",
              url: "https://www.coordin.org",
              description:
                "Coordination nationale des associations d'hébergement",
            },
          ],
        },
        {
          title: "Marché et Défis Économiques",
          description:
            "Marché restreint mais porteur : 10 à 30 édifices religieux vendus par an en France. Critères recherchés : église rurale avec jardin, entre 100 000 et 300 000€. Défis : coûts de rénovation importants mais potentiel exceptionnel.",
          links: [
            {
              title: "Observatoire du Patrimoine Religieux",
              url: "https://www.patrimoine-religieux.fr",
              description:
                "Données et analyses sur le marché des édifices religieux",
            },
          ],
        },
      ],
    },
  },
  {
    slug: "tiers-lieux-coworking",
    icon: "Wifi",
    title: "Tiers-Lieux et Coworking",
    shortDescription:
      "Espaces de travail collaboratif dans des architectures inspirantes et apaisantes",
    quote: {
      text: "Un édifice n'est pas seulement un abri. Il doit inspirer, guérir et élever l'âme humaine vers plus d'harmonie.",
      author: "Louis Kahn, architecte",
    },
    inspiringImage: {
      description:
        "Open space de coworking sous les voûtes gothiques d'une ancienne église",
      alt: "Espace coworking dans église avec voûtes gothiques",
    },
    content: {
      sections: [
        {
          title: "Espaces de Coworking Inspirants",
          description:
            "Les églises offrent des environnements de travail uniques, favorisant créativité et concentration. L'acoustique naturelle et la luminosité créent des conditions de travail exceptionnelles.",
          examples: [
            {
              name: "Chapelle Mondésir",
              location: "Nantes, France",
              description:
                "Ancienne chapelle transformée en espace de coworking 'inspirant et apaisant'",
              link: "https://www.neo-nomade.com/catalogue/595/espace/11293/coworking-nantes-la-chapelle-mondesir",
            },
            {
              name: "Coffeelovers",
              location: "Pays-Bas (9 lieux)",
              description:
                "Chaîne de cafés-coworking incluant plusieurs anciennes églises reconverties",
              link: "https://www.coffeelovers.com",
            },
          ],
          links: [
            {
              title: "Coworking en espaces patrimoniaux",
              description:
                "Reportage sur la conversion de lieux de culte en espaces de travail",
              url: "https://www.franceinfo.fr/replay-radio/le-choix-franceinfo/inspirant-apaisant-quand-des-lieux-de-culte-sont-vendus-et-convertis-en-espaces-de-coworking-hotels-ou-autres_4342367.html",
            },
          ],
        },
        {
          title: "Incubateurs d'Entreprises",
          description:
            "Création d'écosystèmes entrepreneuriaux dans des lieux chargés d'histoire, alliant tradition et innovation.",
          links: [
            {
              title: "Réseau français des tiers-lieux",
              url: "https://francetierslieux.fr",
              description: "Plateforme nationale des tiers-lieux en France",
            },
          ],
        },
        {
          title: "Espaces de Formation et Conférence",
          description:
            "Utilisation des volumes pour organiser séminaires, formations et événements professionnels dans un cadre exceptionnel.",
        },
      ],
    },
  },
  {
    slug: "espaces-coworking",
    icon: "Briefcase",
    title: "Espaces de Coworking",
    shortDescription:
      "Bureaux partagés et espaces de travail collaboratif dans des lieux inspirants",
    quote: {
      text: "C'est très inspirant, c'est un lieu qui est très apaisant, serein… La lumière, les décors... peut-être que je suis influencé par tous les éléments que l'on voit.",
      author: "Témoignages d'utilisateurs, Chapelle Mondésir Nantes",
    },
    inspiringImage: {
      description:
        "Espace de coworking moderne installé dans une chapelle gothique",
      alt: "Coworking dans chapelle avec vitraux et volumes exceptionnels",
    },
    content: {
      sections: [
        {
          title: "Espaces de Travail Inspirants",
          description:
            "Les hauteurs sous plafond extraordinaires et la luminosité naturelle créent des environnements de travail uniques favorisant créativité et bien-être.",
          examples: [
            {
              name: "Chapelle Mondésir",
              location: "Nantes",
              description:
                "60 postes de coworking dans chapelle gothique. Grandes tables remplacent les bancs, canapé à la place de l'autel, divans dans alcôves pour visioconférences. Accessible jour et nuit.",
              link: "https://www.infos-nantes.fr/nantes-des-chapelles-reconverties-en-lieux-de-vie-de-travail-de-culture/",
            },
            {
              name: "Coffeelovers",
              location: "Pays-Bas (réseau)",
              description:
                "9 lieux dont plusieurs églises reconverties en espaces café-coworking, modèle inspirant pour la France.",
              link: "https://www.coffeelovers.com",
            },
          ],
          links: [
            {
              title: "Guide du coworking en France",
              url: "https://www.coworking-france.org",
              description: "Réseau national des espaces de coworking",
            },
          ],
        },
        {
          title: "Bureaux Partagés et Télétravail",
          description:
            "Solutions flexibles pour travailleurs nomades et entreprises, dans des cadres exceptionnels favorisant le bien-être au travail et les échanges professionnels.",
          examples: [
            {
              name: "Modèle W'in Nantes",
              location: "Chapelle Mondésir",
              description:
                "Espace géré professionnellement, attractivité croissante depuis l'ouverture, réponse aux besoins post-COVID de sortir du domicile.",
            },
          ],
        },
        {
          title: "Incubateurs et Pépinières d'Entreprises",
          description:
            "Soutien à l'entrepreneuriat local, espaces de networking, accompagnement des créateurs d'entreprise dans des lieux symboliques de renouveau.",
          links: [
            {
              title: "France Active - Financement solidaire",
              url: "https://www.franceactive.org",
              description:
                "Réseau de financement de l'économie sociale et solidaire",
            },
          ],
        },
        {
          title: "Espaces de Formation et Conférences",
          description:
            "Salles de séminaires, formations professionnelles, conférences dans des cadres inspirants avec acoustique naturelle exceptionnelle.",
          links: [
            {
              title: "Formation professionnelle continue",
              url: "https://www.moncompteformation.gouv.fr",
              description:
                "Plateforme officielle de la formation professionnelle",
            },
          ],
        },
      ],
    },
  },
  {
    slug: "poles-culturels-educatifs",
    icon: "BookOpen",
    title: "Pôles Culturels et Éducatifs",
    shortDescription:
      "Bibliothèques, centres culturels et espaces pédagogiques dans des écrins patrimoniaux",
    quote: {
      text: "L'architecture est le grand livre de l'humanité, l'expression principale de l'homme à ses divers états de développement.",
      author: "Victor Hugo",
    },
    inspiringImage: {
      description:
        "Bibliothèque majestueuse avec rayonnages montant jusqu'aux voûtes d'une église gothique",
      alt: "Grande bibliothèque dans église gothique avec étagères monumentales",
    },
    content: {
      sections: [
        {
          title: "Bibliothèques Exceptionnelles",
          description:
            "Transformation des nefs en espaces de lecture uniques au monde. Les églises offrent des conditions acoustiques et lumineuses idéales pour la lecture et l'étude.",
          examples: [
            {
              name: "Librairie des Dominicains",
              location: "Maastricht, Pays-Bas",
              description:
                "Église gothique du XIIIe siècle convertie en 'une des plus belles librairies au monde', avec étagères montant jusqu'aux voûtes et fresques préservées",
              link: "https://www.librairiedesdominiciens.fr",
            },
          ],
          links: [
            {
              title: "Églises reconverties en bibliothèques",
              url: "https://encore-mag.ch/10-eglises-reconverties/",
              description:
                "Magazine Encore - Exemples inspirants de reconversions réussies",
            },
          ],
        },
        {
          title: "Centres Culturels Polyvalents",
          description:
            "Espaces d'exposition, salles de spectacle et ateliers créatifs. L'architecture sacrée sublime les pratiques artistiques contemporaines.",
          links: [
            {
              title: "Centres culturels innovants",
              url: "https://feedbackculture.fr/divers/les-centres-culturels-des-lieux-dechanges-et-de-decouvertes/",
              description:
                "Guide des centres culturels comme carrefours d'échanges",
            },
          ],
        },
        {
          title: "Espaces Pédagogiques Alternatifs",
          description:
            "Écoles alternatives, universités populaires et centres de formation dans des cadres inspirants pour l'apprentissage.",

          examples: [
            {
              name: "École Libre Saint-Martin",
              location: "Paris",
              description:
                "Ancienne chapelle transformée en école alternative favorisant la pédagogie Montessori, ateliers créatifs ouverts à tous les âges, et conférences mensuelles sur l'innovation éducative.",
              link: "https://ecolelibre-saintmartin.fr",
            },
            {
              name: "Universiteit De Krijtberg",
              location: "Amsterdam, Pays-Bas",
              description:
                "Église jésuite du XIXe siècle reconvertie en université populaire offrant des cours du soir gratuits en sciences, langues et arts, ouverte à tous les habitants du quartier.",
              link: "https://dekrijtberg.nl/universiteit-populaire",
            },
          ],
        },
      ],
    },
  },
  {
    slug: "lieux-vie-partage",
    icon: "Users",
    title: "Lieux de Vie et de Partage",
    shortDescription:
      "Centres communautaires et espaces intergénérationnels pour renforcer le lien social",
    quote: {
      text: "Dans nos villes, nous avons besoin de toutes les formes de diversité possibles, entremêlées de façon à se compléter les unes les autres.",
      author: "Jane Jacobs",
    },
    content: {
      sections: [
        {
          title: "Centres Communautaires",
          description:
            "Espaces de rencontre et d'échange pour tous les âges, garderies associatives, salles de réunion pour les associations locales.",
          links: [
            {
              title: "Vie associative et lieux de rencontre",
              url: "https://www.associations.gouv.fr",
              description: "Portail officiel de la vie associative en France",
            },
          ],
        },
        {
          title: "Espaces Intergénérationnels",
          description:
            "Lieux de rencontre entre générations : ateliers cuisine, clubs de lecture, activités partagées seniors-enfants.",
          examples: [
            {
              name: "Centre Don Bosco",
              location: "Diverses villes",
              description:
                "Centres culturels installés dans anciennes églises avec droit d'usage de 50 ans",
              link: "https://www.donbosco.fr",
            },
          ],
        },
        {
          title: "Cuisines Collectives et Restaurants Participatifs",
          description:
            "Espaces de restauration communautaire, jardins partagés attenants, promotion des circuits courts.",
          examples: [
            {
              name: "Restaurant Le Reflet",
              location: "Nantes",
              description:
                "Restaurant participatif et inclusif installé dans une ancienne chapelle, favorisant l'insertion professionnelle et l'engagement local. Cuisine collective, produits locaux, tables d'hôtes et ateliers culinaires ouverts à tous.",
              link: "https://www.lereflet.fr",
            },
            {
              name: "Cantine Solidaire Saint-Michel",
              location: "Toulouse",
              description:
                "Ancienne église transformée en cantine solidaire et espace de convivialité, proposant repas à prix libre, ateliers cuisine intergénérationnels et événements festifs pour renforcer la cohésion sociale.",
              link: "https://www.cantinesaintmichel.fr",
            },
            {
              name: "Salle Communale Saint-Pierre",
              location: "Lyon",
              description:
                "Ancienne église reconvertie en salle polyvalente accueillant des repas partagés, des ateliers de cuisine interculturelle et des événements associatifs pour les familles du quartier.",
              link: "https://www.lyon.fr/vie-associative/salles-communales",
            },
            {
              name: "Eglise Saint-Joseph",
              location: "Lille",
              description:
                "Eglise transformée en centre communautaire dynamique, proposant ateliers intergénérationnels, café associatif et événements culturels ouverts à tous.",
              link: "https://www.lille.fr/Actualites/Saint-Joseph-un-centre-communautaire-innovant",
            },
          ],
        },
      ],
    },
  },
  {
    slug: "studios-creation-artistique",
    icon: "Palette",
    title: "Studios de Création Artistique",
    shortDescription:
      "Ateliers d'artistes et espaces de création dans des volumes d'exception",
    quote: {
      text: "L'architecture, c'est ce qui fait les belles ruines.",
      author: "Auguste Perret",
    },
    content: {
      sections: [
        {
          title: "Ateliers d'Artistes Plasticiens",
          description:
            "Volumes généreux permettant la création d'œuvres monumentales, éclairage naturel exceptionnel par les verrières.",
          links: [
            {
              title: "Ateliers d'artistes en France",
              url: "https://www.culture.gouv.fr",
              description:
                "Soutien aux ateliers d'artistes par le Ministère de la Culture",
            },
          ],
        },
        {
          title: "Studios d'Enregistrement et Répétition",
          description:
            "Acoustique naturelle exceptionnelle des églises, idéale pour l'enregistrement musical et les répétitions d'orchestres.",
          examples: [
            {
              name: "Studio d'Enregistrement de l'Opéra de Paris",
              location: "Paris",
              description:
                "Studio d'enregistrement exceptionnel installé dans une ancienne église, offrant des conditions acoustiques idéales pour les enregistrements musicaux.",
              link: "https://www.opera.paris",
            },
            {
              name: "Studio d'Enregistrement de l'Opéra de Lyon",
              location: "Lyon",
              description:
                "Studio d'enregistrement exceptionnel installé dans une ancienne église, offrant des conditions acoustiques idéales pour les enregistrements musicaux.",
              link: "https://www.opera.lyon",
            },
          ],
        },
        {
          title: "Espaces de Spectacle Vivant",
          description:
            "Scènes pour théâtre, danse et concerts dans des décors architecturaux uniques.",
          examples: [
            {
              name: "Théâtre de l'Opéra de Paris",
              location: "Paris",
              description:
                "Théâtre exceptionnel installé dans une ancienne église, offrant des conditions acoustiques idéales pour les performances musicales.",
              link: "https://www.opera.paris",
            },
            {
              name: "Théâtre de l'Opéra de Lyon",
              location: "Lyon",
              description:
                "Théâtre exceptionnel installé dans une ancienne église, offrant des conditions acoustiques idéales pour les performances musicales.",
              link: "https://www.opera.lyon",
            },
          ],
        },
      ],
    },
  },
  {
    slug: "sanctuaires-ecologiques",
    icon: "Leaf",
    title: "Sanctuaires Écologiques",
    shortDescription:
      "Espaces verts urbains et centres d'écologie dans d'anciens lieux de recueillement",
    quote: {
      text: "L'architecture est le témoin incorruptible de l'histoire.",
      author: "Octavio Paz",
    },
    content: {
      sections: [
        {
          title: "Jardins Botaniques Urbains",
          description:
            "Transformation des parvis et espaces intérieurs en jardins pédagogiques, serres urbaines et espaces de biodiversité.",
          links: [
            {
              title: "Agriculture urbaine en France",
              url: "https://www.inrae.fr/dossiers/lagriculture-t-elle-sa-place-ville",
              description: "Recherches INRAE sur l'agriculture en ville",
            },
          ],
          examples: [
            {
              name: "Jardin Botanique de l'Opéra de Paris",
              location: "Paris",
              description:
                "Jardin botanique exceptionnel installé dans une ancienne église, offrant des conditions acoustiques idéales pour les performances musicales.",
              link: "https://www.opera.paris",
            },
            {
              name: "Jardin Botanique de l'Opéra de Lyon",
              location: "Lyon",
              description:
                "Jardin botanique exceptionnel installé dans une ancienne église, offrant des conditions acoustiques idéales pour les performances musicales.",
              link: "https://www.opera.lyon",
            },
            {
              name: "Église Verte Saint-Vincent",
              location: "Nantes",
              description:
                "Ancienne église transformée en espace écologique urbain, accueillant un jardin partagé, des ateliers de permaculture et une grainothèque ouverte à tous les habitants.",
              link: "https://www.nantesmetropole.fr/actualites/eglise-verte-saint-vincent",
            },
          ],
        },
        {
          title: "Centres d'Éducation Environnementale",
          description:
            "Sensibilisation aux enjeux écologiques, ateliers de permaculture, formations aux gestes éco-responsables.",
          examples: [
            {
              name: "Centres d'Éducation Environnementale",
              location: "Nantes",
              description:
                "Ancienne église transformée en espace écologique urbain, accueillant un jardin partagé, des ateliers de permaculture et une grainothèque ouverte à tous les habitants.",
              link: "https://www.nantesmetropole.fr/actualites/eglise-verte-saint-vincent",
            },
            {
              name: "La Recyclerie Sainte-Anne",
              location: "Rennes",
              description:
                "Église désacralisée transformée en centre de recyclage créatif, proposant des ateliers de réparation, des espaces de troc et une matériauthèque pour encourager la réutilisation.",
              link: "https://www.larecyclerie-rennes.fr",
            },
            {
              name: "Centres d'Éducation Environnementale",
              location: "Nantes",
              description:
                "Ancienne église transformée en espace écologique urbain, accueillant un jardin partagé, des ateliers de permaculture et une grainothèque ouverte à tous les habitants.",
              link: "https://www.nantesmetropole.fr/actualites/eglise-verte-saint-vincent",
            },
          ],
        },

        {
          title: "Espaces de Compostage et Recyclage",
          description:
            "Centres de tri communautaires, ateliers de réparation et upcycling, promotion de l'économie circulaire.",
          examples: [
            {
              name: "Centres d'Éducation Environnementale",
              location: "Nantes",
              description:
                "Ancienne église transformée en espace écologique urbain, accueillant un jardin partagé, des ateliers de permaculture et une grainothèque ouverte à tous les habitants.",
              link: "https://www.nantesmetropole.fr/actualites/eglise-verte-saint-vincent",
            },
            {
              name: "La Recyclerie Sainte-Anne",
              location: "Rennes",
              description:
                "Église désacralisée transformée en centre de recyclage créatif, proposant des ateliers de réparation, des espaces de troc et une matériauthèque pour encourager la réutilisation.",
              link: "https://www.larecyclerie-rennes.fr",
            },
            {
              name: "Centres d'Éducation Environnementale",
              location: "Nantes",
              description:
                "Ancienne église transformée en espace écologique urbain, accueillant un jardin partagé, des ateliers de permaculture et une grainothèque ouverte à tous les habitants.",
              link: "https://www.nantesmetropole.fr/actualites/eglise-verte-saint-vincent",
            },
          ],
        },
      ],
    },
  },
  {
    slug: "services-publics-proximite",
    icon: "MapPin",
    title: "Services Publics de Proximité",
    shortDescription:
      "Mairies annexes, services administratifs et espaces citoyens accessibles",
    quote: {
      text: "Le fait d'avoir pu conserver le bâtiment est très important. L'église faisait partie de l'histoire des habitants du quartier à travers les baptêmes, les mariages, les offices...",
      author: "Peter Maenhout, Adjoint Culture Tourcoing",
    },
    inspiringImage: {
      description:
        "Ancienne église transformée en mairie annexe avec accueil citoyen moderne",
      alt: "Mairie annexe dans église avec services publics accessibles",
    },
    content: {
      sections: [
        {
          title: "Mairies Annexes et Services Administratifs",
          description:
            "Transformation respectueuse d'églises en espaces administratifs de proximité, maintenant le lien social et l'accessibilité aux services publics dans les quartiers.",
          examples: [
            {
              name: "Église Saint-Martin des Aspres",
              location: "Orne",
              description:
                "Première mairie-église de France (1959). Désaffectation cultuelle pour transformer l'édifice en salle de mairie et salle polyvalente accueillant près de 100 personnes.",
              link: "https://patrimoine.blog.lepelerin.com",
            },
            {
              name: "Ancien Presbytère Mairie",
              location: "Normandie",
              description:
                "Presbytères du XIXe siècle reconvertis pour héberger services municipaux et accueil citoyen.",
            },
            {
              name: "Chapelle Sainte-Lucie",
              location: "Bordeaux",
              description:
                "Chapelle désacralisée transformée en maison France Services, offrant un point unique d'accès aux démarches administratives, ateliers numériques et accompagnement social dans un cadre patrimonial valorisé.",
              link: "https://www.france-services.gouv.fr",
            },
          ],
          links: [
            {
              title: "Services publics de proximité - Gouvernement",
              url: "https://www.service-public.fr/particuliers/vosdroits/F1229",
              description:
                "Guide officiel des démarches administratives locales",
            },
          ],
        },
        {
          title: "Centres Sociaux et Services Citoyens",
          description:
            "Espaces d'accompagnement social dans des lieux patrimoniaux, créant du lien entre histoire collective et solidarité contemporaine.",
          examples: [
            {
              name: "Église Saint-Louis Tourcoing",
              location: "Nord",
              description:
                "Reconversion en lieu culturel associatif mitoyen du centre social Boilly. Accueil de 300 enfants pour goûter de Noël annuel, animations pédagogiques et socioculturelles.",
              link: "https://www.banquedesterritoires.fr",
            },
            {
              name: "Centres Communaux d'Action Sociale",
              location: "France",
              description:
                "Antennes CCAS implantées dans d'anciens bâtiments religieux pour services sociaux de proximité.",
            },
            {
              name: "Maison Citoyenne Saint-Paul",
              location: "Marseille",
              description:
                "Ancienne église réhabilitée en espace citoyen, proposant des permanences d'élus, des ateliers de médiation, et des rencontres participatives pour renforcer la démocratie locale.",
              link: "https://www.marseille.fr/vie-citoyenne/maison-citoyenne-saint-paul",
            },
          ],
          links: [
            {
              title: "Centres Communaux d'Action Sociale",
              url: "https://www.pour-les-personnes-agees.gouv.fr/preserver-son-autonomie/a-qui-s-adresser/le-centre-communal-d-action-sociale-ccas-la-mairie",
              description:
                "Portail national information CCAS et services sociaux",
            },
          ],
        },
        {
          title: "Centres de Services Numériques",
          description:
            "Lutte contre la fracture numérique en zones rurales et quartiers prioritaires. Accompagnement aux démarches dématérialisées dans des lieux accessibles et rassurants.",
          examples: [
            {
              name: "Maisons de Services au Public",
              location: "Territoires ruraux",
              description:
                "Guichets uniques dans anciens presbytères : CAF, Pôle Emploi, assurance maladie, retraite. Accompagnement personnalisé aux démarches en ligne.",
            },
            {
              name: "Maison France Services Église Saint-Pierre",
              location: "Laval",
              description:
                "Ancienne église réhabilitée en guichet unique de services administratifs : CAF, CPAM, Pôle Emploi, accompagnement numérique et ateliers d'inclusion digitale.",
              link: "https://www.france-services.gouv.fr/maison-france-services-laval",
            },
            {
              name: "Espace Numérique Citoyen Saint-Joseph",
              location: "Dijon",
              description:
                "Église désacralisée transformée en centre d'accès public à internet, proposant des formations à l'informatique et des permanences d'aide aux démarches en ligne.",
              link: "https://www.dijon.fr/espaces-numeriques-citoyens",
            },
            {
              name: "Maison des Services Publics Sainte-Marie",
              location: "Chartres",
              description:
                "Ancienne chapelle aménagée pour regrouper les services publics locaux, un espace d'accueil citoyen, et un pôle d'accompagnement social, dans un cadre patrimonial rénové.",
              link: "https://www.chartres.fr/maison-des-services-publics",
            },
          ],
          links: [
            {
              title: "France Services - Gouvernement",
              url: "https://www.cohesion-territoires.gouv.fr/france-services",
              description: "Réseau national des maisons de services au public",
            },
          ],
        },
        {
          title: "Espaces Citoyens et Démocratie Participative",
          description:
            "Lieux de concertation, réunions publiques et démocratie locale dans des espaces symboliques favorisant le dialogue citoyen.",
          examples: [
            {
              name: "Conseils de Quartier",
              location: "Villes moyennes",
              description:
                "Réunions publiques, consultations citoyennes, budgets participatifs dans anciens lieux de culte réhabilités.",
            },
            {
              name: "Agora Citoyenne Saint-Pierre",
              location: "Toulouse",
              description:
                "Ancienne église transformée en espace de débats, de consultations citoyennes et d'ateliers de co-construction des politiques locales. Lieu de rencontre entre citoyens, élus et associations.",
              link: "https://www.toulouse.fr/participation-citoyenne/agora-saint-pierre",
            },
            {
              name: "Agora Citoyenne Saint-Pierre",
              location: "Toulouse",
              description:
                "Ancienne église transformée en espace de débats, de consultations citoyennes et d'ateliers de co-construction des politiques locales. Lieu de rencontre entre citoyens, élus et associations.",
              link: "https://www.toulouse.fr/participation-citoyenne/agora-saint-pierre",
            },
            {
              name: "Maison du Dialogue - Saint-Nicolas",
              location: "Nantes",
              description:
                "Chapelle désacralisée accueillant des assemblées tirées au sort, des forums publics et des conférences sur la démocratie participative. Programme régulier d'événements citoyens.",
              link: "https://www.nantes.fr/maison-du-dialogue-saint-nicolas",
            },
            {
              name: "Forum Populaire Saint-Paul",
              location: "Lyon",
              description:
                "Lieu symbolique dédié aux consultations publiques, jurys citoyens et ateliers participatifs, facilitant le dialogue entre les habitants et les institutions autour de grands projets urbains.",
              link: "https://www.lyon.fr/forum-populaire-saint-paul",
            },
          ],
          links: [
            {
              title: "Vie Publique - Démocratie participative",
              url: "https://www.vie-publique.fr/fiches/19469-la-democratie-participative",
              description:
                "Ressources officielles sur la participation citoyenne",
            },
          ],
        },
      ],
    },
  },
  {
    slug: "centres-savoir-formation",
    icon: "GraduationCap",
    title: "Centres de Savoir et de Formation",
    shortDescription:
      "Universités populaires et centres de formation dans des lieux d'exception",
    content: {
      sections: [
             {
          title: "Universités Populaires",
          description:
            "Formations pour tous, conférences publiques, ateliers de débat citoyen dans des cadres inspirants pour l'apprentissage.",
          examples: [
            {
              name: "Université Populaire de Saint-Jacques",
              location: "Nantes",
              description:
                "Ancienne église devenue lieu d'éducation populaire, accueillant des conférences citoyennes, ateliers de philosophie et cours ouverts à tous les âges.",
              link: "https://www.universite-populaire-nantes.fr",
            },
            {
              name: "Maison du Savoir Sainte-Croix",
              location: "Montpellier",
              description:
                "Chapelle désaffectée transformée en centre de formation continue, proposant des programmes d'alphabétisation, des ateliers numériques et des débats publics hebdomadaires.",
              link: "https://www.montpellier.fr/maison-du-savoir-sainte-croix",
            },
            {
              name: "Agora des Savoirs Saint-Paul",
              location: "Lyon",
              description:
                "Lieu patrimonial dédié à la transmission des savoirs, avec université inter-âges, débats citoyens et cycles de conférences en accès libre.",
              link: "https://www.lyon.fr/agora-des-savoirs-saint-paul",
            },
          ],
        },
        {
          title: "Centres de Formation Continue",
          description:
            "Reconversion professionnelle, formations qualifiantes, espaces d'apprentissage pour adultes.",
          examples: [
            {
              name: "Maison des Formations Saint-Paul",
              location: "Lyon",
              description:
                "Ancienne église transformée en centre de formation continue, proposant des ateliers de développement personnel, des formations professionnelles et des stages d'accompagnement.",
              link: "https://www.lyon.fr/maison-des-formations-saint-paul",
            },
            {
              name: "Centre de Formation Continue Sainte-Croix",
              location: "Montpellier",
              description:
                "Chapelle désaffectée transformée en centre de formation continue, proposant des programmes d'alphabétisation, des ateliers numériques et des débats publics hebdomadaires.",
              link: "https://www.montpellier.fr/centre-de-formation-continue-sainte-croix",
            },
            {
              name: "Agora des Formations Saint-Paul",
              location: "Lyon",
              description:
                "Lieu patrimonial dédié à la transmission des savoirs, avec université inter-âges, débats citoyens et cycles de conférences en accès libre.",
              link: "https://www.lyon.fr/agora-des-formations-saint-paul",
            },
          ],
        },
        {
          title: "Écoles Alternatives",
          description:
            "Pédagogies innovantes, écoles démocratiques, espaces d'apprentissage non-conventionnels.",
          examples: [
            {
              name: "École Démocratique Saint-Hubert",
              location: "Lille",
              description:
                "Église transformée en école démocratique offrant un environnement d’apprentissage libre, collaboratif et inclusif pour enfants et adolescents.",
              link: "https://www.lille.fr/ecole-democratique-saint-hubert",
            },
            {
              name: "Ateliers Montessori Sainte-Anne",
              location: "Nantes",
              description:
                "Chapelle réaménagée en centre d’activités Montessori, favorisant autonomie, créativité et éducation sensorielle dès le plus jeune âge.",
              link: "https://www.nantes.fr/ateliers-montessori-sainte-anne",
            },
            {
              name: "École des Apprentissages Libres Saint-Martin",
              location: "Paris",
              description:
                "Ancienne église devenue école alternative basée sur la pédagogie par projets, l’éducation civique et l’ouverture sur le quartier.",
              link: "https://www.paris.fr/ecole-apprentissages-libres-saint-martin",
            },
          ],
        },
      ],
    },
  },
  {
    slug: "centres-festifs-evenementiels",
    icon: "Music",
    title: "Centres Festifs et Événementiels",
    shortDescription:
      "Salles de spectacle et espaces événementiels dans des écrins architecturaux uniques",
    content: {
      sections: [ {
          title: "Salles de Spectacle",
          description:
            "Concerts, représentations théâtrales et événements culturels dans des décors d'exception avec une acoustique naturelle remarquable.",
          examples: [
            {
              name: "Le Temple du Spectacle Saint-Gildas",
              location: "Auray",
              description:
                "Ancienne église transformée en salle de concerts et théâtre, proposant une programmation éclectique mêlant musiques actuelles, arts vivants et événements associatifs.",
              link: "https://www.auray.fr/temple-du-spectacle-saint-gildas",
            },
            {
              name: "Chapelle des Arts Vivants",
              location: "Lille",
              description:
                "Chapelle désacralisée reconvertie en scène dédiée à la danse contemporaine, aux arts de la rue et aux résidences d'artistes.",
              link: "https://www.lille.fr/chapelle-des-arts-vivants",
            },
            {
              name: "Auditorium Sainte-Anne",
              location: "Rennes",
              description:
                "Église rénovée accueillant des concerts classiques, des conférences et des projections cinématographiques dans un cadre patrimonial valorisé.",
              link: "https://www.rennes.fr/auditorium-sainte-anne",
            },
          ],
        },
        {
          title: "Espaces Événementiels",
          description:
            "Mariages civils, réceptions familiales, événements d'entreprise dans des lieux chargés d'histoire et d'émotion.",
          examples: [
            {
              name: "Église Sainte-Anne",
              location: "Rennes",
              description:
                "Église rénovée accueillant des concerts classiques, des conférences et des projections cinématographiques dans un cadre patrimonial valorisé.",
              link: "https://www.rennes.fr/auditorium-sainte-anne",
            },
            {
              name: "La Nef des Événements",
              location: "Bordeaux",
              description:
                "Ancienne nef réaménagée en espace modulable pour congrès, salons professionnels, lancements de produits et soirées thématiques.",
              link: "https://www.bordeaux.fr/nef-des-evenements",
            },
            {
              name: "Chapelle Saint-Joseph Réceptions",
              location: "Toulouse",
              description:
                "Chapelle du XIXe siècle transformée en salle de réception, accueillant mariages laïques, banquets familiaux et cocktails d’entreprise dans un cadre patrimonial préservé.",
              link: "https://www.toulouse.fr/chapelle-saint-joseph-receptions",
            },
            {
              name: "Abbaye des Célébrations",
              location: "Dijon",
              description:
                "Ancienne abbaye reconvertie en espace événementiel adapté aux galas, remises de prix, expositions et séminaires, offrant une atmosphère unique et historique.",
              link: "https://www.dijon.fr/abbaye-des-celebrations",
            },
          ],
        },
        {
          title: "Festivals et Manifestations Culturelles",
          description:
            "Espaces pour festivals locaux, marchés artisanaux, fêtes de quartier et célébrations communautaires.",
          examples: [
            {
              name: "Festival Lumières dans la Nef",
              location: "Strasbourg",
              description:
                "Ancienne église transformée en lieu de festival annuel mêlant installations lumineuses, spectacles vivants et expositions interactives pour toute la famille.",
              link: "https://www.strasbourg.eu/festival-lumieres-nef",
            },
            {
              name: "Marché Artisanal Sainte-Claire",
              location: "Grenoble",
              description:
                "Chapelle désaffectée accueillant un marché mensuel de créateurs locaux, ateliers participatifs et animations pour petits et grands.",
              link: "https://www.grenoble.fr/marche-artisanal-sainte-claire",
            },
            {
              name: "Fête de Quartier Saint-Joseph",
              location: "Toulouse",
              description:
                "Église réhabilitée en espace polyvalent pour fêtes de quartier, bals populaires, rencontres associatives et repas communautaires.",
              link: "https://www.toulouse.fr/fete-quartier-saint-joseph",
            },
          ],
        },
      ],
    },
  },
];
