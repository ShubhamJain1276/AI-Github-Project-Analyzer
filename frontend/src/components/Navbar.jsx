import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FolderGit2, Menu, X, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { path: '/',             label: 'Overview',    auth: false },
  { path: '/dashboard',   label: 'Analyze',     auth: true  },
  { path: '/history',     label: 'History',     auth: true  },
  { path: '/favorites',   label: 'Starred',     auth: true  },
  { path: '/compare',     label: 'Compare',     auth: true  },
  { path: '/leaderboard', label: 'Leaderboard', auth: true  },
  { path: '/methodology', label: 'Methodology', auth: false },
];


export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled]     = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate  = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setMobileOpen(false);
  };

  const filteredItems = navItems.filter(item => !item.auth || isAuthenticated);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 bg-white transition-all duration-150 ${
        scrolled ? 'border-b-[3px] border-black shadow-[0_3px_0_0_rgba(0,0,0,1)]' : 'border-b-[3px] border-black'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ rotate: [0, -8, 8, 0] }}
              transition={{ duration: 0.4 }}
              className="flex h-9 w-9 items-center justify-center bg-black text-white border-[3px] border-black"
            >
              <FolderGit2 size={17} />
            </motion.div>
            <span
              className="hidden sm:inline font-black text-sm uppercase tracking-widest text-black"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              AI GitHub Analyzer
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-0">
            {filteredItems.map(item => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative px-4 py-2 text-xs font-black uppercase tracking-widest transition-all duration-100 ${
                    isActive
                      ? 'bg-black text-white'
                      : 'text-slate-600 hover:text-black hover:bg-slate-100'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-black -z-10"
                      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Auth Actions */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link to="/profile" className="flex items-center gap-2 px-3 py-1.5 border-[2px] border-black text-xs font-black uppercase tracking-wider hover:bg-black hover:text-white transition-colors cursor-pointer">
                  <User size={13} />
                  {user?.username}
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-1.5 border-[2px] border-black text-xs font-black uppercase tracking-wider hover:bg-black hover:text-white transition-colors"
                >
                  <LogOut size={13} /> Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-1.5 text-xs font-black uppercase tracking-widest border-[2px] border-transparent hover:border-black transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-xs font-black uppercase tracking-widest bg-black text-white border-[2px] border-black hover:bg-slate-800 transition-colors shadow-[3px_3px_0px_0px_rgba(0,0,0,0.25)]"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 border-[2px] border-black text-black hover:bg-black hover:text-white transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden bg-white border-t-[3px] border-black"
          >
            <div className="px-4 py-4 space-y-0">
              {filteredItems.map(item => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={`block px-4 py-3 text-xs font-black uppercase tracking-widest border-b border-slate-100 transition-colors ${
                      isActive ? 'bg-black text-white' : 'text-black hover:bg-slate-50'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <div className="pt-4">
                {isAuthenticated ? (
                  <div className="space-y-3">
                    <Link
                      to="/profile"
                      onClick={() => setMobileOpen(false)}
                      className="w-full flex items-center gap-2 px-4 py-3 text-xs font-black uppercase tracking-widest border-[2px] border-black hover:bg-black hover:text-white transition-colors"
                    >
                      <User size={15} /> Profile ({user?.username})
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-3 text-xs font-black uppercase tracking-widest border-[2px] border-black hover:bg-black hover:text-white transition-colors"
                    >
                      <LogOut size={15} /> Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <Link
                      to="/login"
                      onClick={() => setMobileOpen(false)}
                      className="flex justify-center px-4 py-3 text-xs font-black uppercase tracking-widest border-[2px] border-black hover:bg-slate-50 transition-colors"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setMobileOpen(false)}
                      className="flex justify-center px-4 py-3 text-xs font-black uppercase tracking-widest bg-black text-white border-[2px] border-black hover:bg-slate-800 transition-colors"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
