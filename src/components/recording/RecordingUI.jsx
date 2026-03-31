import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Square, Upload } from 'lucide-react';
import SplineViewer from '../../components/spline/SplineViewer';
import Button from '../../components/ui/Button';
import { submitRecording } from '../../services/recordingService';
import { formatTime } from '../../utils/formatters';
import toast from 'react-hot-toast';

export default function RecordingUI({ onComplete }) {
  const [isRecording, setIsRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [processing, setProcessing] = useState(false);
  const timerRef = useRef(null);
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  // Waveform animation
  const drawWaveform = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = 'rgba(175, 203, 255, 0.3)';

    const barCount = 40;
    const barWidth = (width / barCount) * 0.6;
    const gap = (width / barCount) * 0.4;

    for (let i = 0; i < barCount; i++) {
      const barHeight = isRecording
        ? Math.random() * height * 0.8 + height * 0.1
        : height * 0.1;
      const x = i * (barWidth + gap);
      const y = (height - barHeight) / 2;

      ctx.beginPath();
      ctx.roundRect(x, y, barWidth, barHeight, 2);
      ctx.fill();
    }

    animationRef.current = requestAnimationFrame(drawWaveform);
  }, [isRecording]);

  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setSeconds(s => s + 1);
      }, 1000);
      drawWaveform();
    } else {
      clearInterval(timerRef.current);
      cancelAnimationFrame(animationRef.current);
    }

    return () => {
      clearInterval(timerRef.current);
      cancelAnimationFrame(animationRef.current);
    };
  }, [isRecording, drawWaveform]);

  const startRecording = () => {
    setIsRecording(true);
    setSeconds(0);
  };

  const stopRecording = async () => {
    setIsRecording(false);
    setProcessing(true);

    try {
      const result = await submitRecording(new Blob());
      toast.success('Recording processed successfully!', {
        style: {
          background: 'rgba(30, 30, 30, 0.95)',
          color: '#fff',
          border: '1px solid rgba(175, 203, 255, 0.2)',
        },
      });
      onComplete?.(result);
    } catch {
      toast.error('Failed to process recording');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="glass-panel p-6 space-y-6">
      {/* Spline Animation */}
      <AnimatePresence>
        {isRecording && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 200 }}
            exit={{ opacity: 0, height: 0 }}
            className="rounded-xl overflow-hidden"
          >
            <SplineViewer
              url="https://my.spline.design/voiceinteractionanimation-jBgLbgBJdNgfjwS8h1sKqFqB/"
              className="w-full h-[200px]"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recording Status */}
      <div className="flex items-center justify-center gap-4">
        {isRecording && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-3"
          >
            <span className="w-3 h-3 rounded-full bg-sos animate-pulse" />
            <span className="text-sm text-white/70 font-mono">{formatTime(seconds)}</span>
          </motion.div>
        )}
      </div>

      {/* Waveform */}
      <div className="h-16 rounded-xl overflow-hidden bg-white/3">
        <canvas
          ref={canvasRef}
          width={600}
          height={64}
          className="w-full h-full"
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        {!isRecording ? (
          <Button
            variant="primary"
            size="lg"
            icon={Mic}
            onClick={startRecording}
            disabled={processing}
          >
            {processing ? 'Processing...' : 'Start Recording'}
          </Button>
        ) : (
          <Button
            variant="danger"
            size="lg"
            icon={Square}
            onClick={stopRecording}
          >
            Stop Recording
          </Button>
        )}
      </div>
    </div>
  );
}
