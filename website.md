# PRD - Site Web de Pétition Numérique : Régulation des Sonneries de Cloches à Auray

## 1. Vue d'ensemble du projet

### 1.1 Objectif
Créer une plateforme web moderne permettant de recueillir des signatures numériques pour la pétition concernant la régulation des sonneries de cloches à Auray, complémentant ainsi la démarche papier traditionnelle.

### 1.2 Contexte
- **Problématique** : Nuisances sonores excessives depuis la réparation des cloches d'Auray
- **Base légale** : Article 27 de la loi de 1905 et décret du 16 mars 1906 donnant pouvoir au maire de réglementer les sonneries
- **Public cible** : Résidents d'Auray et sympathisants souhaitant soutenir la cause

### 1.3 Valeur ajoutée
- **Accessibilité** : Signature 24h/24, 7j/7 depuis n'importe quel appareil
- **Portée élargie** : Toucher les habitants ne pouvant signer physiquement
- **Traçabilité** : Suivi en temps réel du nombre de signatures
- **Crédibilité** : Présentation professionnelle renforçant la légitimité de la démarche

## 2. Spécifications techniques

### 2.1 Stack technologique
- **Frontend** : React.js 18+ avec TypeScript
- **Styling** : Tailwind CSS + Shadcn/ui pour les composants
- **Backend** : API Routes Next.js
- **Base de données** : Google Sheets via API
- **Hébergement** : Vercel avec déploiement automatique
- **Domaine** : auray-cloches-petition.vercel.app (ou nom personnalisé)

### 2.2 Architecture
```
src/
├── components/
│   ├── ui/ (Shadcn components)
│   ├── PetitionForm/
│   ├── SignaturesList/
│   ├── Statistics/
│   └── LegalInfo/
├── pages/
│   ├── api/
│   │   ├── signatures.ts
│   │   └── stats.ts
│   ├── index.tsx
│   ├── signatures.tsx
│   ├── contexte.tsx
│   ├── vision.tsx
│   └── mentions-legales.tsx
├── lib/
│   ├── googleSheets.ts
│   ├── validation.ts
│   └── utils.ts
└── styles/
    └── globals.css
```

## 3. Fonctionnalités détaillées

### 3.1 Page d'accueil (Landing)
#### 3.1.1 Hero Section
- **Titre accrocheur** : "Stop aux nuisances sonores des cloches à Auray"
- **Sous-titre** : "Signez la pétition pour un équilibre entre tradition et qualité de vie"
- **CTA principal** : Bouton "Signer maintenant" bien visible
- **Compteur** : Nombre de signatures en temps réel

#### 3.1.2 Section Contexte
- **Problématique** : Explication claire du problème post-réparation
- **Base légale** : Référence aux lois de 1905/1906
- **Demandes** : Liste des 4 demandes principales de la pétition
- **Lien contexte approfondi** : "En savoir plus sur le contexte socioculturel" → `/contexte`

#### 3.1.3 Section Statistiques
- **Graphique** : Évolution des signatures dans le temps
- **Objectif** : Barre de progression vers l'objectif (ex: 500 signatures)
- **Répartition** : Signatures par quartier/zone d'Auray

### 3.2 Page Contexte Socioculturel (`/contexte`)
#### 3.2.1 Objectif
Page de référence complète contenant toutes les données statistiques, historiques et juridiques développées dans `context.md`, accessible via lien discret depuis la page principale.

#### 3.2.2 Structure de contenu
##### **Section 1 : Statistiques Religieuses en France**
- **Données INSEE** (2019-2020) : Fréquentation des lieux de culte
- **Études IFOP** (2019-2021) : Pratique religieuse détaillée
- **Catholiques** : 29-30% population, 1,5% messe hebdomadaire, 8% fréquentation régulière
- **Musulmans** : 8-10% population, 20% fréquentation mosquée, 58% prière domicile
- **Protestants, Juifs, autres** : Statistiques comparatives
- **Graphiques interactifs** : Évolution dans le temps, comparaisons européennes

