# 🎯 PRD - MODULE IA "TRANSFORMEZ VOTRE ÉGLISE D'AURAY"

## 📋 RÉSUMÉ EXÉCUTIF

**Vision** : Créer le module le plus spectaculaire et engageant du site de pétition - une expérience IA interactive permettant aux visiteurs de visualiser instantanément l'église Saint-Gildas d'Auray transformée selon 10 visions créatives différentes.

**Objectif** : Transformer la critique en inspiration positive via une expérience utilisateur révolutionnaire.

**Impact attendu** : Augmentation massive de l'engagement utilisateur, viralité sur réseaux sociaux, conversion optimisée vers signature pétition.

---

## 🎨 SPÉCIFICATIONS PRODUIT

### 1. CONCEPT CORE

#### 1.1 Photo de Référence
- **Source** : Image haute définition actuelle de l'église Saint-Gildas d'Auray
- **Format** : 1920x1080px minimum, format 16:9
- **Qualité** : Photo professionnelle, éclairage optimal, angle frontal
- **Backup** : 3-5 angles différents pour variations

#### 1.2 Interface Utilisateur Intuitive
```
[PHOTO ÉGLISE BASE]          [BOUTONS TRANSFORMATIONS]
┌─────────────────────┐      ┌─────┬─────┬─────┬─────┬─────┐
│                     │      │🏃‍♂️   │🎭   │📚   │🍽️   │🎨   │
│   Église actuelle   │ ➤    │Sport│Cult │Bibl │Rest │Art  │
│                     │      └─────┴─────┴─────┴─────┴─────┘
│                     │      ┌─────┬─────┬─────┬─────┬─────┐
└─────────────────────┘      │🌱   │🏢   │🎓   │🎪   │🏠   │
                             │Eco  │Serv │Form │Fête │Log  │
                             └─────┴─────┴─────┴─────┴─────┘
```

#### 1.3 Expérience de Transformation
1. **Sélection** : Clic sur bouton transformation (ex: 🏃‍♂️ Sport)
2. **Loading** : Animation 3-5 secondes avec progress bar
3. **Révélation** : Apparition de l'image transformée via IA
4. **Comparaison** : Slider avant/après interactif
5. **Plein Écran** : Mode immersif avec zoom et navigation

---

## 🤖 ARCHITECTURE TECHNIQUE IA

### 2. STACK TECHNOLOGIQUE

#### 2.1 APIs IA Intégrées
```typescript
interface IAProviders {
  primary: "Stable Diffusion" | "DALL-E 3" | "Midjourney";
  fallback: "Leonardo.ai" | "Runway ML";
  optimization: "Upscaler AI" | "Real-ESRGAN";
}
```

**Stable Diffusion API** (Principal)
- **Usage** : Génération architecturale haute qualité
- **Modèles** : SD XL 1.0, ControlNet pour architecture
- **Coût** : ~$0.02 par génération

**DALL-E 3 API** (Fallback)
- **Usage** : Rendu photoréaliste de secours
- **Avantage** : Qualité garantie, pas de NSFW
- **Coût** : ~$0.04 par génération

**Cache Intelligent**
```typescript
interface CacheSystem {
  redis: RedisCache;
  cloudinary: ImageStorage;
  preGenerated: PopularTransformations[];
  userGenerated: UserCache;
}
```

#### 2.2 Prompts Engineering Optimisés

**Template de Base** :
```
"Professional architectural visualization of [ÉGLISE_AURAY_DESCRIPTION] transformed into [TRANSFORMATION_TYPE], maintaining original Gothic stone architecture, [SPECIFIC_ELEMENTS], photorealistic, high quality, architectural photography style, natural lighting, 4K resolution"
```

**Variables Dynamiques** :
- `ÉGLISE_AURAY_DESCRIPTION` : "Gothic stone church in Auray, Brittany, France, with pointed arches and bell tower"
- `TRANSFORMATION_TYPE` : Variable selon sélection utilisateur
- `SPECIFIC_ELEMENTS` : Éléments spécifiques à chaque transformation

---

