import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight, Search, Clock, Activity, FileText,
  ExternalLink, Terminal, Zap, GitBranch
} from 'lucide-react';
import Navbar from '../components/Navbar';
import InteractiveBg from '../components/InteractiveBg';
import { analysisAPI } from '../api/client';
import toast from 'react-hot-toast';

const stagger = { animate: { transition: { staggerChildren: 0.07 } } };
const fadeUp = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } } };

export default function Dashboard() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [recentReports, setRecentReports] = useState([]);
  const [loadingRecent, setLoadingRecent] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.url) {
      setUrl(location.state.url);
      window.history.replaceState({}, document.title);
    }
    loadRecent();
  }, [location.state]);

  const loadRecent = async () => {
    try {
      const res = await analysisAPI.getAll(1, 5);
      setRecentReports(res.data.reports || []);
    } catch { /* ignore */ }
    finally { setLoadingRecent(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!url.trim()) return;
    setLoading(true);
    try {
      const res = await analysisAPI.create(url.trim());
      toast.success('Analysis started!');
      navigate(`/report/${res.data.analysisId}`);
    } catch (err) {
      if (err.response?.status === 409) {
        toast('Analysis already in progress', { icon: '⏳' });
        navigate(`/report/${err.response.data.analysisId}`);
      } else {
        toast.error(err.response?.data?.error || 'Failed to start analysis');
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status) => {
    const map = {
      completed:                 'bg-black text-white border-black',
      completed_with_limitations:'bg-slate-200 text-black border-black',
      failed:                    'bg-white text-black border-black line-through',
      pending:                   'bg-slate-100 text-slate-600 border-black',
      fetching:                  'bg-white text-black border-black',
      scoring:                   'bg-slate-100 text-black border-black',
      analyzing:                 'bg-slate-200 text-black border-black',
    };
    return map[status] || 'bg-white text-black border-black';
  };

  return (
    <div className="min-h-screen bg-[#fdfdfd] text-black relative overflow-x-hidden">
      <Navbar />

      {/* Full-page interactive background */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <InteractiveBg />
      </div>

      {/* Accent corner bars */}
      <div className="fixed top-16 left-0 w-16 h-[3px] bg-black z-10" />
      <div className="fixed top-16 left-0 w-[3px] h-16 bg-black z-10" />
      <div className="fixed bottom-0 right-0 w-16 h-[3px] bg-black z-10" />
      <div className="fixed bottom-0 right-0 w-[3px] h-16 bg-black z-10" />

      <main className="relative z-10 pt-24 pb-16 px-4 sm:px-6 lg:px-8 mx-auto max-w-5xl">

        {/* Header */}
        <motion.div
          initial="initial" animate="animate" variants={stagger}
          className="mb-12"
        >
          <motion.div variants={fadeUp} className="flex items-center gap-3 mb-6">
            <div className="border-[3px] border-black bg-black text-white px-3 py-1.5 flex items-center gap-2 text-xs font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]">
              <Terminal size={12} />
              Engine Active
            </div>
            <div className="h-[3px] flex-1 bg-black max-w-[80px]" />
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="text-5xl md:text-6xl font-black tracking-tighter mb-4 leading-none"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            Analyze a{' '}
            <span className="relative inline-block">
              <span className="relative z-10">Repository</span>
              <span className="absolute bottom-1 left-0 right-0 h-3 bg-slate-200 -z-0" />
            </span>
          </motion.h1>

          <motion.p variants={fadeUp} className="text-slate-500 text-lg max-w-2xl font-medium">
            Enter any public GitHub URL to generate a comprehensive AI-powered report
            with deterministic scoring and LLM-generated insights.
          </motion.p>
        </motion.div>

        {/* URL Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16"
        >
          <form onSubmit={handleSubmit} className="relative">
            {/* Shadow layer */}
            <div className="absolute inset-0 translate-x-2 translate-y-2 bg-black pointer-events-none" />
            <div className="relative border-[3px] border-black bg-white flex flex-col sm:flex-row">
              <div className="relative flex-1 group">
                <GitBranch
                  size={18}
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-black transition-colors"
                />
                <input
                  type="url"
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  placeholder="https://github.com/owner/repository"
                  required
                  className="w-full pl-12 pr-4 py-5 bg-transparent text-black font-mono text-sm focus:outline-none placeholder:text-slate-400 border-r-0 h-16"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="h-16 px-10 bg-black text-white font-black uppercase tracking-widest text-sm border-l-[3px] border-black hover:bg-slate-800 active:translate-x-[2px] active:translate-y-[2px] transition-all flex items-center justify-center gap-2 sm:w-auto w-full disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>Run Analysis <ArrowRight size={16} /></>
                )}
              </button>
            </div>
          </form>
          <p className="mt-3 text-xs font-mono text-slate-400 uppercase tracking-widest">
            Supports any public GitHub repository URL
          </p>
        </motion.div>

        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}
          className="grid grid-cols-3 border-[3px] border-black mb-12 bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
        >
          {[
            { icon: Zap, label: 'AI Scoring', val: 'Live' },
            { icon: Activity, label: 'Avg Time', val: '~15s' },
            { icon: FileText, label: 'Components', val: '14+' },
          ].map(({ icon: Icon, label, val }, i) => (
            <div key={i} className={`p-5 flex flex-col items-center gap-1 ${i > 0 ? 'border-l-[3px] border-black' : ''}`}>
              <Icon size={18} className="text-slate-400 mb-1" />
              <span className="font-black text-xl">{val}</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</span>
            </div>
          ))}
        </motion.div>

        {/* Recent Reports */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-black text-xl uppercase tracking-widest flex items-center gap-3">
              <Clock size={18} />
              Recent Analyses
            </h2>
            <Link
              to="/history"
              className="text-xs font-black uppercase tracking-widest border-b-2 border-black hover:opacity-60 transition-opacity flex items-center gap-1"
            >
              View All <ArrowRight size={12} />
            </Link>
          </div>

          {loadingRecent ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="border-[3px] border-black p-5 animate-pulse bg-white">
                  <div className="h-4 bg-slate-200 w-1/3 mb-3" />
                  <div className="h-3 bg-slate-100 w-1/2" />
                </div>
              ))}
            </div>
          ) : recentReports.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="relative"
            >
              <div className="absolute inset-0 translate-x-2 translate-y-2 bg-black" />
              <div className="relative border-[3px] border-black bg-white p-16 text-center">
                <div className="w-16 h-16 border-[3px] border-black bg-black flex items-center justify-center mx-auto mb-5">
                  <Search size={24} className="text-white" />
                </div>
                <p className="font-black text-xl mb-2">No analyses yet</p>
                <p className="text-slate-500 text-sm">Submit a repository URL above to get your first AI report.</p>
              </div>
            </motion.div>
          ) : (
            <div className="space-y-3">
              {recentReports.map((report, i) => (
                <motion.div
                  key={report._id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * i, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="relative group"
                >
                  {/* Card shadow */}
                  <div className="absolute inset-0 translate-x-1.5 translate-y-1.5 bg-black group-hover:translate-x-2 group-hover:translate-y-2 transition-transform" />
                  <Link
                    to={`/report/${report._id}`}
                    className="relative border-[3px] border-black bg-white p-5 flex items-center justify-between gap-4 transition-colors hover:bg-slate-50 block"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <span className="font-mono text-sm font-black truncate">
                          {report.repository?.fullName}
                        </span>
                        <span className={`px-2 py-0.5 border-2 text-[9px] font-black uppercase tracking-widest ${getStatusStyle(report.status)}`}>
                          {report.status?.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 font-mono flex items-center gap-1.5">
                        <Clock size={11} />
                        {new Date(report.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric', month: 'short', day: 'numeric',
                          hour: '2-digit', minute: '2-digit',
                        })}
                      </p>
                    </div>

                    <div className="flex items-center gap-6 shrink-0">
                      {report.scores?.readmeQuality && (
                        <div className="text-center">
                          <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-0.5">README</p>
                          <div className="flex items-center gap-1">
                            <FileText size={13} />
                            <span className="font-black text-sm">{report.scores.readmeQuality.value}</span>
                          </div>
                        </div>
                      )}
                      {report.scores?.repositoryHealth && (
                        <div className="text-center">
                          <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-0.5">HEALTH</p>
                          <div className="flex items-center gap-1">
                            <Activity size={13} />
                            <span className="font-black text-sm">{report.scores.repositoryHealth.value}</span>
                          </div>
                        </div>
                      )}
                      <div className="w-8 h-8 border-[2px] border-black flex items-center justify-center text-slate-400 group-hover:bg-black group-hover:text-white transition-colors">
                        <ExternalLink size={13} />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
