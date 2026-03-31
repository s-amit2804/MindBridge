import api, { mockDelay } from './api';

export async function submitMood(mood, note = '') {
  await mockDelay(600);
  try {
    const response = await api.post('/mood', { mood, note });
    return response.data;
  } catch {
    return { success: true, message: 'Mood recorded' };
  }
}
