import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Eye, Check, X, AlertCircle } from "lucide-react";
import PageHeader from "@/shared/components/PageHeader/PageHeader";
import Card from "@/shared/components/Card/Card";
import StatusBadge from "@/shared/components/StatusBadge/StatusBadge";
import LoadingState from "@/shared/components/LoadingState/LoadingState";
import { requestService } from "@/shared/services/requestService";
import type { AccessRequest } from "@/types";

export default function RequestsPage() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<AccessRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    async function fetchRequests() {
      setIsLoading(true);
      try {
        const data = await requestService.getRequests();
        setRequests(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchRequests();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      await requestService.approveRequest(id);
      const data = await requestService.getRequests();
      setRequests(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async (id: string) => {
    const reason = window.prompt("Enter reason for rejection:");
    if (reason === null) return;
    try {
      await requestService.rejectRequest(id, reason || "Access policy restrictions");
      const data = await requestService.getRequests();
      setRequests(data);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredRequests = requests.filter((req) => {
    const matchesSearch =
      req.requesterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.applicationName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "ALL" || req.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const pendingCount = requests.filter((r) => r.status === "PENDING").length;
  const approvedCount = requests.filter((r) => r.status === "APPROVED").length;
  const rejectedCount = requests.filter((r) => r.status === "REJECTED").length;

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Access Requests"
        description="Review and manage access requests from your organization."
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <Card>
          <div className="flex items-center gap-3">
            <div className="bg-amber-50 p-2 rounded-lg">
              <AlertCircle className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Pending</p>
              <p className="text-2xl font-bold text-slate-900">{pendingCount}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="bg-green-50 p-2 rounded-lg">
              <Check className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Approved</p>
              <p className="text-2xl font-bold text-slate-900">{approvedCount}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="bg-red-50 p-2 rounded-lg">
              <X className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Rejected</p>
              <p className="text-2xl font-bold text-slate-900">{rejectedCount}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="bg-blue-50 p-2 rounded-lg">
              <Eye className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total</p>
              <p className="text-2xl font-bold text-slate-900">{requests.length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search requests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-slate-300 p-2 bg-white text-sm"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </Card>

      {/* Requests Table */}
      {isLoading ? (
        <LoadingState message="Loading requests..." />
      ) : filteredRequests.length === 0 ? (
        <Card>
          <div className="py-12 text-center text-slate-500">
            No requests found.
          </div>
        </Card>
      ) : (
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50">
                <tr className="text-left text-xs font-semibold text-slate-600 uppercase">
                  <th className="px-4 py-3">Request ID</th>
                  <th className="px-4 py-3">Requester</th>
                  <th className="px-4 py-3">Application</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Requested At</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-mono text-xs text-slate-600">{req.id}</td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-semibold text-slate-900">{req.requesterName}</p>
                        <p className="text-xs text-slate-500">{req.requesterEmail}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-900">{req.applicationName}</td>
                    <td className="px-4 py-3 text-slate-600">{req.roleName}</td>
                    <td className="px-4 py-3 text-slate-600">{formatDate(req.requestedAt)}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={req.status} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() => navigate(`/requests/${req.id}`)}
                          className="p-1.5 text-slate-400 hover:text-slate-900 rounded hover:bg-slate-100"
                          title="View details"
                        >
                          <Eye size={16} />
                        </button>
                        {req.status === "PENDING" && (
                          <>
                            <button
                              onClick={() => handleApprove(req.id)}
                              className="p-1.5 text-green-600 hover:text-green-700 rounded hover:bg-green-50"
                              title="Approve"
                            >
                              <Check size={16} />
                            </button>
                            <button
                              onClick={() => handleReject(req.id)}
                              className="p-1.5 text-red-600 hover:text-red-700 rounded hover:bg-red-50"
                              title="Reject"
                            >
                              <X size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
