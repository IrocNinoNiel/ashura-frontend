/**
 * TypeScript Type Definitions
 */

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  isActive: boolean;
  isArchived: boolean;
  isBlocked: boolean;
  is2FAEnabled: boolean;
  theme: 'light' | 'dark';
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
  roles?: UserRole[];
}

export interface UserRole {
  role: Role;
}

export interface Role {
  id: string;
  name: string;
  displayName: string;
  description?: string;
  isSystem: boolean;
  permissions?: RolePermission[];
}

export interface RolePermission {
  permission: Permission;
}

export interface Permission {
  id: string;
  resource: string;
  action: string;
  displayName: string;
  description?: string;
}

export interface Session {
  id: string;
  userId: string;
  deviceName?: string;
  deviceType?: string;
  browser?: string;
  os?: string;
  ipAddress?: string;
  userAgent?: string;
  lastActivityAt: string;
  expiresAt: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  userId?: string;
  action: string;
  resource: string;
  resourceId?: string;
  details?: any;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
  user?: User;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  meta: {
    timestamp: string;
    pagination?: {
      page: number;
      limit: number;
      total: number;
    };
  };
}

export interface ApiError {
  success: false;
  message: string;
  code: string;
  details?: any;
  meta: {
    timestamp: string;
  };
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  requires2FA?: boolean;
  userId?: string;
}
