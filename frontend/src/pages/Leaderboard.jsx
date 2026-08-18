import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, Search, Filter, GitBranch, ArrowRight, Activity, FileText, ChevronLeft, ChevronRight, Medal } from 'lucide-react';
import Navbar from '../components/Navbar';
import InteractiveBg from '../components/InteractiveBg';
import { analysisAPI } from '../api/client';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import toast from 'react-hot-toast';

const stagger = { animate: { transition: { staggerChildren: 0.05 } } };
const fadeUp = { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } } };

const LANGUAGES = ['All', 'JavaScript', 'TypeScript', 'Python', 'Go', 'Rust', 'Java', 'C++', 'PHP', 'Ruby'];

export default function Leaderboard() {
  useDocumentTitle('Public Leaderboard', 'Discover top open source repositories ranked by code health, hygiene, and documentation quality.');
  const [reports, setReports] = useState([]);

  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedLang, setSelectedLang] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchLeaderboard();
  }, [page, selectedLang]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const lang = selectedLang === 'All' ? '' : selectedLang;
      const res = await analysisAPI.getLeaderboard(page, 20, lang, searchQuery);
      setReports(res.data.reports || []);
      setTotalPages(res.data.pages || 1);
    } catch {
      toast.error('Failed to load leaderboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchLeaderboard();
  };

  const getRankBadge = (rank) => {
    if (rank === 1) return <span className="bg-yellow-400 text-black border-2 border-black px-2 py-0.5 font-black text-xs flex items-center gap-1"><Medal size={13} /> 1ST</span>;
    if (rank === 2) return <span className="bg-slate-300 text-black border-2 border-black px-2 py-0.5 font-black text-xs flex items-center gap-1"><Medal size={13} /> 2ND</span>;
    if (rank === 3) return <span className="bg-amber-600 text-white border-2 border-black px-2 py-0.5 font-black text-xs flex items-center gap-1"><Medal size={13} /> 3RD</span>;
    return <span className="font-mono font-black text-sm text-slate-500">#{rank}</span>;
  };

  return (
    <div className="min-h-screen bg-[#fdfdfd] text-black relative overflow-x-hidden">
      <Navbar />

      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <InteractiveBg />
      </div>

      <main className="relative z-10 pt-28 pb-20 px-4 sm:px-6 lg:px-8 mx-auto max-w-6xl">
        <motion.div initial="initial" animate="animate" variants={stagger}>

          {/* Header */}
          <motion.div variants={fadeUp} className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="border-[3px] border-black bg-black text-white px-3 py-1.5 flex items-center gap-2 text-xs font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]">
                <Trophy size={13} /> Public Index
              </div>
              <div className="h-[3px] flex-1 bg-black max-w-[80px]" />
            </div>
            <h1
              className="text-5xl font-black tracking-tighter leading-none mb-3"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              Repository Leaderboard
            </h1>
            <p className="text-slate-500 font-medium text-base max-w-2xl">
              Discover top-rated open-source repositories ranked by health metrics, code hygiene, and README documentation quality.
            </p>
          </motion.div>

          {/* Search & Language Filters */}
          <motion.div variants={fadeUp} className="relative mb-10">
            <div className="absolute inset-0 translate-x-2 translate-y-2 bg-black" />
            <div className="relative border-[3px] border-black bg-white p-6 flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Search Bar */}
              <form onSubmit={handleSearchSubmit} className="w-full md:w-auto flex-1 flex border-[2px] border-black">
                <input
                  type="text"
                  placeholder="Search repository by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-4 py-2 font-mono text-sm focus:outline-none bg-white"
                />
                <button type="submit" className="bg-black text-white px-4 py-2 font-black uppercase tracking-widest text-xs border-l-[2px] border-black hover:bg-slate-800">
                  <Search size={14} />
                </button>
              </form>

              {/* Language Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
                <Filter size={14} className="text-slate-400 shrink-0 mr-1" />
                {LANGUAGES.map(lang => (
                  <button
                    key={lang}
                    onClick={() => { setSelectedLang(lang); setPage(1); }}
                    className={`px-3 py-1.5 border-[2px] border-black text-xs font-mono font-bold whitespace-nowrap transition-colors cursor-pointer ${
                      selectedLang === lang ? 'bg-black text-white' : 'bg-white text-black hover:bg-slate-100'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Leaderboard Table / Cards */}
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="border-[3px] border-black bg-white p-6 animate-pulse">
                  <div className="h-4 bg-slate-200 w-1/3 mb-3" />
                  <div className="h-3 bg-slate-100 w-1/2" />
                </div>
              ))}
            </div>
          ) : reports.length === 0 ? (
            <div className="border-[3px] border-black bg-white p-16 text-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <div className="w-14 h-14 border-[3px] border-black bg-black text-white flex items-center justify-center mx-auto mb-4">
                <Search size={24} />
              </div>
              <h3 className="font-black text-xl mb-2">No Repositories Found</h3>
              <p className="text-slate-500 text-sm mb-6">No analyzed repositories match your search criteria.</p>
              <button
                onClick={() => { setSelectedLang('All'); setSearchQuery(''); fetchLeaderboard(); }}
                className="px-5 py-2.5 bg-black text-white text-xs font-black uppercase tracking-widest border-[2px] border-black hover:bg-slate-800"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {reports.map((r, index) => {
                const rank = (page - 1) * 20 + index + 1;
                return (
                  <motion.div key={r._id} variants={fadeUp} className="relative group">
                    <div className="absolute inset-0 translate-x-1.5 translate-y-1.5 bg-black group-hover:translate-x-2 group-hover:translate-y-2 transition-transform" />
                    <Link
                      to={`/report/${r._id}`}
                      className="relative flex items-center gap-4 border-[3px] border-black bg-white p-5 hover:bg-slate-50 transition-colors block"
                    >
                      <div className="w-12 text-center shrink-0">
                        {getRankBadge(rank)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="font-mono text-base font-black truncate">{r.repository?.fullName}</span>
                          {r.repository?.language && (
                            <span className="px-2 py-0.5 border border-black text-[10px] font-mono font-bold bg-slate-100">
                              {r.repository.language}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 font-mono">
                          ⭐ {r.repository?.stars || 0} stars · Analyzed {new Date(r.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </p>
                      </div>

                      <div className="flex items-center gap-6 shrink-0">
                        <div className="text-center">
                          <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Health Score</p>
                          <div className="flex items-center gap-1 text-black font-black text-lg font-mono">
                            <Activity size={15} />
                            {r.scores?.repositoryHealth?.value || '--'}
                          </div>
                        </div>

                        <div className="text-center">
                          <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-0.5">README Score</p>
                          <div className="flex items-center gap-1 text-slate-700 font-black text-lg font-mono">
                            <FileText size={15} />
                            {r.scores?.readmeQuality?.value || '--'}
                          </div>
                        </div>

                        <div className="w-8 h-8 border-[2px] border-black flex items-center justify-center text-slate-400 group-hover:bg-black group-hover:text-white transition-colors">
                          <ArrowRight size={15} />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}

              {/* Pagination */}
              {totalPages > 1 && (
                <motion.div variants={fadeUp} className="flex items-center justify-center gap-3 mt-10">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1}
                    className="p-2.5 border-[3px] border-black hover:bg-black hover:text-white disabled:opacity-30 transition-colors cursor-pointer bg-white">
                    <ChevronLeft size={16} />
                  </button>
                  <span className="text-xs font-black uppercase tracking-widest px-4 py-2 border-[3px] border-black bg-white">
                    Page {page} / {totalPages}
                  </span>
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages}
                    className="p-2.5 border-[3px] border-black hover:bg-black hover:text-white disabled:opacity-30 transition-colors cursor-pointer bg-white">
                    <ChevronRight size={16} />
                  </button>
                </motion.div>
              )}
            </div>
          )}

        </motion.div>
      </main>
    </div>
  );
}
