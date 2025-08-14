import axios from 'axios';

// Configure API base URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error);
    if (error.response?.status === 401) {
      // Handle unauthorized access
      console.log('Unauthorized access, redirecting to login...');
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const apiEndpoints = {
  // Client management
  clientSetup: '/api/client/setup',
  getClient: (id) => `/api/client/${id}`,
  
  // Trend analysis
  analyzeTrends: '/api/trends/analyze',
  getClientTrends: (id) => `/api/trends/${id}`,
  
  // Content generation
  generateContent: '/api/content/generate',
  getClientContent: (id) => `/api/content/${id}`,
};

// API service functions
export const apiService = {
  // Client management
  setupClient: (clientData) => api.post(apiEndpoints.clientSetup, clientData),
  getClient: (clientId) => api.get(apiEndpoints.getClient(clientId)),
  
  // Trend analysis
  analyzeTrends: (data) => api.post(apiEndpoints.analyzeTrends, data),
  getClientTrends: (clientId) => api.get(apiEndpoints.getClientTrends(clientId)),
  
  // Content generation
  generateContent: (data) => api.post(apiEndpoints.generateContent, data),
  getClientContent: (clientId) => api.get(apiEndpoints.getClientContent(clientId)),
};

export default api;
