// Core domain types for IAM application

export type UserStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";
export type RequestStatus = "PENDING" | "APPROVED" | "REJECTED";
export type ApplicationStatus = "ACTIVE" | "MAINTENANCE" | "INACTIVE";
export type AccessStatus = "ACTIVE" | "EXPIRED" | "REVOKED";
export type AuditAction =
  | "USER_LOGIN"
  | "USER_CREATED"
  | "USER_UPDATED"
  | "USER_SUSPENDED"
  | "ROLE_ASSIGNED"
  | "ROLE_REMOVED"
  | "ACCESS_REQUESTED"
  | "ACCESS_APPROVED"
  | "ACCESS_REJECTED"
  | "ACCESS_REVOKED"
  | "APPLICATION_CREATED"
  | "APPLICATION_UPDATED"
  | "PERMISSION_GRANTED"
  | "PERMISSION_REVOKED";

export interface User {
  id: string;
  name: string;
  email: string;
  employeeId: string;
  department: string;
  role: string;
  status: UserStatus;
  avatar?: string;
  lastActive: string;
  createdAt: string;
  applicationCount: number;
}

export interface Application {
  id: string;
  name: string;
  description: string;
  icon?: string;
  owner: string;
  environment: "Production" | "Staging" | "Development";
  status: ApplicationStatus;
  userCount: number;
  roleCount: number;
  authenticationType: string;
  createdAt: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  userCount: number;
  permissionCount: number;
  applicationCount: number;
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
}

export interface Permission {
  id: string;
  resource: string;
  action: string;
  description: string;
}

export interface Access {
  id: string;
  userId: string;
  userName: string;
  applicationId: string;
  applicationName: string;
  roleName: string;
  accessLevel: string;
  grantedBy: string;
  grantedDate: string;
  expiryDate?: string;
  status: AccessStatus;
}

export interface AccessRequest {
  id: string;
  requesterId: string;
  requesterName: string;
  requesterEmail: string;
  applicationId: string;
  applicationName: string;
  roleName: string;
  accessLevel: string;
  reason: string;
  requestedAt: string;
  status: RequestStatus;
  reviewerId?: string;
  reviewerName?: string;
  reviewedAt?: string;
  rejectionReason?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  actorEmail: string;
  action: AuditAction;
  resource: string;
  resourceId: string;
  ipAddress: string;
  userAgent?: string;
  status: "SUCCESS" | "FAILURE";
  previousValue?: string;
  newValue?: string;
  details?: string;
}

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  applications: number;
  pendingRequests: number;
  activeAccess: number;
  pendingAccess: number;
  expiringSoon: number;
  revokedAccess: number;
}

export interface ApprovalTimeline {
  stage: string;
  status: "COMPLETED" | "PENDING" | "SKIPPED";
  actor?: string;
  timestamp?: string;
}
