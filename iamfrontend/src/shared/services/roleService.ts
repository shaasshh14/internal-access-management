import type { Role } from "@/types";
import { db, sleep } from "./mockDataStore";

export const roleService = {
  async getRoles(): Promise<Role[]> {
    await sleep();
    return db.roles;
  },

  async getRoleById(id: string): Promise<Role | undefined> {
    await sleep();
    return db.roles.find((role) => role.id === id);
  },

  async searchRoles(query: string): Promise<Role[]> {
    await sleep();
    const lowerQuery = query.toLowerCase();
    return db.roles.filter(
      (role) =>
        role.name.toLowerCase().includes(lowerQuery) ||
        role.description.toLowerCase().includes(lowerQuery)
    );
  },
};
