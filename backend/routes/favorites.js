const express = require('express');
const auth = require('../middleware/auth');
const Favorite = require('../models/Favorite');
const AnalysisReport = require('../models/AnalysisReport');
const router = express.Router();

// GET /api/favorites
router.get('/', auth, async (req, res) => {
  try {
    const favorites = await Favorite.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .populate({
        path: 'analysisId',
        select: 'repository scores status createdAt source.retrievedAt'
      })
      .lean();
    res.json({ favorites });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve favorites.' });
  }
});

// POST /api/favorites
router.post('/', auth, async (req, res) => {
  try {
    const { analysisId } = req.body;
    if (!analysisId) return res.status(400).json({ error: 'Analysis ID is required.' });

    const report = await AnalysisReport.findOne({ _id: analysisId, userId: req.userId });
    if (!report) return res.status(404).json({ error: 'Analysis not found.' });

    const existing = await Favorite.findOne({ userId: req.userId, analysisId });
    if (existing) return res.status(409).json({ error: 'Already favorited.', favorite: existing });

    const favorite = await Favorite.create({
      userId: req.userId,
      analysisId,
      repositoryFullName: report.repository.fullName,
      repositoryUrl: report.repository.url
    });
    res.status(201).json({ message: 'Favorited successfully', favorite });
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ error: 'Already favorited.' });
    res.status(500).json({ error: 'Failed to create favorite.' });
  }
});

// DELETE /api/favorites/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const fav = await Favorite.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!fav) {
      // Try by analysisId
      const fav2 = await Favorite.findOneAndDelete({ analysisId: req.params.id, userId: req.userId });
      if (!fav2) return res.status(404).json({ error: 'Favorite not found.' });
    }
    res.json({ message: 'Removed from favorites.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove favorite.' });
  }
});

module.exports = router;
