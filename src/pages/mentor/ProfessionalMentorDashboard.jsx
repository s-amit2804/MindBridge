import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Check, Play, Tag, Clock, User, Activity } from 'lucide-react';
import { getEscalatedCases } from '../../services/sessionService';
import GlassPanel from '../../components/ui/GlassPanel';
import Button from '../../components/ui/Button';
import { getSeverityColor, getSeverityBg } from '../../utils/formatters';
import toast from 'react-hot-toast';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.4, delay: i * 0.1 },
  }),
};

export default function ProfessionalMentorDashboard() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCases();
  }, []);

  const loadCases = async () => {
    const data = await getEscalatedCases();
    setCases(data.cases || []);
    setLoading(false);
  };

  const handleAccept = (id) => {
    setCases(prev => prev.map(c => c.id === id ? { ...c, accepted: true } : c));
    toast.success('Case accepted. Preparing session...', {
      style: { background: 'rgba(30,30,30,0.95)', color: '#fff', border: '1px solid rgba(175,203,255,0.2)' },
    });
  };

  const handleStartSession = (id) => {
    toast('Starting session...', {
      icon: '🎙️',
      style: { background: 'rgba(30,30,30,0.95)', color: '#fff', border: '1px solid rgba(175,203,255,0.2)' },
    });
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
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Escalated Cases</h1>
          <p className="text-sm text-white/40 mt-1">Cases requiring professional attention</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-sos/10 border border-sos/20">
          <AlertTriangle size={12} className="text-sos" />
          <span className="text-xs text-sos/80 font-medium">{cases.length} pending</span>
        </div>
      </div>

      <div className="space-y-4">
        {cases.map((caseItem, i) => (
          <motion.div
            key={caseItem.id}
            custom={i}
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
          >
            <GlassPanel hover>
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: getSeverityBg(caseItem.severity) }}>
                    <User size={18} style={{ color: getSeverityColor(caseItem.severity) }} />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-white/80">{caseItem.userId}</span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Clock size={10} className="text-white/20" />
                      <span className="text-[10px] text-white/30">{caseItem.timestamp}</span>
                    </div>
                  </div>
                </div>

                {/* Priority badge */}
                <span
                  className="text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider"
                  style={{
                    backgroundColor: getSeverityBg(caseItem.severity),
                    color: getSeverityColor(caseItem.severity),
                    border: `1px solid ${getSeverityColor(caseItem.severity)}40`,
                  }}
                >
                  {caseItem.priority}
                </span>
              </div>

              {/* Summary */}
              <p className="text-sm text-white/60 leading-relaxed mb-4">
                {caseItem.summary}
              </p>

              {/* Severity indicator */}
              <div className="flex items-center gap-2 mb-4">
                <Activity size={14} className="text-white/30" />
                <span className="text-xs text-white/30">Severity:</span>
                <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden max-w-[200px]">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: caseItem.severity === 'critical' ? '95%' : caseItem.severity === 'high' ? '75%' : '50%',
                      backgroundColor: getSeverityColor(caseItem.severity),
                    }}
                  />
                </div>
                <span className="text-xs capitalize" style={{ color: getSeverityColor(caseItem.severity) }}>
                  {caseItem.severity}
                </span>
              </div>

              {/* Keywords */}
              <div className="flex flex-wrap gap-2 mb-5">
                {caseItem.keywords.map((kw, j) => (
                  <span
                    key={j}
                    className="inline-flex items-center gap-1 text-[10px] px-2.5 py-1 rounded-full bg-sos/8 text-sos/70 border border-sos/15"
                  >
                    <Tag size={8} />
                    {kw}
                  </span>
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-4 border-t border-glass-border">
                {!caseItem.accepted ? (
                  <Button variant="primary" size="sm" icon={Check} onClick={() => handleAccept(caseItem.id)}>
                    Accept Case
                  </Button>
                ) : (
                  <Button variant="accent" size="sm" icon={Play} onClick={() => handleStartSession(caseItem.id)}>
                    Start Session
                  </Button>
                )}
              </div>
            </GlassPanel>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
