/**
 * Middleware d'authentification JWT
 * Vérifie que le token JWT est valide avant d'autoriser l'accès
 */

const jwt = require('jsonwebtoken');

/**
 * Vérifie le token JWT dans le header Authorization
 * Extrait les données utilisateur et les attache à req.user
 */
exports.authenticateToken = (req, res, next) => {
  try {
    // Récupérer le header Authorization
    const authHeader = req.headers['authorization'];

    // Vérifier que le header existe
    if (!authHeader) {
      return res.status(401).json({
        error: 'Token d\'authentification manquant'
      });
    }

    // Extraire le token (format: "Bearer TOKEN")
    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        error: 'Format du token invalide'
      });
    }

    // Vérifier et décoder le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attacher les données utilisateur à la requête
    req.user = decoded;

    // Passer au middleware/controller suivant
    next();

  } catch (error) {
    // Token invalide ou expiré
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Token expiré, veuillez vous reconnecter'
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Token invalide'
      });
    }

    // Autre erreur
    console.error('Erreur dans le middleware auth:', error);
    return res.status(500).json({
      error: 'Erreur lors de la vérification du token'
    });
  }
};
