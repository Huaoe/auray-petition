# Configuration Projet - Pétition Numérique Auray

## 📋 **Liste Complète des Éléments Nécessaires**

### 🔧 **1. CONFIGURATION TECHNIQUE**

#### 1.1 APIs et Services
- [ ] **Google Sheets API**
  - Création compte Google Cloud Platform
  - Activation Google Sheets API
  - Génération Service Account + JSON credentials
  - Configuration permissions lecture/écriture
  
- [ ] **IA Image Generation APIs**
  - [ ] **Stable Diffusion API** (Stability AI)
  - [ ] **DALL-E 3 API** (OpenAI)
  - [ ] **Midjourney API** (via Discord Bot ou API)
  - Tests de qualité et coûts par API

- [ ] **Services Complémentaires**
  - Google Analytics 4 - Tracking ID
  - reCAPTCHA v3 - Site key + Secret key
  - Vercel Analytics (inclus avec hébergement)

#### 1.2 Variables d'Environnement
```env
# Google Sheets
GOOGLE_SHEETS_PRIVATE_KEY=
GOOGLE_SHEETS_CLIENT_EMAIL=
GOOGLE_SHEETS_PROJECT_ID=
GOOGLE_SHEETS_SHEET_ID=

# IA APIs
OPENAI_API_KEY=
STABILITY_API_KEY=
MIDJOURNEY_API_KEY=

# Analytics & Security
GOOGLE_ANALYTICS_ID=
RECAPTCHA_SITE_KEY=
RECAPTCHA_SECRET_KEY=
NEXT_PUBLIC_SITE_URL=
```

#### 1.3 Infrastructure
- [ ] **Domaine personnalisé** (optionnel)
  - Achat domaine : auray-petition.fr ou similaire
  - Configuration DNS chez Vercel
- [ ] **Hébergement Vercel**
  - Compte Vercel (gratuit suffisant)
  - Connexion GitHub pour déploiement automatique

#### 1.4 Email et Communication (CRITIQUE)
- [ ] **Adresse email racine du projet**
  - contact@auray-petition.fr (si domaine personnalisé)
  - OU auray.petition.contact@gmail.com (alternative gratuite)
  - Configuration boîte de réception
  - Auto-répondeur initial

- [ ] **Adresses spécialisées** (optionnel mais recommandé)
  - admin@auray-petition.fr (gestion technique)
  - presse@auray-petition.fr (relations médias)
  - juridique@auray-petition.fr (questions légales)

- [ ] **Service de messagerie**
  - Gmail/Google Workspace (gratuit ou payant)
  - Configuration SMTP pour envois automatiques
  - Signature email professionnelle

