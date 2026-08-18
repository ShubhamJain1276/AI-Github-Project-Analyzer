const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  analysisId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AnalysisReport',
    required: true
  },
  repositoryFullName: {
    type: String,
    required: true
  },
  repositoryUrl: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Prevent duplicate favorites
favoriteSchema.index({ userId: 1, analysisId: 1 }, { unique: true });

module.exports = mongoose.model('Favorite', favoriteSchema);
