import { useEffect, useState } from "react";
import { Shield, AppWindow, Calendar, Eye } from "lucide-react";
import PageHeader from "@/shared/components/PageHeader/PageHeader";
import Card from "@/shared/components/Card/Card";
import StatusBadge from "@/shared/components/StatusBadge/StatusBadge";
import LoadingState from "@/shared/components/LoadingState/LoadingState";
import { accessService } from "@/shared/services/accessService";
import type { Access } from "@/types";

export default function AccessPage() {
  const [myAccess, setMyAccess] = useState<Access[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchMyAccess() {
      setIsLoading(true);
      try {
        const data = await accessService.getMyAccess();
        setMyAccess(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchMyAccess();
  }, []);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const activeAccess = myAccess.filter((a) => a.status === "ACTIVE");
  const expiringSoon = myAccess.filter((a) => {
    if (!a.expiryDate) return false;
    const expiryDate = new Date(a.expiryDate);
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    return expiryDate > now && expiryDate <= thirtyDaysFromNow;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Access"
        description="Applications and permissions currently assigned to you."
      />

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card>
          <div className="flex items-center gap-3">
            <div className="bg-blue-50 p-2 rounded-lg">
              <AppWindow className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Applications</p>
              <p className="text-2xl font-bold text-slate-900">{myAccess.length}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="bg-green-50 p-2 rounded-lg">
              <Shield className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Active Access</p>
              <p className="text-2xl font-bold text-slate-900">{activeAccess.length}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="bg-red-50 p-2 rounded-lg">
              <Calendar className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Expiring Soon</p>
              <p className="text-2xl font-bold text-slate-900">{expiringSoon.length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Access Table */}
      {isLoading ? (
        <LoadingState message="Loading your access..." />
      ) : myAccess.length === 0 ? (
        <Card>
          <div className="py-12 text-center text-slate-500">
            You don't have any application access yet.
          </div>
        </Card>
      ) : (
        <Card>
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Your Application Access</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50">
                <tr className="text-left text-xs font-semibold text-slate-600 uppercase">
                  <th className="px-4 py-3">Application</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Access Level</th>
                  <th className="px-4 py-3">Granted Date</th>
                  <th className="px-4 py-3">Expiry</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {myAccess.map((access) => (
                  <tr key={access.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-semibold text-slate-900">{access.applicationName}</td>
                    <td className="px-4 py-3 text-slate-600">{access.roleName}</td>
                    <td className="px-4 py-3 text-slate-600">{access.accessLevel}</td>
                    <td className="px-4 py-3 text-slate-600">{formatDate(access.grantedDate)}</td>
                    <td className="px-4 py-3 text-slate-600">
                      {access.expiryDate ? formatDate(access.expiryDate) : "No expiry"}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={access.status} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        className="p-1.5 text-slate-400 hover:text-slate-900 rounded hover:bg-slate-100"
                        title="View details"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
