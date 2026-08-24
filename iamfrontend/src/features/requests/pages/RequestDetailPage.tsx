import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle, XCircle, Clock, User } from "lucide-react";
import Card from "@/shared/components/Card/Card";
import StatusBadge from "@/shared/components/StatusBadge/StatusBadge";
import Button from "@/shared/components/Button/Button";
import LoadingState from "@/shared/components/LoadingState/LoadingState";
import { requestService } from "@/shared/services/requestService";
import type { AccessRequest } from "@/types";

export default function RequestDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [request, setRequest] = useState<AccessRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadRequest() {
      if (!id) return;
      setIsLoading(true);
      try {
        const data = await requestService.getRequestById(id);
        if (data) setRequest(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    loadRequest();
  }, [id]);

  const handleApprove = async () => {
    if (!request) return;
    try {
      await requestService.approveRequest(request.id);
      const data = await requestService.getRequestById(request.id);
      if (data) setRequest(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async () => {
    if (!request) return;
    const reason = window.prompt("Enter reason for rejection:");
    if (reason === null) return;
    try {
      await requestService.rejectRequest(request.id, reason || "Access policy restrictions");
      const data = await requestService.getRequestById(request.id);
      if (data) setRequest(data);
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) {
    return <LoadingState message="Loading request..." />;
  }

  if (!request) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <p className="text-slate-500">Request not found</p>
          <Button onClick={() => navigate("/requests")} className="mt-4">
            Back to Requests
          </Button>
        </div>
      </div>
    );
  }

  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate("/requests")}
        className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition"
      >
        <ArrowLeft size={16} />
        <span className="text-sm font-medium">Back to Requests</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Access Request</h1>
                <p className="text-sm text-slate-500 mt-1">Request ID: {request.id}</p>
              </div>
              <StatusBadge status={request.status} />
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-500 uppercase mb-2">Requester</h3>
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{request.requesterName}</p>
                    <p className="text-sm text-slate-500">{request.requesterEmail}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <p className="text-sm text-slate-500">Application</p>
                  <p className="font-semibold text-slate-900 mt-1">{request.applicationName}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Requested Role</p>
                  <p className="font-semibold text-slate-900 mt-1">{request.roleName}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Access Level</p>
                  <p className="font-semibold text-slate-900 mt-1">{request.accessLevel}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Requested At</p>
                  <p className="font-semibold text-slate-900 mt-1">{formatDateTime(request.requestedAt)}</p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm text-slate-500 mb-2">Reason for Request</p>
                <p className="text-slate-900">{request.reason}</p>
              </div>

              {request.status === "REJECTED" && request.rejectionReason && (
                <div className="pt-4 border-t bg-red-50 -mx-6 -mb-6 px-6 py-4 rounded-b-xl">
                  <p className="text-sm font-semibold text-red-900 mb-2">Rejection Reason</p>
                  <p className="text-red-800">{request.rejectionReason}</p>
                </div>
              )}
            </div>
          </Card>

          {/* Actions */}
          {request.status === "PENDING" && (
            <Card>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Review Actions</h3>
              <div className="flex gap-3">
                <Button
                  variant="primary"
                  className="flex-1 flex items-center justify-center gap-2"
                  onClick={handleApprove}
                >
                  <CheckCircle size={16} />
                  Approve Request
                </Button>
                <Button
                  variant="danger"
                  className="flex-1 flex items-center justify-center gap-2"
                  onClick={handleReject}
                >
                  <XCircle size={16} />
                  Reject Request
                </Button>
              </div>
            </Card>
          )}
        </div>

        {/* Timeline */}
        <div>
          <Card>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Request Timeline</h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="mt-1">
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900 text-sm">Request Submitted</p>
                  <p className="text-xs text-slate-500 mt-1">{formatDateTime(request.requestedAt)}</p>
                  <p className="text-xs text-slate-500">By {request.requesterName}</p>
                </div>
              </div>

              {request.status === "APPROVED" && request.reviewedAt && (
                <div className="flex gap-3">
                  <div className="mt-1">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">Request Approved</p>
                    <p className="text-xs text-slate-500 mt-1">{formatDateTime(request.reviewedAt)}</p>
                    <p className="text-xs text-slate-500">By {request.reviewerName}</p>
                  </div>
                </div>
              )}

              {request.status === "REJECTED" && request.reviewedAt && (
                <div className="flex gap-3">
                  <div className="mt-1">
                    <XCircle className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">Request Rejected</p>
                    <p className="text-xs text-slate-500 mt-1">{formatDateTime(request.reviewedAt)}</p>
                    <p className="text-xs text-slate-500">By {request.reviewerName}</p>
                  </div>
                </div>
              )}

              {request.status === "PENDING" && (
                <div className="flex gap-3">
                  <div className="mt-1">
                    <Clock className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">Pending Review</p>
                    <p className="text-xs text-slate-500 mt-1">Awaiting approval</p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
