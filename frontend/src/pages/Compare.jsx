import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  GitBranch, ArrowRight, CheckCircle2, AlertTriangle, Sparkles,
  FileText, Activity, Shield, Star, Scale, Plus, X, ArrowUpDown
} from 'lucide-react';
import Navbar from '../components/Navbar';
import InteractiveBg from '../components/InteractiveBg';
import ScoreRing from '../components/ScoreRing';
import { analysisAPI } from '../api/client';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import toast from 'react-hot-toast';

const stagger = { animate: { transition: { staggerChildren: 0.08 } } };
const fadeUp = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } } };

export default function Compare() {
  useDocumentTitle('Side-by-Side Compare', 'Benchmark public GitHub repositories side-by-side on performance, documentation coverage, and AI signals.');
  const location = useLocation();

  const [historyReports, setHistoryReports] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [comparedReports, setComparedReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const res = await analysisAPI.getAll(1, 50);
      const reports = res.data.reports || [];
      setHistoryReports(reports);

      // Check if location state passed IDs
      if (location.state?.ids && Array.isArray(location.state.ids)) {
        setSelectedIds(location.state.ids);
        runComparison(location.state.ids);
      } else if (reports.length >= 2) {
        // Default to selecting top 2 reports
        const initial = [reports[0]._id, reports[1]._id];
        setSelectedIds(initial);
        runComparison(initial);
      }
    } catch {
      toast.error('Failed to load analysis history');
    } finally {
      setLoadingHistory(false);
    }
  };

  const toggleSelect = (id) => {
    if (selectedIds.includes(id)) {
      if (selectedIds.length <= 2) {
        toast.error('You need at least 2 repositories selected to compare.');
        return;
      }
      const updated = selectedIds.filter(i => i !== id);
      setSelectedIds(updated);
      runComparison(updated);
    } else {
      if (selectedIds.length >= 4) {
        toast.error('You can compare up to 4 repositories at once.');
        return;
      }
      const updated = [...selectedIds, id];
      setSelectedIds(updated);
      runComparison(updated);
    }
  };

  const runComparison = async (ids) => {
    if (ids.length < 2) return;
    setLoading(true);
    try {
      const res = await analysisAPI.compare(ids);
      setComparedReports(res.data.reports || []);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to generate comparison report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfdfd] text-black relative overflow-x-hidden">
      <Navbar />

      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <InteractiveBg />
      </div>

      <main className="relative z-10 pt-28 pb-20 px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl">
        <motion.div initial="initial" animate="animate" variants={stagger}>

          {/* Header */}
          <motion.div variants={fadeUp} className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="border-[3px] border-black bg-black text-white px-3 py-1.5 flex items-center gap-2 text-xs font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]">
                <Scale size={13} /> Side-by-Side Benchmark
              </div>
              <div className="h-[3px] flex-1 bg-black max-w-[80px]" />
            </div>
            <h1
              className="text-5xl font-black tracking-tighter leading-none mb-3"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              Compare Repositories
            </h1>
            <p className="text-slate-500 font-medium text-base max-w-2xl">
              Evaluate performance metrics, documentation coverage, automation signals, and AI insights across multiple projects.
            </p>
          </motion.div>

          {/* Repository Selector */}
          <motion.div variants={fadeUp} className="relative mb-12">
            <div className="absolute inset-0 translate-x-2 translate-y-2 bg-black" />
            <div className="relative border-[3px] border-black bg-white p-6">
              <div className="flex items-center justify-between mb-4 pb-3 border-b-[2px] border-black">
                <h3 className="font-black text-sm uppercase tracking-widest flex items-center gap-2">
                  <ArrowUpDown size={15} /> Select Repositories to Compare ({selectedIds.length}/4)
                </h3>
                <span className="text-xs font-mono text-slate-500">Pick 2 to 4 reports</span>
              </div>

              {loadingHistory ? (
                <div className="h-16 flex items-center justify-center">
                  <div className="w-6 h-6 border-[3px] border-black border-t-transparent animate-spin" />
                </div>
              ) : historyReports.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-sm font-bold mb-2">No analyses found in your history.</p>
                  <Link to="/dashboard" className="text-xs font-black uppercase tracking-widest underline">
                    Run your first analysis →
                  </Link>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2.5">
                  {historyReports.map(r => {
                    const isSelected = selectedIds.includes(r._id);
                    return (
                      <button
                        key={r._id}
                        onClick={() => toggleSelect(r._id)}
                        className={`px-3.5 py-2 border-[2px] border-black font-mono text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                          isSelected
                            ? 'bg-black text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,0.3)]'
                            : 'bg-white text-black hover:bg-slate-100'
                        }`}
                      >
                        {isSelected ? <CheckCircle2 size={13} /> : <Plus size={13} />}
                        {r.repository?.fullName}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>

          {/* Comparison Output */}
          {loading ? (
            <div className="p-16 border-[3px] border-black bg-white text-center">
              <div className="w-10 h-10 border-[3px] border-black border-t-transparent animate-spin mx-auto mb-4" />
              <p className="font-black text-sm uppercase tracking-widest">Generating Comparative Matrix...</p>
            </div>
          ) : comparedReports.length < 2 ? (
            <div className="p-16 border-[3px] border-black bg-white text-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <div className="w-14 h-14 border-[3px] border-black bg-black text-white flex items-center justify-center mx-auto mb-4">
                <Scale size={24} />
              </div>
              <h3 className="font-black text-xl mb-2">Select At Least 2 Repositories</h3>
              <p className="text-slate-500 text-sm max-w-md mx-auto">
                Choose two or more repositories from the selector above to compare their health, readme quality, and repository signals side-by-side.
              </p>
            </div>
          ) : (
            <div className="space-y-12">
              {/* Score Rings Comparison Row */}
              <motion.div variants={fadeUp} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {comparedReports.map((report) => (
                  <div key={report._id} className="relative group">
                    <div className="absolute inset-0 translate-x-2 translate-y-2 bg-black" />
                    <div className="relative border-[3px] border-black bg-white p-6 flex flex-col justify-between h-full">
                      <div>
                        <div className="flex items-center justify-between mb-3 border-b-[2px] border-black pb-3">
                          <h2 className="font-mono text-sm font-black truncate">{report.repository?.fullName}</h2>
                          <Link to={`/report/${report._id}`} className="text-[10px] font-black uppercase underline">
                            View
                          </Link>
                        </div>
                        <div className="flex items-center justify-around my-6">
                          <div className="text-center">
                            <ScoreRing score={report.scores?.repositoryHealth?.value || 0} maxScore={100} size={76} strokeWidth={6} color="#000" />
                            <p className="text-[10px] font-black uppercase tracking-widest mt-2 text-slate-400">Health</p>
                          </div>
                          <div className="text-center">
                            <ScoreRing score={report.scores?.readmeQuality?.value || 0} maxScore={100} size={76} strokeWidth={6} color="#475569" />
                            <p className="text-[10px] font-black uppercase tracking-widest mt-2 text-slate-400">README</p>
                          </div>
                        </div>
                      </div>
                      <div className="pt-3 border-t-[2px] border-black text-[11px] font-mono space-y-1">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Stars:</span>
                          <span className="font-bold">{report.repository?.stars}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Language:</span>
                          <span className="font-bold">{report.repository?.language || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">CI/CD:</span>
                          <span className="font-bold">{report.source?.hasCI ? 'Yes' : 'No'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>

              {/* Detailed Signals Matrix Table */}
              <motion.div variants={fadeUp} className="relative">
                <div className="absolute inset-0 translate-x-2 translate-y-2 bg-black" />
                <div className="relative border-[3px] border-black bg-white overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-black text-white font-mono uppercase tracking-widest text-[11px]">
                        <th className="p-4 border-r border-white/20 w-48">Signal Metric</th>
                        {comparedReports.map(r => (
                          <th key={r._id} className="p-4 border-r border-white/20 font-bold">
                            {r.repository?.fullName}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y-[2px] divide-black font-mono">
                      {[
                        { label: 'Health Score', key: r => `${r.scores?.repositoryHealth?.value || 0}/100` },
                        { label: 'README Score', key: r => `${r.scores?.readmeQuality?.value || 0}/100` },
                        { label: 'Primary Language', key: r => r.repository?.language || 'Unknown' },
                        { label: 'GitHub Stars', key: r => r.repository?.stars },
                        { label: 'Forks', key: r => r.repository?.forks },
                        { label: 'Open Issues', key: r => r.repository?.openIssues },
                        { label: 'License', key: r => r.repository?.license || 'None' },
                        { label: 'Continuous Integration', key: r => r.source?.hasCI ? '✅ Configured' : '❌ Missing' },
                        { label: 'Test Suite', key: r => r.source?.hasTests ? '✅ Present' : '❌ Missing' },
                        { label: 'Linter Setup', key: r => r.source?.hasLinter ? '✅ Present' : '❌ Missing' },
                        { label: 'Contributing Guide', key: r => r.source?.hasContributing ? '✅ Present' : '❌ Missing' },
                        { label: 'Code of Conduct', key: r => r.source?.hasCodeOfConduct ? '✅ Present' : '❌ Missing' },
                      ].map((row, idx) => (
                        <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                          <td className="p-4 font-black border-r-[2px] border-black bg-slate-100">{row.label}</td>
                          {comparedReports.map(r => (
                            <td key={r._id} className="p-4 border-r-[2px] border-black font-bold">
                              {row.key(r)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>

              {/* AI Insights Comparison Section */}
              <motion.div variants={fadeUp} className="relative">
                <div className="absolute inset-0 translate-x-2 translate-y-2 bg-black" />
                <div className="relative border-[3px] border-black bg-white p-8">
                  <div className="flex items-center gap-2 mb-6 border-b-[2px] border-black pb-4">
                    <Sparkles size={18} className="text-black" />
                    <h3 className="font-black text-base uppercase tracking-widest">AI Insights Head-to-Head</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {comparedReports.map(r => (
                      <div key={r._id} className="border-[2px] border-black p-5 bg-slate-50 space-y-4">
                        <h4 className="font-mono text-sm font-black uppercase border-b-2 border-black pb-2">
                          {r.repository?.fullName}
                        </h4>
                        {r.aiAnalysis?.summary ? (
                          <div>
                            <p className="text-xs font-bold text-slate-500 uppercase mb-1">Executive Summary</p>
                            <p className="text-xs text-slate-700 leading-relaxed font-medium">{r.aiAnalysis.summary}</p>
                          </div>
                        ) : (
                          <p className="text-xs text-slate-400 italic">No summary available.</p>
                        )}
                        {r.aiAnalysis?.strengths?.length > 0 && (
                          <div>
                            <p className="text-xs font-bold text-black uppercase mb-1 flex items-center gap-1">
                              <CheckCircle2 size={13} /> Key Strengths
                            </p>
                            <ul className="space-y-1">
                              {r.aiAnalysis.strengths.slice(0, 3).map((st, i) => (
                                <li key={i} className="text-[11px] font-medium text-slate-700">• {st}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

            </div>
          )}

        </motion.div>
      </main>
    </div>
  );
}
