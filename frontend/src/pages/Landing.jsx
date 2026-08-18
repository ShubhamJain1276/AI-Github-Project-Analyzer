import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import {
  ArrowRight, GitBranch, Shield, History, Sparkles, FileText,
  Activity, Zap, Search, LayoutDashboard, Terminal, Code2
} from 'lucide-react';
import Navbar from '../components/Navbar';
import InteractiveBg from '../components/InteractiveBg';
import { useAuth } from '../context/AuthContext';

const features = [
  { icon: FileText,       title: 'README Quality',      desc: 'Transparent 7-component scoring of documentation completeness, clarity, and structure.',      num: '01' },
  { icon: Activity,       title: 'Repo Health Score',   desc: 'Assess maintenance, collaboration, and project hygiene via live GitHub API signals.',          num: '02' },
  { icon: Sparkles,       title: 'AI Insights',         desc: 'Evidence-grounded strengths, weaknesses, and improvement suggestions from LLM analysis.',      num: '03' },
  { icon: History,        title: 'Analysis History',    desc: 'Revisit full breakdown reports for every repository you have previously analyzed.',             num: '04' },
  { icon: GitBranch,      title: 'Side-by-Side Compare','desc': 'Run two repositories in parallel and compare scores, health metrics, and AI insights head-to-head.',  num: '05' },
  { icon: Shield,         title: 'Transparent Scoring', desc: 'Every score exposes its sub-components, raw values, data version, and analysis timestamp.',     num: '06' },
];

const steps = [
  { icon: Search,         label: '01 — Paste the URL',    desc: 'Drop any public GitHub URL. No OAuth, no setup.',  delay: 0 },
  { icon: Zap,            label: '02 — AI Engine Runs',   desc: 'Deterministic scoring + LLM analysis in ~15s.',    delay: 0.1 },
  { icon: LayoutDashboard,label: '03 — View the Report',  desc: 'Premium structured dashboard with full breakdown.', delay: 0.2 },
];

// Typewriter hook
function useTypewriter(words, speed = 80, pause = 1800) {
  const [text, setText] = useState('');
  const [wordIdx, setWordIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = words[wordIdx];
    let timeout;
    if (!deleting && charIdx < current.length) {
      timeout = setTimeout(() => setCharIdx(c => c + 1), speed);
    } else if (!deleting && charIdx === current.length) {
      timeout = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && charIdx > 0) {
      timeout = setTimeout(() => setCharIdx(c => c - 1), speed / 2);
    } else {
      setDeleting(false);
      setWordIdx(i => (i + 1) % words.length);
    }
    setText(current.slice(0, charIdx));
    return () => clearTimeout(timeout);
  }, [charIdx, deleting, wordIdx, words, speed, pause]);

  return text;
}

// Cursor-tracking tilt card
function TiltCard({ children, className = '' }) {
  const ref = useRef(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [6, -6]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-6, 6]), { stiffness: 200, damping: 20 });

  const onMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const onLeave = () => { mx.set(0); my.set(0); };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const stagger = { animate: { transition: { staggerChildren: 0.08 } } };
const fadeUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } } };

