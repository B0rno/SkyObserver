/**
 * Routes des favoris
 * Définit les endpoints pour gérer les planètes favorites
 */

const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favorite.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

/**
 * Toutes les routes sont protégées par le middleware JWT
 * L'utilisateur doit être connecté pour accéder à ses favoris
 */

/**
 * GET /api/favorites
 * Récupérer tous les favoris de l'utilisateur connecté
 */
router.get('/', authenticateToken, favoriteController.getFavorites);

/**
 * POST /api/favorites
 * Ajouter une planète aux favoris
 * Body: { planetName }
 */
router.post('/', authenticateToken, favoriteController.addFavorite);

/**
 * DELETE /api/favorites/:id
 * Supprimer un favori
 */
router.delete('/:id', authenticateToken, favoriteController.deleteFavorite);

/**
 * GET /api/favorites/check/:planetName
 * Vérifier si une planète est en favori
 * IMPORTANT: Cette route doit être APRÈS les autres routes GET
 * pour éviter que "check" soit interprété comme un ID
 */
router.get('/check/:planetName', authenticateToken, favoriteController.checkFavorite);

module.exports = router;
