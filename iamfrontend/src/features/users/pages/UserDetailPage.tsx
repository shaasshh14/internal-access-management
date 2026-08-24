import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Briefcase, Building2, Calendar, Shield, Edit, MoreVertical } from "lucide-react";
import PageHeader from "@/shared/components/PageHeader/PageHeader";
import Card from "@/shared/components/Card/Card";
import StatusBadge from "@/shared/components/StatusBadge/StatusBadge";
import Avatar from "@/shared/components/Avatar/Avatar";
import LoadingState from "@/shared/components/LoadingState/LoadingState";
import Button from "@/shared/components/Button/Button";
import { userService } from "@/shared/services/userService";
import { accessService } from "@/shared/services/accessService";
import { auditService } from "@/shared/services/auditService";
import type { User, Access, AuditLog } from "@/types";

export default function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [userAccess, setUserAccess] = useState<Access[]>([]);
  const [userAudit, setUserAudit] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "access" | "activity">("overview");

  useEffect(() => {
    async function loadUserData() {
      if (!id) return;
      setIsLoading(true);
      try {
        const [userData, accessData, auditData] = await Promise.all([
          userService.getUserById(id),
          accessService.getAccessByUserId(id),
          auditService.getAuditLogs(),
        ]);

        if (userData) {
          setUser(userData);
          setUserAccess(accessData);
          // Filter audit logs for this user
          setUserAudit(auditData.filter(log => log.actorEmail === userData.email).slice(0, 10));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    loadUserData();
  }, [id]);

  if (isLoading) {
    return <LoadingState message="Loading user details..." />;
  }

  if (!user) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <p className="text-slate-500">User not found</p>
          <Button onClick={() => navigate("/users")} className="mt-4">
            Back to Users
          </Button>
        </div>
      </div>
    );
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Back button */}
      <button
        onClick={() => navigate("/users")}
        className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition"
      >
        <ArrowLeft size={16} />
        <span className="text-sm font-medium">Back to Users</span>
      </button>

      {/* User Header Card */}
      <Card>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Avatar name={user.name} size="xl" />
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{user.name}</h1>
              <div className="flex items-center gap-4 mt-2 text-sm text-slate-600">
                <div className="flex items-center gap-1.5">
                  <Mail size={14} />
                  {user.email}
                </div>
                <div className="flex items-center gap-1.5">
                  <Briefcase size={14} />
                  {user.role}
                </div>
                <div className="flex items-center gap-1.5">
                  <Building2 size={14} />
                  {user.department}
                </div>
              </div>
              <div className="flex items-center gap-3 mt-3">
                <StatusBadge status={user.status} />
                <span className="text-xs text-slate-500">
                  Employee ID: {user.employeeId}
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" className="flex items-center gap-2">
              <Edit size={14} />
              Edit
            </Button>
            <Button variant="secondary">
              <MoreVertical size={14} />
            </Button>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab("overview")}
            className={`pb-3 px-1 text-sm font-semibold transition border-b-2 ${
              activeTab === "overview"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("access")}
            className={`pb-3 px-1 text-sm font-semibold transition border-b-2 ${
              activeTab === "access"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            Access ({userAccess.length})
          </button>
          <button
            onClick={() => setActiveTab("activity")}
            className={`pb-3 px-1 text-sm font-semibold transition border-b-2 ${
              activeTab === "activity"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            Activity
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Personal Information</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Full Name</span>
                <span className="font-semibold text-slate-900">{user.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Email</span>
                <span className="font-semibold text-slate-900">{user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Employee ID</span>
                <span className="font-semibold text-slate-900">{user.employeeId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status</span>
                <StatusBadge status={user.status} />
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Organization</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Department</span>
                <span className="font-semibold text-slate-900">{user.department}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Role</span>
                <span className="font-semibold text-slate-900">{user.role}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Applications</span>
                <span className="font-semibold text-slate-900">{user.applicationCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Created</span>
                <span className="font-semibold text-slate-900">{formatDate(user.createdAt)}</span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {activeTab === "access" && (
        <Card>
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Application Access</h3>
          {userAccess.length === 0 ? (
            <div className="py-8 text-center text-slate-500">No access granted yet</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50">
                  <tr className="text-left text-xs font-semibold text-slate-600 uppercase">
                    <th className="px-4 py-3">Application</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3">Access Level</th>
                    <th className="px-4 py-3">Granted By</th>
                    <th className="px-4 py-3">Granted Date</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {userAccess.map((access) => (
                    <tr key={access.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-semibold text-slate-900">{access.applicationName}</td>
                      <td className="px-4 py-3 text-slate-600">{access.roleName}</td>
                      <td className="px-4 py-3 text-slate-600">{access.accessLevel}</td>
                      <td className="px-4 py-3 text-slate-600">{access.grantedBy}</td>
                      <td className="px-4 py-3 text-slate-600">{formatDate(access.grantedDate)}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={access.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}

      {activeTab === "activity" && (
        <Card>
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Activity</h3>
          {userAudit.length === 0 ? (
            <div className="py-8 text-center text-slate-500">No recent activity</div>
          ) : (
            <div className="space-y-4">
              {userAudit.map((log) => (
                <div key={log.id} className="flex gap-3 pb-4 border-b last:border-0 border-slate-100">
                  <div className="mt-1">
                    <Shield className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-900">{log.action.replace(/_/g, " ")}</span>
                      <span className="text-xs text-slate-400">
                        {new Date(log.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 mt-1">{log.details}</p>
                    <p className="text-xs text-slate-400 mt-1">IP: {log.ipAddress}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