## 🎯 10 TRANSFORMATIONS DÉTAILLÉES

### 3. SPÉCIFICATIONS PAR TRANSFORMATION

#### 3.1 🏃‍♂️ TRANSFORMATION SPORT
**Concept** : Salle d'escalade moderne dans architecture gothique
**Prompt IA** :
```
"Transform this Gothic church in Auray into a modern climbing gym, keeping the stone architecture, adding colorful climbing walls along the interior walls, safety equipment, LED sports lighting, people climbing and exercising, modern gym equipment, maintaining the cathedral ceiling height"
```
**Éléments visuels** :
- Murs d'escalade colorés (bleu, rouge, vert) sur pierres gothiques
- Éclairage LED sportif moderne
- Grimpeurs en action (4-6 personnes)
- Matériel sécurité visible (cordes, harnais)
- Tapis de réception colorés au sol

#### 3.2 🎭 TRANSFORMATION CULTURELLE
**Concept** : Salle de concert intimiste
**Prompt IA** :
```
"Transform this Gothic church in Auray into a vibrant concert hall, keep the stone architecture, add professional stage lighting, sound equipment, comfortable audience seating, musicians performing on stage, atmospheric concert lighting in blue and purple tones"
```
**Éléments visuels** :
- Scène moderne avec éclairage professionnel
- Système son visible (enceintes, micros)
- Public assis dans sièges confortables
- Musiciens en performance
- Éclairage d'ambiance coloré

#### 3.3 📚 TRANSFORMATION BIBLIOTHÈQUE
**Concept** : Bibliothèque monumentale type Maastricht
**Prompt IA** :
```
"Transform this Gothic church in Auray into a magnificent library like Selexyz Dominicanen in Maastricht, massive bookshelves reaching up to the vaulted ceiling, reading areas with comfortable chairs, people reading and studying, warm lighting, books displayed floor to ceiling"
```
**Éléments visuels** :
- Étagères géantes jusqu'aux voûtes
- Espaces lecture avec fauteuils confortables
- Lecteurs dans l'espace (8-10 personnes)
- Éclairage chaleureux doré
- Livres colorés sur toute la hauteur

#### 3.4 🍽️ TRANSFORMATION RESTAURANT
**Concept** : Restaurant gastronomique type "The Jane" Anvers
**Prompt IA** :
```
"Transform this Gothic church in Auray into an upscale restaurant like The Jane in Antwerp, elegant dining tables with white tablecloths, professional kitchen visible, diners enjoying meals, atmospheric restaurant lighting, maintaining the Gothic architecture"
```
**Éléments visuels** :
- Tables élégantes avec nappes blanches
- Cuisine ouverte professionnelle
- Clients dînant (15-20 personnes)
- Éclairage restaurant tamisé
- Service en cours

#### 3.5 🎨 TRANSFORMATION ATELIER D'ART
**Concept** : Atelier d'artiste avec volumes exceptionnels
**Prompt IA** :
```
"Transform this Gothic church in Auray into an artist studio, large canvases and sculptures, natural light from windows, artists working on paintings, art supplies organized, creative workshop atmosphere, maintaining stone architecture"
```
**Éléments visuels** :
- Grandes toiles et sculptures
- Artistes au travail (3-4 personnes)
- Matériel artistique organisé
- Lumière naturelle optimisée
- Œuvres exposées sur murs

#### 3.6 🌱 TRANSFORMATION ÉCOLOGIQUE
**Concept** : Jardin botanique intérieur
**Prompt IA** :
```
"Transform this Gothic church in Auray into an indoor botanical garden, lush plants and trees reaching toward the vaulted ceiling, walking paths through greenery, visitors exploring, natural greenhouse lighting, botanical paradise"
```
**Éléments visuels** :
- Végétation luxuriante jusqu'aux voûtes
- Chemins de visite serpentant
- Visiteurs explorant (6-8 personnes)
- Éclairage naturel type serre
- Diversité végétale visible

