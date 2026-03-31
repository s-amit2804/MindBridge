import { useState } from 'react';
import { motion } from 'framer-motion';
import ErrorBoundary from '../ui/ErrorBoundary';

// Map user-facing URLs to embed-friendly URLs
const SPLINE_URLS = {
  'https://my.spline.design/theeternalarc-GSwwyJfW7FIgsKGpjKVvwhbO-dhw/':
    'https://my.spline.design/theeternalarc-GSwwyJfW7FIgsKGpjKVvwhbO-dhw/',
  'https://my.spline.design/rememberallrobot-wCx0EM8GP79Xp0xl03DvSAkM/':
    'https://my.spline.design/rememberallrobot-wCx0EM8GP79Xp0xl03DvSAkM/',
  'https://my.spline.design/rememberallrobot-86HykWBY5QBujgj1UZNVRusJ/':
    'https://my.spline.design/rememberallrobot-86HykWBY5QBujgj1UZNVRusJ/embed',
  'https://my.spline.design/voiceinteractionanimation-jBgLbgBJdNgfjwS8h1sKqFqB/':
    'https://my.spline.design/voiceinteractionanimation-jBgLbgBJdNgfjwS8h1sKqFqB/',
};

function SplineFallback({ className = '' }) {
  return (
    <div className={`flex items-center justify-center bg-gradient-to-br from-accent/5 to-transparent ${className}`}>
      <div className="text-center">
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 3, repeat: Infinity }}
          className="w-24 h-24 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center"
        >
          <span className="text-4xl">🧠</span>
        </motion.div>
        <p className="text-xs text-white/20">3D Scene</p>
      </div>
    </div>
  );
}

function SplineIframe({ url, className = '' }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Transform URL to embed-friendly format using the mapping
  const embedUrl = SPLINE_URLS[url] || url;

  if (error) {
    return <SplineFallback className={className} />;
  }

  return (
    <div className={`relative ${className}`} style={{ minWidth: '100%', minHeight: '100%' }}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <motion.div
            className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        </div>
      )}
      <iframe
        src={embedUrl}
        frameBorder="0"
        width="100%"
        height="100%"
        title="3D Scene"
        onLoad={() => setLoading(false)}
        onError={() => {
          setLoading(false);
          setError(true);
        }}
        style={{
          border: 'none',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          visibility: loading ? 'hidden' : 'visible',
        }}
        allow="autoplay"
        allowFullScreen
      />
    </div>
  );
}

export default function SplineViewer({ url, className = '' }) {
  return (
    <ErrorBoundary fallback={<SplineFallback className={className} />}>
      <SplineIframe url={url} className={className} />
    </ErrorBoundary>
  );
}
