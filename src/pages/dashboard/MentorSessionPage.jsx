import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Video, Phone, Clock, User, Calendar } from 'lucide-react';
import { getMentorSessions } from '../../services/sessionService';
import GlassPanel from '../../components/ui/GlassPanel';
import Button from '../../components/ui/Button';
import RecordingUI from '../../components/recording/RecordingUI';
import { formatDateTime } from '../../utils/formatters';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function MentorSessionPage() {
  const [sessions, setSessions] = useState({ upcoming: [], available: [] });
  const [loading, setLoading] = useState(true);
  const [showRecording, setShowRecording] = useState(false);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      const data = await getMentorSessions();
      setSessions({
        upcoming: data?.upcoming || [],
        available: data?.available || [],
      });
    } catch {
      setSessions({ upcoming: [], available: [] });
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <motion.div
          className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Mentor Sessions</h1>
        <p className="text-sm text-white/40 mt-1">Connect with your support network</p>
      </div>

      {/* Upcoming Sessions */}
      <section>
        <h2 className="text-lg font-semibold text-white/70 mb-4">Upcoming Sessions</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {sessions.upcoming.map((session, i) => (
            <motion.div
              key={session.id}
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: i * 0.1 }}
            >
              <GlassPanel hover className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-accent/15 flex items-center justify-center">
                      <User size={18} className="text-accent" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white">{session.mentorName}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock size={12} className="text-white/30" />
                        <span className="text-xs text-white/40">{formatDateTime(session.time)}</span>
                      </div>
                    </div>
                  </div>
                  <span className={`text-[10px] px-2 py-1 rounded-full font-medium
                    ${session.status === 'confirmed'
                      ? 'bg-green-500/15 text-green-400 border border-green-500/20'
                      : 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/20'
                    }`}
                  >
                    {session.status}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {session.type === 'video' ? <Video size={14} className="text-white/30" /> : <Phone size={14} className="text-white/30" />}
                  <span className="text-xs text-white/30 capitalize">{session.type} call</span>
                </div>

                <Button variant="primary" size="sm" className="w-full">
                  Join Meeting
                </Button>
              </GlassPanel>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Available Mentors */}
      {sessions.available.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-white/70 mb-4">Available Mentors</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {sessions.available.map((mentor) => (
              <GlassPanel key={mentor.id} hover className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent/15 flex items-center justify-center">
                    <User size={18} className="text-accent" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">{mentor.mentorName}</h3>
                    <p className="text-xs text-white/40">{mentor.specialization}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={12} className="text-white/30" />
                  <span className="text-xs text-white/30">Next slot: {formatDateTime(mentor.nextSlot)}</span>
                </div>
                <Button variant="secondary" size="sm" className="w-full">
                  Book Session
                </Button>
              </GlassPanel>
            ))}
          </div>
        </section>
      )}

      {/* Recording Section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white/70">Voice Recording</h2>
          <button
            onClick={() => setShowRecording(!showRecording)}
            className="text-xs text-accent hover:text-accent-light transition-colors cursor-pointer"
          >
            {showRecording ? 'Hide' : 'Show'}
          </button>
        </div>
        {showRecording && <RecordingUI />}
      </section>
    </div>
  );
}
