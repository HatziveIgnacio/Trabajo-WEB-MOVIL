import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import path from "path";
import fs from "fs";

export async function registerRoutes(app: Express): Promise<Server> {
  // Forward requests to the Ionic Angular application
  // This redirect will be used when running the application directly from server
  // instead of using the Ionic CLI's dev server
  
  app.get("/api/status", (req, res) => {
    res.json({
      status: "ok",
      message: "Ionic Angular application server is running"
    });
  });

  const httpServer = createServer(app);

  return httpServer;
}
