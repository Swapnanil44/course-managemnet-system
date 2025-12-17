import axios from 'axios';

const API_URL =import.meta.env.VITE_BACKEND_URL;

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

// Request Interceptor: Attach Token
api.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle Token Refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh the token
        const { data } = await axios.get(`${API_URL}/auth/refresh`, {
          withCredentials: true, // Send the cookie
        });

        // Update the token in memory
        setAccessToken(data.access_token);

        // Update the header for the retry
        originalRequest.headers.Authorization = `Bearer ${data.access_token}`;

        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails (token expired completely), logout
        setAccessToken(null);
        window.location.href = '/login'; 
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

