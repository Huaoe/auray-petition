# Guide de Test du Système de Parrainage

## Vue d'ensemble
Ce guide détaille comment tester le système de parrainage complet implémenté dans l'application de pétition.

## Architecture du Système

### Composants Principaux
- **Génération de codes**: `generateReferralCode()` dans `src/lib/coupon-system.ts`
- **Validation**: `validateReferralCode()` avec vérifications d'expiration et auto-parrainage
- **Tracking**: Intégration Google Sheets avec colonne de parrainage
- **Bonus**: Attribution automatique de +1 génération IA au parrain
- **Analytics**: Suivi complet des événements de parrainage

### Endpoints API
- `GET /api/referrals` - Statistiques et génération de codes
- `POST /api/referrals` - Validation et opérations de parrainage
- `POST /api/signatures` - Signature avec support de parrainage

## Tests End-to-End

### 1. Test de Génération de Code
**Objectif**: Vérifier la génération unique de codes de parrainage

**Étapes**:
1. Aller sur `/referrals`
2. Entrer un email (ex: `test@example.com`)
3. Vérifier qu'un code 6 caractères est généré
4. Vérifier que le même email génère toujours le même code

**Résultat attendu**: Code format `ABC123` généré de manière déterministe

### 2. Test de Validation de Code
**Objectif**: Vérifier la validation des codes avec toutes les règles

**Étapes**:
1. Générer un code pour `parrain@test.com`
2. Tenter de valider avec le même email → Doit échouer (auto-parrainage)
3. Valider avec un autre email → Doit réussir
4. Tenter avec un code inexistant → Doit échouer

**Résultat attendu**: Validation correcte selon les règles métier

### 3. Test de Signature avec Parrainage
**Objectif**: Tester le flow complet de signature avec code de parrainage

**Étapes**:
1. Générer un code pour `parrain@test.com`
2. Aller sur la page principale `/`
3. Remplir le formulaire de signature avec un autre email
4. Entrer le code de parrainage dans le champ dédié
5. Soumettre la signature

**Résultat attendu**: 
- Signature enregistrée avec code de parrainage
- Bonus +1 génération attribué au parrain
- Analytics trackés correctement

### 4. Test des Bonus de Parrainage
**Objectif**: Vérifier l'attribution des bonus

**Étapes**:
1. Vérifier les générations du parrain avant signature
2. Effectuer une signature avec son code
3. Vérifier l'augmentation des générations (+1)
4. Vérifier les statistiques de parrainage mises à jour

**Résultat attendu**: Bonus correctement attribué et persisté

### 5. Test du Dashboard de Parrainage
**Objectif**: Vérifier l'affichage des statistiques

**Étapes**:
1. Accéder au dashboard `/referrals`
2. Vérifier l'affichage des métriques:
   - Total parrainages
   - Parrainages réussis
   - Bonus gagnés
   - Taux de conversion
3. Tester les boutons de partage social

**Résultat attendu**: Statistiques correctes et fonctionnalités de partage opérationnelles

### 6. Test des Analytics
**Objectif**: Vérifier le tracking des événements

**Étapes**:
1. Ouvrir les outils de développement (Console)
2. Effectuer les actions de parrainage
3. Vérifier les événements analytics dans la console:
   - `referral_code_generated`
   - `referral_code_validated`
   - `referral_code_used`
   - `referral_bonus_awarded`
   - `referral_conversion`

**Résultat attendu**: Tous les événements trackés correctement

### 7. Test de Partage Social
**Objectif**: Vérifier les fonctionnalités de partage

**Étapes**:
1. Dans le dashboard, tester chaque bouton de partage:
   - Email
   - WhatsApp
   - Facebook
   - Twitter
2. Vérifier que les URLs contiennent le code de parrainage
3. Vérifier le tracking des partages

**Résultat attendu**: URLs correctement formatées avec code de parrainage

### 8. Test de Persistance Google Sheets
**Objectif**: Vérifier l'enregistrement dans Google Sheets

**Étapes**:
1. Effectuer une signature avec code de parrainage
2. Vérifier dans Google Sheets que:
   - La signature est enregistrée
   - Le code de parrainage est dans la colonne I
   - Les données sont complètes

**Résultat attendu**: Données correctement persistées

## Cas d'Erreur à Tester

### 1. Code Invalide
- Code inexistant
- Code expiré (après 90 jours)
- Format incorrect

### 2. Auto-parrainage
- Utiliser son propre code de parrainage
- Vérifier le message d'erreur approprié

### 3. Limites de Bonus
- Tester la limite de 10 bonus par parrain
- Vérifier le comportement après la limite

### 4. Validation d'Email
- Format d'email invalide
- Email vide

## Métriques de Performance

### Temps de Réponse
- Génération de code: < 100ms
- Validation de code: < 200ms
- Signature avec parrainage: < 1s

### Taux de Succès
- Génération: 100%
- Validation (codes valides): 100%
- Attribution de bonus: 100%

## Debugging

### Logs à Surveiller
```javascript
// Console logs pour debugging
console.log('Code de parrainage généré:', code);
console.log('Validation résultat:', validation);
console.log('Bonus attribué à:', referrerEmail);
```

### Vérifications localStorage
```javascript
// Vérifier les données stockées
console.log('Referrals:', localStorage.getItem('petition_referrals'));
console.log('Coupons:', localStorage.getItem('petition_coupons'));
```

## Checklist de Test Complet

- [ ] Génération de code unique
- [ ] Validation avec toutes les règles
- [ ] Signature avec code de parrainage
- [ ] Attribution de bonus
- [ ] Persistance Google Sheets
- [ ] Dashboard fonctionnel
- [ ] Analytics trackés
- [ ] Partage social opérationnel
- [ ] Gestion des erreurs
- [ ] Performance acceptable

## Environnement de Test

### URLs de Test
- Page principale: `http://localhost:3000/`
- Dashboard parrainage: `http://localhost:3000/referrals`
- API referrals: `http://localhost:3000/api/referrals`
- API signatures: `http://localhost:3000/api/signatures`

### Données de Test
```javascript
// Emails de test
const testEmails = [
  'parrain@test.com',
  'filleul@test.com',
  'user1@example.com',
  'user2@example.com'
];
```

## Résolution de Problèmes

### Problèmes Courants
1. **Code non généré**: Vérifier localStorage et fonction de génération
2. **Validation échoue**: Vérifier format et règles de validation
3. **Bonus non attribué**: Vérifier fonction `awardReferralBonus`
4. **Analytics manquants**: Vérifier configuration GA et événements

### Support
Pour tout problème, vérifier:
1. Console du navigateur pour erreurs JavaScript
2. Network tab pour erreurs API
3. localStorage pour données persistées
4. Google Sheets pour vérification backend