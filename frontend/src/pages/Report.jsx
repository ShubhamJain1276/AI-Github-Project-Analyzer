import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ExternalLink, Star, Clock, GitBranch, Code2, Users, GitPullRequest,
  Tag, CheckCircle2, AlertTriangle, Lightbulb, Info, Sparkles, FileText,
  Activity, ArrowLeft, RefreshCw, Shield
} from 'lucide-react';
import Navbar from '../components/Navbar';
import ScoreRing from '../components/ScoreRing';
import { analysisAPI, favoritesAPI } from '../api/client';
import toast from 'react-hot-toast';

const POLL_INTERVAL = 3000;
const statusSteps = [
  { key: 'fetching', label: 'Retrieving data', color: 'bg-white border-black', icon: GitBranch },
  { key: 'scoring', label: 'Calculating scores', color: 'bg-slate-200 border-black', icon: Activity },
  { key: 'analyzing', label: 'AI analysis', color: 'bg-slate-300 border-black', icon: Sparkles },
  { key: 'completed', label: 'Complete', color: 'bg-black text-white border-black', icon: CheckCircle2 },
];

const priorityColors = { high: 'bg-black text-white border-black border-2', medium: 'bg-slate-200 text-black border-black border-2', low: 'bg-white text-black border-black border-2' };

