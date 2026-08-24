import type { DashboardStats } from "@/types";
import { db, sleep } from "./mockDataStore";

export const dashboardService = {
  async getDashboardStats(): Promise<DashboardStats> {
    await sleep();

    const totalUsers = db.users.length;
    const activeUsers = db.users.filter((u) => u.status === "ACTIVE").length;
    const applications = db.applications.length;
    const pendingRequests = db.requests.filter((r) => r.status === "PENDING").length;
    const activeAccess = db.access.filter((a) => a.status === "ACTIVE").length;
    const pendingAccess = db.requests.filter((r) => r.status === "PENDING").length;
    const revokedAccess = db.access.filter((a) => a.status === "REVOKED").length;

    // Calculate expiring soon (within 30 days)
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const expiringSoon = db.access.filter((a) => {
      if (!a.expiryDate) return false;
      const expiryDate = new Date(a.expiryDate);
      return expiryDate > now && expiryDate <= thirtyDaysFromNow;
    }).length;

    return {
      totalUsers,
      activeUsers,
      applications,
      pendingRequests,
      activeAccess,
      pendingAccess,
      expiringSoon,
      revokedAccess,
    };
  },
};