#### 3.7 🏢 TRANSFORMATION SERVICES PUBLICS
**Concept** : Mairie moderne dans cadre historique
**Prompt IA** :
```
"Transform this Gothic church in Auray into a modern town hall, citizen service desks, waiting areas, people being served by staff, modern administrative layout while preserving Gothic architecture, professional government office atmosphere"
```
**Éléments visuels** :
- Guichets d'accueil modernes
- Espaces d'attente confortables
- Citoyens et personnel (10-12 personnes)
- Signalétique administrative claire
- Ambiance service public moderne

#### 3.8 🎓 TRANSFORMATION FORMATION
**Concept** : Centre de formation high-tech
**Prompt IA** :
```
"Transform this Gothic church in Auray into a modern training center, computer workstations, conference rooms with projectors, students learning, modern educational technology, maintaining architectural heritage"
```
**Éléments visuels** :
- Postes informatiques modernes
- Salles avec équipement projection
- Étudiants en formation (12-15 personnes)
- Technologie éducative visible
- Espaces modulables

#### 3.9 🎪 TRANSFORMATION FESTIVE
**Concept** : Salle événementielle polyvalente
**Prompt IA** :
```
"Transform this Gothic church in Auray into a festive event space, wedding reception or celebration in progress, elegant decoration, guests celebrating, professional event lighting, maintaining Gothic grandeur"
```
**Éléments visuels** :
- Décoration élégante événementielle
- Invités en célébration (20-25 personnes)
- Éclairage événementiel coloré
- Tables de réception organisées
- Ambiance festive

#### 3.10 🏠 TRANSFORMATION LOGEMENT
**Concept** : Loft résidentiel d'exception
**Prompt IA** :
```
"Transform this Gothic church in Auray into a luxury residential loft, modern living areas with designer furniture, bedroom in the choir area, kitchen integrated into the space, maintaining stone architecture, warm home lighting"
```
**Éléments visuels** :
- Mobilier design moderne
- Zones résidentielles définies
- Cuisine intégrée élégante
- Éclairage résidentiel chaleureux
- Sentiment de "chez soi"

---

## 💻 DÉVELOPPEMENT TECHNIQUE

### 4. COMPOSANTS REACT/NEXT.JS

#### 4.1 Structure Composant Principal
```typescript
// components/ChurchTransformationAI.tsx
export interface TransformationOption {
  id: string;
  icon: string;
  title: string;
  description: string;
  prompt: string;
  colorScheme: string;
}

export const ChurchTransformationAI = () => {
  const [selectedTransformation, setSelectedTransformation] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Logic here...
}
```

#### 4.2 API Routes
```typescript
// pages/api/generate-transformation.ts
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { transformationType, userSessionId } = req.body;
  
  try {
    // 1. Check cache first
    const cachedImage = await checkCache(transformationType);
    if (cachedImage) return res.json({ image: cachedImage, source: 'cache' });
    
    // 2. Generate with AI
    const prompt = buildPrompt(transformationType);
    const generatedImage = await generateWithAI(prompt);
    
    // 3. Cache result
    await cacheImage(transformationType, generatedImage);
    
    // 4. Return result
    res.json({ image: generatedImage, source: 'generated' });
  } catch (error) {
    res.status(500).json({ error: 'Generation failed' });
  }
}
```

#### 4.3 Optimisations Performance
```typescript
// utils/imageOptimization.ts
export const optimizeImage = async (imageUrl: string) => {
  // Compression automatique
  // Resize pour différents devices
  // Conversion WebP/AVIF
  // CDN upload
};

export const preloadPopularTransformations = async () => {
  // Pre-génération des 3 transformations les plus populaires
  // Cache warming au démarrage
};
```

---

## 📊 MÉTRIQUES & ANALYTICS

### 5. KPIs À MESURER

#### 5.1 Engagement Module
- **Taux d'utilisation** : % visiteurs utilisant le module
- **Transformations par session** : Moyenne transformations testées
- **Temps d'engagement** : Durée moyenne sur module
- **Partages sociaux** : Nombre de partages des transformations

