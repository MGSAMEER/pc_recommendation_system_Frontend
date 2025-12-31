// API Configuration (PRODUCTION READY)
// API base URL must be set via REACT_APP_API_BASE_URL environment variable
// src/services/api.js
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://pc-recommendation-system-backend-e3u4.onrender.com/api/v1";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Request interceptor for adding auth headers if needed
api.interceptors.request.use(
  (config) => {
    // Add auth headers here if needed
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Handle common errors
    if (error.response) {
      // Server responded with error status
      const { status, data, headers } = error.response
      console.error('Full Axios error response:', { status, data, headers })

      const message = (() => {
        if (!data) return 'Network error'
        if (typeof data.detail === 'string') return data.detail
        if (Array.isArray(data.detail)) return data.detail.map((x) => x?.msg || x?.message || String(x)).join('; ')
        // Prefer our standardized error envelope
        const envelopeMsg = data.error?.message || data.message
        const envelopeDetails = data.error?.details
        if (status === 422 && Array.isArray(envelopeDetails)) {
          return envelopeDetails
            .map((d) => d?.msg || d?.message || d?.detail || (typeof d === 'string' ? d : JSON.stringify(d)))
            .join('; ')
        }
        return envelopeMsg || 'Unknown error'
      })()

      if (status === 404) {
        console.error('Endpoint not found - verify in Swagger')
      } else if (status === 401) {
        console.error('Unauthorized access - verify token is present and valid')
      } else if (status === 500) {
        console.error('Server error:', message || 'Internal server error')
      } else {
        console.error(`API Error (${status}):`, message)
      }
    } else if (error.request) {
      // Network error
      console.error('Network error - please check your connection')
    } else {
      // Other error
      console.error('Request error:', error.message)
    }

    return Promise.reject(error)
  }
)

// API Methods
export const apiService = {
  // Health check
  health: () => api.get('/health'),

  // Auth
  // ✅ CORRECT ROUTES
 signup: (data) => api.post("/auth/signup", data),
 login: (data) => api.post("/auth/login", data),
 logout: () => api.post("/auth/logout"),
 refresh: (refresh_token) =>
   api.post("/auth/refresh", { refresh_token }),
 getMe: () => api.get("/auth/me"),

  // Recommendations
 createRecommendations: (data) =>
   api.post("/recommendations", data),

 getRecommendation: (id) =>
   api.get(`/recommendations/${id}`),

 // Components
 listComponents: (params) =>
   api.get("/components", { params }),

 getComponent: (id) =>
   api.get(`/components/${id}`),

 // Feedback
 submitFeedback: (data) =>
   api.post("/feedback", data),

 // User
 updateUserProfile: (data) =>
   api.put("/users/profile", data),

 getUserPreferences: () =>
   api.get("/users/preferences"),

 updateUserPreferences: (data) =>
   api.put("/users/preferences", data),

 getUserRecommendations: (params) =>
   api.get("/users/recommendations", { params }),

 changePassword: (data) =>
   api.put("/auth/password", data),

}

export default api
