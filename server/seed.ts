import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "../shared/schema";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool, { schema });

async function seed() {
  console.log("Seeding database...");

  await db.delete(schema.feedbackLog);
  await db.delete(schema.costRecords);
  await db.delete(schema.hrCases);
  await db.delete(schema.agentHealth);
  await db.delete(schema.agentActivity);
  await db.delete(schema.scanHistory);
  await db.delete(schema.scanConfig);
  await db.delete(schema.hrConversations);
  await db.delete(schema.content);
  await db.delete(schema.opportunities);
  await db.delete(schema.contactSubmissions);

  // ─── Opportunities ─────────────────────────
  await db.insert(schema.opportunities).values([
    {
      id: "OPP-2026-0301-001",
      businessName: "High-Footfall Mains Branch",
      businessType: "post_office",
      location: "Solihull, West Midlands",
      region: "West Midlands",
      annualFees: "85000",
      sessionsPerMonth: 220,
      askingPrice: "165000",
      weeklyTurnover: "8100",
      yearlyTurnover: "420000",
      score: 92,
      confidence: "HIGH",
      status: "new",
      source: "RightBiz",
      notes: "Excellent secondary retail space (convenience). Secure lease. Strong local monopoly.",
      insiderVisible: true,
    },
    {
      id: "OPP-2026-0301-002",
      businessName: "Prime A-Road Forecourt",
      businessType: "forecourt",
      location: "Harrogate, Yorkshire",
      region: "Yorkshire",
      annualFees: "0",
      sessionsPerMonth: 0,
      askingPrice: "850000",
      weeklyTurnover: "24000",
      yearlyTurnover: "1250000",
      score: 88,
      confidence: "HIGH",
      status: "new",
      source: "Daltons",
      notes: "Independent fuel supply. High margin shop sales. Scope for hot food expansion.",
      insiderVisible: true,
    },
    {
      id: "OPP-2026-0228-003",
      businessName: "Village Post Office & Store",
      businessType: "post_office",
      location: "Cotswolds, Gloucestershire",
      region: "South West",
      annualFees: "42000",
      sessionsPerMonth: 140,
      askingPrice: "95000",
      weeklyTurnover: "4200",
      yearlyTurnover: "218000",
      score: 74,
      confidence: "MODERATE",
      status: "watch",
      source: "RightBiz",
      notes: "Charming location but limited growth potential. Good lifestyle business.",
      insiderVisible: true,
    },
    {
      id: "OPP-2026-0225-004",
      businessName: "Town Centre Convenience",
      businessType: "convenience_store",
      location: "Nottingham, East Midlands",
      region: "East Midlands",
      annualFees: "0",
      sessionsPerMonth: 0,
      askingPrice: "120000",
      weeklyTurnover: "9500",
      yearlyTurnover: "495000",
      score: 81,
      confidence: "HIGH",
      status: "pursue",
      source: "Christie & Co",
      notes: "High footfall town centre location. Currently underperforming, strong turnaround potential.",
      insiderVisible: true,
    },
    {
      id: "OPP-2026-0220-005",
      businessName: "Suburban Local with PO Counter",
      businessType: "post_office",
      location: "Edgbaston, Birmingham",
      region: "West Midlands",
      annualFees: "55000",
      sessionsPerMonth: 180,
      askingPrice: "140000",
      weeklyTurnover: "6200",
      yearlyTurnover: "322000",
      score: 85,
      confidence: "HIGH",
      status: "new",
      source: "RightBiz",
      notes: "Affluent suburban catchment. Loyal customer base. Scope for parcel hub.",
      insiderVisible: true,
    },
    {
      id: "OPP-2026-0215-006",
      businessName: "Dual-Site Newsagent Package",
      businessType: "newsagent",
      location: "Coventry",
      region: "West Midlands",
      annualFees: "0",
      sessionsPerMonth: 0,
      askingPrice: "75000",
      weeklyTurnover: "5100",
      yearlyTurnover: "265000",
      score: 62,
      confidence: "SPECULATIVE",
      status: "watch",
      source: "Daltons",
      notes: "Two sites sold together. Staff issues reported. Needs investigation.",
      insiderVisible: false,
    },
    {
      id: "OPP-2026-0210-007",
      businessName: "Motorway Services Forecourt",
      businessType: "forecourt",
      location: "Junction 15, M6",
      region: "West Midlands",
      annualFees: "0",
      sessionsPerMonth: 0,
      askingPrice: "1250000",
      weeklyTurnover: "45000",
      yearlyTurnover: "2340000",
      score: 78,
      confidence: "MODERATE",
      status: "watch",
      source: "Christie & Co",
      notes: "Large investment. Environmental compliance review pending. High volume.",
      insiderVisible: true,
    },
    {
      id: "OPP-2026-0205-008",
      businessName: "Crown Conversion - Erdington",
      businessType: "post_office",
      location: "Erdington, Birmingham",
      region: "West Midlands",
      annualFees: "110000",
      sessionsPerMonth: 340,
      askingPrice: "0",
      weeklyTurnover: "0",
      yearlyTurnover: "0",
      score: 95,
      confidence: "HIGH",
      status: "pursue",
      source: "Post Office Ltd",
      notes: "Crown conversion opportunity. Premium PO fees. Requires full management capability.",
      insiderVisible: true,
    },
    {
      id: "OPP-2026-0130-009",
      businessName: "Seaside Town Post Office",
      businessType: "post_office",
      location: "Whitby, North Yorkshire",
      region: "Yorkshire",
      annualFees: "38000",
      sessionsPerMonth: 110,
      askingPrice: "70000",
      weeklyTurnover: "3800",
      yearlyTurnover: "198000",
      score: 58,
      confidence: "FLAG",
      status: "dismissed",
      source: "RightBiz",
      notes: "Highly seasonal. Declining footfall. Lease issues flagged by Sentinel.",
      insiderVisible: false,
    },
    {
      id: "OPP-2026-0125-010",
      businessName: "Leicester Multi-Service Centre",
      businessType: "convenience_store",
      location: "Leicester",
      region: "East Midlands",
      annualFees: "0",
      sessionsPerMonth: 0,
      askingPrice: "195000",
      weeklyTurnover: "11500",
      yearlyTurnover: "598000",
      score: 83,
      confidence: "HIGH",
      status: "closed",
      source: "Daltons",
      notes: "Completed acquisition Q1 2026. Now operational under FCM management.",
      insiderVisible: false,
    },
  ]);

  // ─── Content (with new columns) ─────────────
  const now = new Date();
  const monday = new Date(now);
  monday.setDate(now.getDate() - now.getDay() + 1);

  await db.insert(schema.content).values([
    {
      title: "Why the Convenience Sector Is Consolidating Faster Than Predicted",
      body: "The UK convenience sector is experiencing a wave of consolidation driven by rising operational costs, changing consumer habits, and the growing dominance of symbol groups. Independent operators face a critical choice: professionalize and scale, or exit while valuations remain favourable.\n\nOur analysis of 200+ transactions over the past 18 months shows a clear pattern: multiples are compressing for single-site operators while premium valuations persist for multi-site portfolios with strong management systems.\n\nKey factors driving consolidation include the cost-of-living squeeze on margins, the technology gap between independent and corporate operators, and increasing regulatory complexity around age-restricted sales and employment law.\n\nFor franchise operators like FCM, this creates a significant window of opportunity. The pipeline of quality acquisitions is expanding as independent operators seek exits, while the barriers to entry for unsophisticated buyers are rising.",
      contentType: "blog",
      track: "uk_business_strategy",
      author: "Henry",
      rexScore: 94,
      rexVerdict: "pass",
      status: "published",
      publishedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
      tone: "operator",
      style: "data_heavy",
      keyMessage: "Consolidation is accelerating — operators must scale or exit",
      scheduledDate: new Date(monday.getTime() + 0 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      scheduledPlatforms: ["linkedin", "blog"],
      platformVersions: {
        linkedin: { body: "The UK convenience sector is consolidating faster than predicted. Our analysis of 200+ transactions shows multiples compressing for single-site operators. #PostOffice #RetailStrategy", status: "approved" },
        blog: { body: "Full article version published on website.", status: "approved" },
      },
    },
    {
      title: "Maximizing Outreach: The Hidden Value in Banking Transactions",
      body: "Post Office banking transactions are often viewed as a compliance obligation rather than a revenue opportunity. Our data from 40+ branches tells a different story.\n\nBranches that actively manage their banking service proposition see a 15-22% uplift in secondary retail sales compared to those that treat banking as a grudge service.\n\nThe key insight: banking customers have the highest average basket value of any Post Office service user. They visit more frequently, spend more per visit in the retail section, and are more likely to use premium services like travel money and identity verification.\n\nWe recommend three specific strategies for maximizing this hidden value stream, based on our operational experience across the FCM network.",
      contentType: "linkedin",
      track: "po_insider",
      author: "Henry",
      rexScore: 91,
      rexVerdict: "pass",
      status: "published",
      publishedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
      tone: "operator",
      style: "operator_to_operator",
      keyMessage: "Banking customers are your most valuable retail customers",
      scheduledDate: new Date(monday.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      scheduledPlatforms: ["linkedin"],
      platformVersions: {
        linkedin: { body: "Banking transactions aren't a burden — they're your biggest retail opportunity. Our data from 40+ branches proves it. #PostOffice #BankingHub", status: "approved" },
      },
    },
    {
      title: "The Post Office Network in 2026: Five Predictions for Branch Operators",
      body: "As we move deeper into 2026, the Post Office network continues to evolve at pace. Crown conversions are accelerating, digital services are expanding, and the relationship between Post Office Ltd and its franchise partners is being reshaped.\n\nBased on our intelligence gathering and direct engagement with POL, here are five predictions that branch operators should prepare for...",
      contentType: "linkedin",
      track: "po_insider",
      author: "Henry",
      rexScore: 88,
      rexVerdict: "pass",
      status: "published",
      publishedAt: new Date(now.getTime() - 12 * 24 * 60 * 60 * 1000),
      tone: "professional",
      style: "educational",
      keyMessage: "Five trends shaping the Post Office network this year",
      scheduledDate: new Date(monday.getTime() + 4 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      scheduledPlatforms: ["linkedin", "twitter"],
    },
    {
      title: "Forecourt Acquisition Due Diligence: The FCM Framework",
      body: "Draft: Comprehensive guide to evaluating forecourt acquisitions covering fuel supply agreements, environmental compliance, shop fit considerations, and staffing models. This framework has been developed through our direct experience acquiring and operating forecourt businesses across the Midlands.\n\nSection 1: Fuel Supply Agreements\nThe fuel supply agreement is the cornerstone of any forecourt acquisition. Understanding the terms, margins, and lock-in periods is essential before making any offer.\n\nSection 2: Environmental Compliance\nTank testing, soil surveys, and ongoing environmental monitoring represent both a cost and a risk. Our framework covers the minimum due diligence requirements.\n\nSection 3: Shop Fit & Layout\nThe retail element of a forecourt is where the real margin sits. We evaluate the current shop fit against best-in-class standards.",
      contentType: "blog",
      track: "uk_business_strategy",
      author: "Henry",
      rexScore: 72,
      rexVerdict: "conditional_pass",
      status: "review",
      tone: "professional",
      style: "educational",
      keyMessage: "A systematic framework for forecourt acquisition due diligence",
    },
    {
      title: "Staff Retention in Multi-Site Retail: What Actually Works",
      body: "Early draft covering retention strategies across 40+ branches. Based on 18 months of data tracking turnover rates, exit interview themes, and the impact of specific interventions.\n\nKey findings so far:\n- Flexible scheduling reduces turnover by 23%\n- Regular 1:1s (monthly minimum) correlate with 31% lower attrition\n- Pay transparency within bands improves trust scores\n- Career progression pathways (even modest ones) are the #1 retention factor for under-30s",
      contentType: "blog",
      track: "uk_business_strategy",
      author: "Henry",
      rexScore: null,
      rexVerdict: null,
      status: "draft",
      tone: "casual",
      style: "story_led",
      keyMessage: "Retention is cheaper than recruitment — here's the data",
    },
    {
      title: "TUPE Transfer Checklist for Post Office Acquisitions",
      body: "When acquiring a Post Office branch with existing staff, TUPE regulations apply. This comprehensive checklist covers every step from initial due diligence through to Day 1 integration.\n\nPre-completion:\n- Obtain full employee liability information (ELI) at least 28 days before transfer\n- Review all employment contracts, including any variations\n- Check for outstanding tribunal claims or grievances\n- Assess pension obligations and any enhanced terms\n\nDay of transfer:\n- Issue formal transfer notification letters\n- Brief all transferring employees on new employer details\n- Ensure payroll continuity with no gaps",
      contentType: "email",
      track: "po_insider",
      author: "Henry",
      rexScore: 85,
      rexVerdict: "pass",
      status: "approval",
      tone: "professional",
      style: "educational",
      keyMessage: "Get TUPE right or face costly tribunal claims",
    },
  ]);

  // ─── Agent Health ──────────────────────────
  await db.insert(schema.agentHealth).values([
    { agentName: "Main", status: "active", lastOutput: new Date(now.getTime() - 30 * 60 * 1000), hoursSinceOutput: "0.5" },
    { agentName: "Henry", status: "active", lastOutput: new Date(now.getTime() - 2 * 60 * 60 * 1000), hoursSinceOutput: "2" },
    { agentName: "Claudia", status: "active", lastOutput: new Date(now.getTime() - 1 * 60 * 60 * 1000), hoursSinceOutput: "1" },
    { agentName: "Harper", status: "idle", lastOutput: new Date(now.getTime() - 48 * 60 * 60 * 1000), hoursSinceOutput: "48" },
    { agentName: "Rex", status: "idle", lastOutput: new Date(now.getTime() - 24 * 60 * 60 * 1000), hoursSinceOutput: "24" },
    { agentName: "Sentinel", status: "idle", lastOutput: new Date(now.getTime() - 72 * 60 * 60 * 1000), hoursSinceOutput: "72" },
    { agentName: "Watchtower", status: "active", lastOutput: new Date(now.getTime() - 15 * 60 * 1000), hoursSinceOutput: "0.25" },
  ]);

  // ─── Agent Activity Feed ───────────────────
  const activityEntries = [
    { agentName: "Watchtower", actionType: "health_check", description: "Health check complete. All agents healthy. No anomalies detected.", targetAgent: null, metadata: { agentsChecked: 7, healthy: 7 } },
    { agentName: "Henry", actionType: "task_start", description: "Beginning market scan for Post Office opportunities in West Midlands region.", targetAgent: null, metadata: { region: "West Midlands", sources: ["RightBiz", "Daltons"] } },
    { agentName: "Henry", actionType: "task_complete", description: "Market scan complete. Found 3 new opportunities matching criteria.", targetAgent: "Main", metadata: { newOpportunities: 3, region: "West Midlands" } },
    { agentName: "Henry", actionType: "handoff", description: "Submitted LinkedIn post 'Why Franchise Operators Fail' for editorial review.", targetAgent: "Rex", metadata: { contentId: 4, contentType: "linkedin" } },
    { agentName: "Rex", actionType: "task_start", description: "Reviewing content: 'Why Franchise Operators Fail'. Running editorial quality checks.", targetAgent: null, metadata: { contentId: 4 } },
    { agentName: "Rex", actionType: "task_complete", description: "Content review complete. Score: 88% — CONDITIONAL PASS. Minor revisions recommended.", targetAgent: "Henry", metadata: { score: 88, verdict: "conditional_pass" } },
    { agentName: "Claudia", actionType: "task_complete", description: "Deployed website update to production. Awaiting Sentinel QA.", targetAgent: "Sentinel", metadata: { deployment: "v2.4.1", environment: "production" } },
    { agentName: "Sentinel", actionType: "task_start", description: "Beginning QA sweep on production deployment v2.4.1.", targetAgent: null, metadata: { deployment: "v2.4.1" } },
    { agentName: "Sentinel", actionType: "task_complete", description: "QA sweep complete. No critical issues. 2 minor UI inconsistencies logged.", targetAgent: "Claudia", metadata: { critical: 0, minor: 2 } },
    { agentName: "Harper", actionType: "task_complete", description: "Processed HR query: Disciplinary procedure for cash discrepancies. Risk level: HIGH.", targetAgent: "Main", metadata: { caseType: "Disciplinary", riskLevel: "high" } },
    { agentName: "Main", actionType: "task_start", description: "Orchestrating daily briefing compilation. Gathering inputs from all agents.", targetAgent: null, metadata: { briefingType: "daily" } },
    { agentName: "Main", actionType: "handoff", description: "Forwarding opportunity OPP-2026-0301-001 to Henry for detailed financial analysis.", targetAgent: "Henry", metadata: { opportunityId: "OPP-2026-0301-001" } },
    { agentName: "Henry", actionType: "task_start", description: "Running financial analysis on High-Footfall Mains Branch (Solihull).", targetAgent: null, metadata: { opportunityId: "OPP-2026-0301-001" } },
    { agentName: "Henry", actionType: "task_complete", description: "Financial analysis complete. FCM Score: 92. Recommendation: PURSUE.", targetAgent: "Main", metadata: { score: 92, recommendation: "pursue" } },
    { agentName: "Watchtower", actionType: "health_check", description: "Scheduled health check. Sentinel idle for 72h — flagging for review.", targetAgent: "Main", metadata: { flaggedAgent: "Sentinel", reason: "extended_idle" } },
    { agentName: "Rex", actionType: "task_start", description: "Editorial review of blog post: 'Staff Retention in Multi-Site Retail'.", targetAgent: null, metadata: { contentId: 5 } },
    { agentName: "Claudia", actionType: "task_start", description: "Generating social media calendar for next week. Platforms: LinkedIn, Twitter.", targetAgent: null, metadata: { platforms: ["linkedin", "twitter"], week: "2026-W10" } },
    { agentName: "Claudia", actionType: "task_complete", description: "Social calendar generated. 6 posts scheduled across LinkedIn and Twitter.", targetAgent: "Main", metadata: { postsScheduled: 6 } },
    { agentName: "Main", actionType: "task_complete", description: "Daily briefing compiled and delivered. 3 new opportunities, 2 content items in pipeline.", targetAgent: null, metadata: { opportunities: 3, contentItems: 2 } },
    { agentName: "Watchtower", actionType: "error", description: "API rate limit warning on RightBiz scraper. Backing off for 15 minutes.", targetAgent: "Main", metadata: { source: "RightBiz", cooldownMinutes: 15 } },
  ];

  for (let i = 0; i < activityEntries.length; i++) {
    const entry = activityEntries[i];
    const createdAt = new Date(now.getTime() - (activityEntries.length - i) * 15 * 60 * 1000);
    await db.insert(schema.agentActivity).values({
      ...entry,
      createdAt,
    } as any);
  }

  // ─── Scan Config ───────────────────────────
  await db.insert(schema.scanConfig).values({
    name: "default",
    minAnnualFees: "50000",
    minSessions: 1000,
    maxAskingPrice: "500000",
    minWeeklyTurnover: "0",
    businessTypes: ["post_office", "forecourt", "convenience_store"],
    regions: ["West Midlands", "East Midlands", "Yorkshire", "South West", "South East", "London", "North West", "North East", "East of England", "Wales", "Scotland"],
    sources: ["RightBiz", "Daltons", "Christie & Co", "BusinessesForSale", "Franchise Direct", "FirmsForSale"],
    feeWeight: "1.0",
    sessionsWeight: "1.0",
    locationWeight: "1.0",
    typeWeight: "1.0",
    priceWeight: "1.0",
  });

  // ─── Scan History ──────────────────────────
  for (let i = 0; i < 5; i++) {
    const completedAt = new Date(now.getTime() - i * 12 * 60 * 60 * 1000);
    await db.insert(schema.scanHistory).values({
      triggeredBy: i === 0 ? "manual" : "scheduled",
      parameters: { minAnnualFees: 50000, minSessions: 1000, maxAskingPrice: 500000 },
      resultsCount: 5 + Math.floor(Math.random() * 8),
      completedAt,
    } as any);
  }

  // ─── HR Conversations ─────────────────────
  await db.insert(schema.hrConversations).values([
    {
      title: "Cash discrepancy disciplinary process",
      caseType: "Disciplinary",
      riskLevel: "high",
      status: "open",
      messages: [
        { role: "user", content: "I have a branch manager who has had cash discrepancies in 3 consecutive audits. Amounts are between £45 and £120. What should I do?", timestamp: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString() },
        { role: "harper", content: JSON.stringify({ answer: "This pattern of repeated cash discrepancies is a serious matter that warrants formal investigation under your company disciplinary policy.", legalBasis: "Employment Rights Act 1996, Section 98 — fair reasons for dismissal include conduct. ACAS Code of Practice on Disciplinary and Grievance Procedures.", procedure: "1. Suspend the employee on full pay pending investigation\n2. Appoint an independent investigator (not the line manager)\n3. Gather all audit evidence and documentation\n4. Conduct formal investigation meeting with right to representation\n5. If case to answer, proceed to formal disciplinary hearing", risk: "HIGH — Potential gross misconduct if dishonesty is established. However, dismissal without proper process could lead to unfair dismissal claim.", documents: "Company disciplinary policy, audit reports (x3), cash handling procedures, employee contract", escalation: "If amounts exceed £500 total or dishonesty is suspected, consider involving police and seeking legal counsel immediately." }), timestamp: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000 + 5000).toISOString() },
      ],
    },
    {
      title: "TUPE transfer questions for new acquisition",
      caseType: "TUPE",
      riskLevel: "medium",
      status: "open",
      messages: [
        { role: "user", content: "We're acquiring a Post Office branch with 4 existing staff. What are our TUPE obligations?", timestamp: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString() },
        { role: "harper", content: JSON.stringify({ answer: "TUPE (Transfer of Undertakings - Protection of Employment) regulations will apply to this acquisition. All 4 employees will automatically transfer to you on their existing terms and conditions.", legalBasis: "Transfer of Undertakings (Protection of Employment) Regulations 2006 (SI 2006/246), as amended by the Collective Redundancies and Transfer of Undertakings (Protection of Employment) (Amendment) Regulations 2014.", procedure: "1. Request Employee Liability Information (ELI) from seller at least 28 days before transfer\n2. Review all employment contracts and any variations\n3. Check for outstanding claims, grievances, or disciplinary matters\n4. Inform and consult with affected employees\n5. Issue transfer notification letters\n6. Ensure payroll continuity from Day 1", risk: "MEDIUM — Standard TUPE transfer. Risk increases if you plan any changes to terms and conditions post-transfer.", documents: "TUPE transfer agreement, Employee Liability Information pack, individual employment contracts, pension scheme details, collective agreements (if any)", escalation: "Seek specialist employment law advice if any employees raise objections, if there are ongoing tribunal claims, or if you plan to harmonise terms within the first 12 months." }), timestamp: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000 + 5000).toISOString() },
      ],
    },
  ]);

  // ─── Cost Records (14 days) ────────────────
  const costEntries = [];
  for (let i = 0; i < 14; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    const total = 12 + Math.random() * 8;
    const sonnet = total * (0.3 + Math.random() * 0.2);
    const haiku = total * (0.15 + Math.random() * 0.1);
    const gemini = total * (0.05 + Math.random() * 0.05);
    const opus = total - sonnet - haiku - gemini;

    costEntries.push({
      date: dateStr,
      totalCost: total.toFixed(2),
      sonnetCost: sonnet.toFixed(2),
      haikuCost: haiku.toFixed(2),
      geminiCost: gemini.toFixed(2),
      opusCost: Math.max(0, opus).toFixed(2),
      mainAgentCost: (total * 0.15).toFixed(2),
      henryCost: (total * 0.25).toFixed(2),
      claudiaCost: (total * 0.10).toFixed(2),
      harperCost: (total * 0.08).toFixed(2),
      rexCost: (total * 0.12).toFixed(2),
      sentinelCost: (total * 0.10).toFixed(2),
      watchtowerCost: (total * 0.20).toFixed(2),
    });
  }
  await db.insert(schema.costRecords).values(costEntries);

  // ─── HR Cases ──────────────────────────────
  await db.insert(schema.hrCases).values([
    {
      caseType: "Disciplinary",
      description: "Branch manager at Solihull location reported for repeated cash discrepancies over 3 consecutive audits. Amounts range from £45-£120.",
      riskLevel: "high",
      guidance: "Harper recommends formal investigation under company disciplinary policy. Document all discrepancies with audit trail. Consider suspension pending investigation. Ensure union representation offered at all meetings.",
      outcome: "resolved",
      resolvedAt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
    },
    {
      caseType: "Grievance",
      description: "Part-time counter staff at Edgbaston branch raised grievance regarding shift pattern changes implemented without consultation. Claims breach of contract.",
      riskLevel: "medium",
      guidance: "Harper advises reviewing original employment contract for flexibility clauses. Arrange informal discussion first. If unresolved, proceed to formal grievance hearing within 5 working days.",
      outcome: "ongoing",
    },
    {
      caseType: "Tribunal Risk",
      description: "Former employee at Coventry location has filed unfair dismissal claim following termination during probation period. Claims discrimination on grounds of disability.",
      riskLevel: "high",
      guidance: "Harper flags HIGH RISK. Recommend immediate engagement with employment solicitor. Review all documentation from probation period. Ensure Equality Act compliance can be demonstrated. Estimated exposure: £15,000-£25,000.",
      outcome: "escalated",
    },
  ]);

  console.log("Seed complete!");
  await pool.end();
}

seed().catch(console.error);
