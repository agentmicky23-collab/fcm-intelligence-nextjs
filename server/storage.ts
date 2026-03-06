import { db } from "./db";
import { eq, desc, and, gte, lte, sql } from "drizzle-orm";
import {
  opportunities, content, agentHealth, costRecords, hrCases, feedbackLog, contactSubmissions,
  type InsertOpportunity, type Opportunity,
  type InsertContent, type Content,
  type InsertAgentHealth, type AgentHealth,
  type InsertCostRecord, type CostRecord,
  type InsertHrCase, type HrCase,
  type InsertFeedbackLog, type FeedbackLog,
  type InsertContactSubmission, type ContactSubmission,
} from "@shared/schema";

export interface IStorage {
  // Opportunities
  getOpportunities(filters?: { status?: string; businessType?: string; region?: string }): Promise<Opportunity[]>;
  getOpportunity(id: string): Promise<Opportunity | undefined>;
  createOpportunity(data: InsertOpportunity): Promise<Opportunity>;
  updateOpportunity(id: string, data: Partial<InsertOpportunity>): Promise<Opportunity | undefined>;
  getInsiderOpportunities(): Promise<Opportunity[]>;

  // Content
  getContent(filters?: { status?: string; track?: string }): Promise<Content[]>;
  getContentById(id: number): Promise<Content | undefined>;
  createContent(data: InsertContent): Promise<Content>;
  updateContent(id: number, data: Partial<InsertContent>): Promise<Content | undefined>;
  getPublishedContent(track?: string): Promise<Content[]>;

  // Agent Health
  getAgentHealth(): Promise<AgentHealth[]>;
  upsertAgentHealth(data: InsertAgentHealth): Promise<AgentHealth>;

  // Cost Records
  getCostRecords(days?: number): Promise<CostRecord[]>;
  createCostRecord(data: InsertCostRecord): Promise<CostRecord>;
  getCostSummary(): Promise<{ today: string; week: string; projected: string }>;

  // HR Cases
  getHrCases(): Promise<HrCase[]>;
  getHrCase(id: number): Promise<HrCase | undefined>;
  createHrCase(data: InsertHrCase): Promise<HrCase>;
  updateHrCase(id: number, data: Partial<InsertHrCase>): Promise<HrCase | undefined>;

  // Feedback
  createFeedback(data: InsertFeedbackLog): Promise<FeedbackLog>;

  // Contact
  createContactSubmission(data: InsertContactSubmission): Promise<ContactSubmission>;

  // Dashboard
  getDashboardSummary(): Promise<{
    pipelineCounts: Record<string, number>;
    contentCounts: Record<string, number>;
    costToday: string;
    costWeek: string;
    costProjected: string;
  }>;
}

export class DatabaseStorage implements IStorage {
  // ─── Opportunities ─────────────────────────
  async getOpportunities(filters?: { status?: string; businessType?: string; region?: string }): Promise<Opportunity[]> {
    const conditions = [];
    if (filters?.status) conditions.push(eq(opportunities.status, filters.status));
    if (filters?.businessType) conditions.push(eq(opportunities.businessType, filters.businessType));
    if (filters?.region) conditions.push(eq(opportunities.region, filters.region));

    if (conditions.length > 0) {
      return db.select().from(opportunities).where(and(...conditions)).orderBy(desc(opportunities.createdAt));
    }
    return db.select().from(opportunities).orderBy(desc(opportunities.createdAt));
  }

  async getOpportunity(id: string): Promise<Opportunity | undefined> {
    const [row] = await db.select().from(opportunities).where(eq(opportunities.id, id));
    return row;
  }

  async createOpportunity(data: InsertOpportunity): Promise<Opportunity> {
    const [row] = await db.insert(opportunities).values(data).returning();
    return row;
  }

  async updateOpportunity(id: string, data: Partial<InsertOpportunity>): Promise<Opportunity | undefined> {
    const [row] = await db.update(opportunities).set({ ...data, updatedAt: new Date() }).where(eq(opportunities.id, id)).returning();
    return row;
  }

  async getInsiderOpportunities(): Promise<Opportunity[]> {
    return db.select().from(opportunities).where(eq(opportunities.insiderVisible, true)).orderBy(desc(opportunities.createdAt));
  }

  // ─── Content ───────────────────────────────
  async getContent(filters?: { status?: string; track?: string }): Promise<Content[]> {
    const conditions = [];
    if (filters?.status) conditions.push(eq(content.status, filters.status));
    if (filters?.track) conditions.push(eq(content.track, filters.track));

    if (conditions.length > 0) {
      return db.select().from(content).where(and(...conditions)).orderBy(desc(content.createdAt));
    }
    return db.select().from(content).orderBy(desc(content.createdAt));
  }

  async getContentById(id: number): Promise<Content | undefined> {
    const [row] = await db.select().from(content).where(eq(content.id, id));
    return row;
  }

