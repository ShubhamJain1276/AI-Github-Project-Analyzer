const express = require('express');
const auth = require('../middleware/auth');
const AnalysisReport = require('../models/AnalysisReport');
const { parseRepoUrl, getRepositoryData } = require('../services/githubService');
const { scoreReadmeQuality, scoreRepositoryHealth } = require('../services/scoringEngine');
const { analyzeWithAI } = require('../services/aiService');
const router = express.Router();

// POST /api/analyses - Create new analysis
router.post('/', auth, async (req, res) => {
  const startTime = Date.now();
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'Repository URL is required.' });

    // Parse and validate URL
    let repoInfo;
    try {
      repoInfo = parseRepoUrl(url);
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }

    // Check for duplicate in-progress analysis
    const existing = await AnalysisReport.findOne({
      userId: req.userId,
      'repository.fullName': repoInfo.fullName,
      status: { $in: ['pending', 'fetching', 'scoring', 'analyzing'] }
    });
    if (existing) {
      return res.status(409).json({
        error: 'An analysis for this repository is already in progress.',
        analysisId: existing._id
      });
    }

    // Create initial report
    const report = await AnalysisReport.create({
      userId: req.userId,
      repository: repoInfo,
      source: { provider: 'github', retrievedAt: new Date(), readmeAvailable: false, dataCompleteness: 'minimal' },
      status: 'fetching'
    });

    // Return immediately, process async
    res.status(202).json({ message: 'Analysis started', analysisId: report._id, status: 'fetching' });

    // Process analysis asynchronously
    processAnalysis(report._id, repoInfo, req.userId, startTime).catch(err => {
      console.error(`Analysis ${report._id} failed:`, err.message);
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to start analysis. Please try again.' });
  }
});

async function processAnalysis(reportId, repoInfo, userId, startTime) {
  try {
    // Step 1: Fetch GitHub data
    const { repository, source } = await getRepositoryData(repoInfo.owner, repoInfo.name);
    await AnalysisReport.findByIdAndUpdate(reportId, {
      repository, source, status: 'scoring'
    });

    // Step 2: Calculate scores
    const readmeQuality = scoreReadmeQuality(source.readmeContent, source.readmeAvailable);
    const repositoryHealth = scoreRepositoryHealth(source, repository);
    await AnalysisReport.findByIdAndUpdate(reportId, {
      scores: { readmeQuality, repositoryHealth }, status: 'analyzing'
    });

    // Step 3: AI Analysis
    let aiAnalysis;
    let status = 'completed';
    try {
      aiAnalysis = await analyzeWithAI(repository, source, { readmeQuality, repositoryHealth });
    } catch (aiError) {
      console.error('AI analysis failed:', aiError.message);
      aiAnalysis = {
        summary: '', strengths: [], weaknesses: [], suggestions: [],
        limitations: ['AI analysis was unavailable for this report.']
      };
      status = 'completed_with_limitations';
    }

    // Step 4: Save final report
    // Remove readmeContent from stored source to save space
    await AnalysisReport.findByIdAndUpdate(reportId, {
      aiAnalysis,
      status,
      'source.readmeContent': '',
      processingTime: Date.now() - startTime
    });
  } catch (error) {
    await AnalysisReport.findByIdAndUpdate(reportId, {
      status: 'failed',
      statusMessage: error.message,
      processingTime: Date.now() - startTime
    });
  }
}

// GET /api/analyses - List user's analyses
router.get('/', auth, async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 20));
    const skip = (page - 1) * limit;

    const [reports, total] = await Promise.all([
      AnalysisReport.find({ userId: req.userId })
        .select('-aiAnalysis -source.readmeContent')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      AnalysisReport.countDocuments({ userId: req.userId })
    ]);

    res.json({ reports, total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve history.' });
  }
});

// GET /api/analyses/:id - Get single analysis
router.get('/:id', auth, async (req, res) => {
  try {
    const report = await AnalysisReport.findOne({ _id: req.params.id, userId: req.userId }).lean();
    if (!report) return res.status(404).json({ error: 'Analysis not found.' });
    res.json(report);
  } catch (error) {
    if (error.name === 'CastError') return res.status(404).json({ error: 'Analysis not found.' });
    res.status(500).json({ error: 'Failed to retrieve analysis.' });
  }
});

// DELETE /api/analyses/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const report = await AnalysisReport.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!report) return res.status(404).json({ error: 'Analysis not found.' });
    res.json({ message: 'Analysis deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete analysis.' });
  }
});

// GET /api/analyses/leaderboard - Global top repositories
router.get('/leaderboard', auth, async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 20));
    const language = req.query.language || '';
    const search = req.query.search || '';
    const skip = (page - 1) * limit;

    const filter = { status: { $in: ['completed', 'completed_with_limitations'] } };
    if (language) filter['repository.language'] = new RegExp(`^${language}$`, 'i');
    if (search) filter['repository.fullName'] = new RegExp(search, 'i');

    const [reports, total] = await Promise.all([
      AnalysisReport.find(filter)
        .select('repository scores status createdAt')
        .sort({ 'scores.repositoryHealth.value': -1, 'scores.readmeQuality.value': -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      AnalysisReport.countDocuments(filter)
    ]);

    res.json({ reports, total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve leaderboard data.' });
  }
});

// POST /api/analyses/compare - Compare multiple analyses
router.post('/compare', auth, async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length < 2 || ids.length > 4) {
      return res.status(400).json({ error: 'Please provide between 2 and 4 analysis IDs to compare.' });
    }

    const reports = await AnalysisReport.find({
      _id: { $in: ids },
      userId: req.userId
    }).lean();

    if (reports.length !== ids.length) {
      return res.status(404).json({ error: 'One or more specified analyses were not found.' });
    }

    // Sort reports in the same order as requested IDs
    const orderedReports = ids.map(id => reports.find(r => r._id.toString() === id.toString()));

    res.json({ reports: orderedReports });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate comparison.' });
  }
});

// GET /api/analyses/export - Export all user analysis reports
router.get('/export', auth, async (req, res) => {
  try {
    const reports = await AnalysisReport.find({ userId: req.userId }).lean();
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename=analysis_history_${Date.now()}.json`);
    res.json({ exportedAt: new Date().toISOString(), total: reports.length, reports });
  } catch (error) {
    res.status(500).json({ error: 'Failed to export analysis data.' });
  }
});

module.exports = router;