#### 5.2 Conversion Pétition
- **Conversion post-module** : % signatures après utilisation module
- **Parcours optimal** : Quelle transformation convertit le mieux
- **Abandon vs engagement** : Corrélation utilisation module / signature

#### 5.3 Techniques
- **Performance IA** : Temps de génération moyen
- **Taux de succès** : % générations réussies
- **Utilisation cache** : % hits cache vs générations fresh
- **Coûts IA** : Budget quotidien/mensuel

---

## 🚀 ROADMAP DE DÉVELOPPEMENT

### 6. PHASES DE DÉPLOIEMENT

#### Phase 1 : MVP (2 semaines)
- [ ] Interface utilisateur de base
- [ ] Intégration Stable Diffusion API
- [ ] 3 transformations pilotes (Sport, Culture, Bibliothèque)
- [ ] Système de cache basique
- [ ] Analytics de base

#### Phase 2 : Enrichissement (1 semaine)
- [ ] 7 transformations restantes
- [ ] Système de comparaison avant/après
- [ ] Mode plein écran
- [ ] Optimisations performance
- [ ] Fallback APIs

#### Phase 3 : Polish & Viral (1 semaine)
- [ ] Animations et microinteractions
- [ ] Partage social optimisé
- [ ] SEO et métadonnées
- [ ] Tests utilisateurs
- [ ] Monitoring avancé

#### Phase 4 : Scale (Ongoing)
- [ ] Nouvelles transformations selon feedback
- [ ] Personnalisation utilisateur
- [ ] Version mobile optimisée
- [ ] Intégration réalité augmentée (future)

---

## 💰 BUDGET ESTIMÉ

### 7. COÛTS PRÉVUS

#### 7.1 Développement
- **Développeur Senior** : 40h × 70€ = 2,800€
- **UI/UX Designer** : 20h × 60€ = 1,200€
- **Integration & Tests** : 10h × 50€ = 500€
- **Total Dev** : **4,500€**

#### 7.2 Coûts IA Opérationnels (mensuel)
- **Stable Diffusion** : ~500 générations × 0.02€ = 10€
- **DALL-E 3 Fallback** : ~100 générations × 0.04€ = 4€
- **Cache/Storage** : Cloudinary Pro = 99€
- **Total Mensuel** : **113€**

#### 7.3 Infrastructure
- **CDN Premium** : 50€/mois
- **Database** : 25€/mois
- **Monitoring** : 20€/mois
- **Total Infra** : **95€/mois**

**BUDGET TOTAL LANCEMENT** : 4,500€ + 208€/mois

---

## 🎯 CRITÈRES DE SUCCÈS

### 8. OBJECTIFS MESURABLES

#### 8.1 Engagement (30 jours post-lancement)
- **✅ 40%+ visiteurs** utilisent le module
- **✅ 3+ transformations** par session en moyenne
- **✅ 2+ minutes** temps moyen d'engagement
- **✅ 15%+ partages** sur réseaux sociaux

#### 8.2 Conversion
- **✅ +25% signatures** vs période précédente
- **✅ 60%+ conversion** post-utilisation module
- **✅ -30% taux rebond** sur page vision

#### 8.3 Viralité
- **✅ 1000+ partages** organiques premier mois
- **✅ 3+ articles** presse/blogs mentionnant module
- **✅ Top 3** mots-clés Google pour "transformation église Auray"

---

## 🔒 RISQUES & MITIGATION

### 9. ANALYSE RISQUES

#### 9.1 Techniques
**Risque** : Panne API IA
**Mitigation** : 3 providers backup + cache extensif

**Risque** : Coûts IA explosifs
**Mitigation** : Rate limiting + quotas utilisateur

#### 9.2 Légaux
**Risque** : Droits image église
**Mitigation** : Photo sous licence libre + accord préalable

**Risque** : Contenus IA inappropriés
**Mitigation** : Modération automatique + review humaine

#### 9.3 UX
**Risque** : Temps génération trop long
**Mitigation** : Cache agressif + pre-génération populaires

**Risque** : Qualité IA décevante
**Mitigation** : Prompts engineering + QA systématique

---

