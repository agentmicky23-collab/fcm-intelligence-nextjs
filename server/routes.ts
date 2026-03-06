import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertOpportunitySchema, insertContentSchema, insertAgentHealthSchema,
  insertCostRecordSchema, insertHrCaseSchema, insertFeedbackLogSchema,
  insertContactSubmissionSchema,
} from "@shared/schema";
import { ZodError } from "zod";

function handleZodError(res: any, error: unknown) {
  if (error instanceof ZodError) {
    return res.status(400).json({ message: "Validation error", errors: error.errors });
  }
  throw error;
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // ─── Opportunities ─────────────────────────
  app.get("/api/opportunities", async (req, res) => {
    const { status, businessType, region } = req.query;
    const data = await storage.getOpportunities({
      status: status as string,
      businessType: businessType as string,
      region: region as string,
    });
    res.json(data);
  });

  app.get("/api/opportunities/insider", async (_req, res) => {
    const data = await storage.getInsiderOpportunities();
    res.json(data);
  });

  app.get("/api/opportunities/:id", async (req, res) => {
    const data = await storage.getOpportunity(req.params.id);
    if (!data) return res.status(404).json({ message: "Not found" });
    res.json(data);
  });

  app.post("/api/opportunities", async (req, res) => {
    try {
      const parsed = insertOpportunitySchema.parse(req.body);
      const data = await storage.createOpportunity(parsed);
      res.status(201).json(data);
    } catch (e) { handleZodError(res, e); }
  });

  app.patch("/api/opportunities/:id", async (req, res) => {
    const data = await storage.updateOpportunity(req.params.id, req.body);
    if (!data) return res.status(404).json({ message: "Not found" });
    res.json(data);
  });

  // ─── Content ───────────────────────────────
  app.get("/api/content", async (req, res) => {
    const { status, track } = req.query;
    const data = await storage.getContent({
      status: status as string,
      track: track as string,
    });
    res.json(data);
  });

  app.get("/api/content/published", async (req, res) => {
    const { track } = req.query;
    const data = await storage.getPublishedContent(track as string);
    res.json(data);
  });

  app.get("/api/content/:id", async (req, res) => {
    const data = await storage.getContentById(parseInt(req.params.id));
    if (!data) return res.status(404).json({ message: "Not found" });
    res.json(data);
  });

  app.post("/api/content", async (req, res) => {
    try {
      const parsed = insertContentSchema.parse(req.body);
      const data = await storage.createContent(parsed);
      res.status(201).json(data);
    } catch (e) { handleZodError(res, e); }
  });

  app.patch("/api/content/:id", async (req, res) => {
    const data = await storage.updateContent(parseInt(req.params.id), req.body);
    if (!data) return res.status(404).json({ message: "Not found" });
    res.json(data);
  });

  // ─── Agent Health ──────────────────────────
  app.get("/api/agents", async (_req, res) => {
    const data = await storage.getAgentHealth();
    res.json(data);
  });

  app.post("/api/agents", async (req, res) => {
    try {
      const parsed = insertAgentHealthSchema.parse(req.body);
      const data = await storage.upsertAgentHealth(parsed);
      res.json(data);
    } catch (e) { handleZodError(res, e); }
  });

  // ─── Cost Records ─────────────────────────
  app.get("/api/costs", async (req, res) => {
    const days = req.query.days ? parseInt(req.query.days as string) : 30;
    const data = await storage.getCostRecords(days);
    res.json(data);
  });

  app.get("/api/costs/summary", async (_req, res) => {
    const data = await storage.getCostSummary();
    res.json(data);
  });

  app.post("/api/costs", async (req, res) => {
    try {
      const parsed = insertCostRecordSchema.parse(req.body);
      const data = await storage.createCostRecord(parsed);
      res.status(201).json(data);
    } catch (e) { handleZodError(res, e); }
  });

  // ─── HR Cases ──────────────────────────────
  app.get("/api/hr", async (_req, res) => {
    const data = await storage.getHrCases();
    res.json(data);
  });

  app.get("/api/hr/:id", async (req, res) => {
    const data = await storage.getHrCase(parseInt(req.params.id));
    if (!data) return res.status(404).json({ message: "Not found" });
    res.json(data);
  });

  app.post("/api/hr", async (req, res) => {
    try {
      const parsed = insertHrCaseSchema.parse(req.body);
      const data = await storage.createHrCase(parsed);
      res.status(201).json(data);
    } catch (e) { handleZodError(res, e); }
  });

  app.patch("/api/hr/:id", async (req, res) => {
    const data = await storage.updateHrCase(parseInt(req.params.id), req.body);
    if (!data) return res.status(404).json({ message: "Not found" });
    res.json(data);
  });

  // ─── Feedback ──────────────────────────────
  app.post("/api/feedback", async (req, res) => {
    try {
      const parsed = insertFeedbackLogSchema.parse(req.body);
      const data = await storage.createFeedback(parsed);
      res.status(201).json(data);
    } catch (e) { handleZodError(res, e); }
  });

  // ─── Contact ───────────────────────────────
  app.post("/api/contact", async (req, res) => {
    try {
      const parsed = insertContactSubmissionSchema.parse(req.body);
      const data = await storage.createContactSubmission(parsed);
      res.status(201).json(data);
    } catch (e) { handleZodError(res, e); }
  });

  // ─── Dashboard ─────────────────────────────
  app.get("/api/dashboard", async (_req, res) => {
    const data = await storage.getDashboardSummary();
    res.json(data);
  });

  return httpServer;
}
