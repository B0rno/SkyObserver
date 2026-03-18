/**
 * Controller des observations
 * Gestion des observations astronomiques de l'utilisateur
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

/**
 * Récupérer toutes les observations de l'utilisateur connecté
 * GET /api/observations
 */
exports.getObservations = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Récupérer toutes les observations de l'utilisateur
    const observations = await prisma.observation.findMany({
      where: { userId },
      orderBy: { date: 'desc' } // Plus récentes en premier
    });

    res.status(200).json({
      count: observations.length,
      observations
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des observations:', error);
    res.status(500).json({
      error: 'Erreur lors de la récupération des observations'
    });
  }
};

/**
 * Récupérer une observation spécifique
 * GET /api/observations/:id
 */
exports.getObservationById = async (req, res) => {
  try {
    const userId = req.user.userId;
    const observationId = parseInt(req.params.id);

    // Vérifier que l'ID est valide
    if (isNaN(observationId)) {
      return res.status(400).json({
        error: 'ID d\'observation invalide'
      });
    }

    // Récupérer l'observation
    const observation = await prisma.observation.findUnique({
      where: { id: observationId }
    });

    if (!observation) {
      return res.status(404).json({
        error: 'Observation non trouvée'
      });
    }

    // Vérifier que l'observation appartient à l'utilisateur
    if (observation.userId !== userId) {
      return res.status(403).json({
        error: 'Vous n\'avez pas l\'autorisation d\'accéder à cette observation'
      });
    }

    res.status(200).json({ observation });

  } catch (error) {
    console.error('Erreur lors de la récupération de l\'observation:', error);
    res.status(500).json({
      error: 'Erreur lors de la récupération de l\'observation'
    });
  }
};

/**
 * Créer une nouvelle observation
 * POST /api/observations
 * Body: { planetName, date, location, weather?, notes?, magnitude?, altitude?, azimuth? }
 */
exports.createObservation = async (req, res) => {
  try {
    const userId = req.user.userId;
    const {
      planetName,
      date,
      location,
      weather,
      notes,
      magnitude,
      altitude,
      azimuth
    } = req.body;

    // Vérifier que les champs requis sont fournis
    if (!planetName || !date || !location) {
      return res.status(400).json({
        error: 'Les champs planetName, date et location sont requis'
      });
    }

    // Créer l'observation
    const observation = await prisma.observation.create({
      data: {
        userId,
        planetName,
        date: new Date(date), // Convertir en objet Date
        location,
        weather: weather || null,
        notes: notes || null,
        magnitude: magnitude !== undefined ? parseFloat(magnitude) : null,
        altitude: altitude !== undefined ? parseFloat(altitude) : null,
        azimuth: azimuth !== undefined ? parseFloat(azimuth) : null
      }
    });

    res.status(201).json({
      message: 'Observation créée avec succès',
      observation
    });

  } catch (error) {
    console.error('Erreur lors de la création de l\'observation:', error);
    res.status(500).json({
      error: 'Erreur lors de la création de l\'observation'
    });
  }
};

/**
 * Modifier une observation existante
 * PUT /api/observations/:id
 * Body: { planetName?, date?, location?, weather?, notes?, magnitude?, altitude?, azimuth? }
 */
exports.updateObservation = async (req, res) => {
  try {
    const userId = req.user.userId;
    const observationId = parseInt(req.params.id);

    // Vérifier que l'ID est valide
    if (isNaN(observationId)) {
      return res.status(400).json({
        error: 'ID d\'observation invalide'
      });
    }

    // Vérifier que l'observation existe et appartient à l'utilisateur
    const existingObservation = await prisma.observation.findUnique({
      where: { id: observationId }
    });

    if (!existingObservation) {
      return res.status(404).json({
        error: 'Observation non trouvée'
      });
    }

    if (existingObservation.userId !== userId) {
      return res.status(403).json({
        error: 'Vous n\'avez pas l\'autorisation de modifier cette observation'
      });
    }

    // Préparer les données à mettre à jour (seulement les champs fournis)
    const {
      planetName,
      date,
      location,
      weather,
      notes,
      magnitude,
      altitude,
      azimuth
    } = req.body;

    const updateData = {};

    if (planetName !== undefined) updateData.planetName = planetName;
    if (date !== undefined) updateData.date = new Date(date);
    if (location !== undefined) updateData.location = location;
    if (weather !== undefined) updateData.weather = weather;
    if (notes !== undefined) updateData.notes = notes;
    if (magnitude !== undefined) updateData.magnitude = parseFloat(magnitude);
    if (altitude !== undefined) updateData.altitude = parseFloat(altitude);
    if (azimuth !== undefined) updateData.azimuth = parseFloat(azimuth);

    // Mettre à jour l'observation
    const observation = await prisma.observation.update({
      where: { id: observationId },
      data: updateData
    });

    res.status(200).json({
      message: 'Observation modifiée avec succès',
      observation
    });

  } catch (error) {
    console.error('Erreur lors de la modification de l\'observation:', error);
    res.status(500).json({
      error: 'Erreur lors de la modification de l\'observation'
    });
  }
};

/**
 * Supprimer une observation
 * DELETE /api/observations/:id
 */
exports.deleteObservation = async (req, res) => {
  try {
    const userId = req.user.userId;
    const observationId = parseInt(req.params.id);

    // Vérifier que l'ID est valide
    if (isNaN(observationId)) {
      return res.status(400).json({
        error: 'ID d\'observation invalide'
      });
    }

    // Vérifier que l'observation existe et appartient à l'utilisateur
    const observation = await prisma.observation.findUnique({
      where: { id: observationId }
    });

    if (!observation) {
      return res.status(404).json({
        error: 'Observation non trouvée'
      });
    }

    if (observation.userId !== userId) {
      return res.status(403).json({
        error: 'Vous n\'avez pas l\'autorisation de supprimer cette observation'
      });
    }

    // Supprimer l'observation
    await prisma.observation.delete({
      where: { id: observationId }
    });

    res.status(200).json({
      message: 'Observation supprimée avec succès'
    });

  } catch (error) {
    console.error('Erreur lors de la suppression de l\'observation:', error);
    res.status(500).json({
      error: 'Erreur lors de la suppression de l\'observation'
    });
  }
};
