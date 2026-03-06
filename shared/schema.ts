import { sql } from "drizzle-orm";
import { pgTable, text, varchar, serial, integer, decimal, boolean, timestamp, date, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// ─── Opportunities ──────────────────────────────────
export const opportunities = pgTable("opportunities", {
  id: text("id").primaryKey(),
  businessName: text("business_name").notNull(),
  businessType: text("business_type").notNull(),
  location: text("location"),
  region: text("region"),
  annualFees: decimal("annual_fees"),
  sessionsPerMonth: integer("sessions_per_month"),
  askingPrice: decimal("asking_price"),
  weeklyTurnover: decimal("weekly_turnover"),
  yearlyTurnover: decimal("yearly_turnover"),
  score: integer("score"),
  confidence: text("confidence"),
  status: text("status").default("new"),
  source: text("source"),
  sourceUrl: text("source_url"),
  notes: text("notes"),
  insiderVisible: boolean("insider_visible").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertOpportunitySchema = createInsertSchema(opportunities).omit({
  createdAt: true,
  updatedAt: true,
});
export type InsertOpportunity = z.infer<typeof insertOpportunitySchema>;
export type Opportunity = typeof opportunities.$inferSelect;

// ─── Content ────────────────────────────────────────
export const content = pgTable("content", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  body: text("body"),
  contentType: text("content_type").notNull(),
  track: text("track"),
  author: text("author").default("Henry"),
  rexScore: integer("rex_score"),
  rexVerdict: text("rex_verdict"),
  status: text("status").default("draft"),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow(),
  platformVersions: jsonb("platform_versions").default({}),
  tone: text("tone").default("operator"),
  style: text("style").default("operator_to_operator"),
  keyMessage: text("key_message"),
  scheduledDate: date("scheduled_date"),
  scheduledPlatforms: jsonb("scheduled_platforms").default([]),
});

export const insertContentSchema = createInsertSchema(content).omit({
  id: true,
  createdAt: true,
});
export type InsertContent = z.infer<typeof insertContentSchema>;
export type Content = typeof content.$inferSelect;

// ─── Agent Health ───────────────────────────────────
export const agentHealth = pgTable("agent_health", {
  id: serial("id").primaryKey(),
  agentName: text("agent_name").notNull(),
  status: text("status").notNull(),
  lastOutput: timestamp("last_output"),
  hoursSinceOutput: decimal("hours_since_output"),
  checkedAt: timestamp("checked_at").defaultNow(),
});

export const insertAgentHealthSchema = createInsertSchema(agentHealth).omit({
  id: true,
  checkedAt: true,
});
export type InsertAgentHealth = z.infer<typeof insertAgentHealthSchema>;
export type AgentHealth = typeof agentHealth.$inferSelect;

// ─── Agent Activity ─────────────────────────────────
export const agentActivity = pgTable("agent_activity", {
  id: serial("id").primaryKey(),
  agentName: text("agent_name").notNull(),
  actionType: text("action_type").notNull(),
  description: text("description").notNull(),
  targetAgent: text("target_agent"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertAgentActivitySchema = createInsertSchema(agentActivity).omit({
  id: true,
  createdAt: true,
});
export type InsertAgentActivity = z.infer<typeof insertAgentActivitySchema>;
export type AgentActivity = typeof agentActivity.$inferSelect;

// ─── Scan Config ────────────────────────────────────
export const scanConfig = pgTable("scan_config", {
  id: serial("id").primaryKey(),
  name: text("name").default("default"),
  minAnnualFees: decimal("min_annual_fees").default("50000"),
  minSessions: integer("min_sessions").default(1000),
  maxAskingPrice: decimal("max_asking_price").default("500000"),
  minWeeklyTurnover: decimal("min_weekly_turnover").default("0"),
  businessTypes: jsonb("business_types").default(["post_office", "forecourt", "convenience_store"]),
  regions: jsonb("regions").default([]),
  sources: jsonb("sources").default([]),
  feeWeight: decimal("fee_weight").default("1.0"),
  sessionsWeight: decimal("sessions_weight").default("1.0"),
  locationWeight: decimal("location_weight").default("1.0"),
  typeWeight: decimal("type_weight").default("1.0"),
  priceWeight: decimal("price_weight").default("1.0"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertScanConfigSchema = createInsertSchema(scanConfig).omit({
  id: true,
  updatedAt: true,
});
export type InsertScanConfig = z.infer<typeof insertScanConfigSchema>;
export type ScanConfig = typeof scanConfig.$inferSelect;

// ─── Scan History ───────────────────────────────────
export const scanHistory = pgTable("scan_history", {
  id: serial("id").primaryKey(),
  triggeredBy: text("triggered_by").default("manual"),
  parameters: jsonb("parameters"),
  resultsCount: integer("results_count"),
  completedAt: timestamp("completed_at").defaultNow(),
});

export const insertScanHistorySchema = createInsertSchema(scanHistory).omit({
  id: true,
  completedAt: true,
});
export type InsertScanHistory = z.infer<typeof insertScanHistorySchema>;
export type ScanHistory = typeof scanHistory.$inferSelect;

// ─── HR Conversations ──────────────────────────────
export const hrConversations = pgTable("hr_conversations", {
  id: serial("id").primaryKey(),
  title: text("title"),
  caseType: text("case_type"),
  riskLevel: text("risk_level"),
  status: text("status").default("open"),
  messages: jsonb("messages").default([]),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertHrConversationSchema = createInsertSchema(hrConversations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertHrConversation = z.infer<typeof insertHrConversationSchema>;
export type HrConversation = typeof hrConversations.$inferSelect;

// ─── Cost Records ───────────────────────────────────
export const costRecords = pgTable("cost_records", {
  id: serial("id").primaryKey(),
  date: date("date").notNull(),
  totalCost: decimal("total_cost").notNull(),
  sonnetCost: decimal("sonnet_cost").default("0"),
  haikuCost: decimal("haiku_cost").default("0"),
  geminiCost: decimal("gemini_cost").default("0"),
  opusCost: decimal("opus_cost").default("0"),
  mainAgentCost: decimal("main_agent_cost").default("0"),
  henryCost: decimal("henry_cost").default("0"),
  claudiaCost: decimal("claudia_cost").default("0"),
  harperCost: decimal("harper_cost").default("0"),
  rexCost: decimal("rex_cost").default("0"),
  sentinelCost: decimal("sentinel_cost").default("0"),
  watchtowerCost: decimal("watchtower_cost").default("0"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertCostRecordSchema = createInsertSchema(costRecords).omit({
  id: true,
  createdAt: true,
});
export type InsertCostRecord = z.infer<typeof insertCostRecordSchema>;
export type CostRecord = typeof costRecords.$inferSelect;

// ─── HR Cases ───────────────────────────────────────
export const hrCases = pgTable("hr_cases", {
  id: serial("id").primaryKey(),
  caseType: text("case_type").notNull(),
  description: text("description"),
  riskLevel: text("risk_level"),
  guidance: text("guidance"),
  outcome: text("outcome"),
  createdAt: timestamp("created_at").defaultNow(),
  resolvedAt: timestamp("resolved_at"),
});

export const insertHrCaseSchema = createInsertSchema(hrCases).omit({
  id: true,
  createdAt: true,
});
export type InsertHrCase = z.infer<typeof insertHrCaseSchema>;
export type HrCase = typeof hrCases.$inferSelect;

// ─── Feedback Log ───────────────────────────────────
export const feedbackLog = pgTable("feedback_log", {
  id: serial("id").primaryKey(),
  feedbackType: text("feedback_type").notNull(),
  signal: text("signal").notNull(),
  agent: text("agent"),
  details: jsonb("details"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertFeedbackLogSchema = createInsertSchema(feedbackLog).omit({
  id: true,
  createdAt: true,
});
export type InsertFeedbackLog = z.infer<typeof insertFeedbackLogSchema>;
export type FeedbackLog = typeof feedbackLog.$inferSelect;

// ─── Contact Submissions ────────────────────────────
export const contactSubmissions = pgTable("contact_submissions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  message: text("message").notNull(),
  reportPackage: text("report_package"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertContactSubmissionSchema = createInsertSchema(contactSubmissions).omit({
  id: true,
  createdAt: true,
});
export type InsertContactSubmission = z.infer<typeof insertContactSubmissionSchema>;
export type ContactSubmission = typeof contactSubmissions.$inferSelect;
