import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertOpportunitySchema, insertContentSchema, insertAgentHealthSchema,
  insertCostRecordSchema, insertHrCaseSchema, insertFeedbackLogSchema,
  insertContactSubmissionSchema, insertAgentActivitySchema,
  insertHrConversationSchema,
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

  app.get("/api/content/calendar", async (req, res) => {
    const data = await storage.getContent({});
    const withSchedule = data.filter((c: any) => c.scheduledDate);
    res.json(withSchedule);
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

  app.get("/api/content/:id/platforms", async (req, res) => {
    const data = await storage.getContentById(parseInt(req.params.id));
    if (!data) return res.status(404).json({ message: "Not found" });
    res.json(data.platformVersions || {});
  });

  app.post("/api/content/:id/adapt", async (req, res) => {
    const data = await storage.getContentById(parseInt(req.params.id));
    if (!data) return res.status(404).json({ message: "Not found" });
    const { platform } = req.body;
    const versions = (data.platformVersions as Record<string, any>) || {};
    versions[platform] = { body: data.body, status: "draft" };
    const updated = await storage.updateContent(data.id, { platformVersions: versions });
    res.json(updated);
  });

  app.patch("/api/content/:id/platform/:platform", async (req, res) => {
    const data = await storage.getContentById(parseInt(req.params.id));
    if (!data) return res.status(404).json({ message: "Not found" });
    const versions = (data.platformVersions as Record<string, any>) || {};
    versions[req.params.platform] = { ...versions[req.params.platform], ...req.body };
    const updated = await storage.updateContent(data.id, { platformVersions: versions });
    res.json(updated);
  });

  app.post("/api/content/:id/approve", async (req, res) => {
    const data = await storage.getContentById(parseInt(req.params.id));
    if (!data) return res.status(404).json({ message: "Not found" });
    const { platforms } = req.body;
    const versions = (data.platformVersions as Record<string, any>) || {};
    for (const p of platforms || []) {
      if (versions[p]) versions[p].status = "approved";
    }
    const updated = await storage.updateContent(data.id, {
      status: "published",
      publishedAt: new Date(),
      platformVersions: versions,
    });
    res.json(updated);
  });

  app.patch("/api/content/:id/schedule", async (req, res) => {
    const { scheduledDate, scheduledPlatforms } = req.body;
    const updated = await storage.updateContent(parseInt(req.params.id), {
      scheduledDate,
      scheduledPlatforms,
    });
    if (!updated) return res.status(404).json({ message: "Not found" });
    res.json(updated);
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

  // ─── Agent Activity ────────────────────────
  app.get("/api/agents/activity", async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
    const data = await storage.getAgentActivities(limit);
    res.json(data);
  });

  app.post("/api/agents/activity", async (req, res) => {
    try {
      const parsed = insertAgentActivitySchema.parse(req.body);
      const data = await storage.createAgentActivity(parsed);
      res.status(201).json(data);
    } catch (e) { handleZodError(res, e); }
  });

  app.get("/api/agents/:name/detail", async (req, res) => {
    const data = await storage.getAgentDetail(req.params.name);
    res.json(data);
  });

  // ─── Scan Config ───────────────────────────
  app.get("/api/scan/config", async (_req, res) => {
    let data = await storage.getScanConfig();
    if (!data) {
      data = await storage.upsertScanConfig({});
    }
    res.json(data);
  });

  app.put("/api/scan/config", async (req, res) => {
    const data = await storage.upsertScanConfig(req.body);
    res.json(data);
  });

  app.post("/api/scan/trigger", async (req, res) => {
    const config = await storage.getScanConfig();
    const opps = await storage.getOpportunities({});
    const history = await storage.createScanHistory({
      triggeredBy: "manual",
      parameters: config || {},
      resultsCount: opps.length,
    });
    res.json({ message: "Scan triggered successfully", history });
  });

  app.get("/api/scan/history", async (_req, res) => {
    const data = await storage.getScanHistory();
    res.json(data);
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

  // ─── HR Conversations (must be before /api/hr/:id) ──
  app.get("/api/hr/conversations", async (_req, res) => {
    const data = await storage.getHrConversations();
    res.json(data);
  });

  app.get("/api/hr/conversations/:id", async (req, res) => {
    const data = await storage.getHrConversation(parseInt(req.params.id));
    if (!data) return res.status(404).json({ message: "Not found" });
    res.json(data);
  });

  app.post("/api/hr/conversations", async (req, res) => {
    try {
      const parsed = insertHrConversationSchema.parse(req.body);
      const data = await storage.createHrConversation(parsed);
      res.status(201).json(data);
    } catch (e) { handleZodError(res, e); }
  });

  app.patch("/api/hr/conversations/:id", async (req, res) => {
    const data = await storage.updateHrConversation(parseInt(req.params.id), req.body);
    if (!data) return res.status(404).json({ message: "Not found" });
    res.json(data);
  });

  app.post("/api/hr/conversations/:id/save-case", async (req, res) => {
    const conv = await storage.getHrConversation(parseInt(req.params.id));
    if (!conv) return res.status(404).json({ message: "Not found" });
    const hrCase = await storage.createHrCase({
      caseType: conv.caseType || "General Query",
      description: conv.title || "HR case from conversation",
      riskLevel: conv.riskLevel || "medium",
    });
    res.status(201).json(hrCase);
  });

  // ─── HR Cases ──────────────────────────────
  app.get("/api/hr", async (_req, res) => {
    const data = await storage.getHrCases();
    res.json(data);
  });

  app.get("/api/hr/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid id" });
    const data = await storage.getHrCase(id);
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
