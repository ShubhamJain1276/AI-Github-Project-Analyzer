import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, ArrowLeft, Lock, FileText, Globe } from 'lucide-react';
import Navbar from '../components/Navbar';
import InteractiveBg from '../components/InteractiveBg';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-[#fdfdfd] text-black relative overflow-x-hidden">
      <Navbar />

      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <InteractiveBg />
      </div>

      <main className="relative z-10 pt-28 pb-20 px-4 sm:px-6 lg:px-8 mx-auto max-w-4xl">
        <Link to="/" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-black mb-8 transition-colors">
          <ArrowLeft size={14} /> Home
        </Link>

        <div className="relative mb-12">
          <div className="absolute inset-0 translate-x-2 translate-y-2 bg-black" />
          <div className="relative border-[3px] border-black bg-white p-8 md:p-12">
            <div className="inline-flex items-center gap-2 bg-black text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 mb-6 border-[2px] border-black">
              <ShieldCheck size={12} /> Privacy Policy & Data Governance
            </div>

            <h1
              className="text-4xl md:text-5xl font-black tracking-tighter mb-4 leading-none"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              Privacy Policy
            </h1>
            <p className="text-xs font-mono text-slate-400 mb-8 border-b-[2px] border-black pb-4">
              Effective Date: August 18, 2026 · Version 1.0 (Production)
            </p>

            <div className="prose prose-slate max-w-none text-sm leading-relaxed space-y-6 font-medium">
              <section>
                <h3 className="text-base font-black uppercase tracking-wider text-black mb-2 flex items-center gap-2">
                  1. Information We Collect
                </h3>
                <p>
                  When you use the AI GitHub Repository Analyzer, we collect minimal operational information required to provide our service:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-slate-600 mt-2">
                  <li><strong>Account Credentials:</strong> Username, email address, and hashed password stored using bcrypt encryption.</li>
                  <li><strong>Public Repository Data:</strong> URLs of public GitHub repositories submitted for analysis and their associated metadata via GitHub’s public API.</li>
                  <li><strong>Usage Analytics:</strong> Timestamps of analysis runs, score records, and user preferences (e.g. starred repositories).</li>
                </ul>
              </section>

              <section>
                <h3 className="text-base font-black uppercase tracking-wider text-black mb-2 flex items-center gap-2">
                  2. How We Use Data
                </h3>
                <p>
                  We process data solely for the following purposes:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-slate-600 mt-2">
                  <li>Executing deterministic score calculations and generating AI insights via Google Gemini APIs.</li>
                  <li>Maintaining your personal analysis history and starred repository bookmarks.</li>
                  <li>Improving engine scoring heuristics and platform stability.</li>
                </ul>
              </section>

              <section>
                <h3 className="text-base font-black uppercase tracking-wider text-black mb-2 flex items-center gap-2">
                  3. Data Retention & GDPR Compliance
                </h3>
                <p>
                  Under GDPR and international privacy standards, you maintain total ownership over your data:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-slate-600 mt-2">
                  <li><strong>Data Export:</strong> You may export your entire analysis history at any time from your Profile page in structured JSON format.</li>
                  <li><strong>Permanent Deletion:</strong> You can permanently delete your account and all associated records instantly from your Profile settings.</li>
                </ul>
              </section>

              <section>
                <h3 className="text-base font-black uppercase tracking-wider text-black mb-2 flex items-center gap-2">
                  4. Third-Party Integrations
                </h3>
                <p>
                  Our service interacts with public APIs including GitHub API and Google Gemini AI API. No private credentials or personal data are sold, traded, or transferred to third-party advertisers.
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
