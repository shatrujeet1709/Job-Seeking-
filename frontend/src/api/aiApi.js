import api from '../utils/axiosInstance';

export const getAIRecommendations = async () => {
  const response = await api.get('/ai/recommend');
  return response.data;
};

export const analyzeProfile = async () => {
  const response = await api.post('/ai/analyze-profile');
  return response.data;
};
