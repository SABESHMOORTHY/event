import api from './api';

const authService = {
  login: async (credentials) => {
    const response = await api.post('/auth/signin', credentials);
    return response.data;
  },

  signup: async (userData) => {
    const response = await api.post('/auth/signup', userData);
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  updateProfile: async (userData) => {
    const response = await api.put('/users/profile', userData);
    return response.data;
  }
};

export default authService;

