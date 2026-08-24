import { useEffect, useState } from "react";
import { Search, Filter, Download, CheckCircle, XCircle } from "lucide-react";
import PageHeader from "@/shared/components/PageHeader/PageHeader";
import Card from "@/shared/components/Card/Card";
import Badge from "@/shared/components/Badge/Badge";
import Button from "@/shared/components/Button/Button";
import LoadingState from "@/shared/components/LoadingState/LoadingState";
import { auditService } from "@/shared/services/auditService";
import type { AuditLog } from "@/types";

export default function AuditPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState("ALL");

  useEffect(() => {
    async function fetchLogs() {
      setIsLoading(true);
      try {
        const data = await auditService.getAuditLogs();
        setLogs(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.resource.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesAction = actionFilter === "ALL" || log.action === actionFilter;

    return matchesSearch && matchesAction;
  });

  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const uniqueActions = ["ALL", ...Array.from(new Set(logs.map((l) => l.action)))];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Audit Logs"
        description="Track security and access-related activity across your organization."
        actions={
          <Button variant="secondary" className="flex items-center gap-2">
            <Download size={16} />
            Export Logs
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
              placeholder="Search logs by actor, action, or resource..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="rounded-lg border border-slate-300 p-2 bg-white text-sm"
          >
            {uniqueActions.map((action) => (
              <option key={action} value={action}>
                {action === "ALL" ? "All Actions" : action.replace(/_/g, " ")}
              </option>
            ))}
          </select>
        </div>
      </Card>

      {/* Audit Logs */}
      {isLoading ? (
        <LoadingState message="Loading audit logs..." />
      ) : filteredLogs.length === 0 ? (
        <Card>
          <div className="py-12 text-center text-slate-500">No audit logs found.</div>
        </Card>
      ) : (
        <Card>
          <div className="space-y-4">
            {filteredLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-start gap-4 pb-4 border-b last:border-0 border-slate-100"
              >
                <div className="mt-1">
                  {log.status === "SUCCESS" ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="neutral" className="text-xs">
                        {log.action.replace(/_/g, " ")}
                      </Badge>
                      <span className="text-sm font-semibold text-slate-900">{log.actor}</span>
                    </div>
                    <span className="text-xs text-slate-400 shrink-0">
                      {formatDateTime(log.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mt-2">{log.details}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                    <span>Email: {log.actorEmail}</span>
                    <span>IP: {log.ipAddress}</span>
                    <span>Resource: {log.resource}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