- [ ] **Newsletter/Communication**
  - Service Mailchimp ou similaire (gratuit jusqu'à 2000 contacts)
  - Templates emails pour notifications
  - Gestion listes diffusion

### 📸 **2. ASSETS VISUELS**

#### 2.1 Photos de l'Église d'Auray (CRITIQUE)
- [ ] **Photo principale HD** (4K minimum)
  - Église Saint-Gildas d'Auray - Vue façade principale
  - Éclairage optimal (journée, ciel dégagé)
  - Angle permettant visualisation architecture complète
  - Format RAW ou JPEG haute qualité

- [ ] **Photos complémentaires**
  - Vue latérale droite
  - Vue arrière/chevet
  - Détails architecturaux (portail, vitraux, clocher)
  - Photos intérieur (si autorisé)

#### 2.2 Charte Graphique
- [ ] **Palette de couleurs**
  - Couleur primaire : Bleu républicain (#1E3A8A)
  - Couleur secondaire : Orange soleil (#F97316)
  - Couleur accent : Vert nature (#059669)
  - Nuances de gris pour textes

- [ ] **Typographies**
  - Font primaire : Inter (moderne, lisible)
  - Font secondaire : Marianne (institutionnelle française)

- [ ] **Logo/Identité visuelle**
  - Logo principal du projet
  - Favicon
  - Images Open Graph pour réseaux sociaux

#### 2.3 Images de Références
- [ ] **Exemples de reconversions**
  - Paradiso Amsterdam (concert hall)
  - The Jane Anvers (restaurant)
  - Librairie Maastricht (bibliothèque)
  - Sainte-Rita Paris (escalade)
  - Images libres de droits ou avec permissions

### 📝 **3. CONTENU ÉDITORIAL**

#### 3.1 Textes Définitifs
- [ ] **Page d'accueil**
  - Titre principal accrocheur
  - Description problématique (300 mots max)
  - Appels à l'action optimisés
  - Témoignages habitants (si disponibles)

- [ ] **Mentions légales**
  - Éditeur responsable
  - Hébergeur (Vercel)
  - Contact/responsable
  - Politique confidentialité RGPD

- [ ] **Texte pétition finalisé**
  - Version définitive 4 demandes
  - Argumentaire juridique (loi 1905)
  - Ton respectueux mais ferme

#### 3.2 SEO et Métadonnées
- [ ] **Mots-clés cibles**
  - "Auray cloches pétition"
  - "nuisances sonores églises"
  - "régulation sonneries"
  - "loi 1905 laïcité"

- [ ] **Descriptions métadonnées**
  - Meta description page accueil
  - Meta descriptions pages secondaires
  - Balises Open Graph réseaux sociaux

#### 3.3 Prompts IA Optimisés
- [ ] **Tests et affinement des 10 prompts**
  - Validation qualité générations
  - Ajustements pour architecture église d'Auray
  - Optimisation temps génération
  - Tests avec différentes APIs

### ⚖️ **4. ASPECTS LÉGAUX ET ADMINISTRATIFS**

#### 4.1 Conformité RGPD
- [ ] **Documentation RGPD**
  - Politique de confidentialité détaillée
  - Formulaire consentement explicite
  - Procédure droit à l'oubli
  - Registre des traitements

- [ ] **Sécurité données**
  - Chiffrement HTTPS obligatoire
  - Validation côté serveur
  - Protection contre injections
  - Rate limiting anti-spam

#### 4.2 Relations Institutionnelles
- [ ] **Contact Mairie d'Auray**
  - Information sur la démarche
  - Respect protocole démocratique
  - Demande éventuelle de rencontre

- [ ] **Veille juridique**
  - Vérification dernières jurisprudences
  - Consultation avocat spécialisé (si budget)

### 👥 **5. VALIDATION UTILISATEUR**

#### 5.1 Tests Préliminaires
- [ ] **Focus group Alréens**
  - Recrutement 5-10 habitants
  - Test interface et messages
  - Validation concept transformation IA
  - Feedback sur arguments pétition

- [ ] **Tests techniques**
  - Performance mobile/desktop
  - Accessibilité WCAG 2.1
  - Compatibilité navigateurs
  - Temps de chargement

#### 5.2 Bêta-test
- [ ] **Groupe test restreint**
  - 20-30 premiers signataires
  - Feedback UX/ergonomie
  - Tests module IA génération
  - Optimisations pré-lancement

### 📢 **6. STRATÉGIE DE LANCEMENT**

#### 6.1 Communication Locale
- [ ] **Réseaux sociaux locaux**
  - Groupes Facebook Auray
  - Pages communautaires
  - Comptes Instagram/TikTok locaux

- [ ] **Médias traditionnels**
  - Contact presse locale (Ouest-France, Télégramme)
  - Dossier de presse avec visuels
  - Communiqué de presse

#### 6.2 Viralité Numérique
- [ ] **Hashtags stratégiques**
  - #AurayTransformée
  - #MonEgliseRêvée
  - #VisionAuray
  - #LaïcitéCréative

- [ ] **Contenu partageable**
  - Visuels transformations IA
  - Infographies chocs
  - Citations motivantes

### 📊 **7. SUIVI ET ANALYTICS**

#### 7.1 KPIs à Monitorer
- [ ] **Métriques engagement**
  - Nombre signatures/jour
  - Taux de conversion visiteurs
  - Temps passé sur site
  - Pages les plus vues

- [ ] **Métriques viralité**
  - Partages réseaux sociaux
  - Mentions dans médias
  - Génération images IA populaires
  - Commentaires/testimonials

#### 7.2 Outils Analytics
- [ ] **Google Analytics 4**
  - Configuration objectifs conversion
  - Entonnoirs signatures
  - Sources de trafic
  - Comportement utilisateur

---

## 🎯 **PRIORITÉS DE DÉVELOPPEMENT**

### **Phase 0 - Prérequis (Avant développement)**
1. ✅ **PHOTOS HD ÉGLISE AURAY** (CRITIQUE)
2. ✅ Configuration APIs (Google Sheets + IA)
3. ✅ Finalisation textes pétition
4. ✅ Tests prompts IA

### **Phase 1 - MVP (Semaine 1)**
1. Setup technique Next.js + Tailwind
2. Formulaire signature fonctionnel
3. Intégration Google Sheets
4. Page d'accueil basique

### **Phase 2 - Enrichissement (Semaine 2)**
1. Pages contexte et vision
2. Module IA transformation
3. Design et UX finalisés
4. Tests et optimisations

### **Phase 3 - Lancement (Semaine 3)**
1. Bêta-test groupe restreint
2. Corrections et ajustements
3. Stratégie communication
4. Lancement officiel

---

**Document créé le** : 14 juillet 2025  
**Statut** : Configuration complète prête  
**Prochaine étape** : Obtention photos HD église d'Auray