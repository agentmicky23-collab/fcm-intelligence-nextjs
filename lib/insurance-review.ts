// Mikesh's Post Office insurance review: the 17 questions he put to his own policy,
// and the rules that turn the answers into gaps. Carried over from the fcmreport.com audit.

export type Option = { label: string; value: string };
export type Question = {
  id: number;
  section: number;
  sectionLabel: string;
  question: string;
  subtext?: string;
  storageKey: string;
  options: Option[];
};
export type Answers = Record<string, string>;
export type Gap = { title: string; body: string };
export type Gaps = { critical: Gap[]; important: Gap[]; worthReviewing: Gap[]; ok: Gap[] };

export const sections = ["About your branch", "Property & contents", "Money", "Specific covers"];

/** The policy-specific questions start here; before them, check the visitor has their schedule. */
export const policyStart = 8;

export const renewalOptions = [
  { value: "0_3m", label: "In the next 3 months" },
  { value: "3_6m", label: "3 to 6 months away" },
  { value: "6_12m", label: "6 to 12 months away" },
  { value: "12m_plus", label: "More than 12 months away" },
  { value: "unsure", label: "Not sure" },
];

export const questions: Question[] = [
  // Section 1: About your branch (Q1-Q8)
  {
    id: 1,
    section: 1,
    sectionLabel: "About your branch",
    question: "What type of Post Office do you operate?",
    storageKey: "branch_type",
    options: [
      { label: "Mains Post Office", value: "mains" },
      { label: "Local", value: "local" },
      { label: "Local Plus", value: "local_plus" },
      { label: "Other / former Crown / not sure", value: "other" },
    ],
  },
  {
    id: 2,
    section: 1,
    sectionLabel: "About your branch",
    question: "How many Post Office branches do you own or operate?",
    storageKey: "branch_count",
    options: [
      { label: "Just one", value: "1" },
      { label: "2 to 3", value: "2-3" },
      { label: "4 or more", value: "4+" },
    ],
  },
  {
    id: 3,
    section: 1,
    sectionLabel: "About your branch",
    question: "Which best describes your current insurance cover?",
    subtext: "We're not asking for the insurer's name — we want to understand what type of product you're on.",
    storageKey: "cover_type",
    options: [
      { label: "A specialist Post Office insurance product", value: "specialist" },
      { label: "Shops & Salons cover from a major insurer (direct)", value: "generic_direct" },
      { label: "Cover arranged by a local insurance broker", value: "broker" },
      { label: "Not sure what type of cover I have", value: "unsure" },
    ],
  },
  {
    id: 4,
    section: 1,
    sectionLabel: "About your branch",
    question: "How much do you pay annually for your PO / shop insurance?",
    subtext: "Your total annual premium, per branch if you have multiple.",
    storageKey: "premium",
    options: [
      { label: "Under £1,000", value: "under_1000" },
      { label: "£1,000 to £1,500", value: "1000_1500" },
      { label: "£1,500 to £2,200", value: "1500_2200" },
      { label: "£2,200 to £3,000", value: "2200_3000" },
      { label: "Over £3,000", value: "over_3000" },
      { label: "Not sure", value: "unsure" },
    ],
  },
  {
    id: 5,
    section: 1,
    sectionLabel: "About your branch",
    question: "Does your branch have an ATM on the premises?",
    storageKey: "atm",
    options: [
      { label: "Yes — internal (in the shop/branch)", value: "internal" },
      { label: "Yes — external (through-the-wall)", value: "external" },
      { label: "No ATM", value: "none" },
      { label: "Not sure", value: "unsure" },
    ],
  },
  {
    id: 6,
    section: 1,
    sectionLabel: "About your branch",
    question: "How often does Post Office Ltd deliver cash to your branch?",
    subtext: "REM (Remittance) delivery frequency affects how much cash sits in the safe at peak times.",
    storageKey: "rem_frequency",
    options: [
      { label: "Once a week", value: "once" },
      { label: "Twice a week", value: "twice" },
      { label: "Three or more times a week", value: "three_plus" },
      { label: "Not sure", value: "unsure" },
    ],
  },
  {
    id: 7,
    section: 1,
    sectionLabel: "About your branch",
    question: "How is your Post Office counter configured?",
    storageKey: "counter_config",
    options: [
      { label: "Fortress / screened — staff work behind a security screen", value: "fortress" },
      { label: "Open-plan — no screen between staff and customers", value: "open_plan" },
      { label: "Mixed — some positions screened, some open", value: "mixed" },
    ],
  },
  {
    id: 8,
    section: 1,
    sectionLabel: "About your branch",
    question: "How many staff are typically on site during trading hours?",
    storageKey: "lone_working",
    options: [
      { label: "Usually just one person", value: "solo" },
      { label: "Two or more people always", value: "multi" },
      { label: "Varies — sometimes alone, sometimes with others", value: "mixed" },
    ],
  },
  // Section 2: Property & Contents (Q9-Q10)
  {
    id: 9,
    section: 2,
    sectionLabel: "Property & Contents",
    question: "Under \"Contents and Stock\" — what's your total sum insured?",
    storageKey: "contents",
    options: [
      { label: "Under £50,000", value: "under_50k" },
      { label: "£50,000 to £100,000", value: "50k_100k" },
      { label: "£100,000 to £200,000", value: "100k_200k" },
      { label: "Over £200,000", value: "over_200k" },
      { label: "I can't find this figure", value: "cant_find" },
    ],
  },
  {
    id: 10,
    section: 2,
    sectionLabel: "Property & Contents",
    question: "Is \"accidental damage\" explicitly included in your property cover?",
    subtext: "Search your policy wording for the phrase. Not just theft and fire — accidental damage specifically.",
    storageKey: "accidental",
    options: [
      { label: "Yes — included", value: "yes" },
      { label: "No — excluded or optional", value: "no" },
      { label: "Can't find any reference to it", value: "cant_find" },
    ],
  },
  // Section 3: Money (Q11-Q13)
  {
    id: 11,
    section: 3,
    sectionLabel: "Money (the critical section)",
    question: "Under \"Money\" — what's your cash on counter limit during business hours?",
    subtext: "This is usually the lowest money limit in the policy. Check carefully.",
    storageKey: "cash_counter",
    options: [
      { label: "Under £2,500", value: "under_2500" },
      { label: "£2,500 to £5,000", value: "2500_5000" },
      { label: "£5,000 to £10,000", value: "5000_10000" },
      { label: "£10,000 to £20,000", value: "10000_20000" },
      { label: "Over £20,000", value: "over_20000" },
      { label: "Can't find a figure", value: "cant_find" },
    ],
  },
  {
    id: 12,
    section: 3,
    sectionLabel: "Money",
    question: "What's your cash in safe limit during business hours?",
    storageKey: "cash_safe",
    options: [
      { label: "Under £10,000", value: "under_10000" },
      { label: "£10,000 to £25,000", value: "10000_25000" },
      { label: "£25,000 to £50,000", value: "25000_50000" },
      { label: "Over £50,000", value: "over_50000" },
      { label: "Can't find it", value: "cant_find" },
    ],
  },
  {
    id: 13,
    section: 3,
    sectionLabel: "Money",
    question: "What's your cash in transit limit?",
    subtext: "Cover for cash being carried by you or staff — typically to the bank.",
    storageKey: "cash_transit",
    options: [
      { label: "Under £5,000", value: "under_5000" },
      { label: "£5,000 to £15,000", value: "5000_15000" },
      { label: "£15,000 to £30,000", value: "15000_30000" },
      { label: "Over £30,000", value: "over_30000" },
      { label: "Not listed in my policy", value: "not_listed" },
    ],
  },
  // Section 4: Specific covers (Q14-Q17)
  {
    id: 14,
    section: 4,
    sectionLabel: "Specific covers",
    question: "Search your policy for the word \"fidelity\"",
    subtext: "This is cover for theft by your own employees. In a cash-heavy business, it's essential.",
    storageKey: "fidelity",
    options: [
      { label: "Yes — with a stated limit", value: "yes_limit" },
      { label: "Listed as excluded", value: "excluded" },
      { label: "The word doesn't appear at all", value: "not_present" },
      { label: "Can't tell from the policy", value: "cant_tell" },
    ],
  },
  {
    id: 15,
    section: 4,
    sectionLabel: "Specific covers",
    question: "What's your Business Interruption indemnity period?",
    subtext: "How long after an incident the policy will pay for lost income.",
    storageKey: "bi_period",
    options: [
      { label: "12 months", value: "12" },
      { label: "18 months", value: "18" },
      { label: "24 months", value: "24" },
      { label: "Longer than 24 months", value: "longer" },
      { label: "I don't have BI cover", value: "no_bi" },
      { label: "Can't find it", value: "cant_find" },
    ],
  },
  {
    id: 16,
    section: 4,
    sectionLabel: "Specific covers",
    question: "Does your BI specifically mention Post Office remuneration?",
    subtext: "Search for \"Post Office\", \"PO remuneration\" or \"PO contract\" in your BI section. Standard retail BI covers shop gross profit only — not your PO salary.",
    storageKey: "bi_po",
    options: [
      { label: "Yes — explicitly mentioned", value: "yes" },
      { label: "Only retail profit is mentioned", value: "retail_only" },
      { label: "Can't tell from the policy", value: "cant_tell" },
      { label: "I don't have BI at all", value: "no_bi" },
    ],
  },
  {
    id: 17,
    section: 4,
    sectionLabel: "Specific covers",
    question: "Does your policy include personal accident cover specifically for staff working alone?",
    subtext: "Lone working is common in Post Offices. Standard policies often treat PA as a low-limit add-on rather than a core feature.",
    storageKey: "pa_lone",
    options: [
      { label: "Yes — lone worker PA is named in the policy", value: "yes_named" },
      { label: "PA cover exists but lone working isn't specifically mentioned", value: "pa_generic" },
      { label: "No PA cover at all", value: "no_pa" },
      { label: "Can't tell from the policy", value: "cant_tell" },
    ],
  },
];