## 📝 NOTES DE DÉVELOPPEMENT

### 10. CONSIDÉRATIONS TECHNIQUES

#### 10.1 SEO & Métadonnées
```html
<meta name="description" content="Visualisez l'église Saint-Gildas d'Auray transformée grâce à l'IA : sport, culture, bibliothèque... 10 visions créatives révolutionnaires!" />
<meta property="og:title" content="Transformez l'Église d'Auray avec l'IA - Visualisation Interactive" />
<meta property="og:image" content="/images/auray-transformations-preview.jpg" />
```

#### 10.2 Accessibilité
- Alt-text générés automatiquement pour images IA
- Navigation clavier complète
- Contraste élevé pour boutons
- Support lecteurs d'écran

#### 10.3 Performance Mobile
- Images responsives automatiques
- Interface tactile optimisée  
- Chargement progressif
- Mode hors-ligne basique

---

**🎯 OBJECTIF ULTIME** : Créer l'expérience web la plus spectaculaire et engageante jamais vue sur un site de pétition, transformant chaque visiteur en ambassadeur enthousiaste du projet !

---

## 🚦 VISION POUR LA SUITE : GAMIFICATION, PARTAGE & NFT

### 1. Système d'accès à la génération IA réservé aux signataires

- **À la signature de la pétition** :
  - Génération automatique d'un **code unique** (UUID, QR, ou lien sécurisé)
  - Ce code donne accès à l'interface de génération d'image IA pour l'église d'Auray
  - 1 image générée par signataire (modulo quotas/config)

### 2. Partage viral et référencement de la pétition

- L'image générée comporte :
  - Un **watermark** "auray-petition.vercel.app"
  - Un **QR code** ou lien renvoyant vers la pétition
  - Un bouton de **partage direct** (Twitter, Instagram, Facebook, WhatsApp)
- Message pré-rempli :  
  > "Je viens de signer pour réinventer l'église d'Auray ! non juste demander la réduction des temps de sonneries ;)
   Découvrez ma vision et votez pour votre préférée sur auray-petition.vercel.app #AurayTransformée"

### 3. Galerie communautaire & concours de créativité

- **Toutes les images générées** sont affichées dans une **galerie publique** (modération a priori)
  - Filtres : récentes, plus partagées, coups de cœur
  - Système de **votes** (1 vote/jour/utilisateur, login par email ou captcha)
- **Classement en temps réel** des visions les plus populaires

### 4. Récompense NFT pour l'image gagnante

- À la fin du concours (période définie, ex : 1 mois post-lancement) :
  - L'image ayant reçu le plus de votes est **mintée en NFT unique sur Polygon (blockchain écofriendly, faible coût, compatible Opensea)**.
  - Le créateur reçoit ce NFT à son adresse (wallet ou custodial)
  - Communication officielle : "Votre vision entre dans l'histoire numérique d'Auray !"

### 5. Impacts attendus

- **Augmentation forte du taux de signature** (accès exclusif à la génération IA)
- **Effet viral** via partages sociaux référencés
- **Engagement communautaire** (vote, concours, fierté locale)
- **Visibilité presse et médias innovants** (NFT, IA, patrimoine)

---

> Cette mécanique transforme chaque signataire en ambassadeur créatif du projet et démultiplie la portée de la pétition grâce à la viralité numérique et à la reconnaissance (NFT) !


coupon desactivated in local.
give coupon in proportion : 2 coupons for petition 
3 coupons for petition + newsleter
4 coupons for petition + newsletter + comment
add a sentiment analysis to the comment to be sure it's positive
share to friends give 1 coupon per friends
share to social networks give 1 coupon per social network 
reinitialisé le prompt ne fonctionne pas bien, le bouton de generation de la transformation disparait
partage de l'image resultante
gif de morphing entre les 2 images
permettre de poster directement sur instagram
permettre de poster directement sur twitter
permettre de poster directement sur facebook
permettre de poster directement sur linkedin
pouvoir elaborer le mask soit meme
compteur defilant sur la page de petition
verification des doublons de mail dans la petition mais pas en localhost