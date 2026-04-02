/**
 * Routes d'authentification
 * Définit les endpoints pour l'inscription, connexion et profil
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

/**
 * POST /api/auth/register
 * Inscription d'un nouvel utilisateur
 * Body: { email, username, password }
 */
router.post('/register', authController.register);

/**
 * POST /api/auth/login
 * Connexion d'un utilisateur existant
 * Body: { email, password }
 */
router.post('/login', authController.login);

/**
 * GET /api/auth/me
 * Récupérer le profil de l'utilisateur connecté
 * Nécessite un token JWT valide (middleware)
 */
router.get('/me', authenticateToken, authController.getProfile);

module.exports = router;
