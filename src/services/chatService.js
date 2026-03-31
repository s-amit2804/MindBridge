import api, { mockDelay } from './api';

export async function sendMessage(message) {
  await mockDelay(1200);
  try {
    const response = await api.post('/chat', { message });
    return response.data;
  } catch {
    await mockDelay(500);
    return {
      id: Date.now(),
      message: "I hear you. Let's talk about what's on your mind. How are you feeling right now?",
      timestamp: new Date().toISOString(),
      sender: 'bot',
    };
  }
}
