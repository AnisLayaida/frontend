export interface User {
  userId: number;
  firstName: string;
  surname: string;
  email: string;
  officeLocation: string;
  officeName: string;
  annualLeaveBalance: number;
  role: Role;
  department?: Department;
}

export interface Role {
  roleId: number;
  name: string;
}

export interface Department {
  departmentId: number;
  name: string;
}

export interface LeaveType {
  leaveTypeId: number;
  leaveType: string;
  description?: string;
  initialBalance: number;
  maxRollOverDays: number;
}

export interface LeaveRequest {
  leaveRequestId: number;
  startDate: string;
  endDate: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Cancelled';
  reason?: string;
  user: User;
  leaveType: LeaveType;
}

export interface ApiResponse<T> {
  data: T;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface AuthUser {
  email: string;
  roleId: number;
  userId: number;
}

export interface AuthContext {
  user: AuthUser | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}