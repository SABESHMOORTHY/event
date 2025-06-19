import api from './api';

const eventService = {
  // Public endpoints
  getAllEvents: async () => {
    const response = await api.get('/events/public/all');
    return response.data;
  },

  getUpcomingEvents: async () => {
    const response = await api.get('/events/public/upcoming');
    return response.data;
  },

  getPastEvents: async () => {
    const response = await api.get('/events/public/past');
    return response.data;
  },

  getEventsByCategory: async (category) => {
    const response = await api.get(`/events/public/category/${category}`);
    return response.data;
  },

  searchEvents: async (keyword) => {
    const response = await api.get(`/events/public/search?keyword=${keyword}`);
    return response.data;
  },

  getEventById: async (id) => {
    const response = await api.get(`/events/public/${id}`);
    return response.data;
  },

  // Protected endpoints
  getEventByIdForUser: async (id) => {
    const response = await api.get(`/events/${id}`);
    return response.data;
  },

  createEvent: async (eventData) => {
    const response = await api.post('/events', eventData);
    return response.data;
  },

  updateEvent: async (id, eventData) => {
    const response = await api.put(`/events/${id}`, eventData);
    return response.data;
  },

  deleteEvent: async (id) => {
    const response = await api.delete(`/events/${id}`);
    return response.data;
  },

  registerForEvent: async (id) => {
    const response = await api.post(`/events/${id}/register`);
    return response.data;
  },

  unregisterFromEvent: async (id) => {
    const response = await api.post(`/events/${id}/unregister`);
    return response.data;
  },

  getUserRegisteredEvents: async () => {
    const response = await api.get('/events/my-events');
    return response.data;
  },

  getUserOrganizedEvents: async () => {
    const response = await api.get('/events/my-organized');
    return response.data;
  },

  // New share functionality endpoints
  getEventByShareCode: async (shareCode) => {
    const response = await api.get(`/events/public/share/${shareCode}`);
    return response.data;
  },

  getEventByShareCodeForUser: async (shareCode) => {
    const response = await api.get(`/events/share/${shareCode}`);
    return response.data;
  },

  registerForEventByShareCode: async (shareCode) => {
    const response = await api.post(`/events/share/${shareCode}/register`);
    return response.data;
  }
};

export default eventService;

