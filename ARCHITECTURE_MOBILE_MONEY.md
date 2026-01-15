# Architecture Complète - Fonctionnalité de Paiement Mobile Money

## Vue d'ensemble

Cette documentation décrit l'architecture complète de la fonctionnalité de paiement par Mobile Money (MTN Money et Moov Money) intégrée dans la plateforme KEMET de gestion des réseaux de recharge électrique.

## 🎯 Objectif Fonctionnel

Permettre aux utilisateurs de la plateforme d'acheter des kW d'énergie électrique via Mobile Money avec :
- Sélection du nombre de kW
- Calcul automatique du montant (500 FCFA/kW)
- Choix entre MTN Money et Moov Money
- Paiement sécurisé avec confirmation temps réel
- Crédit automatique du compte utilisateur

## 🏗️ Architecture Générale

### Architecture 3-tiers

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   Base de       │
│   (React)       │◄──►│   (Node.js)     │◄──►│   données       │
│                 │    │                 │    │   (MongoDB)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Mobile Money  │    │   Agrégateur    │    │   Services      │
│   Provider      │◄──►│   (Flutterwave) │◄──►│   externes      │
│   (MTN/Moov)    │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🖥️ Architecture Frontend

### Composant Principal : `MobileMoneyPayment`

**Localisation :** `src/app/components/payment/MobileMoneyPayment.tsx`

#### Fonctionnalités UI :
- Affichage du solde actuel en kW
- Sélecteur de quantité kW (boutons prédéfinis + champ personnalisé)
- Calcul automatique du montant total
- Sélecteur de méthode de paiement (MTN/Moov)
- Champ numéro de téléphone
- États de paiement (en cours, réussi, échoué)
- Historique des transactions

#### États gérés :
```typescript
interface PaymentState {
  kwAmount: number;
  selectedProvider: 'mtn' | 'moov';
  phoneNumber: string;
  paymentStatus: 'idle' | 'processing' | 'success' | 'failed';
  currentTransaction: PaymentTransaction | null;
  paymentHistory: PaymentTransaction[];
}
```

#### Logique métier :
- **Calcul automatique :** `totalAmount = kwAmount × 500`
- **Validation :** Numéro de téléphone, montant minimum
- **Polling :** Vérification du statut toutes les 3 secondes
- **Gestion d'erreurs :** Messages utilisateur clairs

### Intégration dans le Dashboard

**Localisation :** `src/app/components/dashboard/DashboardMain.tsx`

- Ajout d'un onglet "Paiement" dans la navigation
- Gestion de l'état du solde utilisateur
- Mise à jour automatique du solde après paiement réussi

## 🔧 Architecture Backend

### Technologies
- **Framework :** Express.js
- **Base de données :** MongoDB avec Mongoose
- **Authentification :** JWT
- **Sécurité :** bcrypt, helmet, rate limiting
- **Validation :** express-validator

### Modèles de données

#### Utilisateur (User)
```javascript
{
  name: String,
  email: String,
  password: String, // hashed
  role: 'client' | 'administrateur',
  kwBalance: Number, // Solde en kW
  phoneNumber: String,
  isActive: Boolean,
  lastLogin: Date
}
```

#### Transaction
```javascript
{
  transactionId: String, // Unique TXN-timestamp-random
  userId: ObjectId,
  paymentMethod: 'mtn_mobile_money' | 'moov_money',
  kwAmount: Number,
  amount: Number, // FCFA
  status: 'pending' | 'processing' | 'completed' | 'failed',
  phoneNumber: String,
  gatewayTransactionId: String, // ID Flutterwave
  gatewayResponse: Object, // Réponse complète du gateway
  processedAt: Date
}
```

### Service Mobile Money

**Localisation :** `backend/services/mobileMoneyService.js`

#### Méthodes principales :
- `initiatePayment()` : Initie le paiement via l'agrégateur
- `checkPaymentStatus()` : Vérifie le statut d'une transaction
- `handleWebhook()` : Traite les webhooks de confirmation
- `creditUserAccount()` : Crédite le compte utilisateur
- `getUserTransactions()` : Récupère l'historique

#### Détection du réseau :
```javascript
detectNetwork(phoneNumber) {
  if (phoneNumber.startsWith('01')) return 'mtn';
  if (phoneNumber.startsWith('02') || phoneNumber.startsWith('05')) return 'moov';
  return null;
}
```

### API Endpoints

#### Paiements
- `POST /api/payments/initiate` - Initier un paiement
- `GET /api/payments/status/:transactionId` - Statut d'un paiement
- `GET /api/payments/history` - Historique utilisateur
- `POST /api/payments/webhook` - Webhook de confirmation
- `GET /api/payments/calculate` - Calcul du montant

#### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/auth/me` - Profil utilisateur

## 🔐 Sécurité

### Mesures implémentées :
- **Authentification JWT** avec expiration 24h
- **Hashage des mots de passe** avec bcrypt (salt rounds: 10)
- **Validation des entrées** avec express-validator
- **Rate limiting** (100 requêtes/15min par IP)
- **Protection CORS** configurée
- **Helmet** pour les headers de sécurité
- **Vérification des webhooks** (signature HMAC)

