import { mockUsers } from "@/mock/users";
import { mockApplications } from "@/mock/applications";
import { mockRoles } from "@/mock/roles";
import { mockAccessRequests } from "@/mock/requests";
import { mockAuditLogs } from "@/mock/auditLogs";
import { mockAccess } from "@/mock/access";
import type { User, Application, Role, AccessRequest, AuditLog, Access } from "@/types";

// In-memory data store for the session to support fully interactive CRUD operations
class MockDataStore {
  public users: User[] = [...mockUsers];
  public applications: Application[] = [...mockApplications];
  public roles: Role[] = [...mockRoles];
  public requests: AccessRequest[] = [...mockAccessRequests];
  public auditLogs: AuditLog[] = [...mockAuditLogs];
  public access: Access[] = [...mockAccess];

  constructor() {
    // Relational integrity checks or setup if needed
  }
}

export const db = new MockDataStore();
export const sleep = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));
export const getActiveUser = () => {
  return {
    id: "11",
    name: "Patricia Lee",
    email: "patricia.lee@company.com",
    employeeId: "EMP011",
    department: "Security",
    role: "IAM Administrator",
    avatar: undefined,
  };
};
