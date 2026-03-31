import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, MessageSquare, Users, Mic, ChevronRight, Activity } from 'lucide-react';
import { getSessions } from '../../services/sessionService';
import GlassPanel from '../../components/ui/GlassPanel';
import { formatDate, getSeverityColor, getSeverityBg } from '../../utils/formatters';

const typeIcons = {
  chat: MessageSquare,
  mentor: Users,
  recording: Mic,
};

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.4, delay: i * 0.08, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

export default function HistoryPage() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    const data = await getSessions();
    setSessions(data.sessions || []);
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
        <h1 className="text-2xl font-bold text-white">Session History</h1>
        <p className="text-sm text-white/40 mt-1">Review your past sessions and progress</p>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-[19px] top-0 bottom-0 w-px bg-gradient-to-b from-accent/30 via-accent/10 to-transparent" />

        <div className="space-y-4">
          {sessions.map((session, i) => {
            const TypeIcon = typeIcons[session.type] || MessageSquare;
            const isExpanded = expandedId === session.id;

            return (
              <motion.div
                key={session.id}
                custom={i}
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
                className="relative pl-12"
              >
                {/* Timeline dot */}
                <div className="absolute left-2.5 top-6 w-4 h-4 rounded-full border-2 border-accent/40 bg-background-primary z-10 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent/60" />
                </div>

                <GlassPanel
                  hover
                  className="cursor-pointer"
                  onClick={() => setExpandedId(isExpanded ? null : session.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <TypeIcon size={16} className="text-accent/70" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs text-white/30 capitalize">{session.type} session</span>
                          <span className="text-[10px] text-white/20">•</span>
                          <span className="text-xs text-white/30">{session.duration}</span>
                        </div>
                        <p className="text-sm text-white/70 leading-relaxed">{session.summary}</p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2 ml-4 flex-shrink-0">
                      <span className="text-xs text-white/30">{formatDate(session.date)}</span>
                      <span
                        className="text-[10px] px-2 py-0.5 rounded-full font-medium capitalize"
                        style={{
                          backgroundColor: getSeverityBg(session.severity),
                          color: getSeverityColor(session.severity),
                          border: `1px solid ${getSeverityColor(session.severity)}30`,
                        }}
                      >
                        {session.severity}
                      </span>
                      <motion.div
                        animate={{ rotate: isExpanded ? 90 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronRight size={14} className="text-white/20" />
                      </motion.div>
                    </div>
                  </div>

                  {/* Expanded details */}
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 pt-4 border-t border-glass-border"
                    >
                      <div className="grid grid-cols-2 gap-4">
                        <div className="glass-card p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <Activity size={12} className="text-accent/50" />
                            <span className="text-[10px] text-white/30 uppercase tracking-wider">Severity Score</span>
                          </div>
                          <p className="text-lg font-semibold" style={{ color: getSeverityColor(session.severity) }}>
                            {session.severity === 'low' ? '2.1' : session.severity === 'medium' ? '5.4' : session.severity === 'high' ? '7.8' : '9.2'}
                          </p>
                        </div>
                        <div className="glass-card p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <Clock size={12} className="text-accent/50" />
                            <span className="text-[10px] text-white/30 uppercase tracking-wider">Duration</span>
                          </div>
                          <p className="text-lg font-semibold text-white/70">{session.duration}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </GlassPanel>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
