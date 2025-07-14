# 🚀 Guide de Déploiement Vercel - Pétition Auray

## ⚡ Déploiement Express (5 minutes)

### **1. Prérequis**
```bash
# Installer Vercel CLI globalement
yarn global add vercel
# ou npm install -g vercel
```

### **2. Configuration Instantanée**
```bash
# Dans le dossier du projet
cd /path/to/petition

# Login Vercel (ouvre le navigateur)
vercel login

# Déploiement automatique
vercel --prod
```

### **3. Variables d'Environnement**
**Après le premier déploiement, configurer dans Vercel Dashboard :**

```bash
# Obligatoires pour Google Sheets
GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----..."
GOOGLE_SHEETS_CLIENT_EMAIL="service-account@project.iam.gserviceaccount.com"
GOOGLE_SHEETS_SHEET_ID="1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"

# URL de l'application (mis à jour après déploiement)
NEXT_PUBLIC_APP_URL="https://auray-petition.vercel.app"
NODE_ENV="production"
```

---

## 🔧 Configuration Avancée

### **Variables d'Environnement Complètes**

| Variable | Type | Description |
|----------|------|-------------|
| `GOOGLE_SHEETS_PRIVATE_KEY` | **Obligatoire** | Clé privée du service account |
| `GOOGLE_SHEETS_CLIENT_EMAIL` | **Obligatoire** | Email du service account |
| `GOOGLE_SHEETS_SHEET_ID` | **Obligatoire** | ID de la Google Sheet |
| `NEXT_PUBLIC_APP_URL` | **Obligatoire** | URL publique de l'app |
| `OPENAI_API_KEY` | Optionnel | Pour futures fonctionnalités IA |
| `NEXT_PUBLIC_GA_ID` | Optionnel | Google Analytics |

### **🌐 Configuration Domaine**

**Option 1: Domaine Vercel** (gratuit)
- Format: `https://auray-petition.vercel.app`
- Configuration automatique

**Option 2: Domaine Personnalisé**
```bash
# Après déploiement, dans Vercel Dashboard:
# 1. Aller dans Settings > Domains
# 2. Ajouter votre domaine
# 3. Configurer les DNS selon les instructions
```

---

## ✅ Tests Post-Déploiement

### **1. Tests Fonctionnels**
- [ ] ✅ Page d'accueil charge correctement
- [ ] ✅ API `/api/signatures` répond
- [ ] ✅ Manifest PWA accessible `/manifest.json`
- [ ] ✅ Service Worker charge `/sw.js`
- [ ] ✅ Icônes PWA visibles

### **2. Tests PWA**
```bash
# Chrome DevTools > Application
# Vérifier : Manifest, Service Workers, Storage
```

### **3. Performance**
```bash
# Lighthouse audit
# Target: Performance 90+, PWA 100
```

---

## 🚨 Troubleshooting

### **Erreurs Communes**

**❌ Build Failed - Google Sheets**
```
Solution: Vérifier les variables d'environnement
GOOGLE_SHEETS_* dans Vercel Dashboard
```

**❌ 500 Error API**
```
Solution: Vérifier les logs Vercel
vercel logs --follow
```

**❌ PWA Non Détectée**
```
Solution: Vérifier manifest.json et service worker
Headers Service-Worker-Allowed configurés
```

---

## 🎯 Commandes Utiles

```bash
# Déploiement preview (branche)
vercel

# Déploiement production
vercel --prod

# Voir les logs en temps réel
vercel logs --follow

# Lister les déploiements
vercel ls

# Environnement variables
vercel env ls
vercel env add VARIABLE_NAME
```

---

## 📊 Monitoring Post-Déploiement

### **Métriques à Surveiller**
- ✅ **Uptime**: 99.9%+ (Vercel monitoring)
- ✅ **Performance**: Core Web Vitals
- ✅ **Erreurs**: Error rate < 1%
- ✅ **PWA**: Installation rate

### **Analytics**
- Vercel Analytics (automatique)
- Google Analytics (si configuré)
- Console logs pour debug

---

**🎉 Félicitations ! Votre pétition est maintenant LIVE !** 🌐

> **Next Steps**: Tester le formulaire, partager le lien, surveiller les premières signatures !
