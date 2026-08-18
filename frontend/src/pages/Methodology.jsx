import { motion } from 'framer-motion';
import { BookOpen, FileText, Activity, Sparkles, AlertTriangle } from 'lucide-react';
import Navbar from '../components/Navbar';
import InteractiveBg from '../components/InteractiveBg';

const stagger = { animate: { transition: { staggerChildren: 0.06 } } };
const fadeUp = { initial: { opacity: 0, y: 15 }, animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } } };

const readmeComponents = [
  { name: 'Project Overview', weight: '20%', signals: 'Clear purpose, target users, problem addressed, feature list' },
  { name: 'Setup & Installation', weight: '20%', signals: 'Prerequisites, install steps, environment setup, run instructions' },
  { name: 'Usage Documentation', weight: '15%', signals: 'Examples, commands, workflows, screenshots' },
  { name: 'Technical Documentation', weight: '15%', signals: 'Architecture, stack, config, API info' },
  { name: 'Contribution Guidance', weight: '10%', signals: 'Contribution process, branching, dev notes' },
  { name: 'Maintenance & Metadata', weight: '10%', signals: 'License, version, badges, status' },
  { name: 'Readability & Completeness', weight: '10%', signals: 'Headings, lists, links, organization' },
];

const healthComponents = [
  { name: 'Repository Activity', weight: '20%', signals: 'Commit recency and regularity' },
  { name: 'Collaboration Signals', weight: '15%', signals: 'Contributors, PRs, issues, forks' },
  { name: 'Repository Organization', weight: '15%', signals: 'README, CONTRIBUTING, CoC, description' },
  { name: 'Automation & Quality', weight: '15%', signals: 'CI/CD, tests, linting config' },
  { name: 'Dependency & Release', weight: '15%', signals: 'Manifests, lockfiles, releases, versioning' },
  { name: 'Issue & Maintenance', weight: '10%', signals: 'Open issues, archive status, activity' },
  { name: 'Community & Discoverability', weight: '10%', signals: 'Topics, description, license, stars, pages' },
];

function ScoringTable({ icon: Icon, title, subtitle, data }) {
  return (
    <div className="relative mb-10">
      <div className="absolute inset-0 translate-x-2 translate-y-2 bg-black" />
      <div className="relative border-[3px] border-black bg-white overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-4 bg-black text-white">
          <div className="p-2 border-[2px] border-white/30">
            <Icon size={16} />
          </div>
          <div>
            <h2 className="font-black text-sm uppercase tracking-widest">{title}</h2>
            {subtitle && <p className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">{subtitle}</p>}
          </div>
        </div>
        {/* Table */}
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-[3px] border-black">
              <th className="text-left px-6 py-3 text-[10px] font-black uppercase tracking-widest text-slate-500">Component</th>
              <th className="text-center px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-500 w-20">Weight</th>
              <th className="text-left px-6 py-3 text-[10px] font-black uppercase tracking-widest text-slate-500 hidden sm:table-cell">Signals</th>
            </tr>
          </thead>
          <tbody>
            {data.map((c, i) => (
              <tr key={i} className={`${i > 0 ? 'border-t-[2px] border-black' : ''} hover:bg-slate-50 transition-colors`}>
                <td className="px-6 py-3.5 font-black text-sm">{c.name}</td>
                <td className="px-4 py-3.5 text-center">
                  <span className="inline-flex items-center justify-center px-2 py-0.5 border-[2px] border-black text-[10px] font-black bg-black text-white min-w-[40px]">
                    {c.weight}
                  </span>
                </td>
                <td className="px-6 py-3.5 text-slate-500 text-xs font-medium hidden sm:table-cell">{c.signals}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function Methodology() {
  return (
    <div className="min-h-screen bg-[#fdfdfd] text-black relative overflow-x-hidden">
      <Navbar />

      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <InteractiveBg />
      </div>

      <main className="relative z-10 pt-28 pb-20 px-4 sm:px-6 lg:px-8 mx-auto max-w-4xl">
        <motion.div initial="initial" animate="animate" variants={stagger}>
          {/* Header */}
          <motion.div variants={fadeUp} className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="border-[3px] border-black bg-black text-white px-3 py-1.5 flex items-center gap-2 text-xs font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]">
                <BookOpen size={12} />
                Documentation
              </div>
              <div className="h-[3px] flex-1 bg-black max-w-[80px]" />
            </div>
            <h1
              className="text-5xl font-black tracking-tighter leading-none mb-4"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              Scoring<br />Methodology
            </h1>
            <p className="text-slate-500 text-sm max-w-2xl font-medium leading-relaxed">
              This page explains how README Quality and Repository Health scores are calculated.
              Scores are heuristic summaries — not authoritative assessments.
            </p>
          </motion.div>

          {/* README Quality */}
          <motion.div variants={fadeUp}>
            <ScoringTable
              icon={FileText}
              title="README Quality Score"
              subtitle="0–100 scale · 7 weighted components"
              data={readmeComponents}
            />
          </motion.div>

          {/* Repository Health */}
          <motion.div variants={fadeUp}>
            <ScoringTable
              icon={Activity}
              title="Repository Health Score"
              subtitle="0–100 scale · 7 weighted components"
              data={healthComponents}
            />
          </motion.div>

          {/* AI Analysis */}
          <motion.div variants={fadeUp} className="relative mb-10">
            <div className="absolute inset-0 translate-x-2 translate-y-2 bg-black" />
            <div className="relative border-[3px] border-black bg-white overflow-hidden">
              <div className="flex items-center gap-3 px-6 py-4 bg-black text-white">
                <div className="p-2 border-[2px] border-white/30">
                  <Sparkles size={16} />
                </div>
                <h2 className="font-black text-sm uppercase tracking-widest">AI Analysis</h2>
              </div>
              <div className="p-6 space-y-4">
                <p className="text-sm text-slate-600 leading-relaxed">
                  After scores are calculated, structured repository data is sent to an AI language model. The model returns:
                </p>
                <div className="grid sm:grid-cols-2 gap-3">
                  {[
                    ['Summary',     'A plain-language overview of the repository.'],
                    ['Strengths',   'Evidence-grounded positive observations.'],
                    ['Weaknesses',  'Observed risks, with appropriate uncertainty.'],
                    ['Suggestions', 'Prioritized, actionable improvements with evidence.'],
                    ['Limitations', 'Constraints of the analysis.'],
                  ].map(([label, desc], i) => (
                    <div key={i} className="border-[2px] border-black p-4 hover:bg-slate-50 transition-colors">
                      <p className="font-black text-xs uppercase tracking-widest mb-1">{label}</p>
                      <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-slate-400 font-mono uppercase tracking-wider pt-2">
                  The AI prompt instructs the model not to invent facts. All output is validated against a schema before display.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Disclaimer */}
          <motion.div variants={fadeUp} className="relative">
            <div className="absolute inset-0 translate-x-2 translate-y-2 bg-black" />
            <div className="relative border-[3px] border-black bg-slate-100 p-6">
              <div className="flex items-start gap-4">
                <div className="p-2 border-[2px] border-black shrink-0 bg-black text-white">
                  <AlertTriangle size={16} />
                </div>
                <div>
                  <h3 className="font-black text-sm uppercase tracking-widest mb-2">Important Disclaimer</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Scores are heuristic summaries of observable repository signals. They are not a security audit,
                    code correctness proof, production-readiness certification, or judgment of an individual contributor.
                    AI output is an interpretation of available data and may be incomplete or inaccurate.
                    Use this tool as an analysis aid rather than an authoritative assessment.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
