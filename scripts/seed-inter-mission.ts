import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "../shared/schema";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool, { schema });

async function seed() {
  console.log("Seeding Inter-Mission data...");

  const managers = [
    { name: "Sarah Mitchell", email: "sarah.m@example.com", userType: "manager", phone: "07712345001", horizonId: "HRZ-SM-001", bio: "Former area manager with 18 years PO experience. Specialist in compliance and audit preparation across the North West.", locationPostcode: "M1 4BT", travelRadius: 50, dailyRate: "220", yearsExperience: 18, expertiseTracks: ["compliance_audit", "management_strategy"], skills: ["Audit Preparation", "Compliance Checks", "Branch Management", "P&L Management"], verificationStatus: "vetted", averageRating: "4.8", reviewCount: 28, totalEarnings: "12450", assignmentsCompleted: 34 },
    { name: "James Richardson", email: "james.r@example.com", userType: "manager", phone: "07712345002", horizonId: "HRZ-JR-002", bio: "Experienced trainer and branch manager. Horizon and Paystation certified. Available nationwide.", locationPostcode: "LS1 5DQ", travelRadius: 999, dailyRate: "200", yearsExperience: 15, expertiseTracks: ["training_development", "counter_operations"], skills: ["Horizon Training", "New Staff Training", "Holiday Cover", "Customer Service"], verificationStatus: "vetted", averageRating: "4.6", reviewCount: 19, totalEarnings: "8900", assignmentsCompleted: 22 },
    { name: "Patricia Wong", email: "patricia.w@example.com", userType: "manager", phone: "07712345003", horizonId: "HRZ-PW-003", bio: "Financial services specialist with deep banking and foreign exchange expertise. Based in London.", locationPostcode: "EC2A 1NT", travelRadius: 25, dailyRate: "250", yearsExperience: 20, expertiseTracks: ["financial_services", "advisory_consulting"], skills: ["Banking", "Foreign Exchange", "ISAs", "Business Planning", "Due Diligence"], verificationStatus: "vetted", averageRating: "4.9", reviewCount: 35, totalEarnings: "18200", assignmentsCompleted: 45 },
    { name: "David Okonkwo", email: "david.o@example.com", userType: "manager", phone: "07712345004", horizonId: "HRZ-DO-004", bio: "Setup and transitions expert. Managed 12 new branch openings in the last 3 years.", locationPostcode: "B2 4QA", travelRadius: 50, dailyRate: "230", yearsExperience: 12, expertiseTracks: ["setup_transitions", "retail_commercial"], skills: ["New Branch Opening", "Refit Management", "EPOS Configuration", "Equipment Setup"], verificationStatus: "vetted", averageRating: "4.7", reviewCount: 22, totalEarnings: "9800", assignmentsCompleted: 28 },
    { name: "Helen Fraser", email: "helen.f@example.com", userType: "manager", phone: "07712345005", horizonId: "HRZ-HF-005", bio: "Multi-site operations manager. 10 years running 3+ branches simultaneously.", locationPostcode: "G1 1XQ", travelRadius: 50, dailyRate: "210", yearsExperience: 16, expertiseTracks: ["management_strategy", "counter_operations"], skills: ["Multi-Site Operations", "Performance Improvement", "Daily Branch Running", "Cash Handling"], verificationStatus: "vetted", averageRating: "4.5", reviewCount: 15, totalEarnings: "7200", assignmentsCompleted: 19 },
    { name: "Robert Patel", email: "robert.p@example.com", userType: "manager", phone: "07712345006", horizonId: "HRZ-RP-006", bio: "Compliance and audit specialist. Former PO Ltd regional compliance officer.", locationPostcode: "M20 3BN", travelRadius: 25, dailyRate: "240", yearsExperience: 22, expertiseTracks: ["compliance_audit", "training_development"], skills: ["Compliance Checks", "Loss Prevention", "TC Verification", "Mentoring"], verificationStatus: "vetted", averageRating: "4.9", reviewCount: 41, totalEarnings: "22100", assignmentsCompleted: 52 },
    { name: "Karen Blackwood", email: "karen.b@example.com", userType: "manager", phone: "07712345007", horizonId: "HRZ-KB-007", bio: "Retail operations expert. Transformed underperforming branches into top earners.", locationPostcode: "BS1 3BN", travelRadius: 25, dailyRate: "195", yearsExperience: 10, expertiseTracks: ["retail_commercial", "management_strategy"], skills: ["Stock Management", "Merchandising", "Social Media Setup", "KPI Tracking"], verificationStatus: "vetted", averageRating: "4.4", reviewCount: 12, totalEarnings: "5600", assignmentsCompleted: 15 },
    { name: "Michael Thompson", email: "michael.t@example.com", userType: "manager", phone: "07712345008", horizonId: "HRZ-MT-008", bio: "Counter operations veteran. Reliable holiday cover across Yorkshire.", locationPostcode: "BD1 1EP", travelRadius: 50, dailyRate: "180", yearsExperience: 14, expertiseTracks: ["counter_operations", "financial_services"], skills: ["Holiday Cover", "Cash Handling", "Bill Payments", "MoneyGram"], verificationStatus: "vetted", averageRating: "4.3", reviewCount: 18, totalEarnings: "6400", assignmentsCompleted: 20 },
    { name: "Angela Morris", email: "angela.m@example.com", userType: "manager", phone: "07712345009", horizonId: "HRZ-AM-009", bio: "Advisory consultant helping new sub-postmasters with business planning and due diligence.", locationPostcode: "CF10 1BZ", travelRadius: 999, dailyRate: "260", yearsExperience: 25, expertiseTracks: ["advisory_consulting", "setup_transitions"], skills: ["Acquisition Support", "Franchise Guidance", "PO Ltd Applications", "Business Planning"], verificationStatus: "vetted", averageRating: "4.8", reviewCount: 30, totalEarnings: "15800", assignmentsCompleted: 38 },
    { name: "Tom Greaves", email: "tom.g@example.com", userType: "manager", phone: "07712345010", horizonId: "HRZ-TG-010", bio: "Training specialist in Horizon and new systems. Can upskill any team in 2 days.", locationPostcode: "NE1 7RU", travelRadius: 50, dailyRate: "190", yearsExperience: 8, expertiseTracks: ["training_development"], skills: ["Horizon Training", "Paystation Training", "Refresher Courses", "Assessment"], verificationStatus: "vetted", averageRating: "4.6", reviewCount: 14, totalEarnings: "4200", assignmentsCompleted: 12 },
    { name: "Fiona Campbell", email: "fiona.c@example.com", userType: "manager", phone: "07712345011", horizonId: "HRZ-FC-011", bio: "Financial services expert based in Edinburgh. ISA and savings specialist.", locationPostcode: "EH1 1RE", travelRadius: 25, dailyRate: "215", yearsExperience: 13, expertiseTracks: ["financial_services"], skills: ["Savings", "ISAs", "Insurance", "Banking"], verificationStatus: "vetted", averageRating: "4.7", reviewCount: 21, totalEarnings: "8100", assignmentsCompleted: 24 },
    { name: "Chris Denton", email: "chris.d@example.com", userType: "manager", phone: "07712345012", horizonId: "HRZ-CD-012", bio: "Counter operations and compliance. Recently left PO area management.", locationPostcode: "L1 8JQ", travelRadius: 25, dailyRate: "200", yearsExperience: 11, expertiseTracks: ["counter_operations", "compliance_audit"], skills: ["Daily Branch Running", "Audit Preparation", "Cash Management"], verificationStatus: "unvetted", averageRating: "0", reviewCount: 0, totalEarnings: "0", assignmentsCompleted: 0 },
    { name: "Nina Sharma", email: "nina.s@example.com", userType: "manager", phone: "07712345013", horizonId: "HRZ-NS-013", bio: "Setup specialist. Expert in new branch openings and TUPE transfers.", locationPostcode: "SO14 7DU", travelRadius: 50, dailyRate: "225", yearsExperience: 9, expertiseTracks: ["setup_transitions", "management_strategy"], skills: ["New Branch Opening", "TUPE", "Team Leadership"], verificationStatus: "unvetted", averageRating: "0", reviewCount: 0, totalEarnings: "0", assignmentsCompleted: 0 },
    { name: "Alan Whitfield", email: "alan.w@example.com", userType: "manager", phone: "07712345014", horizonId: "HRZ-AW-014", bio: "Semi-retired area manager. Happy to do short assignments in the East Midlands.", locationPostcode: "NG1 5GG", travelRadius: 25, dailyRate: "175", yearsExperience: 30, expertiseTracks: ["management_strategy", "advisory_consulting"], skills: ["Branch Management", "Ongoing Advisory", "Exit Strategy"], verificationStatus: "priority_vetting", averageRating: "0", reviewCount: 0, totalEarnings: "0", assignmentsCompleted: 0 },
    { name: "Lucy Bennett", email: "lucy.b@example.com", userType: "manager", phone: "07712345015", horizonId: "HRZ-LB-015", bio: "Young but experienced. Fast learner and certified in all PO systems. Willing to travel nationwide.", locationPostcode: "PL1 1EA", travelRadius: 999, dailyRate: "170", yearsExperience: 5, expertiseTracks: ["counter_operations", "training_development"], skills: ["Horizon Training", "Customer Service", "Holiday Cover", "New Staff Training"], verificationStatus: "vetted", averageRating: "4.2", reviewCount: 8, totalEarnings: "2800", assignmentsCompleted: 8 },
  ];

  const operators = [
    { name: "Rajesh Gupta", email: "rajesh.g@example.com", userType: "operator", phone: "07798765001", branchName: "Bolton Crown Post Office", fadCode: "234567", locationPostcode: "BL1 1TE", verificationStatus: "vetted", averageRating: "4.5", reviewCount: 12 },
    { name: "Margaret Hughes", email: "margaret.h@example.com", userType: "operator", phone: "07798765002", branchName: "Leeds City Centre", fadCode: "345678", locationPostcode: "LS1 6AE", verificationStatus: "vetted", averageRating: "4.7", reviewCount: 8 },
    { name: "Simon Walker", email: "simon.w@example.com", userType: "operator", phone: "07798765003", branchName: "Manchester Piccadilly", fadCode: "456789", locationPostcode: "M1 1LU", verificationStatus: "vetted", averageRating: "4.3", reviewCount: 6 },
    { name: "Priya Mehta", email: "priya.m@example.com", userType: "operator", phone: "07798765004", branchName: "Birmingham New Street", fadCode: "567890", locationPostcode: "B2 4QA", verificationStatus: "vetted", averageRating: "4.6", reviewCount: 10 },
    { name: "Thomas Edwards", email: "thomas.e@example.com", userType: "operator", phone: "07798765005", branchName: "Glasgow Central", fadCode: "678901", locationPostcode: "G1 3SL", verificationStatus: "unvetted", averageRating: "0", reviewCount: 0 },
  ];

  console.log("Creating profiles...");
  const profileIds: number[] = [];
  for (const p of [...managers, ...operators]) {
    const referralCode = `IM-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 5).toUpperCase()}`;
    const [row] = await db.insert(schema.imProfiles).values({ ...p, referralCode } as any).returning();
    profileIds.push(row.id);
    await new Promise((r) => setTimeout(r, 10));
  }

  const managerIds = profileIds.slice(0, 15);
  const operatorIds = profileIds.slice(15, 20);

  console.log("Creating assignments...");
  const assignmentData = [
    { operatorId: operatorIds[0], title: "Holiday Cover — Bolton — 2 Weeks", expertiseTrack: "counter_operations", description: "Need reliable counter cover while I take annual leave. Must know Horizon well.", locationPostcode: "BL1 1TE", branchName: "Bolton Crown", startDate: "2026-03-20", endDate: "2026-04-03", dailyBudget: "180", urgency: "standard", durationType: "two_weeks", status: "open" },
    { operatorId: operatorIds[1], title: "Compliance Audit Prep — Leeds — 1 Week", expertiseTrack: "compliance_audit", description: "Audit coming up next month. Need help preparing all documentation and cash management review.", locationPostcode: "LS1 6AE", branchName: "Leeds City Centre", startDate: "2026-03-15", endDate: "2026-03-21", dailyBudget: "220", urgency: "standard", durationType: "one_week", status: "open" },
    { operatorId: operatorIds[2], title: "URGENT: Counter Cover — Manchester — 3 Days", expertiseTrack: "counter_operations", description: "Staff member called in sick. Need immediate cover for this week.", locationPostcode: "M1 1LU", branchName: "Manchester Piccadilly", startDate: "2026-03-09", endDate: "2026-03-11", dailyBudget: "200", urgency: "urgent", durationType: "single_day", status: "open" },
    { operatorId: operatorIds[3], title: "New Staff Training — Birmingham — 1 Month", expertiseTrack: "training_development", description: "Three new staff members starting. Need comprehensive Horizon and counter training.", locationPostcode: "B2 4QA", branchName: "Birmingham New Street", startDate: "2026-04-01", endDate: "2026-04-30", dailyBudget: "190", urgency: "standard", durationType: "one_month", status: "open" },
    { operatorId: operatorIds[0], title: "Banking Services Setup — Bolton", expertiseTrack: "financial_services", description: "Adding banking services to branch. Need expert to set up and train staff.", locationPostcode: "BL1 1TE", branchName: "Bolton Crown", startDate: "2026-03-25", endDate: "2026-03-28", dailyBudget: "240", urgency: "standard", durationType: "one_week", status: "open" },
    { operatorId: operatorIds[1], title: "Branch Refit Management — Leeds", expertiseTrack: "setup_transitions", description: "Full branch refit happening. Need experienced manager to oversee the transition.", locationPostcode: "LS1 6AE", branchName: "Leeds City Centre", startDate: "2026-04-15", endDate: "2026-05-15", dailyBudget: "230", urgency: "standard", durationType: "one_month", status: "open" },
    { operatorId: operatorIds[3], title: "URGENT: Compliance Review — Birmingham", expertiseTrack: "compliance_audit", description: "Failed surprise audit. Need compliance expert urgently to address findings.", locationPostcode: "B2 4QA", branchName: "Birmingham New Street", startDate: "2026-03-10", endDate: "2026-03-14", dailyBudget: "260", urgency: "urgent", durationType: "one_week", status: "open" },
    { operatorId: operatorIds[2], title: "Holiday Cover — Manchester — 1 Week", expertiseTrack: "counter_operations", description: "Easter holiday cover needed. Busy branch, need experienced operator.", locationPostcode: "M1 1LU", branchName: "Manchester Piccadilly", startDate: "2026-04-06", endDate: "2026-04-10", dailyBudget: "185", urgency: "standard", durationType: "one_week", status: "open" },
  ];

  const assignmentIds: number[] = [];
  for (const a of assignmentData) {
    const [row] = await db.insert(schema.imAssignments).values(a as any).returning();
    assignmentIds.push(row.id);
  }

  console.log("Creating proposals...");
  const proposalData = [
    { assignmentId: assignmentIds[0], managerId: managerIds[7], proposedRate: "175", message: "Happy to cover Bolton. I know the branch well — covered there last summer.", status: "pending" },
    { assignmentId: assignmentIds[0], managerId: managerIds[1], proposedRate: "200", message: "Available for the full 2 weeks. Horizon certified and experienced with holiday cover.", status: "pending" },
    { assignmentId: assignmentIds[1], managerId: managerIds[0], proposedRate: "220", message: "Compliance is my specialty. I can have your audit prep finished in 3 days.", status: "pending" },
    { assignmentId: assignmentIds[1], managerId: managerIds[5], proposedRate: "240", message: "Former PO compliance officer. I know exactly what auditors look for.", status: "pending" },
    { assignmentId: assignmentIds[2], managerId: managerIds[7], proposedRate: "200", message: "Can start tomorrow. Manchester is my area.", status: "pending" },
    { assignmentId: assignmentIds[3], managerId: managerIds[1], proposedRate: "190", message: "Training is my passion. I can get your new staff up to speed quickly.", status: "pending" },
    { assignmentId: assignmentIds[3], managerId: managerIds[9], proposedRate: "190", message: "Certified trainer in all PO systems. Available for the full month.", status: "pending" },
    { assignmentId: assignmentIds[4], managerId: managerIds[2], proposedRate: "250", message: "Banking and financial services specialist. Can set up everything you need.", status: "pending" },
    { assignmentId: assignmentIds[5], managerId: managerIds[3], proposedRate: "230", message: "Managed 12 refits. I know the process inside out.", status: "pending" },
    { assignmentId: assignmentIds[6], managerId: managerIds[5], proposedRate: "250", message: "Emergency compliance is my forte. Can address all audit findings.", status: "pending" },
    { assignmentId: assignmentIds[6], managerId: managerIds[0], proposedRate: "220", message: "Available immediately. Let me fix this for you.", status: "pending" },
    { assignmentId: assignmentIds[7], managerId: managerIds[14], proposedRate: "170", message: "Happy to travel to Manchester for Easter cover. Fully Horizon trained.", status: "pending" },
  ];

  for (const p of proposalData) {
    await db.insert(schema.imProposals).values(p as any);
  }

  console.log("Creating reviews...");
  const reviewData = [
    { assignmentId: assignmentIds[0], reviewerId: operatorIds[0], revieweeId: managerIds[0], reviewerType: "operator", reliabilityScore: 5, competenceScore: 5, professionalismScore: 5, communicationScore: 4, wouldWorkAgain: true, writtenReview: "Sarah was absolutely brilliant. Handled everything perfectly and left the branch in better shape than she found it." },
    { assignmentId: assignmentIds[0], reviewerId: operatorIds[0], revieweeId: managerIds[1], reviewerType: "operator", reliabilityScore: 5, competenceScore: 4, professionalismScore: 5, communicationScore: 5, wouldWorkAgain: true, writtenReview: "James is a natural trainer. My new staff loved learning from him." },
    { assignmentId: assignmentIds[0], reviewerId: operatorIds[1], revieweeId: managerIds[2], reviewerType: "operator", reliabilityScore: 5, competenceScore: 5, professionalismScore: 5, communicationScore: 5, wouldWorkAgain: true, writtenReview: "Patricia is the best financial services expert we've ever worked with. Worth every penny." },
    { assignmentId: assignmentIds[0], reviewerId: operatorIds[2], revieweeId: managerIds[3], reviewerType: "operator", reliabilityScore: 5, competenceScore: 5, professionalismScore: 4, communicationScore: 5, wouldWorkAgain: true, writtenReview: "David managed our refit flawlessly. Zero downtime." },
    { assignmentId: assignmentIds[0], reviewerId: operatorIds[3], revieweeId: managerIds[4], reviewerType: "operator", reliabilityScore: 4, competenceScore: 5, professionalismScore: 4, communicationScore: 4, wouldWorkAgain: true, writtenReview: "Helen knows her stuff. Ran both my branches smoothly for a month." },
    { assignmentId: assignmentIds[0], reviewerId: operatorIds[0], revieweeId: managerIds[5], reviewerType: "operator", reliabilityScore: 5, competenceScore: 5, professionalismScore: 5, communicationScore: 5, wouldWorkAgain: true, writtenReview: "Robert saved us from a compliance nightmare. Incredible knowledge and attention to detail." },
    { assignmentId: assignmentIds[0], reviewerId: operatorIds[1], revieweeId: managerIds[6], reviewerType: "operator", reliabilityScore: 4, competenceScore: 4, professionalismScore: 5, communicationScore: 4, wouldWorkAgain: true, writtenReview: "Karen transformed our retail offering. Sales up 30% since her visit." },
    { assignmentId: assignmentIds[0], reviewerId: operatorIds[2], revieweeId: managerIds[7], reviewerType: "operator", reliabilityScore: 4, competenceScore: 4, professionalismScore: 4, communicationScore: 4, wouldWorkAgain: true, writtenReview: "Michael is a reliable pair of hands. Great with customers." },
    { assignmentId: assignmentIds[0], reviewerId: operatorIds[3], revieweeId: managerIds[8], reviewerType: "operator", reliabilityScore: 5, competenceScore: 5, professionalismScore: 5, communicationScore: 5, wouldWorkAgain: true, writtenReview: "Angela's business advice was invaluable. She helped me understand the true value of my branch." },
    { assignmentId: assignmentIds[0], reviewerId: operatorIds[0], revieweeId: managerIds[9], reviewerType: "operator", reliabilityScore: 5, competenceScore: 4, professionalismScore: 5, communicationScore: 4, wouldWorkAgain: true, writtenReview: "Tom is a fantastic trainer. My team was confident on Horizon within 2 days." },
    { assignmentId: assignmentIds[0], reviewerId: managerIds[0], revieweeId: operatorIds[0], reviewerType: "manager", reliabilityScore: 5, competenceScore: 4, professionalismScore: 5, communicationScore: 5, wouldWorkAgain: true, writtenReview: "Rajesh runs a great branch. Clear handover, everything was well prepared." },
    { assignmentId: assignmentIds[0], reviewerId: managerIds[1], revieweeId: operatorIds[1], reviewerType: "manager", reliabilityScore: 4, competenceScore: 4, professionalismScore: 4, communicationScore: 5, wouldWorkAgain: true, writtenReview: "Margaret is great to work with. Paid on time and clear expectations." },
    { assignmentId: assignmentIds[0], reviewerId: managerIds[2], revieweeId: operatorIds[2], reviewerType: "manager", reliabilityScore: 5, competenceScore: 5, professionalismScore: 5, communicationScore: 4, wouldWorkAgain: true, writtenReview: "Simon's branch is well-run. Pleasant working environment." },
    { assignmentId: assignmentIds[0], reviewerId: managerIds[3], revieweeId: operatorIds[3], reviewerType: "manager", reliabilityScore: 4, competenceScore: 4, professionalismScore: 5, communicationScore: 5, wouldWorkAgain: true, writtenReview: "Priya is professional and supportive. Great operator to work with." },
    { assignmentId: assignmentIds[0], reviewerId: managerIds[4], revieweeId: operatorIds[0], reviewerType: "manager", reliabilityScore: 5, competenceScore: 5, professionalismScore: 5, communicationScore: 5, wouldWorkAgain: true, writtenReview: "Bolton Crown is a joy to work in. Rajesh is an excellent operator." },
    { assignmentId: assignmentIds[0], reviewerId: managerIds[5], revieweeId: operatorIds[1], reviewerType: "manager", reliabilityScore: 5, competenceScore: 4, professionalismScore: 5, communicationScore: 5, wouldWorkAgain: true, writtenReview: "Leeds branch is well-maintained. Margaret communicates clearly." },
    { assignmentId: assignmentIds[0], reviewerId: managerIds[6], revieweeId: operatorIds[2], reviewerType: "manager", reliabilityScore: 4, competenceScore: 3, professionalismScore: 4, communicationScore: 4, wouldWorkAgain: true, writtenReview: "Good branch, could improve stock management but overall positive." },
    { assignmentId: assignmentIds[0], reviewerId: managerIds[7], revieweeId: operatorIds[3], reviewerType: "manager", reliabilityScore: 5, competenceScore: 5, professionalismScore: 5, communicationScore: 5, wouldWorkAgain: true, writtenReview: "Birmingham New Street is a flagship branch. Priya sets high standards." },
    { assignmentId: assignmentIds[0], reviewerId: managerIds[8], revieweeId: operatorIds[0], reviewerType: "manager", reliabilityScore: 5, competenceScore: 5, professionalismScore: 5, communicationScore: 5, wouldWorkAgain: true, writtenReview: "Rajesh is one of the best operators in the network. Would happily work there again." },
    { assignmentId: assignmentIds[0], reviewerId: managerIds[9], revieweeId: operatorIds[1], reviewerType: "manager", reliabilityScore: 4, competenceScore: 4, professionalismScore: 4, communicationScore: 4, wouldWorkAgain: true, writtenReview: "Smooth experience at Leeds. Margaret paid promptly." },
  ];

  for (const r of reviewData) {
    await db.insert(schema.imReviews).values(r as any);
  }

  console.log("Creating earnings...");
  const earningsData = [
    { managerId: managerIds[0], assignmentId: assignmentIds[0], amount: "4400", daysWorked: 20, dailyRate: "220" },
    { managerId: managerIds[2], assignmentId: assignmentIds[0], amount: "5000", daysWorked: 20, dailyRate: "250" },
    { managerId: managerIds[5], assignmentId: assignmentIds[0], amount: "2400", daysWorked: 10, dailyRate: "240" },
    { managerId: managerIds[1], assignmentId: assignmentIds[0], amount: "3000", daysWorked: 15, dailyRate: "200" },
    { managerId: managerIds[8], assignmentId: assignmentIds[0], amount: "3900", daysWorked: 15, dailyRate: "260" },
  ];

  for (const e of earningsData) {
    await db.insert(schema.imEarnings).values(e as any);
  }

  console.log("Creating vetting queue entries...");
  await db.insert(schema.imVettingQueue).values([
    { profileId: profileIds[11], priority: false, status: "pending" },
    { profileId: profileIds[12], priority: false, status: "pending" },
    { profileId: profileIds[13], priority: true, stripePaymentId: "pi_skip_001", status: "pending" },
    { profileId: profileIds[19], priority: false, status: "pending" },
  ] as any);

  console.log("Creating availability...");
  const today = new Date();
  for (let i = 0; i < 10; i++) {
    const dates = [];
    for (let d = 0; d < 30; d++) {
      const date = new Date(today);
      date.setDate(date.getDate() + d);
      const available = Math.random() > 0.3;
      dates.push({
        profileId: managerIds[i],
        date: date.toISOString().split("T")[0],
        status: available ? "available" : "unavailable",
      });
    }
    for (const entry of dates) {
      await db.insert(schema.imAvailability).values(entry as any);
    }
  }

  console.log("Seed complete!");
  await pool.end();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
