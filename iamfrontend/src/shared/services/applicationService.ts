import type { Application } from "@/types";
import { db, sleep } from "./mockDataStore";

export const applicationService = {
  async getApplications(): Promise<Application[]> {
    await sleep();
    return db.applications;
  },

  async getApplicationById(id: string): Promise<Application | undefined> {
    await sleep();
    return db.applications.find((app) => app.id === id);
  },

  async searchApplications(query: string): Promise<Application[]> {
    await sleep();
    const lowerQuery = query.toLowerCase();
    return db.applications.filter(
      (app) =>
        app.name.toLowerCase().includes(lowerQuery) ||
        app.description.toLowerCase().includes(lowerQuery)
    );
  },

  async updateApplicationStatus(
    id: string,
    status: Application["status"]
  ): Promise<Application | undefined> {
    await sleep();
    const app = db.applications.find((a) => a.id === id);
    if (app) {
      app.status = status;
    }
    return app;
  },
};
