import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { History as HistoryIcon, FileText, Activity, Search, Trash2, ExternalLink, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import Navbar from '../components/Navbar';
import InteractiveBg from '../components/InteractiveBg';
import { analysisAPI } from '../api/client';
import toast from 'react-hot-toast';

const stagger = { animate: { transition: { staggerChildren: 0.05 } } };
const fadeUp = { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } } };

export default function History() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => { loadReports(); }, [page]);

  const loadReports = async () => {
    setLoading(true);
    try {
      const res = await analysisAPI.getAll(page, 20);
      setReports(res.data.reports || []);
      setTotalPages(res.data.pages || 1);
    } catch { toast.error('Failed to load history'); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm('Delete this analysis report?')) return;
    try {
      await analysisAPI.delete(id);
      toast.success('Report deleted');
      loadReports();
    } catch { toast.error('Failed to delete report'); }
  };

  const getStatusStyle = (s) => ({
    completed:                  'bg-black text-white border-black',
    completed_with_limitations: 'bg-slate-200 text-black border-black',
    failed:                     'bg-white text-black border-black line-through',
  }[s] || 'bg-white text-black border-black');

  return (
    <div className="min-h-screen bg-[#fdfdfd] text-black relative overflow-x-hidden">
      <Navbar />

      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <InteractiveBg />
      </div>

      <main className="relative z-10 pt-28 pb-16 px-4 sm:px-6 lg:px-8 mx-auto max-w-5xl">
        <motion.div initial="initial" animate="animate" variants={stagger}>
          {/* Header */}
          <motion.div variants={fadeUp} className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="border-[3px] border-black bg-black text-white px-3 py-1.5 flex items-center gap-2 text-xs font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]">
                <HistoryIcon size={12} />
                Analysis Log
              </div>
              <div className="h-[3px] flex-1 bg-black max-w-[80px]" />
            </div>
            <h1
              className="text-5xl font-black tracking-tighter leading-none"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              History
            </h1>
          </motion.div>

          {loading ? (
            <div className="space-y-4">
              {[1,2,3,4].map(i => (
                <motion.div key={i} variants={fadeUp} className="border-[3px] border-black bg-white p-6 animate-pulse">
                  <div className="h-4 bg-slate-200 w-1/3 mb-3" />
                  <div className="h-3 bg-slate-100 w-1/2" />
                </motion.div>
              ))}
            </div>
          ) : reports.length === 0 ? (
            <motion.div variants={fadeUp} className="relative">
              <div className="absolute inset-0 translate-x-2 translate-y-2 bg-black" />
              <div className="relative border-[3px] border-black bg-white p-16 text-center">
                <div className="w-16 h-16 border-[3px] border-black bg-black text-white flex items-center justify-center mx-auto mb-5">
                  <Search size={24} />
                </div>
                <p className="font-black text-xl mb-2">No analysis reports yet</p>
                <p className="text-slate-500 text-sm mb-6">Start by analyzing a GitHub repository.</p>
                <Link to="/dashboard" className="inline-flex items-center gap-2 font-black text-xs uppercase tracking-widest border-b-2 border-black hover:opacity-60 transition-opacity">
                  Go to Dashboard →
                </Link>
              </div>
            </motion.div>
          ) : (
            <>
              <div className="space-y-3">
                {reports.map((r, i) => (
                  <motion.div key={r._id} variants={fadeUp} className="relative group">
                    <div className="absolute inset-0 translate-x-1.5 translate-y-1.5 bg-black group-hover:translate-x-2 group-hover:translate-y-2 transition-transform" />
                    <Link
                      to={`/report/${r._id}`}
                      className="relative flex items-center gap-4 border-[3px] border-black bg-white p-5 transition-colors hover:bg-slate-50 block"
                    >
                      <div className="w-1.5 h-12 bg-black shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1.5 flex-wrap">
                          <span className="font-mono text-sm font-black truncate">{r.repository?.fullName}</span>
                          <span className={`px-2 py-0.5 border-2 text-[9px] font-black uppercase tracking-widest ${getStatusStyle(r.status)}`}>
                            {r.status?.replace(/_/g, ' ')}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 font-mono flex items-center gap-1.5">
                          <Clock size={11} />
                          {new Date(r.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          {r.repository?.language && ` · ${r.repository.language}`}
                        </p>
                      </div>
                      <div className="flex items-center gap-5 shrink-0">
                        {r.scores?.readmeQuality && (
                          <div className="text-center">
                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-0.5">README</p>
                            <div className="flex items-center gap-1">
                              <FileText size={13} />
                              <span className="font-black text-sm">{r.scores.readmeQuality.value}</span>
                            </div>
                          </div>
                        )}
                        {r.scores?.repositoryHealth && (
                          <div className="text-center">
                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-0.5">HEALTH</p>
                            <div className="flex items-center gap-1">
                              <Activity size={13} />
                              <span className="font-black text-sm">{r.scores.repositoryHealth.value}</span>
                            </div>
                          </div>
                        )}
                        <button onClick={(e) => handleDelete(r._id, e)}
                          className="p-2 border-[2px] border-transparent hover:border-black text-slate-300 hover:text-black transition-all opacity-0 group-hover:opacity-100 cursor-pointer">
                          <Trash2 size={14} />
                        </button>
                        <div className="w-8 h-8 border-[2px] border-black flex items-center justify-center text-slate-400 group-hover:bg-black group-hover:text-white transition-colors">
                          <ExternalLink size={13} />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <motion.div variants={fadeUp} className="flex items-center justify-center gap-3 mt-10">
                  <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page <= 1}
                    className="p-2.5 border-[3px] border-black hover:bg-black hover:text-white disabled:opacity-30 transition-colors cursor-pointer">
                    <ChevronLeft size={16} />
                  </button>
                  <span className="text-xs font-black uppercase tracking-widest px-4 py-2 border-[3px] border-black bg-white">
                    Page {page} / {totalPages}
                  </span>
                  <button onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page >= totalPages}
                    className="p-2.5 border-[3px] border-black hover:bg-black hover:text-white disabled:opacity-30 transition-colors cursor-pointer">
                    <ChevronRight size={16} />
                  </button>
                </motion.div>
              )}
            </>
          )}
        </motion.div>
      </main>
    </div>
  );
}
