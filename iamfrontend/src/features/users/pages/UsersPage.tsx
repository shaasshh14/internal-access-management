import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, PlusCircle, ChevronLeft, ChevronRight, Eye, UserX, UserCheck, Filter, Download, SlidersHorizontal } from "lucide-react";
import PageHeader from "@/shared/components/PageHeader/PageHeader";
import StatusBadge from "@/shared/components/StatusBadge/StatusBadge";
import Avatar from "@/shared/components/Avatar/Avatar";
import Button from "@/shared/components/Button/Button";
import LoadingState from "@/shared/components/LoadingState/LoadingState";
import { userService } from "@/shared/services/userService";
import type { User } from "@/types";

export default function UsersPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    async function fetchUsers() {
      setIsLoading(true);
      try {
        const data = await userService.getUsers();
        setUsers(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-5">
      <PageHeader
        title="Users"
        description="Manage identities and organizational access within your company."
        actions={
          <Button variant="primary" className="flex items-center gap-2 shadow-md shadow-blue-500/10">
            <PlusCircle size={15} strokeWidth={2.5} />
            Add User
          </Button>
        }
      />

      {/* Filter Bar */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
        <div className="flex flex-col lg:flex-row gap-3 items-start lg:items-center justify-between">
          <div className="relative w-full lg:w-96 lg:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search by name, email, or employee ID..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-400 transition-colors"
            />
          </div>
          <div className="flex gap-3 items-center">
            <div className="relative">
              <Filter size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                className="pl-7 pr-6 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/15 focus:border-blue-400 appearance-none cursor-pointer"
              >
                <option value="ALL">All Statuses</option>
                <option value="ACTIVE">Active</option>
                <option value="SUSPENDED">Suspended</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>
            <button className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors hover:underline">
              <Download size={14} className="inline -mt-0.5 mr-0.5" />
              Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <LoadingState message="Loading users..." />
      ) : paginatedUsers.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-12 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-50 mb-4">
            <Search size={20} className="text-slate-300" />
          </div>
          <h3 className="text-sm font-semibold text-slate-900">No users found</h3>
          <p className="text-xs text-slate-500 mt-1.5">Try adjusting your search or filter criteria.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-slate-100 text-sm">
            <thead className="bg-slate-50/60">
              <tr>
                <th className="px-5 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">Identity</th>
                <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">Employee ID</th>
                <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">Department</th>
                <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">Role</th>
                <th className="px-3 py-3 text-center text-[10px] font-bold text-slate-500 uppercase tracking-wider">Apps</th>
                <th className="px-4 py-3 text-left text-[10px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-right text-[10px] font-bold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/60 transition-colors group">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <Avatar name={user.name} size="sm" />
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-900 text-sm truncate">{user.name}</p>
                        <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-xs text-slate-500 font-mono">{user.employeeId}</td>
                  <td className="px-4 py-3.5 text-xs text-slate-600">{user.department}</td>
                  <td className="px-4 py-3.5 text-xs text-slate-600">{user.role}</td>
                  <td className="px-3 py-3.5 text-center text-xs text-slate-500">{user.applicationCount}</td>
                  <td className="px-4 py-3.5">
                    <StatusBadge status={user.status} variant={
                      user.status === "ACTIVE" ? "success" :
                      user.status === "SUSPENDED" ? "danger" :
                      user.status === "INACTIVE" ? "neutral" : "warning"
                    } />
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <button
                      onClick={() => navigate(`/users/${user.id}`)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-all"
                    >
                      <Eye size={13} /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex items-center justify-between px-5 py-3.5 border-t border-slate-100 bg-slate-50/30 text-xs text-slate-500">
            <span>
              Showing <span className="font-semibold text-slate-900">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
              <span className="font-semibold text-slate-900">{Math.min(currentPage * itemsPerPage, filteredUsers.length)}</span> of{" "}
              <span className="font-semibold text-slate-900">{filteredUsers.length}</span>
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-white disabled:cursor-default text-xs font-medium transition-colors"
              >
                <ChevronLeft size={13} /> Prev
              </button>
              <span className="px-2 text-slate-400">|</span>
              <span className="font-semibold text-slate-700">Page {currentPage}</span>
              <span className="text-slate-300">of</span>
              <span className="font-semibold text-slate-700">{totalPages || 1}</span>
              <span className="px-2 text-slate-400">|</span>
              <button
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-white disabled:cursor-default text-xs font-medium transition-colors"
              >
                Next <ChevronRight size={13} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