##### **Section 2 : Laïcité et Sécularisation**
- **Évolution historique** : De 1905 à 2025
- **Non-croyance majoritaire** : 56% de non-croyants en 2023 (IFOP-Fiducial)
- **Rupture culturelle** : Fin de 15 siècles de domination chrétienne
- **Comparaisons européennes** : France vs Pays-Bas (68% non-croyants)

##### **Section 3 : Paradoxe du Financement Public**
- **Scandale démocratique** : 40 307 églises communales financées par tous
- **Explication juridique** : Loi 1905, distinction avant/après construction
- **Contradiction** : Article 2 loi 1905 vs réalité du financement
- **Coûts publics** : Millions d'euros annuels, 87 cathédrales d'État
- **Dénonciation** : 56% non-croyants financent 1,5% pratiquants

##### **Section 4 : Cadre Juridique des Sonneries**
- **Base légale** : Loi 1905 Article 27, Décret 1906
- **Pouvoir du maire** : Régulation des sonneries pour ordre public
- **Jurisprudence** : Cas de restrictions validées par tribunaux
- **Équilibre** : Liberté religieuse vs tranquillité publique

#### 3.2.3 Design et UX
- **Navigation claire** : Menu ancré pour sections longues
- **Lisibilité optimisée** : Typographie adaptée aux longs contenus
- **Visuels explicatifs** : Graphiques, infographies, cartes
- **Sources visibles** : Références complètes en bas de page
- **Partage sectionné** : Boutons pour partager sections spécifiques
- **Responsive** : Adaptation tablette/mobile pour lecture confortable

#### 3.2.4 Fonctionnalités avancées
- **Recherche interne** : Fonction search dans le contenu
- **Bookmark sections** : Liens directs vers sections spécifiques
- **Mode impression** : CSS optimisé pour impression PDF
- **Citations** : Système de citation académique pour références
- **Timeline interactive** : Évolution chronologique laïcité 1905-2025

#### 3.2.5 Positionnement stratégique
- **Accessible mais discrète** : Lien "Contexte approfondi" depuis page principale
- **Crédibilité renforcée** : Documentation exhaustive pour journalistes/élus
- **Argument de poids** : Légitimité démocratique du financement public
- **Éviter la polémique** : Page séparée pour ne pas effrayer les signataires modérés

### 3.3 Page Vision d'Avenir (`/vision`) - 🎨 **APOTHÉOSE GRAPHIQUE**
#### 3.3.1 Concept et positionnement
**L'expérience visuelle culminante du site** : transformation de la critique en inspiration pure, présentant "La Désécularisation Créative" comme alternative positive et joyeuse.

#### 3.3.2 Design spectaculaire
##### **Hero Section immersive**
- **Animation d'ouverture** : Transition 3D d'une église en ruines vers espaces lumineux
- **Titre cinématique** : "La Renaissance des 40 307 Temples du Bonheur"
- **Parallax scrolling** : Effets de profondeur immersifs
- **Typographie impactante** : Police moderne contrastant avec le gothique religieux
- **Palette inspirante** : Dégradés vibrants (orange soleil, vert nature, bleu liberté)

##### **Section interactive "Choisissez votre transformation"**
- **Cartes 3D flippantes** : 10 transformations avec animations hover spectaculaires
- **Réalité virtuelle** : Prévisualisation 360° des reconversions
- **Filtres dynamiques** : Par thème (sport, culture, social, innovation)
- **Easter eggs** : Clics découvrent anecdotes amusantes (ex: "Rolling Stones à Paradiso")

##### **🎯 MODULE PHARE : "Transformez VOTRE Église d'Auray" - IA Génération Temps Réel**
###### **Concept révolutionnaire**
**Le clou du spectacle absolu** : Module IA permettant aux visiteurs de voir l'église Saint-Gildas d'Auray transformée instantanément selon chacune des 10 visions spectaculaires.

