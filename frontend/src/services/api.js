import axios from 'axios';

export const API_BASE_URL = 'http://localhost:8181/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;

export const getProducts = (params = {}) => api.get('/products', { params });
export const getProduct = (id) => api.get(`/products/${id}`);
export const createProduct = (data) => api.post('/products', data);
export const updateProduct = (id, data) => api.put(`/products/${id}`, data);
export const deleteProduct = (id) => api.delete(`/products/${id}`);

export const getCategories = () => api.get('/categories');
export const getCategory = (id) => api.get(`/categories/${id}`);
export const createCategory = (data) => api.post('/categories', data);
export const updateCategory = (id, data) => api.put(`/categories/${id}`, data);
export const deleteCategory = (id) => api.delete(`/categories/${id}`);

export const registerUser = (data) => api.post('/users/register', data);
export const loginUser = (data) => api.post('/users/login', data);
export const getUsers = () => api.get('/users');

export const getOrders = () => api.get('/orders');
export const getOrder = (id) => api.get(`/orders/${id}`);
export const getOrdersByUser = (userId) => api.get(`/orders/user/${userId}`);
export const createOrder = (data) => api.post('/orders', data);
export const updateOrderStatus = (id, status) => api.put(`/orders/${id}/status`, { status });

export const getReviews = (productId) => api.get('/reviews', { params: { productId } });
export const getReviewSummary = () => api.get('/reviews/summary');
export const createReview =(data) => api.post('/reviews', data);

export const getDashboardCounts = () => api.get('/dashboard/counts');
