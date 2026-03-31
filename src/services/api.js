import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Mock interceptor — simulates backend responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If any network/connection error (no backend running), return mock data
    if (!error.response && error.config) {
      const { url, method, data } = error.config;
      const mockResponse = getMockResponse(url, method, data);
      if (mockResponse) {
        return Promise.resolve({ data: mockResponse, status: 200 });
      }
    }
    return Promise.reject(error);
  }
);

function getMockResponse(url, method, data) {
  // Chat
  if (url.includes('/chat') && method === 'post') {
    const parsedData = typeof data === 'string' ? JSON.parse(data) : data;
    return {
      id: Date.now(),
      message: generateBotResponse(parsedData?.message),
      timestamp: new Date().toISOString(),
      sender: 'bot',
    };
  }

  // Mood
  if (url.includes('/mood') && method === 'post') {
    return { success: true, message: 'Mood recorded successfully' };
  }

  // SOS
  if (url.includes('/sos') && method === 'post') {
    return { success: true, message: 'SOS alert sent. Connecting to professional mentor...' };
  }

  // Recording
  if (url.includes('/recording') && method === 'post') {
    return { success: true, transcription: 'Recording processed successfully.', sentiment: 'neutral' };
  }

  // Sessions
  if (url.includes('/sessions') && method === 'get') {
    return {
      sessions: [
        { id: 1, date: '2026-03-28', type: 'chat', severity: 'low', summary: 'Discussed daily stress management techniques and mindfulness practices.', duration: '15 min' },
        { id: 2, date: '2026-03-26', type: 'mentor', severity: 'medium', summary: 'Explored work-life balance challenges and developed coping strategies.', duration: '30 min' },
        { id: 3, date: '2026-03-24', type: 'chat', severity: 'low', summary: 'Reviewed progress on anxiety management goals and adjustments.', duration: '10 min' },
        { id: 4, date: '2026-03-20', type: 'recording', severity: 'high', summary: 'Voice session analyzing emotional patterns during stressful periods.', duration: '20 min' },
        { id: 5, date: '2026-03-18', type: 'chat', severity: 'medium', summary: 'Discussed relationship dynamics and communication improvement strategies.', duration: '25 min' },
        { id: 6, date: '2026-03-15', type: 'mentor', severity: 'low', summary: 'Regular check-in session with peer mentor. Overall positive mood.', duration: '30 min' },
      ],
    };
  }

  // Analytics
  if (url.includes('/analytics') && method === 'get') {
    return {
      heatmapData: [
        { region: 'North', low: 45, medium: 30, high: 15, critical: 5 },
        { region: 'South', low: 55, medium: 25, high: 12, critical: 3 },
        { region: 'East', low: 35, medium: 35, high: 20, critical: 8 },
        { region: 'West', low: 50, medium: 28, high: 14, critical: 6 },
        { region: 'Central', low: 40, medium: 32, high: 18, critical: 10 },
      ],
      distressOverTime: [
        { month: 'Oct', score: 42 },
        { month: 'Nov', score: 38 },
        { month: 'Dec', score: 45 },
        { month: 'Jan', score: 35 },
        { month: 'Feb', score: 30 },
        { month: 'Mar', score: 28 },
      ],
      issueTypes: [
        { name: 'Anxiety', value: 35, color: '#AFCBFF' },
        { name: 'Depression', value: 25, color: '#8AB4FF' },
        { name: 'Stress', value: 20, color: '#6B9FFF' },
        { name: 'Relationships', value: 12, color: '#4D8AFF' },
        { name: 'Other', value: 8, color: '#3375FF' },
      ],
      activeCases: [
        { id: 1, user: 'Anonymous #1042', severity: 'critical', lastActivity: '2 hours ago', issue: 'Severe anxiety' },
        { id: 2, user: 'Anonymous #1089', severity: 'high', lastActivity: '5 hours ago', issue: 'Depression symptoms' },
        { id: 3, user: 'Anonymous #1105', severity: 'medium', lastActivity: '1 day ago', issue: 'Work stress' },
        { id: 4, user: 'Anonymous #1120', severity: 'high', lastActivity: '3 hours ago', issue: 'Social isolation' },
      ],
    };
  }

  // Mentor sessions
  if (url.includes('/mentor/sessions') && method === 'get') {
    return {
      upcoming: [
        { id: 1, mentorName: 'Dr. Sarah Chen', time: '2026-03-31T10:00:00', type: 'video', status: 'confirmed' },
        { id: 2, mentorName: 'Alex Rivera', time: '2026-04-01T14:30:00', type: 'audio', status: 'pending' },
      ],
      available: [
        { id: 3, mentorName: 'Dr. James Park', specialization: 'Anxiety & Stress', rating: 4.9, nextSlot: '2026-04-02T09:00:00' },
        { id: 4, mentorName: 'Maya Johnson', specialization: 'Youth Counseling', rating: 4.8, nextSlot: '2026-04-02T11:00:00' },
      ],
    };
  }

  // Escalated cases for professional mentor
  if (url.includes('/mentor/escalated') && method === 'get') {
    return {
      cases: [
        { id: 1, summary: 'User expressing persistent feelings of hopelessness over 2 weeks. Multiple SOS triggers.', severity: 'critical', keywords: ['hopelessness', 'isolation', 'sleep issues'], priority: 'Critical', userId: 'Anon-1042', timestamp: '2 hours ago' },
        { id: 2, summary: 'Elevated anxiety scores with increasing frequency. Reports panic attacks during work.', severity: 'high', keywords: ['panic attacks', 'work anxiety', 'chest tightness'], priority: 'High', userId: 'Anon-1089', timestamp: '5 hours ago' },
        { id: 3, summary: 'Moderate depressive symptoms flagged by AI analysis. Declining engagement with activities.', severity: 'high', keywords: ['low motivation', 'withdrawing', 'fatigue'], priority: 'High', userId: 'Anon-1105', timestamp: '1 day ago' },
      ],
    };
  }

  return null;
}

function generateBotResponse(userMessage) {
  const responses = [
    "I hear you, and I want you to know that your feelings are completely valid. Let's explore this together — what do you think triggered these emotions?",
    "Thank you for sharing that with me. It takes courage to open up. Can you tell me more about when you first started feeling this way?",
    "That sounds really challenging. Remember, it's okay to not be okay sometimes. What coping strategies have you tried so far?",
    "I appreciate your honesty. Let's work through this step by step. What would make you feel even slightly better right now?",
    "You're not alone in this. Many people experience similar feelings. Would you like to try a quick mindfulness exercise together?",
    "I understand. It's important to acknowledge these feelings rather than push them away. How has this been affecting your daily life?",
  ];
  return responses[Math.floor(Math.random() * responses.length)];
}

// Wrapper functions with simulated delay
export async function mockDelay(ms = 800) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default api;
