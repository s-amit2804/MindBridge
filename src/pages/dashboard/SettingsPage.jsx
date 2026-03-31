import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Building, Calendar, Save, Bell, Shield, Palette } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import GlassPanel from '../../components/ui/GlassPanel';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [organization, setOrganization] = useState(user?.organization || '');
  const [ageGroup, setAgeGroup] = useState(user?.ageGroup || '');
  const [notifications, setNotifications] = useState(true);

  const handleSave = () => {
    updateUser({ name, email, organization, ageGroup });
    toast.success('Settings saved!', {
      style: {
        background: 'rgba(30, 30, 30, 0.95)',
        color: '#fff',
        border: '1px solid rgba(175, 203, 255, 0.2)',
      },
    });
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1, y: 0,
      transition: { duration: 0.4, delay: i * 0.1 },
    }),
  };

  return (
    <div className="p-6 space-y-8 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-sm text-white/40 mt-1">Manage your account preferences</p>
      </div>

      {/* Profile Section */}
      <motion.div custom={0} variants={fadeInUp} initial="hidden" animate="visible">
        <GlassPanel>
          <div className="flex items-center gap-2 mb-6">
            <User size={16} className="text-accent" />
            <h2 className="text-sm font-semibold text-white/70 uppercase tracking-wider">Profile</h2>
          </div>

          <div className="space-y-4">
            <Input
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              icon={User}
            />
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={Mail}
            />
            <Input
              label="Organization"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              placeholder="School, university, company..."
              icon={Building}
            />

            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/60">Age Group</label>
              <div className="grid grid-cols-3 gap-2">
                {['Under 18', '18-24', '25-34', '35-44', '45-54', '55+'].map((age) => (
                  <button
                    key={age}
                    onClick={() => setAgeGroup(age)}
                    className={`py-2 rounded-xl text-xs font-medium transition-all cursor-pointer
                      ${ageGroup === age
                        ? 'bg-accent/20 border border-accent/40 text-accent'
                        : 'bg-white/5 border border-white/10 text-white/40 hover:bg-white/8'
                      }`}
                  >
                    {age}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </GlassPanel>
      </motion.div>

      {/* Preferences */}
      <motion.div custom={1} variants={fadeInUp} initial="hidden" animate="visible">
        <GlassPanel>
          <div className="flex items-center gap-2 mb-6">
            <Bell size={16} className="text-accent" />
            <h2 className="text-sm font-semibold text-white/70 uppercase tracking-wider">Preferences</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/70">Push Notifications</p>
                <p className="text-xs text-white/30">Get notified about sessions and reminders</p>
              </div>
              <button
                onClick={() => setNotifications(!notifications)}
                className={`relative w-12 h-6 rounded-full transition-all cursor-pointer ${
                  notifications ? 'bg-accent/30' : 'bg-white/10'
                }`}
              >
                <motion.div
                  animate={{ x: notifications ? 24 : 2 }}
                  className={`absolute top-1 w-4 h-4 rounded-full ${
                    notifications ? 'bg-accent' : 'bg-white/30'
                  }`}
                />
              </button>
            </div>
          </div>
        </GlassPanel>
      </motion.div>

      {/* Privacy */}
      <motion.div custom={2} variants={fadeInUp} initial="hidden" animate="visible">
        <GlassPanel>
          <div className="flex items-center gap-2 mb-4">
            <Shield size={16} className="text-accent" />
            <h2 className="text-sm font-semibold text-white/70 uppercase tracking-wider">Privacy</h2>
          </div>
          <p className="text-xs text-white/30 leading-relaxed">
            Your data is encrypted and never shared. All sessions are anonymized for analytics purposes. You can request data deletion at any time.
          </p>
        </GlassPanel>
      </motion.div>

      {/* Save */}
      <motion.div custom={3} variants={fadeInUp} initial="hidden" animate="visible">
        <Button variant="accent" size="lg" icon={Save} onClick={handleSave} className="w-full">
          Save Changes
        </Button>
      </motion.div>
    </div>
  );
}
