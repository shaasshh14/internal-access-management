import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Users, Shield, AppWindow, ClipboardList,
  CheckCircle, XCircle, AlertTriangle, Plus, Search,
  ArrowRight, Activity, TrendingUp, Clock, UserX, ShieldAlert
} from "lucide-react";
import LoadingState from "@/shared/components/LoadingState/LoadingState";
import StatusBadge from "@/shared/components/StatusBadge/StatusBadge";
import { dashboardService } from "@/shared/services/dashboardService";
import { requestService } from "@/shared/services/requestService";
import { auditService } from "@/shared/services/auditService";
import { accessService } from "@/shared/services/accessService";
import { userService } from "@/shared/services/userService";
import type { DashboardStats, AccessRequest, AuditLog, Access, User } from "@/types";

interface MetricCardProps {
  label: string;
  value: string | number;
  sub: string;
  icon: any;
  accent: string;
  bg: string;
  href?: string;
}

function MetricCard({ label, value, sub, icon: Icon, accent, bg }: MetricCardProps) {
  return (
    <div className="group relative bg-white rounded-xl border border-slate-100/60 p-5 hover:border-slate-200 hover:shadow-sm transition-all duration-200">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400 mb-2">{label}</p>
          <p className="text-3xl font-bold tracking-tight text-slate-900 leading-none">{value}</p>
          <div className="flex items-center gap-1.5 mt-2">
            <span className={`text-xs font-medium ${accent}`}>{sub}</span>
          </div>
        </div>
        <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200`}>
          <Icon className={`h-5 w-5 ${accent}`} />
        </div>
      </div>
    </div>
  );
}

function AuditIcon({ status }: { status: string }) {
  if (status === "SUCCESS") {
    return <CheckCircle className="h-4 w-4 text-success-500 shrink-0 mt-0.5" />;
  }
  return <XCircle className="h-4 w-4 text-danger-500 shrink-0 mt-0.5" />;
}

interface SecurityAlert {
  id: string;
  type: 'expiring' | 'inactive-user' | 'high-privilege' | 'failed-login' | 'suspended-access';
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  link: string;
  linkText: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [requests, setRequests] = useState<AccessRequest[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [securityAlerts, setSecurityAlerts] = useState<SecurityAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const [statsData, requestsData, auditData, allAccess, allUsers] = await Promise.all([
          dashboardService.getDashboardStats(),
          requestService.getRequests(),
          auditService.getAuditLogs(),
          accessService.getAllAccess(),
          userService.getUsers(),
        ]);
        setStats(statsData);
        setRequests(requestsData.slice(0, 6));
        setAuditLogs(auditData.slice(0, 6));

        // Calculate security alerts
        const alerts = calculateSecurityAlerts(allAccess, allUsers, requestsData, auditData);
        setSecurityAlerts(alerts);
      } catch (err) {
        console.error("Error loading dashboard data", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const calculateSecurityAlerts = (
    accessList: Access[],
    users: User[],
    requestsList: AccessRequest[],
    auditLogs: AuditLog[]
  ): SecurityAlert[] => {
    const alerts: SecurityAlert[] = [];
    const now = new Date();

    // 1. Access expiring soon (within 30 days)
    const expiringAccess = accessList.filter((a) => {
      if (!a.expiryDate || a.status !== 'ACTIVE') return false;
      const expiryDate = new Date(a.expiryDate);
      const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return daysUntilExpiry > 0 && daysUntilExpiry <= 30;
    });

    if (expiringAccess.length > 0) {
      alerts.push({
        id: 'expiring-access',
        type: 'expiring',
        title: `${expiringAccess.length} access grant${expiringAccess.length > 1 ? 's' : ''} expiring soon`,
        description: 'Access permissions expiring within 30 days require review',
        severity: 'medium',
        link: '/access',
        linkText: 'Review access'
      });
    }

    // 2. Inactive users with active access (no activity in 30+ days)
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const inactiveUsersWithAccess = users.filter((user) => {
      if (user.status !== 'ACTIVE') return false;
      const lastActive = new Date(user.lastActive);
      if (lastActive >= thirtyDaysAgo) return false;
      // Check if user has active access
      const hasActiveAccess = accessList.some(
        (a) => a.userId === user.id && a.status === 'ACTIVE'
      );
      return hasActiveAccess;
    });

    if (inactiveUsersWithAccess.length > 0) {
      alerts.push({
        id: 'inactive-users',
        type: 'inactive-user',
        title: `${inactiveUsersWithAccess.length} inactive user${inactiveUsersWithAccess.length > 1 ? 's' : ''} with active access`,
        description: 'Users inactive for 30+ days still have active permissions',
        severity: 'high',
        link: '/users',
        linkText: 'Review users'
      });
    }

    // 3. Pending high-privilege requests (Admin or Application Admin)
    const highPrivilegeRequests = requestsList.filter((req) =>
      req.status === 'PENDING' &&
      (req.accessLevel === 'Admin' || req.roleName.toLowerCase().includes('admin'))
    );

    if (highPrivilegeRequests.length > 0) {
      alerts.push({
        id: 'high-privilege-requests',
        type: 'high-privilege',
        title: `${highPrivilegeRequests.length} pending high-privilege request${highPrivilegeRequests.length > 1 ? 's' : ''}`,
        description: 'Admin-level access requests awaiting approval',
        severity: 'high',
        link: '/requests',
        linkText: 'Review requests'
      });
    }

    // 4. Recent failed login attempts
    const recentFailedLogins = auditLogs.filter((log) => {
      const logTime = new Date(log.timestamp);
      const hoursSinceLog = (now.getTime() - logTime.getTime()) / (1000 * 60 * 60);
      return log.action === 'USER_LOGIN' && log.status === 'FAILURE' && hoursSinceLog <= 24;
    });

    if (recentFailedLogins.length > 0) {
      alerts.push({
        id: 'failed-logins',
        type: 'failed-login',
        title: `${recentFailedLogins.length} failed login${recentFailedLogins.length > 1 ? 's' : ''} in last 24 hours`,
        description: 'Authentication failures detected',
        severity: 'medium',
        link: '/audit',
        linkText: 'View audit logs'
      });
    }

    // 5. Suspended users with unrevoked access
    const suspendedUsers = users.filter((u) => u.status === 'SUSPENDED');
    const suspendedWithAccess = suspendedUsers.filter((user) => {
      return accessList.some((a) => a.userId === user.id && a.status === 'ACTIVE');
    });

    if (suspendedWithAccess.length > 0) {
      alerts.push({
        id: 'suspended-users-access',
        type: 'suspended-access',
        title: `${suspendedWithAccess.length} suspended user${suspendedWithAccess.length > 1 ? 's' : ''} with active access`,
        description: 'Suspended accounts still have active permissions',
        severity: 'high',
        link: '/users',
        linkText: 'Review suspended users'
      });
    }

    // Sort by severity (high -> medium -> low)
    return alerts.sort((a, b) => {
      const severityOrder = { high: 0, medium: 1, low: 2 };
      return severityOrder[a.severity] - severityOrder[b.severity];
    });
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleString("en-US", {
      month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
    });

  if (isLoading || !stats) {
    return <LoadingState message="Loading dashboard..." />;
  }

  const activeRate = Math.round((stats.activeUsers / stats.totalUsers) * 100);

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">
            Monitor identity, access, and security activity across your organization.
          </p>
        </div>
        <div className="flex items-center gap-2.5 flex-wrap">
          <button className="inline-flex items-center gap-1.5 rounded-md px-3.5 py-2 text-sm font-medium text-slate-700 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all">
            <Plus size={14} /> Add User
          </button>
          <button className="inline-flex items-center gap-1.5 rounded-md px-3.5 py-2 text-sm font-medium text-blue-600 border border-blue-200 hover:bg-blue-50 transition-all">
            <Shield size={14} /> Request Access
          </button>
        </div>
      </div>

      {/* ── Metric Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <MetricCard
          label="Total Users"
          value={stats.totalUsers}
          sub={`${activeRate}% active · ${stats.activeUsers} active`}
          icon={Users}
          accent="text-blue-600"
          bg="bg-blue-50"
        />
        <MetricCard
          label="Applications"
          value={stats.applications}
          sub="Connected platforms"
          icon={AppWindow}
          accent="text-slate-600"
          bg="bg-slate-100"
        />
        <MetricCard
          label="Pending Requests"
          value={stats.pendingRequests}
          sub="Awaiting review"
          icon={AlertTriangle}
          accent="text-warning-600"
          bg="bg-warning-50"
        />
        <MetricCard
          label="Expiring Access"
          value={stats.expiringSoon}
          sub="Within 30 days"
          icon={Shield}
          accent="text-danger-600"
          bg="bg-danger-50"
        />
      </div>

      {/* ── Security Overview ── */}
      {securityAlerts.length > 0 && (
        <div className="bg-gradient-to-r from-danger-50 to-danger-50/50 rounded-xl border border-danger-100 p-5">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-danger-100 flex items-center justify-center shrink-0">
              <ShieldAlert className="h-5 w-5 text-danger-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-sm font-semibold text-slate-900">Security Overview</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {securityAlerts.length} item{securityAlerts.length > 1 ? 's' : ''} require{securityAlerts.length === 1 ? 's' : ''} attention
              </p>
            </div>
          </div>

          <div className="space-y-2">
            {securityAlerts.map((alert) => {
              const severityColors = {
                high: { bg: 'bg-danger-50', border: 'border-danger-200', text: 'text-danger-700', badge: 'bg-danger-100 text-danger-700' },
                medium: { bg: 'bg-warning-50', border: 'border-warning-200', text: 'text-warning-700', badge: 'bg-warning-100 text-warning-700' },
                low: { bg: 'bg-info-50', border: 'border-info-200', text: 'text-info-700', badge: 'bg-info-100 text-info-700' }
              };
              const colors = severityColors[alert.severity];

              let AlertIcon = AlertTriangle;
              if (alert.type === 'expiring') AlertIcon = Clock;
              else if (alert.type === 'inactive-user') AlertIcon = UserX;
              else if (alert.type === 'high-privilege') AlertIcon = ShieldAlert;
              else if (alert.type === 'suspended-access') AlertIcon = UserX;

              return (
                <Link
                  key={alert.id}
                  to={alert.link}
                  className={`block rounded-lg border ${colors.border} ${colors.bg} p-3 hover:shadow-sm transition-all group`}
                >
                  <div className="flex items-start gap-3">
                    <AlertIcon className={`h-4 w-4 mt-0.5 shrink-0 ${colors.text}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className={`text-sm font-semibold ${colors.text}`}>{alert.title}</p>
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${colors.badge}`}>
                          {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">{alert.description}</p>
                    </div>
                    <ArrowRight className={`h-4 w-4 ${colors.text} shrink-0 group-hover:translate-x-1 transition-transform`} />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Main Content Grid ── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

        {/* ── Access Requests ── */}
        <div className="xl:col-span-2 bg-white rounded-xl border border-slate-100/60 overflow-hidden">
          <div className="px-5 pt-5 pb-3 flex items-center justify-between border-b border-slate-100/50">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Access Requests</h2>
              <p className="text-xs text-slate-500 mt-0.5">Recent access requests across your organization</p>
            </div>
            <Link
              to="/requests"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors"
            >
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="divide-y divide-slate-100/50">
            {requests.map((req) => (
              <div key={req.id} className="flex items-center gap-4 px-5 py-3 hover:bg-slate-50/60 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-slate-900 truncate">{req.requesterName}</p>
                    <span className="text-[10px] text-slate-400 font-mono shrink-0">#{req.id.slice(0, 6)}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-slate-500">{req.applicationName}</span>
                    <span className="text-slate-300">·</span>
                    <span className="text-xs text-slate-500">{req.roleName}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-slate-400 hidden sm:block">{formatDate(req.requestedAt)}</span>
                  <StatusBadge status={req.status} variant={
                    req.status === "APPROVED" ? "success" :
                    req.status === "REJECTED" ? "danger" :
                    req.status === "PENDING" ? "warning" : "neutral"
                  } />
                </div>
              </div>
            ))}
            {requests.length === 0 && (
              <div className="px-5 py-8 text-center text-sm text-slate-400">No recent access requests</div>
            )}
          </div>
        </div>

        {/* ── Right Column ── */}
        <div className="space-y-4">
          {/* Request Status Summary */}
          <div className="bg-white rounded-xl border border-slate-100/60 p-5">
            <h2 className="text-sm font-semibold text-slate-900 mb-1">Request Overview</h2>
            <p className="text-xs text-slate-500 mb-4">Current request status distribution</p>
            <div className="space-y-2.5">
              {[
                { label: "Pending", count: stats.pendingRequests, color: "bg-warning-500", textColor: "text-warning-600", bg: "bg-warning-50" },
                { label: "Approved", count: Math.max(0, stats.pendingRequests - 2), color: "bg-success-500", textColor: "text-success-600", bg: "bg-success-50" },
                { label: "Rejected", count: 0, color: "bg-danger-500", textColor: "text-danger-600", bg: "bg-danger-50" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg ${item.bg} flex items-center justify-center shrink-0`}>
                    <div className={`w-2 h-2 rounded-full ${item.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-slate-600">{item.label}</span>
                      <span className={`text-sm font-bold ${item.textColor}`}>{item.count}</span>
                    </div>
                    <div className="mt-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${item.color}`}
                        style={{ width: `${Math.min(100, (item.count / stats.pendingRequests) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Audit Activity */}
          <div className="bg-white rounded-xl border border-slate-100/60 overflow-hidden">
            <div className="px-5 pt-5 pb-3 flex items-center justify-between border-b border-slate-100/50">
              <div>
                <h2 className="text-sm font-semibold text-slate-900">Audit Activity</h2>
                <p className="text-xs text-slate-500 mt-0.5">Recent security events</p>
              </div>
              <Link
                to="/audit"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors"
              >
                View all <ArrowRight size={12} />
              </Link>
            </div>
            <div className="divide-y divide-slate-100/50">
              {auditLogs.map((log) => (
                <div key={log.id} className="flex items-start gap-3 px-5 py-3 hover:bg-slate-50/60 transition-colors">
                  <AuditIcon status={log.status} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-800 truncate">{log.action.replace(/_/g, " ")}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{log.details}</p>
                    <p className="text-[10px] text-slate-400 mt-1">{formatDate(log.timestamp)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Row: Quick Access ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Users", sub: `${stats.totalUsers} total`, icon: Users, href: "/users" },
          { label: "Applications", sub: `${stats.applications} connected`, icon: AppWindow, href: "/applications" },
          { label: "Requests", sub: `${stats.pendingRequests} pending`, icon: ClipboardList, href: "/requests" },
          { label: "Audit Logs", sub: "Security events", icon: Activity, href: "/audit" },
        ].map((item) => (
          <Link
            key={item.label}
            to={item.href}
            className="group bg-white rounded-xl border border-slate-100/60 p-4 hover:border-slate-200 hover:shadow-sm transition-all duration-200 flex items-center gap-3"
          >
            <div className="w-9 h-9 rounded-lg bg-slate-50 group-hover:bg-blue-50 flex items-center justify-center transition-colors">
              <item.icon size={17} className="text-slate-500 group-hover:text-blue-600 transition-colors" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-900">{item.label}</p>
              <p className="text-[11px] text-slate-400">{item.sub}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
