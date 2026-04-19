import api from '../utils/axiosInstance';

export const getJobs = async (params = {}) => {
  const { page = 1, limit = 20, skill, location, type, search } = params;
  let query = `?page=${page}&limit=${limit}`;
  if (skill) query += `&skill=${encodeURIComponent(skill)}`;
  if (location) query += `&location=${encodeURIComponent(location)}`;
  if (type) query += `&type=${encodeURIComponent(type)}`;
  if (search) query += `&search=${encodeURIComponent(search)}`;
  
  const response = await api.get(`/jobs${query}`);
  return response.data;
};

export const getJobById = async (id) => {
  const response = await api.get(`/jobs/${id}`);
  return response.data;
};

export const applyToJob = async (id, coverLetter = '') => {
  const response = await api.post(`/jobs/${id}/apply`, { coverLetter });
  return response.data;
};

export const getAppliedJobs = async () => {
  const response = await api.get('/jobs/user/applied');
  return response.data;
};
