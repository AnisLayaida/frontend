import axios from 'axios';
import type { AxiosInstance, AxiosResponse } from 'axios';
import type { ApiResponse, LeaveRequest } from '../types';

const api: AxiosInstance = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: async (email: string, password: string): Promise<{ token: string }> => {
    const response = await api.post('/login', { email, password });
    return response.data;
  },
};

export const usersApi = {
  getLeaveBalance: async (id: number) => {
    const response = await api.get(`/users/${id}/leave-balance`);
    return response.data.data;
  },
};

export const leaveRequestsApi = {
  getPending: async (): Promise<LeaveRequest[]> => {
    const response: AxiosResponse<ApiResponse<LeaveRequest[]>> = await api.get('/leave-requests/pending');
    return response.data.data;
  },
  
  getMyRequests: async (userId: number): Promise<LeaveRequest[]> => {
    const response: AxiosResponse<ApiResponse<LeaveRequest[]>> = await api.get(`/leave-requests/status/${userId}`);
    return response.data.data;
  },
};