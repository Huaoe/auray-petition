# 🤖 Module IA - Guide de Configuration

## 🚀 Vue d'ensemble

Le **Module IA de Transformation d'Église** est maintenant intégré au site de pétition. Il permet aux visiteurs de visualiser 10 transformations révolutionnaires de l'église Saint-Gildas d'Auray générées par DALL-E 3.

## ✨ Fonctionnalités

- **10 Transformations Prédéfinies** : Bibliothèque, Restaurant, Coworking, Salle de Sport, Centre d'Arts, Marché Bio, Théâtre, Centre Wellness, Hub Innovation, École de Musique
- **Génération Temps Réel** : 3-8 secondes par image
- **Qualité HD** : Images 1024x1024 haute définition
- **Interface Immersive** : Comparaison avant/après, téléchargement, partage
- **Rate Limiting** : 5 générations/minute par utilisateur
- **Coût Optimisé** : $0.08 par génération HD

## 🔧 Configuration Requise

### 1. Installation des Dépendances

```bash
yarn add openai@^4.73.1
```

### 2. Configuration OpenAI API

1. Créez un compte sur [OpenAI Platform](https://platform.openai.com/)
2. Générez une clé API dans [API Keys](https://platform.openai.com/api-keys)
3. Ajoutez la clé dans votre fichier `.env.local` :

```bash
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 3. Vérification Budget OpenAI

**IMPORTANT** : Configurez des limites budgétaires dans [Usage & Billing](https://platform.openai.com/account/billing/limits)

- **Coût par génération HD** : $0.08
- **Budget recommandé** : $20-50/mois pour usage modéré
- **Alertes** : Activez les notifications à 80% du budget

## 📁 Structure des Fichiers Ajoutés

```
src/
├── lib/
│   └── ai-config.ts          # Configuration IA et types
├── app/
│   └── api/
│       └── transform/
│           └── route.ts       # API endpoint génération
├── components/
│   └── ChurchTransformation.tsx # Composant principal
└── app/
    └── page.tsx              # Intégration page d'accueil
```

## 🎨 Types de Transformations

| ID | Nom | Catégorie | Description |
|---|---|---|---|
| `bibliotheque` | Bibliothèque Moderne | Culture | Bibliothèque communautaire avec café |
| `restaurant` | Restaurant Gastronomique | Business | Restaurant étoilé dans cadre exceptionnel |
| `coworking` | Espace de Coworking | Business | Lieu de travail collaboratif inspirant |
| `salle-sport` | Salle de Sport Premium | Sport | Centre fitness dans cadre unique |
| `centre-arts` | Centre d'Arts Créatifs | Art | Ateliers artistes et galerie exposition |
| `marche-bio` | Marché Bio Couvert | Social | Marché producteurs locaux permanent |
| `theatre` | Théâtre Communautaire | Culture | Scène culturelle spectacles vivants |
| `centre-wellness` | Centre de Bien-être | Social | Spa et centre relaxation holistique |
| `startup-hub` | Hub Innovation | Business | Incubateur startups et innovation tech |
| `ecole-musique` | École de Musique | Culture | Conservatoire avec salles répétition |

## 🔒 Sécurité & Limitations

### Rate Limiting Intégré
- **5 requêtes/minute** par IP
- **50 requêtes/jour** par IP (configurable)
- Gestion automatique des erreurs OpenAI

### Prompts Optimisés
- Prompts respectueux du patrimoine
- Validation automatique du contenu
- Gestion erreurs politiques de contenu OpenAI

### Gestion d'Erreurs
- Rate limit exceeded → Message informatif
- Quota dépassé → Notification support
- Violation contenu → Redirection transformation alternative

## 📊 Monitoring & Analytics

### Logs Automatiques
```javascript
console.log(`🎨 Generating: ${transformation.name}`);
console.log(`✅ Generated in ${time}ms - Cost: $${cost}`);
```

### Métriques Clés à Surveiller
- Nombre de générations/jour
- Coût total mensuel
- Temps de génération moyen
- Taux d'erreur par type

## 🚀 Mise en Production

### 1. Variables d'Environnement Vercel

```bash
# Dans votre dashboard Vercel
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 2. Configuration Budgétaire OpenAI

- Limite souple : $20/mois
- Limite ferme : $50/mois  
- Notifications : 80% et 95%

### 3. Monitoring Usage

Vérifiez régulièrement [OpenAI Usage Dashboard](https://platform.openai.com/account/usage)

## 🎯 Intégration dans l'Interface

Le module s'intègre automatiquement dans la page d'accueil entre les sections Hero et Signature Form :

```typescript
{/* NOUVEAU: Module IA de Transformation d'Église */}
<section id="transformation-ia" className="py-16">
  <ChurchTransformation />
</section>
```

## 💡 Optimisations Futures

### Phase 2 Potentielle (si demandée)
- **Cache Redis** : Sauvegarder générations populaires
- **Multiple APIs** : Stable Diffusion + Midjourney
- **Styles Personnalisés** : Permettre prompts utilisateur
- **Galerie Partagée** : Affichage générations communautaires
- **Analytics Avancés** : Tracking transformations préférées

## 🛠️ Dépannage

### Erreur "API Key Not Found"
```bash
# Vérifiez votre .env.local
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Erreur "Rate Limit Exceeded"  
- Normal avec limite 5/minute
- L'utilisateur voit message informatif
- Recommandé : patienter 1 minute

### Erreur "Insufficient Quota"
- Recharger crédit OpenAI
- Vérifier limites budgétaires
- Contact support si nécessaire

## 📞 Support

Pour toute question technique :
1. Vérifiez les logs console navigateur
2. Consultez [OpenAI Status](https://status.openai.com/)
3. Vérifiez usage API dans dashboard OpenAI

---

**🚀 Le Module IA est maintenant prêt à révolutionner l'engagement des visiteurs !**
