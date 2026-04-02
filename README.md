# SkyObserver

**SkyObserver** est une application web d'observation astronomique qui vous permet de découvrir quelles planètes sont visibles depuis votre position, de suivre vos observations, et de rester informé de l'actualité spatiale.

![Angular](https://img.shields.io/badge/Angular-21.1.3-DD0031?logo=angular)
![Node.js](https://img.shields.io/badge/Node.js-≥18-339933?logo=node.js)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14-4169E1?logo=postgresql)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3.8-7952B3?logo=bootstrap)

---

## Table des matières

- Fonctionnalités
- Technologies
- Prérequis
- Installation
- Démarrage
- Utilisation
- APIs externes
- Auteur

---

## Fonctionnalités

### **Publiques** (sans inscription)
- **Planètes visibles** : Calcul en temps réel des planètes observables depuis votre ville
  - Visibilité à l'œil nu ou au télescope
  - Informations détaillées : altitude, azimut, magnitude, lever/coucher
- **Actualités spatiales** : Dernières nouvelles de l'astronomie et de l'espace
- **Météo** : Conditions météo actuelles pour planifier vos observations
- **Glossaire** : Liste des planètes et de leurs informations 

### **Privées** (avec compte utilisateur)
- **Mes Favoris** : Enregistrez vos planètes préférées avec ❤️
- **Mes Observations** : Journal de bord de vos observations
  - Créer, modifier, supprimer des observations
  - Enregistrer lieu, date, météo, notes personnelles
  - Données techniques : magnitude, altitude, azimuth

---

## Technologies

### Frontend
- **Angular 21.1.3** - Framework web moderne
- **Bootstrap 5.3.8** - Framework CSS responsive
- **RxJS 7.8.0** - Gestion des flux
- **astronomy-engine 2.1.19** - Calculs astronomiques précis

### Backend
- **Node.js** (≥18) - Environnement d'exécution JavaScript
- **Express 5.2.1** - Framework web pour Node.js
- **PostgreSQL 14** - Base de données relationnelle
- **Prisma 5.7.0** - ORM pour PostgreSQL
- **JWT** - Authentification sécurisée 

---

## Prérequis

Avant de commencer, assurez-vous d'avoir installé :

### 1. **Node.js** (version 18 ou supérieure)
- **Télécharger** : [nodejs.org](https://nodejs.org/)
- **Vérifier** l'installation :
  ```bash
  node --version
  npm --version
  ```

### 2. **PostgreSQL** (version 14 ou supérieure)
- **macOS** :
  ```bash
  brew install postgresql@14
  brew services start postgresql@14
  ```
- **Linux** :
  ```bash
  sudo apt update
  sudo apt install postgresql postgresql-contrib
  sudo systemctl start postgresql
  ```
- **Vérifier** l'installation :
  ```bash
  psql --version
  ```

---

## Installation

### Étape 1 : Cloner le projet

```bash
git clone https://github.com/votre-username/SkyObserver.git
cd SkyObserver
```

---

### Étape 2 : Configuration du Backend

#### 2.1. Créer la base de données PostgreSQL

1. **Se connecter à PostgreSQL** :
   ```bash
   psql postgres
   ```

2. **Créer la base de données** :
   ```sql
   CREATE DATABASE skyobserver;
   \q
   ```

#### 2.2. Installer les dépendances backend

```bash
cd Backend
npm install
```

#### 2.3. Configurer les variables d'environnement

Créez un fichier `.env` dans le dossier `Backend` :

```bash
touch .env
```

Ajoutez le contenu suivant dans `.env` :

```env
# Port du serveur backend
PORT=3000

# URL du frontend (ajustez si besoin)
FRONTEND_URL=http://localhost:4200

# Connexion PostgreSQL (ajustez si nécessaire)
DATABASE_URL="postgresql://VOTRE_USER:VOTRE_PASSWORD@localhost:5432/skyobserver"

# Clé secrète JWT, à générer avec 'openssl rand -hex 64'
JWT_SECRET=cle_provisoire_a_changer
```

> **Note** : Remplacez `VOTRE_USER` et `VOTRE_PASSWORD` par vos identifiants PostgreSQL.
> Par défaut sur macOS/Linux, l'utilisateur est souvent votre nom d'utilisateur système sans mot de passe.

#### 2.4. Appliquer les migrations et créer les tables

```bash
npx prisma generate
npx prisma migrate dev
```

> **Info** : Les migrations existent déjà dans le projet (`prisma/migrations/`).
> La commande `migrate dev` les applique automatiquement à votre base de données locale.

> **Optionnel** : Visualiser la base de données avec Prisma Studio :
> ```bash
> npx prisma studio
> ```
> Ouvre une interface graphique sur http://localhost:5555

---

### Étape 3 : Configuration du Frontend

#### 3.1. Installer les dépendances frontend

```bash
cd ..  # Retour à la racine du projet
npm install
```

#### 3.2. Configurer la clé API pour les informations planétaires

L'application utilise **The Solar System OpenData API** pour récupérer les informations détaillées sur les planètes.

1. **Obtenir une clé API gratuite** :
   - Rendez-vous sur [https://api.le-systeme-solaire.net](https://api.le-systeme-solaire.net)
   - Créez un compte et obtenez votre clé API gratuite

2. **Créer les fichiers d'environnement** :

   À la racine du projet, créez les fichiers de configuration à partir du fichier exemple :

   ```bash
   # Créer environment.ts (pour le développement)
   cp src/environments/environment.example.ts src/environments/environment.ts

   # Créer environment.development.ts (pour ng serve)
   cp src/environments/environment.example.ts src/environments/environment.development.ts
   ```

3. **Ajouter votre clé API** :

   Ouvrez les deux fichiers et remplacez `'VOTRE_CLE_API_ICI'` par votre vraie clé :

   **src/environments/environment.ts** :
   ```typescript
   export const environment = {
     production: false,
     apiKey: 'votre-cle-api-reelle-ici'  // Remplacez par votre clé
   };
   ```

   **src/environments/environment.development.ts** :
   ```typescript
   export const environment = {
     production: false,
     apiKey: 'votre-cle-api-reelle-ici'  // Remplacez par votre clé
   };
   ```

---

## Démarrage

### Ordre de démarrage recommandé

**Il faut démarrer le backend AVANT le frontend.**

#### 1. Démarrer PostgreSQL

- **macOS** (si utilisation de Homebrew) :
  ```bash
  brew services start postgresql@14
  ```
- **Linux** :
  ```bash
  sudo systemctl start postgresql
  ```
- **Windows** : PostgreSQL démarre automatiquement après l'installation

#### 2. Démarrer le backend

Ouvrez un **terminal** :

```bash
cd Backend
npm run dev
```

Le backend démarre sur **http://localhost:3000**

Vous devriez voir :
```
Serveur démarré sur le port 3000
```

#### 3. Démarrer le frontend

Ouvrez un **nouveau terminal** (laissez le backend tourner) :

```bash
ng serve -o
```

Le frontend démarre sur **http://localhost:4200**

---

## Utilisation

### 1. **Page d'accueil** (`/`)
- Recherchez une ville pour voir la météo
- Consultez les 4 dernières actualités spatiales
- Cliquez sur "Voir plus" pour accéder à toutes les actualités

### 2. **Planètes visibles** (`/planetes-visibles`)
- Entrez votre ville
- L'application calcule automatiquement les planètes observables
- Sépare les planètes visibles à l'œil nu de celles nécessitant un télescope
- Cliquez sur une planète pour plus de détails

### 3. **Créer un compte** (`/register`)
- Remplissez le formulaire d'inscription
- Email, nom d'utilisateur et mot de passe requis

### 4. **Se connecter** (`/login`)
- Connectez-vous avec votre email et mot de passe
- Accédez aux fonctionnalités privées

### 5. **Mes Favoris** (`/mes-favoris`) 
- Ajoutez des planètes en favoris via le bouton ❤️
- Gérez votre liste de planètes favorites
- Supprimez vos favoris

### 6. **Mes Observations** (`/mes-observations`) 
- Consultez toutes vos observations astronomiques
- Recherchez par planète ou date
- Modifiez ou supprimez vos observations
- Statistiques de vos observations

### 7. **Nouvelle Observation** (`/nouvelle-observation`)
- Enregistrez une nouvelle observation
- Renseignez : planète, date, lieu, météo
- Ajoutez des données techniques : magnitude, altitude, azimuth
- Notez vos impressions personnelles

---

## APIs externes

L'application utilise plusieurs APIs publiques :

1. **The Solar System OpenData** - Informations détaillées sur les planètes (gratuite, Clé API requise)
   - **Configuration** : Voir Étape 3.2

2. **Open-Meteo Geocoding** - Conversion ville → coordonnées GPS *(gratuite, sans clé)*

3. **Open-Meteo Weather** - Données météorologiques *(gratuite, sans clé)*

4. **Spaceflight News API** - Actualités spatiales *(gratuite, sans clé)*

5. **astronomy-engine** - Calculs astronomiques *(bibliothèque locale)*

---

## Auteur

**Enzo Desfaudais (B0rno)**

**Thibaut Gasnier (tibogas)**

**William Littre (LWilliam)**

**Louison Roquain (LouisonROQ1)**


- Projet réalisé dans le cadre des modules IHM/Archi Web (L3)
- Université : Le Mans Université
- Année : 2026

