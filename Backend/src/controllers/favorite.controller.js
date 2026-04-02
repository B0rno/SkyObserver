/**
 * Controller des favoris
 * Gestion des planètes favorites de l'utilisateur
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

/**
 * Récupérer tous les favoris de l'utilisateur connecté
 * GET /api/favorites
 */
exports.getFavorites = async (req, res) => {
  try {
    // req.user est défini par le middleware auth
    const userId = req.user.userId;

    // Récupérer tous les favoris de l'utilisateur
    const favorites = await prisma.favorite.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' } // Plus récents en premier
    });

    res.status(200).json({
      count: favorites.length,
      favorites
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des favoris:', error);
    res.status(500).json({
      error: 'Erreur lors de la récupération des favoris'
    });
  }
};

/**
 * Ajouter une planète aux favoris
 * POST /api/favorites
 * Body: { planetName }
 */
exports.addFavorite = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { planetName } = req.body;

    // Vérifier que planetName est fourni
    if (!planetName) {
      return res.status(400).json({
        error: 'Le nom de la planète est requis'
      });
    }

    // Vérifier si la planète n'est pas déjà en favori
    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_planetName: {
          userId,
          planetName
        }
      }
    });

    if (existingFavorite) {
      return res.status(400).json({
        error: 'Cette planète est déjà dans vos favoris'
      });
    }

    // Créer le favori
    const favorite = await prisma.favorite.create({
      data: {
        userId,
        planetName
      }
    });

    res.status(201).json({
      message: 'Planète ajoutée aux favoris',
      favorite
    });

  } catch (error) {
    console.error('Erreur lors de l\'ajout du favori:', error);
    res.status(500).json({
      error: 'Erreur lors de l\'ajout du favori'
    });
  }
};

/**
 * Supprimer un favori
 * DELETE /api/favorites/:id
 */
exports.deleteFavorite = async (req, res) => {
  try {
    const userId = req.user.userId;
    const favoriteId = parseInt(req.params.id);

    // Vérifier que l'ID est valide
    if (isNaN(favoriteId)) {
      return res.status(400).json({
        error: 'ID de favori invalide'
      });
    }

    // Vérifier que le favori existe et appartient à l'utilisateur
    const favorite = await prisma.favorite.findUnique({
      where: { id: favoriteId }
    });

    if (!favorite) {
      return res.status(404).json({
        error: 'Favori non trouvé'
      });
    }

    if (favorite.userId !== userId) {
      return res.status(403).json({
        error: 'Vous n\'avez pas l\'autorisation de supprimer ce favori'
      });
    }

    // Supprimer le favori
    await prisma.favorite.delete({
      where: { id: favoriteId }
    });

    res.status(200).json({
      message: 'Favori supprimé avec succès'
    });

  } catch (error) {
    console.error('Erreur lors de la suppression du favori:', error);
    res.status(500).json({
      error: 'Erreur lors de la suppression du favori'
    });
  }
};

/**
 * Vérifier si une planète est en favori
 * GET /api/favorites/check/:planetName
 */
exports.checkFavorite = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { planetName } = req.params;

    // Chercher le favori
    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_planetName: {
          userId,
          planetName
        }
      }
    });

    res.status(200).json({
      isFavorite: !!favorite, // Convertir en booléen
      favorite: favorite || null
    });

  } catch (error) {
    console.error('Erreur lors de la vérification du favori:', error);
    res.status(500).json({
      error: 'Erreur lors de la vérification du favori'
    });
  }
};
