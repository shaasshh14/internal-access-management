import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Shield, Users, Key, AppWindow } from "lucide-react";
import Card from "@/shared/components/Card/Card";
import Badge from "@/shared/components/Badge/Badge";
import Button from "@/shared/components/Button/Button";
import LoadingState from "@/shared/components/LoadingState/LoadingState";
import { roleService } from "@/shared/services/roleService";
import type { Role } from "@/types";

export default function RoleDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [role, setRole] = useState<Role | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadRole() {
      if (!id) return;
      setIsLoading(true);
      try {
        const data = await roleService.getRoleById(id);
        if (data) setRole(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    loadRole();
  }, [id]);

  if (isLoading) {
    return <LoadingState message="Loading role details..." />;
  }

  if (!role) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <p className="text-slate-500">Role not found</p>
          <Button onClick={() => navigate("/roles")} className="mt-4">
            Back to Roles
          </Button>
        </div>
      </div>
    );
  }

  const permissions = [
    { resource: "Users", perms: ["users.read", "users.create", "users.update", "users.delete"] },
    { resource: "Applications", perms: ["applications.read", "applications.create", "applications.update"] },
    { resource: "Access", perms: ["access.request", "access.approve", "access.revoke"] },
    { resource: "Audit", perms: ["audit.read"] },
  ];

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate("/roles")}
        className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition"
      >
        <ArrowLeft size={16} />
        <span className="text-sm font-medium">Back to Roles</span>
      </button>

      {/* Header */}
      <Card>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-purple-100 p-3 rounded-lg">
              <Shield className="h-8 w-8 text-purple-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{role.name}</h1>
              <p className="text-slate-600 mt-1">{role.description}</p>
              <Badge variant="success" className="mt-2">{role.status}</Badge>
            </div>
          </div>
          <Button variant="secondary">Edit Role</Button>
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
              <p className="text-sm text-slate-500">Users</p>
              <p className="text-2xl font-bold text-slate-900">{role.userCount}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="bg-green-50 p-2 rounded-lg">
              <Key className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Permissions</p>
              <p className="text-2xl font-bold text-slate-900">{role.permissionCount}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="bg-purple-50 p-2 rounded-lg">
              <AppWindow className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Applications</p>
              <p className="text-2xl font-bold text-slate-900">{role.applicationCount}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Permissions */}
      <Card>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Permissions</h3>
        <div className="space-y-6">
          {permissions.map((group) => (
            <div key={group.resource}>
              <h4 className="text-sm font-semibold text-slate-700 mb-3">{group.resource}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {group.perms.map((perm) => (
                  <label key={perm} className="flex items-center gap-2 text-sm text-slate-600">
                    <input
                      type="checkbox"
                      checked={true}
                      readOnly
                      className="rounded text-blue-600"
                    />
                    <code className="text-xs bg-slate-100 px-2 py-0.5 rounded">{perm}</code>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