###### **Interface utilisateur intuitive**
- **Photo de base** : Image haute définition actuelle de l'église d'Auray Saint-Gildas
- **Sélecteur transformations** : 10 boutons visuels avec icônes des reconversions
- **Génération instantanée** : Clic → transformation IA en 3-5 secondes
- **Comparaison avant/après** : Slider interactif pour voir la métamorphose
- **Mode plein écran** : Vision immersive de la transformation complète

###### **Technologies IA intégrées**
- **Stable Diffusion API** : Génération d'images architecturales haute qualité
- **Midjourney API** : Alternative pour styles artistiques variés  
- **DALL-E 3 API** : Rendu photorealistique des transformations
- **Prompts optimisés** : Templates spécialisés pour chaque transformation
- **Cache intelligent** : Sauvegarde des générations populaires

###### **10 Transformations IA de l'Église d'Auray**

**🏃‍♂️ Transformation Sport :**
- **Prompt IA** : "Transform this Gothic church into a modern climbing gym, keeping the stone architecture, adding colorful climbing walls, safety equipment, LED lighting, people climbing and exercising"
- **Éléments visuels** : Murs d'escalade colorés sur architecture gothique, éclairage sportif LED, grimpeurs en action

**🎭 Transformation Culturelle :**
- **Prompt IA** : "Transform this church into a vibrant concert hall, keep the architecture, add stage lighting, sound equipment, audience seating, musicians performing, colorful atmospheric lighting"
- **Éléments visuels** : Scène moderne, éclairage spectacle, public enthousiasmé, instruments de musique

**📚 Transformation Bibliothèque :**
- **Prompt IA** : "Transform this church into a magnificent library, keep gothic architecture, add bookshelves integrated into walls, reading areas, modern furniture, people reading, warm lighting"
- **Éléments visuels** : Étagères intégrées aux piliers, espaces lecture cosy, visiteurs studieux

**🏠 Transformation Logements :**
- **Prompt IA** : "Transform this church into modern social housing lofts, keep stone walls, add multiple floors, windows, balconies, green plants, families living happily"
- **Éléments visuels** : Niveaux multiples, fenêtres ajoutées, balcons végétalisés, familles heureuses

**🌱 Transformation Ferme Urbaine :**
- **Prompt IA** : "Transform this church into an urban farm, keep architecture, add vertical gardens, greenhouses, vegetables growing, farmers working, natural sunlight filtering through"
- **Éléments visuels** : Jardins verticaux, serres intégrées, légumes luxuriants, agriculteurs urbains

**⚙️ Transformation FabLab :**
- **Prompt IA** : "Transform this church into a high-tech innovation lab, keep gothic structure, add 3D printers, computer workstations, modern equipment, inventors working"
- **Éléments visuels** : Imprimantes 3D, postes informatiques, équipements modernes, inventeurs créatifs

**🍽️ Transformation Restaurant :**
- **Prompt IA** : "Transform this church into an elegant restaurant, keep stone architecture, add dining tables, kitchen, atmospheric lighting, diners enjoying meals, chef cooking"
- **Éléments visuels** : Tables élégantes, cuisine ouverte, éclairage chaleureux, convives ravis

**🏥 Transformation Santé :**
- **Prompt IA** : "Transform this church into a modern medical center, keep architecture, add medical equipment, examination rooms, waiting areas, doctors and patients, clean medical environment"
- **Éléments visuels** : Équipements médicaux, salles d'examen, zones d'attente, personnel soignant

**🎓 Transformation Université :**
- **Prompt IA** : "Transform this church into a popular university, keep gothic architecture, add lecture halls, student desks, educational equipment, students learning, professor teaching"
- **Éléments visuels** : Amphithéâtres, bureaux étudiants, équipements éducatifs, cours dynamiques

**🎉 Transformation Événementiel :**
- **Prompt IA** : "Transform this church into a festive event center, keep architecture, add celebration decorations, dance floor, party lighting, people celebrating, joyful atmosphere"
- **Éléments visuels** : Décorations festives, piste de danse, éclairage party, célébrations joyeuses