  async createContent(data: InsertContent): Promise<Content> {
    const [row] = await db.insert(content).values(data).returning();
    return row;
  }

  async updateContent(id: number, data: Partial<InsertContent>): Promise<Content | undefined> {
    const [row] = await db.update(content).set(data).where(eq(content.id, id)).returning();
    return row;
  }

  async getPublishedContent(track?: string): Promise<Content[]> {
    const conditions = [eq(content.status, "published")];
    if (track) conditions.push(eq(content.track, track));
    return db.select().from(content).where(and(...conditions)).orderBy(desc(content.publishedAt));
  }

  // ─── Agent Health ──────────────────────────
  async getAgentHealth(): Promise<AgentHealth[]> {
    return db.select().from(agentHealth).orderBy(agentHealth.agentName);
  }

  async upsertAgentHealth(data: InsertAgentHealth): Promise<AgentHealth> {
    const existing = await db.select().from(agentHealth).where(eq(agentHealth.agentName, data.agentName));
    if (existing.length > 0) {
      const [row] = await db.update(agentHealth)
        .set({ ...data, checkedAt: new Date() })
        .where(eq(agentHealth.agentName, data.agentName))
        .returning();
      return row;
    }
    const [row] = await db.insert(agentHealth).values(data).returning();
    return row;
  }

  // ─── Cost Records ─────────────────────────
  async getCostRecords(days: number = 30): Promise<CostRecord[]> {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    return db.select().from(costRecords)
      .where(gte(costRecords.date, cutoff.toISOString().split("T")[0]))
      .orderBy(desc(costRecords.date));
  }

  async createCostRecord(data: InsertCostRecord): Promise<CostRecord> {
    const [row] = await db.insert(costRecords).values(data).returning();
    return row;
  }

  async getCostSummary(): Promise<{ today: string; week: string; projected: string }> {
    const today = new Date().toISOString().split("T")[0];
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const [todayResult] = await db.select({ total: sql<string>`COALESCE(SUM(total_cost), 0)` })
      .from(costRecords).where(eq(costRecords.date, today));

    const [weekResult] = await db.select({ total: sql<string>`COALESCE(SUM(total_cost), 0)` })
      .from(costRecords).where(gte(costRecords.date, weekAgo.toISOString().split("T")[0]));

    const dailyAvg = parseFloat(weekResult?.total || "0") / 7;
    const projected = (dailyAvg * 30).toFixed(2);

    return {
      today: parseFloat(todayResult?.total || "0").toFixed(2),
      week: parseFloat(weekResult?.total || "0").toFixed(2),
      projected,
    };
  }

  // ─── HR Cases ──────────────────────────────
  async getHrCases(): Promise<HrCase[]> {
    return db.select().from(hrCases).orderBy(desc(hrCases.createdAt));
  }

  async getHrCase(id: number): Promise<HrCase | undefined> {
    const [row] = await db.select().from(hrCases).where(eq(hrCases.id, id));
    return row;
  }

  async createHrCase(data: InsertHrCase): Promise<HrCase> {
    const [row] = await db.insert(hrCases).values(data).returning();
    return row;
  }

  async updateHrCase(id: number, data: Partial<InsertHrCase>): Promise<HrCase | undefined> {
    const [row] = await db.update(hrCases).set(data).where(eq(hrCases.id, id)).returning();
    return row;
  }

  // ─── Feedback ──────────────────────────────
  async createFeedback(data: InsertFeedbackLog): Promise<FeedbackLog> {
    const [row] = await db.insert(feedbackLog).values(data).returning();
    return row;
  }

  // ─── Contact ───────────────────────────────
  async createContactSubmission(data: InsertContactSubmission): Promise<ContactSubmission> {
    const [row] = await db.insert(contactSubmissions).values(data).returning();
    return row;
  }

  // ─── Dashboard ─────────────────────────────
  async getDashboardSummary() {
    const oppRows = await db.select({ status: opportunities.status, count: sql<number>`count(*)::int` })
      .from(opportunities).groupBy(opportunities.status);

    const pipelineCounts: Record<string, number> = { new: 0, watch: 0, pursue: 0, closed: 0, dismissed: 0 };
    for (const r of oppRows) {
      if (r.status) pipelineCounts[r.status] = r.count;
    }

    const contentRows = await db.select({ status: content.status, count: sql<number>`count(*)::int` })
      .from(content).groupBy(content.status);

    const contentCounts: Record<string, number> = { draft: 0, review: 0, approval: 0, published: 0 };
    for (const r of contentRows) {
      if (r.status) contentCounts[r.status] = r.count;
    }

    const costs = await this.getCostSummary();

    return {
      pipelineCounts,
      contentCounts,
      costToday: costs.today,
      costWeek: costs.week,
      costProjected: costs.projected,
    };
  }
}

export const storage = new DatabaseStorage();
