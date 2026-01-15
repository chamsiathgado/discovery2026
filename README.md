# KEMET Platform - Gestion Intelligente des Réseaux de Recharge Électrique

## Description

Plateforme intelligente d'administration développée par KEMET pour optimiser la gestion des réseaux de recharge électrique en Afrique. Destinée aux autorités publiques, opérateurs d'infrastructures et administrations énergétiques.

## Fonctionnalités

### 1. Authentification
- **Écran de connexion** avec sélection de rôle (administrateur, opérateur, client)
- **Écran d'inscription** pour créer un nouveau compte
- États visuels : chargement, erreur, succès

### 2. Carte Interactive OpenStreetMap
- Vue centrée sur le Bénin (Cotonou, Porto-Novo, Parakou)
- Marqueurs interactifs pour chaque station
- Codes couleur des bornes :
  - 🟢 Vert : Active
  - 🟠 Orange : Forte affluence
  - 🔴 Rouge : Hors service
  - 🔵 Bleu : En maintenance
- Interaction au survol et clic pour voir les détails

### 3. Détails des Stations et Bornes
- Panneau latéral avec informations complètes
- Statut en temps réel de chaque borne
- Puissance disponible et niveau de batterie (bornes solaires)
- Historique d'utilisation
- Actions de maintenance (déclaration, réactivation)

### 4. Gestion CRUD
- **Stations** : Création, modification, suppression
- **Bornes** : Gestion complète avec changement de statut
- Interface de gestion administrative

### 5. Tableau de Bord Temps Réel
- **Indicateurs clés** :
  - Taux d'occupation global
  - Disponibilité du réseau
  - Bornes en maintenance
  - Zones critiques
- **Visualisations** :
  - Courbe d'affluence par heure
  - Histogramme d'utilisation par ville
  - Carte de chaleur des zones congestionnées
- **Filtrage** par ville avec synchronisation carte/données

### 6. Module d'Intelligence Artificielle
- **Détection automatique** des périodes critiques (09h-12h, 16h-18h)
- **Alertes** en cas de saturation imminente
- **Recommandations** :
  - Ajout de nouvelles bornes
  - Redistribution de charge
  - Maintenance préventive
  - Expansion réseau
- Priorisation des actions (critique, avertissement, suggestion)

### 7. Contexte Africain
- Données réalistes pour le Bénin
- Noms de stations africains authentiques
- Prise en compte :
  - Réseau électrique instable
  - Bornes solaires
  - Usages locaux

### 8. Design Professionnel
- Interface moderne et institutionnelle
- Mode clair et sombre
- Couleurs liées à l'énergie et durabilité
- Typographie claire
- États dynamiques (chargement, temps réel)

## Technologies Utilisées

- **React 18** avec TypeScript
- **Vite** pour le build
- **Tailwind CSS v4** pour le styling
- **Leaflet** et **React-Leaflet** pour la cartographie OpenStreetMap
- **Recharts** pour les graphiques
- **Radix UI** et **shadcn/ui** pour les composants
- **Next-themes** pour le mode sombre
- **Sonner** pour les notifications
- **Motion** pour les animations

## Structure du Projet

```
src/
├── app/
│   ├── App.tsx                    # Composant principal avec routing
│   ├── components/
│   │   ├── auth/                  # Authentification
│   │   │   ├── LoginScreen.tsx
│   │   │   └── RegisterScreen.tsx
│   │   ├── dashboard/             # Tableau de bord
│   │   │   ├── DashboardMain.tsx
│   │   │   ├── RealTimeDashboard.tsx
│   │   │   ├── StationDetailPanel.tsx
│   │   │   ├── AIRecommendations.tsx
│   │   │   └── ManagementPanel.tsx
│   │   ├── map/                   # Carte interactive
│   │   │   └── InteractiveMap.tsx
│   │   └── ui/                    # Composants UI réutilisables
│   └── data/
│       └── mockData.ts            # Données mockées (Bénin)
├── styles/
│   ├── index.css
│   ├── tailwind.css
│   ├── theme.css
│   └── leaflet.css
└── main.tsx                       # Point d'entrée

## Données Mockées

### Stations
- **Cotonou** : 5 stations (Plateau, Akpakpa, Étoile Rouge, Fidjrossè, Cadjèhoun)
- **Porto-Novo** : 3 stations (Plateau, Ouando, Avassa)
- **Parakou** : 2 stations (Centre, Banikanni)

### Types de Bornes
- Standard (11 kW)
- Rapide (22 kW)
- Solaire (50 kW avec batterie)

### Statuts
- Active
- Forte affluence
- En maintenance
- Hors service

## Installation

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Builder pour la production
npm run build
```

## Utilisation

1. **Connexion** : Utilisez n'importe quel email/mot de passe et sélectionnez un rôle
2. **Navigation** : Utilisez les onglets pour accéder aux différentes sections
3. **Carte** : Cliquez sur les marqueurs pour voir les détails des stations
4. **Gestion** : Ajoutez, modifiez ou supprimez des stations/bornes
5. **IA** : Consultez les recommandations et programmez des actions

## Caractéristiques Techniques

- **Responsive** : Optimisé pour desktop (desktop-first)
- **Performance** : Chargement rapide, optimisations Vite
- **Accessibilité** : Composants accessibles (Radix UI)
- **TypeScript** : Code typé pour plus de sécurité
- **État** : Gestion d'état React locale (useState)
- **Temps réel** : Simulation de mises à jour en temps réel

## Crédibilité POC

L'interface simule une plateforme industrielle déjà en exploitation :
- Design professionnel institutionnel
- Données cohérentes et réalistes
- Fonctionnalités complètes CRUD
- Module IA avec recommandations concrètes
- Tableaux de bord décisionnels
- Gestion de maintenance

## Auteur

KEMET Energy Solutions - 2026
Plateforme de gestion des infrastructures critiques
© Tous droits réservés
```
