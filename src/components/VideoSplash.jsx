import React, { useState, useEffect, useRef } from 'react';
import { SkipForward, Volume2, VolumeX } from 'lucide-react';
import introVideo from '../assets/intro_video.mp4';

export default function VideoSplash({ onComplete }) {
    const [isMuted, setIsMuted] = useState(true);
    const [progress, setProgress] = useState(0);
    const videoRef = useRef(null);

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            setProgress((videoRef.current.currentTime / videoRef.current.duration) * 100);
        }
    };

    return (
        <div 
            onClick={onComplete}
            className="fixed inset-0 z-[9999] bg-black flex items-center justify-center cursor-pointer overflow-hidden"
        >
            <video
                ref={videoRef}
                autoPlay
                muted={isMuted}
                onTimeUpdate={handleTimeUpdate}
                onEnded={onComplete}
                className="max-h-screen max-w-full w-auto h-auto object-contain transition-opacity duration-1000"
            >
                <source src={introVideo} type="video/mp4" />
            </video>

            <div className="absolute bottom-12 left-12 right-12 flex flex-col gap-6">
                <div className="flex justify-between items-end">
                    <div className="bg-[#a78b71] p-4 py-2 rounded-lg border border-white/20 shadow-xl backdrop-blur-md bg-opacity-80">
                        <h1 className="text-2xl font-black text-black m-0 mb-1" style={{ fontFamily: 'var(--font-display, "Playfair Display")' }}>NueraLyn</h1>
                        <p className="text-[10px] uppercase font-black tracking-widest text-black/70 m-0 leading-none">Starting Emotional Journey</p>
                    </div>

                    <div className="flex gap-4">
                        <button 
                            onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); }}
                            className="p-3 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 text-white hover:bg-white/20 transition-all font-bold flex items-center"
                        >
                            {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                        </button>

                        <button 
                            onClick={(e) => { e.stopPropagation(); onComplete(); }}
                            className="py-3 px-8 text-xl bg-[#c9b8a0] rounded-lg border border-white/20 shadow-xl hover:-translate-y-1 transition-all flex items-center gap-3 text-black font-black"
                        >
                            <SkipForward size={24} fill="currentColor" /> 
                            <span style={{ fontFamily: 'var(--font-display, "Inter")' }}>SKIP INTRO</span>
                        </button>
                    </div>
                </div>

                <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden relative">
                    <div 
                        className="h-full bg-[#c9b8a0] transition-all duration-300 ease-linear rounded-full"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>
            
            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; visibility: hidden; } }
                .splash-complete { animation: fadeOut 0.8s forwards ease-in-out; }
            `}} />
        </div>
    );
}
