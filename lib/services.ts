// Services, grouped by where the customer is in their journey.
// Prices are provisional until Mikesh confirms them (see site.pricesConfirmed).

export type Service = {
  slug: string;
  name: string;
  price: string; // display string, e.g. "£499" or "Price on request"
  unit?: string; // e.g. "per month", "20 minutes"
  summary: string;
  includes: string[];
  href?: string; // dedicated page, otherwise the enquiry form
};

export type Stage = {
  id: string;
  title: string;
  intro: string;
  services: Service[];
};

export const stages: Stage[] = [
  {
    id: "buying",
    title: "Buying a Post Office",
    intro:
      "Most of the money is made or lost before you sign. This is where I can save you the most.",
    services: [
      {
        slug: "insight-report",
        name: "Insight Report",
        price: "£199",
        summary:
          "A location and business report on the branch you're looking at, before you spend money on a viewing.",
        includes: [
          "Post Office income and remuneration breakdown",
          "Demographics, crime and footfall around the branch",
          "Every competing Post Office nearby, named, with distances",
          "Online reputation and Google reviews",
          "Risks and red flags",
        ],
        href: "/reports",
      },
      {
        slug: "intelligence-report",
        name: "Intelligence Report",
        price: "£499",
        summary:
          "The full picture: everything in the Insight Report plus the financials, staffing and a negotiation plan.",
        includes: [
          "Everything in the Insight Report",
          "Financial analysis and staffing costs, including TUPE",
          "Future outlook for the area and the high street",
          "Profit improvement plan",
          "Due diligence questions and negotiation guidance",
        ],
        href: "/reports",
      },
      {
        slug: "discovery-call",
        name: "Discovery Call",
        price: "£150",
        unit: "60 minutes",
        summary:
          "An hour with me on video. Tell me where you are and I'll tell you honestly what I'd do next.",
        includes: ["60-minute video call", "Your situation assessed", "Any questions answered", "Clear next steps"],
      },
      {
        slug: "deal-review",
        name: "Deal Review",
        price: "£497",
        unit: "60 minutes",
        summary:
          "Found a branch? We go through it together and you leave with a clear go or no-go.",
        includes: [
          "60-minute deep dive on one opportunity",
          "Viability and red-flag check",
          "Due diligence guidance",
          "Written summary with action points",
        ],
      },
      {
        slug: "acquisition-advisory",
        name: "Acquisition Advisory",
        price: "£1,997",
        summary:
          "An Intelligence Report plus three sessions with me, from first look to final offer.",
        includes: [
          "Intelligence Report on your chosen branch",
          "Session 1: acquisition strategy",
          "Session 2: due diligence review",
          "Session 3: negotiation and closing",
          "Email and WhatsApp support between sessions",
        ],
      },
      {
        slug: "guided-acquisition",
        name: "Guided Acquisition",
        price: "£4,997",
        unit: "3 months",
        summary:
          "I walk the whole journey with you: the offer, due diligence, the Post Office interview and the handover.",
        includes: [
          "Intelligence Report included",
          "Six one-to-one sessions",
          "Unlimited email and WhatsApp support",
          "Optional site visit",
          "Post-acquisition operations plan and 30-day check-in",
        ],
      },
      {
        slug: "business-plan",
        name: "Business Plan Writing",
        price: "Price on request",
        summary: "The business plan the Post Office and your lender will ask for, written by someone who has been through it dozens of times.",
        includes: ["Financial projections built from the real numbers", "Written to Post Office expectations", "Ready for lenders"],
      },
      {
        slug: "interview-prep",
        name: "Post Office Interview Preparation",
        price: "Price on request",
        summary: "Coaching for the operator interview so you walk in knowing what they're looking for.",
        includes: ["Mock interview", "Likely questions and strong answers", "Feedback on your business plan"],
      },
    ],
  },
  {
    id: "starting",
    title: "Starting out",
    intro: "The first 90 days set the tone for everything after. Get the foundations right.",
    services: [
      {
        slug: "business-setup",
        name: "Business Setup",
        price: "Price on request",
        summary: "Company, bank, suppliers, staffing contracts and systems ready for day one.",
        includes: ["Set-up checklist done with you", "Staff contracts with real accountability", "Supplier and systems introductions"],
      },
      {
        slug: "operator-training",
        name: "Operator Training",
        price: "Price on request",
        summary: "Training for new postmasters and their teams, from people who run the counter every day.",
        includes: ["Counter and cash management", "Compliance and audits", "Managing staff and rotas"],
      },
      {
        slug: "insurance-review",
        name: "Insurance Review",
        price: "Price on request",
        summary: "Most branches are over- or under-insured. We check your cover against what a Post Office actually needs.",
        includes: ["Review of your current policies", "Gaps and overlaps identified", "Recommendations"],
      },
    ],
  },
  {
    id: "running",
    title: "Running a branch",
    intro: "Already operating? Sometimes you need a second pair of eyes, sometimes you need an answer today.",
    services: [
      {
        slug: "helpline",
        name: "Helpline 101",
        price: "£101",
        unit: "20 minutes",
        summary: "Urgent help when you need it: cash discrepancies, compliance problems, a difficult situation with staff.",
        includes: ["20-minute call", "Cash and compliance guidance", "No commitment"],
      },
      {
        slug: "health-check",
        name: "Branch Health Check",
        price: "Price on request",
        summary: "A full review of your branch: income, staffing costs, compliance and where the extra profit is.",
        includes: ["Remuneration and income review", "Staffing structure and costs", "Profit improvement opportunities"],
      },
      {
        slug: "advisory-retainer",
        name: "Advisory Retainer",
        price: "£997",
        unit: "per month",
        summary: "Me on call for operators who are growing, with two calls a month and support in between.",
        includes: ["Two 60-minute calls a month", "Email and WhatsApp support", "Growth and portfolio planning", "3-month minimum"],
      },
    ],
  },
];
