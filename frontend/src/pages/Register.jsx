import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FolderGit2, Mail, Lock, User, Eye, EyeOff, ArrowRight, Terminal, Sparkles, Shield, Activity } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const fadeUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } } };
const stagger = { animate: { transition: { staggerChildren: 0.08 } } };

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(username, email, password);
      toast.success('Account created! Welcome!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#fdfdfd]">
      {/* ── Left Panel ── */}
      <div className="hidden lg:flex lg:w-1/2 bg-black text-white relative overflow-hidden flex-col justify-between p-12">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)', backgroundSize: '24px 24px' }}
        />
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{ background: 'repeating-linear-gradient(-45deg, transparent, transparent 14px, #fff 14px, #fff 15px)' }}
        />

        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <div className="h-10 w-10 border-[3px] border-white bg-white text-black flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(255,255,255,0.2)]">
              <FolderGit2 size={20} />
            </div>
            <span className="font-black text-sm uppercase tracking-widest">AI GitHub Analyzer</span>
          </Link>
        </div>

        <motion.div initial="initial" animate="animate" variants={stagger} className="relative z-10 max-w-md">
          <motion.h2
            variants={fadeUp}
            className="text-5xl font-black leading-[1.05] tracking-tighter mb-8"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            Understand<br />codebases<br />at a glance.
          </motion.h2>
          <motion.div variants={fadeUp} className="w-16 h-1 bg-white mb-10" />

          <div className="space-y-6">
            {[
              { icon: Activity, title: 'Instant Health Scores', desc: 'Immediate insights into repo maintenance and hygiene.' },
              { icon: Sparkles, title: 'AI-Powered Analysis', desc: 'Evidence-grounded strengths, weaknesses, and suggestions.' },
              { icon: Shield,   title: 'Transparent Methodology', desc: 'Every score shows its components. No black boxes.' },
            ].map(({ icon: Icon, title, desc }, i) => (
              <motion.div key={i} variants={fadeUp} className="flex items-start gap-4">
                <div className="p-2.5 border-[2px] border-white/30 bg-white/5 shrink-0">
                  <Icon size={18} />
                </div>
                <div>
                  <h3 className="font-black text-sm uppercase tracking-wider mb-1">{title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="relative z-10 text-xs font-mono text-slate-600 uppercase tracking-widest">
          © {new Date().getFullYear()} AI GitHub Project Analyzer
        </div>
      </div>

      {/* ── Right Panel ── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
        <div className="absolute top-0 left-0 w-12 h-[3px] bg-black" />
        <div className="absolute top-0 left-0 h-12 w-[3px] bg-black" />
        <div className="absolute bottom-0 right-0 w-12 h-[3px] bg-black" />
        <div className="absolute bottom-0 right-0 h-12 w-[3px] bg-black" />

        <Link to="/" className="lg:hidden absolute top-6 left-6 flex items-center gap-2">
          <div className="h-8 w-8 border-[2px] border-black bg-black text-white flex items-center justify-center">
            <FolderGit2 size={16} />
          </div>
          <span className="font-black text-xs uppercase tracking-widest">AI Analyzer</span>
        </Link>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md">
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 bg-black text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 mb-5 border-[2px] border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,0.15)]">
              <Terminal size={10} />
              New Account
            </div>
            <h1
              className="text-4xl font-black tracking-tighter mb-2"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              Create account
            </h1>
            <p className="text-slate-500 text-sm font-medium">Start analyzing repositories in seconds.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="username" className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Username</label>
              <div className="relative group">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-black transition-colors" />
                <input
                  id="username" type="text" value={username} onChange={e => setUsername(e.target.value)}
                  placeholder="johndoe" required minLength={3} maxLength={30}
                  className="w-full pl-11 pr-4 py-4 border-[3px] border-black bg-white text-black font-mono text-sm focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow placeholder:text-slate-400"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Email Address</label>
              <div className="relative group">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-black transition-colors" />
                <input
                  id="email" type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@company.com" required
                  className="w-full pl-11 pr-4 py-4 border-[3px] border-black bg-white text-black font-mono text-sm focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow placeholder:text-slate-400"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Password</label>
              <div className="relative group">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-black transition-colors" />
                <input
                  id="password" type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••" required minLength={6}
                  className="w-full pl-11 pr-12 py-4 border-[3px] border-black bg-white text-black font-mono text-sm focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow placeholder:text-slate-400"
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-black cursor-pointer transition-colors">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <p className="mt-2 text-[10px] font-mono text-slate-400 uppercase tracking-wider">Minimum 6 characters</p>
            </div>

            <div className="relative pt-2">
              <div className="absolute inset-0 translate-x-1.5 translate-y-1.5 bg-black pointer-events-none mt-2" style={{ height: '56px' }} />
              <button
                type="submit" disabled={loading}
                className="relative w-full h-14 bg-black text-white font-black uppercase tracking-widest text-sm border-[3px] border-black hover:bg-slate-800 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-3 disabled:opacity-60"
              >
                {loading ? (
                  <><div className="w-4 h-4 border-2 border-white/40 border-t-white animate-spin" /> Creating account...</>
                ) : (
                  <>Create Account <ArrowRight size={16} /></>
                )}
              </button>
            </div>

            <div className="text-center mt-8 pt-6 border-t-[2px] border-slate-200">
              <p className="text-sm text-slate-500">
                Already have an account?{' '}
                <Link to="/login" className="font-black text-black uppercase text-xs tracking-wider border-b-2 border-black hover:opacity-60 transition-opacity">
                  Sign In
                </Link>
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
