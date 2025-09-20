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

export interface CreateLeaveRequestData {
  userId: number;
  leaveTypeId: number;
  startDate: string;
  endDate: string;
  reason?: string;
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

// Form interfaces
export interface CreateUserFormData {
  firstName: string;
  surname: string;
  email: string;
  password: string;
  roleId: number;
  departmentId?: number;
  officeLocation: string;
  officeName: string;
  annualLeaveBalance: number;
}

export interface UpdateUserFormData extends Partial<CreateUserFormData> {
  userId: number;
}