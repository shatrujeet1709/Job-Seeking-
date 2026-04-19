import api from '../utils/axiosInstance';

export const getGigs = async (category = '', search = '') => {
  let url = '/freelance?';
  if (category) url += `category=${encodeURIComponent(category)}&`;
  if (search) url += `search=${encodeURIComponent(search)}`;
  
  const response = await api.get(url);
  return response.data;
};

export const getGigById = async (id) => {
  const response = await api.get(`/freelance/${id}`);
  return response.data;
};

export const createGig = async (gigData) => {
  const response = await api.post('/freelance', gigData);
  return response.data;
};

export const createOrder = async (gigId, packageId) => {
  const response = await api.post(`/freelance/${gigId}/order`, { packageId });
  return response.data;
};

export const verifyPayment = async (gigId, orderData) => {
  const response = await api.post(`/freelance/${gigId}/complete`, orderData);
  return response.data;
};
