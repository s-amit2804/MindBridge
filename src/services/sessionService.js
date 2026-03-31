import api, { mockDelay } from './api';

export async function getSessions() {
  await mockDelay(700);
  try {
    const response = await api.get('/sessions');
    return response.data;
  } catch {
    return {
      sessions: [
        { id: 1, date: '2026-03-28', type: 'chat', severity: 'low', summary: 'Discussed stress management techniques.', duration: '15 min' },
        { id: 2, date: '2026-03-26', type: 'mentor', severity: 'medium', summary: 'Work-life balance counseling session.', duration: '30 min' },
        { id: 3, date: '2026-03-24', type: 'chat', severity: 'low', summary: 'Progress review on anxiety goals.', duration: '10 min' },
      ],
    };
  }
}

export async function getMentorSessions() {
  await mockDelay(700);
  try {
    const response = await api.get('/mentor/sessions');
    return response.data;
  } catch {
    return {
      upcoming: [
        { id: 1, mentorName: 'Dr. Sarah Chen', time: '2026-03-31T10:00:00', type: 'video', status: 'confirmed' },
        { id: 2, mentorName: 'Alex Rivera', time: '2026-04-01T14:30:00', type: 'audio', status: 'pending' },
      ],
      available: [],
    };
  }
}

export async function getEscalatedCases() {
  await mockDelay(800);
  try {
    const response = await api.get('/mentor/escalated');
    return response.data;
  } catch {
    return { cases: [] };
  }
}
