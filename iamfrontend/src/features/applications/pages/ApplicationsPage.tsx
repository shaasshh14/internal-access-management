import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, PlusCircle, AppWindow, Users as UsersIcon, Shield } from "lucide-react";
import PageHeader from "@/shared/components/PageHeader/PageHeader";
import StatusBadge from "@/shared/components/StatusBadge/StatusBadge";
import Card from "@/shared/components/Card/Card";
import Button from "@/shared/components/Button/Button";
import LoadingState from "@/shared/components/LoadingState/LoadingState";
import Badge from "@/shared/components/Badge/Badge";
import { applicationService } from "@/shared/services/applicationService";
import type { Application } from "@/types";

export default function ApplicationsPage() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [envFilter, setEnvFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    async function fetchApps() {
      setIsLoading(true);
      try {
        const data = await applicationService.getApplications();
        setApplications(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchApps();
  }, []);

  const filteredApps = applications.filter((app) => {
    const matchesSearch =
      app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesEnv = envFilter === "ALL" || app.environment === envFilter;
    const matchesStatus = statusFilter === "ALL" || app.status === statusFilter;

    return matchesSearch && matchesEnv && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Applications"
        description="Manage connected applications, integrations, and access policies."
        actions={
          <Button variant="primary" className="flex items-center gap-2">
            <PlusCircle size={16} />
            Add Application
          </Button>
        }
      />

      {/* Filters */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search applications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-3">
            <select
              value={envFilter}
              onChange={(e) => setEnvFilter(e.target.value)}
              className="rounded-lg border border-slate-300 p-2 bg-white text-sm"
            >
              <option value="ALL">All Environments</option>
              <option value="Production">Production</option>
              <option value="Staging">Staging</option>
              <option value="Development">Development</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-slate-300 p-2 bg-white text-sm"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="MAINTENANCE">Maintenance</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Applications Grid */}
      {isLoading ? (
        <LoadingState message="Loading applications..." />
      ) : filteredApps.length === 0 ? (
        <Card>
          <div className="py-12 text-center text-slate-500">
            No applications found.
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredApps.map((app) => (
            <Card key={app.id}>
              <div
                className="cursor-pointer"
                onClick={() => navigate(`/applications/${app.id}`)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2.5 rounded-lg">
                      <AppWindow className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">{app.name}</h3>
                      <p className="text-xs text-slate-500">{app.owner}</p>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-slate-600 mb-4 line-clamp-2">{app.description}</p>

                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <div className="flex items-center gap-1">
                      <UsersIcon size={14} />
                      {app.userCount} users
                    </div>
                    <div className="flex items-center gap-1">
                      <Shield size={14} />
                      {app.roleCount} roles
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <StatusBadge status={app.environment} />
                  <StatusBadge status={app.status} />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
