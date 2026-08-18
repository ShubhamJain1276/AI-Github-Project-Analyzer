const mongoose = require('mongoose');

const scoreComponentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  value: { type: Number, required: true },
  maxValue: { type: Number, required: true },
  weight: { type: Number, required: true },
  available: { type: Boolean, default: true },
  details: { type: String, default: '' }
}, { _id: false });

const scoreSchema = new mongoose.Schema({
  value: { type: Number, required: true },
  scale: { type: Number, default: 100 },
  version: { type: String, default: '1.0' },
  components: [scoreComponentSchema]
}, { _id: false });

const suggestionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  priority: { type: String, enum: ['high', 'medium', 'low'], default: 'medium' },
  evidence: { type: String, default: '' }
}, { _id: false });

const aiAnalysisSchema = new mongoose.Schema({
  summary: { type: String, default: '' },
  strengths: [{ type: String }],
  weaknesses: [{ type: String }],
  suggestions: [suggestionSchema],
  limitations: [{ type: String }]
}, { _id: false });

const repositorySchema = new mongoose.Schema({
  owner: { type: String, required: true },
  name: { type: String, required: true },
  fullName: { type: String, required: true },
  url: { type: String, required: true },
  defaultBranch: { type: String, default: 'main' },
  description: { type: String, default: '' },
  language: { type: String, default: '' },
  stars: { type: Number, default: 0 },
  forks: { type: Number, default: 0 },
  openIssues: { type: Number, default: 0 },
  watchers: { type: Number, default: 0 },
  size: { type: Number, default: 0 },
  topics: [{ type: String }],
  license: { type: String, default: '' },
  hasWiki: { type: Boolean, default: false },
  hasPages: { type: Boolean, default: false },
  archived: { type: Boolean, default: false },
  createdAt: { type: Date },
  updatedAt: { type: Date },
  pushedAt: { type: Date }
}, { _id: false });

const sourceSchema = new mongoose.Schema({
  provider: { type: String, default: 'github' },
  retrievedAt: { type: Date, required: true },
  readmeAvailable: { type: Boolean, default: false },
  readmeContent: { type: String, default: '' },
  dataCompleteness: { type: String, enum: ['complete', 'partial', 'minimal'], default: 'complete' },
  languages: { type: Map, of: Number, default: {} },
  contributorsCount: { type: Number, default: 0 },
  commitsCount: { type: Number, default: 0 },
  pullRequestsCount: { type: Number, default: 0 },
  releasesCount: { type: Number, default: 0 },
  hasCI: { type: Boolean, default: false },
  hasTests: { type: Boolean, default: false },
  hasLinter: { type: Boolean, default: false },
  hasDependencyManifest: { type: Boolean, default: false },
  hasLockfile: { type: Boolean, default: false },
  hasContributing: { type: Boolean, default: false },
  hasCodeOfConduct: { type: Boolean, default: false },
  hasChangelog: { type: Boolean, default: false }
}, { _id: false });

const analysisReportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  repository: {
    type: repositorySchema,
    required: true
  },
  source: {
    type: sourceSchema,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'fetching', 'scoring', 'analyzing', 'completed', 'failed', 'completed_with_limitations'],
    default: 'pending',
    index: true
  },
  statusMessage: {
    type: String,
    default: ''
  },
  scores: {
    readmeQuality: { type: scoreSchema },
    repositoryHealth: { type: scoreSchema }
  },
  aiAnalysis: {
    type: aiAnalysisSchema,
    default: {}
  },
  processingTime: {
    type: Number, // milliseconds
    default: 0
  }
}, {
  timestamps: true
});

// Compound index for user queries
analysisReportSchema.index({ userId: 1, createdAt: -1 });
analysisReportSchema.index({ userId: 1, 'repository.fullName': 1 });

module.exports = mongoose.model('AnalysisReport', analysisReportSchema);
