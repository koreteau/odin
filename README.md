# Projet Odin : ReactJS, API Node.js/Express et MongoDB

## Description

Ce projet est une application web complète comprenant une interface utilisateur construite avec ReactJS, une API RESTful développée avec Node.js/Express, et une base de données MongoDB. L'application permet de gérer des questions, des tests et des utilisateurs avec des fonctionnalités de création, lecture, mise à jour et suppression (CRUD).

## Structure du Projet

Le projet est structuré en trois parties principales :

- `reactjs-app/`: Contient le code source de l'application ReactJS.
- `api/`: Contient le code source de l'API développée avec Node.js/Express.
- `database/`: Contient les scripts et les fichiers nécessaires pour configurer la base de données MongoDB.

## Prérequis

Avant de commencer, assurez-vous d'avoir les éléments suivants installés sur votre machine :

- Node.js et npm
- MongoDB

## Installation

### 1. Cloner le dépôt

```
git clone https://github.com/koreteau/odin.git
cd odin
```

### 2. Cloner le dépôt

Naviguez dans le dossier api et installez les dépendances :

```
cd api
npm install
```

Créez un fichier .env dans le dossier api et ajoutez les variables d'environnement nécessaires :

```
MONGO_URI=mongodb://localhost:27017/votre_database
JWT_SECRET=votre_secret_jwt
```

### 3. Configuration de l'application ReactJS

Naviguez dans le dossier reactjs-app et installez les dépendances :

```
cd ../app
npm install
```

Ajoutez un fichier .env dans le dossier reactjs-app si nécessaire pour vos configurations spécifiques.

### 4. Configuration de la base de données

Assurez-vous que MongoDB est en cours d'exécution et configuré pour utiliser le répertoire de données approprié. Si vous souhaitez utiliser un répertoire spécifique dans votre projet, vous pouvez démarrer MongoDB avec l'option --dbpath :

```
mongod --dbpath ../database/data/db
```

### 5. Démarrage de l'API et de l'application

Démarrer l'API
Dans le dossier api :

```
npm start
```

L'API devrait maintenant être en cours d'exécution sur http://localhost:5001.

Démarrer l'application ReactJS
Dans le dossier app :

```
npm start
```

L'application ReactJS devrait maintenant être en cours d'exécution sur http://localhost:3000.

## Utilisation

### Accéder à l'application

Ouvrez votre navigateur et allez à l'adresse http://localhost:3000 pour accéder à l'application.

### Point de terminaison 

- `GET` /api/questions : Récupère toutes les questions.
- `GET` /api/questions/:id : Récupère une question par ID.
- `PUT` /api/questions/:id : Met à jour une question par ID.
- `DELETE` /api/questions/:id : Supprime une question par ID.
- `GET` /api/tests : Récupère tous les tests.
- `GET` /api/tests/:id : Récupère un test par ID.
- `PUT` /api/tests/:id : Met à jour un test par ID.
- `DELETE` /api/tests/:id : Supprime un test par ID.
- `GET` /api/users : Récupère tous les utilisateurs.

## License

Ce projet est sous licence MIT. Voir le fichier LICENSE pour plus de détails.