export function calculateGaps(answers: Answers): Gaps {
  const critical: Gap[] = [];
  const important: Gap[] = [];
  const worthReviewing: Gap[] = [];
  const ok: Gap[] = [];

  // CRITICAL gaps
  
  // 1. Fidelity missing
  if (['excluded', 'not_present', 'cant_tell'].includes(answers.fidelity)) {
    critical.push({
      title: "Employee theft cover likely missing",
      body: "Generic shops policies exclude fidelity cover by default. Even some specialist products treat it as optional. In a Post Office where staff handle £20k+ daily, that exposure is significant. Industry benchmark is £25,000 to £50,000 of fidelity cover as standard.",
    });
  }

  // 2. PO income not in BI
  if (['retail_only', 'cant_tell'].includes(answers.bi_po)) {
    critical.push({
      title: "Post Office income stream likely uninsured",
      body: "This is the most common PO-specific gap — and it exists in many specialist products too, not just generic cover. Standard BI covers retail gross profit loss. It does NOT automatically cover Post Office remuneration — the salary Post Office Ltd pays you. If your branch closes after an incident, your PO income may stop with no insurance replacing it. True PO-first cover names this stream explicitly.",
    });
  }

  // 3. Counter cash critically low
  if (['under_2500', '2500_5000', 'cant_find'].includes(answers.cash_counter)) {
    let body: string = "Working Post Offices routinely hold £10,000+ on the counter during business hours — rising to £20-30k on benefits payment days. Industry benchmark for PO-specialist cover is £10,000 to £20,000 minimum on counter. Your answer suggests you may be uninsured on cash every single trading day.";
    
    // Escalate if open-plan
    if (answers.counter_config === 'open_plan') {
      body += " You also operate an open-plan counter with no security screen. Insurers consider this higher-risk than screened positions, and your counter cash exposure is magnified accordingly.";
    }
    
    critical.push({
      title: "Counter cash limit likely insufficient",
      body,
    });
  } else if (answers.counter_config === 'open_plan' && ['5000_10000', 'cant_find'].includes(answers.cash_counter)) {
    // Escalate to critical if open-plan even with mid-range counter limit
    critical.push({
      title: "Counter cash limit at risk with open-plan layout",
      body: "You operate an open-plan counter with no security screen. Insurers consider this higher-risk than screened positions. Your counter cash limit may be adequate for a screened counter, but with open-plan exposure, you're carrying more risk than the policy was priced for.",
    });
  }

  // 4. Safe cash critically low
  if (['under_10000', 'cant_find'].includes(answers.cash_safe)) {
    critical.push({
      title: "Safe cash limit may be too low",
      body: "After Post Office Ltd cash deliveries, safe holdings commonly reach £30-50k. Generic shops policies cap at £5-10k. Industry benchmark for PO-specialist cover is £25,000 to £50,000 during business hours.",
    });
  }

  // 5. Lone working + inadequate PA
  if (['solo', 'mixed'].includes(answers.lone_working) && ['no_pa', 'cant_tell', 'pa_generic'].includes(answers.pa_lone)) {
    critical.push({
      title: "Lone worker with no specific personal accident cover",
      body: "You've told us staff sometimes or always work alone, and your policy doesn't specifically name lone worker PA cover. Assault risk in Post Offices is statistically higher than generic retail, and lone workers carry higher risk still. This combination is a significant exposure.",
    });
  }

  // Severity escalation — ATM + safe cash combination
  if (['internal', 'external'].includes(answers.atm) && ['under_10000', '10000_25000', 'cant_find'].includes(answers.cash_safe)) {
    let body: string = "You have an ATM on the premises, which sits on top of your PO cash float. With a safe limit at your current level, safe cash is likely uninsured at peak times — particularly after REM deliveries.";
    
    if (['twice', 'three_plus'].includes(answers.rem_frequency)) {
      body += " Twice-weekly (or more) REM deliveries plus ATM cash mean your safe sees peak cash levels multiple times a week.";
    }
    
    critical.push({
      title: "ATM on premises with low safe limit",
      body,
    });
  }

  // IMPORTANT gaps

  // 6. Cash in transit low
  if (['under_5000', 'not_listed'].includes(answers.cash_transit)) {
    important.push({
      title: "Cash in transit limit at risk",
      body: "Postmasters carrying cash to the bank commonly move £15-30k. If your transit limit is under £5,000 — or not listed at all — any bank run above that figure is uninsured. Industry benchmark is £15,000 to £30,000.",
    });
  }

  // 7. BI period too short
  if (['12', 'cant_find'].includes(answers.bi_period)) {
    important.push({
      title: "Business Interruption period may be too short",
      body: "Standard 12-month indemnity periods often prove inadequate for PO operators. Post Office Ltd contract reallocation timelines, rebuild delays, and supplier issues can extend recovery beyond 12 months. Industry benchmark for specialist PO cover is 18-24 months.",
    });
  }

  // 8. No BI at all
  if (answers.bi_period === 'no_bi') {
    important.push({
      title: "No Business Interruption cover at all",
      body: "Without BI cover, any incident closing your branch leaves you with no income protection. This is a substantial exposure — property damage without BI is usually cover that's been stripped out to save premium.",
    });
  }

  // 9. Contents under-sized
  if (['under_50k', 'cant_find'].includes(answers.contents)) {
    important.push({
      title: "Contents and stock cover may be under-sized",
      body: "Post Office operations typically require £75k-£150k of contents cover when fixtures, EPOS systems, stock, and PO counter equipment are properly valued. Under-insurance can result in proportional claim reductions.",
    });
  }

  // WORTH REVIEWING gaps

  // 10. Accidental damage missing
  if (['no', 'cant_find'].includes(answers.accidental)) {
    worthReviewing.push({
      title: "Accidental damage may not be covered",
      body: "Many generic shops policies cover theft and fire but exclude accidental damage unless specifically added. For retail environments with stock, fixtures, and customer footfall, this is a meaningful exposure to leave uncovered.",
    });
  }

  // 11. Premium vs gaps sanity check
  const totalGapCount = critical.length + important.length + worthReviewing.length;
  if (answers.premium === 'under_1000' && totalGapCount >= 3) {
    worthReviewing.push({
      title: "Premium suggests cover was priced for retail, not PO",
      body: "At under £1,000/year with multiple gaps identified, you're likely on cover priced as a shop with PO bolted on, rather than priced as a Post Office with retail extensions. True PO-first cover typically costs £1,500-£2,500 but closes the gaps above.",
    });
  }

  // OK cards

  if (answers.fidelity === 'yes_limit') {
    ok.push({
      title: "Fidelity cover in place",
      body: "You have employee theft cover, essential for cash-handling businesses. Check the limit is adequate for your daily cash movement.",
    });
  }

  if (answers.bi_po === 'yes') {
    ok.push({
      title: "PO income stream protected",
      body: "Your BI explicitly covers both retail and PO revenue — this is the gold standard and rare even in specialist cover.",
    });
  }

  if (['18', '24', 'longer'].includes(answers.bi_period)) {
    ok.push({
      title: "BI period well-sized",
      body: "Your indemnity period reflects realistic PO recovery timelines.",
    });
  }

  if (['10000_20000', 'over_20000'].includes(answers.cash_counter)) {
    ok.push({
      title: "Counter cash limit looks PO-appropriate",
      body: "Your counter limit reflects real PO cash movement. Confirm your safe and in-transit limits match.",
    });
  }

  if (['25000_50000', 'over_50000'].includes(answers.cash_safe)) {
    ok.push({
      title: "Safe cash limit adequate",
      body: "Your safe limit looks sized for PO cash holdings.",
    });
  }

  return { critical, important, worthReviewing, ok };
}
