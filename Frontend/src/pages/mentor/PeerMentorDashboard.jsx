import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Users, Clock, Plus, Trash2, ArrowRight, Save, CheckCircle2 } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import GlassPanel from '../../components/ui/GlassPanel';

const PeerMentorDashboard = () => {
    const {
        loading,
        mentorSlots, addMentorSlot, removeMentorSlot,
        mentorSessions,
    } = useAppContext();

    const [newSlot, setNewSlot] = useState('');
    const [meetingLink, setMeetingLink] = useState('https://meet.jit.si/neuralyn-session-alex');
    const [notes, setNotes] = useState('Alex is showing progress in managing stress. Needs more focus on peer relationship boundaries.');
    const [isCompleted, setIsCompleted] = useState(false);
    const [toastMsg, setToastMsg] = useState('');

    const showToast = (msg) => {
        setToastMsg(msg);
        setTimeout(() => setToastMsg(''), 3000);
    };

    const handleAddSlot = () => {
        if (!newSlot.trim()) return;
        addMentorSlot(newSlot);
        setNewSlot('');
        showToast("Time slot added & synced globally!");
    };

    if (loading) return (
        <div className="h-full w-full flex items-center justify-center bg-transparent">
            <div className="w-8 h-8 rounded-full border-2 border-gold/30 border-t-gold animate-spin" />
        </div>
    );

    // Use global sessions or fallback to defaults
    const sessions = mentorSessions.length > 0 ? mentorSessions : [
        { id: 1, user: 'Alex', ageGroup: '16-18', time: 'Today, 2:00 PM', status: 'In Progress' }
    ];

    return (
        <div className="h-full w-full relative overflow-y-auto overflow-x-hidden bg-transparent p-4 lg:p-8">
            <AnimatePresence>
                {toastMsg && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed top-24 right-8 z-50 bg-green-500/10 border border-green-500/30 p-4 rounded-xl flex items-center gap-3 backdrop-blur-md shadow-2xl"
                    >
                        <CheckCircle2 size={20} className="text-green-400" />
                        <span className="text-green-50 font-semibold text-sm">{toastMsg}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div
                className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
            >
                {/* Main Content Area */}
                <div className="flex-1 flex flex-col gap-8">
                    <div className="mb-2">
                        <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight flex items-center gap-3" style={{ fontFamily: 'var(--font-display)' }}>
                            Today's Caseload <span className="text-3xl drop-shadow-lg">🧑‍🏫</span>
                        </h1>
                        <p className="text-gold uppercase text-xs tracking-widest mt-2 font-semibold flex items-center gap-2">
                            Manage your active mentoring sessions
                        </p>
                    </div>

                    {/* Assigned Sessions List */}
                    <div className="flex flex-col gap-4">
                        {sessions.map((session) => (
                            <GlassPanel key={session.id} className="p-4 bg-black/40 border-white/5 hover:bg-white/5 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex flex-row gap-4 items-center">
                                    <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center transition-transform hover:scale-110">
                                        <Users size={20} className="text-gold" />
                                    </div>
                                    <div className="flex flex-col">
                                        <h3 className="m-0 font-bold text-lg text-white">
                                            {session.user} <span className="text-xs font-semibold text-white/40 ml-1 tracking-wider uppercase">({session.ageGroup})</span>
                                        </h3>
                                        <p className="m-0 font-semibold text-white/50 text-xs mt-1 flex items-center gap-1.5">
                                            <Clock size={12} className="text-white/30" /> Scheduled: {session.time}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-row gap-3 items-center">
                                    <span className="px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest bg-gold/10 text-gold border border-gold/20">
                                        {session.status}
                                    </span>
                                    <button className="p-2.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-colors cursor-pointer group">
                                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </GlassPanel>
                        ))}
                    </div>

                    {/* Session Detail Section */}
                    <GlassPanel className="p-6 md:p-8 bg-black/40 border-white/5 mt-2 relative overflow-hidden">
                        {/* Decorative accent line */}
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-gold/80 to-yellow-600/80"></div>

                        <div className="flex flex-col sm:flex-row justify-between mb-8 sm:items-center border-b border-white/10 pb-6 gap-4 pl-4">
                            <h2 className="flex items-center gap-3 m-0 text-2xl font-bold text-white tracking-tight">
                                <Users size={24} className="text-gold" /> Case Focus: Alex
                            </h2>
                            {isCompleted && (
                                <span className="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-bold uppercase tracking-wider self-start sm:self-auto">
                                    <CheckCircle2 size={16} /> Completed
                                </span>
                            )}
                        </div>

                        <div className="flex flex-col gap-8 pl-4">
                            <div className="flex flex-col gap-2 relative">
                                <label className="font-bold text-[10px] uppercase tracking-widest text-white/50 absolute -top-3 left-3 bg-[#0a0a0a] px-2 border-x border-white/5">Video Link</label>
                                <div className="flex flex-row items-stretch">
                                    <input
                                        className="flex-1 bg-black/40 border border-white/10 border-r-0 rounded-l-xl font-mono text-sm p-4 text-white focus:outline-none focus:border-gold/50 transition-colors"
                                        value={meetingLink}
                                        onChange={(e) => setMeetingLink(e.target.value)}
                                    />
                                    <button className="px-6 bg-white/5 hover:bg-white/10 border border-white/10 rounded-r-xl text-gold hover:text-yellow-200 transition-colors cursor-pointer flex items-center justify-center">
                                        <Save size={18} />
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2 relative mt-2">
                                <label className="font-bold text-[10px] uppercase tracking-widest text-white/50 absolute -top-3 left-3 bg-[#0a0a0a] px-2 border-x border-white/5">Confidential Case Notes</label>
                                <textarea
                                    className="bg-black/40 border border-white/10 rounded-xl p-5 text-sm font-medium leading-relaxed text-white/90 focus:outline-none focus:border-gold/50 h-40 resize-none custom-scrollbar transition-colors"
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                />
                            </div>

                            <button
                                className={`w-full py-4 rounded-xl text-sm font-bold uppercase tracking-widest transition-all cursor-pointer border mt-2 flex items-center justify-center gap-2
                                    ${isCompleted
                                        ? 'bg-white/5 text-white/40 border-white/5 hover:bg-white/10 hover:text-white/60'
                                        : 'bg-gold/10 border-gold/30 text-gold hover:bg-gold/20 hover:shadow-[0_0_20px_rgba(212,175,55,0.15)]'
                                    }`}
                                onClick={() => {
                                    setIsCompleted(!isCompleted);
                                    if (!isCompleted) showToast("Session marked as Complete!");
                                }}
                            >
                                {isCompleted ? 'Re-open Session Details' : 'Finalize & Sign Off Session'}
                            </button>
                        </div>
                    </GlassPanel>
                </div>

                {/* Sidebar */}
                <div className="w-full lg:w-[400px] flex flex-col gap-6">
                    {/* Slot Manager */}
                    <GlassPanel className="p-6 md:p-8 bg-black/40 border-white/5 relative overflow-hidden flex flex-col">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-full blur-[60px] pointer-events-none" />
                        <div className="absolute -top-4 -right-4 bg-white/5 border border-white/10 p-3 rounded-2xl rotate-12 backdrop-blur-md">
                            <Clock size={24} className="text-white/40" />
                        </div>

                        <h3 className="flex items-center gap-3 mb-8 text-xl font-bold tracking-tight text-white relative z-10">
                            Slot Manager
                        </h3>

                        <div className="flex flex-col gap-2 mb-8 relative z-10">
                            {mentorSlots.map((slot, index) => (
                                <div key={index} className="flex flex-row justify-between items-center bg-white/5 border border-white/5 rounded-xl p-4 group hover:bg-red-500/10 hover:border-red-500/20 transition-all">
                                    <span className="font-mono text-sm font-bold tracking-tight text-white/90">{slot}</span>
                                    <button
                                        onClick={() => removeMentorSlot(index)}
                                        className="text-white/20 group-hover:text-red-400 hover:scale-110 transition-all cursor-pointer"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                            {mentorSlots.length === 0 && (
                                <div className="p-6 bg-black/20 rounded-xl border border-white/5 text-center text-xs font-semibold text-white/30 uppercase tracking-widest">
                                    No slots listed.
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col gap-4 mt-auto relative z-10">
                            <input
                                className="bg-black/50 border border-white/10 rounded-xl p-4 font-bold text-sm uppercase text-white focus:outline-none focus:border-gold/50 transition-colors placeholder:text-white/20"
                                placeholder="e.g. THU 2:00 PM..."
                                value={newSlot}
                                onChange={(e) => setNewSlot(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleAddSlot()}
                            />
                            <button
                                className="w-full py-4 bg-gold/10 border border-gold/30 hover:bg-gold/20 hover:shadow-[0_0_20px_rgba(255,215,0,0.15)] text-gold rounded-xl text-xs font-bold tracking-widest uppercase transition-all cursor-pointer flex justify-center items-center gap-2"
                                onClick={handleAddSlot}
                            >
                                <Plus size={16} /> Publish Slot
                            </button>
                            <p className="text-[10px] uppercase font-bold tracking-widest text-white/30 text-center mt-2">
                                Live sync active: Slots instantly available
                            </p>
                        </div>
                    </GlassPanel>

                    {/* Supervisor Metrics */}
                    <GlassPanel className="p-6 md:p-8 bg-black/60 border-white/10 relative overflow-hidden">
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gold/10 rounded-full blur-[60px] pointer-events-none" />

                        <h3 className="flex items-center gap-2 mb-8 font-bold uppercase tracking-widest text-xs text-gold relative z-10 drop-shadow-md">
                            <Clock size={16} /> Supervisor Metrics
                        </h3>

                        <div className="space-y-5 relative z-10">
                            <div className="flex justify-between items-center border-b border-white/10 border-dashed pb-3">
                                <span className="font-semibold text-xs text-white/60 tracking-wide uppercase">Total Adolescents</span>
                                <span className="font-black text-xl text-white">12</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-white/10 border-dashed pb-3">
                                <span className="font-semibold text-xs text-white/60 tracking-wide uppercase">Completed (Today)</span>
                                <span className="font-black text-xl text-white">4</span>
                            </div>
                            <div className="flex justify-between items-center pt-2">
                                <span className="font-semibold text-xs text-white/60 tracking-wide uppercase">Upcoming</span>
                                <span className="font-black text-xl text-gold drop-shadow-md">{sessions.length}</span>
                            </div>
                        </div>

                        <button className="w-full mt-8 bg-white/10 hover:bg-white/20 border border-white/5 text-white/90 rounded-xl font-bold text-xs uppercase tracking-widest py-4 transition-all cursor-pointer relative z-10 backdrop-blur-sm">
                            Sync Schedule
                        </button>
                    </GlassPanel>
                </div>
            </motion.div>
        </div>
    );
};

export default PeerMentorDashboard;
