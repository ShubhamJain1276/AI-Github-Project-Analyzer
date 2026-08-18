import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, ArrowLeft, Shield, Scale } from 'lucide-react';
import Navbar from '../components/Navbar';
import InteractiveBg from '../components/InteractiveBg';

export default function Terms() {
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
              <Scale size={12} /> Legal Terms & Service Agreement
            </div>

            <h1
              className="text-4xl md:text-5xl font-black tracking-tighter mb-4 leading-none"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              Terms of Service
            </h1>
            <p className="text-xs font-mono text-slate-400 mb-8 border-b-[2px] border-black pb-4">
              Effective Date: August 18, 2026 · Version 1.0 (Production)
            </p>

            <div className="prose prose-slate max-w-none text-sm leading-relaxed space-y-6 font-medium">
              <section>
                <h3 className="text-base font-black uppercase tracking-wider text-black mb-2">
                  1. Acceptance of Terms
                </h3>
                <p>
                  By accessing or using the AI GitHub Repository Analyzer platform, you agree to be bound by these Terms of Service. If you do not agree to these terms, you may not access or use the platform.
                </p>
              </section>

              <section>
                <h3 className="text-base font-black uppercase tracking-wider text-black mb-2">
                  2. Acceptable Use Policy
                </h3>
                <p>
                  You agree to use the service only for lawful software evaluation and documentation analysis. You shall not:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-slate-600 mt-2">
                  <li>Attempt to overload, bypass rate limits, or disrupt platform API operations.</li>
                  <li>Use automated scraping tools to systematically harvest platform reports.</li>
                  <li>Submit malicious URLs or attempt prompt injection against the AI engine.</li>
                </ul>
              </section>

              <section>
                <h3 className="text-base font-black uppercase tracking-wider text-black mb-2">
                  3. Analysis Disclaimer & No Warranty
                </h3>
                <p>
                  The metrics, scores, and AI recommendations provided by this application are heuristic assistance tools meant for informational guidance only. They do not constitute a formal code audit or security guarantee.
                </p>
              </section>

              <section>
                <h3 className="text-base font-black uppercase tracking-wider text-black mb-2">
                  4. Limitation of Liability
                </h3>
                <p>
                  To the maximum extent permitted by applicable law, AI GitHub Analyzer and its operators shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the service.
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
