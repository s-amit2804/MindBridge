import { createContext, useContext, useState, useEffect } from 'react';

const MoodContext = createContext(null);

const MOOD_LEVELS = {
  happy: { emoji: '😃', label: 'Happy', value: 3 },
  neutral: { emoji: '😐', label: 'Neutral', value: 2 },
  sad: { emoji: '😞', label: 'Sad', value: 1 },
};

export function MoodProvider({ children }) {
  const [currentMood, setCurrentMood] = useState('neutral');
  const [moodNote, setMoodNote] = useState('');
  const [moodHistory, setMoodHistory] = useState([]);

  useEffect(() => {
    document.documentElement.setAttribute('data-mood', currentMood);
  }, [currentMood]);

  const updateMood = (mood, note = '') => {
    setCurrentMood(mood);
    setMoodNote(note);
    setMoodHistory(prev => [{
      mood,
      note,
      timestamp: new Date().toISOString(),
    }, ...prev].slice(0, 50));
  };

  return (
    <MoodContext.Provider value={{
      currentMood,
      moodNote,
      moodHistory,
      updateMood,
      setMoodNote,
      MOOD_LEVELS,
      moodInfo: MOOD_LEVELS[currentMood],
    }}>
      {children}
    </MoodContext.Provider>
  );
}

export function useMood() {
  const context = useContext(MoodContext);
  if (!context) throw new Error('useMood must be used within MoodProvider');
  return context;
}
