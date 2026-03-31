import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, ChevronDown, Brain } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import SOSButton from '../components/mood/SOSButton';
import OnboardingModal from '../components/OnboardingModal';

export default function DashboardLayout() {
  const { user, logout, needsOnboarding } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#050505] text-white">
      {/* Minimal Top Header */}
      <header className="px-6 py-4 border-b border-glass-border bg-background-primary/40 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          {/* Logo on Left */}
          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
              <Brain size={18} className="text-accent" />
            </div>
            <span className="text-sm font-bold text-gradient">NeuroLyn.</span>
          </motion.div>

          {/* Profile Dropdown on Right */}
          <div className="relative">
            <motion.button
              onClick={() => setProfileOpen(!profileOpen)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-3 px-4 py-2 rounded-xl border border-white/10 hover:border-accent/30 hover:bg-accent/10 transition-all duration-300 cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-accent/30 flex items-center justify-center text-accent text-sm font-semibold">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-xs font-semibold text-white/90">{user?.name || 'User'}</p>
                <p className="text-[10px] text-white/40 truncate max-w-[150px]">{user?.email}</p>
              </div>
              <ChevronDown size={14} className={`text-white/60 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
            </motion.button>

            {/* Profile Dropdown Menu */}
            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-48 rounded-xl bg-background-primary/95 backdrop-blur-md border border-white/10 shadow-2xl z-50"
                >
                  <motion.button
                    onClick={() => {
                      handleLogout();
                      setProfileOpen(false);
                    }}
                    whileHover={{ backgroundColor: 'rgba(255, 68, 68, 0.1)' }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-white/70 hover:text-sos/90 transition-colors border-b border-white/5 first:rounded-t-lg last:border-b-0 last:rounded-b-lg cursor-pointer"
                  >
                    <LogOut size={16} />
                    <span className="text-sm font-medium">Sign Out</span>
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative">
        <div className="mood-overlay" style={{ background: 'var(--mood-overlay)' }} />
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="h-full"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* SOS Button */}
      <SOSButton />

      {/* Onboarding Modal */}
      {needsOnboarding && <OnboardingModal />}
    </div>
  );
}


