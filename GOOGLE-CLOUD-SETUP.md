# 🌩️ Configuration Google Cloud Storage

Guide complet pour configurer le stockage des images générées par IA.

## 📋 Prérequis

- Compte Google Cloud Platform
- Projet GCP créé
- Facturation activée (nécessaire même pour l'usage gratuit)

## 🚀 Étapes de Configuration

### 1. **Créer un Projet GCP**

```bash
# Via Console Web
https://console.cloud.google.com/projectcreate

# Ou via CLI
gcloud projects create auray-petition-ai --name="Auray Petition AI"
```

### 2. **Activer les APIs Nécessaires**

```bash
# Cloud Storage API
gcloud services enable storage-component.googleapis.com

# Service Account API  
gcloud services enable iam.googleapis.com
```

### 3. **Créer un Service Account**

```bash
# Créer le service account
gcloud iam service-accounts create auray-ai-storage \
  --display-name="Auray AI Storage Service"

# Obtenir l'email du service account
gcloud iam service-accounts list
```

### 4. **Créer et Télécharger la Clé**

```bash
# Générer la clé JSON
gcloud iam service-accounts keys create ~/auray-ai-key.json \
  --iam-account=auray-ai-storage@sacred-pipe-465915-j9.iam.gserviceaccount.com
# La clé sera sauvée dans ~/auray-ai-key.json
```

### 5. **Créer le Bucket de Stockage**

```bash
# Créer le bucket (nom doit être unique globalement)
gsutil mb -p sacred-pipe-465915-j9 -c STANDARD -l europe-west1 gs://auray-church-transformations

# Configurer les permissions publiques
gsutil iam ch allUsers:objectViewer gs://auray-church-transformations
```

### 6. **Attribuer les Permissions**

```bash
# Donner accès au service account
gsutil iam ch serviceAccount:auray-ai-storage@sacred-pipe-465915-j9.iam.gserviceaccount.com:objectAdmin gs://auray-church-transformations
```

## 🔧 Configuration Variables d'Environnement

Ajoutez dans votre `.env.local` :

```bash
# Informations du projet
GOOGLE_CLOUD_PROJECT_ID=sacred-pipe-465915-j9

# Informations du service account (depuis le fichier JSON)
GOOGLE_CLOUD_CLIENT_EMAIL=auray-ai-storage@sacred-pipe-465915-j9.iam.gserviceaccount.com
GOOGLE_CLOUD_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nVotre_Clé_Privée_Ici\n-----END PRIVATE KEY-----"

# Nom du bucket
GOOGLE_CLOUD_BUCKET_NAME=auray-church-transformations
```

## 💰 Estimation des Coûts

### **Stockage Standard (Europe)**
- **Stockage** : €0.020/GB/mois
- **Transfert sortant** : €0.12/GB
- **Opérations** : €0.05/10,000 requêtes

### **Exemple Concret**
```
📊 Scénario : 100 images/mois, 1MB chaque
💾 Stockage : 100MB = €0.002/mois
🌐 Transfert : 100MB × 10 vues = €0.12/mois
🔄 Opérations : 1000 requêtes = €0.005/mois
💰 TOTAL : ~€0.13/mois
```

## 🧪 Test de Configuration

Créez un script de test :

```javascript
// test-gcs.js
const { Storage } = require('@google-cloud/storage');

const storage = new Storage({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  credentials: {
    client_email: process.env.GOOGLE_CLOUD_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_CLOUD_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
});

async function testGCS() {
  try {
    const bucket = storage.bucket(process.env.GOOGLE_CLOUD_BUCKET_NAME);
    const [exists] = await bucket.exists();
    console.log(`✅ Bucket exists: ${exists}`);
    
    // Test upload
    const file = bucket.file('test.txt');
    await file.save('Hello from Auray AI!');
    console.log('✅ Upload successful');
    
    // Test public URL
    const publicUrl = `https://storage.googleapis.com/${process.env.GOOGLE_CLOUD_BUCKET_NAME}/test.txt`;
    console.log(`🌐 Public URL: ${publicUrl}`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testGCS();
```

```bash
# Exécuter le test
node test-gcs.js
```

## 🔒 Sécurité et Bonnes Pratiques

### **Permissions Minimales**
- Service account avec accès **Storage Object Admin** uniquement
- Bucket avec accès public en **lecture seule**
- Clés privées stockées dans variables d'environnement

### **Monitoring**
```bash
# Surveiller l'usage
gcloud logging read "resource.type=gcs_bucket" --limit=50

# Alertes de coût
gcloud alpha billing budgets create --billing-account=BILLING_ACCOUNT_ID \
  --display-name="Auray AI Storage Budget" \
  --budget-amount=10EUR
```

## 🚀 Déploiement Production

### **Vercel**
```bash
# Ajouter les variables d'environnement
vercel env add GOOGLE_CLOUD_PROJECT_ID
vercel env add GOOGLE_CLOUD_CLIENT_EMAIL  
vercel env add GOOGLE_CLOUD_PRIVATE_KEY
vercel env add GOOGLE_CLOUD_BUCKET_NAME
```

### **Autres Plateformes**
- Netlify : Variables d'environnement dans les paramètres du site
- Railway : Variables dans le dashboard du projet
- Heroku : `heroku config:set VARIABLE=value`

## 📊 Monitoring et Optimisation

### **Métriques Importantes**
- Nombre d'objets stockés
- Bande passante utilisée  
- Coût mensuel
- Temps de réponse

### **Optimisations**
- Cache CDN automatique de Google
- Compression des images
- Nettoyage automatique des anciennes images
- Lifecycle policies pour archivage

---

**🎯 Résultat** : Stockage ultra-économique (€0.13/mois) avec performance mondiale et fiabilité 99.9% !
