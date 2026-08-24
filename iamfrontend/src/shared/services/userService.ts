import type { User } from "@/types";
import { db, sleep } from "./mockDataStore";

export const userService = {
  async getUsers(): Promise<User[]> {
    await sleep();
    return db.users;
  },

  async getUserById(id: string): Promise<User | undefined> {
    await sleep();
    return db.users.find((user) => user.id === id);
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
    await sleep();
    const user = db.users.find((u) => u.id === id);
    if (user) {
      user.status = status;
    }
    return user;
  },

  async createUser(user: Omit<User, "id" | "createdAt">): Promise<User> {
    await sleep();
    const newUser: User = {
      ...user,
      id: `user_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    db.users.push(newUser);
    return newUser;
  },
};
