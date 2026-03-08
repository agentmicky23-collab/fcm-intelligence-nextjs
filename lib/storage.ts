import { db } from "./db";
import { eq, desc, asc, and, gte, lte, sql, ilike, or, ne } from "drizzle-orm";
import {
  opportunities, content, agentHealth, agentActivity, scanConfig, scanHistory,
  hrConversations, costRecords, hrCases, feedbackLog, contactSubmissions,
  imProfiles, imAvailability, imAssignments, imProposals, imReviews,
  imEarnings, imVettingQueue, imSavedManagers,
  type InsertOpportunity, type Opportunity,
  type InsertContent, type Content,
  type InsertAgentHealth, type AgentHealth,
  type InsertAgentActivity, type AgentActivity,
  type InsertScanConfig, type ScanConfig,
  type InsertScanHistory, type ScanHistory,
  type InsertHrConversation, type HrConversation,
  type InsertCostRecord, type CostRecord,
  type InsertHrCase, type HrCase,
  type InsertFeedbackLog, type FeedbackLog,
  type InsertContactSubmission, type ContactSubmission,
  type InsertImProfile, type ImProfile,
  type InsertImAvailability, type ImAvailability,
  type InsertImAssignment, type ImAssignment,
  type InsertImProposal, type ImProposal,
  type InsertImReview, type ImReview,
  type InsertImEarning, type ImEarning,
  type InsertImVettingQueue, type ImVettingQueue,
  type InsertImSavedManager, type ImSavedManager,
} from "@/shared/schema";

export class DatabaseStorage {
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

  async getAgentActivities(limit: number = 50): Promise<AgentActivity[]> {
    return db.select().from(agentActivity).orderBy(desc(agentActivity.createdAt)).limit(limit);
  }

  async createAgentActivity(data: InsertAgentActivity): Promise<AgentActivity> {
    const [row] = await db.insert(agentActivity).values(data).returning();
    return row;
  }

  async getAgentDetail(name: string): Promise<{ health: AgentHealth | undefined; activities: AgentActivity[] }> {
    const [health] = await db.select().from(agentHealth).where(eq(agentHealth.agentName, name));
    const activities = await db.select().from(agentActivity)
      .where(eq(agentActivity.agentName, name))
      .orderBy(desc(agentActivity.createdAt))
      .limit(20);
    return { health, activities };
  }

  async getScanConfig(): Promise<ScanConfig | undefined> {
    const [row] = await db.select().from(scanConfig).where(eq(scanConfig.name, "default"));
    return row;
  }

