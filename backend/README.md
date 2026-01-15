# KEMET Platform - Backend API

Backend API pour la plateforme de gestion des réseaux de recharge électrique KEMET.

## Fonctionnalités

- ✅ Authentification utilisateur (inscription/connexion)
- ✅ Gestion des profils utilisateurs
- ✅ Paiements Mobile Money (MTN Money, Moov Money)
- ✅ Gestion des transactions
- ✅ Crédit automatique du compte utilisateur
- ✅ Historique des paiements

## Technologies utilisées

- **Node.js** avec **Express.js**
- **MongoDB** avec **Mongoose**
- **JWT** pour l'authentification
- **Flutterwave** pour les paiements Mobile Money
- **bcryptjs** pour le hashage des mots de passe

## Installation

1. **Installer les dépendances :**
   ```bash
   cd backend
   npm install
   ```

2. **Configuration de l'environnement :**
   ```bash
   cp .env.example .env
   # Éditez le fichier .env avec vos propres valeurs
   ```

3. **Démarrer MongoDB :**
   Assurez-vous que MongoDB est installé et en cours d'exécution sur votre système.

4. **Démarrer le serveur :**
   ```bash
   # Mode développement
   npm run dev

   # Mode production
   npm start
   ```

Le serveur démarrera sur le port 3001 par défaut.

## API Endpoints

### Authentification

- `POST /api/auth/register` - Inscription utilisateur
- `POST /api/auth/login` - Connexion utilisateur
- `GET /api/auth/me` - Informations utilisateur actuel

### Utilisateurs

- `GET /api/users/profile` - Profil utilisateur
- `PUT /api/users/profile` - Mise à jour du profil

### Paiements

- `POST /api/payments/initiate` - Initier un paiement Mobile Money
- `GET /api/payments/status/:transactionId` - Vérifier le statut d'un paiement
- `GET /api/payments/history` - Historique des paiements
- `POST /api/payments/webhook` - Webhook pour les confirmations de paiement
- `GET /api/payments/calculate` - Calculer le montant pour des kW

## Structure des données

### Utilisateur (User)
```javascript
{
  name: String,
  email: String,
  password: String, // hashed
  role: 'client' | 'administrateur',
  kwBalance: Number, // Solde en kW
  phoneNumber: String,
  isActive: Boolean,
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Transaction
```javascript
{
  transactionId: String, // Unique
  userId: ObjectId,
  type: 'purchase' | 'refund',
  paymentMethod: 'mtn_mobile_money' | 'moov_money',
  kwAmount: Number,
  amount: Number, // FCFA
  currency: 'XOF',
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled',
  phoneNumber: String,
  gatewayTransactionId: String,
  gatewayResponse: Object,
  errorMessage: String,
  processedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## Tarification

- Prix fixe : **500 FCFA par kW**
- Calcul automatique : `montant = nombre_kW × 500`

## Sécurité

- ✅ Hashage des mots de passe avec bcrypt
- ✅ Authentification JWT
- ✅ Validation des données d'entrée
- ✅ Rate limiting
- ✅ Protection CORS
- ✅ Sanitisation des entrées

## Intégration Frontend

### Exemple d'initiation de paiement

```javascript
const initiatePayment = async (kwAmount, paymentMethod, phoneNumber) => {
  const token = localStorage.getItem('token');

  const response = await fetch('/api/payments/initiate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      kwAmount,
      paymentMethod, // 'mtn_mobile_money' or 'moov_money'
      phoneNumber
    })
  });

  const result = await response.json();
  return result;
};
```

### Vérification du statut de paiement

```javascript
const checkPaymentStatus = async (transactionId) => {
  const token = localStorage.getItem('token');

  const response = await fetch(`/api/payments/status/${transactionId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  const result = await response.json();
  return result;
};
```

## Déploiement en production

1. **Variables d'environnement :**
   - Définir `NODE_ENV=production`
   - Configurer les clés Flutterwave réelles
   - Utiliser une vraie base de données MongoDB

2. **Sécurité supplémentaire :**
   - Whitelist des IPs pour les webhooks
   - HTTPS obligatoire
   - Monitoring des logs
   - Sauvegarde régulière de la base de données

3. **Performance :**
   - Utiliser un reverse proxy (nginx)
   - Configurer les connexions à la base de données
   - Implémenter la mise en cache si nécessaire

## Support

Pour toute question ou problème, contactez l'équipe de développement.