import type { AccessRequest, RequestStatus, AuditAction } from "@/types";
import { db, sleep, getActiveUser } from "./mockDataStore";

export const requestService = {
  async getRequests(): Promise<AccessRequest[]> {
    await sleep();
    return db.requests.sort(
      (a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime()
    );
  },

  async getRequestById(id: string): Promise<AccessRequest | undefined> {
    await sleep();
    return db.requests.find((req) => req.id === id);
  },

  async getRequestsByStatus(status: RequestStatus): Promise<AccessRequest[]> {
    await sleep();
    return db.requests
      .filter((req) => req.status === status)
      .sort((a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime());
  },

  async approveRequest(id: string): Promise<AccessRequest | undefined> {
    await sleep();
    const request = db.requests.find((req) => req.id === id);
    if (request && request.status === "PENDING") {
      const currentUser = getActiveUser();
      request.status = "APPROVED";
      request.reviewerId = currentUser.id;
      request.reviewerName = currentUser.name;
      request.reviewedAt = new Date().toISOString();

      // Add audit log
      db.auditLogs.unshift({
        id: `audit_${Date.now()}`,
        timestamp: new Date().toISOString(),
        actor: currentUser.name,
        actorEmail: currentUser.email,
        action: "ACCESS_APPROVED" as AuditAction,
        resource: "Access Request",
        resourceId: id,
        ipAddress: "192.168.1.45",
        status: "SUCCESS",
        details: `Approved access request for ${request.requesterName} to ${request.applicationName} (${request.roleName} role)`,
      });

      // Grant access
      db.access.push({
        id: `access_${Date.now()}`,
        userId: request.requesterId,
        userName: request.requesterName,
        applicationId: request.applicationId,
        applicationName: request.applicationName,
        roleName: request.roleName,
        accessLevel: request.accessLevel,
        grantedBy: currentUser.name,
        grantedDate: new Date().toISOString(),
        status: "ACTIVE",
      });
    }
    return request;
  },

  async rejectRequest(id: string, reason: string): Promise<AccessRequest | undefined> {
    await sleep();
    const request = db.requests.find((req) => req.id === id);
    if (request && request.status === "PENDING") {
      const currentUser = getActiveUser();
      request.status = "REJECTED";
      request.reviewerId = currentUser.id;
      request.reviewerName = currentUser.name;
      request.reviewedAt = new Date().toISOString();
      request.rejectionReason = reason;

      // Add audit log
      db.auditLogs.unshift({
        id: `audit_${Date.now()}`,
        timestamp: new Date().toISOString(),
        actor: currentUser.name,
        actorEmail: currentUser.email,
        action: "ACCESS_REJECTED" as AuditAction,
        resource: "Access Request",
        resourceId: id,
        ipAddress: "192.168.1.45",
        status: "SUCCESS",
        details: `Rejected access request for ${request.requesterName} to ${request.applicationName} - ${reason}`,
      });
    }
    return request;
  },
};
