import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, GitBranch, ArrowRight, Activity, FileText, Trash2, ExternalLink, Bookmark } from 'lucide-react';
import Navbar from '../components/Navbar';
import InteractiveBg from '../components/InteractiveBg';
import { favoritesAPI } from '../api/client';
import toast from 'react-hot-toast';

const stagger = { animate: { transition: { staggerChildren: 0.05 } } };
const fadeUp = { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } } };

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const res = await favoritesAPI.getAll();
      setFavorites(res.data || []);
    } catch {
      toast.error('Failed to load saved favorites');
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await favoritesAPI.delete(id);
      setFavorites(favorites.filter(f => f._id !== id));
      toast.success('Removed from bookmarks');
    } catch {
      toast.error('Failed to remove favorite');
    }
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
                <Bookmark size={13} /> Saved Bookmarks
              </div>
              <div className="h-[3px] flex-1 bg-black max-w-[80px]" />
            </div>
            <h1
              className="text-5xl font-black tracking-tighter leading-none mb-3"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              Starred Repositories
            </h1>
            <p className="text-slate-500 font-medium text-base max-w-2xl">
              Quick access to your bookmarked analysis reports and key repository metrics.
            </p>
          </motion.div>

          {/* Body */}
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="border-[3px] border-black bg-white p-6 animate-pulse">
                  <div className="h-5 bg-slate-200 w-3/4 mb-4" />
                  <div className="h-4 bg-slate-100 w-1/2" />
                </div>
              ))}
            </div>
          ) : favorites.length === 0 ? (
            <motion.div variants={fadeUp} className="relative">
              <div className="absolute inset-0 translate-x-2 translate-y-2 bg-black" />
              <div className="relative border-[3px] border-black bg-white p-16 text-center">
                <div className="w-16 h-16 border-[3px] border-black bg-black text-white flex items-center justify-center mx-auto mb-5">
                  <Star size={24} />
                </div>
                <h3 className="font-black text-xl mb-2">No Bookmarked Repositories</h3>
                <p className="text-slate-500 text-sm mb-6 max-w-md mx-auto">
                  Click the star icon on any repository analysis report to save it to your bookmarks for quick reference.
                </p>
                <Link to="/dashboard" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest px-6 py-3 border-[3px] border-black bg-black text-white hover:bg-slate-800 transition-colors">
                  Go to Dashboard →
                </Link>
              </div>
            </motion.div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((fav) => {
                const report = fav.analysisId;
                if (!report) return null;
                return (
                  <motion.div key={fav._id} variants={fadeUp} className="relative group">
                    <div className="absolute inset-0 translate-x-2 translate-y-2 bg-black group-hover:translate-x-2.5 group-hover:translate-y-2.5 transition-transform" />
                    <div className="relative border-[3px] border-black bg-white p-6 flex flex-col justify-between h-full">
                      <div>
                        <div className="flex items-start justify-between gap-3 mb-4">
                          <div className="w-10 h-10 border-[2px] border-black bg-black text-white flex items-center justify-center font-bold shrink-0">
                            <GitBranch size={18} />
                          </div>
                          <button
                            onClick={(e) => removeFavorite(fav._id, e)}
                            className="p-1.5 border-[2px] border-black bg-yellow-400 hover:bg-yellow-300 transition-colors cursor-pointer"
                            title="Remove bookmark"
                          >
                            <Star size={16} fill="currentColor" className="text-black" />
                          </button>
                        </div>

                        <h3 className="font-mono text-base font-black truncate mb-1">
                          {report.repository?.fullName}
                        </h3>
                        <p className="text-[11px] text-slate-400 font-mono mb-6">
                          Language: {report.repository?.language || 'Unknown'}
                        </p>
                      </div>

                      <div>
                        <div className="grid grid-cols-2 gap-3 mb-5 pt-4 border-t-[2px] border-black">
                          <div className="border-[2px] border-black p-2 text-center bg-slate-50">
                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Health</p>
                            <p className="font-mono font-black text-base flex items-center justify-center gap-1">
                              <Activity size={13} /> {report.scores?.repositoryHealth?.value || report.scores?.health || '--'}
                            </p>
                          </div>
                          <div className="border-[2px] border-black p-2 text-center bg-slate-50">
                            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-0.5">README</p>
                            <p className="font-mono font-black text-base flex items-center justify-center gap-1">
                              <FileText size={13} /> {report.scores?.readmeQuality?.value || report.scores?.readme || '--'}
                            </p>
                          </div>
                        </div>

                        <Link
                          to={`/report/${report._id}`}
                          className="w-full py-2.5 border-[2px] border-black bg-black text-white font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors"
                        >
                          View Report <ArrowRight size={14} />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

        </motion.div>
      </main>
    </div>
  );
}
