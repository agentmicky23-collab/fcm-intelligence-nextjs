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

// ═══════════════════════════════════════════════════════════════
// INTER-MISSION — The Post Office People Network
// ═══════════════════════════════════════════════════════════════

export const imProfiles = pgTable("im_profiles", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  displayName: text("display_name"),
  userType: text("user_type").notNull(),
  phone: text("phone"),
  photoUrl: text("photo_url"),
  bio: text("bio"),
  horizonId: text("horizon_id"),
  fadCode: text("fad_code"),
  branchName: text("branch_name"),
  locationPostcode: text("location_postcode"),
  locationLat: decimal("location_lat"),
  locationLng: decimal("location_lng"),
  travelRadius: integer("travel_radius").default(25),
  dailyRate: decimal("daily_rate"),
  hourlyRate: decimal("hourly_rate"),
  yearsExperience: integer("years_experience"),
  expertiseTracks: jsonb("expertise_tracks").default([]),
  skills: jsonb("skills").default([]),
  lookingFor: text("looking_for"),
  verificationStatus: text("verification_status").default("unvetted"),
  stealthMode: boolean("stealth_mode").default(false),
  notificationUrgent: boolean("notification_urgent").default(true),
  referralCode: text("referral_code").unique(),
  referredBy: text("referred_by"),
  referralCount: integer("referral_count").default(0),
  totalEarnings: decimal("total_earnings").default("0"),
  assignmentsCompleted: integer("assignments_completed").default(0),
  averageRating: decimal("average_rating").default("0"),
  reviewCount: integer("review_count").default(0),
  blockedAt: timestamp("blocked_at"),
  blockedReason: text("blocked_reason"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertImProfileSchema = createInsertSchema(imProfiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertImProfile = z.infer<typeof insertImProfileSchema>;
export type ImProfile = typeof imProfiles.$inferSelect;

export const imAvailability = pgTable("im_availability", {
  id: serial("id").primaryKey(),
  profileId: integer("profile_id").notNull(),
  date: date("date").notNull(),
  status: text("status").default("available"),
  assignmentId: integer("assignment_id"),
});

export const insertImAvailabilitySchema = createInsertSchema(imAvailability).omit({
  id: true,
});
export type InsertImAvailability = z.infer<typeof insertImAvailabilitySchema>;
export type ImAvailability = typeof imAvailability.$inferSelect;

export const imAssignments = pgTable("im_assignments", {
  id: serial("id").primaryKey(),
  operatorId: integer("operator_id").notNull(),
  title: text("title").notNull(),
  expertiseTrack: text("expertise_track").notNull(),
  description: text("description"),
  locationPostcode: text("location_postcode").notNull(),
  locationLat: decimal("location_lat"),
  locationLng: decimal("location_lng"),
  branchName: text("branch_name"),
  fadCode: text("fad_code"),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  dailyBudget: decimal("daily_budget"),
  urgency: text("urgency").default("standard"),
  durationType: text("duration_type"),
  accommodationAvailable: boolean("accommodation_available").default(false),
  requiredSkills: jsonb("required_skills").default([]),
  status: text("status").default("open"),
  matchedManagerId: integer("matched_manager_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertImAssignmentSchema = createInsertSchema(imAssignments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertImAssignment = z.infer<typeof insertImAssignmentSchema>;
export type ImAssignment = typeof imAssignments.$inferSelect;

export const imProposals = pgTable("im_proposals", {
  id: serial("id").primaryKey(),
  assignmentId: integer("assignment_id").notNull(),
  managerId: integer("manager_id").notNull(),
  proposedRate: decimal("proposed_rate").notNull(),
  message: text("message"),
  status: text("status").default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertImProposalSchema = createInsertSchema(imProposals).omit({
  id: true,
  createdAt: true,
});
export type InsertImProposal = z.infer<typeof insertImProposalSchema>;
export type ImProposal = typeof imProposals.$inferSelect;

export const imReviews = pgTable("im_reviews", {
  id: serial("id").primaryKey(),
  assignmentId: integer("assignment_id").notNull(),
  reviewerId: integer("reviewer_id").notNull(),
  revieweeId: integer("reviewee_id").notNull(),
  reviewerType: text("reviewer_type").notNull(),
  reliabilityScore: integer("reliability_score"),
  competenceScore: integer("competence_score"),
  professionalismScore: integer("professionalism_score"),
  communicationScore: integer("communication_score"),
  wouldWorkAgain: boolean("would_work_again"),
  writtenReview: text("written_review"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertImReviewSchema = createInsertSchema(imReviews).omit({
  id: true,
  createdAt: true,
});
export type InsertImReview = z.infer<typeof insertImReviewSchema>;
export type ImReview = typeof imReviews.$inferSelect;

export const imEarnings = pgTable("im_earnings", {
  id: serial("id").primaryKey(),
  managerId: integer("manager_id").notNull(),
  assignmentId: integer("assignment_id").notNull(),
  amount: decimal("amount").notNull(),
  daysWorked: integer("days_worked").notNull(),
  dailyRate: decimal("daily_rate").notNull(),
  loggedAt: timestamp("logged_at").defaultNow(),
});

export const insertImEarningSchema = createInsertSchema(imEarnings).omit({
  id: true,
  loggedAt: true,
});
export type InsertImEarning = z.infer<typeof insertImEarningSchema>;
export type ImEarning = typeof imEarnings.$inferSelect;

export const imVettingQueue = pgTable("im_vetting_queue", {
  id: serial("id").primaryKey(),
  profileId: integer("profile_id").notNull(),
  priority: boolean("priority").default(false),
  stripePaymentId: text("stripe_payment_id"),
  submittedAt: timestamp("submitted_at").defaultNow(),
  vettedAt: timestamp("vetted_at"),
  vettedBy: text("vetted_by"),
  status: text("status").default("pending"),
});

export const insertImVettingQueueSchema = createInsertSchema(imVettingQueue).omit({
  id: true,
  submittedAt: true,
});
export type InsertImVettingQueue = z.infer<typeof insertImVettingQueueSchema>;
export type ImVettingQueue = typeof imVettingQueue.$inferSelect;

export const imSavedManagers = pgTable("im_saved_managers", {
  id: serial("id").primaryKey(),
  operatorId: integer("operator_id").notNull(),
  managerId: integer("manager_id").notNull(),
  notes: text("notes"),
  timesBooked: integer("times_booked").default(1),
  lastBookedAt: timestamp("last_booked_at"),
  createdAt: timestamp("created_at").defaultNow(),
})

export const insertImSavedManagerSchema = createInsertSchema(imSavedManagers).omit({
  id: true,
  createdAt: true,
});
export type InsertImSavedManager = z.infer<typeof insertImSavedManagerSchema>;
export type ImSavedManager = typeof imSavedManagers.$inferSelect;

export const imFavorites = pgTable("im_favorites", {
  id: serial("id").primaryKey(),
  profileId: integer("profile_id").notNull(),
  targetType: text("target_type").notNull(),
  targetId: integer("target_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertImFavoriteSchema = createInsertSchema(imFavorites).omit({
  id: true,
  createdAt: true,
});
export type InsertImFavorite = z.infer<typeof insertImFavoriteSchema>;
export type ImFavorite = typeof imFavorites.$inferSelect;
