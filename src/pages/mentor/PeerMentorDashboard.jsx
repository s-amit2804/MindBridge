import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Users, Clock, Trash2, Save, CheckCircle2, ArrowRight } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

export default function PeerMentorDashboard() {
    const { 
        loading, 
        mentorSlots, addMentorSlot, removeMentorSlot, 
        mentorSessions,
    } = useAppContext();

    const [newSlot, setNewSlot] = useState('');
    const [meetingLink, setMeetingLink] = useState('https://meet.jit.si/neuralyn-session-alex');
    const [notes, setNotes] = useState('Alex is showing progress in managing stress. Needs more focus on peer relationship boundaries.');
    const [isCompleted, setIsCompleted] = useState(false);

    const handleAddSlot = () => {
        if (!newSlot.trim()) return;
        addMentorSlot(newSlot);
        setNewSlot('');
        toast.success("Time slot added & synced globally!", {
            style: { background: 'rgba(30,30,30,0.95)', color: '#fff', border: '1px solid rgba(175,203,255,0.2)' },
        });
    };

    if (loading) return <div className="p-8 text-white font-semibold">Loading Workspace...</div>;

    const sessions = mentorSessions.length > 0 ? mentorSessions : [
        { id: 1, user: 'Alex', ageGroup: '16-18', time: 'Today, 2:00 PM', status: 'In Progress' }
    ];

    return (
        <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8">
                
                {/* Main Content Area */}
                <div className="flex flex-col gap-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                            Today's Caseload <span className="text-2xl">🧑‍🏫</span>
                        </h1>
                        <p className="text-white/40 mt-1">Manage your active mentoring sessions</p>
                    </div>

                    {/* Assigned Sessions List */}
                    <div className="flex flex-col gap-3 flex-wrap">
                        {sessions.map((session) => (
                            <div key={session.id} className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-row items-center justify-between hover:bg-white/10 transition-colors">
                                <div className="flex flex-row gap-4 items-center">
                                    <div className="w-12 h-12 rounded-xl bg-accent/20 border border-accent/30 flex items-center justify-center">
                                        <Users size={20} className="text-accent" />
                                    </div>
                                    <div className="flex flex-col">
                                        <h3 className="m-0 font-bold text-white text-lg">{session.user} <span className="text-xs text-white/40 ml-1 font-medium">({session.ageGroup})</span></h3>
                                        <p className="m-0 text-white/50 text-xs mt-0.5 flex items-center gap-1"><Clock size={12}/> {session.time}</p>
                                    </div>
                                </div>
                                <div className="flex flex-row gap-4 items-center">
                                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                                        {session.status}
                                    </span>
                                    <button className="p-2 rounded-lg bg-white/5 hover:bg-white/20 text-white transition-colors cursor-pointer">
                                        <ArrowRight size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Session Detail Section */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mt-2 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-2 h-full bg-accent"></div>
                        
                        <div className="flex flex-row justify-between mb-8 items-center border-b border-white/10 pb-4">
                            <h2 className="flex items-center gap-3 m-0 text-xl font-bold text-white">
                                <Users size={24} className="text-accent" /> Case Focus: Alex
                            </h2>
                            {isCompleted && (
                                <span className="bg-green-500/20 border border-green-500/40 text-green-400 px-3 py-1 rounded-full flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                                    <CheckCircle2 size={16} /> Completed
                                </span>
                            )}
                        </div>

                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col gap-2 relative">
                                <label className="text-xs font-bold uppercase tracking-widest text-white/50 bg-background-primary px-2 absolute -top-2.5 left-3">Video Link</label>
                                <div className="flex flex-row gap-0">
                                    <input 
                                        className="bg-transparent border border-white/20 rounded-l-xl flex-1 text-sm font-mono p-3 text-white focus:outline-none focus:border-accent" 
                                        value={meetingLink} 
                                        onChange={(e) => setMeetingLink(e.target.value)} 
                                    />
                                    <button className="bg-white/10 hover:bg-white/20 border border-l-0 border-white/20 rounded-r-xl px-4 text-white transition-colors cursor-pointer">
                                        <Save size={18} />
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2 relative mt-4">
                                <label className="text-xs font-bold uppercase tracking-widest text-white/50 bg-background-primary px-2 absolute -top-2.5 left-3">Confidential Notes</label>
                                <textarea 
                                    className="bg-transparent border border-white/20 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-accent h-32 resize-none" 
                                    value={notes} 
                                    onChange={(e) => setNotes(e.target.value)} 
                                />
                            </div>

                            <button 
                                className={`w-full py-4 rounded-xl text-sm font-bold uppercase tracking-widest mt-2 transition-all cursor-pointer ${isCompleted ? 'bg-white/5 text-white/40 border border-white/10 hover:bg-white/10' : 'bg-accent/20 border border-accent/40 text-accent hover:bg-accent/30'}`} 
                                onClick={() => {
                                    setIsCompleted(!isCompleted);
                                    if(!isCompleted) toast.success("Session marked as Complete!", { style: { background: 'rgba(30,30,30,0.95)', color: '#fff' } });
                                }}
                            >
                                {isCompleted ? 'Re-open Session Details' : 'Finalize & Sign Off Session'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="flex flex-col gap-6">
                    {/* Slot Manager */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden">
                        <div className="absolute -top-4 -right-4 bg-accent/20 p-4 rounded-full blur-xl w-32 h-32 pointer-events-none"></div>
                        <h3 className="flex items-center gap-2 mb-6 text-lg font-bold text-white relative z-10">
                            <Calendar className="text-accent" size={20} /> Slot Manager
                        </h3>
                        
                        <div className="flex flex-col gap-2 mb-6">
                            {mentorSlots.map((slot, index) => (
                                <div key={index} className="flex flex-row justify-between items-center bg-white/5 border border-white/10 rounded-lg p-3 group hover:bg-red-500/10 hover:border-red-500/20 transition-all">
                                    <span className="text-sm text-white font-medium">{slot}</span>
                                    <button onClick={() => removeMentorSlot(index)} className="text-white/20 group-hover:text-red-400 hover:scale-110 transition-all cursor-pointer">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                            {mentorSlots.length === 0 && <div className="p-4 text-center text-xs text-white/40 italic">No slots listed.</div>}
                        </div>

                        <div className="flex flex-col gap-3 relative z-10">
                            <input 
                                className="bg-transparent border border-white/20 rounded-lg p-3 text-xs uppercase font-bold text-white focus:outline-none focus:border-accent" 
                                placeholder="e.g. THU 2:00 PM" 
                                value={newSlot} 
                                onChange={(e) => setNewSlot(e.target.value)} 
                                onKeyPress={(e) => e.key === 'Enter' && handleAddSlot()} 
                            />
                            <button 
                                className="w-full py-3 bg-accent/20 hover:bg-accent/30 text-accent border border-accent/40 rounded-lg text-xs font-bold tracking-widest uppercase transition-all cursor-pointer" 
                                onClick={handleAddSlot}
                            >
                                Publish Slot
                            </button>
                            <p className="text-[10px] uppercase font-semibold text-white/30 text-center mt-2">Live sync: Slots instantly available to adolescents.</p>
                        </div>
                    </div>

                    {/* Supervisor Metrics */}
                    <div className="bg-background-primary border border-white/10 rounded-2xl p-6 relative overflow-hidden">
                        <h3 className="flex items-center gap-2 mb-6 text-accent text-xs font-bold uppercase tracking-widest relative z-10">
                            <Clock size={16} /> Supervisor Metrics
                        </h3>
                        <div className="space-y-4 relative z-10">
                            <div className="flex justify-between items-center border-b border-white/5 pb-3">
                                <span className="text-xs text-white/50 font-medium">Total Adolescents</span>
                                <span className="text-lg font-bold text-white">12</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-white/5 pb-3">
                                <span className="text-xs text-white/50 font-medium">Completed (Today)</span>
                                <span className="text-lg font-bold text-white">4</span>
                            </div>
                            <div className="flex justify-between items-center pt-1">
                                <span className="text-xs text-white/50 font-medium">Upcoming</span>
                                <span className="text-lg font-bold text-accent">{sessions.length}</span>
                            </div>
                        </div>
                        <button className="w-full mt-6 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg text-xs font-bold uppercase tracking-widest py-3 transition-colors cursor-pointer relative z-10">
                            Sync Schedule
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
