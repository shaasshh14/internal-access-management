// ApplicationsPage improvements: better filter bar, card grid with visual identity
import { Search, PlusCircle, AppWindow, Users as UsersIcon, Shield } from "lucide-react";
import PageHeader from "@/shared/components/PageHeader/PageHeader";
import StatusBadge from "@/shared/components/StatusBadge/StatusBadge";
import Card from "@/shared/components/Card/Card";
import Button from "@/shared/components/Button/Button";
import LoadingState from "@/shared/components/LoadingState/LoadingState";
import Badge from "@/shared/components/Badge/Badge";
import { applicationService } from "@/shared/services/applicationService";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
      try { setApplications(await applicationService.getApplications()); } catch (e) { console.error(e); } finally { setIsLoading(false); }
    }
    fetchApps();
  }, []);

  const filteredApps = applications.filter(a => {
    const m = a.name.toLowerCase().includes(searchTerm.toLowerCase()) || a.description.toLowerCase().includes(searchTerm.toLowerCase());
    return m && (envFilter === "ALL" || a.environment === envFilter) && (statusFilter === "ALL" || a.status === statusFilter);
  });

  return (
    <div className="space-y-5">
      <PageHeader title="Applications" description="Manage connected platforms and integrations." actions={<Button variant="primary" className="flex items-center gap-2"><PlusCircle size={15} /> Add Application</Button>} />
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
        <div className="flex flex-col md:flex-row gap-3 justify-between items-start md:items-center">
          <div className="relative w-full md:w-96"><Search className="absolute left-3 top-2 text-slate-400 h-4 w-4" /><input type="text" placeholder="Search applications..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-400" /></div>
          <div className="flex gap-2"><select value={envFilter} onChange={e => setEnvFilter(e.target.value)} className="rounded-md border border-slate-200 px-3 py-2 text-sm bg-white"><option>All Environments</option><option>Production</option><option>Staging</option><option>Development</option></select><select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="rounded-md border border-slate-200 px-3 py-2 text-sm bg-white"><option>All Statuses</option><option>Active</option><option>Maintenance</option><option>Inactive</option></select></div>
        </div>
      </div>
      {isLoading ? <LoadingState message="Loading applications..." /> : filteredApps.length === 0 ? <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-12 text-center text-sm text-slate-400">No applications found.</div> :
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredApps.map(app => (
            <div key={app.id} onClick={() => navigate(`/applications/${app.id}`)} className="group bg-white rounded-xl border border-slate-100/60 p-5 shadow-sm hover:shadow-md hover:border-slate-200 transition-all duration-200 cursor-pointer">
              <div className="flex items-start gap-3 mb-3"> <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-sm shadow-blue-200 group-hover:shadow-md transition-shadow">{app.name.slice(0,2).toUpperCase()}</div> <div> <h3 className="font-semibold text-slate-900 leading-snug">{app.name}</h3> <p className="text-[11px] text-slate-400">{app.environment} · {app.status}</p> </div> </div>
              <p className="text-sm text-slate-600 mb-3 line-clamp-2">{app.description}</p>
              <div className="flex items-center gap-3 text-xs text-slate-500 mb-3"> <span className="flex items-center gap-1"><UsersIcon size={13} /> {app.userCount}</span> <span className="flex items-center gap-1"><Shield size={13} /> {app.roleCount}</span> </div>
              <div className="flex items-center gap-2 pt-3 border-t border-slate-100"><Badge variant="primary">{app.environment}</Badge><Badge variant={app.status === "ACTIVE" ? "success" : "warning"}>{app.status}</Badge></div>
            </div>
          ))}
        </div>
      }
    </div>
  );
}
