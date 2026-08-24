import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, AppWindow, Users, Shield, Calendar, Settings, MoreVertical } from "lucide-react";
import PageHeader from "@/shared/components/PageHeader/PageHeader";
import Card from "@/shared/components/Card/Card";
import StatusBadge from "@/shared/components/StatusBadge/StatusBadge";
import LoadingState from "@/shared/components/LoadingState/LoadingState";
import Button from "@/shared/components/Button/Button";
import { applicationService } from "@/shared/services/applicationService";
import { accessService } from "@/shared/services/accessService";
import type { Application, Access } from "@/types";

export default function ApplicationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [application, setApplication] = useState<Application | null>(null);
  const [appAccess, setAppAccess] = useState<Access[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "roles">("overview");

  useEffect(() => {
    async function loadAppData() {
      if (!id) return;
      setIsLoading(true);
      try {
        const [appData, accessData] = await Promise.all([
          applicationService.getApplicationById(id),
          accessService.getAccessByApplicationId(id),
        ]);

        if (appData) {
          setApplication(appData);
          setAppAccess(accessData);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    loadAppData();
  }, [id]);

  if (isLoading) {
    return <LoadingState message="Loading application details..." />;
  }

  if (!application) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <p className="text-slate-500">Application not found</p>
          <Button onClick={() => navigate("/applications")} className="mt-4">
            Back to Applications
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
      <button
        onClick={() => navigate("/applications")}
        className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition"
      >
        <ArrowLeft size={16} />
        <span className="text-sm font-medium">Back to Applications</span>
      </button>

      {/* App Header */}
      <Card>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <AppWindow className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{application.name}</h1>
              <p className="text-slate-600 mt-1">{application.description}</p>
              <div className="flex items-center gap-3 mt-3">
                <StatusBadge status={application.environment} />
                <StatusBadge status={application.status} />
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" className="flex items-center gap-2">
              <Settings size={14} />
              Configure
            </Button>
            <Button variant="secondary">
              <MoreVertical size={14} />
            </Button>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card>
          <div className="flex items-center gap-3">
            <div className="bg-blue-50 p-2 rounded-lg">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Users</p>
              <p className="text-2xl font-bold text-slate-900">{application.userCount}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="bg-green-50 p-2 rounded-lg">
              <Shield className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Roles</p>
              <p className="text-2xl font-bold text-slate-900">{application.roleCount}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="bg-purple-50 p-2 rounded-lg">
              <Calendar className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Created</p>
              <p className="text-base font-bold text-slate-900">{formatDate(application.createdAt)}</p>
            </div>
          </div>
        </Card>
      </div>

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
            onClick={() => setActiveTab("users")}
            className={`pb-3 px-1 text-sm font-semibold transition border-b-2 ${
              activeTab === "users"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            Users ({appAccess.length})
          </button>
          <button
            onClick={() => setActiveTab("roles")}
            className={`pb-3 px-1 text-sm font-semibold transition border-b-2 ${
              activeTab === "roles"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            Roles
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Application Details</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Application Name</span>
                <span className="font-semibold text-slate-900">{application.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Owner</span>
                <span className="font-semibold text-slate-900">{application.owner}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Environment</span>
                <StatusBadge status={application.environment} />
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status</span>
                <StatusBadge status={application.status} />
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Configuration</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Authentication Type</span>
                <span className="font-semibold text-slate-900">{application.authenticationType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Total Users</span>
                <span className="font-semibold text-slate-900">{application.userCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Roles Configured</span>
                <span className="font-semibold text-slate-900">{application.roleCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Created</span>
                <span className="font-semibold text-slate-900">{formatDate(application.createdAt)}</span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {activeTab === "users" && (
        <Card>
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Users with Access</h3>
          {appAccess.length === 0 ? (
            <div className="py-8 text-center text-slate-500">No users have access yet</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50">
                  <tr className="text-left text-xs font-semibold text-slate-600 uppercase">
                    <th className="px-4 py-3">User</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3">Access Level</th>
                    <th className="px-4 py-3">Granted By</th>
                    <th className="px-4 py-3">Granted Date</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {appAccess.map((access) => (
                    <tr key={access.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-semibold text-slate-900">{access.userName}</td>
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

      {activeTab === "roles" && (
        <Card>
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Application Roles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {["Viewer", "Developer", "Admin", "Auditor"].map((role) => (
              <div key={role} className="border border-slate-200 rounded-lg p-4">
                <h4 className="font-semibold text-slate-900">{role}</h4>
                <p className="text-sm text-slate-500 mt-1">
                  {role === "Viewer" && "Read-only access to application resources"}
                  {role === "Developer" && "Read and write access for development"}
                  {role === "Admin" && "Full administrative access"}
                  {role === "Auditor" && "Audit and compliance access"}
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
