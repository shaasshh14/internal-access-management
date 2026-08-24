import type { AuditLog } from "@/types";
import { db, sleep } from "./mockDataStore";

export const auditService = {
  async getAuditLogs(): Promise<AuditLog[]> {
    await sleep();
    return db.auditLogs.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  },

  async getAuditLogById(id: string): Promise<AuditLog | undefined> {
    await sleep();
    return db.auditLogs.find((log) => log.id === id);
  },

  async searchAuditLogs(query: string): Promise<AuditLog[]> {
    await sleep();
    const lowerQuery = query.toLowerCase();
    return db.auditLogs
      .filter(
        (log) =>
          log.actor.toLowerCase().includes(lowerQuery) ||
          log.action.toLowerCase().includes(lowerQuery) ||
          log.resource.toLowerCase().includes(lowerQuery)
      )
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  },
};
