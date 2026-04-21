import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true
});

export const authApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true
});

let getState;
let refreshSession;
let onLogout;
let onTokensUpdate;

const failedQueue = [];
let isRefreshing = false;

const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  failedQueue.length = 0;
};

api.interceptors.request.use((config) => {
  const state = getState?.();
  const token = state?.auth?.accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry && refreshSession) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshed = await refreshSession();
        onTokensUpdate?.(refreshed);
        processQueue(null, refreshed.accessToken);
        originalRequest.headers.Authorization = `Bearer ${refreshed.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        onLogout?.();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export const configureApi = ({
  getState: getStateFn,
  refreshSession: refreshFn,
  onLogout: logoutFn,
  onTokensUpdate: tokensUpdateFn
}) => {
  getState = getStateFn;
  refreshSession = refreshFn;
  onLogout = logoutFn;
  onTokensUpdate = tokensUpdateFn;
};
