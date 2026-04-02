/**
 * Routes des observations
 * Définit les endpoints pour gérer les observations astronomiques
 */

const express = require('express');
const router = express.Router();
const observationController = require('../controllers/observation.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

/**
 * Toutes les routes sont protégées par le middleware JWT
 * L'utilisateur doit être connecté pour accéder à ses observations
 */

/**
 * GET /api/observations
 * Récupérer toutes les observations de l'utilisateur connecté
 */
router.get('/', authenticateToken, observationController.getObservations);

/**
 * GET /api/observations/:id
 * Récupérer une observation spécifique par son ID
 */
router.get('/:id', authenticateToken, observationController.getObservationById);

/**
 * POST /api/observations
 * Créer une nouvelle observation
 * Body: { planetName, date, location, weather?, notes?, magnitude?, altitude?, azimuth? }
 */
router.post('/', authenticateToken, observationController.createObservation);

/**
 * PUT /api/observations/:id
 * Modifier une observation existante
 * Body: { planetName?, date?, location?, weather?, notes?, magnitude?, altitude?, azimuth? }
 */
router.put('/:id', authenticateToken, observationController.updateObservation);

/**
 * DELETE /api/observations/:id
 * Supprimer une observation
 */
router.delete('/:id', authenticateToken, observationController.deleteObservation);

module.exports = router;
