import api, { mockDelay } from './api';

export async function submitRecording(audioBlob) {
  await mockDelay(1500);
  try {
    const formData = new FormData();
    formData.append('audio', audioBlob);
    const response = await api.post('/recording', formData);
    return response.data;
  } catch {
    return { success: true, transcription: 'Recording processed successfully.', sentiment: 'neutral' };
  }
}
