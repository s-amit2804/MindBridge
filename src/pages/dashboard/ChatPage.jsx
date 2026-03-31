import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, X, ShieldAlert, CheckCircle2, Clock, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { sendMessage } from '../../services/chatService';
import MessageBubble from '../../components/chat/MessageBubble';
import SplineViewer from '../../components/spline/SplineViewer';
import { useAppContext } from '../../context/AppContext';

export default function ChatPage() {
  const { 
      loading, 
      userMoodData, logMood, 
      mentorSlots, bookSlot,
      triggerAdminAlert
  } = useAppContext();

  const [messages, setMessages] = useState([
    {
      id: 0,
      text: "Hi there! I'm your NueraLyn AI companion. I'm here to listen, support, and help you navigate your emotions. How are you feeling today?",
      sender: 'bot',
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  // UI States
  const [showMoodOverlay, setShowMoodOverlay] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isMountedFade, setIsMountedFade] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [showScheduler, setShowScheduler] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initial Load Check (If Context is ready and no mood logged today)
  useEffect(() => {
      if (loading) return; 
      const today = new Date().toISOString().split('T')[0];
      if (!userMoodData[today]) {
          setShowMoodOverlay(true);
          setTimeout(() => setIsMountedFade(true), 50);
      }
  }, [loading, userMoodData]);

  const handleMoodSelect = (value) => {
      setIsTransitioning(true);
      setTimeout(() => {
          const today = new Date().toISOString().split('T')[0];
          logMood(today, value);
          setShowMoodOverlay(false);
          setIsTransitioning(false);
      }, 600);
  };

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage = {
      id: Date.now(),
      text: input.trim(),
      sender: 'user',
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await sendMessage(input.trim());
      setMessages(prev => [...prev, {
        id: response.id || Date.now() + 1,
        text: response.message,
        sender: 'bot',
        timestamp: response.timestamp || new Date().toISOString(),
      }]);
    } catch {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: "I'm sorry, I'm having trouble connecting. Please try again.",
        sender: 'bot',
        timestamp: new Date().toISOString(),
      }]);
    } finally {
      setIsTyping(false);
      inputRef.current?.focus();
    }
  };

  const endChatAndAnalyze = () => {
      const userText = messages.filter(m => m.sender === 'user').map(m => m.text.toLowerCase()).join(' ');
      
      let score = 15;
      const keywords = [];
      const triggers = {
          'stress': 20, 'anxiety': 30, 'struggle': 25, 
          'parent': 15, 'school': 35, 'pressure': 25, 
          'bad': 20, 'sad': 25, 'overwhelmed': 30, 'panic': 35,
          'lonely': 25, 'help': 40
      };

      for (const [word, weight] of Object.entries(triggers)) {
          if (userText.includes(word)) {
              score += weight;
              keywords.push(word);
          }
      }
      
      score = Math.min(score, 100);
      let riskLevel = 'Low Risk';
      if (score >= 80) riskLevel = 'High Risk';
      else if (score >= 51) riskLevel = 'Medium Risk';

      setAnalysisResult({ score, keywords, riskLevel });
      setShowSummary(true);

      if (score >= 80) {
          triggerAdminAlert({ issue: keywords[0] || 'High Intensity Session', intensity: 'High', mood: 1 });
      }
  };

  const handleScheduleSession = (slot) => {
      bookSlot(slot);
      setSelectedSlot(slot);
      setTimeout(() => {
          setShowScheduler(false);
          setSelectedSlot(null);
      }, 2000);
  };

  // Chart Data
  const generateLast30Days = () => {
      const days = [];
      for (let i = 29; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          days.push(date.toISOString().split('T')[0]);
      }
      return days;
  };

  const moodStyle = (val) => {
      const colors = {
          1: { bg: '#F87171' },
          2: { bg: '#FB923C' },
          3: { bg: '#FDE047' },
          4: { bg: '#86EFAC' },
          5: { bg: '#16A34A' },
          null: { bg: 'rgba(255,255,255,0.1)' } 
      };
      return colors[val] || colors[null];
  };

  const chartData = generateLast30Days().map(date => ({
      fullDate: date,
      displayDate: new Date(date).toLocaleDateString([], { month: 'short', day: 'numeric' }),
      mood: userMoodData?.[date] || 0 
  }));

  const CustomTooltip = ({ active, payload }) => {
      if (active && payload && payload.length) {
          const data = payload[0].payload;
          return (
              <div className="glass-panel p-2 text-xs">
                  <p className="font-bold text-white mb-1">{data.displayDate}</p>
                  <p className="text-white/70">Mood: {data.mood || 'N/A'}</p>
              </div>
          );
      }
      return null;
  };

  if (loading) return <div className="p-8 text-white font-semibold">Loading...</div>;

  if (showMoodOverlay) {
      return (
          <div className={`fixed inset-0 z-[100] flex items-center justify-center bg-[#FDFBF7] transition-all duration-[600ms] ease-out ${isMountedFade ? 'opacity-100 translate-x-0' : 'opacity-0'} ${isTransitioning ? '-translate-x-full opacity-0' : ''}`}>
              <div className="max-w-4xl w-full px-6 flex flex-col items-center justify-center text-center">
                  <h1 className="text-4xl md:text-6xl font-extrabold text-gray-800 mb-6 tracking-tight" style={{ fontFamily: 'var(--font-display, "Playfair Display")' }}>
                      How has your day been?
                  </h1>
                  <p className="text-xl md:text-2xl text-gray-500 mb-16 font-medium">
                      Before we continue, tell us how you're feeling today.
                  </p>
                  
                  <div className="flex justify-center flex-wrap gap-4 md:gap-8 w-full max-w-4xl">
                      {[
                          { emoji: '😊', label: 'Great', val: 5, bgHover: 'hover:bg-[#E8F5E9]', borderHover: 'hover:border-[#81C784]' },
                          { emoji: '🙂', label: 'Good', val: 4, bgHover: 'hover:bg-[#E0F2F1]', borderHover: 'hover:border-[#4DB6AC]' },
                          { emoji: '😐', label: 'Okay', val: 3, bgHover: 'hover:bg-[#FFF8E1]', borderHover: 'hover:border-[#FFD54F]' },
                          { emoji: '😔', label: 'Low', val: 2, bgHover: 'hover:bg-[#FFF3E0]', borderHover: 'hover:border-[#FFB74D]' },
                          { emoji: '😣', label: 'Struggling', val: 1, val: 1, bgHover: 'hover:bg-[#FFEBEE]', borderHover: 'hover:border-[#E57373]' }
                      ].map((mood) => (
                          <button
                              key={mood.val}
                              onClick={() => handleMoodSelect(mood.val)}
                              disabled={isTransitioning}
                              className={`group flex flex-col items-center justify-center w-32 h-40 md:w-44 md:h-52 rounded-[2rem] border-2 border-gray-200 bg-white shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-[1.05] active:scale-95 ${mood.bgHover} ${mood.borderHover} cursor-pointer`}
                          >
                              <span className="text-5xl md:text-7xl mb-4 transition-transform duration-300 group-hover:scale-110">{mood.emoji}</span>
                              <span className="text-base md:text-xl font-bold text-gray-700 group-hover:text-gray-900">{mood.label}</span>
                          </button>
                      ))}
                  </div>
              </div>
          </div>
      );
  }

  return (
    <div className="flex h-full relative overflow-hidden">
      {/* Scheduler Modal */}
      {showScheduler && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
            <div className="bg-background-primary p-8 rounded-2xl border border-glass-border shadow-2xl max-w-xl w-full relative">
                <button onClick={() => setShowScheduler(false)} className="absolute top-4 right-4 text-white/50 hover:text-white cursor-pointer">
                    <X size={20} />
                </button>
                <h2 className="text-xl font-bold text-white mb-2">Schedule Mentor Session</h2>
                <p className="text-white/50 text-sm mb-6">Pick an available time slot from our professional team.</p>
                
                <div className="flex flex-col gap-3 max-h-60 overflow-y-auto mb-6 pr-2">
                    {mentorSlots.map((slot, i) => (
                        <button 
                            key={i}
                            onClick={() => handleScheduleSession(slot)}
                            className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-all cursor-pointer text-left"
                            disabled={selectedSlot !== null}
                        >
                            <div className="flex items-center gap-2 text-white text-sm"><Clock size={16}/> {slot}</div>
                            <span className="text-xs text-accent">Select</span>
                        </button>
                    ))}
                    {mentorSlots.length === 0 && <p className="p-4 bg-white/5 rounded-xl border border-white/10 text-center text-sm text-white/50">No slots available right now. Check back later.</p>}
                </div>

                {selectedSlot && (
                    <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-4 flex items-center gap-3">
                        <CheckCircle2 className="text-green-400" size={20} />
                        <span className="text-green-400 text-sm">Confirmed for {selectedSlot}! </span>
                    </div>
                )}
            </div>
        </div>
      )}

      {/* Analysis Modal */}
      {showSummary && analysisResult && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
            <div className="bg-background-primary p-8 rounded-2xl border border-glass-border shadow-2xl max-w-lg w-full relative">
                <button onClick={() => setShowSummary(false)} className="absolute top-4 right-4 text-white/50 hover:text-white cursor-pointer">
                    <X size={20} />
                </button>
                <h2 className="text-xl font-bold text-white mb-4">Session Analysis</h2>
                
                <div className="flex flex-col gap-4 mb-6">
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <p className="text-[10px] text-white/40 uppercase tracking-widest mb-2">Keywords Evaluated</p>
                        <div className="flex flex-wrap gap-2">
                            {analysisResult.keywords.length > 0 ? analysisResult.keywords.map(kw => (
                                <span key={kw} className="bg-accent/20 border border-accent/30 text-accent px-2 py-1 rounded text-xs">{kw}</span>
                            )) : <span className="text-xs italic text-white/30">None detected</span>}
                        </div>
                    </div>

                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                        <p className="text-[10px] text-white/40 uppercase tracking-widest mb-2">ML Intensity Score</p>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-2xl font-bold text-white">{analysisResult.score}/100</span>
                            <span className={`px-2 py-1 rounded text-xs border ${analysisResult.riskLevel === 'High Risk' ? 'bg-red-500/20 text-red-400 border-red-500/30' : analysisResult.riskLevel === 'Medium Risk' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' : 'bg-green-500/20 text-green-400 border-green-500/30'}`}>
                                {analysisResult.riskLevel}
                            </span>
                        </div>
                        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                            <div className={`h-full transition-all duration-1000 ${analysisResult.riskLevel === 'High Risk' ? 'bg-red-500' : analysisResult.riskLevel === 'Medium Risk' ? 'bg-yellow-500' : 'bg-green-500'}`} style={{ width: `${analysisResult.score}%` }}></div>
                        </div>
                    </div>
                </div>

                {analysisResult.score >= 80 && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start gap-3 mb-6 animate-pulse">
                        <ShieldAlert className="text-red-400 shrink-0 mt-0.5" size={18} />
                        <div>
                            <h4 className="text-sm font-semibold text-red-400 flex items-center gap-2">High Risk Detected</h4>
                            <p className="text-xs text-red-400/80 mt-1 leading-relaxed">Your intensity score indicates a high level of distress. A professional mentor has been automatically notified.</p>
                        </div>
                    </div>
                )}

                {analysisResult.score >= 51 && analysisResult.score < 80 && (
                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 flex flex-col gap-3 mb-6">
                        <h4 className="text-sm font-semibold text-yellow-400 flex items-center gap-2">Moderate Intensity</h4>
                        <p className="text-xs text-yellow-400/80 leading-relaxed">We noticed some pressure in your session. Would you like to connect with a trained Peer Mentor?</p>
                        <button onClick={() => setShowScheduler(true)} className="w-full bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 text-xs py-2 rounded-lg border border-yellow-500/30 transition-colors cursor-pointer">
                            Connect with Peer Mentor
                        </button>
                    </div>
                )}

                <button onClick={() => setShowSummary(false)} className="w-full py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 text-sm transition-colors cursor-pointer">
                    Close Analysis
                </button>
            </div>
        </div>
      )}

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-glass-border flex items-center gap-3 bg-background-primary/50 backdrop-blur-md">
          <div className="w-8 h-8 rounded-xl bg-accent/15 flex items-center justify-center">
            <Sparkles size={16} className="text-accent" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-white">AI Chat</h1>
            <p className="text-[10px] text-white/30">Your emotional wellness companion</p>
          </div>
          <div className="ml-auto flex items-center gap-4">
            <button onClick={() => setShowScheduler(true)} className="text-xs text-white/50 hover:text-white transition-colors cursor-pointer flex items-center gap-1"><Calendar size={12}/> Schedule</button>
            <button onClick={endChatAndAnalyze} className="text-xs text-accent font-semibold hover:text-accent/80 transition-colors cursor-pointer border border-accent/30 px-3 py-1.5 rounded-full bg-accent/10">End & Analyze</button>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-[10px] text-white/30 hidden sm:inline">Online</span>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-6 bg-transparent">
          <AnimatePresence>
            {messages.map((msg) => (
              <MessageBubble
                key={msg.id}
                message={msg}
                isBot={msg.sender === 'bot'}
              />
            ))}
          </AnimatePresence>

          {/* Typing indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 mb-4"
            >
              <div className="glass-card px-4 py-3 rounded-2xl rounded-tl-md flex items-center gap-2">
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 rounded-full bg-accent/50"
                      animate={{ y: [0, -6, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                    />
                  ))}
                </div>
                <span className="text-[10px] text-white/30">NueraLyn is thinking...</span>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="px-6 py-4 border-t border-glass-border bg-background-primary/50 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your message..."
              className="glass-input flex-1"
              disabled={isTyping}
            />
            <motion.button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-12 h-12 rounded-xl bg-accent/20 border border-accent/30 flex items-center justify-center
                text-accent hover:bg-accent/30 hover:shadow-[0_0_20px_rgba(175,203,255,0.2)]
                disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 cursor-pointer"
            >
              <Send size={18} />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Right Column: Chart & Spline */}
      <div className="hidden lg:flex w-80 xl:w-96 border-l border-glass-border flex-col bg-background-primary/50 overflow-y-auto">
        {/* Mood Chart */}
        <div className="p-6 border-b border-glass-border shrink-0">
            <h3 className="text-xs font-semibold text-white/60 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Sparkles size={14} className="text-accent" /> 30-Day Mood Intensity
            </h3>
            <div className="h-40 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                        <XAxis 
                            dataKey="displayDate" 
                            tick={{ fontSize: 9, fill: 'rgba(255,255,255,0.3)' }} 
                            interval={6} 
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis 
                            domain={[0, 5]} 
                            ticks={[1, 2, 3, 4, 5]}
                            tick={{ fontSize: 9, fill: 'rgba(255,255,255,0.3)' }}
                            axisLine={false}
                            tickLine={false}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                        <Bar dataKey="mood" radius={[2, 2, 0, 0]}>
                            {chartData.map((entry, index) => (
                                <Cell 
                                    key={`cell-${index}`} 
                                    fill={moodStyle(entry.mood).bg} 
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-between text-[10px] uppercase font-semibold text-white/30 mt-4 border-t border-glass-border pt-3">
                <span>Low</span>
                <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(v => <div key={v} className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: moodStyle(v).bg }} />)}
                </div>
                <span>High</span>
            </div>
        </div>

        {/* Spline Viewer */}
        <div className="flex-1 relative min-h-[400px]">
            <SplineViewer
            url="https://my.spline.design/rememberallrobot-wCx0EM8GP79Xp0xl03DvSAkM/"
            className="w-full h-full"
            />
            <div className="absolute bottom-6 left-0 right-0 text-center pointer-events-none">
            <p className="text-[10px] text-white/20 uppercase tracking-widest">NueraLyn Companion</p>
            </div>
        </div>
      </div>
    </div>
  );
}
