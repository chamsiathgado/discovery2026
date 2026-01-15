# Implémentation RBAC - Gestion des Rôles et Permissions

## Vue d'ensemble

Ce document décrit l'implémentation complète du contrôle d'accès basé sur les rôles (RBAC) dans la plateforme KEMET, permettant une séparation claire entre les utilisateurs **CLIENT** et **ADMINISTRATEUR**.

## 🎯 Objectifs Fonctionnels

### Sélection du Rôle à la Connexion
- Interface de connexion avec choix explicite **Client** ou **Administrateur**
- Redirection automatique vers l'interface appropriée
- Stockage sécurisé du rôle dans le token JWT

### Permissions par Rôle

#### 👤 **RÔLE : CLIENT**
**Accès autorisé :**
- ✅ Carte interactive du réseau
- ✅ Planification d'itinéraire intelligent
- ✅ Fonctionnalité de paiement Mobile Money
- ✅ Consultation de son propre solde kW
- ✅ Historique de ses propres transactions

**Accès interdit :**
- ❌ Voir les autres utilisateurs
- ❌ Voir les transactions globales
- ❌ Accéder aux outils d'administration
- ❌ Modifier les données système

#### 🛠️ **RÔLE : ADMINISTRATEUR**
**Accès complet :**
- ✅ Toutes les fonctionnalités client
- ✅ Gestion complète des utilisateurs
- ✅ Visualisation de toutes les transactions
- ✅ Ajustement des soldes kW des clients
- ✅ Statistiques globales de la plateforme
- ✅ Administration des stations de recharge

## 🔐 Architecture de Sécurité

### Middleware RBAC

#### Types de Middleware
```javascript
// Vérification d'authentification
auth(req, res, next)

// Vérification de rôle spécifique
requireRole('administrateur') // ou 'client'
requireAdmin()                // alias pour administrateur
requireClient()               // alias pour client

// Vérification de propriété
requireOwnership()            // utilisateurs peuvent voir/modifier leurs données
```

#### Hiérarchie des Permissions
```
Authentification → Autorisation → Propriété
     ↓               ↓            ↓
   JWT Token    →  Rôle Check  → Own Data Only
```

### Structure des Tokens JWT
```javascript
{
  user: {
    id: "user_id",
    email: "user@example.com",
    role: "client" | "administrateur",
    name: "User Name"
  },
  iat: timestamp,
  exp: timestamp + 24h
}
```

## 🖥️ Interface Utilisateur

### Écran de Connexion
- **Sélection visuelle** : Boutons "Client" et "Administrateur" avec icônes
- **Validation** : Placeholder dynamique selon le rôle sélectionné
- **Feedback** : Confirmation visuelle du rôle choisi

### Dashboard Dynamique
- **Onglets conditionnels** : Affichage selon le rôle
- **Navigation sécurisée** : Masquage automatique des onglets non autorisés
- **Interface adaptée** : Contenu spécifique à chaque rôle

## 🔧 Architecture Backend

### Routes Protégées

#### Routes Client
```javascript
// Paiements - Clients seulement
POST /api/payments/initiate     // requireClient
GET  /api/payments/status/:id   // requireClient + ownership
GET  /api/payments/history      // requireClient (own history only)

// Utilisateurs - Accès limité
GET  /api/users/profile         // requireClient + ownership
PUT  /api/users/profile         // requireClient + ownership
```

#### Routes Administrateur
```javascript
// Administration complète
GET  /api/admin/dashboard       // requireAdmin
GET  /api/admin/users           // requireAdmin
GET  /api/admin/users/:id       // requireAdmin
PUT  /api/admin/users/:id       // requireAdmin
DELETE /api/admin/users/:id     // requireAdmin

// Paiements admin
POST /api/payments/admin/adjust-balance  // requireAdmin
GET  /api/payments/admin/stats           // requireAdmin
```

### Modèle de Base de Données

