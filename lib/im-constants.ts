export const EXPERTISE_TRACKS = [
  { id: "counter_operations", name: "Counter Operations", description: "Holiday cover, daily branch running, customer service, cash handling", icon: "🏪" },
  { id: "financial_services", name: "Financial Services", description: "Banking, bill payments, MoneyGram, foreign exchange, savings, ISAs", icon: "💰" },
  { id: "compliance_audit", name: "Compliance & Audit", description: "Audit preparation, compliance checks, cash management, loss prevention", icon: "📋" },
  { id: "training_development", name: "Training & Development", description: "New staff training, system training, Horizon, Paystation, refresher courses", icon: "🎓" },
  { id: "management_strategy", name: "Management & Strategy", description: "Branch management, multi-site operations, performance improvement, P&L", icon: "📊" },
  { id: "retail_commercial", name: "Retail & Commercial", description: "Retail setup, EPOS configuration, stock management, merchandising", icon: "🛒" },
  { id: "setup_transitions", name: "Setup & Transitions", description: "New branch opening, refit management, TUPE, PO Ltd applications", icon: "🔧" },
  { id: "advisory_consulting", name: "Advisory & Consulting", description: "Business planning, due diligence, acquisition support, franchise guidance", icon: "💼" },
];

export const SKILLS_BY_TRACK: Record<string, string[]> = {
  counter_operations: ["Holiday Cover", "Daily Branch Running", "Customer Service", "Cash Handling", "Lottery", "Motor Vehicle Licensing"],
  financial_services: ["Banking", "Bill Payments", "MoneyGram", "Foreign Exchange", "Savings", "ISAs", "Insurance", "Mortgages"],
  compliance_audit: ["Audit Preparation", "Compliance Checks", "Cash Management", "Loss Prevention", "TC Verification", "HMRC Returns"],
  training_development: ["New Staff Training", "Horizon Training", "Paystation Training", "Refresher Courses", "Mentoring", "Assessment"],
  management_strategy: ["Branch Management", "Multi-Site Operations", "Performance Improvement", "P&L Management", "Team Leadership", "KPI Tracking"],
  retail_commercial: ["Retail Setup", "EPOS Configuration", "Stock Management", "Merchandising", "Social Media Setup", "Local Marketing"],
  setup_transitions: ["New Branch Opening", "Refit Management", "TUPE", "PO Ltd Applications", "Equipment Setup", "IT Configuration"],
  advisory_consulting: ["Business Planning", "Due Diligence", "Acquisition Support", "Ongoing Advisory", "Franchise Guidance", "Exit Strategy"],
};

export const TRAVEL_RADIUS_OPTIONS = [
  { value: 5, label: "5 miles" },
  { value: 10, label: "10 miles" },
  { value: 25, label: "25 miles" },
  { value: 50, label: "50 miles" },
  { value: 999, label: "Nationwide" },
];

export const DURATION_TYPES = [
  { value: "single_day", label: "Single Day" },
  { value: "one_week", label: "1 Week" },
  { value: "two_weeks", label: "2 Weeks" },
  { value: "one_month", label: "1 Month" },
  { value: "ongoing", label: "Ongoing" },
];

export const LOOKING_FOR_OPTIONS = [
  { value: "full_time", label: "Full-time" },
  { value: "part_time", label: "Part-time" },
  { value: "temporary", label: "Temporary" },
  { value: "any", label: "Any" },
];

export const UK_REGIONS = [
  { id: "north_west", name: "North West", postcodes: ["M", "L", "PR", "BL", "WN", "OL", "SK", "WA", "CH", "CW"] },
  { id: "north_east", name: "North East", postcodes: ["NE", "SR", "DH", "DL", "TS"] },
  { id: "yorkshire", name: "Yorkshire & Humber", postcodes: ["LS", "BD", "HG", "YO", "HU", "DN", "S", "WF", "HD", "HX"] },
  { id: "west_midlands", name: "West Midlands", postcodes: ["B", "CV", "WS", "WV", "DY", "ST"] },
  { id: "east_midlands", name: "East Midlands", postcodes: ["NG", "DE", "LE", "NN", "PE"] },
  { id: "east", name: "East of England", postcodes: ["CB", "CO", "IP", "NR", "CM", "SS", "SG", "AL", "EN"] },
  { id: "london", name: "London", postcodes: ["E", "EC", "N", "NW", "SE", "SW", "W", "WC"] },
  { id: "south_east", name: "South East", postcodes: ["RG", "OX", "MK", "HP", "SL", "GU", "KT", "TW", "CR", "BR", "DA", "ME", "CT", "TN", "BN", "PO", "SO", "RH"] },
  { id: "south_west", name: "South West", postcodes: ["BS", "BA", "GL", "SN", "BH", "DT", "SP", "EX", "TQ", "PL", "TA", "TR"] },
  { id: "wales", name: "Wales", postcodes: ["CF", "SA", "NP", "LL", "SY", "LD"] },
  { id: "scotland", name: "Scotland", postcodes: ["EH", "G", "AB", "DD", "PH", "IV", "KY", "FK", "ML", "PA", "KA", "DG"] },
  { id: "northern_ireland", name: "Northern Ireland", postcodes: ["BT"] },
];