export default function Report() {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [favoriteId, setFavoriteId] = useState(null);

  const fetchReport = useCallback(async () => {
    try {
      const res = await analysisAPI.getOne(id);
      setReport(res.data);
      setError(null);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load report');
      return null;
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  // Poll for updates
  useEffect(() => {
    if (!report || ['completed', 'completed_with_limitations', 'failed'].includes(report.status)) return;
    const interval = setInterval(async () => {
      const updated = await fetchReport();
      if (updated && ['completed', 'completed_with_limitations', 'failed'].includes(updated.status)) {
        clearInterval(interval);
      }
    }, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [report?.status, fetchReport]);

  // Check favorites
  useEffect(() => {
    if (!report) return;
    favoritesAPI.getAll().then(res => {
      const fav = res.data.favorites?.find(f => f.analysisId?._id === id || f.analysisId === id);
      if (fav) { setIsFavorited(true); setFavoriteId(fav._id); }
    }).catch(() => {});
  }, [report, id]);

  const toggleFavorite = async () => {
    try {
      if (isFavorited) {
        await favoritesAPI.delete(favoriteId);
        setIsFavorited(false); setFavoriteId(null);
        toast.success('Removed from favorites');
      } else {
        const res = await favoritesAPI.create(id);
        setIsFavorited(true); setFavoriteId(res.data.favorite._id);
        toast.success('Added to favorites');
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update favorite');
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-50"><Navbar />
      <div className="pt-24 flex justify-center"><div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" /></div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-slate-50"><Navbar />
      <div className="pt-24 max-w-2xl mx-auto px-4 text-center">
        <AlertTriangle size={48} className="mx-auto text-black mb-4" />
        <h2 className="text-xl font-bold text-slate-900 mb-2">Unable to load report</h2>
        <p className="text-slate-500 mb-6">{error}</p>
        <Link to="/dashboard" className="text-blue-600 hover:underline">← Back to Dashboard</Link>
      </div>
    </div>
  );

  const isProcessing = !['completed', 'completed_with_limitations', 'failed'].includes(report.status);
  const currentStep = statusSteps.findIndex(s => s.key === report.status);

  return (
    <div className="min-h-screen bg-slate-50 relative">
      <div className="absolute top-0 left-0 right-0 h-64 bg-slate-900 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-3xl opacity-50" />
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-50 to-transparent" />
      </div>
      <Navbar />
      <main className="relative pt-24 pb-16 px-4 sm:px-6 lg:px-8 mx-auto max-w-5xl z-10">
        <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-300 hover:text-white mb-8 transition-colors drop-shadow-sm">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>

        {/* Processing State */}
        {isProcessing && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="card p-8 mb-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Analyzing {report.repository?.fullName}...</h2>
            <div className="flex items-center gap-4 mb-8">
              {statusSteps.slice(0, -1).map((step, i) => {
                const isActive = i === currentStep;
                const isDone = i < currentStep;
                return (
                  <div key={step.key} className="flex items-center gap-2 flex-1">
                    <div className={`w-8 h-8 flex items-center justify-center text-sm border-2 border-black ${
                      isDone ? 'bg-black text-white' : isActive ? `${step.color} animate-pulse` : 'bg-white text-black'
                    }`}>
                      {isDone ? <CheckCircle2 size={16} /> : <step.icon size={16} className={isActive ? '' : 'text-slate-400'} />}
                    </div>
                    <span className={`text-sm ${isActive ? 'font-bold text-black' : isDone ? 'font-bold text-black' : 'text-slate-500'}`}>
                      {step.label}
                    </span>
                    {i < statusSteps.length - 2 && <div className={`flex-1 h-1 border-b-2 border-black border-dashed ${isDone ? 'border-solid' : 'opacity-30'}`} />}
                  </div>
                );
              })}
            </div>
            <p className="text-sm text-slate-400">This may take 15-30 seconds. The page will update automatically.</p>
          </motion.div>
        )}

        {/* Failed State */}
        {report.status === 'failed' && (
          <div className="bg-red-50 rounded-2xl border border-red-200 p-8 text-center mb-6">
            <AlertTriangle size={40} className="mx-auto text-red-500 mb-3" />
            <h2 className="text-xl font-bold text-slate-900 mb-2">Analysis Failed</h2>
            <p className="text-slate-600 mb-4">{report.statusMessage || 'An error occurred during analysis.'}</p>
            <Link to="/dashboard" className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700 transition">
              <RefreshCw size={16} /> Try Again
            </Link>
          </div>
        )}

        {/* Report Content */}
        {['completed', 'completed_with_limitations'].includes(report.status) && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            {/* Report Header */}
            <div className="card p-8 shadow-sm relative overflow-hidden bg-white/90 backdrop-blur-sm border-slate-200/80">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <h1 className="text-2xl font-bold font-mono text-black tracking-tight uppercase border-2 border-black px-2">{report.repository?.fullName}</h1>
                    <span className="px-2.5 py-0.5 text-xs font-bold border-2 border-black bg-black text-white">
                      {report.status === 'completed_with_limitations' ? 'Completed with limitations' : 'Completed'}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-black font-semibold">
                    {report.repository?.language && <span className="flex items-center gap-1"><Code2 size={14} /> {report.repository.language}</span>}
                    <span className="flex items-center gap-1"><Star size={14} /> {report.repository?.stars}</span>
                    <span className="flex items-center gap-1"><GitBranch size={14} /> {report.repository?.forks} forks</span>
                    {report.repository?.license && <span className="flex items-center gap-1"><Shield size={14} /> {report.repository.license}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={toggleFavorite}
                    className={`btn-neo p-2 transition-colors cursor-pointer ${isFavorited ? 'bg-black text-white' : 'bg-white text-black'}`}>
                    <Star size={18} fill={isFavorited ? 'currentColor' : 'none'} />
                  </button>
                  <a href={report.repository?.url} target="_blank" rel="noopener noreferrer"
                    className="btn-neo inline-flex items-center gap-1.5 px-4 py-2 text-sm bg-white text-black hover:bg-slate-200">
                    <ExternalLink size={14} /> View on GitHub
                  </a>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap gap-4 text-xs text-slate-400">
                <span className="flex items-center gap-1"><Clock size={12} /> Analyzed: {new Date(report.source?.retrievedAt || report.createdAt).toLocaleString()}</span>
                <span>Data: {report.source?.dataCompleteness}</span>
                {report.processingTime && <span>Time: {(report.processingTime / 1000).toFixed(1)}s</span>}
              </div>
            </div>

            {/* Score Cards */}
            <div className="grid gap-6 md:grid-cols-2">
              <ScoreCard
                title="README Quality Score" icon={FileText} color="blue"
                score={report.scores?.readmeQuality} />
              <ScoreCard
                title="Repository Health Score" icon={Activity} color="cyan"
                score={report.scores?.repositoryHealth} />
            </div>

            {/* AI Analysis */}
            {report.aiAnalysis && (
              <div className="card border-purple-200 shadow-sm overflow-hidden bg-white">
                <div className="px-6 py-5 bg-gradient-to-r from-purple-50 to-white border-b border-purple-100 flex items-center gap-3">
                  <div className="p-1.5 bg-purple-100 rounded-lg shadow-inner">
                    <Sparkles size={18} className="text-purple-600" />
                  </div>
                  <h2 className="text-lg font-bold text-slate-900">AI Analysis</h2>
                  <span className="ml-auto px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-semibold uppercase tracking-wider">Interpretation</span>
                </div>

                <div className="p-6 space-y-6">
                  {/* Summary */}
                  {report.aiAnalysis.summary && (
                    <div>
                      <h3 className="text-sm font-semibold text-slate-700 mb-2">Summary</h3>
                      <p className="text-slate-600 leading-relaxed">{report.aiAnalysis.summary}</p>
                    </div>
                  )}

                  {/* Strengths */}
                  {report.aiAnalysis.strengths?.length > 0 && (
                    <div>
                      <h3 className="text-sm font-bold text-black mb-2 flex items-center gap-1.5 uppercase border-b-2 border-black inline-flex">
                        <CheckCircle2 size={16} /> Strengths
                      </h3>
                      <ul className="space-y-2">
                        {report.aiAnalysis.strengths.map((s, i) => (
                          <li key={i} className="flex gap-2 text-sm text-black font-semibold">
                            <CheckCircle2 size={14} className="text-black shrink-0 mt-0.5" />
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Weaknesses */}
                  {report.aiAnalysis.weaknesses?.length > 0 && (
                    <div>
                      <h3 className="text-sm font-bold text-black mb-2 flex items-center gap-1.5 uppercase border-b-2 border-black inline-flex">
                        <AlertTriangle size={16} /> Weaknesses
                      </h3>
                      <ul className="space-y-2">
                        {report.aiAnalysis.weaknesses.map((w, i) => (
                          <li key={i} className="flex gap-2 text-sm text-black font-semibold">
                            <AlertTriangle size={14} className="text-black shrink-0 mt-0.5" />
                            {w}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Suggestions */}
                  {report.aiAnalysis.suggestions?.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-blue-700 mb-3 flex items-center gap-1.5">
                        <Lightbulb size={16} /> Improvement Suggestions
                      </h3>
                      <div className="space-y-3">
                        {report.aiAnalysis.suggestions.map((s, i) => (
                          <div key={i} className={`rounded-xl border p-4 ${priorityColors[s.priority] || priorityColors.medium}`}>
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-semibold text-sm">{s.title}</h4>
                              <span className="text-xs uppercase font-bold opacity-70">{s.priority}</span>
                            </div>
                            <p className="text-sm opacity-80">{s.description}</p>
                            {s.evidence && <p className="text-xs mt-2 opacity-60 italic">Evidence: {s.evidence}</p>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Limitations */}
                  {report.aiAnalysis.limitations?.length > 0 && (
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                      <h3 className="text-xs font-semibold text-slate-500 mb-2 flex items-center gap-1">
                        <Info size={12} /> Analysis Limitations
                      </h3>
                      <ul className="space-y-1">
                        {report.aiAnalysis.limitations.map((l, i) => (
                          <li key={i} className="text-xs text-slate-500">{l}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Disclaimer */}
            <div className="bg-slate-100 rounded-xl p-4 text-xs text-slate-500 text-center">
              <p>Scores are heuristic summaries of observable repository signals. This is not a security audit, code correctness proof, or production-readiness certification.</p>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}

function ScoreCard({ title, icon: Icon, color, score }) {
  if (!score) return null;
  const colorMap = {
    blue: { ring: '#2563EB', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-100' },
    cyan: { ring: '#06B6D4', bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-100' }
  };
  const c = colorMap[color] || colorMap.blue;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className={`card ${c.border} shadow-sm p-6`}>
      <div className="flex items-center gap-2 mb-4">
        <div className={`p-1.5 rounded-lg ${c.bg}`}><Icon size={18} className={c.text} /></div>
        <h2 className="font-semibold text-slate-900">{title}</h2>
      </div>
      <div className="flex items-start gap-6">
        <ScoreRing score={score.value} maxScore={score.scale} color={c.ring} size={100} strokeWidth={7} />
        <div className="flex-1 space-y-2">
          {score.components?.map((comp, i) => (
            <div key={i}>
              <div className="flex items-center justify-between text-xs mb-0.5">
                <span className={`${comp.available ? 'text-slate-600' : 'text-slate-400 italic'}`}>
                  {comp.name} {!comp.available && '(N/A)'}
                </span>
                <span className="font-mono font-semibold text-slate-700">{comp.value}/{comp.maxValue}</span>
              </div>
              <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${(comp.value / comp.maxValue) * 100}%`,
                    backgroundColor: comp.value / comp.maxValue >= 0.7 ? '#059669' : comp.value / comp.maxValue >= 0.4 ? '#F59E0B' : '#ef4444'
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <p className="mt-4 text-xs text-slate-400">Version: {score.version} • Scale: 0-{score.scale}</p>
    </motion.div>
  );
}
