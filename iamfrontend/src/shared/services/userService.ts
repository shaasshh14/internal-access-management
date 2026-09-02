import type { User } from "@/types";
import { db, sleep } from "./mockDataStore";
import api from "./api";

type CreateUserInput = Omit<User, "id" | "createdAt"> & {
  password?: string;
};

function shouldUseMockFallback(error: unknown) {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error
  ) {
    const response = (error as { response?: { status?: number } }).response;
    return response?.status === 401 || response?.status === 403;
  }

  return true;
}

export const userService = {
  async getUsers(): Promise<User[]> {
    try {
      const response = await api.get<User[]>("/users");
      return response.data;
    } catch (error) {
      if (!shouldUseMockFallback(error)) throw error;
      await sleep();
      return db.users;
    }
  },

  async getUserById(id: string): Promise<User | undefined> {
    try {
      const response = await api.get<User>(`/users/${id}`);
      return response.data;
    } catch (error) {
      if (!shouldUseMockFallback(error)) throw error;
      await sleep();
      return db.users.find((user) => user.id === id);
    }
  },

  async searchUsers(query: string): Promise<User[]> {
    await sleep();
    const lowerQuery = query.toLowerCase();
    return db.users.filter(
      (user) =>
        user.name.toLowerCase().includes(lowerQuery) ||
        user.email.toLowerCase().includes(lowerQuery) ||
        user.employeeId.toLowerCase().includes(lowerQuery)
    );
  },

  async updateUserStatus(id: string, status: User["status"]): Promise<User | undefined> {
    try {
      const response = await api.patch<User>(`/users/${id}/status`, { status });
      return response.data;
    } catch (error) {
      if (!shouldUseMockFallback(error)) throw error;
      await sleep();
      const user = db.users.find((u) => u.id === id);
      if (user) {
        user.status = status;
      }
      return user;
    }
  },

  async createUser(user: CreateUserInput): Promise<User> {
    try {
      const response = await api.post<User>("/users", {
        name: user.name,
        email: user.email,
        employeeId: user.employeeId,
        department: user.department,
        role: user.role,
        status: user.status,
        password: user.password,
      });
      return response.data;
    } catch (error) {
      if (!shouldUseMockFallback(error)) throw error;
      await sleep();
      const newUser: User = {
        ...user,
        id: `user_${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      db.users.push(newUser);
      return newUser;
    }
  },
};