  async upsertScanConfig(data: Partial<InsertScanConfig>): Promise<ScanConfig> {
    const existing = await this.getScanConfig();
    if (existing) {
      const [row] = await db.update(scanConfig)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(scanConfig.id, existing.id))
        .returning();
      return row;
    }
    const [row] = await db.insert(scanConfig).values({ ...data, name: "default" }).returning();
    return row;
  }

  async getScanHistory(): Promise<ScanHistory[]> {
    return db.select().from(scanHistory).orderBy(desc(scanHistory.completedAt)).limit(10);
  }

  async createScanHistory(data: InsertScanHistory): Promise<ScanHistory> {
    const [row] = await db.insert(scanHistory).values(data).returning();
    return row;
  }

  async getHrConversations(): Promise<HrConversation[]> {
    return db.select().from(hrConversations).orderBy(desc(hrConversations.updatedAt));
  }

  async getHrConversation(id: number): Promise<HrConversation | undefined> {
    const [row] = await db.select().from(hrConversations).where(eq(hrConversations.id, id));
    return row;
  }

  async createHrConversation(data: InsertHrConversation): Promise<HrConversation> {
    const [row] = await db.insert(hrConversations).values(data).returning();
    return row;
  }

  async updateHrConversation(id: number, data: Partial<InsertHrConversation>): Promise<HrConversation | undefined> {
    const [row] = await db.update(hrConversations)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(hrConversations.id, id))
      .returning();
    return row;
  }

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

  async createFeedback(data: InsertFeedbackLog): Promise<FeedbackLog> {
    const [row] = await db.insert(feedbackLog).values(data).returning();
    return row;
  }

  async createContactSubmission(data: InsertContactSubmission): Promise<ContactSubmission> {
    const [row] = await db.insert(contactSubmissions).values(data).returning();
    return row;
  }

  // ═══════════════════════════════════════════════════════════════
  // INTER-MISSION Storage Methods
  // ═══════════════════════════════════════════════════════════════

  async createImProfile(data: InsertImProfile): Promise<ImProfile> {
    const referralCode = `IM-${Date.now().toString(36).toUpperCase()}`;
    const [row] = await db.insert(imProfiles).values({ ...data, referralCode }).returning();
    return row;
  }

  async getImProfile(id: number): Promise<ImProfile | undefined> {
    const [row] = await db.select().from(imProfiles).where(eq(imProfiles.id, id));
    return row;
  }

  async getImProfileByEmail(email: string): Promise<ImProfile | undefined> {
    const [row] = await db.select().from(imProfiles).where(eq(imProfiles.email, email));
    return row;
  }

  async updateImProfile(id: number, data: Partial<InsertImProfile>): Promise<ImProfile | undefined> {
    const [row] = await db.update(imProfiles)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(imProfiles.id, id))
      .returning();
    return row;
  }

  async getImProfiles(filters?: { userType?: string; expertiseTrack?: string; verificationStatus?: string; search?: string; minRating?: number; minExperience?: number; sort?: string }): Promise<ImProfile[]> {
    const conditions = [];
    if (filters?.userType) conditions.push(eq(imProfiles.userType, filters.userType));
    if (filters?.expertiseTrack) conditions.push(sql`${imProfiles.expertiseTracks}::jsonb @> ${JSON.stringify([filters.expertiseTrack])}::jsonb`);
    if (filters?.verificationStatus) conditions.push(eq(imProfiles.verificationStatus, filters.verificationStatus));
    if (filters?.search) conditions.push(or(ilike(imProfiles.name, `%${filters.search}%`), ilike(imProfiles.locationPostcode, `%${filters.search}%`), ilike(imProfiles.branchName, `%${filters.search}%`)));
    if (filters?.minRating !== undefined && filters.minRating !== null) conditions.push(gte(imProfiles.averageRating, String(filters.minRating)));
    if (filters?.minExperience !== undefined && filters.minExperience !== null) conditions.push(gte(imProfiles.yearsExperience, filters.minExperience));
    conditions.push(ne(imProfiles.verificationStatus, "blocked"));

    let orderBy;
    switch (filters?.sort) {
      case "rating_high": orderBy = desc(imProfiles.averageRating); break;
      case "experience_high": orderBy = desc(imProfiles.yearsExperience); break;
      case "rate_low": orderBy = asc(imProfiles.dailyRate); break;
      case "rate_high": orderBy = desc(imProfiles.dailyRate); break;
      default: orderBy = desc(imProfiles.createdAt);
    }

    if (conditions.length > 0) {
      return db.select().from(imProfiles).where(and(...conditions)).orderBy(orderBy);
    }
    return db.select().from(imProfiles).orderBy(orderBy);
  }

  async createImAssignment(data: InsertImAssignment): Promise<ImAssignment> {
    const [row] = await db.insert(imAssignments).values(data).returning();
    return row;
  }

  async getImAssignment(id: number): Promise<ImAssignment | undefined> {
    const [row] = await db.select().from(imAssignments).where(eq(imAssignments.id, id));
    return row;
  }

  async getImAssignments(filters?: { expertiseTrack?: string; urgency?: string; status?: string; search?: string; durationType?: string; minBudget?: number; maxBudget?: number; sort?: string }): Promise<ImAssignment[]> {
    const conditions = [];
    if (filters?.expertiseTrack) conditions.push(eq(imAssignments.expertiseTrack, filters.expertiseTrack));
    if (filters?.urgency) conditions.push(eq(imAssignments.urgency, filters.urgency));
    if (filters?.status) conditions.push(eq(imAssignments.status, filters.status));
    if (filters?.durationType) conditions.push(eq(imAssignments.durationType, filters.durationType));
    if (filters?.search) conditions.push(or(ilike(imAssignments.title, `%${filters.search}%`), ilike(imAssignments.locationPostcode, `%${filters.search}%`), ilike(imAssignments.branchName, `%${filters.search}%`)));
    if (filters?.minBudget !== undefined && filters.minBudget !== null) conditions.push(gte(imAssignments.dailyBudget, String(filters.minBudget)));
    if (filters?.maxBudget !== undefined && filters.maxBudget !== null) conditions.push(lte(imAssignments.dailyBudget, String(filters.maxBudget)));

    let orderBy;
    switch (filters?.sort) {
      case "budget_high": orderBy = desc(imAssignments.dailyBudget); break;
      case "budget_low": orderBy = asc(imAssignments.dailyBudget); break;
      case "start_date": orderBy = asc(imAssignments.startDate); break;
      default: orderBy = desc(imAssignments.createdAt);
    }

    if (conditions.length > 0) {
      return db.select().from(imAssignments).where(and(...conditions)).orderBy(orderBy);
    }
    return db.select().from(imAssignments).orderBy(orderBy);
  }

  async updateImAssignment(id: number, data: Partial<InsertImAssignment>): Promise<ImAssignment | undefined> {
    const [row] = await db.update(imAssignments)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(imAssignments.id, id))
      .returning();
    return row;
  }

  async getImAssignmentsByOperator(operatorId: number): Promise<ImAssignment[]> {
    return db.select().from(imAssignments).where(eq(imAssignments.operatorId, operatorId)).orderBy(desc(imAssignments.createdAt));
  }

  async createImProposal(data: InsertImProposal): Promise<ImProposal> {
    const [row] = await db.insert(imProposals).values(data).returning();
    return row;
  }

  async getImProposalsByAssignment(assignmentId: number): Promise<ImProposal[]> {
    return db.select().from(imProposals).where(eq(imProposals.assignmentId, assignmentId)).orderBy(desc(imProposals.createdAt));
  }

  async getImProposalsByManager(managerId: number): Promise<ImProposal[]> {
    return db.select().from(imProposals).where(eq(imProposals.managerId, managerId)).orderBy(desc(imProposals.createdAt));
  }

  async updateImProposal(id: number, data: Partial<InsertImProposal>): Promise<ImProposal | undefined> {
    const [row] = await db.update(imProposals).set(data).where(eq(imProposals.id, id)).returning();
    return row;
  }

  async createImReview(data: InsertImReview): Promise<ImReview> {
    const [row] = await db.insert(imReviews).values(data).returning();
    const allReviews = await db.select().from(imReviews).where(eq(imReviews.revieweeId, data.revieweeId));
    const totalScores = allReviews.reduce((sum, r) => {
      const avg = ((r.reliabilityScore || 0) + (r.competenceScore || 0) + (r.professionalismScore || 0) + (r.communicationScore || 0)) / 4;
      return sum + avg;
    }, 0);
    const avgRating = (totalScores / allReviews.length).toFixed(2);
    await db.update(imProfiles).set({ averageRating: avgRating, reviewCount: allReviews.length }).where(eq(imProfiles.id, data.revieweeId));
    return row;
  }

  async getImReviewsByProfile(profileId: number): Promise<ImReview[]> {
    return db.select().from(imReviews).where(eq(imReviews.revieweeId, profileId)).orderBy(desc(imReviews.createdAt));
  }

  async getImReviewsByReviewer(reviewerId: number): Promise<ImReview[]> {
    return db.select().from(imReviews).where(eq(imReviews.reviewerId, reviewerId)).orderBy(desc(imReviews.createdAt));
  }

  async createImEarning(data: InsertImEarning): Promise<ImEarning> {
    const [row] = await db.insert(imEarnings).values(data).returning();
    const [totals] = await db.select({
      total: sql<string>`COALESCE(SUM(amount), 0)`,
      count: sql<number>`count(*)::int`,
    }).from(imEarnings).where(eq(imEarnings.managerId, data.managerId));
    await db.update(imProfiles).set({
      totalEarnings: totals.total,
      assignmentsCompleted: totals.count,
    }).where(eq(imProfiles.id, data.managerId));
    return row;
  }

  async getImEarnings(managerId: number): Promise<ImEarning[]> {
    return db.select().from(imEarnings).where(eq(imEarnings.managerId, managerId)).orderBy(desc(imEarnings.loggedAt));
  }

  async getImEarningsSummary(managerId: number) {
    const [totals] = await db.select({
      totalEarnings: sql<string>`COALESCE(SUM(amount), 0)`,
      totalAssignments: sql<number>`count(*)::int`,
      avgDailyRate: sql<string>`COALESCE(AVG(daily_rate), 0)`,
    }).from(imEarnings).where(eq(imEarnings.managerId, managerId));

    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);
    const [monthTotals] = await db.select({
      monthEarnings: sql<string>`COALESCE(SUM(amount), 0)`,
    }).from(imEarnings).where(and(eq(imEarnings.managerId, managerId), gte(imEarnings.loggedAt, monthStart)));

    const monthlyEarnings = await db.select({
      month: sql<string>`to_char(logged_at, 'YYYY-MM')`,
      total: sql<string>`SUM(amount)`,
    }).from(imEarnings)
      .where(eq(imEarnings.managerId, managerId))
      .groupBy(sql`to_char(logged_at, 'YYYY-MM')`)
      .orderBy(sql`to_char(logged_at, 'YYYY-MM')`);

    return {
      totalEarnings: totals.totalEarnings,
      totalAssignments: totals.totalAssignments,
      avgDailyRate: totals.avgDailyRate,
      monthEarnings: monthTotals.monthEarnings,
      monthlyChart: monthlyEarnings,
    };
  }

  async getImAvailability(profileId: number): Promise<ImAvailability[]> {
    return db.select().from(imAvailability).where(eq(imAvailability.profileId, profileId)).orderBy(imAvailability.date);
  }

  async setImAvailability(data: InsertImAvailability[]): Promise<void> {
    if (data.length === 0) return;
    for (const entry of data) {
      const existing = await db.select().from(imAvailability)
        .where(and(eq(imAvailability.profileId, entry.profileId), eq(imAvailability.date, entry.date)));
      if (existing.length > 0) {
        await db.update(imAvailability).set({ status: entry.status, assignmentId: entry.assignmentId })
          .where(eq(imAvailability.id, existing[0].id));
      } else {
        await db.insert(imAvailability).values(entry);
      }
    }
  }

  async createImVettingEntry(data: InsertImVettingQueue): Promise<ImVettingQueue> {
    const [row] = await db.insert(imVettingQueue).values(data).returning();
    if (data.priority) {
      await db.update(imProfiles).set({ verificationStatus: "priority_vetting" }).where(eq(imProfiles.id, data.profileId));
    }
    return row;
  }

  async getImVettingQueue(): Promise<ImVettingQueue[]> {
    return db.select().from(imVettingQueue).where(eq(imVettingQueue.status, "pending")).orderBy(desc(imVettingQueue.priority), imVettingQueue.submittedAt);
  }

  async approveImVetting(id: number, vettedBy: string): Promise<void> {
    const [entry] = await db.update(imVettingQueue)
      .set({ status: "approved", vettedAt: new Date(), vettedBy })
      .where(eq(imVettingQueue.id, id))
      .returning();
    if (entry) {
      await db.update(imProfiles).set({ verificationStatus: "vetted" }).where(eq(imProfiles.id, entry.profileId));
    }
  }

  async saveImManager(data: InsertImSavedManager): Promise<ImSavedManager> {
    const [row] = await db.insert(imSavedManagers).values(data).returning();
    return row;
  }

  async getImSavedManagers(operatorId: number): Promise<ImSavedManager[]> {
    return db.select().from(imSavedManagers).where(eq(imSavedManagers.operatorId, operatorId));
  }

  async getImStats() {
    const [profileCounts] = await db.select({
      totalManagers: sql<number>`count(*) FILTER (WHERE user_type = 'manager')::int`,
      totalOperators: sql<number>`count(*) FILTER (WHERE user_type = 'operator')::int`,
      totalEmployees: sql<number>`count(*) FILTER (WHERE user_type = 'employee')::int`,
      availableManagers: sql<number>`count(*) FILTER (WHERE user_type = 'manager' AND verification_status = 'vetted')::int`,
    }).from(imProfiles);

    const [assignmentCounts] = await db.select({
      openAssignments: sql<number>`count(*) FILTER (WHERE status = 'open')::int`,
      completedAssignments: sql<number>`count(*) FILTER (WHERE status = 'completed')::int`,
    }).from(imAssignments);

    const [earningsTotals] = await db.select({
      totalEarnings: sql<string>`COALESCE(SUM(amount), 0)`,
    }).from(imEarnings);

    return {
      totalManagers: profileCounts.totalManagers,
      totalOperators: profileCounts.totalOperators,
      totalEmployees: profileCounts.totalEmployees,
      availableManagers: profileCounts.availableManagers,
      openAssignments: assignmentCounts.openAssignments,
      completedAssignments: assignmentCounts.completedAssignments,
      totalEarnings: earningsTotals.totalEarnings,
    };
  }

  async getImMapData() {
    const managers = await db.select({
      id: imProfiles.id,
      name: imProfiles.name,
      locationPostcode: imProfiles.locationPostcode,
      locationLat: imProfiles.locationLat,
      locationLng: imProfiles.locationLng,
      expertiseTracks: imProfiles.expertiseTracks,
      verificationStatus: imProfiles.verificationStatus,
    }).from(imProfiles)
      .where(and(eq(imProfiles.userType, "manager"), ne(imProfiles.verificationStatus, "blocked")));

    const assignments = await db.select({
      id: imAssignments.id,
      title: imAssignments.title,
      locationPostcode: imAssignments.locationPostcode,
      locationLat: imAssignments.locationLat,
      locationLng: imAssignments.locationLng,
      expertiseTrack: imAssignments.expertiseTrack,
      status: imAssignments.status,
    }).from(imAssignments)
      .where(eq(imAssignments.status, "open"));

    return { managers, assignments };
  }

  async getImActivityFeed(limit: number = 15) {
    const recentAssignments = await db.select().from(imAssignments).orderBy(desc(imAssignments.createdAt)).limit(limit);
    const recentReviews = await db.select().from(imReviews).orderBy(desc(imReviews.createdAt)).limit(5);
    const recentProfiles = await db.select({
      id: imProfiles.id,
      name: imProfiles.name,
      userType: imProfiles.userType,
      expertiseTracks: imProfiles.expertiseTracks,
      locationPostcode: imProfiles.locationPostcode,
      createdAt: imProfiles.createdAt,
    }).from(imProfiles).orderBy(desc(imProfiles.createdAt)).limit(5);

    return { recentAssignments, recentReviews, recentProfiles };
  }

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
