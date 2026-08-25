import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Users, Shield, AppWindow, ClipboardList,
  CheckCircle, XCircle, AlertTriangle, Plus, Search,
  ArrowRight, Activity, TrendingUp
} from "lucide-react";
import LoadingState from "@/shared/components/LoadingState/LoadingState";
import StatusBadge from "@/shared/components/StatusBadge/StatusBadge";
import { dashboardService } from "@/shared/services/dashboardService";
import { requestService } from "@/shared/services/requestService";
import { auditService } from "@/shared/services/auditService";
import type { DashboardStats, AccessRequest, AuditLog } from "@/types";

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

export default function DashboardPage() {
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
        setRequests(requestsData.slice(0, 6));
        setAuditLogs(auditData.slice(0, 6));
      } catch (err) {
        console.error("Error loading dashboard data", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

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
