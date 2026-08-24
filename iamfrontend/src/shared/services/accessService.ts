import type { Access } from "@/types";
import { db, sleep, getActiveUser } from "./mockDataStore";

export const accessService = {
  async getAllAccess(): Promise<Access[]> {
    await sleep();
    return db.access;
  },

  async getAccessByUserId(userId: string): Promise<Access[]> {
    await sleep();
    return db.access.filter((access) => access.userId === userId);
  },

  async getMyAccess(): Promise<Access[]> {
    await sleep();
    const currentUser = getActiveUser();
    return db.access.filter((access) => access.userId === currentUser.id);
  },

  async getAccessByApplicationId(applicationId: string): Promise<Access[]> {
    await sleep();
    return db.access.filter((access) => access.applicationId === applicationId);
  },
};
