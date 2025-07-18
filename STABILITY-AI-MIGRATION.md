# 🎨 Migration vers Stability AI - Guide Complet

> **Migration DALL-E 3 → Stability AI img2img pour vraies transformations photo-réalistes**

## 🎯 Objectif de la Migration

- **AVANT** : DALL-E 3 génère des images basées sur du texte uniquement (pas de transformation réelle)
- **APRÈS** : Stability AI img2img utilise la vraie photo de l'église comme base pour les transformations

## ✅ Avantages de Stability AI

- ✅ **Vraie transformation** : utilise la photo actuelle de l'église comme base
- ✅ **Coût réduit** : $0.04/génération vs $0.08 DALL-E 3
- ✅ **Qualité supérieure** : transformations plus réalistes et cohérentes
- ✅ **Contrôle précis** : paramètres de transformation ajustables (force, style, etc.)

---

## 🔧 Configuration Stability AI

### 1. **Créer un Compte Stability AI**

1. Aller sur [platform.stability.ai](https://platform.stability.ai/)
2. Créer un compte et vérifier l'email
3. Aller dans [API Keys](https://platform.stability.ai/account/keys)
4. Créer une nouvelle clé API
5. Copier la clé (format: `sk-...`)

### 2. **Configurer les Variables d'Environnement**

Ajouter dans votre `.env.local` :

```bash
# Stability AI API Key (remplace OpenAI)
STABILITY_API_KEY=sk-votre-cle-stability-ai-ici

# Optionnel: garder OpenAI pour d'autres usages
# OPENAI_API_KEY=sk-votre-ancienne-cle-openai
```

### 3. **Installation des Dépendances**

```bash
# Installer le SDK Stability AI
yarn add stability-sdk

# Optionnel: supprimer OpenAI si plus utilisé
# yarn remove openai
```

---

## ⚙️ Paramètres de Configuration

### **Paramètres img2img Optimisés**

```typescript
GENERATION: {
  steps: 30,              // Qualité (20-50, plus = mieux)
  cfg_scale: 7,          // Adherence au prompt (1-35)
  image_strength: 0.65,   // Force transformation (0.1-1.0)
  style_preset: 'photographic',
  sampler: 'K_DPM_2_ANCESTRAL',
  width: 1024,
  height: 1024,
}
```

### **Ajustements selon le Type**

- **Transformations subtiles** (café, bibliothèque) : `image_strength: 0.5-0.7`
- **Transformations importantes** (gym, lab) : `image_strength: 0.7-0.9`
- **Prompts architecturaux** : `cfg_scale: 8-12`
- **Prompts artistiques** : `cfg_scale: 5-8`

---

## 🖼️ Gestion de l'Image de Base

### **Image Source**
- **Fichier** : `public/images/Saint-Gildas-Auray-768x576.webp`
- **Format** : WebP, JPEG, ou PNG acceptés
- **Taille recommandée** : 512x512 à 1024x1024
- **Ratio** : Carré ou 4:3 idéal

### **Optimisation de l'Image**
```bash
# Si besoin de redimensionner/convertir
ffmpeg -i Saint-Gildas-Auray-768x576.webp -vf scale=1024:1024 -q:v 2 church-base-1024.jpg
```

---

## 💰 Coûts et Pricing

### **Stability AI Pricing**
- **SDXL 1024x1024** : $0.04/génération
- **Pas de surcoût HD** (vs DALL-E 3: $0.08)
- **Budget recommandé** : $5-10/mois pour tests

### **Comparaison DALL-E 3**
| Service | Coût/image | Qualité img2img | Vitesse |
|---------|------------|----------------|---------|
| DALL-E 3 | $0.08 | ❌ (texte only) | ~8s |
| Stability AI | $0.04 | ✅ (vraie img2img) | ~6s |

---

## 🧪 Tests et Validation

### **1. Test de Base**
```bash
# Lancer le serveur
yarn dev

# Tester une transformation simple
curl -X POST http://localhost:3000/api/transform \
  -H "Content-Type: application/json" \
  -d '{"transformationType": "library"}'
```

### **2. Vérification du Résultat**
- ✅ L'image générée ressemble à l'église originale transformée
- ✅ Architecture et détails préservés
- ✅ Transformation réaliste et cohérente
- ✅ Upload GCS réussi

### **3. Tests Recommandés**
- **library** : transformation subtile
- **restaurant** : transformation modérée  
- **innovation_lab** : transformation importante

---

## 🔧 Dépannage

### **Erreur : "STABILITY_API_KEY not found"**
```bash
# Vérifier le fichier .env.local
cat .env.local | grep STABILITY

# S'assurer que la clé commence par sk-
echo $STABILITY_API_KEY
```

### **Erreur : "Failed to load base church image"**
```bash
# Vérifier que l'image existe
ls -la public/images/Saint-Gildas-Auray-768x576.webp

# Vérifier les permissions
chmod 644 public/images/Saint-Gildas-Auray-768x576.webp
```

### **Erreur API Stability AI**
- **401 Unauthorized** : Clé API invalide ou expirée
- **429 Rate Limit** : Trop de requêtes, attendre
- **500 Server Error** : Problème Stability AI, réessayer

---

## 📊 Monitoring et Métriques

### **Logs à Surveiller**
```bash
# Succès de génération
🎨 Starting img2img transformation: library
📸 Base image loaded: 45234 bytes
📝 Prompt: Transform this interior...
🎨 Image generated successfully
☁️ Image uploaded to GCS: library-hash123.png

# Métriques importantes
- Temps de génération : 3-8 secondes
- Taille image base : ~40-50KB
- Coût par génération : $0.04
```

### **Dashboard Stability AI**
- Surveiller l'usage API sur [platform.stability.ai](https://platform.stability.ai/account/usage)
- Configurer des alertes de budget si nécessaire

---

## 🚀 Déploiement Production

### **Variables d'Environnement Vercel**
```bash
# Dans le dashboard Vercel, ajouter :
STABILITY_API_KEY=sk-votre-cle-production

# Garder les variables GCS existantes
GOOGLE_CLOUD_PROJECT_ID=...
GOOGLE_CLOUD_CLIENT_EMAIL=...
GOOGLE_CLOUD_PRIVATE_KEY=...
GOOGLE_CLOUD_BUCKET_NAME=...
```

### **Test Post-Déploiement**
```bash
# Tester l'API en production
curl -X POST https://votre-site.vercel.app/api/transform \
  -H "Content-Type: application/json" \
  -d '{"transformationType": "cafe"}'
```

---

## 🔄 Rollback (si nécessaire)

Si des problèmes surviennent, voici comment revenir à DALL-E 3 :

1. **Restaurer l'ancien code** depuis le commit précédent
2. **Remettre OPENAI_API_KEY** dans les variables d'environnement
3. **Supprimer STABILITY_API_KEY**
4. **Redéployer**

---

## 🎉 Résultat Final

Après cette migration, votre module IA :

- ✅ **Utilise la vraie photo** de l'église Saint-Gildas comme base
- ✅ **Génère des transformations réalistes** et cohérentes
- ✅ **Coûte 2x moins cher** que DALL-E 3
- ✅ **Offre une expérience utilisateur** authentique et immersive
- ✅ **Maintient la cache GCS** pour optimiser les coûts

**Les visiteurs verront maintenant de vraies transformations de LEUR église, pas des interprétations génériques !** 🏛️✨
