import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Users, Shield, AppWindow, ClipboardList, CheckCircle, XCircle, FileText, Eye, Check, X, AlertTriangle } from "lucide-react";
import Card from "@/shared/components/Card/Card";
import StatusBadge from "@/shared/components/StatusBadge/StatusBadge";
import LoadingState from "@/shared/components/LoadingState/LoadingState";
import { dashboardService } from "@/shared/services/dashboardService";
import { requestService } from "@/shared/services/requestService";
import { auditService } from "@/shared/services/auditService";
import type { DashboardStats, AccessRequest, AuditLog } from "@/types";

export default function DashboardPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [requests, setRequests] = useState<AccessRequest[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const [statsData, requestsData, auditData] = await Promise.all([
          dashboardService.getDashboardStats(),
          requestService.getRequests(),
          auditService.getAuditLogs(),
        ]);
        setStats(statsData);
        setRequests(requestsData.slice(0, 5));
        setAuditLogs(auditData.slice(0, 5));
      } catch (err) {
        console.error("Error loading dashboard data", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading || !stats) {
    return <LoadingState message="Loading dashboard..." />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Good morning, Admin</h1>
        <p className="text-slate-500 mt-1">Here's what's happening across your access environment.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-500">Total Users</p>
              <h3 className="text-3xl font-bold mt-2 text-slate-900">{stats.totalUsers}</h3>
              <p className="text-xs text-green-600 font-medium mt-1">
                Active: {stats.activeUsers} ({Math.round((stats.activeUsers / stats.totalUsers) * 100)}%)
              </p>
            </div>
            <div className="bg-slate-100 p-2.5 rounded-lg text-slate-600">
              <Users size={20} />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-500">Applications</p>
              <h3 className="text-3xl font-bold mt-2 text-slate-900">{stats.applications}</h3>
              <p className="text-xs text-slate-500 font-medium mt-1">Connected platforms</p>
            </div>
            <div className="bg-slate-100 p-2.5 rounded-lg text-slate-600">
              <AppWindow size={20} />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-500">Pending Requests</p>
              <h3 className="text-3xl font-bold mt-2 text-slate-900">{stats.pendingRequests}</h3>
              <p className="text-xs text-amber-600 font-medium mt-1 flex items-center gap-1">
                <AlertTriangle size={12} /> Needs review
              </p>
            </div>
            <div className="bg-amber-50 p-2.5 rounded-lg text-amber-600">
              <ClipboardList size={20} />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-500">Expiring Access</p>
              <h3 className="text-3xl font-bold mt-2 text-slate-900">{stats.expiringSoon}</h3>
              <p className="text-xs text-red-600 font-medium mt-1">Within 30 days</p>
            </div>
            <div className="bg-red-50 p-2.5 rounded-lg text-red-600">
              <Shield size={20} />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">Recent Access Requests</h3>
            <Link to="/requests" className="text-sm font-semibold text-blue-600 hover:underline">View All</Link>
          </div>
          {requests.length === 0 ? (
            <div className="py-6 text-center text-slate-500 text-sm">No recent requests.</div>
          ) : (
            <div className="space-y-3">
              {requests.map((req) => (
                <div key={req.id} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:bg-slate-50">
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900 text-sm">{req.requesterName}</p>
                    <p className="text-xs text-slate-500">{req.applicationName} • {req.roleName}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{formatDate(req.requestedAt)}</p>
                  </div>
                  <StatusBadge status={req.status} />
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">Recent Audit Logs</h3>
            <Link to="/audit" className="text-sm font-semibold text-blue-600 hover:underline">View All</Link>
          </div>
          <div className="space-y-3">
            {auditLogs.map((log) => (
              <div key={log.id} className="flex items-start gap-3 pb-3 border-b last:border-0 border-slate-100">
                <div className="mt-0.5">
                  {log.status === "SUCCESS" ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-900 font-medium">{log.action.replace(/_/g, " ")}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{log.details}</p>
                  <p className="text-xs text-slate-400 mt-1">{formatDate(log.timestamp)}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
