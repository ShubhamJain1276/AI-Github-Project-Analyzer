import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  User, Activity, Calendar, GitBranch, Mail, Loader2, ArrowLeft,
  TrendingUp, Clock, FileText, Sparkles, Key, Download, Trash2, ShieldAlert, Check
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import Navbar from '../components/Navbar';
import InteractiveBg from '../components/InteractiveBg';
import { useAuth } from '../context/AuthContext';
import { analysisAPI, authAPI } from '../api/client';
import toast from 'react-hot-toast';

const stagger = { animate: { transition: { staggerChildren: 0.08 } } };
const fadeUp = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } } };

function CountUp({ target, duration = 1200 }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (target === 0) return;
    let start = 0;
    const step = Math.max(1, Math.ceil(target / (duration / 16)));
    const interval = setInterval(() => {
      start += step;
      if (start >= target) { setVal(target); clearInterval(interval); }
      else setVal(start);
    }, 16);
    return () => clearInterval(interval);
  }, [target, duration]);
  return <>{val}</>;
}

export default function Profile() {
  const { user, isAuthenticated, loading: authLoading, logout } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]);
  const [langData, setLangData] = useState([]);
  
  // Settings Form State
  const [username, setUsername] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [updating, setUpdating] = useState(false);

  // Account Deletion State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleting, setDeleting] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) navigate('/login');
  }, [isAuthenticated, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      setUsername(user.username || '');
      fetchAnalytics();
    }
  }, [user]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await analysisAPI.getAll(1, 100);
      const reports = res.data.reports || [];
      setHistory(reports);

      // Activity chart (last 14 days)
      const counts = {};
      for (let i = 13; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        counts[d.toISOString().split('T')[0]] = 0;
      }
      reports.forEach(r => {
        const ds = new Date(r.createdAt).toISOString().split('T')[0];
        if (counts[ds] !== undefined) counts[ds]++;
      });
      setChartData(Object.keys(counts).map(date => ({
        name: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        searches: counts[date],
      })));

      // Language breakdown
      const langs = {};
      reports.forEach(r => {
        const lang = r.repository?.language || 'Unknown';
        langs[lang] = (langs[lang] || 0) + 1;
      });
      setLangData(
        Object.entries(langs)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 6)
          .map(([name, count]) => ({ name, count }))
      );
    } catch {
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      await authAPI.updateProfile({
        username,
        currentPassword: newPassword ? currentPassword : undefined,
        newPassword: newPassword || undefined
      });
      toast.success('Profile updated successfully');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setUpdating(false);
    }
  };

  const handleExportData = async () => {
    try {
      const res = await analysisAPI.exportData();
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `analysis_history_${Date.now()}.json`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Export started!');
    } catch {
      toast.error('Failed to export analysis history');
    }
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    if (!deletePassword) {
      toast.error('Please enter your password to confirm deletion');
      return;
    }
    setDeleting(true);
    try {
      await authAPI.deleteAccount(deletePassword);
      toast.success('Account deleted successfully');
      logout();
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to delete account');
    } finally {
      setDeleting(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-[#fdfdfd] flex items-center justify-center">
        <div className="w-10 h-10 border-[3px] border-black border-t-transparent animate-spin" />
      </div>
    );
  }

  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=000000&color=ffffff&bold=true&size=256&font-size=0.4`;

  const totalSearches = history.length;
  const completedSearches = history.filter(h => h.status === 'completed' || h.status === 'completed_with_limitations').length;
  const avgHealth = history.length
    ? Math.round(history.reduce((acc, curr) => acc + (curr.scores?.repositoryHealth?.value || 0), 0) / history.length)
    : 0;
  const avgReadme = history.length
    ? Math.round(history.reduce((acc, curr) => acc + (curr.scores?.readmeQuality?.value || 0), 0) / history.length)
    : 0;
  const successRate = history.length ? Math.round((completedSearches / history.length) * 100) : 0;
  const memberSince = new Date(user.createdAt || Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'long' });

  const stats = [
    { icon: Activity,    label: 'Total Analyses', value: totalSearches, suffix: '' },
    { icon: TrendingUp,  label: 'Avg Health',     value: avgHealth,     suffix: '/100' },
    { icon: FileText,    label: 'Avg README',     value: avgReadme,     suffix: '/100' },
    { icon: Sparkles,    label: 'Success Rate',   value: successRate,   suffix: '%' },
  ];

  return (
    <div className="min-h-screen bg-[#fdfdfd] text-black relative overflow-x-hidden">
      <Navbar />

      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <InteractiveBg />
      </div>

      <main className="relative z-10 pt-28 pb-20 px-4 sm:px-6 lg:px-8 mx-auto max-w-6xl">
        <motion.div initial="initial" animate="animate" variants={stagger}>

          {/* Back */}
          <motion.div variants={fadeUp}>
            <Link to="/dashboard" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-black mb-8 transition-colors">
              <ArrowLeft size={14} /> Dashboard
            </Link>
          </motion.div>

          {/* ── Profile Header ── */}
          <motion.div variants={fadeUp} className="relative mb-12">
            <div className="absolute inset-0 translate-x-2 translate-y-2 bg-black" />
            <div className="relative border-[3px] border-black bg-white p-8 md:p-10 flex flex-col md:flex-row items-center gap-8">
              {/* Avatar */}
              <div className="relative shrink-0">
                <div className="absolute inset-0 translate-x-2 translate-y-2 bg-black" />
                <div className="relative w-28 h-28 md:w-36 md:h-36 border-[3px] border-black overflow-hidden bg-slate-100">
                  <img src={avatarUrl} alt={user.username} className="w-full h-full object-cover" />
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 text-center md:text-left">
                <div className="inline-flex items-center gap-2 bg-black text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 mb-4 border-[2px] border-black">
                  <User size={10} /> User Profile
                </div>
                <h1
                  className="text-4xl md:text-5xl font-black tracking-tighter mb-3 break-all leading-none"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  {user.username}
                </h1>
                <div className="flex flex-col sm:flex-row items-center md:items-start gap-3 text-sm text-slate-500">
                  <span className="flex items-center gap-1.5 font-mono">
                    <Mail size={14} /> {user.email}
                  </span>
                  <span className="hidden sm:block">·</span>
                  <span className="flex items-center gap-1.5 font-mono">
                    <Calendar size={14} /> Member since {memberSince}
                  </span>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-col gap-2 shrink-0">
                <button
                  onClick={handleExportData}
                  className="px-4 py-2.5 bg-white text-black font-black text-xs uppercase tracking-widest border-[2px] border-black hover:bg-slate-100 flex items-center gap-2 cursor-pointer shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                >
                  <Download size={13} /> Export JSON Data
                </button>
              </div>
            </div>
          </motion.div>

          {/* ── Stats Grid ── */}
          <motion.div variants={fadeUp} className="grid grid-cols-2 lg:grid-cols-4 border-[3px] border-black bg-white mb-12 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            {stats.map(({ icon: Icon, label, value, suffix }, i) => (
              <div key={i} className={`p-6 md:p-8 text-center ${i > 0 ? 'border-l-[3px] border-black' : ''}`}>
                <div className="w-10 h-10 border-[2px] border-black flex items-center justify-center mx-auto mb-3 bg-slate-50">
                  <Icon size={18} />
                </div>
                <p className="text-3xl md:text-4xl font-black mb-1">
                  {loading ? '—' : <CountUp target={value} />}
                  <span className="text-base text-slate-400 font-normal">{suffix}</span>
                </p>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</p>
              </div>
            ))}
          </motion.div>

          {/* ── Charts Row ── */}
          <div className="grid lg:grid-cols-[1.4fr_0.6fr] gap-6 mb-12">
            {/* Activity Chart */}
            <motion.div variants={fadeUp} className="relative">
              <div className="absolute inset-0 translate-x-2 translate-y-2 bg-black" />
              <div className="relative border-[3px] border-black bg-white p-6 pt-10">
                <div className="absolute top-0 left-0 bg-black text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 border-r-[3px] border-b-[3px] border-black">
                  Search Activity — Last 14 Days
                </div>

                {loading ? (
                  <div className="h-64 flex items-center justify-center">
                    <div className="w-8 h-8 border-[3px] border-black border-t-transparent animate-spin" />
                  </div>
                ) : (
                  <div className="h-64 w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                        <defs>
                          <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#000" stopOpacity={0.15} />
                            <stop offset="95%" stopColor="#000" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} dy={8} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} allowDecimals={false} />
                        <Tooltip
                          contentStyle={{ backgroundColor: '#fff', border: '3px solid #000', borderRadius: 0, boxShadow: '4px 4px 0 0 #000', fontWeight: 900 }}
                          labelStyle={{ color: '#94a3b8', fontWeight: 700, marginBottom: 4, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em' }}
                          itemStyle={{ color: '#000', fontWeight: 900 }}
                        />
                        <Area type="monotone" dataKey="searches" stroke="#000" strokeWidth={3} fillOpacity={1} fill="url(#grad)" dot={{ fill: '#000', stroke: '#000', strokeWidth: 2, r: 3 }} activeDot={{ r: 5, stroke: '#000', strokeWidth: 3, fill: '#fff' }} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Language Breakdown */}
            <motion.div variants={fadeUp} className="relative">
              <div className="absolute inset-0 translate-x-2 translate-y-2 bg-black" />
              <div className="relative border-[3px] border-black bg-white p-6 pt-10 h-full">
                <div className="absolute top-0 left-0 bg-black text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 border-r-[3px] border-b-[3px] border-black">
                  Languages
                </div>

                {loading ? (
                  <div className="h-64 flex items-center justify-center">
                    <div className="w-8 h-8 border-[3px] border-black border-t-transparent animate-spin" />
                  </div>
                ) : langData.length === 0 ? (
                  <div className="h-64 flex items-center justify-center text-slate-400 text-xs font-mono uppercase tracking-wider">
                    No data yet
                  </div>
                ) : (
                  <div className="h-64 w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={langData} layout="vertical" margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                        <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} allowDecimals={false} />
                        <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#000', fontSize: 11, fontWeight: 900 }} width={75} />
                        <Tooltip
                          contentStyle={{ backgroundColor: '#fff', border: '3px solid #000', borderRadius: 0, boxShadow: '4px 4px 0 0 #000' }}
                          itemStyle={{ color: '#000', fontWeight: 900 }}
                        />
                        <Bar dataKey="count" fill="#000" maxBarSize={18} radius={0} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* ── Settings Section ── */}
          <motion.div variants={fadeUp} className="relative mb-12">
            <div className="absolute inset-0 translate-x-2 translate-y-2 bg-black" />
            <div className="relative border-[3px] border-black bg-white p-8">
              <h2 className="font-black text-xl uppercase tracking-widest flex items-center gap-3 mb-6 border-b-[2px] border-black pb-3">
                <Key size={18} /> Account & Security Settings
              </h2>

              <form onSubmit={handleUpdateProfile} className="space-y-6 max-w-xl">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider mb-2">Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full border-[2px] border-black px-4 py-2.5 font-mono text-sm focus:bg-slate-50 focus:outline-none"
                    required
                  />
                </div>

                <div className="pt-4 border-t-[2px] border-slate-200">
                  <p className="text-xs font-bold text-slate-500 uppercase mb-4">Change Password (Optional)</p>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-mono mb-1">Current Password</label>
                      <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full border-[2px] border-black px-4 py-2 font-mono text-sm focus:bg-slate-50 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono mb-1">New Password</label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full border-[2px] border-black px-4 py-2 font-mono text-sm focus:bg-slate-50 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-2">
                  <button
                    type="submit"
                    disabled={updating}
                    className="px-6 py-3 bg-black text-white font-black text-xs uppercase tracking-widest border-[2px] border-black hover:bg-slate-800 disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                  >
                    {updating ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />} Save Settings
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowDeleteModal(true)}
                    className="px-4 py-3 bg-red-50 text-red-700 font-black text-xs uppercase tracking-widest border-[2px] border-red-700 hover:bg-red-100 flex items-center gap-2 ml-auto cursor-pointer"
                  >
                    <Trash2 size={14} /> Delete Account
                  </button>
                </div>
              </form>
            </div>
          </motion.div>

        </motion.div>
      </main>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative max-w-md w-full">
            <div className="absolute inset-0 translate-x-2 translate-y-2 bg-black" />
            <div className="relative border-[3px] border-black bg-white p-6">
              <div className="flex items-center gap-2 text-red-600 font-black uppercase text-xs tracking-wider mb-2">
                <ShieldAlert size={16} /> Danger Zone
              </div>
              <h3 className="font-black text-2xl mb-2" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                Permanently Delete Account?
              </h3>
              <p className="text-xs text-slate-600 mb-6 font-medium leading-relaxed">
                This action is immediate and non-reversible. All your saved reports, favorites, and profile data will be permanently wiped.
              </p>

              <form onSubmit={handleDeleteAccount} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono font-bold mb-1">Confirm Password</label>
                  <input
                    type="password"
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                    placeholder="Enter password to confirm"
                    className="w-full border-[2px] border-black px-4 py-2 font-mono text-sm focus:outline-none"
                    required
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowDeleteModal(false)}
                    className="flex-1 py-2.5 border-[2px] border-black font-black text-xs uppercase tracking-widest bg-white hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={deleting}
                    className="flex-1 py-2.5 border-[2px] border-black font-black text-xs uppercase tracking-widest bg-red-600 text-white hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {deleting ? <Loader2 size={14} className="animate-spin" /> : 'Confirm Purge'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