#### Utilisateur (User)
```javascript
{
  name: String,
  email: String,
  password: String, // hashed
  role: {
    type: String,
    enum: ['client', 'administrateur'],
    default: 'client'
  },
  kwBalance: Number,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

#### Transaction
```javascript
{
  transactionId: String,
  userId: ObjectId,
  paymentMethod: String,
  kwAmount: Number,
  amount: Number,
  status: String,
  // ... autres champs
}
```

## 🎨 Interface Frontend

### Composants par Rôle

#### ClientDashboard
- **RealTimeDashboard** : Statistiques personnelles
- **InteractiveMap** : Carte du réseau
- **RoutePlanner** : Planification d'itinéraire
- **MobileMoneyPayment** : Paiement et historique

#### AdminDashboard
- **Statistiques globales** : Utilisateurs, revenus, transactions
- **Gestion utilisateurs** : Liste, modification, ajustement soldes
- **Transactions globales** : Historique complet
- **Administration** : Paramètres système

### Navigation Conditionnelle
```typescript
const availableTabs = getAvailableTabs();
// Client: ['overview', 'map', 'route', 'payment']
// Admin: ['overview', 'map', 'route', 'payment', 'ai', 'management']
```

## 🔄 Flux d'Authentification

### Connexion
```
1. Sélection du rôle (Client/Admin)
2. Saisie email/mot de passe
3. Validation côté client
4. Envoi au backend avec rôle
5. Vérification credentials + rôle
6. Génération token JWT avec rôle
7. Redirection vers dashboard approprié
```

### Vérification à Chaque Requête
```
1. Extraction token Authorization header
2. Vérification signature JWT
3. Décodage payload (user + role)
4. Vérification rôle requis par la route
5. Vérification propriété (si applicable)
6. Autorisation ou rejet (403/401)
```

## 🛡️ Mesures de Sécurité

### Authentification
- ✅ **JWT sécurisé** avec expiration 24h
- ✅ **Hashage bcrypt** des mots de passe
- ✅ **Validation des entrées** avec express-validator

### Autorisation
- ✅ **Middleware RBAC** sur toutes les routes sensibles
- ✅ **Vérification de propriété** pour les données utilisateur
- ✅ **Logs d'accès** pour audit

### Protection
- ✅ **Rate limiting** (100 req/15min par IP)
- ✅ **CORS configuré** pour le domaine frontend
- ✅ **Helmet** pour headers de sécurité
- ✅ **Validation des rôles** côté client et serveur

## 📊 Fonctionnalités Administrateur

### Dashboard Admin
- **Statistiques temps réel** : Utilisateurs actifs, transactions, revenus
- **Gestion utilisateurs** : Création, modification, désactivation
- **Ajustement soldes** : Attribution/rétrocession de kW avec historique
- **Monitoring transactions** : Taux de réussite, montants, méthodes

### Actions Admin
```javascript
// Ajustement de solde
POST /api/payments/admin/adjust-balance
{
  userId: "user_id",
  adjustment: 10,        // kW à ajouter (positif) ou retirer (négatif)
  reason: "Compensation panne"
}

// Statistiques globales
GET /api/payments/admin/stats
// Retourne: total transactions, taux réussite, revenus totaux
```

## 🚀 Déploiement et Maintenance

### Variables d'Environnement
```env
NODE_ENV=production
JWT_SECRET=your-production-secret-key
MONGODB_URI=mongodb://prod-server/kemet_platform
# ... autres configs
```

### Monitoring
- **Logs d'accès** par rôle et endpoint
- **Alertes** sur tentatives d'accès non autorisé
- **Audit trail** des modifications admin

### Tests de Sécurité
- ✅ **Tests unitaires** des middlewares
- ✅ **Tests d'intégration** des permissions
- ✅ **Tests E2E** des flux complets

## 🔧 Maintenance et Évolution

### Ajout de Nouveaux Rôles
```javascript
// Dans middleware/auth.js
const requireManager = requireRole('manager');

// Dans routes
router.get('/admin-only', [auth, requireManager], handler);
```

### Audit des Permissions
- Revue régulière des accès
- Suppression des permissions obsolètes
- Documentation des changements

---

## ✅ Checklist Implémentation

### Frontend
- [x] Interface de sélection de rôle
- [x] Navigation conditionnelle
- [x] Composants par rôle
- [x] Gestion d'état du rôle

### Backend
- [x] Middleware RBAC complet
- [x] Routes protégées par rôle
- [x] Vérification de propriété
- [x] Modèles de données avec rôles

### Sécurité
- [x] Authentification JWT
- [x] Autorisation par rôle
- [x] Validation des entrées
- [x] Protection contre les attaques

### Tests
- [x] Tests de connexion par rôle
- [x] Tests d'accès aux routes
- [x] Tests de sécurité

**L'implémentation RBAC est complète et opérationnelle !** 🔐👥