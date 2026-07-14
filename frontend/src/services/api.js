import axios from 'axios';

// In development Vite forwards this path to the Spring Boot server.  A deployed
// frontend can set VITE_API_BASE_URL without changing source code.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const authService = {
  getCurrentUser: () => apiClient.get('/auth/me'),
};

export const facilityService = {
  getAllFacilities: () => apiClient.get('/public/facilities'),
  getAvailableFacilities: () => apiClient.get('/public/facilities/available'),
  getFacilitiesByType: (type) => apiClient.get(`/public/facilities/type/${type}`),
  checkAvailability: (facilityId, date, startTime, endTime) =>
    apiClient.post('/public/check-availability', null, {
      params: { facilityId, date, startTime, endTime },
    }),
  createFacility: (data) => apiClient.post('/admin/facilities', data),
  updateFacility: (id, data) => apiClient.put(`/admin/facilities/${id}`, data),
  deleteFacility: (id) => apiClient.delete(`/admin/facilities/${id}`),
};

export const bookingService = {
  createBooking: (data) => apiClient.post('/staff/bookings', data),
  getMyBookings: () => apiClient.get('/staff/bookings/my-bookings'),
  getBookingById: (id) => apiClient.get(`/staff/bookings/${id}`),
  cancelBooking: (id) => apiClient.delete(`/staff/bookings/${id}/cancel`),
  getAllBookings: () => apiClient.get('/admin/bookings'),
  approveBooking: (id) => apiClient.put(`/admin/bookings/${id}/approve`),
  rejectBooking: (id) => apiClient.put(`/admin/bookings/${id}/reject`),
};

export const issueService = {
  reportIssue: (data) => apiClient.post('/staff/issues', data),
  getMyIssues: () => apiClient.get('/staff/issues/my-issues'),
  getIssueById: (id) => apiClient.get(`/staff/issues/${id}`),
  getAllIssues: () => apiClient.get('/admin/issues'),
  updateIssueStatus: (id, status) =>
    apiClient.put(`/admin/issues/${id}/status`, null, { params: { status } }),
  getOpenIssues: () => apiClient.get('/admin/issues/open'),
};

export default apiClient;