export default function Landing() {
  const [url, setUrl] = useState('');
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const typed = useTypewriter(['before you open them.', 'in seconds.', 'with AI precision.', 'transparently.']);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isAuthenticated) navigate('/dashboard', { state: { url } });
    else navigate('/login', { state: { redirectUrl: url } });
  };

  return (
    <div className="min-h-screen text-black flex flex-col relative bg-[#fdfdfd] overflow-x-hidden">
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative pt-32 pb-20 lg:pt-44 lg:pb-32 flex-1 flex flex-col justify-center overflow-hidden">
        {/* Interactive dot grid */}
        <div className="absolute inset-0 overflow-hidden">
          <InteractiveBg />
        </div>

        {/* Diagonal stripe accent */}
        <div
          className="absolute right-0 top-0 w-1/2 h-full pointer-events-none"
          style={{
            background: 'repeating-linear-gradient(-45deg, transparent, transparent 18px, rgba(0,0,0,0.025) 18px, rgba(0,0,0,0.025) 19px)',
          }}
        />

        {/* Bold border accents */}
        <div className="absolute top-16 left-0 w-24 h-2 bg-black" />
        <div className="absolute bottom-0 right-0 w-2 h-32 bg-black" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            {/* Left — headline */}
            <motion.div initial="initial" animate="animate" variants={stagger}>
              <motion.div
                variants={fadeUp}
                className="inline-flex items-center gap-2 mb-8 border-2 border-black bg-black text-white px-4 py-2 text-xs font-bold uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,0.15)]"
              >
                <Terminal size={12} />
                AI-Powered Repository Engine
              </motion.div>

              <motion.h1
                variants={fadeUp}
                className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.0] tracking-tighter mb-8"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              >
                Understand{' '}
                <span className="inline-block border-b-[6px] border-black">codebases</span>
                <br />
                <span className="relative inline-block">
                  <span className="text-black">{typed}</span>
                  <span className="animate-[blink_1s_step-end_infinite] ml-0.5 text-black">|</span>
                </span>
              </motion.h1>

              <motion.p
                variants={fadeUp}
                className="text-lg text-slate-600 mb-10 leading-relaxed max-w-lg font-medium"
              >
                Submit a public GitHub repository and get a comprehensive first-pass report
                with README quality scores, health metrics, AI-generated insights, and actionable suggestions.
              </motion.p>

              {/* URL Form */}
              <motion.form variants={fadeUp} onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-0 max-w-xl group">
                <div className="flex-1 relative">
                  <Code2 size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://github.com/owner/repo"
                    className="w-full border-3 border-r-0 border-black bg-white text-black font-mono text-sm pl-10 pr-4 py-4 focus:outline-none focus:bg-slate-50 placeholder:text-slate-400 transition-colors h-14"
                    style={{ borderWidth: '3px' }}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="h-14 px-8 bg-black text-white font-black uppercase tracking-widest text-sm border-3 border-black hover:bg-slate-800 active:translate-x-[2px] active:translate-y-[2px] transition-all whitespace-nowrap flex items-center gap-2"
                  style={{ borderWidth: '3px' }}
                >
                  Analyze <ArrowRight size={16} />
                </button>
              </motion.form>
              <motion.p variants={fadeUp} className="mt-3 text-xs text-slate-400 font-mono uppercase tracking-wider">
                Free for public repositories — no credit card required
              </motion.p>
            </motion.div>

            {/* Right — Tilt demo card */}
            <TiltCard className="hidden lg:block">
              <div className="relative">
                {/* Shadow layer */}
                <div className="absolute inset-0 translate-x-3 translate-y-3 bg-black" />
                <div className="relative border-3 border-black bg-white" style={{ borderWidth: '3px' }}>
                  {/* Browser chrome */}
                  <div className="flex items-center gap-3 px-4 py-3 border-b-[3px] border-black bg-slate-50">
                    <div className="flex gap-1.5">
                      {['bg-black', 'bg-slate-400', 'bg-slate-300'].map((c, i) => (
                        <div key={i} className={`h-3 w-3 ${c} border border-black`} />
                      ))}
                    </div>
                    <div className="flex-1 border-[2px] border-black bg-white px-3 py-1 text-[10px] font-mono text-black font-bold">
                      analyzer.dev/report/facebook/react
                    </div>
                  </div>
                  {/* Content */}
                  <div className="p-5 space-y-4">
                    <div className="flex items-center gap-3 border-b-[2px] border-black pb-4">
                      <div className="w-10 h-10 border-[3px] border-black bg-black flex items-center justify-center">
                        <GitBranch size={18} className="text-white" />
                      </div>
                      <div>
                        <p className="font-black text-sm">facebook/react</p>
                        <p className="text-xs text-slate-500 font-mono">analyzed 2m ago</p>
                      </div>
                      <span className="ml-auto border-[2px] border-black bg-black text-white px-2 py-0.5 text-[9px] font-black uppercase">COMPLETED</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {[['Health Score', '92', '/100'], ['README Quality', '87', '/100']].map(([label, val, denom]) => (
                        <div key={label} className="border-[3px] border-black p-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                          <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">{label}</p>
                          <p className="text-2xl font-black">{val}<span className="text-sm font-normal text-slate-400">{denom}</span></p>
                          <div className="mt-2 h-1.5 w-full bg-slate-100 border border-black">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${val}%` }}
                              transition={{ duration: 1.2, delay: 0.5, ease: 'easeOut' }}
                              className="h-full bg-black"
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-[3px] border-black p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles size={12} className="text-black" />
                        <span className="text-[10px] font-black uppercase tracking-widest">AI Insights</span>
                      </div>
                      {[100, 85, 65].map((w, i) => (
                        <motion.div
                          key={i}
                          initial={{ width: 0 }}
                          animate={{ width: `${w}%` }}
                          transition={{ duration: 0.8, delay: 0.8 + i * 0.15, ease: 'easeOut' }}
                          className="h-2 bg-slate-200 mb-1.5 last:mb-0"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </TiltCard>
          </div>
        </div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-xs font-mono text-slate-400 uppercase tracking-widest"
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
            className="w-px h-8 bg-black origin-top"
          />
          scroll
        </motion.div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-24 relative z-10 bg-[#fdfdfd] border-t-[3px] border-black">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial" whileInView="animate" viewport={{ once: true, margin: '-100px' }}
            variants={stagger} className="mb-16"
          >
            <motion.p variants={fadeUp} className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-4">
              Capabilities
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="text-4xl font-black tracking-tight mb-4"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              Everything to understand a repo
            </motion.h2>
            <motion.div variants={fadeUp} className="w-24 h-1.5 bg-black" />
          </motion.div>

          <motion.div
            initial="initial" whileInView="animate" viewport={{ once: true, margin: '-50px' }} variants={stagger}
            className="grid gap-px border-[3px] border-black sm:grid-cols-2 lg:grid-cols-3 bg-black"
          >
            {features.map((f, i) => (
              <motion.div
                key={i} variants={fadeUp}
                whileHover={{ backgroundColor: '#000', color: '#fff' }}
                className="group bg-white p-8 transition-colors duration-150 cursor-default"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="p-3 border-[3px] border-black group-hover:border-white group-hover:bg-white transition-colors">
                    <f.icon size={20} className="text-black group-hover:text-black" />
                  </div>
                  <span className="font-black text-4xl text-slate-100 group-hover:text-slate-700 transition-colors font-mono">
                    {f.num}
                  </span>
                </div>
                <h3 className="text-lg font-black mb-2 tracking-tight">{f.title}</h3>
                <p className="text-sm text-slate-500 group-hover:text-slate-300 leading-relaxed transition-colors">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-24 bg-black text-white relative overflow-hidden">
        {/* Subtle dot grid on dark */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)', backgroundSize: '28px 28px' }}
        />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial" whileInView="animate" viewport={{ once: true, margin: '-80px' }}
            variants={stagger} className="mb-16"
          >
            <motion.p variants={fadeUp} className="text-xs font-black uppercase tracking-[0.3em] text-slate-500 mb-4">
              Process
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="text-4xl font-black tracking-tight mb-4"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              Three steps to clarity
            </motion.h2>
            <motion.div variants={fadeUp} className="w-24 h-1.5 bg-white" />
          </motion.div>

          <motion.div
            initial="initial" whileInView="animate" viewport={{ once: true, margin: '-50px' }} variants={stagger}
            className="grid gap-px border-[3px] border-white lg:grid-cols-3 bg-white"
          >
            {steps.map((s, i) => (
              <motion.div
                key={i} variants={fadeUp}
                className="bg-black p-10 relative"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: s.delay + 0.3, type: 'spring', stiffness: 200 }}
                  className="w-16 h-16 border-[3px] border-white flex items-center justify-center mb-8"
                >
                  <s.icon size={28} className="text-white" />
                </motion.div>
                <h3 className="font-black text-xl mb-3 tracking-tight">{s.label}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{s.desc}</p>
                <div className="absolute top-8 right-8 font-black text-5xl text-slate-800 select-none">
                  {String(i + 1).padStart(2, '0')}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA STRIP ── */}
      <section className="bg-[#fdfdfd] border-t-[3px] border-black py-20">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2
              className="text-4xl md:text-5xl font-black tracking-tighter mb-8"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              Start analyzing now.
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-0 max-w-xl mx-auto">
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://github.com/owner/repo"
                className="flex-1 border-[3px] border-r-0 border-black bg-white font-mono text-sm px-5 py-4 focus:outline-none focus:bg-slate-50 h-14"
                style={{ borderWidth: '3px' }}
              />
              <button
                type="submit"
                className="h-14 px-8 bg-black text-white font-black uppercase tracking-widest text-sm border-[3px] border-black hover:bg-slate-800 active:translate-x-[2px] active:translate-y-[2px] transition-all flex items-center gap-2"
                style={{ borderWidth: '3px' }}
              >
                Go <ArrowRight size={16} />
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t-[3px] border-black py-8 bg-[#fdfdfd]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-3 font-black text-black text-sm">
            <div className="h-7 w-7 border-[3px] border-black bg-black flex items-center justify-center">
              <GitBranch size={14} className="text-white" />
            </div>
            AI GITHUB ANALYZER
          </div>
          <p className="font-mono">© {new Date().getFullYear()} Analysis aid — not an authoritative assessment.</p>
          <a href="/methodology" className="font-black uppercase tracking-widest hover:text-black transition-colors">Methodology →</a>
        </div>
      </footer>

      <style>{`
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
        .border-3 { border-width: 3px; }
      `}</style>
    </div>
  );
}
