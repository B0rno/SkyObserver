// Import des dépendances
const express = require('express');
const cors = require('cors');

// Initialisation de l'application Express
const app = express();
      port = 3000;

app.use(cors());

/**
 * Route de test
 * GET /
 * Vérifie que le serveur fonctionne correctement
 */
app.get('/', (req, res) => {
  res.json(
    [{
    message: 'Bienvenue sur l\'API SkyObserver !',
    status: 'Le serveur fonctionne correctement',
    version: '1.0.0'}
  ]);
});

/**
 * Démarre le serveur sur le port spécifié
 */
app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
});

