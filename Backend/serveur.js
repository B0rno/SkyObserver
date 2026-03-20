// Charger les variables d'environnement
require('dotenv').config();

// Import des dépendances
const express = require('express');
const cors = require('cors');
const authRoutes = require('./src/routes/auth.routes');
const favoriteRoutes = require('./src/routes/favorite.routes');
const observationRoutes = require('./src/routes/observation.routes');


// Initialisation de l'application Express
const app = express();
const PORT = process.env.PORT || 3000;

// ========================================
// MIDDLEWARES
// ========================================

// Configuration CORS 
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:8080',
  credentials: true
}));

// Parser le JSON dans les requêtes
app.use(express.json());

// ========================================
// ROUTES
// ========================================

// Routes d'authentification
app.use('/api/auth', authRoutes);

// Routes des favoris
app.use('/api/favorites', favoriteRoutes);

// Routes des observations
app.use('/api/observations', observationRoutes);

/**
 * Route de test
 * GET /
 * Vérifie que le serveur fonctionne correctement
 */
app.get('/', (req, res) => {
  res.json({
    message: 'Bienvenue sur l\'API SkyObserver !',
    status: 'Le serveur fonctionne correctement',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'

  });
});

/**
 * Démarre le serveur sur le port spécifié
 */
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
  console.log(`CORS activé pour: ${process.env.FRONTEND_URL}`);

});

