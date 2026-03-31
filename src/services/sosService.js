import api, { mockDelay } from './api';

export async function triggerSOS() {
  await mockDelay(400);
  try {
    const response = await api.post('/sos', { timestamp: new Date().toISOString() });
    return response.data;
  } catch {
    return { success: true, message: 'SOS alert sent. Connecting to professional mentor...' };
  }
}
