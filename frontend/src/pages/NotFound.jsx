import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Compass, Home, LayoutDashboard, ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar';
import InteractiveBg from '../components/InteractiveBg';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#fdfdfd] text-black relative overflow-x-hidden flex flex-col justify-between">
      <Navbar />

      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <InteractiveBg />
      </div>

      <main className="relative z-10 pt-36 pb-20 px-4 sm:px-6 lg:px-8 mx-auto max-w-xl text-center flex-1 flex flex-col justify-center items-center">
        <div className="relative w-full">
          <div className="absolute inset-0 translate-x-3 translate-y-3 bg-black" />
          <div className="relative border-[3px] border-black bg-white p-12 text-center">
            <div className="w-16 h-16 border-[3px] border-black bg-black text-white flex items-center justify-center mx-auto mb-6">
              <Compass size={28} className="animate-spin-slow" />
            </div>

            <span className="font-mono text-6xl font-black block tracking-tighter mb-2">404</span>
            <h1
              className="text-2xl font-black tracking-tight mb-4"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              Page Not Found
            </h1>
            <p className="text-slate-500 text-sm mb-8 font-medium">
              The page or repository route you are looking for does not exist or has been moved.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/dashboard"
                className="w-full sm:w-auto px-6 py-3 border-[3px] border-black bg-black text-white text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors"
              >
                <LayoutDashboard size={14} /> Dashboard
              </Link>
              <Link
                to="/"
                className="w-full sm:w-auto px-6 py-3 border-[3px] border-black bg-white text-black text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-100 transition-colors"
              >
                <Home size={14} /> Home Page
              </Link>
            </div>
          </div>
        </div>
      </main>

      <footer className="relative z-10 border-t-[3px] border-black py-6 bg-[#fdfdfd] text-center text-xs text-slate-500 font-mono">
        AI GITHUB ANALYZER · 404 NAVIGATION RECOVERY
      </footer>
    </div>
  );
}
