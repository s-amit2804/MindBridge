import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Users, UserCheck, LogOut, Menu, X, Brain, ClipboardList } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const peerLinks = [
  { to: '/mentor/peer', icon: Calendar, label: 'Availability' },
  { to: '/mentor/peer/sessions', icon: Users, label: 'My Sessions' },
];

const proLinks = [
  { to: '/mentor/professional', icon: ClipboardList, label: 'Escalated Cases' },
  { to: '/mentor/professional/sessions', icon: UserCheck, label: 'Active Sessions' },
];

export default function MentorLayout({ type = 'peer' }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const links = type === 'peer' ? peerLinks : proLinks;
  const title = type === 'peer' ? 'Peer Mentor' : 'Professional Mentor';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex h-screen overflow-hidden light-theme">
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <motion.aside
        className={`fixed lg:static z-50 h-full w-72 flex flex-col border-r border-glass-border bg-background-primary/80 backdrop-blur-xl
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          transition-transform duration-300 ease-in-out`}
      >
        <div className="flex items-center gap-3 px-6 py-6 border-b border-glass-border">
          <div className="w-9 h-9 rounded-xl bg-accent/20 flex items-center justify-center">
            <Brain size={20} className="text-accent" />
          </div>
          <div>
            <span className="text-lg font-bold text-gradient">NueraLyn</span>
            <p className="text-[10px] text-white/30 uppercase tracking-widest">{title}</p>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-auto lg:hidden p-2 rounded-lg hover:bg-white/5 text-white/50"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''}`
              }
            >
              <link.icon size={18} />
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="px-4 py-4 border-t border-glass-border">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-accent/20 flex items-center justify-center text-accent text-sm font-semibold">
              {user?.name?.charAt(0)?.toUpperCase() || 'M'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white/80 truncate">{user?.name || 'Mentor'}</p>
              <p className="text-xs text-white/30">{title}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="sidebar-link w-full text-white/40 hover:text-sos/80">
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </motion.aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="lg:hidden flex items-center gap-3 px-4 py-3 border-b border-glass-border bg-background-primary/80 backdrop-blur-xl">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg hover:bg-white/5 text-white/50">
            <Menu size={20} />
          </button>
          <span className="text-sm font-semibold text-gradient">NueraLyn</span>
          <span className="text-xs text-white/30 ml-1">— {title}</span>
        </div>

        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