###### **Fonctionnalités avancées du module**
- **Personnalisation** : Ajustement intensité transformation (subtile → radicale)
- **Styles artistiques** : Photorealiste, artistique, architectural, fantaisiste
- **Sauvegarde/Partage** : Téléchargement et partage réseaux sociaux
- **Galerie communauté** : Meilleures créations des utilisateurs
- **Historique** : Voir toutes ses transformations précédentes

###### **Expérience utilisateur optimisée**
- **Loading créatif** : Animation "L'IA réinvente votre église..." avec compteur
- **Preview instantané** : Aperçu basse résolution immédiat + version HD progressive
- **Call-to-action** : "Partagez votre vision transformée" → réseaux sociaux automatique
- **Témoignages générés** : "Et si l'église d'Auray devenait cela ? Signez pour le possible !"

###### **Impact viral garanti**
- **Hashtag dédié** : #AurayTransformée, #MonEgliseRêvée, #VisionAuray
- **Défis communauté** : "Votre transformation préférée pour Auray ?"
- **Concours** : Transformation la plus créative récompensée
- **Médias locaux** : Kit presse avec transformations spectaculaires

###### **Intégration pétition**
- **Pont naturel** : Après transformation → "Concrétisons cette vision, signez !"
- **Personnalisation message** : "J'ai imaginé l'église d'Auray en [transformation], et vous ?"
- **Motivation renforcée** : Vision concrète du changement possible

**🎯 Ce module transforme votre pétition locale en LABORATOIRE D'IMAGINATION COLLECTIVE ! Les Alréens visualisent littéralement l'avenir possible de LEUR patrimoine !**

#### 3.3.3 Les 10 Transformations - Présentation visuelle immersive

##### **🏃‍♂️ 1. Temples du Sport et du Bien-être**
- **Visuel 3D** : Église transformée en salle d'escalade (Sainte-Rita Paris)
- **Animation** : Progression grimpeur sur murs néo-gothiques
- **Stats impact** : "1 église = 500 licenciés sportifs vs 15 fidèles"
- **Témoignages** : Citations utilisateurs enchantés

##### **🎭 2. Centres Culturels et Artistiques**
- **Reconstitution** : Concert Rolling Stones à Paradiso Amsterdam 1970
- **Timeline interactive** : 50 ans de concerts mythiques
- **Galerie photo** : Avant/après transformations européennes
- **Simulateur** : "Votre concert préféré dans VOTRE église locale"

##### **📚 3. Bibliothèques et Espaces Coworking**
- **Modélisation 3D** : Librairie Maastricht (700k visiteurs/an)
- **Compteur temps réel** : "Nombre de livres lus vs prières récitées"
- **Carte interactive** : Répartition optimale 40 307 nouveaux lieux
- **Calculateur** : "Impact culturel par habitant"

##### **🏠 4. Logements Sociaux et Abris**
- **Mockup architectural** : Transformation nef en lofts lumineux
- **Social impact** : "40 307 églises = 200 000 nouveaux logements"
- **Témoignages vidéo** : Familles logées dans reconversions européennes
- **Cartographie** : Besoins logement vs églises disponibles par région

##### **🌱 5. Fermes Urbaines et Jardins Partagés**
- **Timelapse** : Croissance légumes dans ancienne sacristie
- **Calculateur CO2** : Impact écologique vs pollution des messes
- **Réalité augmentée** : Superposer potager sur photo église locale
- **Community map** : Réseaux jardins partagés possibles

##### **⚙️ 6. FabLabs et Hubs d'Innovation**
- **Démonstration live** : Impression 3D dans chœur gothique
- **Stats révolutionnaires** : "1 église = 100 startup vs 5 bigotes"
- **Innovation tracker** : Brevets déposés dans reconversions existantes
- **Future vision** : IA générée des innovations possibles

##### **🍽️ 7. Cantines Solidaires et Restaurants Populaires**
- **Showcase** : Restaurant 2* Michelin "The Jane" Anvers
- **Impact social** : "Nourrir vs endoctriner - le nouveau miracle"
- **Recettes** : Menu inspiré de la gastronomie des reconversions
- **Réseau** : Fraternité culinaire vs fraternité religieuse

