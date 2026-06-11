import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' }
})

// Attach JWT token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Handle 401
api.interceptors.response.use(
  res => res,
  error => {
    if (error.response?.status === 401) {
      localStorage.clear()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api

// Auth
export const authAPI = {
  register: data => api.post('/auth/register', data),
  login: data => api.post('/auth/login', data),
}

// Vehicles
export const vehicleAPI = {
  getAll: () => api.get('/vehicles'),
  getAvailable: () => api.get('/vehicles/available'),
  search: (startDate, endDate, type) =>
    api.get(`/vehicles/search?startDate=${startDate}&endDate=${endDate}${type ? '&type=' + type : ''}`),
  getById: id => api.get(`/vehicles/${id}`),
  create: data => api.post('/vehicles', data),
  update: (id, data) => api.put(`/vehicles/${id}`, data),
  delete: id => api.delete(`/vehicles/${id}`),
  updateStatus: (id, status) => api.patch(`/vehicles/${id}/status?status=${status}`),
}

// Bookings
export const bookingAPI = {
  create: data => api.post('/bookings', data),
  getMyBookings: () => api.get('/bookings/my'),
  getAll: () => api.get('/bookings'),
  getById: id => api.get(`/bookings/${id}`),
  cancel: id => api.patch(`/bookings/${id}/cancel`),
  updateStatus: (id, status) => api.patch(`/bookings/${id}/status?status=${status}`),
  updatePayment: (id, status) => api.patch(`/bookings/${id}/payment?status=${status}`),
}

// Users
export const userAPI = {
  getProfile: () => api.get('/users/me'),
  updateProfile: data => api.put('/users/me', data),
}

// Admin
export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getUsers: () => api.get('/admin/users'),
  toggleUser: id => api.patch(`/admin/users/${id}/toggle`),
}
