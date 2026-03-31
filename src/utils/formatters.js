export function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function formatDate(date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));
}

export function formatDateTime(date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}

export function getSeverityColor(level) {
  const colors = {
    low: '#4ADE80',
    medium: '#FBBF24',
    high: '#F97316',
    critical: '#EF4444',
  };
  return colors[level] || colors.low;
}

export function getSeverityBg(level) {
  const colors = {
    low: 'rgba(74, 222, 128, 0.15)',
    medium: 'rgba(251, 191, 36, 0.15)',
    high: 'rgba(249, 115, 22, 0.15)',
    critical: 'rgba(239, 68, 68, 0.15)',
  };
  return colors[level] || colors.low;
}
