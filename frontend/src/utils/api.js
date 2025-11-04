import axios from 'axios'

/**
 * API URL configuration: use relative URL in production (via nginx proxy), 
 * otherwise use env variable or default to localhost for development
 * 
 * In production Docker environment, empty string ('') means requests go to 
 * the same origin (frontend server), which nginx then proxies to backend.
 * In development, it defaults to http://localhost:3000
 */
const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://localhost:3000')

/**
 * Axios instance with base URL and default headers
 * This instance is used throughout the app for all API calls
 * 
 * Benefits:
 * - Centralized configuration
 * - Automatic JSON parsing
 * - Better error handling (err.response.data)
 * - Can add interceptors if needed
 */
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

export default api