### Prévention des fraudes :
- **Anti-doublons :** Vérification des transactions en cours
- **Validation des numéros :** Format Bénin (01 pour MTN, 02/05 pour Moov)
- **Limites de montant :** 1-1000 kW par transaction
- **Timeout des sessions :** Invalidation automatique des tokens

## 💰 Intégration Mobile Money

### Agrégateur utilisé : Flutterwave

**Avantages pour l'Afrique :**
- ✅ Support natif MTN Money et Moov Money
- ✅ Couverture Afrique de l'Ouest et Centrale
- ✅ API stable et documentée
- ✅ Webhooks sécurisés
- ✅ Dashboard de monitoring

### Flux de paiement :

```
1. Utilisateur saisit les détails
2. Frontend → Backend: POST /api/payments/initiate
3. Backend → Flutterwave: Initiation paiement
4. Flutterwave → Mobile Money Provider
5. Utilisateur confirme sur son téléphone
6. Provider → Flutterwave → Webhook
7. Backend traite le webhook
8. Crédit du compte utilisateur
9. Frontend affiche confirmation
```

### Gestion des statuts :
- `pending` : Paiement initié
- `processing` : En cours de traitement
- `completed` : Réussi, compte crédité
- `failed` : Échec, pas de crédit

## 🌍 Adaptations Afrique

### Contraintes prises en compte :
- **Couverture réseau inégale :** Polling + webhooks
- **Déconnexions fréquentes :** Persistance des transactions
- **Numéros locaux :** Validation format Bénin
- **Monnaie :** FCFA (XOF) uniquement
- **Langue :** Interface en français

### Optimisations :
- **Calcul côté client :** Réduction des appels API
- **Cache local :** Historique en localStorage
- **Messages d'erreur :** Adaptés au contexte africain
- **Formats téléphoniques :** Support des indicatifs locaux

## 📊 Base de données

### Schéma MongoDB :

```javascript
// Collection: users
{
  _id: ObjectId,
  name: "John Doe",
  email: "john@example.com",
  password: "$2a$10$...", // hashed
  role: "client",
  kwBalance: 150, // kW
  phoneNumber: "22901234567",
  createdAt: ISODate("2024-01-15T10:00:00Z")
}

// Collection: transactions
{
  _id: ObjectId,
  transactionId: "TXN-1705312800000-abc123",
  userId: ObjectId("..."),
  paymentMethod: "mtn_mobile_money",
  kwAmount: 10,
  amount: 5000, // FCFA
  status: "completed",
  phoneNumber: "22901234567",
  gatewayTransactionId: "FLW-123456",
  processedAt: ISODate("2024-01-15T10:05:00Z")
}
```

### Index pour performance :
- `{ userId: 1, createdAt: -1 }` sur transactions
- `{ transactionId: 1 }` unique
- `{ status: 1 }` pour filtrage

## 🚀 Déploiement

### Variables d'environnement :
```env
NODE_ENV=production
MONGODB_URI=mongodb://prod-server/kemet_platform
JWT_SECRET=your-production-secret
FLUTTERWAVE_PUBLIC_KEY=FLWPUBK-...
FLUTTERWAVE_SECRET_KEY=FLWSECK-...
FRONTEND_URL=https://kemet-platform.com
```

### Recommandations production :
- **Reverse proxy :** Nginx en frontal
- **SSL/TLS :** Certificats Let's Encrypt
- **Monitoring :** Logs, métriques, alertes
- **Backup :** Base de données quotidienne
- **Scaling :** Load balancer si nécessaire

## 🧪 Tests et Validation

### Tests à implémenter :
- **Unitaires :** Services, modèles, utilitaires
- **Intégration :** API endpoints, flux complets
- **E2E :** Parcours utilisateur complet
- **Sécurité :** Injection, auth bypass, rate limiting

### Données de test :
- Numéros MTN : 22901XXXXXX
- Numéros Moov : 22902XXXXXX ou 22905XXXXXX
- Montants : 500, 2500, 5000 FCFA

## 📈 Monitoring et Maintenance

### Métriques à suivre :
- Taux de succès des paiements
- Temps moyen de traitement
- Erreurs par type
- Utilisation par méthode de paiement
- Évolution des soldes utilisateurs

### Logs importants :
- Initiations de paiement
- Confirmations de paiement
- Échecs et erreurs
- Activités suspectes

## 🔄 Évolutions Futures

### Améliorations possibles :
- **Multi-devises :** Support CFA autres pays
- **Autres providers :** Orange Money, Airtel Money
- **Paiement récurrent :** Abonnements mensuels
- **Notifications :** SMS/email de confirmation
- **Analytics :** Tableaux de bord détaillés
- **Mobile App :** Application mobile native

### Intégrations :
- **CRM :** Synchronisation clients
- **ERP :** Gestion des stocks d'énergie
- **Marketing :** Campagnes promotionnelles
- **Support :** Chat en ligne

---

## 📋 Checklist Déploiement

- [ ] Configuration variables d'environnement
- [ ] Installation dépendances backend
- [ ] Connexion base de données
- [ ] Configuration Flutterwave
- [ ] Tests API endpoints
- [ ] Build frontend
- [ ] Configuration nginx/SSL
- [ ] Tests end-to-end
- [ ] Monitoring configuré
- [ ] Documentation utilisateur

Cette architecture fournit une solution robuste, sécurisée et adaptée au contexte africain pour les paiements Mobile Money dans la plateforme KEMET.