##### **🏥 8. Centres de Santé Communautaires**
- **Infographie** : Espérance de vie vs pratique religieuse
- **Avant/après** : Pièta remplacée par mammographe
- **Témoignages** : "Ici on sauve vraiment des vies"
- **Mapping** : Déserts médicaux vs églises vides

##### **🎓 9. Universités Populaires et Écoles**
- **Simulation** : Cours philosophie dans ancienne chaire
- **Révolution éducative** : Science vs dogme, même architecture
- **Statistiques** : Taux alphabétisation vs fréquentation religieuse
- **Vision** : "Des sermons aux neurones"

##### **🎉 10. Centres Festifs et Événementiels**
- **Galerie** : Mariages civils dans décors sublimes
- **Events calendar** : "365 jours de bonheur vs 52 dimanches mornes"
- **Configurateur** : Organisez VOS événements dans églises transformées
- **Témoignages** : "Enfin du bonheur dans ces murs !"

#### 3.3.4 Section "Plan Renaissance 2025-2035"
##### **Timeline interactive spectaculaire**
- **Phase 1 (2025-2027)** : 100 pilotes avec animations de progression
- **Phase 2 (2028-2032)** : 5000 transformations, carte France évolutive  
- **Phase 3 (2033-2035)** : Révolution complétée, France métamorphosée
- **Compteur impact** : Vies transformées, emplois créés, bonheur généré

#### 3.3.5 Galerie "Succès Européens" - Inspiration Pure
##### **Carrousel immersif haute définition**
- **Paradiso Amsterdam** : Photos concert + ambiance rock
- **Planet Jump La Haye** : Vidéo enfants sautant joie vs prières mornes
- **Librairie Maastricht** : Beautés architecture + 700k visiteurs ravis
- **The Jane Anvers** : Gastronomie 2* vs hosties fades
- **Église-escalade Paris** : Sport vs spiritualité, même élévation

#### 3.3.6 Section finale "Utopie ou Réalité ?"
##### **Révélation progressive interactive**
- **Décompte dystopie** : Églises vides, argent gaspillé, ennui mortel
- **Transformation magique** : Animation morphing vers espaces de bonheur
- **Citation finale animée** : *"Là où étaient les temples de l'oppression naîtront les jardins de la liberté"*
- **CTA puissant** : "Commencer la Révolution Créative" → retour pétition

#### 3.3.7 Fonctionnalités techniques avancées
##### **Performance et innovation**
- **WebGL et Three.js** : Rendus 3D fluides
- **Progressive loading** : Images haute qualité sans ralentissement
- **Responsive excellence** : Adaptation parfaite mobile/tablette/desktop
- **PWA capability** : Installation possible comme app
- **Offline mode** : Cache intelligent pour revisites

##### **Interactivité poussée**
- **Gesture control** : Navigation tactile intuitive
- **Voice activation** : "Montre-moi les centres sportifs"
- **Sharing granulaire** : Partage transformations spécifiques
- **Bookmark personnel** : Sauvegarde favoris utilisateur
- **Print sublime** : Version imprimable design magazine

#### 3.3.8 Stratégie d'engagement émotionnel
##### **Storytelling révolutionnaire**
- **Contraste saisissant** : Passé sombre vs futur lumineux
- **Émotions positives** : Joie, espoir, émerveillement, fierté
- **Identification** : "Imaginez VOTRE église locale transformée"
- **Urgence créative** : "La Renaissance commence MAINTENANT"

##### **Viralité optimisée**
- **Moments Instagram** : Chaque section = contenu partageable
- **Challenges** : #MaVisionEglise, utilisateurs créent leurs idées
- **Influenceurs** : Kit presse pour personnalités engagées
- **Mèmes positifs** : Détournements humoristiques bienveillants

#### 3.3.9 Mesures d'impact
##### **Analytics émotionnels**
- **Temps d'engagement** : Minutes passées sur page (objectif: 15min+)
- **Scroll depth** : Pourcentage exploration complète
- **Interactions** : Clics sur transformations, partages
- **Conversion** : Retour pétition après vision

