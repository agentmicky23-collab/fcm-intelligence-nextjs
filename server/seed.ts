import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "../shared/schema";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool, { schema });

async function seed() {
  console.log("Seeding database...");

  // Clear existing data
  await db.delete(schema.feedbackLog);
  await db.delete(schema.costRecords);
  await db.delete(schema.hrCases);
  await db.delete(schema.agentHealth);
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

  // ─── Content ───────────────────────────────
  const now = new Date();
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
    },
    {
      title: "Forecourt Acquisition Due Diligence: The FCM Framework",
      body: "Draft: Comprehensive guide to evaluating forecourt acquisitions covering fuel supply agreements, environmental compliance, shop fit considerations, and staffing models...",
      contentType: "blog",
      track: "uk_business_strategy",
      author: "Henry",
      rexScore: 72,
      rexVerdict: "conditional_pass",
      status: "review",
    },
    {
      title: "Staff Retention in Multi-Site Retail: What Actually Works",
      body: "Early draft covering retention strategies across 40+ branches...",
      contentType: "blog",
      track: "uk_business_strategy",
      author: "Henry",
      rexScore: null,
      rexVerdict: null,
      status: "draft",
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
