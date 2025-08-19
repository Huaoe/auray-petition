# 🎨 Icônes PWA - Pétition Auray

## 📱 Icônes Requises

Pour que la PWA fonctionne parfaitement, créez ces icônes à partir d'un logo principal :

### **🔧 Icônes Standard PWA**
```
icon-72x72.png     - Icône de base Android
icon-96x96.png     - Icône medium Android 
icon-128x128.png   - Icône large Android
icon-144x144.png   - Icône Windows tiles
icon-152x152.png   - Icône iPad
icon-192x192.png   - Icône Android principal
icon-384x384.png   - Icône Android large  
icon-512x512.png   - Icône Android splash
```

### **🍎 Icônes Apple**
```
apple-touch-icon.png (180x180)  - Icône iOS
apple-splash-*.png              - Écrans de démarrage iOS
```

### **🎯 Icônes Shortcuts**
```
shortcut-sign.png (96x96)   - Raccourci "Signer"
shortcut-stats.png (96x96)  - Raccourci "Stats"
```

### **📊 Images Sociales**  
```
og-image.png (1200x630)     - Image Open Graph
```

## 🛠️ **Outils Recommandés**

### **Option 1: PWA Asset Generator (Automatique)**
```bash
yarn global add pwa-asset-generator
pwa-asset-generator logo.png icons/ 
```

### **Option 2: Figma/Canva (Manuel)**
- Créer un logo carré 1024x1024
- Exporter aux tailles requises
- Background: `#1e40af` (bleu Auray)

### **Option 3: IA Générée**
```javascript
// Prompt DALL-E 3 :
"Logo moderne minimaliste pour pétition citoyenne Auray, 
église bretonne stylisée, bleu #003b46, design plat, 
fond transparent, format carré"
```

## 🎨 **Design Guidelines**

### **Couleurs Auray**
- **Primaire**: `#003b46` (Bleu gouvernance)
- **Secondaire**: `#ffffff` (Blanc pureté)  
- **Accent**: `#f59e0b` (Or tradition)

### **Éléments Symboliques**
- 🏛️ Église Saint-Gildas stylisée
- 🔔 Cloche minimaliste  
- ⚖️ Balance équilibre
- 🌊 Vagues bretonnes
- 📜 Parchemin pétition

### **Style**
- Design flat/minimaliste
- Contraste élevé pour lisibilité
- Responsive aux différentes tailles
- Cohérent avec l'identité Shadcn/ui

## ⚡ **Quick Start**

Pour commencer rapidement, créez au minimum :
1. `icon-192x192.png` - Icône principale
2. `icon-512x512.png` - Icône splash  
3. `apple-touch-icon.png` - Support iOS
4. `og-image.png` - Partage social

Les autres icônes peuvent être générées automatiquement ou ajoutées progressivement.

## 🚀 **Test PWA**

Une fois les icônes en place :
1. `yarn build && yarn start`
2. Ouvrir Chrome DevTools > Application > Manifest
3. Vérifier que toutes les icônes se chargent
4. Tester l'installation PWA sur mobile

**🎯 Objectif**: Une PWA parfaitement installable qui inspire confiance et professionnalisme !
