/**
 * Controller d'authentification
 * Gestion de l'inscription, connexion et profil utilisateur
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

/**
 * Inscription d'un nouvel utilisateur
 * POST /api/auth/register
 */
exports.register = async (req, res) => {
  try {
    const { email, username, password } = req.body;

    // Vérifier que tous les champs sont fournis
    if (!email || !username || !password) {
      return res.status(400).json({
        error: 'Tous les champs sont requis (email, username, password)'
      });
    }

    // Vérifier si l'email existe déjà
    const existingEmail = await prisma.user.findUnique({
      where: { email }
    });

    if (existingEmail) {
      return res.status(400).json({
        error: 'Cet email est déjà utilisé'
      });
    }

    // Vérifier si le username existe déjà
    const existingUsername = await prisma.user.findUnique({
      where: { username }
    });

    if (existingUsername) {
      return res.status(400).json({
        error: 'Ce nom d\'utilisateur est déjà pris'
      });
    }

    // Hacher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer l'utilisateur dans la base de données
    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword
      }
    });

    // Générer le token JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Retourner le token et les infos utilisateur (sans le mot de passe)
    res.status(201).json({
      message: 'Inscription réussie',
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    res.status(500).json({
      error: 'Erreur lors de l\'inscription'
    });
  }
};

/**
 * Connexion d'un utilisateur existant
 * POST /api/auth/login
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérifier que tous les champs sont fournis
    if (!email || !password) {
      return res.status(400).json({
        error: 'Email et mot de passe requis'
      });
    }

    // Trouver l'utilisateur par email
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({
        error: 'Email ou mot de passe incorrect'
      });
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Email ou mot de passe incorrect'
      });
    }

    // Générer le token JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Retourner le token et les infos utilisateur
    res.status(200).json({
      message: 'Connexion réussie',
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    res.status(500).json({
      error: 'Erreur lors de la connexion'
    });
  }
};

/**
 * Récupérer le profil de l'utilisateur connecté
 * GET /api/auth/me
 * Nécessite un token JWT valide
 */
exports.getProfile = async (req, res) => {
  try {
    // req.user est défini par le middleware auth
    const userId = req.user.userId;

    // Récupérer l'utilisateur avec ses statistiques
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        _count: {
          select: {
            favorites: true,
            observations: true,
            lists: true
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({
        error: 'Utilisateur non trouvé'
      });
    }

    // Retourner les infos utilisateur (sans le mot de passe)
    res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        createdAt: user.createdAt,
        stats: {
          favorites: user._count.favorites,
          observations: user._count.observations,
          lists: user._count.lists
        }
      }
    });

  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
    res.status(500).json({
      error: 'Erreur lors de la récupération du profil'
    });
  }
};
