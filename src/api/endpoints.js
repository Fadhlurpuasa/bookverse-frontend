import api from './client';

export const authApi = {
  login: (payload) => api.post('/auth/login', payload),
  register: (payload) => api.post('/auth/register', payload),
  me: () => api.get('/auth/me')
};

export const bookApi = {
  list: (params = {}) => api.get('/books', { params }),
  detail: (identifier) => api.get(`/books/${identifier}`),
  adminList: () => api.get('/books/admin/all/list'),
  create: (payload) => api.post('/books', payload),
  update: (id, payload) => api.patch(`/books/${id}`, payload),
  remove: (id) => api.delete(`/books/${id}`)
};

export const taxonomyApi = {
  categories: () => api.get('/categories'),
  authors: () => api.get('/authors'),
  publishers: () => api.get('/publishers'),
  createCategory: (payload) => api.post('/categories', payload),
  createAuthor: (payload) => api.post('/authors', payload),
  createPublisher: (payload) => api.post('/publishers', payload)
};

export const recApi = {
  recommend: (payload) => api.post('/recommendations', payload),
  savePreferences: (payload) => api.put('/recommendations/preferences', payload),
  forMe: () => api.get('/recommendations/for-me')
};

export const cartApi = {
  get: () => api.get('/cart'),
  add: (payload) => api.post('/cart', payload),
  update: (id, quantity) => api.patch(`/cart/${id}`, { quantity }),
  remove: (id) => api.delete(`/cart/${id}`),
  clear: () => api.delete('/cart')
};

export const wishlistApi = {
  get: () => api.get('/wishlist'),
  toggle: (bookId) => api.post(`/wishlist/${bookId}/toggle`)
};

export const addressApi = {
  list: () => api.get('/addresses'),
  create: (payload) => api.post('/addresses', payload)
};

export const orderApi = {
  checkout: (payload) => api.post('/orders/checkout', payload),
  mine: () => api.get('/orders/mine'),
  adminAll: () => api.get('/orders/admin/all'),
  updateStatus: (id, payload) => api.patch(`/orders/${id}/status`, payload)
};

export const adminApi = {
  dashboard: () => api.get('/admin/dashboard'),
  apiKeys: () => api.get('/admin/api-keys'),
  createApiKey: (payload) => api.post('/admin/api-keys', payload),
  toggleApiKey: (id) => api.patch(`/admin/api-keys/${id}/toggle`)
};
