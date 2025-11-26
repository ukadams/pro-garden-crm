import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

// API endpoints
export const authAPI = {
  login: (credentials: { email: string; password: string }) => {
    const formData = new FormData();
    formData.append('username', credentials.email);
    formData.append('password', credentials.password);
    return api.post('/token', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
  },
  register: (userData: any) =>
    api.post('/auth/register', userData),
  getCurrentUser: () =>
    api.get('/auth/me'),
}

export const clientsAPI = {
  getAll: () => api.get('/clients/'),
  getById: (id: number) => api.get(`/clients/${id}`),
  create: (data: any) => api.post('/clients/', data),
  update: (id: number, data: any) => api.put(`/clients/${id}`, data),
  delete: (id: number) => api.delete(`/clients/${id}`),
}

export const appointmentsAPI = {
  getAll: () => api.get('/appointments/'),
  getById: (id: number) => api.get(`/appointments/${id}`),
  create: (data: any) => api.post('/appointments/', data),
  update: (id: number, data: any) => api.put(`/appointments/${id}`, data),
  delete: (id: number) => api.delete(`/appointments/${id}`),
}

export const invoicesAPI = {
  getAll: () => api.get('/invoices/'),
  getById: (id: number) => api.get(`/invoices/${id}`),
  create: (data: any) => api.post('/invoices/', data),
  update: (id: number, data: any) => api.put(`/invoices/${id}`, data),
  delete: (id: number) => api.delete(`/invoices/${id}`),
}

export const inventoryAPI = {
  getAll: () => api.get('/inventory/'),
  getById: (id: number) => api.get(`/inventory/${id}`),
  create: (data: any) => api.post('/inventory/', data),
  update: (id: number, data: any) => api.put(`/inventory/${id}`, data),
  delete: (id: number) => api.delete(`/inventory/${id}`),
}

export const customerAPI = {
  getAll: () => api.get('/customers/'),
  getById: (id: number) => api.get(`/customers/${id}`),
  create: (data: any) => api.post('/customers/', data),
  update: (id: number, data: any) => api.put(`/customers/${id}`, data),
  delete: (id: number) => api.delete(`/customers/${id}`),
}

export const financialAPI = {
  getAll: () => api.get('/financial/'),
  getById: (id: number) => api.get(`/financial/${id}`),
  create: (data: any) => api.post('/financial/', data),
  update: (id: number, data: any) => api.put(`/financial/${id}`, data),
  delete: (id: number) => api.delete(`/financial/${id}`),
  createFromCustomer: (customerId: number) => api.post(`/financial/from-customer/${customerId}`),
  getSummary: () => api.get('/financial/dashboard/summary'),
}

export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
  getRecentAppointments: () => api.get('/dashboard/recent-appointments'),
}


