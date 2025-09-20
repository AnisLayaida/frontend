import axios from 'axios';
import type { AxiosInstance, AxiosResponse } from 'axios';
import type { ApiResponse, LeaveRequest, User, CreateLeaveRequestData } from '../types';

const api: AxiosInstance = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
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
  getAll: async (): Promise<User[]> => {
    const response: AxiosResponse<ApiResponse<User[]>> = await api.get('/users');
    return response.data.data;
  },

  getLeaveBalance: async (id: number) => {
    const response: AxiosResponse<ApiResponse<any>> = await api.get(`/users/${id}/leave-balance`);
    return response.data.data;
  },

  create: async (userData: Partial<User>): Promise<User> => {
    const response: AxiosResponse<ApiResponse<User>> = await api.post('/users', userData);
    return response.data.data;
  },

  update: async (id: number, userData: Partial<User>): Promise<User> => {
    const response: AxiosResponse<ApiResponse<User>> = await api.patch(`/users/${id}`, userData);
    return response.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/users/${id}`);
  },
};

export const leaveRequestsApi = {
  getAll: async (): Promise<LeaveRequest[]> => {
    const response: AxiosResponse<ApiResponse<LeaveRequest[]>> = await api.get('/leave-requests');
    return response.data.data;
  },

  getPending: async (): Promise<LeaveRequest[]> => {
    const response: AxiosResponse<ApiResponse<LeaveRequest[]>> = await api.get('/leave-requests/pending');
    return response.data.data;
  },
  
  getMyRequests: async (userId: number): Promise<LeaveRequest[]> => {
    const response: AxiosResponse<ApiResponse<LeaveRequest[]>> = await api.get(`/leave-requests/status/${userId}`);
    return response.data.data;
  },

  create: async (requestData: CreateLeaveRequestData): Promise<LeaveRequest> => {
    const response: AxiosResponse<ApiResponse<LeaveRequest>> = await api.post('/leave-requests', requestData);
    return response.data.data;
  },

  approve: async (requestId: number): Promise<void> => {
    await api.patch(`/leave-requests/${requestId}/approve`);
  },

  reject: async (requestId: number): Promise<void> => {
    await api.patch(`/leave-requests/${requestId}/reject`);
  },

  cancel: async (requestId: number): Promise<void> => {
    await api.delete('/leave-requests', { data: { leaveRequestId: requestId } });
  },
};

export const leaveTypesApi = {
  getAll: async () => {
    const response: AxiosResponse<ApiResponse<any[]>> = await api.get('/leave-types');
    return response.data.data;
  },

  create: async (leaveTypeData: any) => {
    const response: AxiosResponse<ApiResponse<any>> = await api.post('/leave-types', leaveTypeData);
    return response.data.data;
  },
};

export const departmentsApi = {
  getAll: async () => {
    const response: AxiosResponse<ApiResponse<any[]>> = await api.get('/departments');
    return response.data.data;
  },

  getUsersInDepartment: async () => {
    const response: AxiosResponse<ApiResponse<User[]>> = await api.get('/departments/users');
    return response.data.data;
  },

  create: async (departmentData: { name: string }) => {
    const response: AxiosResponse<ApiResponse<any>> = await api.post('/departments', departmentData);
    return response.data.data;
  },
};