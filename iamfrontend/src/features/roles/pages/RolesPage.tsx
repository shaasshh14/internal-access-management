import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Users, Key, AppWindow, Search } from "lucide-react";
import PageHeader from "@/shared/components/PageHeader/PageHeader";
import Card from "@/shared/components/Card/Card";
import Badge from "@/shared/components/Badge/Badge";
import Button from "@/shared/components/Button/Button";
import LoadingState from "@/shared/components/LoadingState/LoadingState";
import { roleService } from "@/shared/services/roleService";
import type { Role } from "@/types";

export default function RolesPage() {
  const navigate = useNavigate();
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchRoles() {
      setIsLoading(true);
      try {
        const data = await roleService.getRoles();
        setRoles(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchRoles();
  }, []);

  const filteredRoles = roles.filter((role) =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Roles"
        description="Manage organizational roles and permission sets."
        actions={
          <Button variant="primary" className="flex items-center gap-2">
            <Shield size={16} />
            Create Role
          </Button>
        }
      />

      {/* Search */}
      <Card>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search roles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </Card>

      {/* Roles Grid */}
      {isLoading ? (
        <LoadingState message="Loading roles..." />
      ) : filteredRoles.length === 0 ? (
        <Card>
          <div className="py-12 text-center text-slate-500">No roles found.</div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredRoles.map((role) => (
            <Card key={role.id}>
              <div
                className="cursor-pointer"
                onClick={() => navigate(`/roles/${role.id}`)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-purple-100 p-2.5 rounded-lg">
                      <Shield className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">{role.name}</h3>
                      <Badge variant="neutral" className="mt-1">{role.status}</Badge>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-slate-600 mb-4 line-clamp-2">{role.description}</p>

                <div className="grid grid-cols-3 gap-3 text-center pt-3 border-t border-slate-100">
                  <div>
                    <div className="flex items-center justify-center gap-1 text-slate-500 mb-1">
                      <Users size={14} />
                    </div>
                    <p className="text-lg font-bold text-slate-900">{role.userCount}</p>
                    <p className="text-xs text-slate-500">Users</p>
                  </div>
                  <div>
                    <div className="flex items-center justify-center gap-1 text-slate-500 mb-1">
                      <Key size={14} />
                    </div>
                    <p className="text-lg font-bold text-slate-900">{role.permissionCount}</p>
                    <p className="text-xs text-slate-500">Permissions</p>
                  </div>
                  <div>
                    <div className="flex items-center justify-center gap-1 text-slate-500 mb-1">
                      <AppWindow size={14} />
                    </div>
                    <p className="text-lg font-bold text-slate-900">{role.applicationCount}</p>
                    <p className="text-xs text-slate-500">Apps</p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
