import api, { mockDelay } from './api';

export async function getAnalytics() {
  await mockDelay(1000);
  try {
    const response = await api.get('/analytics');
    return response.data;
  } catch {
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
      ],
    };
  }
}
