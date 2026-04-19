import api from '../utils/axiosInstance';

export const getMyProfile = async () => {
  const response = await api.get('/profile');
  return response.data;
};

export const createOrUpdateProfile = async (profileData) => {
  const response = await api.post('/profile', profileData);
  return response.data;
};

export const uploadResume = async (file) => {
  const formData = new FormData();
  formData.append('resume', file);
  
  const response = await api.post('/profile/resume', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getPublicProfile = async (userId) => {
  const response = await api.get(`/profile/${userId}`);
  return response.data;
};