##### **Feedback utilisateur**
- **Votes préférences** : Transformation préférée par région
- **Commentaires inspirés** : Témoignages visiteurs motivés
- **Idées communauté** : Nouvelles propositions reconversion
- **Impact viral** : Tracking partages réseaux sociaux

#### 3.3.10 Positionnement final
**Cette page `/vision` transforme votre pétition en MOUVEMENT CULTUREL** : de la simple régulation des cloches à la révolution joyeuse de la France post-religieuse !

### 3.4 Formulaire de signature
#### 3.4.1 Champs obligatoires
- **Prénom** : Validation alphabétique
- **Nom** : Validation alphabétique
- **Email** : Validation format + unicité
- **Adresse complète** : Focus sur Auray et communes limitrophes
- **Code postal** : Validation 56XXX priorité
- **Acceptation RGPD** : Checkbox obligatoire

#### 3.4.2 Champs optionnels
- **Téléphone** : Pour contact éventuel
- **Commentaire** : Témoignage personnel (max 500 caractères)
- **Partage autorisé** : Autorisation d'utiliser le témoignage

#### 3.4.3 Validations
- **Géolocalisation** : Priorité aux résidents d'Auray
- **Anti-spam** : Captcha invisible reCAPTCHA
- **Détection doublons** : Par email et combinaison nom/adresse
- **Validation temps réel** : Feedback immédiat sur chaque champ

### 3.5 Affichage des signatures
#### 3.5.1 Liste publique
- **Anonymisation** : Prénom + Initiale nom (ex: "Jean D.")
- **Localisation** : Quartier ou commune
- **Date** : Horodatage de signature
- **Commentaires** : Si autorisés par le signataire

#### 3.5.2 Filtres
- **Par date** : Plus récentes, plus anciennes
- **Par localisation** : Auray centre, quartiers, communes voisines
- **Avec commentaires** : Affichage des témoignages uniquement

### 3.6 Espace administrateur
#### 3.6.1 Dashboard
- **Statistiques détaillées** : Graphiques et métriques
- **Export des données** : CSV, PDF pour remise officielle
- **Modération** : Validation/suppression des signatures suspectes
- **Communication** : Envoi d'emails aux signataires

#### 3.6.2 Gestion des données
- **Sauvegarde Google Sheets** : Synchronisation automatique
- **Historique** : Log de toutes les actions
- **RGPD** : Outils de suppression de données personnelles

## 4. Intégration Google Sheets

### 4.1 Structure de la feuille
```
| Timestamp | Prénom | Nom | Email | Adresse | CP | Ville | Téléphone | Commentaire | IP | Status |
```

### 4.2 Configuration
- **API Google Sheets** : Service account avec permissions lecture/écriture
- **Sécurité** : Variables d'environnement pour credentials
- **Backup** : Sauvegarde quotidienne automatique
- **Monitoring** : Alertes en cas d'erreur d'écriture

## 5. Design et UX

