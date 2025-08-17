# 🎫 SUPPRESSION SYSTÈME COUPONS
## Phase 1.3 - Simplification Formulaire

### Fichiers système coupons à supprimer :
```bash
rm src/lib/coupon-system.ts
rm src/lib/coupon-system-client.ts
rm src/lib/coupon-system-test.js
rm src/lib/coupon-system-test.ts
rm src/lib/coupon-system.test.ts
rm src/lib/coupon-test.mjs
rm src/lib/test-coupon-system.ts
rm src/lib/test-coupon.js
rm src/lib/virtual-credits-system.ts
rm src/lib/sentiment-model.ts
rm src/lib/sentiment-model-client.ts
rm test-coupon-system.html
rm test-coupon-system.js
```

### Pages liées aux coupons :
```bash
rm -rf src/app/test-coupons/
```

### Raison de la suppression :
- **Complexité inutile** : Pétition simple ne nécessite pas de système d'engagement gamifié
- **Focus local** : Les résidents d'Auray n'ont pas besoin de "coupons" pour signer
- **Simplicité UX** : Formulaire direct plus efficace pour une pétition locale
- **Maintenance** : Moins de code = moins de bugs potentiels

### Impact :
- ✅ **Formulaire simplifié** : Signature directe sans barrières
- ✅ **Code plus léger** : -50KB de JavaScript
- ✅ **UX optimisée** : Moins d'étapes pour signer
- ✅ **Maintenance réduite** : Focus sur l'essentiel
