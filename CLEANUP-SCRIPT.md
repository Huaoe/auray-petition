# 🧹 SCRIPT DE NETTOYAGE - PHASE 1.1
## Suppression Module IA

### Fichiers à supprimer :

#### Composants IA
```bash
rm src/components/ChurchTransformation.tsx
rm src/components/StabilityBalance.tsx
rm src/components/TransformationGallery.tsx
rm src/components/VirtualCreditsDisplay.tsx
rm -rf src/components/transformation/
```

#### Configuration IA
```bash
rm src/lib/ai-config.ts
rm src/lib/inpaint-config.ts
rm src/lib/storage.ts
rm src/lib/stability-balance.ts
rm src/lib/transformation-utils.ts
rm src/lib/church-transformation-types.ts
rm src/lib/unsplash-service.ts
```

#### APIs IA
```bash
rm -rf src/app/api/transform/
rm -rf src/app/api/inpaint/
rm -rf src/app/api/stability/
rm -rf src/app/api/debug-stability/
rm -rf src/app/api/test-stability/
rm -rf src/app/api/transformation/
rm -rf src/app/api/transformations/
rm -rf src/app/api/unsplash/
rm -rf src/app/api/download/
```

#### Pages IA
```bash
rm -rf src/app/transformation/
rm -rf src/app/transformations/
rm -rf src/app/utopie/
rm -rf src/app/gallery/
```

#### Images IA
```bash
rm -rf public/images/inpaint/
```

#### Documentation IA
```bash
rm GOOGLE-CLOUD-SETUP.md
rm STABILITY-AI-MIGRATION.md
rm STABILITY-API-TROUBLESHOOTING.md
rm UNSPLASH_API_INTEGRATION.md
rm IA-FEATURE-PLANNING.md
rm PLANNING_UTOPIE.md
```

### Dépendances à supprimer du package.json :
- `openai`
- `@google-cloud/storage`
- `sharp`

### Variables d'environnement à retirer :
- `OPENAI_API_KEY`
- `STABILITY_API_KEY`
- `GOOGLE_CLOUD_*`
- `UNSPLASH_ACCESS_KEY`