### 5.1 Charte graphique
- **Couleurs principales** : 
  - Bleu institutionnel (#1E3A8A) pour crédibilité
  - Vert d'action (#10B981) pour les CTA
  - Rouge d'alerte (#EF4444) pour les nuisances
- **Typography** : Inter (lisibilité optimale)
- **Style** : Moderne, épuré, institutionnel mais accessible

### 5.2 Responsive design
- **Mobile-first** : Optimisation smartphone prioritaire
- **Tablette** : Adaptation des formulaires
- **Desktop** : Utilisation optimale de l'espace

### 5.3 Accessibilité
- **WCAG 2.1 AA** : Conformité standards accessibilité
- **Navigation clavier** : Tous les éléments accessibles
- **Contrastes** : Ratios conformes pour malvoyants
- **Screen readers** : Balises ARIA appropriées

## 6. Sécurité et confidentialité

### 6.1 Protection des données
- **HTTPS obligatoire** : Chiffrement SSL/TLS
- **Validation côté serveur** : Jamais uniquement côté client
- **Sanitisation** : Nettoyage des entrées utilisateur
- **Rate limiting** : Protection contre le spam

### 6.2 RGPD
- **Consentement explicite** : Checkbox obligatoire
- **Finalité claire** : Usage uniquement pour la pétition
- **Droit à l'oubli** : Procédure de suppression
- **Mentions légales** : Page dédiée complète

### 6.3 Anti-fraude
- **IP tracking** : Limitation signatures par IP
- **Validation email** : Confirmation par email optionnelle
- **Modération** : Vérification manuelle si nécessaire
- **Honeypot** : Champs cachés anti-bots

## 7. SEO et visibilité

### 7.1 Optimisation technique
- **Meta tags** : Title, description, Open Graph
- **Schema markup** : Données structurées pour moteurs
- **Sitemap** : Génération automatique
- **Robots.txt** : Configuration appropriée

### 7.2 Contenu
- **Mots-clés** : "Auray", "cloches", "nuisances sonores", "pétition"
- **Content marketing** : Articles de blog sur la problématique
- **Social sharing** : Boutons partage réseaux sociaux

## 8. Intégrations externes

### 8.1 Réseaux sociaux
- **Partage automatique** : Boutons Facebook, Twitter, WhatsApp
- **Open Graph** : Prévisualisation riche lors du partage
- **Tracking** : Suivi des conversions depuis réseaux sociaux

### 8.2 Communication
- **Newsletter** : Inscription pour updates sur la pétition
- **Notifications** : Alertes étapes importantes (100, 250, 500 signatures)

## 9. Analytics et monitoring

### 9.1 Métriques clés
- **Conversions** : Taux de signature par visiteur
- **Sources** : D'où viennent les visiteurs
- **Abandon** : À quelle étape les utilisateurs partent
- **Géographie** : Répartition des signatures

### 9.2 Outils
- **Google Analytics 4** : Suivi comportement utilisateur
- **Vercel Analytics** : Performances techniques
- **Uptime monitoring** : Surveillance disponibilité 24/7

## 10. Planning de développement

### Phase 1 - MVP (Semaine 1)
- [ ] Setup projet Next.js + Tailwind + Shadcn
- [ ] Intégration Google Sheets API
- [ ] Formulaire de signature basique
- [ ] Page d'accueil simple
- [ ] Déploiement Vercel

### Phase 2 - Fonctionnalités (Semaine 2)
- [ ] Validation avancée et sécurité
- [ ] Liste des signatures publique
- [ ] Statistiques en temps réel
- [ ] Design responsive finalisé
- [ ] SEO et meta tags

### Phase 3 - Optimisations (Semaine 3)
- [ ] Dashboard administrateur
- [ ] Analytics et monitoring
- [ ] Tests et optimisations performance
- [ ] Documentation utilisateur
- [ ] Formation utilisateurs finaux

## 11. Budget et ressources

### 11.1 Coûts techniques
- **Développement** : 3 semaines développeur senior
- **Hébergement Vercel** : Gratuit (plan hobby suffisant)
- **Google Sheets API** : Gratuit (quotas largement suffisants)
- **Domaine personnalisé** : 15€/an (optionnel)

### 11.2 Maintenance
- **Monitoring** : 2h/mois
- **Mise à jour contenu** : 1h/semaine
- **Support utilisateurs** : Variable selon succès

## 12. Critères de succès

### 12.1 Objectifs quantitatifs
- **500 signatures** en 3 mois
- **Taux de conversion** > 15% (visiteurs → signataires)
- **Taux de rebond** < 60%
- **Temps de chargement** < 2 secondes

### 12.2 Objectifs qualitatifs
- **Crédibilité renforcée** de la démarche citoyenne
- **Médiatisation** facilitée (articles presse, réseaux sociaux)
- **Engagement** citoyen numérique développé
- **Dialogue** constructif avec élus municipaux

---

**Document créé le** : 14 juillet 2025  
**Version** : 1.0  
**Statut** : Prêt pour développement